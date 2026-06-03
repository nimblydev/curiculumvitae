import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  signal,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import * as THREE from 'three';

type Dir = { x: number; z: number };
interface Cell { x: number; z: number; }

const GRID = 20;
const CELL = 1;
const TICK_MS = 140;

@Component({
  selector: 'app-snake',
  imports: [RouterLink],
  templateUrl: './snake.html',
  styleUrl: './snake.scss',
})
export class SnakeComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  readonly score = signal(0);
  readonly best = signal(+(localStorage.getItem('snake-best') ?? '0'));
  readonly state = signal<'idle' | 'playing' | 'over'>('idle');

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animId = 0;
  private tickTimer = 0;

  private snake: Cell[] = [];
  private dir: Dir = { x: 1, z: 0 };
  private nextDir: Dir = { x: 1, z: 0 };
  private food: Cell = { x: 0, z: 0 };

  private snakeMeshes: THREE.Mesh[] = [];
  private foodMesh!: THREE.Mesh;
  private gridMesh!: THREE.Mesh;

  private readonly SNAKE_MAT = new THREE.MeshStandardMaterial({ color: 0xc8832a, roughness: 0.3, metalness: 0.7 });
  private readonly HEAD_MAT = new THREE.MeshStandardMaterial({ color: 0xd4a855, roughness: 0.2, metalness: 0.8 });
  private readonly FOOD_MAT = new THREE.MeshStandardMaterial({ color: 0xff4444, roughness: 0.4, metalness: 0.3, emissive: 0x440000 });

  ngOnInit(): void {
    this.initThree();
    this.addGrid();
    this.animate();
    this.listenKeys();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animId);
    document.removeEventListener('keydown', this.onKey);
    this.renderer.dispose();
  }

  start(): void {
    this.score.set(0);
    this.state.set('playing');
    this.snake = [
      { x: 3, z: GRID / 2 },
      { x: 2, z: GRID / 2 },
      { x: 1, z: GRID / 2 },
    ];
    this.dir = { x: 1, z: 0 };
    this.nextDir = { x: 1, z: 0 };
    this.spawnFood();
    this.syncMeshes();
  }

  restart(): void { this.start(); }

  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a0f07);
    this.scene.fog = new THREE.Fog(0x1a0f07, 30, 60);

    const w = canvas.clientWidth || 600;
    const h = canvas.clientHeight || 500;
    this.renderer.setSize(w, h, false);

    this.camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    this.camera.position.set(GRID / 2, 22, GRID / 2 + 18);
    this.camera.lookAt(GRID / 2, 0, GRID / 2);

    const ambient = new THREE.AmbientLight(0x8b6914, 0.6);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffd580, 1.2);
    sun.position.set(10, 20, 10);
    sun.castShadow = true;
    this.scene.add(sun);

    const fill = new THREE.PointLight(0xc8832a, 0.8, 30);
    fill.position.set(GRID / 2, 5, GRID / 2);
    this.scene.add(fill);

    this.foodMesh = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 8), this.FOOD_MAT);
    this.foodMesh.castShadow = true;
    this.foodMesh.visible = false;
    this.scene.add(this.foodMesh);

    new ResizeObserver(() => this.onResize()).observe(canvas.parentElement!);
  }

  private addGrid(): void {
    const geo = new THREE.PlaneGeometry(GRID, GRID, GRID, GRID);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x2b1a0a,
      roughness: 0.9,
      wireframe: false,
    });
    this.gridMesh = new THREE.Mesh(geo, mat);
    this.gridMesh.rotation.x = -Math.PI / 2;
    this.gridMesh.position.set(GRID / 2 - 0.5, -0.5, GRID / 2 - 0.5);
    this.gridMesh.receiveShadow = true;
    this.scene.add(this.gridMesh);

    const lineGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(GRID, GRID, GRID, GRID));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x5c3d1e, opacity: 0.4, transparent: true });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    lines.rotation.x = -Math.PI / 2;
    lines.position.set(GRID / 2 - 0.5, -0.49, GRID / 2 - 0.5);
    this.scene.add(lines);
  }

  private syncMeshes(): void {
    this.snakeMeshes.forEach(m => this.scene.remove(m));
    this.snakeMeshes = [];

    const geo = new THREE.BoxGeometry(0.85, 0.85, 0.85);
    this.snake.forEach((cell, i) => {
      const mat = i === 0 ? this.HEAD_MAT : this.SNAKE_MAT;
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.position.set(cell.x, 0, cell.z);
      this.scene.add(mesh);
      this.snakeMeshes.push(mesh);
    });

    this.foodMesh.position.set(this.food.x, 0, this.food.z);
    this.foodMesh.visible = this.state() === 'playing';
  }

  private tick(): void {
    if (this.state() !== 'playing') return;
    this.dir = { ...this.nextDir };

    const head = this.snake[0];
    const next: Cell = { x: head.x + this.dir.x, z: head.z + this.dir.z };

    if (next.x < 0 || next.x >= GRID || next.z < 0 || next.z >= GRID) {
      this.gameOver(); return;
    }
    if (this.snake.some(c => c.x === next.x && c.z === next.z)) {
      this.gameOver(); return;
    }

    const ate = next.x === this.food.x && next.z === this.food.z;
    this.snake.unshift(next);
    if (!ate) this.snake.pop();
    else {
      this.score.update(s => s + 10);
      this.spawnFood();
    }

    this.syncMeshes();
  }

  private spawnFood(): void {
    let cell: Cell;
    do {
      cell = { x: Math.floor(Math.random() * GRID), z: Math.floor(Math.random() * GRID) };
    } while (this.snake.some(c => c.x === cell.x && c.z === cell.z));
    this.food = cell;
  }

  private gameOver(): void {
    this.state.set('over');
    this.foodMesh.visible = false;
    const sc = this.score();
    if (sc > this.best()) {
      this.best.set(sc);
      localStorage.setItem('snake-best', String(sc));
    }
  }

  private lastTick = 0;
  private animate = (ts = 0): void => {
    this.animId = requestAnimationFrame(this.animate);

    if (this.state() === 'playing' && ts - this.lastTick > TICK_MS) {
      this.lastTick = ts;
      this.tick();
    }

    this.foodMesh.rotation.y += 0.04;
    this.renderer.render(this.scene, this.camera);
  };

  private onKey = (e: KeyboardEvent): void => {
    if (this.state() === 'idle') { this.start(); return; }
    if (this.state() === 'over') { this.restart(); return; }
    const map: Record<string, Dir> = {
      ArrowUp:    { x: 0, z: -1 },
      ArrowDown:  { x: 0, z: 1 },
      ArrowLeft:  { x: -1, z: 0 },
      ArrowRight: { x: 1, z: 0 },
      w: { x: 0, z: -1 }, s: { x: 0, z: 1 },
      a: { x: -1, z: 0 }, d: { x: 1, z: 0 },
    };
    const d = map[e.key];
    if (d && !(d.x === -this.dir.x && d.z === -this.dir.z)) {
      this.nextDir = d;
    }
  };

  private listenKeys(): void {
    document.addEventListener('keydown', this.onKey);
  }

  private onResize(): void {
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w && h) {
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
  }

  onSwipe(dir: string): void {
    const map: Record<string, Dir> = {
      up: { x: 0, z: -1 }, down: { x: 0, z: 1 },
      left: { x: -1, z: 0 }, right: { x: 1, z: 0 },
    };
    if (this.state() === 'idle') { this.start(); return; }
    if (this.state() === 'over') { this.restart(); return; }
    const d = map[dir];
    if (d && !(d.x === -this.dir.x && d.z === -this.dir.z)) this.nextDir = d;
  }
}

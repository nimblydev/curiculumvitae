import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./sections/portfolio/portfolio').then(m => m.PortfolioComponent),
  },
  {
    path: 'games',
    children: [
      {
        path: 'snake',
        loadComponent: () =>
          import('./games/snake/snake').then(m => m.SnakeComponent),
      },
      { path: '', redirectTo: 'snake', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];

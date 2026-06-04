# Changelog — CV en ligne de Yoann Aubry

Historique des ajouts et corrections du portfolio interactif.

---

## [0.6.1] — 2026-06-04

### Ajouté
- Skill `/handoff` installée globalement (`~/.claude/skills/handoff/`) — génère un résumé structuré de session (contexte, réalisations, décisions techniques, problèmes, prochaines étapes) et l'écrit dans `.claude/handoffs/`.
- Répertoire `.claude/handoffs/` versionné dans le dépôt pour conserver l'historique des sessions.

### Corrigé
- `.claude/settings.local.json` ajouté au `.gitignore` — ce fichier contient des permissions et chemins spécifiques à la machine, il ne doit pas être partagé.

---

## [0.6.0] — 2026-06-04

### Ajouté
- **Fond métal cuivre steampunk** — plaques 88×88 px avec rainures, rivets aux intersections et striation diagonale brossée. Dégradé cuivre oxydé en base. Constitue la couche parallax la plus lointaine (×0.12/×0.10), renforçant la sensation de profondeur.

### Modifié
- **Parallax amplifié** — amplitude globale ×1.75 : rotation cylindre 4°→7° / 1.5°→2.8°, déplacement max 24→52 px / 10→22 px. Multiplicateurs CSS : couche front ×1.6→×2.8, mid ×0.9→×1.5, sections ×0.5→×0.75.

### Corrigé
- Export PDF : suppression du `page-break-before: always` sur `#skills` qui provoquait un saut de page brutal entre deux sections.

---

## [0.5.0] — 2026-06-04

### Ajouté
- **Écran LCD steampunk de suivi facial** — panneau fixe bas-droite avec flux caméra en phosphore vert, scanlines, vignette et crochets de ciblage. Affiche les barres de position X/Y en temps réel.
- **Détection de visage + yeux via face-api.js** — TinyFaceDetector (~190 KB) + FaceLandmark68TinyNet (~76 KB) chargés en lazy depuis les assets locaux. Fonctionne dans tous les navigateurs (Chrome, Firefox, Safari) sans flag expérimental.
- **Croix `+` sur les yeux** — 68 landmarks faciaux dont 6 points par œil ; centre de chaque pupille calculé et affiché avec cercle de ciblage + croix en phosphore vert.
- **Parallax piloté par le visage** — quand le flux est actif, la position du visage remplace la souris pour piloter l'effet cylindrique steampunk. Retour automatique à la souris à l'arrêt.
- Modèles IA embarqués dans `public/face-api-models/` (~280 KB total) — aucune dépendance CDN externe.

### Corrigé
- Violation `requestAnimationFrame` 192 ms — boucle canvas démarrée via `setTimeout(0)` hors du cycle d'`effect()` Angular.
- `FaceDetector` natif (Shape Detection API) retiré — nécessitait un flag Chrome expérimental, inaccessible par défaut.
- 404 sur les modèles : répertoire `src/assets/` remplacé par `public/` (Angular 17+ assets), URL construite via `document.baseURI` pour compatibilité GitHub Pages.

---

## [0.4.0] — 2026-06-04

### Ajouté
- **Effet cylindrique steampunk** — la page se courbe en cylindre horizontal piloté par la souris (`perspective` + `rotateY/X` avec lerp).
- **Parallax multicouche** — le nom, l'avatar, le pitch et les titres de sections flottent à des vitesses différentes (`--para-x`, `--para-y`).
- **Cursor steampunk** — engrenage cuivré rotatif qui remplace le curseur système en thème steampunk. Accélère au survol, pulse au clic.

### Corrigé
- `clip-path: ellipse` sur les bords du portfolio pour renforcer l'illusion de courbure.
- Correction de l'effet trop prononcé en bas de page (`--cyl-origin-y` calé sur le scroll).
- Erreur Angular NG0203 — `effect()` déplacé dans le constructeur de `CylinderEffectService`.

---

## [0.3.0] — 2026-06-04

### Ajouté
- **Export PDF** — modal d'aperçu avec rendu propre (thème light forcé, masquage des éléments interactifs, CSS print dédié).

---

## [0.2.0] — 2026-06-04

### Ajouté
- **Thème steampunk** — palette cuivre/sépia, polices, décors.
- **Sélecteur de thème** — trois modes : Clair / Sombre / Steampunk, persisté en `localStorage`.
- **Easter eggs** — code Konami active le thème steampunk, clic répété sur l'avatar déclenche une animation.

### Corrigé
- `base-href` auto-calculé depuis le nom du dépôt GitHub pour le déploiement GitHub Pages.
- Erreurs de chargement de chunks sur GitHub Pages (lazy routes).

---

## [0.1.0] — 2026-06-04

### Ajouté
- **Scaffold Angular 22** — architecture zoneless, signals, standalone components.
- **Sections CV** : Hero, Expérience, Compétences, Formation, Intérêts, Portfolio.
- **Jeu Snake** — route lazy `/games/snake`.
- **Déploiement GitHub Pages** — workflow CI/CD automatisé.

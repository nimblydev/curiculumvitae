# Changelog — CV en ligne de Yoann Aubry

Historique des ajouts et corrections du portfolio interactif.

---

## [Unreleased] — 2026-06-04

### Ajouté
- **Parallax face tracking (Shape Detection API)**
  Suivi du visage via la caméra frontale (`FaceDetector`, natif Chrome/Edge, sans librairie).
  Quand actif, la position du visage pilote l'effet cylindrique à la place de la souris.
  Bouton monocle steampunk fixé en bas à droite — états : idle / requesting / actif (preview vidéo circulaire avec réticule) / refusé.
  Fallback automatique sur le suivi souris si le tracking est coupé.
  Invisible sur Firefox/Safari (`FaceDetector` non disponible).

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

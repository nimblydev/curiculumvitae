import type { CvData } from './cv.types';

export const CV_DATA: CvData = {
  name: 'Yoann Aubry',
  title: 'Lead Tech Fullstack',
  subtitle: 'Référent Agile & Architecte de Solutions · 15+ ans',
  pitch: `Développeur Fullstack depuis 2003, j'interviens en Lead Tech pour architecturer et faire évoluer des applications web à fort enjeu technique. Angular et l'écosystème Node.js (Bun, Hono) sont mes terrains de jeu quotidiens ; le DDD et l'Agile, ma culture. J'allie expertise technique, vision architecturale et accompagnement d'équipes — de l'idéation au code en production.`,
  contact: {
    phone: '06 89 84 14 13',
    email: 'yo.aubry@gmail.com',
    location: 'Fontaine (38)',
    linkedin: 'https://www.linkedin.com/in/y-aubry/',
  },
  experiences: [
    {
      id: 'uness',
      role: 'Lead Tech · Proxy PO & Scrum Master',
      company: 'GIP UNESS',
      period: '2023 – 2025',
      location: 'Gières',
      highlights: [
        'Architecture microservices et APIs scalables pour une plateforme utilisée par 15 000 étudiants (haute disponibilité)',
        'Garant de la qualité technique : Clean Code, CI/CD, ADR, documentation Swagger/OpenAPI',
        'Transition Agile : mise en place des rituels Scrum, 60+ sprints, Event Storming, Story Mapping',
        'Proxy PO : idéation → backlog pour le nouveau dispositif d\'entraînement étudiants',
        'Pilotage d\'une équipe de 5 développeurs, coordination métier ↔ tech',
      ],
      tags: ['Angular', 'Node.js', 'Microservices', 'Scrum', 'DDD', 'API REST', 'CI/CD', 'BDD'],
    },
    {
      id: 'objectif-pi',
      role: 'Lead Dev Full Stack JS / Python',
      company: 'Objectif Pi',
      period: '2022 – 2023',
      location: 'Gières',
      highlights: [
        'Développements et portages sur OpenProd / Odoo',
        'Migration vers OWL (Odoo 16) et Python 3.8',
      ],
      tags: ['Node.js', 'Python', 'Odoo', 'OWL'],
    },
    {
      id: 'vecteur',
      role: 'Lead Dev Full Stack NodeJS',
      company: 'Coopérative Vecteur Activités',
      period: '2015 – 2022',
      location: 'Grenoble',
      highlights: [
        'Application mobile PWA pour gestion d\'arrêts de site SEVESO (criticité haute)',
        'APIs NodeJS, backoffices Polymer / lit.js, configurateurs 3D',
        'TMA et développements e-commerce (WooCommerce, Magento)',
        'Gestion de l\'infrastructure',
      ],
      tags: ['Node.js', 'PWA', 'Three.js', 'Polymer', 'lit.js', 'Magento'],
    },
    {
      id: 'web-engineer',
      role: 'Ingénieur d\'études & Développement Web',
      company: 'AdThink · Smile · Hardis · Cervocom',
      period: '2006 – 2014',
      location: 'Grenoble',
      highlights: [
        'PHP/Symfony, Drupal, Magento, ASP.NET MVC3, ExtJS',
        'Missions grands comptes : Carrefour.com, BPI France, Snowleader',
        'R&D librairie PHP5 pour adserver (AdThink Media)',
      ],
      tags: ['PHP', 'Symfony', 'Drupal', 'Magento', '.NET', 'ExtJS'],
    },
    {
      id: 'netimpulse',
      role: 'Développeur indépendant PHP5 / Ruby on Rails',
      company: 'Netimpulse',
      period: '2003 – 2006',
      location: 'Grenoble',
      highlights: [
        'Conception et développement d\'applications web : Drupal, Dotclear, RoR, Magento',
        'Intégration graphique et conseil en référencement',
      ],
      tags: ['PHP', 'Ruby on Rails', 'Drupal'],
    },
  ],
  skillGroups: [
    {
      category: 'Frontend',
      icon: '◈',
      skills: ['Angular 22', 'TypeScript', 'Signals', 'Three.js', 'lit.js', 'SCSS', 'PWA'],
    },
    {
      category: 'Backend',
      icon: '⚙',
      skills: ['Node.js', 'Bun', 'Hono', 'Python', 'API REST', 'GraphQL', 'SQL'],
    },
    {
      category: 'Architecture',
      icon: '◉',
      skills: ['DDD', 'Microservices', 'ADR', 'Event Storming', 'Swagger/OpenAPI'],
    },
    {
      category: 'Agile & DevOps',
      icon: '↻',
      skills: ['Scrum Master', 'Product Ownership', 'CI/CD', 'Git', 'Docker', 'Jira'],
    },
    {
      category: 'Qualité',
      icon: '✓',
      skills: ['Clean Code', 'BDD/Gherkin', 'Story Mapping', 'Code Review', 'TDD'],
    },
  ],
  education: [
    {
      degree: 'Licence SIL – Systèmes Informatiques & Logiciels',
      institution: 'Université de Grenoble',
      year: '2006',
      location: 'Grenoble',
    },
    {
      degree: 'DUT Informatique Industrielle',
      institution: 'IUT de Grenoble',
      year: '2001',
      location: 'Grenoble',
    },
    {
      degree: 'DEUG STAPS · Bac S',
      institution: '',
      year: '',
    },
  ],
  interests: [
    {
      label: 'Canyoning',
      icon: '🏔',
      description: 'Cadre – CAF Grenoble Oisans. Gestion de groupe en milieu hostile, sécurité, prise de décision.',
      easterId: 'canyoning',
    },
    {
      label: 'Escalade & Ski de rando',
      icon: '⛷',
      description: 'Sports de montagne, été comme hiver.',
    },
    {
      label: 'Jeux de société & JDR',
      icon: '🎲',
      description: 'Passionné de jeux de plateau et jeux de rôle.',
      easterId: 'jdr',
    },
  ],
};

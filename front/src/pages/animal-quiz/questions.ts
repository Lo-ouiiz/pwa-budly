import type { Trait } from '@/lib/interfaces';

interface Answer {
  label: string;
  trait: Trait;
}

export interface Question {
  text: string;
  answers: Answer[];
}

export const QUESTIONS: Question[] = [
  {
    text: 'En général, tu préfères…',
    answers: [
      { label: 'Être seul avec toi-même', trait: 'Solitaire' },
      { label: 'Être entouré', trait: 'Sociable' },
      { label: 'Aller vers les autres facilement', trait: 'Amical' },
      { label: 'Garder ton indépendance', trait: 'Indépendant' },
    ],
  },
  {
    text: 'Ton énergie au quotidien ressemble plutôt à…',
    answers: [
      { label: 'Très dynamique', trait: 'Energique' },
      { label: 'Calme et posée', trait: 'Calme' },
      { label: 'Plutôt lente', trait: 'Paresseux' },
      { label: 'Souvent fatiguée', trait: 'Endormi' },
    ],
  },
  {
    text: 'Face à quelque chose de nouveau…',
    answers: [
      { label: 'Tu explores avec enthousiasme', trait: 'Curieux' },
      { label: 'Tu observes à distance', trait: 'Méfiant' },
      { label: 'Tu fonces sans hésiter', trait: 'Audacieux' },
      { label: 'Tu prends ton temps', trait: 'Timide' },
    ],
  },
  {
    text: 'Avec les personnes que tu aimes…',
    answers: [
      { label: 'Tu es très démonstratif', trait: 'Affectueux' },
      { label: 'Tu protèges beaucoup', trait: 'Protecteur' },
      { label: 'Tu montres peu mais sincèrement', trait: 'Sensible' },
      { label: "Tu préfères garder de l'espace", trait: 'Indépendant' },
    ],
  },
  {
    text: "Quand tu joues ou t'amuses…",
    answers: [
      { label: 'Tu fais souvent rire', trait: 'Drôle' },
      { label: "Tu t'impliques à fond", trait: 'Joueur' },
      { label: 'Tu restes en retrait', trait: 'Timide' },
      { label: 'Tu prends ça à la légère', trait: 'Joyeux' },
    ],
  },
  {
    text: 'Ton rapport à ton territoire / tes affaires…',
    answers: [
      { label: "Tu n'aimes pas qu'on y touche", trait: 'Territorial' },
      { label: 'Tu partages volontiers', trait: 'Amical' },
      { label: "Tu t'en fiches un peu", trait: 'Paresseux' },
      { label: 'Tu fais attention à tout', trait: 'Protecteur' },
    ],
  },
  {
    text: 'Quand quelque chose ne va pas…',
    answers: [
      { label: 'Tu te renfermes', trait: 'Solitaire' },
      { label: "Tu t'énerves vite", trait: 'Colérique' },
      { label: 'Tu restes calme', trait: 'Calme' },
      { label: 'Tu râles un peu', trait: 'Grognon' },
    ],
  },
  {
    text: 'Les autres te perçoivent souvent comme…',
    answers: [
      { label: 'Impressionnant', trait: 'Majestueux' },
      { label: 'Charismatique', trait: 'Charmant' },
      { label: 'Fier de toi', trait: 'Fier' },
      { label: 'Un peu mystérieux', trait: 'Mystérieux' },
    ],
  },
  {
    text: 'En groupe…',
    answers: [
      { label: 'Tu prends naturellement ta place', trait: 'Sociable' },
      { label: 'Tu observes plus que tu ne parles', trait: 'Mystérieux' },
      { label: 'Tu fais avancer les choses', trait: 'Audacieux' },
      { label: 'Tu préfères rester discret', trait: 'Solitaire' },
    ],
  },
  {
    text: 'Quand tu réussis quelque chose…',
    answers: [
      { label: 'Tu es très fier', trait: 'Fier' },
      { label: "Tu aimes qu'on le remarque", trait: 'Arrogant' },
      { label: 'Tu restes simple', trait: 'Calme' },
      { label: 'Tu partages ta joie', trait: 'Joyeux' },
    ],
  },
  {
    text: 'Ton tempérament général…',
    answers: [
      { label: 'Doux et attentif', trait: 'Affectueux' },
      { label: 'Changeant', trait: 'Sensible' },
      { label: 'Stable', trait: 'Calme' },
      { label: 'Lunatique', trait: 'Colérique' },
    ],
  },
  {
    text: 'Ton style naturel…',
    answers: [
      { label: 'Digne et posé', trait: 'Majestueux' },
      { label: 'Séduisant sans effort', trait: 'Charmant' },
      { label: 'Un peu bougon', trait: 'Grognon' },
      { label: 'Confiant voire sûr de toi', trait: 'Arrogant' },
    ],
  },
  {
    text: 'Si tu étais un animal observé par des visiteurs…',
    answers: [
      { label: 'Tu ferais le spectacle', trait: 'Joueur' },
      { label: 'Tu dormirais', trait: 'Endormi' },
      { label: 'Tu resterais imposant', trait: 'Majestueux' },
      { label: 'Tu observerais les humains', trait: 'Curieux' },
    ],
  },
];

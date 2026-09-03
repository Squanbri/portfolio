export const site = {
  name: 'Евгений Маркитан',
  claim: 'От интерфейса до базы данных',
  subclaim:
    'Шесть лет коммерческой разработки. Умею и написать экран, и спроектировать то, что под ним.',
  /** Фиксированная формулировка стажа для подписей и meta — не округление из дат. */
  experienceLabel: 'шесть лет',
  city: 'Тверь',
  timeZone: 'Europe/Moscow',
  email: 'squanbri@gmail.com',
  telegram: 'https://t.me/squanbri',
  telegramLabel: '@squanbri',
  github: 'https://github.com/Squanbri',
  githubLabel: 'Squanbri',
  resume:
    'https://drive.google.com/file/d/1F5ZR29hv6FT0j-TfnhzliNH7Cbo4E9Da/view?usp=sharing',
};

export type Job = {
  company: string;
  role: string;
  from: string;
  to: string;
  period: string;
  /** Одна строка: что изменилось, а не что входило в обязанности. */
  result: string;
};

export const jobs: Job[] = [
  {
    company: 'JetRockets',
    role: 'Мобильная и веб-разработка',
    from: '2023-10',
    to: '2026-06',
    period: 'октябрь 2023 — июнь 2026',
    result:
      'Вывел два продукта на React Native в App Store и Google Play и закрыл ручную сборку пайплайном — релиз перестал быть операцией на полдня. Там же писал нативные модули на Swift и Kotlin: Dynamic Island, live-виджеты, фоновые задачи.',
  },
  {
    company: 'АБМ',
    role: 'Интерфейсы видеоаналитики',
    from: '2022-07',
    to: '2023-10',
    period: 'июль 2022 — октябрь 2023',
    result:
      'Интерфейс видеоаналитики: разметка зон поверх живого потока с камер, HLS в браузере, сотни коротких параллельных запросов через RxJS. Основная работа была в том, чтобы это выдерживало длинную смену без утечек подписок и лишних ре-рендеров.',
  },
  {
    company: 'Lazur Media',
    role: 'Разработка целиком',
    from: '2020-10',
    to: '2022-07',
    period: 'октябрь 2020 — июль 2022',
    result:
      'Закрывал задачи от таблиц в базе до интерфейса: API на Laravel и Rails, фоновая обработка, клиент на Vue и React.',
  },
];

export function updatedAt() {
  const now = new Date();
  const month = new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    timeZone: site.timeZone,
  }).format(now);
  return `${month} ${now.getFullYear()}`;
}

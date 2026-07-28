export const site = {
  name: 'Евгений Маркитан',
  role: 'Frontend-разработчик',
  email: 'evgeniy-markitan@yandex.ru',
  phone: '+7 961 014-07-15',
  phoneHref: 'tel:+79610140715',
  location: 'Тверь',
  seeking: 'Активно ищу работу · Россия, Тверь, Москва · удалённо / гибрид',
  experienceYears: '5 лет и 10 месяцев',
  links: {
    telegram: 'https://t.me/squanbri',
    telegramLabel: '@squanbri',
  },
};

export const about = {
  title: 'Обо мне',
  text: 'Frontend-разработчик с опытом 5+ лет. Основной стек — React и TypeScript. Есть опыт разработки веб- и мобильных приложений, full-stack разработки, CI/CD и работы в англоязычной команде.',
  facts: [
    { label: 'Локация', value: 'Тверь' },
    { label: 'Опыт', value: '5 лет и 10 месяцев' },
    { label: 'Формат', value: 'Удалённо, гибрид' },
    { label: 'Языки', value: 'Русский, English (B1)' },
  ],
  education:
    'ГБПОУ «Тверской колледж им. А.Н. Коняева» — Информационные системы и программирование, 2022',
};

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  duration: string;
  highlights: string[];
};

export const experience: ExperienceItem[] = [
  {
    company: 'JetRockets',
    role: 'Frontend-разработчик',
    period: 'Октябрь 2024 — Июнь 2026',
    duration: '1 год и 9 месяцев',
    highlights: [
      'Разрабатывал мобильные приложения на React Native с полным циклом — от разработки до публикации в App Store/Google Play и сопровождения',
      'Участвовал в миграции крупного legacy SPA-проекта на Turbo Rails',
      'Работал в англоязычной команде с разработчиками, менеджерами и клиентами',
      'Настраивал CI/CD пайплайны для сборки и автоматической публикации мобильных приложений в сторы',
      'Разрабатывал нативные модули на Swift/Kotlin для React Native (Dynamic Island, live-виджеты, background-задачи)',
    ],
  },
  {
    company: 'АБМ',
    role: 'Frontend-разработчик',
    period: 'Июль 2022 — Октябрь 2023',
    duration: '1 год и 4 месяца',
    highlights: [
      'Реализовал интерактивный интерфейс для выделения секций на видеопотоке камеры и назначения задач анализа по выбранным зонам',
      'Спроектировал реактивные потоки данных на RxJS для обработки большого количества параллельных коротких запросов к backend',
      'Реализовал воспроизведение и обработку видеопотоков по протоколу HLS в браузере',
      'Оптимизировал работу с большими объёмами данных на frontend, минимизировав лишние ре-рендеры и утечки подписок (RxJS)',
    ],
  },
  {
    company: 'Лазурь Медиа',
    role: 'Fullstack-разработчик',
    period: 'Октябрь 2019 — Июль 2022',
    duration: '2 года и 10 месяцев',
    highlights: [
      'Проектировал и разрабатывал REST API на Laravel и Ruby on Rails для веб- и мобильных клиентов',
      'Самостоятельно закрывал полный цикл разработки фич — от backend и API до интерфейса на Vue и React',
      'Реализовал асинхронную обработку задач и фоновые процессы на backend',
      'Реализовал типизированные клиенты для внешних API с централизованной обработкой ошибок',
    ],
  },
];

export const techGroups = [
  {
    title: 'Frontend',
    items: [
      'HTML5',
      'CSS3',
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Redux',
      'MobX',
      'Angular',
      'NgRx',
      'RxJS',
    ],
  },
  {
    title: 'Mobile',
    items: ['React Native', 'Ionic', 'Capacitor'],
  },
  {
    title: 'Backend и инструменты',
    items: ['Node.js', 'Git', 'Docker', 'Linux', 'CI/CD'],
  },
];

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  stack: string[];
  links: { label: string; href: string }[];
  screenshots: { src: string; alt: string }[];
  architectureNote: string;
};

export const projects: Project[] = [
  {
    slug: 'letter-box',
    title: 'Letter Box',
    summary:
      'Self-hosted почтовый клиент для macOS с фоновой синхронизацией и локальной AI-классификацией писем.',
    description:
      'Объединяет несколько почтовых аккаунтов, синхронизирует письма через IMAP и обрабатывает их локальной моделью без передачи данных внешним AI-сервисам.',
    stack: [
      'Electron',
      'React',
      'NestJS',
      'PostgreSQL',
      'Redis',
      'BullMQ',
      'Socket.IO',
      'Ollama',
      'Docker',
    ],
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/Squanbri/letter-box',
      },
    ],
    screenshots: [
      { src: '/images/placeholder-1.svg', alt: 'Главный экран Letter Box' },
      { src: '/images/placeholder-2.svg', alt: 'Просмотр письма в Letter Box' },
      { src: '/images/placeholder-3.svg', alt: 'Статистика и AI-теги Letter Box' },
    ],
    architectureNote:
      'Сервер продолжает синхронизировать и обрабатывать письма, даже когда desktop-приложение закрыто.',
  },
  {
    slug: 'project-one',
    title: 'Проект One',
    summary: 'Короткое описание первого проекта. Что делает и зачем.',
    description:
      'Подробное описание проекта. Цели, аудитория, ключевые решения и результат. Текст заполнится позже.',
    stack: ['TypeScript', 'React', 'Node.js'],
    links: [],
    screenshots: [
      { src: '/images/placeholder-1.svg', alt: 'Скриншот 1' },
      { src: '/images/placeholder-2.svg', alt: 'Скриншот 2' },
      { src: '/images/placeholder-3.svg', alt: 'Скриншот 3' },
    ],
    architectureNote:
      'Здесь будет схема архитектуры. Пока — заглушка: клиент → API → БД.',
  },
  {
    slug: 'project-two',
    title: 'Проект Two',
    summary: 'Короткое описание второго проекта. Чем интересен стек или идея.',
    description:
      'Подробное описание второго проекта. Текст заполнится позже.',
    stack: ['React Native', 'TypeScript', 'CI/CD'],
    links: [],
    screenshots: [
      { src: '/images/placeholder-2.svg', alt: 'Скриншот 1' },
      { src: '/images/placeholder-3.svg', alt: 'Скриншот 2' },
    ],
    architectureNote: 'Схема архитектуры появится позже.',
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

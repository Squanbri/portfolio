/** Put your photo at public/images/avatar.jpg and set photo to '/images/avatar.jpg' */
export const site = {
  name: 'Евгений Маркитан',
  role: 'Frontend-разработчик',
  photo: '/images/avatar.svg',
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

export type ProjectFeature = {
  title: string;
  text: string;
};

export type ArchitectureNode = {
  label: string;
  title: string;
};

export type ProjectArchitecture = {
  /** Built-in static diagram id */
  diagram?: 'letter-box';
  nodes?: ArchitectureNode[];
  targets?: string[];
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  paragraphs?: string[];
  decisions?: ProjectFeature[];
  eyebrow?: string;
  stack: string[];
  links: { label: string; href: string }[];
  screenshots: { src: string; alt: string }[];
  features?: ProjectFeature[];
  architecture?: ProjectArchitecture;
  architectureNote: string;
  cta?: {
    eyebrow: string;
    title: string;
    label: string;
  };
};

export const projects: Project[] = [
  {
    slug: 'letter-box',
    title: 'Letter Box',
    eyebrow: 'Personal project · Full-stack · macOS',
    summary:
      'Self-hosted почтовый клиент для macOS: несколько аккаунтов, фоновая синхронизация и локальные AI-теги без облачных LLM.',
    description:
      'Клиент-серверное приложение, в котором desktop на Electron общается с NestJS backend по REST и Socket.IO. Сервер — единственный владелец IMAP-соединений, credentials и данных.',
    paragraphs: [
      'Letter Box собирает Mail.ru, Яндекс и Gmail в одном интерфейсе. Письма синхронизируются по IMAP, хранятся в PostgreSQL, а непрочитанные опционально размечаются локальной моделью через Ollama — без отправки содержимого внешним AI-сервисам.',
      'Синхронизация и обработка живут на сервере: очередь BullMQ + Redis продолжает работать, даже когда desktop-приложение закрыто. Credentials шифруются на сервере, доступ — через JWT с ротацией refresh-токенов.',
      'В UI — единый inbox, вкладки аккаунтов, фильтры по AI-тегам, дашборд с непрочитанными, спамом и динамикой, а также отправка, ответ и пересылка через SMTP.',
    ],
    decisions: [
      {
        title: 'Сервер владеет почтой',
        text: 'IMAP/SMTP и хранение вынесены из Electron в NestJS. Клиент не держит долгие соединения и не хранит пароли приложений локально.',
      },
      {
        title: 'Очередь вместо «синк в UI»',
        text: 'Фоновый worker обновляет папки и запускает AI-разметку независимо от жизни окна приложения.',
      },
      {
        title: 'Локальный AI по желанию',
        text: 'Ollama подключается опционально. Если модели нет, клиент остаётся полноценным почтовым клиентом без тегов.',
      },
      {
        title: 'Общие контракты',
        text: 'DTO и события вынесены в пакет `@letter-box/contracts`, чтобы desktop и server говорили на одном языке.',
      },
    ],
    stack: [
      'TypeScript',
      'Electron',
      'React',
      'Vite',
      'Mantine',
      'TanStack Query',
      'NestJS',
      'Prisma',
      'PostgreSQL',
      'Redis',
      'BullMQ',
      'Socket.IO',
      'imapflow',
      'nodemailer',
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
      {
        src: '/images/letter-box/01-overview.png',
        alt: 'Обзор: аккаунты, непрочитанные, активность и AI-теги',
      },
      {
        src: '/images/letter-box/02-overview-bottom.png',
        alt: 'Обзор: AI-теги по категориям, спам и сводка Ollama',
      },
      {
        src: '/images/letter-box/03-inbox.png',
        alt: 'Входящие с фильтрами по AI-тегам и просмотром письма',
      },
      {
        src: '/images/letter-box/04-inbox-email.png',
        alt: 'Входящие: просмотр письма с вложением',
      },
      {
        src: '/images/letter-box/05-compose.png',
        alt: 'Создание нового письма',
      },
      {
        src: '/images/letter-box/06-important.png',
        alt: 'Важные письма по всем аккаунтам',
      },
      {
        src: '/images/letter-box/07-overview-light.png',
        alt: 'Обзор в светлой теме',
      },
    ],
    features: [
      {
        title: 'Несколько аккаунтов',
        text: 'Mail.ru, Яндекс и Gmail в одном окне: вкладки, единый inbox и фильтры по непрочитанным и AI-тегам.',
      },
      {
        title: 'Фоновая синхронизация',
        text: 'BullMQ + Redis обновляют папки на сервере, даже если desktop закрыт.',
      },
      {
        title: 'Полный почтовый цикл',
        text: 'Получение по IMAP, отправка/ответ/пересылка по SMTP, флаги, архив, перемещение и удаление.',
      },
      {
        title: 'Локальный AI',
        text: 'Ollama размечает непрочитанные письма локально — без облачных AI API.',
      },
      {
        title: 'Дашборд',
        text: 'Непрочитанные, важные, активность по дням, распределение по аккаунтам и тегам.',
      },
      {
        title: 'Self-hosted',
        text: 'PostgreSQL, Redis и worker поднимаются через Docker; данные остаются у вас.',
      },
    ],
    architecture: {
      diagram: 'letter-box',
    },
    architectureNote:
      'Electron + React ходит в NestJS по REST и Socket.IO. API пишет в PostgreSQL и ставит задачи в Redis/BullMQ; worker синхронизирует почту по IMAP/SMTP и при необходимости вызывает Ollama.',
    cta: {
      eyebrow: 'Open source',
      title: 'Исходный код на GitHub',
      label: 'Открыть репозиторий',
    },
  },
  {
    slug: 'screen-translator',
    title: 'Screen Translator',
    eyebrow: 'Personal project · Desktop · macOS',
    summary:
      'Фоновый переводчик экрана для macOS: хоткей, OCR поверх любого приложения, перевод слова или фразы и личный словарь.',
    description:
      'Клиент-серверное приложение, которое по глобальному хоткею снимает экран, распознаёт текст и превращает найденные слова в интерактивный overlay.',
    paragraphs: [
      'Screen Translator помогает читать интерфейсы, документацию и статьи на английском, не переключаясь между окнами. После нажатия Cmd+Shift+X приложение делает снимок основного дисплея и показывает поверх него распознанные слова.',
      'Можно нажать на отдельное слово или выделить область с фразой. Electron-клиент отправляет изображение в FastAPI: Tesseract возвращает текст вместе с координатами, а Argos Translate переводит его офлайн — без внешнего translation API.',
      'Перевод можно скопировать или сохранить в личный словарь. Сервер разворачивается через Docker Compose, а macOS-клиент собирается в DMG с адресом API, заданным во время сборки.',
    ],
    decisions: [
      {
        title: 'Overlay вместо отдельного окна',
        text: 'Распознанный текст остаётся на месте: координаты OCR превращаются в кликабельные области прямо поверх снимка экрана.',
      },
      {
        title: 'Фоновое macOS-приложение',
        text: 'Electron скрывается в menu bar, ждёт глобальный хоткей и не занимает место в Dock.',
      },
      {
        title: 'Офлайн-перевод',
        text: 'Argos Translate работает на собственном сервере, поэтому текст не отправляется во внешние сервисы перевода.',
      },
      {
        title: 'Изолированный renderer',
        text: 'Renderer получает только типизированный IPC API через preload; захват экрана и сетевые запросы остаются в main process.',
      },
    ],
    stack: [
      'TypeScript',
      'Electron',
      'React',
      'electron-vite',
      'FastAPI',
      'Python',
      'Tesseract OCR',
      'Argos Translate',
      'SQLite',
      'Docker',
    ],
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/Squanbri/screen-translator',
      },
    ],
    screenshots: [
      {
        src: '/images/screen-translator/01-overlay.svg',
        alt: 'Overlay с распознанными словами и переводом',
      },
      {
        src: '/images/screen-translator/02-selection.svg',
        alt: 'Выделение фразы на экране',
      },
      {
        src: '/images/screen-translator/03-dictionary.svg',
        alt: 'Личный словарь сохранённых слов',
      },
    ],
    features: [
      {
        title: 'Глобальный хоткей',
        text: 'Cmd+Shift+X запускает перевод поверх текущего приложения.',
      },
      {
        title: 'OCR с координатами',
        text: 'Tesseract группирует текст по абзацам, строкам и словам и возвращает bounding boxes.',
      },
      {
        title: 'Слово или фраза',
        text: 'Клик переводит одно слово, а drag-selection собирает несколько слов в фразу.',
      },
      {
        title: 'Быстрые действия',
        text: 'Перевод можно скопировать или сразу добавить в личный словарь.',
      },
      {
        title: 'Фоновая работа',
        text: 'Приложение живёт в menu bar и открывает overlay только по запросу.',
      },
      {
        title: 'Self-hosted API',
        text: 'FastAPI-сервер с OCR, переводом и словарём поднимается одной командой через Docker Compose.',
      },
    ],
    architecture: {
      nodes: [
        { label: 'macOS', title: 'Electron + React' },
        { label: 'REST', title: 'FastAPI' },
        { label: 'Recognition', title: 'Tesseract OCR' },
        { label: 'Translation', title: 'Argos Translate' },
      ],
      targets: ['SQLite dictionary', 'Docker Compose', 'DMG build'],
    },
    architectureNote:
      'Electron захватывает основной дисплей и передаёт изображение в FastAPI. Tesseract возвращает слова и координаты, React строит интерактивный overlay, а выбранный текст переводится через Argos Translate. Сохранённые пары слов хранятся в SQLite.',
    cta: {
      eyebrow: 'Open source',
      title: 'Исходный код на GitHub',
      label: 'Открыть репозиторий',
    },
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

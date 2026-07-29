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
  diagram?: 'letter-box' | 'screen-translator';
  nodes?: ArchitectureNode[];
  targets?: string[];
};

export type ProjectKind = 'personal' | 'product';

export const projectKindLabel: Record<ProjectKind, string> = {
  personal: 'Pet',
  product: 'Продукт',
};

export type Project = {
  slug: string;
  kind: ProjectKind;
  title: string;
  summary: string;
  description: string;
  paragraphs?: string[];
  /** What I built / owned — especially useful for product work */
  contributions?: ProjectFeature[];
  decisions?: ProjectFeature[];
  eyebrow?: string;
  stack: string[];
  links: { label: string; href: string }[];
  screenshots: { src: string; alt: string }[];
  features?: ProjectFeature[];
  architecture?: ProjectArchitecture;
  architectureNote?: string;
  cta?: {
    eyebrow: string;
    title: string;
    label: string;
  };
};

export const projects: Project[] = [
  {
    slug: 'safari-portal',
    kind: 'product',
    title: 'Safari Portal',
    eyebrow: 'JetRockets · SaaS · Travel',
    summary:
      'Платформа для travel-агентов и туроператоров: интерактивные itinerary, Lookbook, guest portal и мобильное приложение для путешественников.',
    description:
      'B2B2C SaaS для DMCs, travel advisors и tour operators: создание предложений и детальных маршрутов, CRM/pipeline, формы, контент-библиотека и branded traveler app.',
    paragraphs: [
      'Safari Portal помогает агентам быстро собирать красивые digital/PDF-предложения и полноценные itinerary вместо таблиц и разрозненных документов. Клиенты получают guest portal и white-label мобильное приложение с доступом к поездке даже офлайн.',
      'Продукт развивается командой JetRockets вместе с клиентом из США: веб-платформа, мобильные клиенты и инфраструктура поставки в сторы.',
    ],
    contributions: [
      {
        title: 'React Native приложение',
        text: 'Разработка traveler app с полным циклом — от фич до публикации и сопровождения в App Store / Google Play.',
      },
      {
        title: 'Нативные модули',
        text: 'Swift/Kotlin-модули для React Native: Dynamic Island, live-виджеты и background-задачи.',
      },
      {
        title: 'CI/CD мобильных сборок',
        text: 'Пайплайны сборки и автоматической публикации приложений в сторы.',
      },
      {
        title: 'Миграция web SPA',
        text: 'Участие в миграции крупного legacy SPA на Turbo Rails.',
      },
    ],
    stack: [
      'React Native',
      'TypeScript',
      'React',
      'Redux',
      'Ruby on Rails',
      'Turbo Rails',
      'PostgreSQL',
      'Swift',
      'Kotlin',
      'CI/CD',
      'AWS',
      'Docker',
    ],
    links: [
      {
        label: 'Сайт',
        href: 'https://www.safariportal.app/',
      },
      {
        label: 'Кейс JetRockets',
        href: 'https://jetrockets.com/portfolio/safariportal',
      },
    ],
    screenshots: [
      {
        src: '/images/safari-portal/01-home.jpg',
        alt: 'Главная Safari Portal: модули Task Manager, Content Library, Itineraries, Forms, Invoicing',
      },
    ],
    cta: {
      eyebrow: 'Product',
      title: 'Открыть Safari Portal',
      label: 'Сайт продукта',
    },
  },
  {
    slug: 'leaderboard-golf',
    kind: 'product',
    title: 'Leaderboard Golf',
    eyebrow: 'JetRockets · Mobile · Golf',
    summary:
      'Мобильное приложение для гольфа: live-скоринг, турниры, ставки, статистика и постинг в Handicap Index® через USGA.',
    description:
      'Кроссплатформенное golf-приложение для игроков и групп: создание матчей, live leaderboard, side games, GPS и социальный фид вокруг раундов.',
    paragraphs: [
      'Leaderboard — цифровой «дом» для игры: хостинг турниров до 100 игроков, live scoring и skins, side games (Match Play, Nassau, Wolf и др.), GPS и постинг раундов в Handicap Index® через интеграцию с USGA®.',
      'Продукт развивается с командой JetRockets: React Native клиент, backend на Ruby on Rails, realtime-обновления счета и публикация в App Store / Google Play.',
    ],
    contributions: [
      {
        title: 'React Native клиент',
        text: 'Разработка и развитие мобильного приложения — скоринг, турниры, группы и публикация в сторы.',
      },
      {
        title: 'Нативные возможности',
        text: 'Swift/Kotlin-модули для React Native: Dynamic Island, live-виджеты и background-задачи.',
      },
      {
        title: 'CI/CD в сторы',
        text: 'Пайплайны сборки и автоматической публикации iOS/Android-релизов.',
      },
      {
        title: 'Англоязычная команда',
        text: 'Работа с продуктовой командой и клиентом из США: фичи, фидбек и релизы.',
      },
    ],
    stack: [
      'React Native',
      'TypeScript',
      'JavaScript',
      'Ruby on Rails',
      'Ruby',
      'Swift',
      'Kotlin',
      'CI/CD',
      'App Store',
      'Google Play',
    ],
    links: [
      {
        label: 'Сайт',
        href: 'https://www.leaderboardgolf.co/',
      },
      {
        label: 'Кейс JetRockets',
        href: 'https://jetrockets.com/portfolio/leaderboard',
      },
    ],
    screenshots: [
      {
        src: '/images/leaderboard-golf/01-home.jpg',
        alt: 'Главная Leaderboard: hero с app mockups и Callaway Challenge',
      },
    ],
    cta: {
      eyebrow: 'Product',
      title: 'Открыть Leaderboard Golf',
      label: 'Сайт продукта',
    },
  },
  {
    slug: 'navigator-career',
    kind: 'product',
    title: 'Навигатор карьеры',
    eyebrow: 'Сахалин · HRTech · Web',
    summary:
      'Региональная платформа для поиска работы, обучения и карьерного развития на Сахалине — для специалистов, студентов, школьников и компаний.',
    description:
      'Веб-портал АРЧК Сахалинской области: вакансии, анкеты, карьерные консультации, курсы, тестирование и личные кабинеты соискателей и работодателей.',
    paragraphs: [
      'Навигатор карьеры помогает жителям региона найти работу, пройти консультацию, построить карьерный план и пройти обучение. Для компаний — подбор специалистов, размещение вакансий, стажировок и корпоративных курсов.',
      'Фронтенд на Next.js: отдельные сценарии для специалиста, студента и школьника, кабинет работодателя, поиск и контентные разделы. Данные и медиа отдаёт API back.navigator-career.ru.',
    ],
    contributions: [
      {
        title: 'Frontend на Next.js',
        text: 'Интерфейсы портала: главная, кабинеты, поиск, разделы для соискателей и компаний.',
      },
      {
        title: 'Сценарии аудиторий',
        text: 'Разные пользовательские потоки — специалист, студент, школьник — и B2B-страница для работодателей.',
      },
      {
        title: 'Интеграция с API',
        text: 'Клиентская работа с backend API: вакансии, анкеты, курсы и контент.',
      },
    ],
    stack: [
      'Next.js',
      'React',
      'TypeScript',
      'JavaScript',
      'REST API',
    ],
    links: [
      {
        label: 'Сайт',
        href: 'https://navigator-career.ru/',
      },
    ],
    screenshots: [
      {
        src: '/images/navigator-career/01-home.jpg',
        alt: 'Главная: поиск работы и обучение на Сахалине',
      },
      {
        src: '/images/navigator-career/02-tools.jpg',
        alt: 'Инструменты: консультации, тесты и карьерный план',
      },
      {
        src: '/images/navigator-career/03-resumes.jpg',
        alt: 'Поиск анкет соискателей с фильтрами',
      },
      {
        src: '/images/navigator-career/04-courses.jpg',
        alt: 'Каталог курсов с фильтрами по сфере и формату',
      },
    ],
    cta: {
      eyebrow: 'Product',
      title: 'Открыть Навигатор карьеры',
      label: 'Сайт продукта',
    },
  },
  {
    slug: 'letter-box',
    kind: 'personal',
    title: 'Letter Box',
    eyebrow: 'Full-stack · macOS',
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
    kind: 'personal',
    title: 'Screen Translator',
    eyebrow: 'Desktop · macOS',
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
        src: '/images/screen-translator/01-recognizing.png',
        alt: 'OCR: сканирование экрана и распознавание текста',
      },
      {
        src: '/images/screen-translator/02-overlay.png',
        alt: 'Overlay с распознанными словами и bounding boxes',
      },
      {
        src: '/images/screen-translator/03-word.png',
        alt: 'Перевод отдельного слова поверх экрана',
      },
      {
        src: '/images/screen-translator/04-phrase.png',
        alt: 'Выделение и перевод фразы',
      },
      {
        src: '/images/screen-translator/05-dictionary.png',
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
      diagram: 'screen-translator',
    },
    architectureNote:
      'Electron tray по хоткею снимает экран и открывает Overlay. Overlay шлёт image в FastAPI: Tesseract распознаёт текст с координатами, Argos Translate переводит офлайн, а сохранённые слова пишутся в SQLite. Overlay общается с Electron через IPC.',
    cta: {
      eyebrow: 'Open source',
      title: 'Исходный код на GitHub',
      label: 'Открыть репозиторий',
    },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

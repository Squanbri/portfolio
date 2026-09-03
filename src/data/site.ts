export const site = {
  name: 'Евгений Маркитан',
  claim: 'Собираю продукты целиком',
  subclaim:
    'Интерфейс, API, фоновая обработка, хранение данных — довожу до работающего приложения сам, без передачи по цепочке.',
  city: 'Тверь',
  timeZone: 'Europe/Moscow',
  email: 'evgeniy-markitan@yandex.ru',
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
      'Перевёл работу с камерами на потоки RxJS: сотни коротких параллельных запросов перестали ронять интерфейс, а разметка зон на живом видео стала выдерживать длинные смены без утечек подписок.',
  },
  {
    company: 'Lazur Media',
    role: 'Разработка целиком',
    from: '2020-10',
    to: '2022-07',
    period: 'октябрь 2020 — июль 2022',
    result:
      'Закрывал фичи от таблиц в базе до экрана: API на Laravel и Rails, фоновые задачи, интерфейсы на Vue и React. Здесь и появилась привычка не останавливаться на границе клиента.',
  },
];

function monthsBetween(from: string, to: string) {
  const [fy, fm] = from.split('-').map(Number);
  const [ty, tm] = to.split('-').map(Number);
  return (ty - fy) * 12 + (tm - fm);
}

function plural(n: number, forms: [string, string, string]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

/** Суммарный стаж считается из дат работы, чтобы не протухал в тексте. */
export function totalExperience() {
  const starts = jobs.map((j) => j.from).sort();
  const ends = jobs.map((j) => j.to).sort();
  const months = monthsBetween(starts[0], ends[ends.length - 1]);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const yearsText = `${years} ${plural(years, ['год', 'года', 'лет'])}`;
  if (!rest) return yearsText;
  return `${yearsText} ${rest} ${plural(rest, ['месяц', 'месяца', 'месяцев'])}`;
}

export function updatedAt() {
  const now = new Date();
  const month = new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    timeZone: site.timeZone,
  }).format(now);
  return `${month} ${now.getFullYear()}`;
}

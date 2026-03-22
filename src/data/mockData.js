// RadioTube — маркетплейс коллабораций
// Механики подогрева интереса:
// 1. Обратный отсчёт ответа (таймер на карточке)
// 2. Прогноз аудитории: «Примет / Не примет» (голосование-ставка)
// 3. Milestone-разблокировки (50→обсуждение, 200→уведомление, 500→топ, 1000→вирусный)
// 4. Ранние сторонники (первые 20 получают бейдж)
// 5. Волна: скорость голосов/час (momentum)
// 6. Share-трекинг (ты привёл N человек)
// 7. Публичный response rate

export const people = [
  {
    id: 'a1', name: 'Алексей Навигатор',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    bio: 'Предприниматель, основатель 3 стартапов.',
    topics: ['Бизнес', 'Стартапы', 'Инвестиции'],
    followers: 12400, rating: 4.8,
    openForCollab: true,
    collabRequest: 'Ищу собеседника для разговора о том, что маркетинг переоценён',
    responseRate: 85,
    proposalsReceived: 8,
  },
  {
    id: 'a2', name: 'Марина Дизайн',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marina',
    bio: 'UX/UI дизайнер, 10 лет в индустрии.',
    topics: ['Дизайн', 'UX', 'Фриланс'],
    followers: 8700, rating: 4.9,
    openForCollab: true,
    collabRequest: 'Хочу обсудить, правда ли дизайн важнее маркетинга',
    responseRate: 100,
    proposalsReceived: 6,
  },
  {
    id: 'a3', name: 'Дмитрий Кодер',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dmitry',
    bio: 'Fullstack-разработчик, критикую стартап-культуру.',
    topics: ['Программирование', 'IT', 'Карьера в IT'],
    followers: 15200, rating: 4.7,
    openForCollab: true,
    collabRequest: 'Жду предпринимателя, который расскажет в чём ценность стартапов',
    responseRate: 92,
    proposalsReceived: 4,
  },
  {
    id: 'a4', name: 'Елена Финансы',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena',
    bio: 'Финансовый консультант, скептик крипто-рынка.',
    topics: ['Финансы', 'Инвестиции', 'Крипто'],
    followers: 9800, rating: 4.6,
    openForCollab: true,
    collabRequest: 'Ищу сторонника крипты для совместного эфира',
    responseRate: 78,
    proposalsReceived: 9,
  },
  {
    id: 'a5', name: 'Кирилл Маркетинг',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kirill',
    bio: 'Growth-маркетолог, ex-Яндекс.',
    topics: ['Маркетинг', 'Growth', 'Продукт'],
    followers: 6300, rating: 4.5,
    openForCollab: true,
    collabRequest: 'Предлагаю обсудить: маркетинг — наука или интуиция?',
    responseRate: 60,
    proposalsReceived: 5,
  },
  {
    id: 'a6', name: 'Ольга Психология',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=olga',
    bio: 'Психолог, коуч. Интересует пересечение психологии и бизнеса.',
    topics: ['Психология', 'Саморазвитие'],
    followers: 11500, rating: 4.9,
    openForCollab: false,
    collabRequest: '',
    responseRate: 33,
    proposalsReceived: 12,
  },
];

export const authors = people;

// Milestones — при каком кол-ве голосов что разблокируется
// Платформа не гарантирует эфир — она подначивает участников через внимание аудитории
export const milestones = [
  { votes: 50, label: 'Открывается обсуждение', icon: '💬' },
  { votes: 200, label: 'Уведомление участнику', icon: '📩' },
  { votes: 500, label: 'Попадает в топ', icon: '🔥' },
  { votes: 1000, label: 'Вирусный запрос', icon: '🚀' },
];

export const collabRequests = [
  {
    id: 'c1',
    title: 'Стартапы: ценность или хайп?',
    description: 'Алексей утверждает, что предприниматели создают будущее. Дмитрий считает, что стартап-культура токсична. Кто прав?',
    backstory: 'Спор начался после поста Алексея о "токсичных стартаперах". Дмитрий ответил разгромным видео. 3 месяца взаимных уколов.',
    backstoryLinks: [
      { title: 'Пост Алексея, с которого всё началось', url: 'https://youtube.com/watch?v=example1' },
      { title: 'Ответ Дмитрия', url: 'https://youtube.com/watch?v=example2' },
    ],
    person1: people[0],
    person2: people[2],
    roles: [
      { type: 'organizer', name: 'Иван М.', reward: 2500 },
    ],
    status: 'proposed',
    votes: 234,
    funded: 12500,
    goal: 25000,
    paidVotes: 89,
    waiting: 412,
    earlySupporters: 20,
    earlySupportersClaimed: 20,
    topics: ['Бизнес', 'IT', 'Стартапы'],
    proposedBy: 'audience',
    proposedDate: '2026-03-18T14:00:00',
    responseDeadline: '2026-03-25T14:00:00',
    scheduledDate: null,
    comments: 18,
    predictions: { accept: 156, decline: 78 },
    velocityPerHour: 12,
    sponsor: null,
    referralBonus: 50,
    discussion: [
      { date: '2026-03-18', who: people[0], text: 'С удовольствием. Дмитрий, принимаешь?' },
      { date: '2026-03-19', who: people[2], text: 'Дай мне пару дней — хочу подготовить данные.' },
    ],
    totalShares: 89,
    resultLink: null,
  },
  {
    id: 'c2',
    title: 'Дизайн vs маркетинг: что важнее для продукта?',
    description: 'Марина и Кирилл — два специалиста с противоположными позициями. Аудитория решит, кто убедительнее.',
    backstory: 'Марина написала статью "Маркетинг убивает продукт". Кирилл ответил тредом из 40 твитов. Интернет разделился.',
    backstoryLinks: [
      { title: 'Статья Марины', url: 'https://youtube.com/watch?v=example3' },
    ],
    person1: people[1],
    person2: people[4],
    roles: [],
    status: 'accepted',
    votes: 478,
    funded: 8300,
    goal: 15000,
    paidVotes: 52,
    waiting: 621,
    earlySupporters: 20,
    earlySupportersClaimed: 20,
    topics: ['Дизайн', 'Маркетинг', 'Продукт'],
    proposedBy: 'a2',
    proposedDate: '2026-03-12T10:00:00',
    responseDeadline: '2026-03-19T10:00:00',
    scheduledDate: null,
    comments: 43,
    predictions: { accept: 312, decline: 45 },
    velocityPerHour: 8,
    sponsor: { name: 'Skillbox', logo: '🎓' },
    referralBonus: 30,
    discussion: [
      { date: '2026-03-12', who: people[1], text: 'Кирилл, давай обсудим в прямом эфире?' },
      { date: '2026-03-13', who: people[4], text: 'Принято! Давай определим дату.' },
      { date: '2026-03-14', who: people[1], text: 'Предлагаю следующую среду.' },
    ],
    totalShares: 145,
    resultLink: null,
  },
  {
    id: 'c3',
    title: 'Финансовая грамотность для IT-специалистов',
    description: 'Елена и Дмитрий разберут финансовые вопросы, с которыми сталкиваются разработчики.',
    backstory: 'Тема родилась из опроса в Telegram — 89% разработчиков признались, что не разбираются в инвестициях.',
    backstoryLinks: [],
    person1: people[3],
    person2: people[2],
    roles: [
      { type: 'organizer', name: 'Слава В.', reward: 3000 },
      { type: 'referee', name: 'Максим К.', reward: 1500 },
    ],
    status: 'confirmed',
    votes: 812,
    funded: 25000,
    goal: 25000,
    paidVotes: 156,
    waiting: 1340,
    earlySupporters: 20,
    earlySupportersClaimed: 20,
    topics: ['Финансы', 'IT', 'Инвестиции'],
    proposedBy: 'mutual',
    proposedDate: '2026-03-05T12:00:00',
    responseDeadline: null,
    scheduledDate: '2026-03-28T19:00:00',
    comments: 67,
    predictions: { accept: 420, decline: 12 },
    velocityPerHour: 3,
    sponsor: { name: 'Тинькофф', logo: '🏦' },
    referralBonus: 40,
    discussion: [
      { date: '2026-03-05', who: people[3], text: 'Дмитрий, давай сделаем совместный эфир?' },
      { date: '2026-03-05', who: people[2], text: 'Тема важная, я за.' },
      { date: '2026-03-07', who: people[3], text: '28 марта в 19:00 — подходит?' },
      { date: '2026-03-07', who: people[2], text: 'Подтверждаю!' },
    ],
    totalShares: 312,
    resultLink: null,
  },
  {
    id: 'c4',
    title: 'Психология предпринимательства',
    description: 'Аудитория предложила коллаб Ольги и Алексея. Ольга отказала — 1203 человека ждут пересмотра.',
    backstory: 'Алексей в подкасте заявил: "Психологи не понимают бизнес". Ольга ответила в сторис: "Бизнесмены не понимают себя". Фанаты обоих требуют встречи.',
    backstoryLinks: [
      { title: 'Подкаст Алексея (момент на 14:32)', url: 'https://youtube.com/watch?v=example4' },
      { title: 'Ответ Ольги в сторис', url: 'https://youtube.com/watch?v=example5' },
    ],
    person1: people[5],
    person2: people[0],
    roles: [
      { type: 'recruiter', name: 'Юра Г.', reward: 5000 },
    ],
    status: 'declined',
    votes: 892,
    funded: 18000,
    goal: 20000,
    paidVotes: 347,
    waiting: 1203,
    earlySupporters: 20,
    earlySupportersClaimed: 20,
    topics: ['Психология', 'Бизнес', 'Саморазвитие'],
    proposedBy: 'audience',
    proposedDate: '2026-03-14T09:00:00',
    responseDeadline: '2026-03-21T09:00:00',
    scheduledDate: null,
    comments: 234,
    predictions: { accept: 234, decline: 658 },
    velocityPerHour: 24,
    sponsor: null,
    referralBonus: 75,
    discussion: [
      { date: '2026-03-15', who: people[0], text: 'Ольга, интересная идея. Я готов.' },
      { date: '2026-03-20', who: people[5], text: 'Спасибо, но сейчас не готова к этому формату.' },
      { date: '2026-03-20', who: people[0], text: 'Жаль. Если передумаете — предложение в силе.' },
    ],
    totalShares: 478,
    resultLink: null,
  },
  {
    id: 'c5',
    title: 'Крипторынок: перспективы или иллюзии?',
    description: 'Елена ищет собеседника из мира крипты. Пока никто не откликнулся — может быть, вы?',
    backstory: 'Елена неделю назад опубликовала разбор: "Почему 95% крипто-проектов — скам". Крипто-комьюнити бурлит.',
    backstoryLinks: [
      { title: 'Разбор Елены', url: 'https://youtube.com/watch?v=example6' },
    ],
    person1: people[3],
    person2: null,
    roles: [],
    status: 'open',
    votes: 567,
    funded: 9200,
    goal: 15000,
    paidVotes: 203,
    waiting: 891,
    earlySupporters: 20,
    earlySupportersClaimed: 18,
    topics: ['Крипто', 'Финансы'],
    proposedBy: 'a4',
    proposedDate: '2026-03-17T16:00:00',
    responseDeadline: null,
    scheduledDate: null,
    comments: 89,
    predictions: { accept: 0, decline: 0 },
    velocityPerHour: 15,
    sponsor: null,
    referralBonus: 60,
    discussion: [
      { date: '2026-03-17', who: people[3], text: 'Ищу сторонника крипты для открытой дискуссии.' },
    ],
    totalShares: 201,
    resultLink: null,
  },
  {
    id: 'c6',
    title: 'Маркетинг: наука или интуиция?',
    description: 'Кирилл ищет оппонента. 567 человек ждут эфира.',
    backstory: 'Кирилл бросил вызов всем, кто считает маркетинг "не наукой". Пока никто не принял.',
    backstoryLinks: [],
    person1: people[4],
    person2: null,
    roles: [],
    status: 'proposed',
    votes: 145,
    funded: 6700,
    goal: 12000,
    paidVotes: 78,
    waiting: 567,
    earlySupporters: 20,
    earlySupportersClaimed: 11,
    topics: ['Маркетинг', 'Продукт', 'Growth'],
    proposedBy: 'a5',
    proposedDate: '2026-03-19T11:00:00',
    responseDeadline: '2026-03-26T11:00:00',
    scheduledDate: null,
    comments: 34,
    predictions: { accept: 67, decline: 23 },
    velocityPerHour: 5,
    sponsor: null,
    referralBonus: 35,
    discussion: [
      { date: '2026-03-19', who: people[4], text: 'Ищу того, кто считает маркетинг — не наукой.' },
    ],
    totalShares: 56,
    resultLink: null,
  },
];

export const topicSuggestions = [
  { id: 't1', name: 'Бизнес', count: 245, emoji: '💼' },
  { id: 't2', name: 'IT', count: 198, emoji: '💻' },
  { id: 't3', name: 'Финансы', count: 134, emoji: '💰' },
  { id: 't4', name: 'Дизайн', count: 167, emoji: '🎨' },
  { id: 't5', name: 'Маркетинг', count: 145, emoji: '📈' },
  { id: 't6', name: 'Психология', count: 189, emoji: '🧠' },
  { id: 't7', name: 'Крипто', count: 98, emoji: '🪙' },
  { id: 't8', name: 'Карьера', count: 221, emoji: '🚀' },
];

export const dashboardStats = {
  totalEarnings: 156700,
  monthEarnings: 34500,
  totalFollowers: 12400,
  proposalsSent: 5,
  proposalsReceived: 8,
  responseRate: 85,
  topSupporters: [
    { name: 'Иван М.', total: 12500 },
    { name: 'Анна К.', total: 8700 },
    { name: 'Сергей П.', total: 6300 },
  ],
  recentEarnings: [
    { date: '22 мар', amount: 5600 },
    { date: '21 мар', amount: 3200 },
    { date: '20 мар', amount: 7800 },
    { date: '19 мар', amount: 4100 },
    { date: '18 мар', amount: 6500 },
    { date: '17 мар', amount: 2900 },
    { date: '16 мар', amount: 4400 },
  ],
};

// ---- Утилиты ----

// Интерес к коллабу (для сортировки)
export function calcEngagement(collab) {
  const v = collab.votes / 100;
  const f = (collab.funded / collab.goal) * 3;
  const c = collab.comments / 10;
  const w = (collab.waiting || 0) / 100;
  const vel = (collab.velocityPerHour || 0) / 5;
  const sh = (collab.totalShares || 0) / 50;
  const boost = collab.status === 'declined' ? 2.5 : collab.status === 'open' ? 1.3 : 1;
  return Math.round((v + f + c + w + vel + sh) * boost);
}

// Дней до дедлайна
export function daysUntilDeadline(collab) {
  if (!collab.responseDeadline) return null;
  const diff = new Date(collab.responseDeadline) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// Следующий milestone
export function nextMilestone(votes) {
  return milestones.find(m => votes < m.votes) || null;
}

// Прогресс до milestone в %
export function milestoneProgress(votes) {
  const next = nextMilestone(votes);
  if (!next) return 100;
  const prev = milestones[milestones.indexOf(next) - 1];
  const from = prev ? prev.votes : 0;
  return Math.round(((votes - from) / (next.votes - from)) * 100);
}

// Достигнутые milestones
export function achievedMilestones(votes) {
  return milestones.filter(m => votes >= m.votes);
}

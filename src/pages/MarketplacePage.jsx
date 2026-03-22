import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, TrendingUp, Clock, Flame, DollarSign, Users, Plus, X, SlidersHorizontal, ChevronDown, ArrowUpDown } from 'lucide-react';
import CollabCard from '../components/CollabCard';
import PersonCard from '../components/PersonCard';
import { collabRequests, people, topicSuggestions, calcEngagement } from '../data/mockData';

const statusFilters = [
  { key: 'all', label: 'Все' },
  { key: 'proposed', label: 'Ожидают ответа' },
  { key: 'open', label: 'Ищут участника' },
  { key: 'accepted', label: 'Подтверждённые' },
  { key: 'confirmed', label: 'Дата назначена' },
  { key: 'declined', label: 'Отклонённые' },
];

const sortOptions = [
  { key: 'engagement', label: 'Активность', icon: Flame },
  { key: 'velocity', label: 'Обороты', icon: TrendingUp },
  { key: 'recent', label: 'Новые', icon: Clock },
  { key: 'funding', label: 'Сборы', icon: DollarSign },
];

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('engagement');
  const [tab, setTab] = useState('collabs');
  const [showPropose, setShowPropose] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);

  // close filter panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilters(false);
    };
    if (showFilters) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showFilters]);

  const activeFilterCount = (statusFilter !== 'all' ? 1 : 0) + (sortBy !== 'engagement' ? 1 : 0);

  const filteredCollabs = useMemo(() => {
    let list = [...collabRequests];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) ||
        c.topics.some(t => t.toLowerCase().includes(q)) ||
        c.person1?.name.toLowerCase().includes(q) || c.person2?.name.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      if (statusFilter === 'accepted') list = list.filter(c => c.status === 'accepted' || c.status === 'confirmed');
      else list = list.filter(c => c.status === statusFilter);
    }
    switch (sortBy) {
      case 'velocity': list.sort((a, b) => b.velocityPerHour - a.velocityPerHour); break;
      case 'recent': list.sort((a, b) => new Date(b.proposedDate) - new Date(a.proposedDate)); break;
      case 'funding': list.sort((a, b) => (b.funded / b.goal) - (a.funded / a.goal)); break;
      default: list.sort((a, b) => calcEngagement(b) - calcEngagement(a));
    }
    return list;
  }, [search, statusFilter, sortBy]);

  const filteredPeople = useMemo(() => {
    if (!search) return people;
    const q = search.toLowerCase();
    return people.filter(p => p.name.toLowerCase().includes(q) || p.bio.toLowerCase().includes(q) || p.topics.some(t => t.toLowerCase().includes(q)));
  }, [search]);

  const clearFilters = () => { setStatusFilter('all'); setSortBy('engagement'); setSearch(''); };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Маркетплейс</h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-0.5">
            {collabRequests.filter(c => c.status !== 'declined').length} коллабов
            <span className="mx-1.5 text-white/20">·</span>
            {collabRequests.reduce((s, c) => s + (c.waiting || 0), 0).toLocaleString()} ждут эфиров
            <span className="mx-1.5 text-white/20">·</span>
            {collabRequests.reduce((s, c) => s + c.funded, 0).toLocaleString()}₽ собрано
          </p>
        </div>
        <button onClick={() => setShowPropose(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-cyan-600 to-cyan-500 text-white font-medium hover:opacity-90 transition-opacity whitespace-nowrap">
          <Plus className="w-5 h-5" /> Создать коллабу
        </button>
      </div>

      {/* Search + Filter bar — single compact row */}
      <div className="flex gap-2 items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--color-text-secondary)]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Коллаб, имя, тема..."
            className="w-full h-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 text-sm" />
        </div>

        {/* Tabs inline */}
        <div className="flex bg-[var(--color-surface)] rounded-xl border border-white/10 overflow-hidden">
          {[
            { key: 'collabs', label: 'Коллабы', icon: Flame },
            { key: 'people', label: 'Люди', icon: Users },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-all ${
                tab === t.key ? 'bg-white/10 text-white' : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5'
              }`}><t.icon className="w-4 h-4" /> <span className="hidden sm:inline">{t.label}</span></button>
          ))}
        </div>

        {/* Filter toggle */}
        {tab === 'collabs' && (
          <div className="relative" ref={filterRef}>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all h-full ${
                showFilters || activeFilterCount > 0
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                  : 'bg-[var(--color-surface)] border-white/10 text-[var(--color-text-secondary)] hover:text-white'
              }`}>
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Фильтры</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-white text-[10px] font-bold flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>

            {/* Filter dropdown panel */}
            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--color-surface)] border border-white/10 rounded-2xl p-4 space-y-4 z-40 shadow-2xl shadow-black/40">
                {/* Sort */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] font-medium mb-2">Сортировка</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {sortOptions.map(s => (
                      <button key={s.key} onClick={() => setSortBy(s.key)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          sortBy === s.key ? 'bg-cyan-500/15 text-cyan-300' : 'bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-white'
                        }`}><s.icon className="w-3.5 h-3.5" /> {s.label}</button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] font-medium mb-2">Статус</p>
                  <div className="flex flex-wrap gap-1.5">
                    {statusFilters.map(f => (
                      <button key={f.key} onClick={() => setStatusFilter(f.key)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          statusFilter === f.key ? 'bg-cyan-500/15 text-cyan-300' : 'bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-white'
                        }`}>{f.label}</button>
                    ))}
                  </div>
                </div>

                {/* Topics */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] font-medium mb-2">Темы</p>
                  <div className="flex flex-wrap gap-1.5">
                    {topicSuggestions.map(t => (
                      <button key={t.id} onClick={() => { setSearch(search === t.name ? '' : t.name); }}
                        className={`text-[11px] px-2.5 py-1 rounded-lg transition-all ${
                          search === t.name ? 'bg-cyan-500/15 text-cyan-300' : 'bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10'
                        }`}>{t.emoji} {t.name}</button>
                    ))}
                  </div>
                </div>

                {/* Reset */}
                {(activeFilterCount > 0 || search) && (
                  <button onClick={() => { clearFilters(); setShowFilters(false); }}
                    className="w-full py-2 rounded-lg bg-white/5 text-[var(--color-text-secondary)] text-xs font-medium hover:bg-white/10 hover:text-white transition-all">
                    Сбросить все фильтры
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active filter chips — shown below search when filters are applied */}
      {tab === 'collabs' && (activeFilterCount > 0 || search) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider">Активные:</span>
          {statusFilter !== 'all' && (
            <button onClick={() => setStatusFilter('all')}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-all">
              {statusFilters.find(f => f.key === statusFilter)?.label} <X className="w-3 h-3" />
            </button>
          )}
          {sortBy !== 'engagement' && (
            <button onClick={() => setSortBy('engagement')}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10 transition-all">
              <ArrowUpDown className="w-3 h-3" /> {sortOptions.find(s => s.key === sortBy)?.label} <X className="w-3 h-3" />
            </button>
          )}
          {search && (
            <button onClick={() => setSearch('')}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10 transition-all">
              «{search}» <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {tab === 'collabs' ? (
        <>
          {filteredCollabs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCollabs.map(c => <CollabCard key={c.id} collab={c} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-[var(--color-text-secondary)]">
              <p className="text-lg mb-2">Ничего не найдено</p>
              <p className="text-sm mb-4">Попробуйте другие фильтры или создайте свою коллабу</p>
              <button onClick={clearFilters} className="text-sm text-cyan-400 hover:text-cyan-300">Сбросить фильтры</button>
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPeople.map(p => <PersonCard key={p.id} person={p} />)}
        </div>
      )}

      {/* PROPOSE MODAL — любой с любым */}
      {showPropose && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowPropose(false)}>
          <div className="bg-[var(--color-bg)] border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Создать коллабу</h2>
              <button onClick={() => setShowPropose(false)} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Любой может предложить коллаб любых двух людей — даже незарегистрированных. Не обязательно быть автором.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-[var(--color-text-secondary)] block mb-1">Кто? (первый участник)</label>
                <input type="text" placeholder="Имя, никнейм или ссылка на профиль"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50" />
              </div>
              <div>
                <label className="text-xs text-[var(--color-text-secondary)] block mb-1">С кем? (второй участник)</label>
                <input type="text" placeholder="Имя, никнейм или ссылка на профиль"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50" />
              </div>
              <input type="text" placeholder="Тема коллаба"
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50" />
              <textarea placeholder="Почему это будет интересно? Предыстория, контекст..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 resize-none" />
              <div>
                <label className="text-xs text-[var(--color-text-secondary)] block mb-1">Ссылки на предысторию (YouTube, VK и т.д.)</label>
                <input type="text" placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[var(--color-text-secondary)] block mb-1">Срок ответа</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/10 text-white focus:outline-none focus:border-cyan-500/50">
                    <option value="3">3 дня</option>
                    <option value="5">5 дней</option>
                    <option value="7">7 дней</option>
                    <option value="14">14 дней</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--color-text-secondary)] block mb-1">Цель сбора (₽)</label>
                  <input type="number" placeholder="10000"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50" />
                </div>
              </div>
            </div>
            <button className="w-full py-3 rounded-xl bg-linear-to-r from-cyan-600 to-cyan-500 text-white font-medium hover:opacity-90 transition-opacity">
              Опубликовать
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

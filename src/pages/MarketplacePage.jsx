import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, TrendingUp, Clock, Flame, DollarSign, Users, Plus, X } from 'lucide-react';
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
  { key: 'engagement', label: 'По активности', icon: Flame },
  { key: 'velocity', label: 'Набирают обороты', icon: TrendingUp },
  { key: 'recent', label: 'Новые', icon: Clock },
  { key: 'funding', label: 'По сборам', icon: DollarSign },
];

const tabs = [
  { key: 'collabs', label: 'Коллаборации', icon: Flame },
  { key: 'people', label: 'Участники', icon: Users },
];

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('engagement');
  const [tab, setTab] = useState('collabs');
  const [showPropose, setShowPropose] = useState(false);

  const filteredCollabs = useMemo(() => {
    let list = [...collabRequests];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.topics.some(t => t.toLowerCase().includes(q)) ||
        c.person1?.name.toLowerCase().includes(q) ||
        c.person2?.name.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      if (statusFilter === 'accepted') {
        list = list.filter(c => c.status === 'accepted' || c.status === 'confirmed');
      } else {
        list = list.filter(c => c.status === statusFilter);
      }
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
    return people.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.bio.toLowerCase().includes(q) ||
      p.topics.some(t => t.toLowerCase().includes(q))
    );
  }, [search]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Маркетплейс</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">Предлагай, голосуй, поддерживай</p>
        </div>
        <button onClick={() => setShowPropose(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <Plus className="w-5 h-5" /> Предложить коллаб
        </button>
      </div>

      {/* Quick stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Активных коллабов', value: collabRequests.filter(c => c.status !== 'declined').length },
          { label: 'Ожидают ответа', value: collabRequests.filter(c => c.status === 'proposed').length, accent: true },
          { label: 'Общий сбор', value: collabRequests.reduce((s, c) => s + c.funded, 0).toLocaleString() + '₽' },
          { label: 'Всего голосов', value: collabRequests.reduce((s, c) => s + c.votes, 0).toLocaleString() },
        ].map(s => (
          <div key={s.label} className="bg-[var(--color-surface)] rounded-xl p-3 text-center border border-white/5">
            <p className={`text-xl font-bold ${s.accent ? 'text-[var(--color-accent)]' : 'text-white'}`}>{s.value}</p>
            <p className="text-[10px] text-[var(--color-text-secondary)]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Найти коллаб, тему или участника..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--color-surface)] rounded-xl p-1 w-fit border border-white/5">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? 'bg-purple-600 text-white' : 'text-[var(--color-text-secondary)] hover:text-white'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'collabs' ? (
        <>
          {/* Filters + Sort */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex gap-2 flex-wrap flex-1">
              {statusFilters.map(f => (
                <button key={f.key} onClick={() => setStatusFilter(f.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    statusFilter === f.key ? 'bg-purple-600 text-white' : 'bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10'
                  }`}
                >{f.label}</button>
              ))}
            </div>
            <div className="flex gap-2 shrink-0">
              {sortOptions.map(s => (
                <button key={s.key} onClick={() => setSortBy(s.key)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    sortBy === s.key ? 'bg-white/10 text-white' : 'text-[var(--color-text-secondary)] hover:text-white'
                  }`}
                >
                  <s.icon className="w-3 h-3" /> {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topics quick-filter */}
          <div className="flex gap-2 flex-wrap">
            {topicSuggestions.map(t => (
              <button key={t.id} onClick={() => setSearch(t.name)}
                className={`text-xs px-3 py-1 rounded-full transition-all ${
                  search === t.name ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10'
                }`}
              >{t.emoji} #{t.name}</button>
            ))}
          </div>

          {/* Collabs grid */}
          {filteredCollabs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCollabs.map(c => <CollabCard key={c.id} collab={c} />)}
            </div>
          ) : (
            <div className="text-center py-12 text-[var(--color-text-secondary)]">
              <p className="text-lg mb-2">Ничего не найдено</p>
              <p className="text-sm">Попробуйте другие фильтры или предложите свой коллаб</p>
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPeople.map(p => <PersonCard key={p.id} person={p} />)}
        </div>
      )}

      {/* Propose collab modal */}
      {showPropose && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowPropose(false)}>
          <div className="bg-[var(--color-bg)] border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Предложить коллаб</h2>
              <button onClick={() => setShowPropose(false)} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Кого приглашаете?"
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
              />
              <input type="text" placeholder="Тема коллаба"
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
              />
              <textarea placeholder="Описание — почему это будет интересно?"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 resize-none"
              />
              <div>
                <label className="text-xs text-[var(--color-text-secondary)] block mb-1">Срок ответа</label>
                <select className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/10 text-white focus:outline-none focus:border-purple-500/50">
                  <option value="3">3 дня</option>
                  <option value="5">5 дней</option>
                  <option value="7" selected>7 дней</option>
                  <option value="14">14 дней</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[var(--color-text-secondary)] block mb-1">Цель сбора (₽)</label>
                <input type="number" placeholder="10000"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>
            <button className="w-full py-3 rounded-xl bg-linear-to-r from-purple-600 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity">
              Опубликовать предложение
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

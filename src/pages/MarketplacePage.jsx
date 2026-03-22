import { useState } from 'react';
import { Search, Users, Hash, Handshake, X } from 'lucide-react';
import { people, collabRequests, topicSuggestions, calcEngagement } from '../data/mockData';
import CollabCard from '../components/CollabCard';
import PersonCard from '../components/PersonCard';

const tabs = [
  { id: 'collabs', label: 'Коллаборации', icon: Handshake },
  { id: 'people', label: 'Участники', icon: Users },
  { id: 'topics', label: 'Темы', icon: Hash },
];

const collabFilters = [
  { id: 'all', label: 'Все' },
  { id: 'proposed', label: 'Ожидают ответа' },
  { id: 'open', label: 'Открытые' },
  { id: 'accepted', label: 'Принятые' },
  { id: 'confirmed', label: 'Запланированные' },
  { id: 'declined', label: 'Отклонённые' },
];

const sortOptions = [
  { id: 'popular', label: 'По популярности' },
  { id: 'recent', label: 'По дате' },
  { id: 'funded', label: 'По сбору средств' },
];

export default function MarketplacePage() {
  const [tab, setTab] = useState('collabs');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('popular');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filteredCollabs = collabRequests
    .filter(c => {
      if (filter !== 'all' && c.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sort === 'popular') return calcEngagement(b) - calcEngagement(a);
      if (sort === 'funded') return (b.funded / b.goal) - (a.funded / a.goal);
      return new Date(b.proposedDate) - new Date(a.proposedDate);
    });

  const filteredPeople = people.filter(p => {
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.bio.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Маркетплейс</h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1">
            Коллаборации, участники, темы
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-linear-to-r from-purple-600 to-purple-500 text-white text-sm font-medium hover:opacity-90 w-fit"
        >
          + Предложить коллаб
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white/5 p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-white/10 text-white' : 'text-[var(--color-text-secondary)] hover:text-white'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Filters + sort for collabs */}
      {tab === 'collabs' && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="flex flex-wrap gap-1.5">
            {collabFilters.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === f.id
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'bg-white/5 text-[var(--color-text-secondary)] hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="ml-auto">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-[var(--color-text-secondary)] focus:outline-none"
            >
              {sortOptions.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Content */}
      {tab === 'collabs' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCollabs.map(c => (
            <CollabCard key={c.id} collab={c} />
          ))}
          {filteredCollabs.length === 0 && (
            <div className="col-span-full text-center py-12 text-[var(--color-text-secondary)]">
              Ничего не найдено
            </div>
          )}
        </div>
      )}

      {tab === 'people' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPeople.map(p => (
            <PersonCard key={p.id} person={p} />
          ))}
        </div>
      )}

      {tab === 'topics' && (
        <div claassName="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {topicSuggestions.map(t => (
            <button
              key={t.id}
              className="p-4 rounded-xl border border-white/10 bg-white/5 text-left transition-all hover:border-purple-500/30 hover:scale-[1.02]"
            >
              <div className="text-2xl mb-2">{t.emoji}</div>
              <div className="text-white font-bold">{t.name}</div>
              <div className="text-xs text-[var(--color-text-secondary)]">{t.count} коллабов</div>
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Предложить коллаборацию</h2>
              <button onClick={() => setShowModal(false)} className="text-[var(--color-text-secondary)] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[var(--color-text-secondary)] mb-1 block">С кем?</label>
                <select className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50">
                  <option value="">Выберите участника</option>
                  {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-[var(--color-text-secondary)] mb-1 block">Тема</label>
                <input
                  type="text"
                  placeholder="О чём будет коллаб?"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="text-sm text-[var(--color-text-secondary)] mb-1 block">Описание</label>
                <textarea
                  rows={3}
                  placeholder="Расскажите подробнее..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 resize-none"
                />
              </div>
              <div>
                <label className="text-sm text-[var(--color-text-secondary)] mb-1 block">Срок ответа</label>
                <select className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50">
                  <option value="3">3 дня</option>
                  <option value="7" selected>7 дней</option>
                  <option value="14">14 дней</option>
                </select>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  Подписчики увидят, если ответа не будет в срок
                </p>
              </div>
              <button className="w-full py-3 rounded-xl bg-linear-to-r from-purple-600 to-purple-500 text-white font-medium hover:opacity-90">
                Отправить предложение
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

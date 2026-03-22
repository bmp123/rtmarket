import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Users, Zap, Award } from 'lucide-react';
import { people, collabRequests, topicSuggestions, calcEngagement } from '../data/mockData';
import CollabCard from '../components/CollabCard';
import PersonCard from '../components/PersonCard';

export default function HomePage() {
  const sorted = [...collabRequests].sort((a, b) => calcEngagement(b) - calcEngagement(a));
  const trending = sorted.filter(c => c.velocityPerHour >= 8).slice(0, 3);
  const awaiting = collabRequests.filter(c => c.status === 'proposed');
  const openPeople = people.filter(p => p.openForCollab);

  // Сколько всего подписчиков на все коллабы
  const totalSubs = collabRequests.reduce((s, c) => s + (c.subscribers || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-14">
      {/* Hero */}
      <section className="text-center py-12 md:py-16">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
          Предложи <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[var(--color-accent)]">коллаборацию</span>
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-6">
          Голосуй, финансируй и следи за тем, как рождаются лучшие эфиры.
          Любой с любым — аудитория решает.
        </p>

        {/* Quick stats */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm">
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <Zap className="w-4 h-4 text-[var(--color-accent)]" />
            <span><b className="text-white">{collabRequests.length}</b> активных коллабов</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <Users className="w-4 h-4 text-purple-400" />
            <span><b className="text-white">{totalSubs.toLocaleString()}</b> подписчиков</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <Award className="w-4 h-4 text-green-400" />
            <span><b className="text-white">{collabRequests.reduce((s, c) => s + c.funded, 0).toLocaleString()}₽</b> собрано</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/marketplace"
            className="px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
          >
            Предложить коллаб
          </Link>
          <Link to="/marketplace"
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
          >
            Смотреть все
          </Link>
        </div>
      </section>

      {/* 🔥 Trending — fastest growing */}
      {trending.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-[var(--color-accent)]" />
            <h2 className="text-2xl font-bold text-white">Набирают обороты</h2>
            <span className="text-xs text-[var(--color-text-secondary)] bg-white/5 px-2 py-0.5 rounded-full">по скорости голосов</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trending.map(c => (
              <CollabCard key={c.id} collab={c} featured />
            ))}
          </div>
        </section>
      )}

      {/* ⏰ Awaiting response */}
      {awaiting.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Ожидают ответа</h2>
            <span className="text-xs text-yellow-300/60 bg-yellow-500/10 px-2 py-0.5 rounded-full">{awaiting.length}</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {awaiting.map(c => (
              <CollabCard key={c.id} collab={c} />
            ))}
          </div>
        </section>
      )}

      {/* Все коллабы по популярности */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Все коллабы</h2>
          <Link to="/marketplace" className="text-sm text-purple-400 hover:text-purple-300">Показать все →</Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.slice(0, 6).map(c => (
            <CollabCard key={c.id} collab={c} />
          ))}
        </div>
      </section>

      {/* Темы */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Темы</h2>
        <div className="flex flex-wrap gap-2">
          {topicSuggestions.map(t => (
            <button key={t.id}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-[var(--color-text-secondary)] hover:text-white hover:bg-white/10 transition-colors"
            >
              {t.emoji} {t.name} <span className="text-white/30 ml-1">{t.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Участники */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Ищут коллаборацию</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {openPeople.map(p => (
            <PersonCard key={p.id} person={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

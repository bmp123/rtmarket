import { Link } from 'react-router-dom';
import { TrendingUp, Zap, ArrowRight, Hourglass, DollarSign, Share2 } from 'lucide-react';
import CollabCard from '../components/CollabCard';
import PersonCard from '../components/PersonCard';
import { people, collabRequests, topicSuggestions, calcEngagement } from '../data/mockData';

export default function HomePage() {
  const trending = [...collabRequests].sort((a, b) => b.velocityPerHour - a.velocityPerHour).filter(c => c.velocityPerHour >= 8);
  const proposed = collabRequests.filter(c => c.status === 'proposed');
  const allSorted = [...collabRequests].sort((a, b) => calcEngagement(b) - calcEngagement(a));
  const openPeople = people.filter(p => p.openForCollab);

  const totalWaiting = collabRequests.reduce((s, c) => s + (c.waiting || 0), 0);
  const totalFunded = collabRequests.reduce((s, c) => s + c.funded, 0);
  const totalShares = collabRequests.reduce((s, c) => s + (c.totalShares || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Hero */}
      <section className="text-center py-8">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
          Предложи <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[var(--color-accent)]">коллабу</span>
          <br />любого с любым
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-6">
          Голосуй, финансируй и добейся, чтобы встретились те, кого хочет видеть аудитория. Любой инициирует — народ решает.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <Hourglass className="w-4 h-4 text-[var(--color-accent)]" />
            <span><strong className="text-white">{totalWaiting.toLocaleString()}</strong> ждут эфиров</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span><strong className="text-white">{totalFunded.toLocaleString()}₽</strong> собрано</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <Share2 className="w-4 h-4 text-purple-400" />
            <span><strong className="text-white">{totalShares.toLocaleString()}</strong> поделились</span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/marketplace" className="px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity">
            Создать коллабу
          </Link>
          <Link to="/marketplace" className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text-secondary)] font-medium hover:text-white transition-colors">
            Смотреть все
          </Link>
        </div>
      </section>

      {/* Trending */}
      {trending.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-[var(--color-accent)]" />
            <h2 className="text-2xl font-bold text-white">Набирают обороты</h2>
            <span className="text-xs text-[var(--color-text-secondary)] bg-white/5 px-2 py-0.5 rounded-full">по скорости голосов</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trending.slice(0, 4).map(c => <CollabCard key={c.id} collab={c} featured />)}
          </div>
        </section>
      )}

      {/* Awaiting */}
      {proposed.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Ожидают ответа</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proposed.map(c => <CollabCard key={c.id} collab={c} />)}
          </div>
        </section>
      )}

      {/* All */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Все коллабы</h2>
          <Link to="/marketplace" className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300">
            Показать все <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allSorted.map(c => <CollabCard key={c.id} collab={c} />)}
        </div>
      </section>

      {/* Topics */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Темы</h2>
        <div className="flex flex-wrap gap-2">
          {topicSuggestions.map(t => (
            <button key={t.id} className="px-4 py-2 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-[var(--color-text-secondary)] hover:text-white hover:bg-white/10 transition-colors">
              {t.emoji} {t.name} <span className="text-white/30 ml-1">{t.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Open people */}
      {openPeople.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Ищут коллаборацию</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {openPeople.map(p => <PersonCard key={p.id} person={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

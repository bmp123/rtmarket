import { Link } from 'react-router-dom';
import { TrendingUp, Eye, Radio, Clock, Bell, Users } from 'lucide-react';
import { people, collabRequests, liveStreams, topicSuggestions, pastStreams, calcEngagement } from '../data/mockData';
import CollabCard from '../components/CollabCard';
import PersonCard from '../components/PersonCard';
import LiveBadge from '../components/LiveBadge';

export default function HomePage() {
  // Сортируем коллабы по engagement — самые интересные наверх (естественный подогрев)
  const sortedCollabs = [...collabRequests].sort((a, b) => calcEngagement(b) - calcEngagement(a));
  const topCollabs = sortedCollabs.slice(0, 4);
  const awaitingResponse = collabRequests.filter(c => c.status === 'proposed' || c.status === 'open');
  const openPeople = people.filter(p => p.openForCollab);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Hero */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
          Маркетплейс <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[var(--color-accent)]">коллабораций</span>
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-8">
          Предлагай совместные эфиры, голосуй за интересные, 
          финансируй те, которые хочешь увидеть. Любой с любым.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/marketplace"
            className="px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
          >
            Смотреть коллабы
          </Link>
          <Link
            to="/marketplace"
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
          >
            Предложить свой
          </Link>
        </div>
      </section>

      {/* Awaiting response — неявное давление через видимость */}
      {awaitingResponse.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Ожидают ответа</h2>
            <span className="text-sm text-[var(--color-text-secondary)]">{awaitingResponse.length}</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {awaitingResponse.map(c => (
              <CollabCard key={c.id} collab={c} />
            ))}
          </div>
        </section>
      )}

      {/* Live streams */}
      {liveStreams.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Radio className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl font-bold text-white">Сейчас в эфире</h2>
            <LiveBadge />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {liveStreams.map(s => (
              <Link
                key={s.id}
                to={`/stream/${s.id}`}
                className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-5 hover:border-red-500/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <img src={s.author.avatar} alt="" className="w-12 h-12 rounded-full ring-2 ring-red-500/30" />
                  <div className="flex-1">
                    <h3 className="text-white font-bold mb-1">{s.title}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">{s.author.name}</p>
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)] mt-2">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {s.viewers}</span>
                      <span>💰 {s.donations.toLocaleString()}₽</span>
                      <span>❓ {s.questions}</span>
                    </div>
                  </div>
                  <LiveBadge size="sm" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Topics */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-[var(--color-accent)]" />
          <h2 className="text-2xl font-bold text-white">Темы</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {topicSuggestions.map(t => (
            <button
              key={t.id}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-[var(--color-text-secondary)] hover:text-white hover:bg-white/10 transition-colors"
            >
              {t.emoji} {t.name} <span className="text-white/30 ml-1">{t.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Popular collabs (sorted by engagement) */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Популярные коллабы</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {topCollabs.map(c => (
            <CollabCard key={c.id} collab={c} />
          ))}
        </div>
      </section>

      {/* People */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Ищут коллаборацию</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {openPeople.map(p => (
            <PersonCard key={p.id} person={p} />
          ))}
        </div>
      </section>

      {/* Past streams */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-[var(--color-text-secondary)]" />
          <h2 className="text-2xl font-bold text-white">Прошедшие эфиры</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {pastStreams.map(s => (
            <Link
              key={s.id}
              to={`/stream/${s.id}`}
              className="bg-[var(--color-surface)] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all"
            >
              <div className="aspect-video bg-white/5 relative">
                <img src={s.thumbnail} alt="" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-lg">
                  {s.duration}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">{s.title}</h3>
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                  <span>{s.author.name}</span>
                  <span>•</span>
                  <span><Eye className="w-3 h-3 inline" /> {s.viewers}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

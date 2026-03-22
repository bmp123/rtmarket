import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, Radio, Star, ExternalLink, Heart, Eye, Percent, MessageSquare } from 'lucide-react';
import { people, collabRequests, liveStreams, pastStreams } from '../data/mockData';
import CollabCard from '../components/CollabCard';
import LiveBadge from '../components/LiveBadge';

export default function ProfilePage() {
  const { id } = useParams();
  const person = people.find(p => p.id === id);
  const [showDonate, setShowDonate] = useState(false);

  if (!person) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-[var(--color-text-secondary)]">
        Участник не найден
      </div>
    );
  }

  const personCollabs = collabRequests.filter(
    c => c.person1?.id === id || c.person2?.id === id
  );
  const personLive = liveStreams.filter(s => s.author.id === id);
  const personPast = pastStreams.filter(s => s.author.id === id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative shrink-0">
            <img src={person.avatar} alt={person.name} className="w-24 h-24 rounded-2xl ring-2 ring-purple-500/20" />
            {person.isLive && (
              <div className="absolute -top-2 -right-2"><LiveBadge size="sm" /></div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-black text-white mb-1">{person.name}</h1>
            <p className="text-[var(--color-text-secondary)] mb-4">{person.bio}</p>

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{person.followers.toLocaleString()}</div>
                <div className="text-xs text-[var(--color-text-secondary)]">подписчиков</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{person.totalStreams}</div>
                <div className="text-xs text-[var(--color-text-secondary)]">эфиров</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-[var(--color-accent)]">{person.rating}</div>
                <div className="text-xs text-[var(--color-text-secondary)]">рейтинг</div>
              </div>
              <div className="text-center">
                <div className={`text-xl font-bold ${
                  person.responseRate >= 80 ? 'text-green-400' : person.responseRate >= 50 ? 'text-yellow-400' : 'text-[var(--color-text-secondary)]'
                }`}>{person.responseRate}%</div>
                <div className="text-xs text-[var(--color-text-secondary)]">отвечает</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-400">{person.proposalsReceived}</div>
                <div className="text-xs text-[var(--color-text-secondary)]">предложений</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {person.topics.map(t => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300">{t}</span>
              ))}
              {person.formats.map(f => (
                <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-[var(--color-text-secondary)]">{f}</span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowDonate(true)}
                className="px-4 py-2 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-sm font-medium hover:bg-[var(--color-accent)]/20 flex items-center gap-2"
              >
                <Heart className="w-4 h-4" /> Поддержать
              </button>
              {person.socials?.youtube && (
                <a href={person.socials.youtube} target="_blank" rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text-secondary)] text-sm hover:text-white flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> YouTube
                </a>
              )}
              {person.socials?.telegram && (
                <a href={person.socials.telegram} target="_blank" rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text-secondary)] text-sm hover:text-white flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> Telegram
                </a>
              )}
            </div>
          </div>
        </div>

        {person.openForCollab && person.collabRequest && (
          <div className="mt-6 bg-purple-500/10 border border-purple-500/15 rounded-xl p-4">
            <span className="text-sm font-medium text-purple-300">Ищет коллаборацию:</span>
            <p className="text-sm text-white mt-1">{person.collabRequest}</p>
          </div>
        )}
      </div>

      {/* Live */}
      {personLive.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-400" /> Сейчас в эфире
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {personLive.map(s => (
              <Link key={s.id} to={`/stream/${s.id}`}
                className="bg-[var(--color-surface)] border border-red-500/20 rounded-2xl p-5 hover:border-red-500/30 transition-all"
              >
                <h3 className="text-white font-bold mb-2">{s.title}</h3>
                <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {s.viewers}</span>
                  <LiveBadge size="sm" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Collabs */}
      {personCollabs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Коллаборации</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {personCollabs.map(c => (
              <CollabCard key={c.id} collab={c} />
            ))}
          </div>
        </section>
      )}

      {/* Past streams */}
      {personPast.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Прошедшие эфиры</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {personPast.map(s => (
              <Link key={s.id} to={`/stream/${s.id}`}
                className="bg-[var(--color-surface)] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all"
              >
                <div className="aspect-video bg-white/5">
                  <img src={s.thumbnail} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">{s.title}</h3>
                  <div className="text-xs text-[var(--color-text-secondary)]">
                    <Eye className="w-3 h-3 inline" /> {s.viewers} • {s.duration}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {showDonate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-4">Поддержать {person.name}</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[100, 300, 500, 1000].map(a => (
                <button key={a} className="py-3 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] font-bold hover:bg-[var(--color-accent)]/20 transition-colors">
                  {a}₽
                </button>
              ))}
            </div>
            <button onClick={() => setShowDonate(false)} className="w-full py-2 text-[var(--color-text-secondary)] hover:text-white text-sm">
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Users, Radio, Star, MessageSquare, Percent } from 'lucide-react';

export default function PersonCard({ person }) {
  return (
    <Link
      to={`/profile/${person.id}`}
      className="block bg-[var(--color-surface)] border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all hover:scale-[1.01]"
    >
      <div className="flex items-start gap-4 mb-3">
        <div className="relative">
          <img src={person.avatar} alt={person.name} className="w-14 h-14 rounded-full ring-2 ring-purple-500/20" />
          {person.isLive && (
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[var(--color-surface)] animate-pulse" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold truncate">{person.name}</h3>
          <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)] mt-1">
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {person.followers.toLocaleString()}</span>
            <span className="flex items-center gap-1"><Radio className="w-3 h-3" /> {person.totalStreams}</span>
            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" /> {person.rating}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2">{person.bio}</p>

      {/* Response rate — естественный индикатор вовлечённости */}
      <div className="flex items-center gap-3 mb-3 text-xs">
        <span className={`flex items-center gap-1 ${
          person.responseRate >= 80 ? 'text-green-400' :
          person.responseRate >= 50 ? 'text-yellow-400' :
          'text-[var(--color-text-secondary)]'
        }`}>
          <Percent className="w-3 h-3" /> Отвечает: {person.responseRate}%
        </span>
        {person.proposalsReceived > 0 && (
          <span className="text-[var(--color-text-secondary)] flex items-center gap-1">
            <MessageSquare className="w-3 h-3" /> {person.proposalsReceived} предложений
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {person.topics.map(t => (
          <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-[var(--color-text-secondary)]">
            {t}
          </span>
        ))}
      </div>

      {person.openForCollab && person.collabRequest && (
        <div className="bg-purple-500/10 border border-purple-500/15 rounded-xl p-3">
          <p className="text-xs text-purple-300 leading-relaxed">
            💬 {person.collabRequest}
          </p>
        </div>
      )}
    </Link>
  );
}

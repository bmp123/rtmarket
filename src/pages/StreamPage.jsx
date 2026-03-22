import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react';
import { collabRequests } from '../data/mockData';

export default function StreamPage() {
  const { id } = useParams();
  const collab = collabRequests.find(c => c.id === id);

  if (!collab || !collab.scheduledDate) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-[var(--color-text-secondary)] text-lg mb-4">Стрим ещё не запланирован</p>
        <Link to="/marketplace" className="text-purple-400 hover:text-purple-300">← Вернуться к маркетплейсу</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link to={`/collab/${id}`} className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> К коллабу
      </Link>

      <h1 className="text-2xl font-black text-white">{collab.title}</h1>

      {/* Video placeholder */}
      <div className="aspect-video bg-[var(--color-surface)] rounded-2xl border border-white/10 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <p className="text-white font-medium mb-1">Запланирован на</p>
          <p className="text-2xl font-bold text-purple-300">
            {new Date(collab.scheduledDate).toLocaleDateString('ru-RU', {
              day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
            })}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2">Видео появится здесь после эфира</p>
        </div>
      </div>

      <div className="flex gap-4">
        {collab.person1 && (
          <Link to={`/profile/${collab.person1.id}`} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-white">
            <img src={collab.person1.avatar} alt="" className="w-8 h-8 rounded-full" />
            {collab.person1.name}
          </Link>
        )}
        {collab.person2 && (
          <Link to={`/profile/${collab.person2.id}`} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-white">
            <img src={collab.person2.avatar} alt="" className="w-8 h-8 rounded-full" />
            {collab.person2.name}
          </Link>
        )}
      </div>
    </div>
  );
}

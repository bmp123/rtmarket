import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { collabRequests } from '../data/mockData';

export default function StreamPage() {
  const { id } = useParams();
  const collab = collabRequests.find(c => c.id === id);

  if (!collab) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-[var(--color-text-secondary)] text-lg mb-4">Коллаб не найден</p>
        <Link to="/marketplace" className="text-purple-400 hover:text-purple-300">← Маркетплейс</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link to={`/collab/${id}`} className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> К коллабу
      </Link>

      <h1 className="text-2xl font-black text-white">{collab.title}</h1>

      {/* Результат — YouTube embed или заглушка */}
      {collab.resultLink ? (
        <div className="space-y-3">
          <div className="aspect-video rounded-2xl overflow-hidden border border-white/10">
            <iframe
              src={collab.resultLink.replace('watch?v=', 'embed/')}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <a href={collab.resultLink} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-purple-300 hover:text-purple-200">
            <ExternalLink className="w-4 h-4" /> Смотреть на YouTube
          </a>
        </div>
      ) : (
        <div className="aspect-video bg-[var(--color-surface)] rounded-2xl border border-white/10 flex items-center justify-center">
          <div className="text-center">
            {collab.scheduledDate ? (
              <>
                <p className="text-white font-medium mb-1">Запланирован на</p>
                <p className="text-2xl font-bold text-purple-300">
                  {new Date(collab.scheduledDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </p>
              </>
            ) : (
              <p className="text-[var(--color-text-secondary)]">Эфир ещё не состоялся</p>
            )}
            <p className="text-sm text-[var(--color-text-secondary)] mt-3">Ссылка на результат появится здесь после эфира</p>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        {collab.person1 && (
          <Link to={`/profile/${collab.person1.id}`} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-white">
            <img src={collab.person1.avatar} alt="" className="w-8 h-8 rounded-full" /> {collab.person1.name}
          </Link>
        )}
        {collab.person2 && (
          <Link to={`/profile/${collab.person2.id}`} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-white">
            <img src={collab.person2.avatar} alt="" className="w-8 h-8 rounded-full" /> {collab.person2.name}
          </Link>
        )}
      </div>
    </div>
  );
}

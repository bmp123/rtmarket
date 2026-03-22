import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Star, Clock, ThumbsUp, MessageSquare } from 'lucide-react';
import { people, collabRequests } from '../data/mockData';
import CollabCard from '../components/CollabCard';

export default function ProfilePage() {
  const { id } = useParams();
  const person = people.find(p => p.id === id) || people[0];
  const personCollabs = collabRequests.filter(
    c => c.person1?.id === person.id || c.person2?.id === person.id
  );
  const accepted = personCollabs.filter(c => c.status === 'accepted' || c.status === 'confirmed').length;
  const declined = personCollabs.filter(c => c.status === 'declined').length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link to="/marketplace" className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Назад
      </Link>

      {/* Profile header */}
      <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <img src={person.avatar} alt={person.name} className="w-28 h-28 rounded-2xl ring-2 ring-cyan-500/20" />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-black text-white mb-1">{person.name}</h1>
            <p className="text-[var(--color-text-secondary)] mb-4">{person.bio}</p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-1 text-sm">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-white font-bold">{person.followers?.toLocaleString()}</span>
                <span className="text-[var(--color-text-secondary)]">подписчиков</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 text-[var(--color-accent)]" />
                <span className="text-white font-bold">{person.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="w-4 h-4 text-green-400" />
                <span className={`font-bold ${
                  person.responseRate >= 90 ? 'text-green-300' : person.responseRate >= 70 ? 'text-yellow-300' : 'text-red-300'
                }`}>{person.responseRate}%</span>
                <span className="text-[var(--color-text-secondary)]">отвечает</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span className="text-white font-bold">{person.proposalsReceived}</span>
                <span className="text-[var(--color-text-secondary)]">предложений</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              {person.topics.map(t => (
                <span key={t} className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300">#{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Collab stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[var(--color-surface)] rounded-xl p-4 text-center border border-white/5">
          <p className="text-2xl font-bold text-white">{personCollabs.length}</p>
          <p className="text-xs text-[var(--color-text-secondary)]">Коллабов</p>
        </div>
        <div className="bg-[var(--color-surface)] rounded-xl p-4 text-center border border-white/5">
          <p className="text-2xl font-bold text-green-300">{accepted}</p>
          <p className="text-xs text-[var(--color-text-secondary)]">Принято</p>
        </div>
        <div className="bg-[var(--color-surface)] rounded-xl p-4 text-center border border-white/5">
          <p className="text-2xl font-bold text-[var(--color-text-secondary)]">{declined}</p>
          <p className="text-xs text-[var(--color-text-secondary)]">Отклонено</p>
        </div>
      </div>

      {/* Open for collab */}
      {person.openForCollab && person.collabRequest && (
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6">
          <h2 className="text-white font-bold mb-2 flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 text-cyan-400" /> Открыт к предложениям
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-3">{person.collabRequest}</p>
          <button className="px-6 py-2 rounded-xl bg-linear-to-r from-cyan-600 to-cyan-500 text-white font-medium hover:opacity-90 transition-opacity text-sm">
            Предложить коллаб
          </button>
        </div>
      )}

      {/* Person's collabs */}
      {personCollabs.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Коллаборации</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personCollabs.map(c => <CollabCard key={c.id} collab={c} />)}
          </div>
        </div>
      )}
    </div>
  );
}

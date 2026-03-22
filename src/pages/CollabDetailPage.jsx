import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThumbsUp, Users, Calendar, MessageSquare, Share2, Bell, Clock, Send } from 'lucide-react';
import { collabRequests, daysUntilDeadline, calcEngagement } from '../data/mockData';

const statusLabels = {
  proposed: 'Ожидает ответа',
  accepted: 'Принято',
  declined: 'Отклонено',
  confirmed: 'Запланировано',
  open: 'Открытое предложение',
};

export default function CollabDetailPage() {
  const { id } = useParams();
  const collab = collabRequests.find(c => c.id === id) || collabRequests[0];
  const [voted, setVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(collab.votes);
  const [subscribed, setSubscribed] = useState(false);
  const [subCount, setSubCount] = useState(collab.subscribers || 0);

  const fundingPercent = Math.round((collab.funded / collab.goal) * 100);
  const daysLeft = daysUntilDeadline(collab);
  const engagement = calcEngagement(collab);

  const handleVote = () => {
    if (!voted) { setVoted(true); setVoteCount(v => v + 1); }
  };

  const handleSubscribe = () => {
    if (!subscribed) { setSubscribed(true); setSubCount(v => v + 1); }
    else { setSubscribed(false); setSubCount(v => v - 1); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Status + deadline */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          collab.status === 'confirmed' ? 'bg-green-500/15 text-green-300' :
          collab.status === 'declined' ? 'bg-white/10 text-[var(--color-text-secondary)]' :
          collab.status === 'proposed' ? 'bg-yellow-500/15 text-yellow-300' :
          collab.status === 'open' ? 'bg-purple-500/15 text-purple-300' :
          'bg-blue-500/15 text-blue-300'
        }`}>
          {statusLabels[collab.status]}
        </span>
        {daysLeft !== null && collab.status === 'proposed' && (
          <span className={`flex items-center gap-1 text-sm ${
            daysLeft <= 2 ? 'text-yellow-300' : 'text-[var(--color-text-secondary)]'
          }`}>
            <Clock className="w-4 h-4" />
            {daysLeft === 0 ? 'Срок ответа истекает сегодня' :
             daysLeft === 1 ? '1 день на ответ' :
             `${daysLeft} дн. на ответ`}
          </span>
        )}
      </div>

      <h1 className="text-3xl font-black text-white mb-3">{collab.title}</h1>
      <p className="text-[var(--color-text-secondary)] mb-6 text-lg">{collab.description}</p>

      {/* Participants */}
      <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Участники</h2>
        <div className="flex items-center justify-center gap-8">
          {collab.person1 && (
            <Link to={`/profile/${collab.person1.id}`} className="text-center group">
              <img src={collab.person1.avatar} alt=""
                className="w-20 h-20 rounded-2xl ring-2 ring-purple-500/20 mx-auto mb-2 group-hover:ring-purple-500/50 transition-all" />
              <p className="text-white font-bold">{collab.person1.name}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{collab.person1.followers?.toLocaleString()} подп.</p>
            </Link>
          )}

          <div className="text-center text-2xl text-[var(--color-text-secondary)]">&</div>

          {collab.person2 ? (
            <Link to={`/profile/${collab.person2.id}`} className="text-center group">
              <img src={collab.person2.avatar} alt=""
                className="w-20 h-20 rounded-2xl ring-2 ring-purple-500/20 mx-auto mb-2 group-hover:ring-purple-500/50 transition-all" />
              <p className="text-white font-bold">{collab.person2.name}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{collab.person2.followers?.toLocaleString()} подп.</p>
            </Link>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center mx-auto mb-2">
                <span className="text-white/30 text-2xl">?</span>
              </div>
              <p className="text-[var(--color-text-secondary)] text-sm">Ищет собеседника</p>
              <button className="text-xs text-purple-400 hover:text-purple-300 mt-1">
                Откликнуться →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Discussion thread — ключевая механика подогрева */}
      {collab.discussion?.length > 0 && (
        <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">
            Обсуждение
          </h2>
          <div className="space-y-4">
            {collab.discussion.map((msg, i) => (
              <div key={i} className="flex gap-3">
                <img src={msg.who.avatar} alt="" className="w-8 h-8 rounded-full shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white font-medium text-sm">{msg.who.name}</span>
                    <span className="text-[10px] text-white/30">{msg.date}</span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Placeholder for "add comment" — shows engagement opportunity */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex gap-2 items-center">
              <input type="text" placeholder="Написать комментарий..."
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
              />
              <button className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Funding */}
      <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
            Сбор средств
          </h2>
          <span className="text-xs text-[var(--color-text-secondary)]">{collab.backers} спонсоров</span>
        </div>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-3xl font-black text-white">{collab.funded.toLocaleString()}₽</span>
          <span className="text-[var(--color-text-secondary)] pb-1">/ {collab.goal.toLocaleString()}₽</span>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full rounded-full ${
              fundingPercent >= 100 ? 'bg-linear-to-r from-green-500 to-emerald-400'
              : 'bg-linear-to-r from-purple-500 to-[var(--color-accent)]'
            }`}
            style={{ width: `${Math.min(fundingPercent, 100)}%` }}
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[100, 300, 500, 1000].map(a => (
            <button key={a}
              className="py-3 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] font-bold hover:bg-[var(--color-accent)]/20 transition-colors"
            >
              {a}₽
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--color-text-secondary)] mt-3 text-center">
          Средства показывают интерес аудитории к этому коллабу
        </p>
      </div>

      {/* Actions row */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={handleVote}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            voted ? 'bg-purple-500/20 text-purple-300' : 'bg-linear-to-r from-purple-600 to-purple-500 text-white hover:opacity-90'
          }`}
        >
          <ThumbsUp className="w-5 h-5" /> {voted ? 'Голос учтён' : 'Голосовать'} ({voteCount})
        </button>

        <button onClick={handleSubscribe}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            subscribed ? 'bg-yellow-500/20 text-yellow-300' : 'bg-white/5 border border-white/10 text-[var(--color-text-secondary)] hover:text-white'
          }`}
        >
          <Bell className="w-5 h-5" /> {subscribed ? 'Подписаны' : 'Следить'} ({subCount})
        </button>

        <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text-secondary)] hover:text-white flex items-center gap-2">
          <Share2 className="w-5 h-5" /> Поделиться
        </button>
      </div>

      {/* Schedule */}
      {collab.scheduledDate && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-bold text-green-300">Дата эфира</h2>
          </div>
          <p className="text-white text-2xl font-bold">
            {new Date(collab.scheduledDate).toLocaleDateString('ru-RU', {
              weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>
      )}

      {/* Topics */}
      <div className="mt-6 flex flex-wrap gap-2">
        {collab.topics.map(t => (
          <span key={t} className="text-sm px-3 py-1 rounded-full bg-white/5 text-[var(--color-text-secondary)]">
            #{t}
          </span>
        ))}
      </div>
    </div>
  );
}

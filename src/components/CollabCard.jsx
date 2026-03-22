import { Link } from 'react-router-dom';
import { MessageSquare, Users, Calendar, Bell, Clock, TrendingUp } from 'lucide-react';
import { calcEngagement, daysUntilDeadline } from '../data/mockData';

const statusConfig = {
  proposed: { label: 'Ожидает ответа', color: 'bg-yellow-500/15 text-yellow-300' },
  accepted: { label: 'Принято', color: 'bg-blue-500/15 text-blue-300' },
  declined: { label: 'Отклонено', color: 'bg-white/10 text-[var(--color-text-secondary)]' },
  confirmed: { label: 'Запланировано', color: 'bg-green-500/15 text-green-300' },
  open: { label: 'Открытое предложение', color: 'bg-purple-500/15 text-purple-300' },
};

export default function CollabCard({ collab }) {
  const status = statusConfig[collab.status] || statusConfig.proposed;
  const fundingPercent = Math.round((collab.funded / collab.goal) * 100);
  const engagement = calcEngagement(collab);
  const daysLeft = daysUntilDeadline(collab);
  const hasDiscussion = collab.discussion?.length > 1;
  const lastMessage = collab.discussion?.[collab.discussion.length - 1];

  return (
    <Link
      to={`/collab/${collab.id}`}
      className="block bg-[var(--color-surface)] border border-white/10 rounded-2xl p-5 transition-all hover:border-purple-500/30 hover:shadow-xl hover:scale-[1.01]"
    >
      {/* Header: status + engagement */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${status.color}`}>
          {status.label}
        </span>
        <div className="flex items-center gap-2">
          {engagement > 8 && (
            <span className="flex items-center gap-1 text-xs text-[var(--color-accent)]">
              <TrendingUp className="w-3.5 h-3.5" /> Популярное
            </span>
          )}
          {collab.subscribers > 0 && (
            <span className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
              <Bell className="w-3 h-3" /> {collab.subscribers}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-white mb-2 leading-tight">{collab.title}</h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2">{collab.description}</p>

      {/* Participants */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <img src={collab.person1?.avatar} alt="" className="w-8 h-8 rounded-full ring-2 ring-purple-500/30" />
          <span className="text-sm text-white font-medium">{collab.person1?.name}</span>
        </div>
        {collab.person2 ? (
          <>
            <span className="text-[var(--color-text-secondary)] text-sm">и</span>
            <div className="flex items-center gap-2">
              <img src={collab.person2?.avatar} alt="" className="w-8 h-8 rounded-full ring-2 ring-purple-500/30" />
              <span className="text-sm text-white font-medium">{collab.person2?.name}</span>
            </div>
          </>
        ) : (
          <span className="text-sm text-[var(--color-text-secondary)] italic">
            + ищет собеседника
          </span>
        )}
      </div>

      {/* Response deadline timer */}
      {daysLeft !== null && collab.status === 'proposed' && (
        <div className={`flex items-center gap-2 text-xs mb-3 px-3 py-2 rounded-lg ${
          daysLeft <= 2 ? 'bg-yellow-500/10 text-yellow-300' : 'bg-white/5 text-[var(--color-text-secondary)]'
        }`}>
          <Clock className="w-3.5 h-3.5" />
          {daysLeft === 0 ? 'Срок ответа истекает сегодня' :
           daysLeft === 1 ? 'Остался 1 день на ответ' :
           `${daysLeft} дн. на ответ`}
        </div>
      )}

      {/* Last message from discussion */}
      {hasDiscussion && lastMessage && (
        <div className="bg-white/5 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <img src={lastMessage.who.avatar} alt="" className="w-5 h-5 rounded-full" />
            <span className="text-xs text-[var(--color-text-secondary)]">{lastMessage.who.name}</span>
          </div>
          <p className="text-xs text-white/70 line-clamp-1">«{lastMessage.text}»</p>
        </div>
      )}

      {/* Topics */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {collab.topics.map(t => (
          <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-[var(--color-text-secondary)]">
            {t}
          </span>
        ))}
      </div>

      {/* Funding bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[var(--color-text-secondary)]">Собрано {collab.funded.toLocaleString()}₽</span>
          <span className={`font-bold ${fundingPercent >= 100 ? 'text-green-400' : 'text-[var(--color-accent)]'}`}>
            {fundingPercent}%
          </span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              fundingPercent >= 100 ? 'bg-linear-to-r from-green-500 to-emerald-400' :
              'bg-linear-to-r from-purple-500 to-[var(--color-accent)]'
            }`}
            style={{ width: `${Math.min(fundingPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Footer stats */}
      <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" /> {collab.votes}
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare className="w-3.5 h-3.5" /> {collab.comments}
        </span>
        {collab.scheduledDate && (
          <span className="flex items-center gap-1 text-green-400">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(collab.scheduledDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>
    </Link>
  );
}

import { Link } from 'react-router-dom';
import { MessageSquare, Users, Bell, Clock, TrendingUp, Share2, Award } from 'lucide-react';
import { calcEngagement, daysUntilDeadline, nextMilestone, milestoneProgress } from '../data/mockData';

const statusConfig = {
  proposed: { label: 'Ожидает ответа', color: 'bg-yellow-500/15 text-yellow-300' },
  accepted: { label: 'Принято', color: 'bg-blue-500/15 text-blue-300' },
  declined: { label: 'Отклонено', color: 'bg-white/10 text-[var(--color-text-secondary)]' },
  confirmed: { label: 'Дата назначена', color: 'bg-green-500/15 text-green-300' },
  open: { label: 'Ищет участника', color: 'bg-purple-500/15 text-purple-300' },
};

export default function CollabCard({ collab, featured = false }) {
  const status = statusConfig[collab.status] || statusConfig.proposed;
  const fundingPct = Math.round((collab.funded / collab.goal) * 100);
  const daysLeft = daysUntilDeadline(collab);
  const next = nextMilestone(collab.votes);
  const mProgress = milestoneProgress(collab.votes);
  const lastMsg = collab.discussion?.[collab.discussion.length - 1];
  const predTotal = collab.predictions.accept + collab.predictions.decline;
  const predAcceptPct = predTotal > 0 ? Math.round((collab.predictions.accept / predTotal) * 100) : 0;
  const hasEarlySlots = collab.earlySupportersClaimed < collab.earlySupporters;

  return (
    <Link
      to={`/collab/${collab.id}`}
      className={`block bg-[var(--color-surface)] border border-white/10 rounded-2xl transition-all hover:border-purple-500/30 hover:shadow-xl hover:scale-[1.01] ${
        featured ? 'p-6' : 'p-5'
      }`}
    >
      {/* Top row: status + velocity */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <span className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 ${status.color}`}>
          {status.label}
        </span>
        <div className="flex items-center gap-2 text-xs">
          {collab.velocityPerHour > 0 && (
            <span className={`flex items-center gap-1 ${
              collab.velocityPerHour >= 10 ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'
            }`}>
              <TrendingUp className="w-3.5 h-3.5" />
              +{collab.velocityPerHour}/ч
            </span>
          )}
          <span className="flex items-center gap-1 text-[var(--color-text-secondary)]">
            <Bell className="w-3 h-3" /> {collab.subscribers}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className={`font-bold text-white mb-2 leading-tight ${featured ? 'text-xl' : 'text-lg'}`}>
        {collab.title}
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2">{collab.description}</p>

      {/* Participants */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <img src={collab.person1?.avatar} alt="" className="w-8 h-8 rounded-full ring-2 ring-purple-500/20" />
          <span className="text-sm text-white font-medium">{collab.person1?.name}</span>
        </div>
        {collab.person2 ? (
          <>
            <span className="text-[var(--color-text-secondary)]">&</span>
            <div className="flex items-center gap-2">
              <img src={collab.person2?.avatar} alt="" className="w-8 h-8 rounded-full ring-2 ring-purple-500/20" />
              <span className="text-sm text-white font-medium">{collab.person2?.name}</span>
            </div>
          </>
        ) : (
          <span className="text-sm text-purple-300 italic">+ ищет собеседника</span>
        )}
      </div>

      {/* ⏰ Response deadline timer */}
      {daysLeft !== null && collab.status === 'proposed' && (
        <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg mb-3 ${
          daysLeft <= 1 ? 'bg-red-500/10 text-red-300' :
          daysLeft <= 3 ? 'bg-yellow-500/10 text-yellow-300' :
          'bg-white/5 text-[var(--color-text-secondary)]'
        }`}>
          <Clock className="w-3.5 h-3.5" />
          {daysLeft === 0 ? 'Срок ответа истекает сегодня!' :
           daysLeft === 1 ? 'Остался 1 день' :
           `${daysLeft} дн. на ответ`}
        </div>
      )}

      {/* 🎯 Prediction bar: примет / не примет */}
      {predTotal > 0 && collab.status === 'proposed' && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] text-[var(--color-text-secondary)] mb-1">
            <span>Примет {predAcceptPct}%</span>
            <span>Не примет {100 - predAcceptPct}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden flex">
            <div className="h-full bg-green-500/60 rounded-l-full" style={{ width: `${predAcceptPct}%` }} />
            <div className="h-full bg-white/10 rounded-r-full" style={{ width: `${100 - predAcceptPct}%` }} />
          </div>
        </div>
      )}

      {/* 💬 Last discussion message */}
      {lastMsg && (
        <div className="bg-white/5 rounded-lg p-2.5 mb-3">
          <div className="flex items-center gap-2 mb-0.5">
            <img src={lastMsg.who.avatar} alt="" className="w-4 h-4 rounded-full" />
            <span className="text-[10px] text-[var(--color-text-secondary)]">{lastMsg.who.name}</span>
          </div>
          <p className="text-xs text-white/70 line-clamp-1">«{lastMsg.text}»</p>
        </div>
      )}

      {/* 🏆 Next milestone progress */}
      {next && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-[var(--color-text-secondary)]">
              {next.icon} До «{next.label}»
            </span>
            <span className="text-[var(--color-text-secondary)]">{collab.votes}/{next.votes}</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500/60 rounded-full transition-all" style={{ width: `${mProgress}%` }} />
          </div>
        </div>
      )}

      {/* 💰 Funding bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[var(--color-text-secondary)]">{collab.funded.toLocaleString()}₽ собрано</span>
          <span className={`font-bold ${fundingPct >= 100 ? 'text-green-400' : 'text-[var(--color-accent)]'}`}>
            {fundingPct}%
          </span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              fundingPct >= 100 ? 'bg-linear-to-r from-green-500 to-emerald-400' :
              'bg-linear-to-r from-purple-500 to-[var(--color-accent)]'
            }`}
            style={{ width: `${Math.min(fundingPct, 100)}%` }}
          />
        </div>
      </div>

      {/* Footer: votes, comments, shares, early supporter */}
      <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {collab.votes}</span>
          <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {collab.comments}</span>
          <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> {collab.totalShares}</span>
        </div>
        {hasEarlySlots && (
          <span className="flex items-center gap-1 text-[var(--color-accent)] font-medium">
            <Award className="w-3.5 h-3.5" />
            {collab.earlySupporters - collab.earlySupportersClaimed} мест
          </span>
        )}
      </div>
    </Link>
  );
}

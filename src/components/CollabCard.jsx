import { Link } from 'react-router-dom';
import { MessageSquare, Clock, TrendingUp, Share2, Award, DollarSign, Hourglass } from 'lucide-react';
import { daysUntilDeadline, nextMilestone, milestoneProgress } from '../data/mockData';

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
  const predTotal = collab.predictions.accept + collab.predictions.decline;
  const predAcceptPct = predTotal > 0 ? Math.round((collab.predictions.accept / predTotal) * 100) : 0;
  const hasEarlySlots = collab.earlySupportersClaimed < collab.earlySupporters;

  return (
    <Link to={`/collab/${collab.id}`}
      className={`block bg-[var(--color-surface)] border border-white/10 rounded-2xl transition-all hover:border-purple-500/30 hover:shadow-xl hover:scale-[1.01] ${featured ? 'p-6' : 'p-5'}`}
    >
      {/* ЛИЦА И ИМЕНА — ГЛАВНЫЙ ЭЛЕМЕНТ */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img src={collab.person1?.avatar} alt="" className={`${featured ? 'w-14 h-14' : 'w-12 h-12'} rounded-2xl ring-2 ring-purple-500/20 shrink-0`} />
          <div className="min-w-0">
            <p className={`text-white font-bold truncate ${featured ? 'text-lg' : ''}`}>{collab.person1?.name}</p>
            <p className="text-[10px] text-[var(--color-text-secondary)] truncate">{collab.person1?.bio?.slice(0, 40)}</p>
          </div>
        </div>
        <span className="text-[var(--color-text-secondary)] text-lg shrink-0">&</span>
        {collab.person2 ? (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img src={collab.person2?.avatar} alt="" className={`${featured ? 'w-14 h-14' : 'w-12 h-12'} rounded-2xl ring-2 ring-purple-500/20 shrink-0`} />
            <div className="min-w-0">
              <p className={`text-white font-bold truncate ${featured ? 'text-lg' : ''}`}>{collab.person2?.name}</p>
              <p className="text-[10px] text-[var(--color-text-secondary)] truncate">{collab.person2?.bio?.slice(0, 40)}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`${featured ? 'w-14 h-14' : 'w-12 h-12'} rounded-2xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center shrink-0`}>
              <span className="text-white/30 text-lg">?</span>
            </div>
            <div>
              <p className="text-purple-300 font-medium text-sm">Ищет собеседника</p>
              <p className="text-[10px] text-purple-400">Откликнуться →</p>
            </div>
          </div>
        )}
      </div>

      {/* Тема + статус */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className={`font-bold text-white leading-tight ${featured ? 'text-xl' : 'text-lg'}`}>{collab.title}</h3>
        <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full shrink-0 ${status.color}`}>{status.label}</span>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2">{collab.description}</p>

      {/* Дедлайн ответа */}
      {daysLeft !== null && collab.status === 'proposed' && (
        <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg mb-3 ${
          daysLeft <= 1 ? 'bg-red-500/10 text-red-300' : daysLeft <= 3 ? 'bg-yellow-500/10 text-yellow-300' : 'bg-white/5 text-[var(--color-text-secondary)]'
        }`}>
          <Clock className="w-3.5 h-3.5" />
          {daysLeft === 0 ? 'Срок ответа истекает сегодня!' : daysLeft === 1 ? 'Остался 1 день' : `${daysLeft} дн. на ответ`}
        </div>
      )}

      {/* Прогноз */}
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

      {/* Milestone */}
      {next && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-[var(--color-text-secondary)]">{next.icon} До «{next.label}»</span>
            <span className="text-[var(--color-text-secondary)]">{collab.votes}/{next.votes}</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500/60 rounded-full transition-all" style={{ width: `${mProgress}%` }} />
          </div>
        </div>
      )}

      {/* Сбор */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[var(--color-text-secondary)]">{collab.funded.toLocaleString()}₽ собрано</span>
          <span className={`font-bold ${fundingPct >= 100 ? 'text-green-400' : 'text-[var(--color-accent)]'}`}>{fundingPct}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${fundingPct >= 100 ? 'bg-linear-to-r from-green-500 to-emerald-400' : 'bg-linear-to-r from-purple-500 to-[var(--color-accent)]'}`}
            style={{ width: `${Math.min(fundingPct, 100)}%` }} />
        </div>
      </div>

      {/* Спонсор */}
      {collab.sponsor && (
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-white/5 mb-3">
          <span>{collab.sponsor.logo}</span>
          <span className="text-[var(--color-text-secondary)]">Партнёр:</span>
          <span className="text-white font-medium">{collab.sponsor.name}</span>
        </div>
      )}

      {/* МАРКЕТПЛЕЙС-МЕТРИКИ: ждут, рублём, комменты + обороты + ШЕРИНГ */}
      <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><Hourglass className="w-3.5 h-3.5" />{collab.waiting} ждут</span>
          <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />{collab.paidVotes} рублём</span>
          <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{collab.comments}</span>
        </div>
        <div className="flex items-center gap-3">
          {collab.velocityPerHour > 0 && (
            <span className={`flex items-center gap-1 ${collab.velocityPerHour >= 10 ? 'text-[var(--color-accent)]' : ''}`}>
              <TrendingUp className="w-3.5 h-3.5" />+{collab.velocityPerHour}/ч
            </span>
          )}
          <span className="flex items-center gap-1 text-purple-300 font-medium">
            <Share2 className="w-3.5 h-3.5" />{collab.totalShares}
          </span>
        </div>
      </div>

      {hasEarlySlots && (
        <div className="mt-2 flex items-center gap-1 text-[var(--color-accent)] text-xs font-medium">
          <Award className="w-3.5 h-3.5" />
          {collab.earlySupporters - collab.earlySupportersClaimed} мест раннего сторонника
        </div>
      )}
    </Link>
  );
}

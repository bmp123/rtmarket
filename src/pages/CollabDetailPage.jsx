import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThumbsUp, Share2, Calendar, Clock, Send, Award, TrendingUp, MessageSquare, CheckCircle, ExternalLink, Link2, CalendarPlus, Handshake, Users } from 'lucide-react';
import { collabRequests, milestones, daysUntilDeadline, nextMilestone, milestoneProgress, achievedMilestones } from '../data/mockData';

const statusLabels = {
  proposed: 'Ожидает ответа', accepted: 'Принято', declined: 'Отклонено',
  confirmed: 'Дата назначена', open: 'Ищет участника',
};
const roleLabels = { organizer: '🎯 Организатор', referee: '⚖️ Рефери', recruiter: '🔗 Привлёк участника' };

export default function CollabDetailPage() {
  const { id } = useParams();
  const collab = collabRequests.find(c => c.id === id) || collabRequests[0];
  const [voted, setVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(collab.votes);
  const [prediction, setPrediction] = useState(null);
  const [preds, setPreds] = useState(collab.predictions);
  const [shared, setShared] = useState(false);
  const [refCopied, setRefCopied] = useState(false);

  const fundingPct = Math.round((collab.funded / collab.goal) * 100);
  const daysLeft = daysUntilDeadline(collab);
  const next = nextMilestone(voteCount);
  const mProgress = milestoneProgress(voteCount);
  const predTotal = preds.accept + preds.decline;
  const predAcceptPct = predTotal > 0 ? Math.round((preds.accept / predTotal) * 100) : 0;
  const hasEarlySlots = collab.earlySupportersClaimed < collab.earlySupporters;
  const refLink = `${window.location.origin}${window.location.pathname}#/collab/${collab.id}?ref=user123`;

  const handleVote = () => { if (!voted) { setVoted(true); setVoteCount(v => v + 1); } };
  const handlePredict = (type) => { if (prediction) return; setPrediction(type); setPreds(p => ({ ...p, [type]: p[type] + 1 })); };
  const handleShare = () => { navigator.clipboard?.writeText(window.location.href); setShared(true); setTimeout(() => setShared(false), 2000); };
  const handleRefCopy = () => { navigator.clipboard?.writeText(refLink); setRefCopied(true); setTimeout(() => setRefCopied(false), 2000); };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Status + timer + velocity */}
      <div className="flex flex-wrap items-center gap-3">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          collab.status === 'confirmed' ? 'bg-green-500/15 text-green-300' :
          collab.status === 'declined' ? 'bg-white/10 text-[var(--color-text-secondary)]' :
          collab.status === 'proposed' ? 'bg-yellow-500/15 text-yellow-300' :
          collab.status === 'open' ? 'bg-purple-500/15 text-purple-300' :
          'bg-blue-500/15 text-blue-300'
        }`}>{statusLabels[collab.status]}</span>
        {daysLeft !== null && collab.status === 'proposed' && (
          <span className={`flex items-center gap-1 text-sm ${daysLeft <= 1 ? 'text-red-300' : daysLeft <= 3 ? 'text-yellow-300' : 'text-[var(--color-text-secondary)]'}`}>
            <Clock className="w-4 h-4" />
            {daysLeft === 0 ? 'Срок ответа истекает сегодня!' : daysLeft === 1 ? '1 день на ответ' : `${daysLeft} дн. на ответ`}
          </span>
        )}
        {collab.velocityPerHour > 0 && (
          <span className="flex items-center gap-1 text-sm text-[var(--color-accent)]">
            <TrendingUp className="w-4 h-4" /> +{collab.velocityPerHour} голосов/ч
          </span>
        )}
      </div>

      {/* Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-3">{collab.title}</h1>
        <p className="text-lg text-[var(--color-text-secondary)]">{collab.description}</p>
      </div>

      {/* PARTICIPANTS — крупные лица */}
      <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-center gap-8">
          {collab.person1 && (
            <Link to={`/profile/${collab.person1.id}`} className="text-center group">
              <img src={collab.person1.avatar} alt="" className="w-24 h-24 rounded-2xl ring-2 ring-purple-500/20 mx-auto mb-2 group-hover:ring-purple-500/50 transition-all" />
              <p className="text-white font-bold text-lg">{collab.person1.name}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{collab.person1.bio?.slice(0, 50)}</p>
            </Link>
          )}
          <div className="text-3xl text-[var(--color-text-secondary)]">&</div>
          {collab.person2 ? (
            <Link to={`/profile/${collab.person2.id}`} className="text-center group">
              <img src={collab.person2.avatar} alt="" className="w-24 h-24 rounded-2xl ring-2 ring-purple-500/20 mx-auto mb-2 group-hover:ring-purple-500/50 transition-all" />
              <p className="text-white font-bold text-lg">{collab.person2.name}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{collab.person2.bio?.slice(0, 50)}</p>
            </Link>
          ) : (
            <div className="text-center">
              <div className="w-24 h-24 rounded-2xl bg-white/5 border-2 border-dashed border-white/20 mx-auto mb-2 flex items-center justify-center">
                <span className="text-white/30 text-3xl">?</span>
              </div>
              <p className="text-purple-300 font-medium">Ищет собеседника</p>
              <button className="text-sm text-purple-400 hover:text-purple-300 mt-1">Откликнуться →</button>
            </div>
          )}
        </div>
      </div>

      {/* 📖 ПРЕДЫСТОРИЯ — почему это интересно */}
      {collab.backstory && (
        <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-bold mb-2">Предыстория</h2>
          <p className="text-[var(--color-text-secondary)] text-sm mb-3">{collab.backstory}</p>
          {collab.backstoryLinks?.length > 0 && (
            <div className="space-y-2">
              {collab.backstoryLinks.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-purple-300 hover:text-purple-200 transition-colors">
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  {link.title}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 🎰 Prediction */}
      {collab.status === 'proposed' && collab.person2 && (
        <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-bold mb-3">Как думаете, примет?</h2>
          <div className="flex gap-3 mb-4">
            <button onClick={() => handlePredict('accept')}
              className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
                prediction === 'accept' ? 'bg-green-500/20 text-green-300 ring-1 ring-green-500/30' :
                prediction ? 'bg-white/5 text-[var(--color-text-secondary)]' : 'bg-green-500/10 text-green-300 hover:bg-green-500/20'
              }`}>Примет</button>
            <button onClick={() => handlePredict('decline')}
              className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
                prediction === 'decline' ? 'bg-white/15 text-white ring-1 ring-white/20' :
                prediction ? 'bg-white/5 text-[var(--color-text-secondary)]' : 'bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10'
              }`}>Не примет</button>
          </div>
          {predTotal > 0 && (
            <div>
              <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mb-1">
                <span>Примет — {predAcceptPct}% ({preds.accept})</span>
                <span>Не примет — {100 - predAcceptPct}% ({preds.decline})</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
                <div className="h-full bg-green-500/50 rounded-l-full transition-all" style={{ width: `${predAcceptPct}%` }} />
                <div className="h-full bg-white/10 rounded-r-full transition-all" style={{ width: `${100 - predAcceptPct}%` }} />
              </div>
              <p className="text-[10px] text-[var(--color-text-secondary)] mt-1">{predTotal} чел. сделали прогноз</p>
            </div>
          )}
        </div>
      )}

      {/* 🏆 Milestones */}
      <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-bold mb-4">Milestones</h2>
        <div className="space-y-3">
          {milestones.map(m => {
            const done = voteCount >= m.votes;
            return (
              <div key={m.votes} className={`flex items-center gap-3 ${done ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${done ? 'bg-green-500/15' : 'bg-white/5'}`}>
                  {done ? <CheckCircle className="w-4 h-4 text-green-400" /> : m.icon}
                </div>
                <div className="flex-1 flex justify-between">
                  <span className={`text-sm ${done ? 'text-white' : 'text-[var(--color-text-secondary)]'}`}>{m.label}</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">{m.votes} голосов</span>
                </div>
              </div>
            );
          })}
        </div>
        {next && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mb-1">
              <span>До «{next.label}»</span><span>{voteCount}/{next.votes}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500/50 rounded-full transition-all" style={{ width: `${mProgress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* 💬 Discussion */}
      {collab.discussion?.length > 0 && (
        <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Обсуждение</h2>
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
          <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
            <input type="text" placeholder="Написать комментарий..."
              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50" />
            <button className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-colors"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* 💰 Funding + sponsor + early supporter */}
      <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white font-bold">Поддержать</h2>
          <span className="text-xs text-[var(--color-text-secondary)]">{collab.paidVotes} проголосовали рублём</span>
        </div>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-3xl font-black text-white">{collab.funded.toLocaleString()}₽</span>
          <span className="text-[var(--color-text-secondary)] pb-1">/ {collab.goal.toLocaleString()}₽</span>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-4">
          <div className={`h-full rounded-full ${fundingPct >= 100 ? 'bg-linear-to-r from-green-500 to-emerald-400' : 'bg-linear-to-r from-purple-500 to-[var(--color-accent)]'}`}
            style={{ width: `${Math.min(fundingPct, 100)}%` }} />
        </div>

        {/* Спонсор */}
        {collab.sponsor && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-4 flex items-center gap-3">
            <span className="text-2xl">{collab.sponsor.logo}</span>
            <div>
              <p className="text-sm text-white font-medium">Партнёр: {collab.sponsor.name}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">Спонсирует коллаборацию</p>
            </div>
          </div>
        )}

        {/* Стать партнёром */}
        <button className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text-secondary)] text-sm font-medium hover:text-white hover:bg-white/10 transition-colors mb-4 flex items-center justify-center gap-2">
          <Handshake className="w-4 h-4" /> Стать партнёром / спонсором
        </button>

        {hasEarlySlots && (
          <div className="bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 rounded-xl p-3 mb-4 flex items-center gap-3">
            <Award className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
            <div>
              <p className="text-sm text-[var(--color-accent)] font-medium">Ранний сторонник</p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Осталось {collab.earlySupporters - collab.earlySupportersClaimed} из {collab.earlySupporters} мест — получите бейдж
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-2">
          {[100, 300, 500, 1000].map(a => (
            <button key={a} className="py-3 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] font-bold hover:bg-[var(--color-accent)]/20 transition-colors">{a}₽</button>
          ))}
        </div>
      </div>

      {/* 👥 Roles — организатор, рефери, привлёк */}
      {collab.roles?.length > 0 && (
        <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-bold mb-3 flex items-center gap-2"><Users className="w-5 h-5" /> Команда коллаба</h2>
          <div className="space-y-2">
            {collab.roles.map((r, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{roleLabels[r.type] || r.type}</span>
                  <span className="text-sm text-white font-medium">{r.name}</span>
                </div>
                {r.reward > 0 && <span className="text-xs text-green-300">+{r.reward.toLocaleString()}₽</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔗 REFERRAL LINK — заработай за привлечение */}
      {collab.referralBonus > 0 && (
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6">
          <h2 className="text-white font-bold mb-2 flex items-center gap-2"><Link2 className="w-5 h-5 text-purple-400" /> Заработай на коллабе</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-3">
            Поделись своей реферальной ссылкой — получи <strong className="text-purple-300">{collab.referralBonus}₽</strong> за каждого, кто поддержит.
          </p>
          <div className="flex gap-2">
            <input type="text" readOnly value={refLink}
              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs truncate" />
            <button onClick={handleRefCopy}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-500 transition-colors whitespace-nowrap">
              {refCopied ? 'Скопировано!' : 'Копировать'}
            </button>
          </div>
          <p className="text-[10px] text-[var(--color-text-secondary)] mt-2">Ваша ссылка привела 0 человек</p>
        </div>
      )}

      {/* ACTIONS: голос, шеринг (главный!), календарь */}
      <div className="flex flex-wrap gap-3">
        <button onClick={handleVote}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            voted ? 'bg-purple-500/20 text-purple-300' : 'bg-linear-to-r from-purple-600 to-purple-500 text-white hover:opacity-90'
          }`}>
          <ThumbsUp className="w-5 h-5" /> {voted ? 'Голос учтён' : 'Голосовать'} ({voteCount})
        </button>

        {/* ШЕРИНГ — ГЛАВНОЕ ДЕЙСТВИЕ */}
        <button onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 font-medium hover:bg-purple-500/30 transition-all">
          <Share2 className="w-5 h-5" /> {shared ? 'Скопировано!' : `Поделиться (${collab.totalShares})`}
        </button>

        {/* Добавить в календарь */}
        {collab.scheduledDate && (
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text-secondary)] hover:text-white font-medium transition-all">
            <CalendarPlus className="w-5 h-5" /> В календарь
          </button>
        )}
      </div>

      {/* Ожидают эфира */}
      <div className="text-center py-4 bg-white/[0.02] rounded-xl">
        <p className="text-3xl font-black text-white">{collab.waiting.toLocaleString()}</p>
        <p className="text-sm text-[var(--color-text-secondary)]">человек ждут этот эфир</p>
      </div>

      {/* Schedule */}
      {collab.scheduledDate && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-bold text-green-300">Дата эфира</h2>
          </div>
          <p className="text-white text-2xl font-bold">
            {new Date(collab.scheduledDate).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      )}

      {/* Result link */}
      {collab.resultLink && (
        <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-bold mb-2">Результат коллаборации</h2>
          <a href={collab.resultLink} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-purple-300 hover:text-purple-200">
            <ExternalLink className="w-5 h-5" /> Смотреть запись
          </a>
        </div>
      )}

      {/* Topics */}
      <div className="flex flex-wrap gap-2">
        {collab.topics.map(t => (
          <span key={t} className="text-sm px-3 py-1 rounded-full bg-white/5 text-[var(--color-text-secondary)]">#{t}</span>
        ))}
      </div>
    </div>
  );
}

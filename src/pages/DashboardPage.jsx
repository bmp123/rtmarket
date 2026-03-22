import { TrendingUp, ThumbsUp, DollarSign, Users, Eye, Bell, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collabRequests, dashboardStats, calcEngagement } from '../data/mockData';

export default function DashboardPage() {
  const myCollabs = collabRequests.slice(0, 3); // mock: first 3 are "mine"
  const stats = dashboardStats;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-black text-white">Личный кабинет</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Мои коллабы', value: stats.proposalsSent, icon: Users, color: 'text-purple-400' },
          { label: 'Общие голоса', value: collabRequests.reduce((s, c) => s + c.votes, 0), icon: ThumbsUp, color: 'text-blue-400' },
          { label: 'Собрано', value: stats.totalEarnings.toLocaleString() + '₽', icon: DollarSign, color: 'text-green-400' },
          { label: 'Подписчики', value: stats.totalFollowers, icon: Bell, color: 'text-[var(--color-accent)]' },
        ].map(s => (
          <div key={s.label} className="bg-[var(--color-surface)] rounded-xl p-4 border border-white/5">
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* My collabs */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Мои коллаборации</h2>
        <div className="space-y-3">
          {myCollabs.map(c => {
            const fundPct = Math.round((c.funded / c.goal) * 100);
            return (
              <Link key={c.id} to={`/collab/${c.id}`}
                className="block bg-[var(--color-surface)] border border-white/10 rounded-xl p-4 hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white font-bold">{c.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      c.status === 'proposed' ? 'bg-yellow-500/15 text-yellow-300' :
                      c.status === 'confirmed' ? 'bg-green-500/15 text-green-300' :
                      c.status === 'declined' ? 'bg-white/10 text-white/50' :
                      'bg-purple-500/15 text-purple-300'
                    }`}>{c.status}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{c.votes}</p>
                    <p className="text-[10px] text-[var(--color-text-secondary)]">голосов</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{c.subscribers || 0} следят</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{fundPct}% собрано</span>
                  {c.velocityPerHour > 5 && (
                    <span className="flex items-center gap-1 text-[var(--color-accent)]"><TrendingUp className="w-3 h-3" />+{c.velocityPerHour}/ч</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Activity */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Последняя активность</h2>
        <div className="space-y-2">
          {[
            { text: 'Новое голосование за «Спор о будущем AI»', time: '2 мин. назад', type: 'vote' },
            { text: 'Кто-то сделал прогноз: «Примет»', time: '15 мин. назад', type: 'predict' },
            { text: '+500₽ поддержка от нового бэкера', time: '1 час назад', type: 'fund' },
            { text: 'Достигнут milestone: 200 голосов', time: '3 часа назад', type: 'milestone' },
            { text: 'Новый комментарий в обсуждении', time: '5 часов назад', type: 'comment' },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className={`w-2 h-2 rounded-full shrink-0 ${
                a.type === 'vote' ? 'bg-purple-400' :
                a.type === 'predict' ? 'bg-blue-400' :
                a.type === 'fund' ? 'bg-green-400' :
                a.type === 'milestone' ? 'bg-[var(--color-accent)]' :
                'bg-white/30'
              }`} />
              <span className="text-sm text-[var(--color-text-secondary)] flex-1">{a.text}</span>
              <span className="text-[10px] text-white/30 whitespace-nowrap">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges preview */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Бейджи</h2>
        <div className="flex gap-3 flex-wrap">
          {[
            { icon: '🏆', label: 'Первый коллаб', desc: 'Предложили первый коллаб' },
            { icon: '⚡', label: 'Быстрый старт', desc: '100 голосов за 24ч' },
            { icon: '🤝', label: 'Ранний сторонник', desc: 'Поддержали в первые 10' },
          ].map(b => (
            <div key={b.label} className="bg-[var(--color-surface)] border border-white/10 rounded-xl p-3 flex items-center gap-3 min-w-[200px]">
              <span className="text-2xl">{b.icon}</span>
              <div>
                <p className="text-sm text-white font-medium">{b.label}</p>
                <p className="text-[10px] text-[var(--color-text-secondary)]">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

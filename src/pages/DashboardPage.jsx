import { useState } from 'react';
import { DollarSign, Eye, Radio, Users, Handshake, TrendingUp, BarChart3, Percent } from 'lucide-react';
import { dashboardStats, collabRequests } from '../data/mockData';

const tabs = [
  { id: 'overview', label: 'Обзор' },
  { id: 'earnings', label: 'Доходы' },
  { id: 'collabs', label: 'Коллабы' },
  { id: 'audience', label: 'Аудитория' },
  { id: 'streams', label: 'Эфиры' },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const stats = dashboardStats;
  const maxEarning = Math.max(...stats.recentEarnings.map(e => e.amount));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-white mb-2">Кабинет</h1>
      <p className="text-[var(--color-text-secondary)] mb-8">Ваша статистика и коллаборации</p>

      <div className="flex gap-1 mb-8 bg-white/5 p-1 rounded-xl w-fit overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === t.id ? 'bg-white/10 text-white' : 'text-[var(--color-text-secondary)] hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<DollarSign className="w-5 h-5 text-[var(--color-accent)]" />} label="Доход за месяц" value={`${stats.monthEarnings.toLocaleString()}₽`} />
            <StatCard icon={<Eye className="w-5 h-5 text-purple-400" />} label="Среднее зрителей" value={stats.avgViewers} />
            <StatCard icon={<Handshake className="w-5 h-5 text-blue-400" />} label="Предложений (отпр/получ)" value={`${stats.proposalsSent}/${stats.proposalsReceived}`} />
            <StatCard icon={<Percent className="w-5 h-5 text-green-400" />} label="Уровень ответов" value={`${stats.responseRate}%`} />
          </div>

          <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[var(--color-accent)]" /> Доходы за неделю
            </h3>
            <div className="flex items-end gap-2 h-32">
              {stats.recentEarnings.map((e, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-[var(--color-text-secondary)]">{(e.amount / 1000).toFixed(1)}k</span>
                  <div className="w-full rounded-t-lg bg-linear-to-t from-purple-500 to-[var(--color-accent)] min-h-[4px]"
                    style={{ height: `${(e.amount / maxEarning) * 100}%` }} />
                  <span className="text-[10px] text-white/30">{e.date.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Топ спонсоров</h3>
            <div className="space-y-3">
              {stats.topDonators.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                    <span className="text-white font-medium">{d.name}</span>
                  </div>
                  <span className="text-[var(--color-accent)] font-bold">{d.total.toLocaleString()}₽</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <StatCard icon={<DollarSign className="w-5 h-5 text-[var(--color-accent)]" />} label="Всего" value={`${stats.totalEarnings.toLocaleString()}₽`} />
            <StatCard icon={<DollarSign className="w-5 h-5 text-green-400" />} label="За месяц" value={`${stats.monthEarnings.toLocaleString()}₽`} />
            <StatCard icon={<Users className="w-5 h-5 text-purple-400" />} label="Спонсоров" value={`${stats.topDonators.length}+`} />
          </div>
          <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Источники дохода</h3>
            <div className="space-y-3">
              {[
                { label: 'Донаты в эфирах', pct: 45, color: 'from-purple-500 to-purple-400' },
                { label: 'Платные вопросы', pct: 25, color: 'from-[var(--color-accent)] to-yellow-400' },
                { label: 'Финансирование коллабов', pct: 20, color: 'from-blue-500 to-blue-400' },
                { label: 'Подписки', pct: 10, color: 'from-green-500 to-emerald-400' },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">{s.label}</span>
                    <span className="text-[var(--color-text-secondary)]">{s.pct}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-linear-to-r ${s.color}`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'collabs' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <StatCard icon={<Handshake className="w-5 h-5 text-purple-400" />} label="Предложений отправлено" value={stats.proposalsSent} />
            <StatCard icon={<Handshake className="w-5 h-5 text-blue-400" />} label="Предложений получено" value={stats.proposalsReceived} />
            <StatCard icon={<Percent className="w-5 h-5 text-green-400" />} label="Уровень ответов" value={`${stats.responseRate}%`} />
          </div>
          <div className="space-y-3">
            {collabRequests.map(c => (
              <a key={c.id} href={`#/collab/${c.id}`}
                className="block bg-[var(--color-surface)] border border-white/10 rounded-xl p-4 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-bold text-sm">{c.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    c.status === 'declined' ? 'bg-white/10 text-[var(--color-text-secondary)]' :
                    c.status === 'confirmed' ? 'bg-green-500/15 text-green-300' :
                    c.status === 'proposed' ? 'bg-yellow-500/15 text-yellow-300' :
                    'bg-purple-500/15 text-purple-300'
                  }`}>
                    {c.status === 'declined' ? 'Отклонено' :
                     c.status === 'confirmed' ? 'Запланировано' :
                     c.status === 'proposed' ? 'Ожидает' :
                     c.status === 'open' ? 'Открыто' : 'Принято'}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {c.votes} голосов • {c.funded.toLocaleString()}₽ • {c.subscribers} подписчиков
                </p>
              </a>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'audience' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <StatCard icon={<Users className="w-5 h-5 text-purple-400" />} label="Подписчиков" value={stats.totalFollowers.toLocaleString()} />
            <StatCard icon={<Eye className="w-5 h-5 text-[var(--color-accent)]" />} label="Всего зрителей" value={stats.totalViewers.toLocaleString()} />
            <StatCard icon={<TrendingUp className="w-5 h-5 text-green-400" />} label="Средне в эфире" value={stats.avgViewers} />
          </div>
          <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-2">Рост аудитории</h3>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Аналитика по росту аудитории будет доступна после подключения.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'streams' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <StatCard icon={<Radio className="w-5 h-5 text-red-400" />} label="Всего эфиров" value={stats.totalStreams} />
            <StatCard icon={<DollarSign className="w-5 h-5 text-[var(--color-accent)]" />} label="Средний доход с эфира" value={`${Math.round(stats.totalEarnings / stats.totalStreams).toLocaleString()}₽`} />
          </div>
          <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Запланировать эфир</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[var(--color-text-secondary)] mb-1 block">Платформа</label>
                <select className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50">
                  <option>YouTube</option><option>VK Video</option><option>Twitch</option><option>Rutube</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-[var(--color-text-secondary)] mb-1 block">Ссылка на эфир / Embed URL</label>
                <input type="text" placeholder="https://youtube.com/embed/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="text-sm text-[var(--color-text-secondary)] mb-1 block">Название</label>
                <input type="text" placeholder="Тема эфира"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50" />
              </div>
              <button className="px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-purple-500 text-white font-medium hover:opacity-90">
                Создать эфир
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs text-[var(--color-text-secondary)]">{label}</span></div>
      <div className="text-2xl font-black text-white">{value}</div>
    </div>
  );
}

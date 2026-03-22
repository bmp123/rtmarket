import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Eye, Send, Heart, MessageSquare, HelpCircle } from 'lucide-react';
import { liveStreams, pastStreams, chatMessages } from '../data/mockData';
import LiveBadge from '../components/LiveBadge';

const reactions = [
  { emoji: '👏', count: 234 },
  { emoji: '🔥', count: 156 },
  { emoji: '😂', count: 89 },
  { emoji: '🤔', count: 67 },
  { emoji: '❤️', count: 178 },
  { emoji: '💡', count: 45 },
];

export default function StreamPage() {
  const { id } = useParams();
  const stream = [...liveStreams, ...pastStreams].find(s => s.id === id) || liveStreams[0];
  const [chatInput, setChatInput] = useState('');
  const [showDonate, setShowDonate] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [reactionCounts, setReactionCounts] = useState(reactions.map(r => r.count));

  const handleReaction = (i) => {
    setReactionCounts(prev => prev.map((c, idx) => idx === i ? c + 1 : c));
  };

  const isLive = stream.isLive;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video bg-[var(--color-surface)] border border-white/10 rounded-2xl overflow-hidden relative">
            {stream.thumbnail ? (
              <img src={stream.thumbnail} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-4xl mb-2">📺</div>
                  <p className="text-white font-bold">{stream.embedPlatform || 'YouTube'}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    Видео с внешней платформы
                  </p>
                </div>
              </div>
            )}
            {isLive && <div className="absolute top-4 left-4"><LiveBadge /></div>}
          </div>

          <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-xl font-bold text-white">{stream.title}</h1>
              {isLive && (
                <div className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] shrink-0">
                  <Eye className="w-4 h-4" /> {stream.viewers}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 mb-4">
              <img src={stream.author.avatar} alt="" className="w-10 h-10 rounded-full ring-2 ring-purple-500/20" />
              <div>
                <p className="text-white font-medium">{stream.author.name}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {isLive ? `${stream.viewers} зрителей • 💰 ${stream.donations?.toLocaleString()}₽` : `${stream.viewers} просмотров • ${stream.duration}`}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {reactions.map((r, i) => (
                <button key={r.emoji} onClick={() => handleReaction(i)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm"
                >
                  <span>{r.emoji}</span>
                  <span className="text-[var(--color-text-secondary)]">{reactionCounts[i]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl flex flex-col h-[600px]">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-white font-bold flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Чат
            </h2>
            {isLive && <LiveBadge size="sm" />}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map(m => (
              <div key={m.id} className={`text-sm ${
                m.type === 'donation' ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 rounded-xl p-2'
                : m.type === 'paid_question' ? 'bg-purple-500/10 border border-purple-500/20 rounded-xl p-2' : ''
              }`}>
                {m.type === 'donation' ? (
                  <div>
                    <span className="text-[var(--color-accent)] font-bold">{m.user}</span>
                    <span className="text-[var(--color-accent)]"> {m.amount}₽</span>
                  </div>
                ) : m.type === 'paid_question' ? (
                  <div>
                    <span className="text-purple-300 font-bold">{m.user}</span>
                    <span className="text-purple-300 text-xs ml-1">({m.amount}₽)</span>
                    <p className="text-white mt-0.5">{m.text}</p>
                  </div>
                ) : (
                  <div>
                    <span className="text-[var(--color-text-secondary)] font-medium">{m.user}:</span>
                    <span className="text-white ml-1">{m.text}</span>
                  </div>
                )}
                <div className="text-[10px] text-white/20 mt-0.5">{m.time}</div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-white/5">
            <div className="flex gap-2 mb-2">
              <button onClick={() => setShowDonate(true)}
                className="px-3 py-1.5 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs font-medium hover:bg-[var(--color-accent)]/20"
              >
                <Heart className="w-3 h-3 inline mr-1" /> Донат
              </button>
              <button onClick={() => setShowQuestion(true)}
                className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-300 text-xs font-medium hover:bg-purple-500/20"
              >
                <HelpCircle className="w-3 h-3 inline mr-1" /> Вопрос
              </button>
            </div>
            <div className="flex gap-2">
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                placeholder="Сообщение..."
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
              />
              <button className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDonate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-4">Отправить донат</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[100, 300, 500, 1000].map(a => (
                <button key={a} className="py-3 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] font-bold hover:bg-[var(--color-accent)]/20">
                  {a}₽
                </button>
              ))}
            </div>
            <button onClick={() => setShowDonate(false)} className="w-full py-2 text-[var(--color-text-secondary)] hover:text-white text-sm">Закрыть</button>
          </div>
        </div>
      )}

      {showQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-4">Платный вопрос</h3>
            <textarea rows={3} placeholder="Ваш вопрос..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 mb-3 focus:outline-none focus:border-purple-500/50 resize-none"
            />
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[100, 200, 500, 1000].map(a => (
                <button key={a} className="py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-bold hover:bg-purple-500/20 text-sm">
                  {a}₽
                </button>
              ))}
            </div>
            <button onClick={() => setShowQuestion(false)} className="w-full py-2 text-[var(--color-text-secondary)] hover:text-white text-sm">Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}

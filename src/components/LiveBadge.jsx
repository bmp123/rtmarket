export default function LiveBadge({ size = 'sm' }) {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  };
  return (
    <span className={`bg-live text-white font-bold rounded-full ${sizes[size]} flex items-center gap-1`}>
      <span className="w-2 h-2 bg-white rounded-full animate-pulse-live" />
      LIVE
    </span>
  );
}

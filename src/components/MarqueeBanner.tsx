interface MarqueeBannerProps {
  texts: string[];
  bgClassName?: string;
  textClassName?: string;
  borderClassName?: string;
  durationSec?: number;
}

export default function MarqueeBanner({
  texts,
  bgClassName = 'bg-amber-50',
  textClassName = 'text-amber-900',
  borderClassName = 'border-amber-400',
  durationSec = 22,
}: MarqueeBannerProps) {
  const combined = texts.join('   ');
  return (
    <div
      className={`group relative my-6 overflow-hidden rounded-md border ${borderClassName} ${bgClassName}`}
      role="marquee"
      aria-label="Important notice"
    >
      <div
        className={`flex whitespace-nowrap py-2 font-semibold ${textClassName}`}
        style={{
          animation: `bs-marquee ${durationSec}s linear infinite`,
          animationPlayState: 'running',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
      >
        <span className="px-4">{combined}</span>
        <span className="px-4" aria-hidden="true">{combined}</span>
      </div>
      <style>{`
        @keyframes bs-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

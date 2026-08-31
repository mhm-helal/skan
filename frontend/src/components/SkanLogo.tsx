export default function SkanLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="houseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      <path d="M50 8L5 45H15V85H40V60H60V85H85V45H95L50 8Z" fill="url(#houseGrad)" />
      <path d="M50 8L5 45H95L50 8Z" fill="url(#roofGrad)" opacity="0.9" />
      <rect x="40" y="60" width="20" height="25" rx="2" fill="#1e1b4b" />
      <rect x="43" y="63" width="6" height="8" rx="1" fill="#c084fc" opacity="0.7" />
      <rect x="51" y="63" width="6" height="8" rx="1" fill="#c084fc" opacity="0.7" />
      <circle cx="55" cy="75" r="1.5" fill="#fbbf24" />
      <rect x="18" y="52" width="18" height="14" rx="3" fill="#1e1b4b" />
      <rect x="20" y="54" width="6" height="5" rx="1" fill="#93c5fd" opacity="0.6" />
      <rect x="28" y="54" width="6" height="5" rx="1" fill="#93c5fd" opacity="0.6" />
      <rect x="20" y="61" width="6" height="3" rx="1" fill="#93c5fd" opacity="0.4" />
      <rect x="28" y="61" width="6" height="3" rx="1" fill="#93c5fd" opacity="0.4" />
      <rect x="64" y="52" width="18" height="14" rx="3" fill="#1e1b4b" />
      <rect x="66" y="54" width="6" height="5" rx="1" fill="#93c5fd" opacity="0.6" />
      <rect x="74" y="54" width="6" height="5" rx="1" fill="#93c5fd" opacity="0.6" />
      <rect x="66" y="61" width="6" height="3" rx="1" fill="#93c5fd" opacity="0.4" />
      <rect x="74" y="61" width="6" height="3" rx="1" fill="#93c5fd" opacity="0.4" />
      <rect x="72" y="20" width="10" height="25" rx="2" fill="#6b21a8" />
      <rect x="72" y="18" width="12" height="4" rx="2" fill="#7c3aed" />
      <circle cx="77" cy="15" r="3" fill="#fbbf24" opacity="0.5" />
    </svg>
  );
}

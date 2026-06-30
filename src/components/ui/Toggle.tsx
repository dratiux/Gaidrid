interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  size?: 'sm' | 'md';
}

export function Toggle({ checked, onChange, size = 'sm' }: ToggleProps) {
  const dims = size === 'sm'
    ? { track: 'w-7 h-4', thumb: 'w-3 h-3', on: 'translate-x-[14px]', off: 'translate-x-[2px]' }
    : { track: 'w-8 h-[18px]', thumb: 'w-[12px] h-[12px]', on: 'translate-x-[16px]', off: 'translate-x-[2px]' };

  return (
    <button
      type="button"
      onClick={onChange}
      className={`${dims.track} rounded-full shrink-0 transition-colors relative cursor-pointer ${
        checked
          ? 'bg-theme-accent/80'
          : 'bg-theme-input-bg border border-theme-border/50'
      }`}
    >
      <div
        className={`absolute top-1/2 -translate-y-1/2 ${dims.thumb} rounded-full bg-theme-card shadow-sm transition-transform duration-200 ${
          checked ? dims.on : dims.off
        }`}
      />
    </button>
  );
}

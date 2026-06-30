interface TextInputProps {
  label?: string;
  className?: string;
  [key: string]: unknown;
}

export function TextInput({ label, className = '', ...props }: TextInputProps) {
  return (
    <div>
      {label && (
        <label className="text-[9px] font-black uppercase tracking-wider text-theme-text-muted block mb-1.5 font-mono">
          {label}
        </label>
      )}
      <input
        className={`w-full text-xs px-3.5 py-2.5 rounded-xl bg-theme-input-bg border border-theme-border text-theme-text placeholder-theme-text-muted/40 focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 transition-all font-semibold ${className}`}
        {...props}
      />
    </div>
  );
}

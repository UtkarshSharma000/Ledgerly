import { Check, Moon, Palette, Sun, X } from 'lucide-react';
import type { CSSProperties } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface ColorScheme {
  id: string;
  name: string;
  light: { accent: string; soft: string; strong: string };
  dark: { accent: string; soft: string; strong: string };
}

export const colorSchemes: ColorScheme[] = [
  { id: 'cobalt', name: 'Cobalt', light: { accent: '#2563eb', soft: '#eff6ff', strong: '#1d4ed8' }, dark: { accent: '#60a5fa', soft: '#172554', strong: '#93c5fd' } },
  { id: 'forest', name: 'Forest', light: { accent: '#15803d', soft: '#f0fdf4', strong: '#166534' }, dark: { accent: '#4ade80', soft: '#052e16', strong: '#86efac' } },
  { id: 'teal', name: 'Teal', light: { accent: '#0f766e', soft: '#f0fdfa', strong: '#115e59' }, dark: { accent: '#2dd4bf', soft: '#042f2e', strong: '#5eead4' } },
  { id: 'indigo', name: 'Indigo', light: { accent: '#4f46e5', soft: '#eef2ff', strong: '#4338ca' }, dark: { accent: '#818cf8', soft: '#1e1b4b', strong: '#a5b4fc' } },
  { id: 'violet', name: 'Violet', light: { accent: '#7c3aed', soft: '#f5f3ff', strong: '#6d28d9' }, dark: { accent: '#a78bfa', soft: '#2e1065', strong: '#c4b5fd' } },
  { id: 'plum', name: 'Plum', light: { accent: '#a21caf', soft: '#fdf4ff', strong: '#86198f' }, dark: { accent: '#e879f9', soft: '#4a044e', strong: '#f0abfc' } },
  { id: 'rose', name: 'Rose', light: { accent: '#e11d48', soft: '#fff1f2', strong: '#be123c' }, dark: { accent: '#fb7185', soft: '#4c0519', strong: '#fda4af' } },
  { id: 'amber', name: 'Amber', light: { accent: '#b45309', soft: '#fffbeb', strong: '#92400e' }, dark: { accent: '#fbbf24', soft: '#451a03', strong: '#fcd34d' } },
  { id: 'copper', name: 'Copper', light: { accent: '#c2410c', soft: '#fff7ed', strong: '#9a3412' }, dark: { accent: '#fb923c', soft: '#431407', strong: '#fdba74' } },
  { id: 'graphite', name: 'Graphite', light: { accent: '#334155', soft: '#f8fafc', strong: '#0f172a' }, dark: { accent: '#cbd5e1', soft: '#1e293b', strong: '#f1f5f9' } },
];

interface AppearanceSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ThemeMode;
  scheme: string;
  onModeChange: (mode: ThemeMode) => void;
  onSchemeChange: (scheme: string) => void;
}

export function getThemeStyle(mode: ThemeMode, schemeId: string): CSSProperties {
  const scheme = colorSchemes.find((item) => item.id === schemeId) ?? colorSchemes[0];
  const palette = scheme[mode];
  return {
    '--accent': palette.accent,
    '--accent-soft': palette.soft,
    '--accent-strong': palette.strong,
    '--color-primary-50': palette.soft,
    '--color-primary-100': palette.soft,
    '--color-primary-500': palette.accent,
    '--color-primary-600': palette.accent,
    '--color-primary-700': palette.strong,
  } as CSSProperties;
}

export default function AppearanceSettings({ isOpen, onClose, mode, scheme, onModeChange, onSchemeChange }: AppearanceSettingsProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-12 z-50 w-[310px] rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-2xl shadow-black/15">
      <div className="flex items-center justify-between">
        <div><p className="text-sm font-bold text-[var(--app-text)]">Appearance</p><p className="mt-0.5 text-xs text-[var(--app-muted)]">Saved on this device</p></div>
        <button type="button" onClick={onClose} title="Close appearance settings" className="rounded-md p-1.5 text-[var(--app-muted)] transition-colors hover:bg-[var(--app-hover)] hover:text-[var(--app-text)]"><X className="h-4 w-4" /></button>
      </div>
      <div className="mt-5 grid grid-cols-2 rounded-md border border-[var(--app-border)] bg-[var(--app-panel)] p-1">
        <button type="button" onClick={() => onModeChange('light')} className={`inline-flex items-center justify-center gap-2 rounded px-3 py-2 text-xs font-semibold transition-colors ${mode === 'light' ? 'bg-[var(--app-surface)] text-[var(--app-text)] shadow-sm' : 'text-[var(--app-muted)]'}`}><Sun className="h-3.5 w-3.5" /> Light</button>
        <button type="button" onClick={() => onModeChange('dark')} className={`inline-flex items-center justify-center gap-2 rounded px-3 py-2 text-xs font-semibold transition-colors ${mode === 'dark' ? 'bg-[var(--app-surface)] text-[var(--app-text)] shadow-sm' : 'text-[var(--app-muted)]'}`}><Moon className="h-3.5 w-3.5" /> Dark</button>
      </div>
      <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-[var(--app-muted)]"><Palette className="h-3.5 w-3.5" /> Color system</div>
      <div className="mt-3 grid grid-cols-5 gap-3">
        {colorSchemes.map((item) => {
          const swatch = item[mode];
          const selected = item.id === scheme;
          return <button key={item.id} type="button" title={item.name} aria-label={`Use ${item.name} color system`} onClick={() => onSchemeChange(item.id)} className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-transform hover:scale-110 ${selected ? 'border-[var(--app-text)]' : 'border-transparent'}`} style={{ backgroundColor: swatch.accent }}>{selected && <Check className="h-4 w-4 text-white" strokeWidth={3} />}</button>;
        })}
      </div>
    </div>
  );
}

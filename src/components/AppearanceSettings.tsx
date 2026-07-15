import { Check, Moon, Palette, Sun, X } from 'lucide-react';
import type { CSSProperties } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemePalette {
  page: string;
  surface: string;
  sidebar: string;
  panel: string;
  border: string;
  text: string;
  muted: string;
  faint: string;
  hover: string;
  accent: string;
  soft: string;
  strong: string;
}

export interface ColorScheme {
  id: string;
  name: string;
  light: ThemePalette;
  dark: ThemePalette;
}

export const colorSchemes: ColorScheme[] = [
  { id: 'linen', name: 'Linen', light: { page: '#f6f1e7', surface: '#fffdf8', sidebar: '#f0e6d4', panel: '#f8f1e5', border: '#e2d5be', text: '#332b21', muted: '#786d5c', faint: '#a79a87', hover: '#eee3cf', accent: '#8b5e3c', soft: '#f2e3d0', strong: '#67432b' }, dark: { page: '#1d1712', surface: '#282019', sidebar: '#211a14', panel: '#31271f', border: '#44382d', text: '#f2eadc', muted: '#c2b5a2', faint: '#897b68', hover: '#372c22', accent: '#d7a46d', soft: '#4b3422', strong: '#efc18c' } },
  { id: 'tea', name: 'Tea Garden', light: { page: '#f1f3e9', surface: '#fcfdf7', sidebar: '#e5ead9', panel: '#eef1e5', border: '#d2dac2', text: '#283126', muted: '#687260', faint: '#98a18e', hover: '#e1e8d4', accent: '#607451', soft: '#e0e8d6', strong: '#45553b' }, dark: { page: '#172019', surface: '#202a22', sidebar: '#1a231c', panel: '#29342b', border: '#3c4a3c', text: '#e7eee2', muted: '#b3bfae', faint: '#778477', hover: '#303d31', accent: '#9eb88b', soft: '#34462f', strong: '#c3d6b1' } },
  { id: 'oat', name: 'Oat', light: { page: '#f7f4ee', surface: '#fffdfa', sidebar: '#eee9df', panel: '#f5f1e9', border: '#ddd5c8', text: '#34312d', muted: '#777169', faint: '#a59d93', hover: '#e9e3d9', accent: '#756458', soft: '#e9dfd3', strong: '#574940' }, dark: { page: '#1b1a18', surface: '#252321', sidebar: '#1f1e1c', panel: '#2e2b28', border: '#423f3a', text: '#efebe5', muted: '#bbb4ab', faint: '#817970', hover: '#36322e', accent: '#c4b6a7', soft: '#3d3732', strong: '#e2d7ca' } },
  { id: 'clay', name: 'Clay', light: { page: '#faf2ed', surface: '#fffaf6', sidebar: '#f3e5dc', panel: '#f9eee8', border: '#e9d2c4', text: '#3b2a25', muted: '#80665e', faint: '#b29389', hover: '#f2ded3', accent: '#a85f4a', soft: '#f4ded3', strong: '#7d4535' }, dark: { page: '#211714', surface: '#2c1f1b', sidebar: '#251a16', panel: '#35251f', border: '#4b342b', text: '#f4e6df', muted: '#c7aba0', faint: '#90746a', hover: '#402c25', accent: '#d99881', soft: '#513125', strong: '#efb09a' } },
  { id: 'terrace', name: 'Terrace', light: { page: '#f5f5ee', surface: '#fefff9', sidebar: '#e9ebdc', panel: '#f2f4e9', border: '#d9ddc8', text: '#2e3427', muted: '#6d7561', faint: '#9ba38f', hover: '#e5e9d5', accent: '#7e8253', soft: '#e5e9cf', strong: '#5e623d' }, dark: { page: '#1b1d15', surface: '#25291d', sidebar: '#202419', panel: '#2f3425', border: '#454b35', text: '#edf0df', muted: '#b7bca5', faint: '#7f856f', hover: '#383e2b', accent: '#b9bd7a', soft: '#41482d', strong: '#d8dc99' } },
  { id: 'mist', name: 'Mist', light: { page: '#f1f5f4', surface: '#fbfdfc', sidebar: '#e5eeec', panel: '#eef4f2', border: '#d2e0dd', text: '#263331', muted: '#64736f', faint: '#91a09c', hover: '#e0ebe8', accent: '#4e7771', soft: '#dcebe7', strong: '#365752' }, dark: { page: '#16201f', surface: '#1d2a28', sidebar: '#192321', panel: '#24332f', border: '#354943', text: '#e4efec', muted: '#aabdb8', faint: '#748783', hover: '#2b3c38', accent: '#7fb9ae', soft: '#2f4a44', strong: '#a7d6cc' } },
  { id: 'harbor', name: 'Harbor', light: { page: '#f0f5f6', surface: '#fbfdfe', sidebar: '#e2ebee', panel: '#edf3f5', border: '#ccdce1', text: '#24343a', muted: '#5e727a', faint: '#8ea1a7', hover: '#dce9ed', accent: '#3d6f81', soft: '#dbeaf0', strong: '#295263' }, dark: { page: '#142025', surface: '#1b2a30', sidebar: '#17242a', panel: '#22343b', border: '#334b54', text: '#e2eff3', muted: '#a9bec5', faint: '#728991', hover: '#293d45', accent: '#7db0c2', soft: '#2c4a55', strong: '#a6d4e3' } },
  { id: 'dusk', name: 'Dusk', light: { page: '#f3f2f7', surface: '#fdfcff', sidebar: '#e9e7f0', panel: '#f1eff6', border: '#d9d4e5', text: '#302d3c', muted: '#6d687c', faint: '#9892a5', hover: '#e5e1ed', accent: '#68638b', soft: '#e6e2f0', strong: '#4e496d' }, dark: { page: '#1b1924', surface: '#252230', sidebar: '#201d29', panel: '#2d2939', border: '#443e55', text: '#eeeaf5', muted: '#bbb3ca', faint: '#817994', hover: '#352f43', accent: '#aaa1d2', soft: '#3e3654', strong: '#ccc3ed' } },
  { id: 'rosewood', name: 'Rosewood', light: { page: '#f8f1f1', surface: '#fffafa', sidebar: '#f1e3e3', panel: '#f7eded', border: '#e5cfcf', text: '#3b292c', muted: '#7d6267', faint: '#ad8e94', hover: '#f0dedd', accent: '#98616b', soft: '#f1dde0', strong: '#74454e' }, dark: { page: '#211719', surface: '#2b1e21', sidebar: '#251a1d', panel: '#342529', border: '#4b3439', text: '#f2e5e7', muted: '#c7a9af', faint: '#906f76', hover: '#402c31', accent: '#d79aa5', soft: '#513138', strong: '#efb3bd' } },
  { id: 'ink', name: 'Ink', light: { page: '#f2f4f5', surface: '#fcfdfd', sidebar: '#e6eaec', panel: '#f0f3f4', border: '#d6dcde', text: '#242b2e', muted: '#626d72', faint: '#929ca1', hover: '#e2e7e8', accent: '#48585d', soft: '#dee5e6', strong: '#334247' }, dark: { page: '#141719', surface: '#1d2224', sidebar: '#181c1e', panel: '#252c2e', border: '#3a4346', text: '#e9edef', muted: '#b0babd', faint: '#778185', hover: '#2c3436', accent: '#aab7ba', soft: '#364144', strong: '#d3dcde' } },
];

interface AppearanceSettingsProps { isOpen: boolean; onClose: () => void; mode: ThemeMode; scheme: string; onModeChange: (mode: ThemeMode) => void; onSchemeChange: (scheme: string) => void; }

export function getThemeStyle(mode: ThemeMode, schemeId: string): CSSProperties {
  const scheme = colorSchemes.find((item) => item.id === schemeId) ?? colorSchemes[0];
  const palette = scheme[mode];
  return {
    '--app-page': palette.page, '--app-surface': palette.surface, '--app-sidebar': palette.sidebar, '--app-panel': palette.panel, '--app-border': palette.border, '--app-text': palette.text, '--app-muted': palette.muted, '--app-faint': palette.faint, '--app-hover': palette.hover,
    '--accent': palette.accent, '--accent-soft': palette.soft, '--accent-strong': palette.strong,
    '--color-primary-50': palette.soft, '--color-primary-100': palette.soft, '--color-primary-500': palette.accent, '--color-primary-600': palette.accent, '--color-primary-700': palette.strong,
  } as CSSProperties;
}

export default function AppearanceSettings({ isOpen, onClose, mode, scheme, onModeChange, onSchemeChange }: AppearanceSettingsProps) {
  if (!isOpen) return null;
  return <div className="absolute right-0 top-12 z-50 w-[310px] rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-2xl shadow-black/15">
    <div className="flex items-center justify-between"><div><p className="text-sm font-bold text-[var(--app-text)]">Appearance</p><p className="mt-0.5 text-xs text-[var(--app-muted)]">Saved on this device</p></div><button type="button" onClick={onClose} title="Close appearance settings" className="rounded-md p-1.5 text-[var(--app-muted)] transition-colors hover:bg-[var(--app-hover)] hover:text-[var(--app-text)]"><X className="h-4 w-4" /></button></div>
    <div className="mt-5 grid grid-cols-2 rounded-md border border-[var(--app-border)] bg-[var(--app-panel)] p-1"><button type="button" onClick={() => onModeChange('light')} className={`inline-flex items-center justify-center gap-2 rounded px-3 py-2 text-xs font-semibold transition-colors ${mode === 'light' ? 'bg-[var(--app-surface)] text-[var(--app-text)] shadow-sm' : 'text-[var(--app-muted)]'}`}><Sun className="h-3.5 w-3.5" /> Light</button><button type="button" onClick={() => onModeChange('dark')} className={`inline-flex items-center justify-center gap-2 rounded px-3 py-2 text-xs font-semibold transition-colors ${mode === 'dark' ? 'bg-[var(--app-surface)] text-[var(--app-text)] shadow-sm' : 'text-[var(--app-muted)]'}`}><Moon className="h-3.5 w-3.5" /> Dark</button></div>
    <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-[var(--app-muted)]"><Palette className="h-3.5 w-3.5" /> Complete color system</div>
    <div className="mt-3 grid grid-cols-5 gap-3">{colorSchemes.map((item) => { const swatch = item[mode]; const selected = item.id === scheme; return <button key={item.id} type="button" title={item.name} aria-label={`Use ${item.name} color system`} onClick={() => onSchemeChange(item.id)} className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-transform hover:scale-110 ${selected ? 'border-[var(--app-text)]' : 'border-transparent'}`} style={{ backgroundColor: swatch.accent }}>{selected && <Check className="h-4 w-4 text-white" strokeWidth={3} />}</button>; })}</div>
  </div>;
}

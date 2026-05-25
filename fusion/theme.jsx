// fusion/theme.jsx
// Shared brutalist theme + system-color-scheme detection hook.
// Theme mode: 'system' | 'light' | 'dark'. When 'system', tracks
// prefers-color-scheme and reflects user-OS changes live.

function useSystemColorScheme(themePref = 'system') {
  const get = () => (typeof window !== 'undefined'
    && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  const [sys, setSys] = React.useState(get);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const h = (e) => setSys(e.matches ? 'dark' : 'light');
    if (mq.addEventListener) mq.addEventListener('change', h);
    else mq.addListener(h);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', h);
      else mq.removeListener(h);
    };
  }, []);
  return themePref === 'system' ? sys : themePref;
}

function FusionTheme(mode, accent) {
  const dark = mode === 'dark';
  return {
    dark, mode, accent: accent || (dark ? '#ff3a25' : '#dd2a1f'),
    bg:       dark ? '#0a0a0a' : '#ece8df',
    paper:    dark ? '#141414' : '#f5f1e8',
    paperHi:  dark ? '#1c1c1c' : '#fbf8f0',
    ink:      dark ? '#ece8df' : '#0a0a0a',
    inkDim:   dark ? '#a8a39a' : '#3d3a35',
    inkMute:  dark ? '#6a6760' : '#7a7670',
    line:     dark ? 'rgba(236,232,223,0.2)'  : 'rgba(10,10,10,0.2)',
    lineSoft: dark ? 'rgba(236,232,223,0.08)' : 'rgba(10,10,10,0.08)',
    onAccent: '#ffffff',
    serif:   '"Instrument Serif", "Newsreader", "Noto Serif SC", "Songti SC", Georgia, serif',
    display: '"Archivo Black", "Inter", "Noto Sans SC", system-ui, sans-serif',
    sans:    '"Space Grotesk", "Inter", "Noto Sans SC", system-ui, sans-serif',
    mono:    '"IBM Plex Mono", "JetBrains Mono", monospace',
  };
}

window.useSystemColorScheme = useSystemColorScheme;
window.FusionTheme = FusionTheme;

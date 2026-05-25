// fusion/home.jsx
// Brutalist home page (direction 2's grammar) with a giant "ASK ME"
// search-styled hero block as the primary CTA. Clicking opens the
// FusionChatPanel as a slide-in side panel (desktop) or full-screen
// takeover (mobile). ESC closes.

function FusionHome({ themePref, onSetThemePref }) {
  const mode = useSystemColorScheme(themePref);
  const t = FusionTheme(mode);
  const D = window.SITE_DATA;

  const [chatOpen, setChatOpen] = React.useState(false);
  const [seed, setSeed] = React.useState(null);

  const open = (seedKind) => { setSeed(seedKind || null); setChatOpen(true); };
  const close = () => setChatOpen(false);

  React.useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') setChatOpen(false); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);

  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth < 720);
  React.useEffect(() => {
    const r = () => setIsMobile(window.innerWidth < 720);
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);

  return (
    <div style={{
      minHeight: '100vh', background: t.bg, color: t.ink,
      fontFamily: t.sans, position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid overlay (cosmetic) */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(90deg, ${t.lineSoft} 1px, transparent 1px)`,
        backgroundSize: 'calc(100% / 12) 100%',
      }} />

      {/* Top bar */}
      <div style={{
        height: 56, borderBottom: `1px solid ${t.line}`,
        display: 'flex', alignItems: 'center', padding: '0 clamp(20px, 4vw, 36px)',
        justifyContent: 'space-between', position: 'relative',
        fontFamily: t.mono, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src="assets/portrait.png" alt={D.name} className="hover-photo"
               style={{ width: 28, height: 28, objectFit: 'cover',
                        border: `1.5px solid ${t.ink}`, flexShrink: 0 }} />
          <span style={{ fontWeight: 700, color: t.ink }}><span>{D.name}</span> <span className="fusion-topname-en">· {D.nameEN.toUpperCase()}</span></span>
          <span style={{ width: 6, height: 6, background: t.accent, borderRadius: '50%', flexShrink: 0 }} title="open to work" />
        </div>
        <div style={{ display: 'flex', gap: 18, color: t.inkDim }} className="fusion-nav">
          {[
            { en: 'INDEX',   zh: '索引',     s: 'intro',    href: null },
            { en: 'WORK',    zh: '工作',     s: null,       href: 'work.html' },
            { en: 'WORDS',   zh: '文章',     s: 'articles', href: null },
            { en: 'NOW',     zh: '现在',     s: 'now',      href: null },
            { en: 'CONTACT', zh: '联系我们', s: 'contact',  href: null },
          ].map((n, i) => (
            <a key={n.en}
               href={n.href || undefined}
               onClick={(e) => { if (!n.href) { e.preventDefault(); open(n.s); } }}
               className="hover-link"
               style={{ cursor: 'pointer', color: i === 0 ? t.ink : t.inkDim,
                        display: 'inline-flex', alignItems: 'baseline', gap: 8,
                        textDecoration: 'none', whiteSpace: 'nowrap' }}>
              <span style={{ color: i === 0 ? t.accent : t.inkMute }}>
                {['①','②','③','④','⑤'][i]}
              </span>
              <span>{n.en}</span>
              <span style={{ color: t.inkMute, fontFamily: t.sans, fontSize: 11,
                             letterSpacing: 0, textTransform: 'none', fontWeight: 400 }}>
                {n.zh}
              </span>
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <a href="resume.pdf" download="王艺师_简历_2026.pdf"
             className="fusion-resume"
             style={{
               fontFamily: t.mono, fontSize: 10.5, letterSpacing: 1.2, color: t.ink,
               textTransform: 'uppercase', textDecoration: 'none',
               padding: '5px 10px', border: `1.5px solid ${t.ink}`,
               display: 'flex', alignItems: 'center', gap: 6,
             }}
             onMouseEnter={(e) => { e.currentTarget.style.background = t.accent; e.currentTarget.style.color = t.onAccent; e.currentTarget.style.borderColor = t.accent; }}
             onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.ink; e.currentTarget.style.borderColor = t.ink; }}>
            简历 <span className="fusion-resume-text">PDF </span><span>↓</span>
          </a>
          <ThemeChip themePref={themePref} mode={mode} onChange={onSetThemePref} t={t} />
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: 'clamp(36px, 6vw, 72px) clamp(20px, 4vw, 36px) 24px', position: 'relative' }}>
        <div className="fusion-hero" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 0.55fr)', gap: 'clamp(20px, 4vw, 60px)', alignItems: 'end' }}>
          <h1 style={{
            margin: 0, fontFamily: t.display,
            fontSize: 'clamp(54px, 11vw, 160px)',
            lineHeight: 0.88, letterSpacing: '-0.03em', fontWeight: 900,
            textTransform: 'uppercase',
          }}>
            AI<br />PRODUCT<br />MGR<span style={{ color: t.accent }}>.</span>
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 'clamp(140px, 22vw, 340px)', paddingBottom: 'clamp(4px, 1vw, 12px)' }}>
            <div style={{
              fontFamily: t.mono, fontSize: 11, color: t.inkDim,
              letterSpacing: 1.4, lineHeight: 1.7, textAlign: 'right',
              textTransform: 'uppercase',
            }}>
              一个写 PROMPT 比写 PRD 多的产品经理。<br />
              相信好工具是被反复打磨的，<br />不是被一次写完的。
            </div>
          </div>
        </div>

        {/* THE ASK ME BLOCK — brutalist search input as the centerpiece */}
        <div style={{ marginTop: 'clamp(28px, 5vw, 48px)' }}>
          <div style={{
            fontFamily: t.mono, fontSize: 11, color: t.inkDim, letterSpacing: 1.4,
            textTransform: 'uppercase', marginBottom: 12, display: 'flex', justifyContent: 'space-between',
          }}>
            <span>② 关于我 · ASK ME — 这一段是对话，不是页面。</span>
            <span style={{ color: t.accent }}>● LIVE</span>
          </div>

          <button
            onClick={() => open()}
            className="fusion-ask"
            style={{
              width: '100%', padding: 'clamp(18px, 3vw, 30px) clamp(20px, 3vw, 32px)',
              background: t.paper, color: t.ink,
              border: `2px solid ${t.ink}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 20, cursor: 'pointer', textAlign: 'left',
              fontFamily: 'inherit',
              transition: 'background 0.1s, color 0.1s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = t.accent; e.currentTarget.style.color = t.onAccent; e.currentTarget.style.borderColor = t.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = t.paper; e.currentTarget.style.color = t.ink; e.currentTarget.style.borderColor = t.ink; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, minWidth: 0, flex: 1 }}>
              <span style={{ fontFamily: t.mono, fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 700, flexShrink: 0 }}>›</span>
              <span style={{
                fontFamily: t.display, fontSize: 'clamp(20px, 3.4vw, 38px)',
                letterSpacing: '-0.02em', textTransform: 'uppercase',
                flexShrink: 0, whiteSpace: 'nowrap',
              }}>
                问我任何事
              </span>
              <span style={{
                fontFamily: t.serif, fontStyle: 'italic',
                fontSize: 'clamp(15px, 1.6vw, 19px)', opacity: 0.55,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                minWidth: 0, flex: 1,
              }} className="fusion-hide-sm">
                — projects, writing, hiring, books…
              </span>
            </div>
            <span style={{
              fontFamily: t.mono, fontSize: 'clamp(11px, 1.2vw, 14px)', letterSpacing: 1.5,
              textTransform: 'uppercase', padding: '8px 14px',
              border: '1.5px solid currentColor',
              flexShrink: 0,
            }}>OPEN ↗</span>
          </button>

          {/* Quick-fire chips below the input */}
          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { l: '介绍你自己', s: 'intro' },
              { l: '看作品 →', s: 'projects' },
              { l: '最近写了什么', s: 'articles' },
              { l: 'NOW · 在做什么', s: 'now' },
              { l: '能合作吗', s: 'hire' },
              { l: '怎么联系你', s: 'contact' },
            ].map((c, i) => (
              <button key={i} onClick={() => open(c.s)} style={{
                padding: '8px 12px', background: 'transparent', color: t.ink,
                border: `1.5px solid ${t.ink}`, fontFamily: t.mono, fontSize: 11,
                letterSpacing: 0.7, textTransform: 'uppercase', cursor: 'pointer',
                fontWeight: 500,
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = t.ink; e.currentTarget.style.color = t.bg; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.ink; }}
              >{c.l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom strip — featured work, latest writing, now */}
      <div style={{ borderTop: `1.5px solid ${t.ink}`, display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', position: 'relative' }} className="fusion-strip">
        <div style={{ padding: '20px clamp(20px, 3vw, 28px) 24px', borderRight: `1.5px solid ${t.ink}` }}>
          <div style={{ fontFamily: t.mono, fontSize: 10, color: t.inkDim, letterSpacing: 1.4, marginBottom: 14, display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => { window.location.href = 'work.html'; }}>
            <span>③ SELECTED WORK · 作品索引</span><span>{D.projects.length} ITEMS →</span>
          </div>
          {D.projects.slice(0, 4).map((p, i) => {
            const detailUrls = {
              1: 'project-agent.html',
              2: 'project-rag.html',
              3: 'project-recommend.html',
              4: 'project-dashboard.html',
            };
            const detailUrl = detailUrls[p.id] || null;
            const hasDetail = !!detailUrl;
            return (
              <a key={p.id}
                 href={detailUrl || undefined}
                 onClick={(e) => { if (!detailUrl) { e.preventDefault(); open('projects'); } }}
                 className="hover-row fusion-row"
                 style={{ display: 'grid', gridTemplateColumns: '32px 1fr 60px 80px', gap: 14, padding: '10px 0', borderBottom: i < 3 ? `1px solid ${t.line}` : 'none', alignItems: 'baseline', cursor: 'pointer', textDecoration: 'none', color: t.ink }}>
                <span style={{ fontFamily: t.mono, fontSize: 11, color: t.inkMute }}>0{i+1}</span>
                <div style={{ minWidth: 0 }}>
                  <div className="hover-name" style={{ fontFamily: t.display, fontSize: 'clamp(18px, 2.5vw, 22px)', letterSpacing: -0.5, lineHeight: 1, marginBottom: 4, transition: 'color .15s' }}>
                    {p.name.toUpperCase()}
                    {hasDetail && <span style={{ fontFamily: t.mono, fontSize: 10, color: t.accent, marginLeft: 8, letterSpacing: 0.8, fontWeight: 400 }}>↗ CASE</span>}
                  </div>
                  <div style={{ fontSize: 12, color: t.inkDim, fontFamily: t.sans }}>{p.tag}</div>
                </div>
                <span className="fusion-year" style={{ fontFamily: t.mono, fontSize: 11, color: t.inkDim }}>{p.year}</span>
                <span style={{ fontFamily: t.mono, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: p.status === 'live' ? t.accent : t.inkMute, textAlign: 'right' }}>
                  {p.status === 'live' ? '● LIVE' : '○ SUNSET'}
                </span>
              </a>
            );
          })}
        </div>

        <div style={{ padding: '20px clamp(18px, 2vw, 24px) 24px', borderRight: `1.5px solid ${t.ink}` }}>
          <div style={{ fontFamily: t.mono, fontSize: 10, color: t.inkDim, letterSpacing: 1.4, marginBottom: 14, display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => open('articles')}>
            <span>④ WORDS · 「{D.penName}」@ WOSHIPM</span><span>{D.articles.length} →</span>
          </div>
          {D.articles.slice(0, 3).map((a) => (
            <a key={a.id} href={a.url} target="_blank" rel="noreferrer"
               className="hover-row"
               style={{ padding: '9px 0', borderBottom: `1px solid ${t.line}`, cursor: 'pointer', display: 'block', textDecoration: 'none', color: t.ink }}>
              <div className="hover-name" style={{ fontFamily: t.serif, fontSize: 16, lineHeight: 1.3, marginBottom: 4, transition: 'color .15s' }}>
                {a.title}
                <span style={{ fontFamily: t.mono, fontSize: 10, color: t.accent, marginLeft: 8, letterSpacing: 0.8 }}>↗</span>
              </div>
              <div style={{ fontFamily: t.mono, fontSize: 10.5, color: t.inkDim, display: 'flex', justifyContent: 'space-between', letterSpacing: 0.5 }}>
                <span>{a.date}</span><span>{a.reads} 浏览 · #{a.tag}</span>
              </div>
            </a>
          ))}
        </div>

        <div onClick={() => open('now')} style={{ padding: '20px clamp(18px, 2vw, 24px) 24px', background: t.accent, color: t.onAccent, cursor: 'pointer' }}>
          <div style={{ fontFamily: t.mono, fontSize: 10, letterSpacing: 1.4, marginBottom: 14, opacity: 0.85, display: 'flex', justifyContent: 'space-between' }}>
            <span>⑤ NOW · 2025-05</span><span>OPEN →</span>
          </div>
          {D.now.slice(0, 3).map((n, i) => (
            <div key={i} style={{ padding: '7px 0', fontSize: 13, lineHeight: 1.4, borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.22)' : 'none', fontFamily: t.sans, fontWeight: 500 }}>
              <span style={{ fontFamily: t.mono, fontSize: 10, opacity: 0.7, marginRight: 8 }}>0{i+1}/</span>
              {n}
            </div>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div style={{ borderTop: `1.5px solid ${t.ink}`, height: 38, background: t.bg, display: 'flex', alignItems: 'center', overflow: 'hidden', fontFamily: t.display, fontSize: 13, letterSpacing: 6, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
        <div style={{ paddingLeft: '4vw', animation: 'fusion-marquee 30s linear infinite' }}>
          OPEN TO ROLES · OPEN TO COFFEE · {D.email} · 电话 {D.phone} · 招聘方请直接联系 · ASK ME ↗ · OPEN TO ROLES ·
        </div>
        <style>{`@keyframes fusion-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
      </div>

      {/* Chat overlay */}
      {chatOpen && (
        <div onClick={close} style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', justifyContent: 'flex-end',
          opacity: 1,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: isMobile ? '100%' : 'min(640px, 70vw)',
            height: '100%', background: t.bg,
            borderLeft: isMobile ? 'none' : `2px solid ${t.ink}`,
            boxShadow: isMobile ? 'none' : '-20px 0 60px rgba(0,0,0,0.3)',
          }}>
            <FusionChatPanel t={t} onClose={close} seed={seed} />
          </div>
        </div>
      )}

      <style>{`
        /* Touch device: turn hover effects into tap-feedback equivalents */
        @media (hover: none) {
          .hover-photo:active { transform: rotate(-4deg) scale(1.1); }
          .hover-row:active { background: rgba(10,10,10,0.06); }
          .hover-link:active { color: ${t.accent} !important; }
        }

        /* Tablet & below */
        @media (max-width: 900px) {
          .fusion-strip { grid-template-columns: 1fr 1fr !important; }
          .fusion-strip > div { border-right: 1.5px solid ${t.ink} !important; border-bottom: 1.5px solid ${t.ink} !important; }
          .fusion-strip > div:nth-child(2) { border-right: none !important; }
          .fusion-strip > div:last-child { grid-column: 1 / -1; border-bottom: none !important; border-right: none !important; }
        }

        /* Mobile */
        @media (max-width: 720px) {
          .fusion-hero { grid-template-columns: 1fr !important; }
          .fusion-strip { grid-template-columns: 1fr !important; }
          .fusion-strip > div { border-right: none !important; border-bottom: 1.5px solid ${t.ink} !important; }
          .fusion-strip > div:last-child { border-bottom: none !important; grid-column: auto !important; }
          .fusion-nav { display: none !important; }
          .fusion-hide-sm { display: none !important; }
          .fusion-hero > div[style*="paddingTop"] { padding-top: 12px !important; padding-bottom: 0 !important; }
          .fusion-hero > div[style*="textAlign: right"], .fusion-hero > div div[style*="textAlign: right"] { text-align: left !important; }
          .fusion-ask { flex-direction: column !important; align-items: stretch !important; gap: 12px !important; padding: 18px !important; }
          .fusion-ask > div { flex-wrap: wrap !important; }
          .fusion-resume-text { display: none !important; }
          .fusion-resume { padding: 6px 8px !important; font-size: 10px !important; }
          .fusion-row { grid-template-columns: 24px 1fr auto !important; }
          .fusion-row .fusion-year { display: none !important; }
        }

        /* Small mobile */
        @media (max-width: 420px) {
          .fusion-topname-en { display: none !important; }
          .fusion-theme-chip button { padding: 5px 7px !important; }
        }
      `}</style>
    </div>
  );
}

// Small inline control for picking theme preference.
function ThemeChip({ themePref, mode, onChange, t }) {
  const options = [
    { v: 'system', l: '自动' },
    { v: 'light',  l: '浅' },
    { v: 'dark',   l: '深' },
  ];
  return (
    <div style={{
      display: 'flex', border: `1.5px solid ${t.ink}`, fontFamily: t.mono,
      fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase',
    }} className="fusion-theme-chip">
      {options.map((o, i) => (
        <button key={o.v} onClick={() => onChange(o.v)} style={{
          padding: '5px 10px', border: 0,
          borderLeft: i > 0 ? `1px solid ${t.ink}` : 'none',
          background: themePref === o.v ? t.ink : 'transparent',
          color: themePref === o.v ? t.bg : t.ink,
          fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit',
          textTransform: 'inherit', cursor: 'pointer',
        }}>{o.l}</button>
      ))}
    </div>
  );
}

window.FusionHome = FusionHome;

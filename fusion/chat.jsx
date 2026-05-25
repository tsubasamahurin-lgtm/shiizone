// fusion/chat.jsx
// Brutalist-styled chat panel — reusable as overlay on the home page or
// standalone in an iframe embed. No bubbles: AI speaks as serif/sans
// editorial copy, user speaks as monospace right-aligned. Project cards
// have hard 1.5px borders. Input is full-width with hard edges.
//
// Interaction: small keyword-based response engine. Clicking a chip or
// typing a question appends a user message + a typed-out AI response,
// sometimes attaching cards (projects, articles, contact, now).

const D = window.SITE_DATA;

// Predefined Q&A library. Keys are normalized; matched by includes()
// against user input. Each answer can have text + an attachment kind.
const FUSION_REPLIES = [
  { match: ['介绍', '你是谁', '自我', '是谁'], kind: 'intro' },
  { match: ['作品', '项目', '做过什么', '产品', '看作品', 'projects'], kind: 'projects' },
  { match: ['文章', '写过', '博客', '观点', 'blog'], kind: 'articles' },
  { match: ['最近', 'now', '在做', '在忙'], kind: 'now' },
  { match: ['联系', '微信', 'wechat', '邮箱', '约', 'email', 'contact'], kind: 'contact' },
  { match: ['岗位', '招聘', '工作', '简历', '求职', '入职'], kind: 'hire' },
  { match: ['书', '读', '推荐'], kind: 'books' },
];

function classifyInput(text) {
  const norm = text.toLowerCase();
  for (const r of FUSION_REPLIES) {
    if (r.match.some((m) => norm.includes(m.toLowerCase()))) return r.kind;
  }
  return 'fallback';
}

function fusionAnswer(kind) {
  switch (kind) {
    case 'intro': return {
      lead: '我是 ' + D.name + '，' + D.role + '。',
      body: D.bio + ' 关注金融场景的 AI 落地，熟悉 RAG / 推荐 / Agent 三类范式。',
      cards: null, kind: 'intro',
    };
    case 'projects': return {
      lead: '我做过 ' + D.projects.length + ' 个产品。下面这几个是我最有代表性的：',
      cards: D.projects, kind: 'projects',
    };
    case 'articles': return {
      lead: '写作是我观察行业的方式。一直在写，也一直在学。最近这几篇：',
      cards: D.articles, kind: 'articles',
    };
    case 'now': return {
      lead: '这是我最近 14 天的状态——',
      body: null,
      cards: D.now, kind: 'now',
    };
    case 'contact': return {
      lead: '最快的方式：',
      body: '工作上的事用邮箱比较方便。聊天用微信。',
      cards: 'contact', kind: 'contact',
    };
    case 'hire': return {
      lead: '我适合 AI 产品负责人 / 高级 AI PM 岗位，金融或 B 端场景优先。',
      body: '9 年产品经验，9 年金融行业，3 年 AI 产品负责人。覆盖 RAG / 推荐 / Agent 三类产品的样本设计、Prompt 工程、Function Calling、人机协作分级、合规护栏与评测回归。带过 7 人小组，2 名实习生转正。简历可以直接发，留个邮箱我之后亲自回你。',
      cards: 'cta', kind: 'hire',
    };
    case 'books': return {
      lead: '今年读到现在，最推荐这三本：',
      body: '《How to Take Smart Notes》《Hooked》《The Mom Test》。前两本对 AI PM 的工作流帮助很大，第三本是用户访谈的圣经。',
      cards: null, kind: 'books',
    };
    default: return {
      lead: '这个问题没在我预设的回答里——但我会看到。',
      body: '留个邮箱，我之后亲自回你；或者直接发短信到 ' + D.phone + '。',
      cards: 'cta', kind: 'fallback',
    };
  }
}

const CHIP_QUESTIONS = [
  '介绍一下你自己',
  '看作品',
  '最近写了什么',
  'NOW · 在做什么',
  '能合作吗',
  '推荐几本书',
];

// ─────────────────────────────────────────────────────────────────────
// Cards — brutal style, hard 1.5px borders, tabular meta in mono.
// ─────────────────────────────────────────────────────────────────────

function ProjectCard({ p, t, i }) {
  return (
    <div style={{
      border: `1.5px solid ${t.ink}`, padding: '14px 16px', display: 'grid',
      gridTemplateColumns: '32px 1fr 90px', gap: 12, alignItems: 'baseline',
      background: t.paperHi,
    }}>
      <span style={{ fontFamily: t.mono, fontSize: 11, color: t.inkMute, letterSpacing: 0.6 }}>0{i + 1}</span>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 3 }}>
          <span style={{ fontFamily: t.display, fontSize: 19, letterSpacing: -0.4, textTransform: 'uppercase' }}>{p.name}</span>
          <span style={{ fontFamily: t.mono, fontSize: 10, color: t.inkMute, letterSpacing: 1 }}>{p.tag.toUpperCase()}</span>
        </div>
        <div style={{ fontFamily: t.sans, fontSize: 12.5, color: t.inkDim, lineHeight: 1.45 }}>{p.desc}</div>
      </div>
      <div style={{ fontFamily: t.mono, fontSize: 10, letterSpacing: 0.8, color: t.inkMute, textAlign: 'right', textTransform: 'uppercase' }}>
        {p.year}<br />
        <span style={{ color: p.status === 'live' ? t.accent : t.inkMute, fontWeight: 700 }}>
          {p.status === 'live' ? '● LIVE' : '○ SUNSET'}
        </span><br />
        {p.users}
      </div>
    </div>
  );
}

function ArticleRow({ a, t, last, onOpen }) {
  return (
    <div onClick={() => onOpen && onOpen(a)}
      style={{
      display: 'grid', gridTemplateColumns: '1fr auto', gap: 14, padding: '12px 0',
      borderBottom: last ? 'none' : `1px solid ${t.line}`, alignItems: 'baseline',
      color: t.ink, cursor: onOpen ? 'pointer' : 'default',
      transition: 'color .12s',
    }}
      onMouseEnter={(e) => { if (onOpen) e.currentTarget.style.color = t.accent; }}
      onMouseLeave={(e) => { if (onOpen) e.currentTarget.style.color = t.ink; }}
    >
      <span style={{ fontFamily: t.serif, fontSize: 17, lineHeight: 1.3 }}>
        {a.title}
        {onOpen && <span style={{ fontFamily: t.mono, fontSize: 10, color: t.accent, marginLeft: 8, letterSpacing: 0.6 }}>阅读 →</span>}
      </span>
      <span style={{ fontFamily: t.mono, fontSize: 10, color: t.inkMute, letterSpacing: 0.6 }}>
        {a.date} · {a.reads} · #{a.tag}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// ArticleReader — full-screen overlay article reading view.
// Opens from inside the chat. ESC or button closes. Footer has external
// link to 人人都是产品经理 original post.
// ─────────────────────────────────────────────────────────────────────

function ArticleReader({ article, onClose, t }) {
  React.useEffect(() => {
    if (!article) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [article, onClose]);

  if (!article) return null;

  const renderBody = (md) => {
    if (!md) return null;
    return md.split('\n\n').map((block, i) => {
      const trimmed = block.trim();
      if (!trimmed) return null;
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={i} style={{
            fontFamily: t.display, fontWeight: 900, fontSize: 26, letterSpacing: -0.5,
            lineHeight: 1.2, margin: '40px 0 14px',
          }}>{trimmed.slice(3)}</h2>
        );
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={i} style={{
            borderLeft: `3px solid ${t.accent}`, paddingLeft: 18, margin: '20px 0',
            fontFamily: t.serif, fontStyle: 'italic', fontSize: 18, color: t.inkDim, lineHeight: 1.55,
          }}>{trimmed.slice(2)}</blockquote>
        );
      }
      return (
        <p key={i} style={{ margin: '0 0 1.2em' }}>{trimmed}</p>
      );
    });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: t.bg, color: t.ink, zIndex: 200,
      overflowY: 'auto', fontFamily: t.sans,
    }}>
      {/* Sticky top bar */}
      <div style={{
        position: 'sticky', top: 0, background: t.bg,
        borderBottom: `1px solid ${t.line}`,
        padding: '14px clamp(20px, 4vw, 40px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 5,
      }}>
        <span style={{
          fontFamily: t.mono, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase',
          color: t.inkDim, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ width: 6, height: 6, background: t.accent }} />
          WORDS · 文章 · 阅读视图
        </span>
        <button onClick={onClose} style={{
          background: t.paper, border: `1.5px solid ${t.ink}`, color: t.ink,
          padding: '6px 12px', fontFamily: t.mono, fontSize: 11, letterSpacing: 1,
          textTransform: 'uppercase', cursor: 'pointer',
        }}>← 返回对话 / ESC</button>
      </div>

      {/* Article */}
      <article style={{
        maxWidth: 720, margin: '0 auto',
        padding: 'clamp(40px, 6vw, 72px) clamp(20px, 4vw, 40px) clamp(40px, 6vw, 64px)',
      }}>
        <div style={{
          fontFamily: t.mono, fontSize: 11, color: t.inkMute, letterSpacing: 1.2,
          marginBottom: 18, textTransform: 'uppercase',
          display: 'flex', gap: 14, flexWrap: 'wrap',
        }}>
          <span>{article.date}</span>
          <span>{article.reads} 阅读</span>
          <span>#{article.tag}</span>
          <span style={{ color: t.accent }}>笔名「{D.penName}」</span>
        </div>

        <h1 style={{
          fontFamily: t.display, fontWeight: 900,
          fontSize: 'clamp(28px, 4.2vw, 48px)', lineHeight: 1.08,
          letterSpacing: '-0.025em', margin: '0 0 36px',
        }}>{article.title}</h1>

        {article.body && article.body.trim() ? (
          <div style={{
            fontFamily: t.serif, fontSize: 18, lineHeight: 1.7, color: t.ink,
          }}>
            {renderBody(article.body)}
          </div>
        ) : (
          <div style={{
            border: `1.5px dashed ${t.line}`, padding: '36px 28px',
            background: t.paperHi, textAlign: 'center',
          }}>
            <div style={{
              fontFamily: t.mono, fontSize: 11, color: t.accent, letterSpacing: 1.4,
              textTransform: 'uppercase', marginBottom: 14,
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ width: 6, height: 6, background: t.accent, borderRadius: '50%' }} />
              本文正文整理中
            </div>
            <div style={{
              fontFamily: t.serif, fontSize: 17, fontStyle: 'italic', color: t.inkDim,
              lineHeight: 1.55, maxWidth: 480, margin: '0 auto',
            }}>
              这篇文章的站内可读版本正在整理。在那之前，可以直接去人人都是产品经理读原文，下方链接一键直达。
            </div>
          </div>
        )}

        {/* Footer · External link */}
        <div style={{
          marginTop: 56, borderTop: `1.5px solid ${t.ink}`,
          borderBottom: `1.5px solid ${t.ink}`, padding: '28px 0',
        }}>
          <div style={{
            fontFamily: t.mono, fontSize: 10, letterSpacing: 1.4, color: t.inkMute,
            textTransform: 'uppercase', marginBottom: 14,
          }}>
            首发 · ORIGINAL POST
          </div>
          <a href={article.url} target="_blank" rel="noreferrer" style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: t.accent, color: t.onAccent, padding: '18px 22px',
            textDecoration: 'none', fontFamily: t.display, fontSize: 16,
            letterSpacing: 0.4, textTransform: 'uppercase',
          }}>
            <span>在人人都是产品经理阅读原文</span>
            <span style={{ fontFamily: t.mono, fontSize: 18 }}>↗</span>
          </a>
          <div style={{
            fontFamily: t.mono, fontSize: 10.5, color: t.inkMute, letterSpacing: 0.4,
            marginTop: 14, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
          }}>
            <span>笔名「{D.penName}」 · woshipm.com/u/1678654</span>
            <span>{article.url.replace('https://', '').replace('www.', '')}</span>
          </div>
        </div>

        {/* Return CTA */}
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <button onClick={onClose} style={{
            background: 'transparent', border: `1.5px solid ${t.ink}`, color: t.ink,
            padding: '12px 24px', fontFamily: t.mono, fontSize: 12, letterSpacing: 1.2,
            textTransform: 'uppercase', cursor: 'pointer',
          }}>← 返回对话</button>
        </div>
      </article>
    </div>
  );
}

function NowList({ items, t }) {
  return (
    <div style={{ background: t.accent, color: t.onAccent, padding: '14px 18px' }}>
      <div style={{ fontFamily: t.mono, fontSize: 10, letterSpacing: 1.4, opacity: 0.8, marginBottom: 10, textTransform: 'uppercase' }}>
        NOW · 2025-05
      </div>
      {items.map((n, i) => (
        <div key={i} style={{ padding: '8px 0', borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.25)' : 'none', display: 'flex', gap: 12, fontFamily: t.sans, fontSize: 13.5, lineHeight: 1.4 }}>
          <span style={{ fontFamily: t.mono, fontSize: 10, opacity: 0.7, flexShrink: 0, paddingTop: 2 }}>0{i + 1}/</span>
          <span>{n}</span>
        </div>
      ))}
    </div>
  );
}

function ContactBlock({ t }) {
  const [hoverWechat, setHoverWechat] = React.useState(false);
  const rows = [
    { k: 'EMAIL',  v: D.email,   accent: true },
    { k: 'WECHAT', v: D.wechat,  isWechat: true },
  ];
  return (
    <div style={{ border: `1.5px solid ${t.ink}`, background: t.paperHi, position: 'relative' }}>
      {rows.map((r, i) => (
        <div key={r.k} style={{
          display: 'grid', gridTemplateColumns: '90px 1fr 60px', gap: 12,
          padding: '12px 16px', borderBottom: i < rows.length - 1 ? `1px solid ${t.line}` : 'none',
          alignItems: 'baseline', position: 'relative',
        }}
          onMouseEnter={() => { if (r.isWechat) setHoverWechat(true); }}
          onMouseLeave={() => { if (r.isWechat) setHoverWechat(false); }}
        >
          <span style={{ fontFamily: t.mono, fontSize: 10, color: t.inkMute, letterSpacing: 1.2, textTransform: 'uppercase' }}>{r.k}</span>
          <span style={{ fontFamily: t.display, fontSize: r.accent ? 17 : 15, letterSpacing: -0.3, color: r.accent ? t.accent : t.ink, wordBreak: 'break-all' }}>{r.v}</span>
          <span style={{ fontFamily: t.mono, fontSize: 10, color: t.accent, letterSpacing: 1, textAlign: 'right', cursor: 'pointer' }}>
            {r.isWechat ? '悬停 ↗' : 'COPY ↗'}
          </span>

          {/* QR popover for wechat row */}
          {r.isWechat && hoverWechat && (
            <div style={{
              position: 'absolute', right: 0, top: '100%', marginTop: 8,
              zIndex: 10, background: t.bg, border: `1.5px solid ${t.ink}`,
              padding: 14, boxShadow: '6px 6px 0 rgba(0,0,0,0.12)',
              display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center',
            }}>
              <div style={{
                fontFamily: t.mono, fontSize: 10, letterSpacing: 1.4, color: t.inkMute,
                textTransform: 'uppercase', alignSelf: 'stretch',
                display: 'flex', justifyContent: 'space-between',
              }}>
                <span>WECHAT QR</span>
                <span style={{ color: t.accent }}>扫码加我</span>
              </div>
              <img src="assets/wechat-qr.jpg" alt="微信二维码"
                style={{ width: 200, height: 200, objectFit: 'cover',
                         border: `1.5px solid ${t.line}`, display: 'block' }} />
              <div style={{ fontFamily: t.serif, fontStyle: 'italic', fontSize: 12, color: t.inkDim }}>
                工作时间 · 通常 1 小时内回
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CtaBlock({ t }) {
  return (
    <div style={{ display: 'flex', gap: 0, border: `1.5px solid ${t.ink}` }}>
      <a href="resume.pdf" download="王艺师_简历_2026.pdf"
         style={{ flex: 1, padding: '14px 16px', background: t.accent, color: t.onAccent, fontFamily: t.display, fontSize: 14, letterSpacing: 0.5, textTransform: 'uppercase', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
        下载简历 PDF <span>↓</span>
      </a>
      <a href={'mailto:' + D.email} style={{ padding: '14px 16px', background: t.paper, color: t.ink, fontFamily: t.display, fontSize: 14, letterSpacing: 0.5, textTransform: 'uppercase', textDecoration: 'none', borderLeft: `1.5px solid ${t.ink}`, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
        发邮件 <span style={{ fontFamily: t.mono, color: t.inkMute, textTransform: 'none' }}>{D.email}</span>
      </a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Single message renderer
// ─────────────────────────────────────────────────────────────────────

function Message({ m, t, onOpenArticle }) {
  if (m.role === 'user') {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 28 }}>
        <div style={{ maxWidth: '85%', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <span style={{ fontFamily: t.mono, fontSize: 12, color: t.accent, paddingTop: 2 }}>&gt;</span>
          <span style={{ fontFamily: t.mono, fontSize: 13.5, lineHeight: 1.5, color: t.ink, textAlign: 'left' }}>{m.text}</span>
        </div>
      </div>
    );
  }

  // AI message
  const a = m.answer || {};
  return (
    <div style={{ marginBottom: 32, position: 'relative' }}>
      <div style={{ fontFamily: t.mono, fontSize: 10, letterSpacing: 1.4, color: t.inkMute, textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 8, height: 8, background: t.accent }} />
        <span>{D.name} · 现在</span>
        <span style={{ flex: 1, height: 1, background: t.line, marginLeft: 8 }} />
      </div>

      {a.lead && (
        <div style={{ fontFamily: t.serif, fontSize: 22, lineHeight: 1.32, marginBottom: a.body || a.cards ? 12 : 0, color: t.ink, fontStyle: 'italic' }}>
          {a.lead}
        </div>
      )}
      {a.body && (
        <div style={{ fontFamily: t.sans, fontSize: 14.5, lineHeight: 1.55, color: t.inkDim, marginBottom: a.cards ? 16 : 0 }}>
          {a.body}
        </div>
      )}

      {a.kind === 'projects' && a.cards && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {a.cards.map((p, i) => <ProjectCard key={p.id} p={p} t={t} i={i} />)}
        </div>
      )}
      {a.kind === 'articles' && a.cards && (
        <div style={{ border: `1.5px solid ${t.ink}`, padding: '0 16px', background: t.paperHi }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr auto', gap: 14,
            padding: '10px 0', borderBottom: `1.5px solid ${t.ink}`,
            fontFamily: t.mono, fontSize: 10, color: t.inkMute, letterSpacing: 1.2,
            textTransform: 'uppercase', alignItems: 'baseline',
          }}>
            <span>标题 · TITLE</span>
            <span>日期 · 阅读 · 标签</span>
          </div>
          {a.cards.map((x, i) => <ArticleRow key={x.id} a={x} t={t} last={i === a.cards.length - 1} onOpen={onOpenArticle} />)}
        </div>
      )}
      {a.kind === 'now' && Array.isArray(a.cards) && <NowList items={a.cards} t={t} />}
      {a.cards === 'contact' && <ContactBlock t={t} />}
      {a.cards === 'cta' && <CtaBlock t={t} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// FusionChatPanel — full panel: header (optional), message list, chips,
// input. `embedded=true` removes the close button and trims the header.
// `seed` is the first user-question kind to auto-fire on mount (handy for
// links from the home page to land you mid-conversation).
// ─────────────────────────────────────────────────────────────────────

function FusionChatPanel({ t, onClose, embedded = false, seed }) {
  const initialAnswer = fusionAnswer('intro');
  initialAnswer.lead = '你好，我是 ' + D.name + '。这里是一段对话，不是页面 — 你问，我答。';
  initialAnswer.body = '想了解什么都行：项目、文章、最近在做什么、想合作。下面有几个常被问到的，可以直接点。';

  const [messages, setMessages] = React.useState([
    { role: 'ai', answer: initialAnswer },
  ]);
  const [input, setInput] = React.useState('');
  const [typing, setTyping] = React.useState(false);
  const listRef = React.useRef(null);

  const [openedArticle, setOpenedArticle] = React.useState(null);

  const ask = React.useCallback((text) => {
    if (!text || !text.trim()) return;
    const userMsg = { role: 'user', text: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const kind = classifyInput(text);
      const answer = fusionAnswer(kind);
      setMessages((m) => [...m, { role: 'ai', answer }]);
      setTyping(false);
    }, 750);
  }, []);

  // Auto-fire seed question once on mount (if provided).
  const didSeed = React.useRef(false);
  React.useEffect(() => {
    if (didSeed.current || !seed) return;
    didSeed.current = true;
    // Skip the simulated user turn — seed answers directly with no question.
    const answer = fusionAnswer(seed);
    setMessages((m) => [...m, { role: 'ai', answer }]);
  }, [seed]);

  // Auto-scroll on new messages
  React.useEffect(() => {
    const el = listRef.current; if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  return (
    <div style={{
      width: '100%', height: '100%', background: t.bg, color: t.ink,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: t.sans, position: 'relative',
    }}>
      {/* Header */}
      <div style={{
        height: 56, borderBottom: `1.5px solid ${t.ink}`,
        display: 'flex', alignItems: 'center', padding: '0 22px',
        justifyContent: 'space-between', flexShrink: 0, gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <img src="assets/portrait.png" alt={D.name}
               style={{ width: 32, height: 32, objectFit: 'cover',
                        border: `1.5px solid ${t.ink}`, flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: t.display, fontSize: 15, letterSpacing: -0.3, textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{D.name}.ASK</div>
            <div style={{ fontFamily: t.mono, fontSize: 10, color: t.inkDim, letterSpacing: 0.8, display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
              <span style={{ width: 5, height: 5, background: '#34c759', borderRadius: 3 }} />
              在线 · 由本人亲手编写
            </div>
          </div>
        </div>
        {!embedded && onClose && (
          <button onClick={onClose} style={{
            border: `1.5px solid ${t.ink}`, background: t.paper, color: t.ink,
            width: 36, height: 36, fontSize: 18, fontFamily: t.mono, cursor: 'pointer',
            padding: 0, lineHeight: 1,
          }} aria-label="Close">×</button>
        )}
        {embedded && (
          <a href="index.html" target="_blank" rel="noreferrer" style={{
            fontFamily: t.mono, fontSize: 11, letterSpacing: 1, color: t.inkDim,
            textTransform: 'uppercase', textDecoration: 'none', borderBottom: `1px solid ${t.line}`,
          }}>YISHI WANG ↗</a>
        )}
      </div>

      {/* Messages */}
      <div ref={listRef} style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        padding: '24px 22px 12px', minHeight: 0,
      }}>
        {messages.map((m, i) => <Message key={i} m={m} t={t} onOpenArticle={setOpenedArticle} />)}
        {typing && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 24, padding: '4px 0' }}>
            <span style={{ width: 6, height: 6, background: t.ink, opacity: 0.4, animation: 'fcp-blink 1s steps(2) infinite' }} />
            <span style={{ width: 6, height: 6, background: t.ink, opacity: 0.4, animation: 'fcp-blink 1s steps(2) infinite 0.2s' }} />
            <span style={{ width: 6, height: 6, background: t.ink, opacity: 0.4, animation: 'fcp-blink 1s steps(2) infinite 0.4s' }} />
          </div>
        )}
        <style>{`@keyframes fcp-blink { 50% { opacity: 1; } }`}</style>
      </div>

      {/* Suggestion chips */}
      <div style={{ padding: '0 22px 10px', display: 'flex', gap: 6, flexWrap: 'wrap', flexShrink: 0 }}>
        {CHIP_QUESTIONS.map((q, i) => (
          <button key={i} onClick={() => ask(q)} style={{
            padding: '7px 11px', background: 'transparent', color: t.ink,
            border: `1.5px solid ${t.ink}`, fontFamily: t.mono, fontSize: 10.5,
            letterSpacing: 0.5, textTransform: 'uppercase', cursor: 'pointer',
            fontWeight: 500,
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = t.accent; e.currentTarget.style.color = t.onAccent; e.currentTarget.style.borderColor = t.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.ink; e.currentTarget.style.borderColor = t.ink; }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); ask(input); }} style={{
        padding: '12px 22px 18px', flexShrink: 0,
      }}>
        <div style={{
          border: `1.5px solid ${t.ink}`, display: 'flex', alignItems: 'stretch',
          background: t.paper,
        }}>
          <span style={{ padding: '12px 0 12px 16px', color: t.accent, fontFamily: t.mono, fontSize: 16, fontWeight: 700 }}>›</span>
          <input
            type="text" value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="问我任何事 · ASK ME ANYTHING"
            style={{
              flex: 1, padding: '12px 14px', border: 0, background: 'transparent',
              fontFamily: t.sans, fontSize: 14.5, color: t.ink, outline: 'none',
              minWidth: 0,
            }}
          />
          <button type="submit" style={{
            padding: '0 18px', background: t.accent, color: t.onAccent, border: 0,
            borderLeft: `1.5px solid ${t.ink}`, fontFamily: t.display, fontSize: 13,
            letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer',
          }}>
            送出 ↑
          </button>
        </div>
        <div style={{ fontFamily: t.mono, fontSize: 9.5, color: t.inkMute, marginTop: 8, letterSpacing: 0.6, display: 'flex', justifyContent: 'space-between' }}>
          <span>↵ TO SEND · ESC TO CLOSE</span>
          <span>EN / 中文 OK · 答案手写非生成</span>
        </div>
      </form>

      {/* Article reader modal (rendered last so it overlays everything) */}
      <ArticleReader article={openedArticle} onClose={() => setOpenedArticle(null)} t={t} />
    </div>
  );
}

window.FusionChatPanel = FusionChatPanel;

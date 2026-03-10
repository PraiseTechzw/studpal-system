import React from 'react';
import './Skeleton.css';

/* ---- Primitive Atoms ---- */
export const SkLine = ({ width = '100%', height = 14, style = {} }) => (
  <div className="sk-line" style={{ width, height, ...style }} />
);

export const SkCircle = ({ size = 40 }) => (
  <div className="sk-circle" style={{ width: size, height: size }} />
);

export const SkRect = ({ width = '100%', height = 40, radius = 12, style = {} }) => (
  <div className="sk-rect" style={{ width, height, borderRadius: radius, ...style }} />
);

/* ---- Card Skeleton ---- */
export const SkCard = ({ lines = 2, showAvatar = true, showFooter = true }) => (
  <div className="sk-card">
    <div className="sk-card-header">
      {showAvatar && <SkCircle size={44} />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SkLine width="60%" height={16} />
        <SkLine width="40%" height={12} />
      </div>
    </div>
    <div className="sk-card-body">
      {Array.from({ length: lines }).map((_, i) => (
        <SkLine key={i} width={i === lines - 1 ? '75%' : '100%'} />
      ))}
    </div>
    {showFooter && (
      <div className="sk-card-footer">
        <SkRect width={90} height={34} radius={10} />
        <SkRect width={70} height={34} radius={10} />
      </div>
    )}
  </div>
);

/* ---- Grid of Cards ---- */
export const SkCardGrid = ({ count = 6, lines = 2 }) => (
  <div className="sk-grid">
    {Array.from({ length: count }).map((_, i) => (
      <SkCard key={i} lines={lines} />
    ))}
  </div>
);

/* ---- List Skeleton ---- */
export const SkListItem = () => (
  <div className="sk-list-item">
    <SkCircle size={40} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <SkLine width="50%" height={14} />
      <SkLine width="80%" height={12} />
    </div>
    <SkRect width={70} height={30} radius={8} />
  </div>
);

export const SkList = ({ count = 5 }) => (
  <div className="sk-list">
    {Array.from({ length: count }).map((_, i) => (
      <SkListItem key={i} />
    ))}
  </div>
);

/* ---- Table Skeleton ---- */
export const SkTable = ({ rows = 5, cols = 4 }) => (
  <div className="sk-table">
    <div className="sk-table-header">
      {Array.from({ length: cols }).map((_, i) => (
        <SkLine key={i} width={`${100 / cols}%`} height={13} />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div className="sk-table-row" key={i}>
        <SkCircle size={32} />
        {Array.from({ length: cols - 1 }).map((_, j) => (
          <SkLine key={j} width={`${100 / (cols - 1)}%`} height={13} />
        ))}
      </div>
    ))}
  </div>
);

/* ---- Stat Cards Skeleton ---- */
export const SkStatCard = () => (
  <div className="sk-stat-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <SkRect width={44} height={44} radius={14} />
      <SkLine width={60} height={12} />
    </div>
    <SkLine width="55%" height={28} style={{ marginTop: 4 }} />
    <SkLine width="70%" height={12} />
  </div>
);

export const SkStatGrid = ({ count = 4 }) => (
  <div className="sk-stat-grid">
    {Array.from({ length: count }).map((_, i) => (
      <SkStatCard key={i} />
    ))}
  </div>
);

/* ---- Page Header Skeleton ---- */
export const SkPageHeader = ({ showButtons = 2 }) => (
  <div className="sk-page-header">
    <div className="sk-page-header-left">
      <SkLine width={200} height={26} />
      <SkLine width={340} height={14} />
    </div>
    <div className="sk-page-header-right">
      {Array.from({ length: showButtons }).map((_, i) => (
        <SkRect key={i} width={120} height={44} radius={14} />
      ))}
    </div>
  </div>
);

/* ---- Chat Skeleton ---- */
export const SkChat = ({ count = 4 }) => (
  <div className="sk-chat">
    {Array.from({ length: count }).map((_, i) => {
      const isRight = i % 2 !== 0;
      return (
        <div key={i} className={`sk-chat-bubble ${isRight ? 'right' : ''}`}>
          {!isRight && <SkCircle size={36} />}
          <div className="sk-bubble-content">
            <SkRect width={isRight ? 180 : 240} height={40} radius={16} />
            <SkLine width={60} height={10} />
          </div>
        </div>
      );
    })}
  </div>
);

/* ---- Full Page Content Skeleton (covers most views) ---- */
export const SkPageContent = ({ variant = 'cards', cardCount = 6, statCount = 4 }) => (
  <div style={{ padding: '24px 0' }}>
    <SkPageHeader />
    {variant === 'stats+cards' && (
      <>
        <SkStatGrid count={statCount} />
        <div style={{ marginTop: 24 }}>
          <SkCardGrid count={cardCount} />
        </div>
      </>
    )}
    {variant === 'cards' && <SkCardGrid count={cardCount} />}
    {variant === 'list' && <SkList count={cardCount} />}
    {variant === 'table' && <SkTable rows={cardCount} />}
  </div>
);

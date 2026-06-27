import { TickFrame } from 'ui';

/**
 * TickFrame renders four corner .tick spans that are display:none in the
 * Soft Organic Clay design — the leaf corner replaced the reticle ticks.
 * This cell wraps it in a bordered box so its positional structure is
 * visible in the preview even though the ticks themselves have no visual.
 */
export const InReticleWrapper = () => (
  <div
    className="reticle"
    style={{
      position: 'relative',
      width: '240px',
      height: '120px',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--r-md)',
      background: 'var(--surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <TickFrame />
    <span style={{ fontSize: '13px', color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>
      // TickFrame — corner ticks hidden (leaf corner active)
    </span>
  </div>
);

/**
 * TickFrame inside a card: shows the four corner ticks are aria-hidden
 * internal helpers; the leaf corner border-radius carries the brand gesture.
 */
export const InsideLeafCard = () => (
  <div
    className="reticle"
    style={{
      position: 'relative',
      width: '280px',
      padding: '24px',
      background: 'var(--surface)',
      borderRadius: 'var(--r-leaf)',
      boxShadow: 'var(--elev-2)',
    }}
  >
    <TickFrame />
    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-2)', fontSize: '14px', margin: 0 }}>
      異地備援 DR · RTO ≤ 4hr · RPO ≤ 15min
    </p>
    <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-3)', fontSize: '11px', marginTop: '8px', marginBottom: 0 }}>
      SLO 99.95% · REF FAB300
    </p>
  </div>
);

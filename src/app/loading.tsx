export default function Loading() {
  return <div className="container animate-pulse py-10" aria-label="Loading content" role="status">
    <div className="mb-8 h-3 w-28 rounded-full bg-[var(--soft)]"/>
    <div className="mb-3 h-10 w-64 max-w-full rounded-xl bg-[var(--soft)]"/>
    <div className="mb-9 h-4 w-96 max-w-full rounded-full bg-[var(--soft)]"/>
    <div className="skeleton-grid">
      {Array.from({length:12},(_,i)=><div key={i} className="skeleton-tile" style={{height:`${180+(i%4)*55}px`}}/>)}
    </div>
    <span className="sr-only">Loading Kinterest…</span>
  </div>;
}

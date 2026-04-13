const actionButton =
  'rounded-lg px-3 py-2 text-sm font-semibold transition border border-slate-600 hover:border-slate-400';

export default function ControlsPanel({ exploded, setExploded, moduleState, setModuleState, metrics }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 text-slate-100">
      <h2 className="text-lg font-semibold">ReFrame Node Controls</h2>
      <p className="mt-1 text-sm text-slate-300">Interactive controls for assembly and circular lifecycle actions.</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button className={actionButton} onClick={() => setExploded(true)}>
          Exploded View
        </button>
        <button className={actionButton} onClick={() => setExploded(false)}>
          Assembly Mode
        </button>
      </div>

      <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-300">Circularity Simulation</h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        <button className={actionButton} onClick={() => setModuleState('removed')}>
          Remove Module
        </button>
        <button className={actionButton} onClick={() => setModuleState('replaced')}>
          Replace Module
        </button>
        <button className={actionButton} onClick={() => setModuleState('attached')}>
          Reattach Module
        </button>
      </div>

      <div className="mt-5 rounded-lg border border-emerald-700/40 bg-emerald-950/40 p-3 text-sm">
        <h3 className="font-semibold text-emerald-300">Sustainability Layer</h3>
        <ul className="mt-2 space-y-1 text-slate-100">
          <li>Material: {metrics.material}</li>
          <li>CO2 reduction: {metrics.co2Reduction}%</li>
          <li>Reusability: {metrics.reusability}%</li>
          <li>Recyclability: {metrics.recyclability}%</li>
        </ul>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Active mode: <span className="font-semibold text-slate-200">{exploded ? 'Exploded' : 'Assembled'}</span> | Module
        state: <span className="font-semibold text-slate-200">{moduleState}</span>
      </p>
    </div>
  );
}

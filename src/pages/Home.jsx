import React from 'react';
import { useMemo, useState } from 'react';
import ControlsPanel from '../components/ControlsPanel';
import ReFrameModel from '../components/ReFrameModel';

function PassportModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-5 text-slate-100 shadow-xl">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold">Digital Passport: ReFrame Node</h2>
          <button onClick={onClose} className="rounded bg-slate-700 px-2 py-1 text-xs hover:bg-slate-600">
            Close
          </button>
        </div>

        <div className="mt-4 space-y-3 text-sm">
          <p>
            <strong>Material composition:</strong> 78% recycled steel, 12% reclaimed aluminum inserts, 10% serviceable
            fasteners.
          </p>
          <p>
            <strong>Lifecycle stages:</strong> Manufacture → Vehicle Integration → Service/Replacement → Reconditioning →
            Reuse.
          </p>
          <p>
            <strong>Reuse instructions:</strong> Detach side module, inspect bolt seats, replace worn insert, and reattach
            using universal hole pattern.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [exploded, setExploded] = useState(false);
  const [moduleState, setModuleState] = useState('attached');
  const [isPassportOpen, setIsPassportOpen] = useState(false);

  const metrics = useMemo(() => {
    // Dynamic but simple simulation values for MVP storytelling.
    if (moduleState === 'removed') {
      return { material: 'Recycled Steel', co2Reduction: 19, reusability: 86, recyclability: 94 };
    }
    if (moduleState === 'replaced') {
      return { material: 'Recycled Steel', co2Reduction: 25, reusability: 92, recyclability: 97 };
    }
    return { material: 'Recycled Steel', co2Reduction: 22, reusability: 90, recyclability: 96 };
  }, [moduleState]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-5 text-slate-100">
      <div className="mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[2fr_1fr]">
        <section>
          <h1 className="text-3xl font-bold">ReFrame Node — Circular Modular Component MVP</h1>
          <p className="mt-2 text-sm text-slate-300">
            Explore the 3D assembly, detachable interfaces, and circular lifecycle interactions.
          </p>
          <div className="mt-4">
            <ReFrameModel
              exploded={exploded}
              moduleState={moduleState}
              onOpenPassport={() => setIsPassportOpen(true)}
            />
          </div>
        </section>

        <aside>
          <ControlsPanel
            exploded={exploded}
            setExploded={setExploded}
            moduleState={moduleState}
            setModuleState={setModuleState}
            metrics={metrics}
          />
        </aside>
      </div>

      {isPassportOpen && <PassportModal onClose={() => setIsPassportOpen(false)} />}
    </main>
  );
}

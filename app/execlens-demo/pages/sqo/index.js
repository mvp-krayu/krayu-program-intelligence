import Link from 'next/link';

const { resolveClientList } = require('../../lib/sqo-cockpit/SQOCockpitRouteResolver');

export async function getServerSideProps() {
  const clientRuns = resolveClientList();

  return {
    props: {
      clientRuns,
      governance: {
        read_only: true,
        no_ai_interpretation: true,
        deterministic_display: true,
        no_direct_lens_emission: true,
      },
    },
  };
}

export default function SQOCockpitIndex({ clientRuns, governance }) {
  return (
    <div className="sqo-cockpit sqo-cockpit--index">
      <header className="sqo-cockpit__header">
        <h1>SQO Cockpit</h1>
        <p className="sqo-cockpit__subtitle">Semantic Qualification Operations Workbench</p>
      </header>

      <main className="sqo-cockpit__content">
        <div className="sqo-client-selector">
          <h2>Select Client / Run</h2>
          {clientRuns.length === 0 ? (
            <div className="sqo-client-selector__empty">
              No registered client/run pairs found in manifest.
            </div>
          ) : (
            <div className="sqo-client-list">
              {clientRuns.map(({ client, run }) => (
                <Link
                  key={`${client}/${run}`}
                  href={`/sqo/client/${client}/run/${run}`}
                  className="sqo-client-card"
                >
                  <span className="sqo-client-card__client">{client}</span>
                  <span className="sqo-client-card__run">{run}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="sqo-cockpit__governance">
        Read-only artifact consumption · No AI interpretation · Deterministic display · No direct LENS emission
      </footer>
    </div>
  );
}

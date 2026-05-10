import Link from 'next/link';

const { isClientRunAllowed, listAllowedClientRuns } = require('../../../../lib/lens-v2/manifests');

export async function getServerSideProps(context) {
  const { client } = context.params;
  const allRuns = listAllowedClientRuns().filter(cr => cr.client === client);

  if (allRuns.length === 0) {
    return {
      props: {
        client,
        runs: [],
        error: 'CLIENT_NOT_FOUND',
      },
    };
  }

  return {
    props: {
      client,
      runs: allRuns.map(cr => cr.run),
      error: null,
    },
  };
}

export default function SQOClientIndex({ client, runs, error }) {
  if (error) {
    return (
      <div className="sqo-cockpit sqo-cockpit--error">
        <h1>SQO Cockpit</h1>
        <div className="sqo-degraded sqo-degraded--critical">
          <h2>Client Not Found</h2>
          <p>Client &quot;{client}&quot; is not registered in the manifest.</p>
          <Link href="/sqo">← Back to client list</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="sqo-cockpit sqo-cockpit--client">
      <header className="sqo-cockpit__header">
        <Link href="/sqo" className="sqo-cockpit__back">← All Clients</Link>
        <h1>{client}</h1>
        <p className="sqo-cockpit__subtitle">Select a run</p>
      </header>

      <main className="sqo-cockpit__content">
        <div className="sqo-run-list">
          {runs.map(run => (
            <Link
              key={run}
              href={`/sqo/client/${client}/run/${run}`}
              className="sqo-run-card"
            >
              <span className="sqo-run-card__run">{run}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

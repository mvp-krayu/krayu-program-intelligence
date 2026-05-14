/**
 * flagshipBinding
 * PI.LENS.V2.RUNTIME-PARAMETERIZATION-AND-REGISTRY-UNIFICATION.01
 *
 * Server-side binding resolution shared between
 * `pages/lens-v2-flagship.js` (getServerSideProps) and the
 * runtime-parameterization test suite.
 *
 * Reads `client` / `run` from a query-shape object, validates the pair
 * against the manifest registry (single source of truth), resolves the
 * canonical payload via the BlueEdge wrapper (which delegates to the
 * generic resolver), and returns the props shape consumed by the page.
 *
 * On any failure path, returns a props shape with `livePayload: null`
 * and a structured `liveBindingError`. Sets the recommended HTTP
 * status code on the optional `res` argument so Next.js surfaces a
 * 4xx/5xx for unknown / malformed inputs.
 *
 * Governance: no fixture fallback. No synthetic semantics. No
 * AI inference.
 */

'use strict';

const { resolveBlueEdgePayload } = require('./BlueEdgePayloadResolver');
const { isClientRunAllowed } = require('./manifests');
const { loadReconciliationLifecycle, buildReconciliationAwareness, loadDomainEnrichmentRationale, buildDomainTraceability } = require('./LensReconciliationConsumptionLayer');
const { buildLensSubstrateBinding } = require('./LensSQOSubstrateConsumer');
const { buildNextGenReportBinding } = require('./NextGenReportReconciliationBinding');

const DEFAULT_BINDING_CLIENT = 'blueedge';
const DEFAULT_BINDING_RUN = 'run_blueedge_productized_01_fixed';

function paramSafe(value) {
  if (typeof value !== 'string') return false;
  if (value.length === 0 || value.length > 200) return false;
  if (!/^[A-Za-z0-9_\-]+$/.test(value)) return false;
  if (value.includes('..')) return false;
  return true;
}

function emptyPropsShape(extra) {
  return Object.assign({
    livePayload: null,
    livePropagationChains: [],
    liveBindingError: null,
    bindingClient: null,
    bindingRun: null,
    reconciliationAwareness: null,
    domainTraceability: null,
    substrateBinding: null,
    reportBinding: null,
  }, extra || {});
}

function buildPropagationChains(payload) {
  const chains = [];
  const blocks = (payload && payload.evidence_blocks) || [];
  if (blocks.length >= 2) {
    chains.push({
      path: blocks.map((b) => b.domain_alias).filter(Boolean),
      pressure_tier:
        (blocks[0] && blocks[0].signal_cards && blocks[0].signal_cards[0] && blocks[0].signal_cards[0].pressure_tier)
        || 'HIGH',
      propagation_role: 'ORIGIN',
      origin_domain: blocks[0] ? blocks[0].domain_alias : null,
    });
  }
  return chains;
}

/**
 * Resolve flagship binding props for a request-shaped query.
 *
 * @param {object} input
 * @param {object} input.query        Next.js context.query (or a synthetic equivalent)
 * @param {object} [input.res]        Next.js context.res (used to set statusCode)
 * @returns {{ props: object, statusCode: number }}
 */
function resolveFlagshipBinding(input) {
  const query = (input && input.query) || {};
  const res = (input && input.res) || null;
  const rawClient = typeof query.client === 'string' ? query.client : '';
  const rawRun    = typeof query.run    === 'string' ? query.run    : '';
  const requestedClient = rawClient || DEFAULT_BINDING_CLIENT;
  const requestedRun    = rawRun    || DEFAULT_BINDING_RUN;

  if (!paramSafe(requestedClient) || !paramSafe(requestedRun)) {
    if (res) res.statusCode = 400;
    return {
      props: emptyPropsShape({
        liveBindingError: {
          kind: 'INVALID_PARAM',
          binding_status: 'REJECTED',
          requested: { client: requestedClient, run: requestedRun },
        },
        bindingClient: requestedClient,
        bindingRun: requestedRun,
      }),
      statusCode: 400,
    };
  }

  if (!isClientRunAllowed(requestedClient, requestedRun)) {
    if (res) res.statusCode = 404;
    return {
      props: emptyPropsShape({
        liveBindingError: {
          kind: 'CLIENT_RUN_NOT_ALLOWED',
          binding_status: 'REJECTED',
          requested: { client: requestedClient, run: requestedRun },
        },
        bindingClient: requestedClient,
        bindingRun: requestedRun,
      }),
      statusCode: 404,
    };
  }

  let payload = null;
  let resolverError = null;
  try {
    payload = resolveBlueEdgePayload(requestedClient, requestedRun);
  } catch (e) {
    resolverError = { kind: 'RESOLVER_THREW', message: (e && e.message) || String(e) };
  }
  if (!payload) {
    if (res) res.statusCode = 502;
    return {
      props: emptyPropsShape({
        liveBindingError: resolverError || { kind: 'PAYLOAD_NULL' },
        bindingClient: requestedClient,
        bindingRun: requestedRun,
      }),
      statusCode: 502,
    };
  }
  if (!payload.ok) {
    if (res) res.statusCode = 502;
    return {
      props: emptyPropsShape({
        liveBindingError: {
          kind: payload.error || 'PAYLOAD_NOT_OK',
          missing: payload.missing || null,
          binding_status: payload.binding_status || 'REJECTED',
        },
        bindingClient: requestedClient,
        bindingRun: requestedRun,
      }),
      statusCode: 502,
    };
  }

  const lifecycleProjection = loadReconciliationLifecycle(requestedClient, requestedRun);
  const reconciliationAwareness = buildReconciliationAwareness(payload, lifecycleProjection);
  const rationaleMap = loadDomainEnrichmentRationale(requestedClient, requestedRun);
  const domainTraceability = reconciliationAwareness && reconciliationAwareness.available
    ? buildDomainTraceability(reconciliationAwareness.per_domain, rationaleMap)
    : null;
  const substrateBinding = buildLensSubstrateBinding(requestedClient, requestedRun);
  const reportBinding = buildNextGenReportBinding(substrateBinding);

  return {
    props: {
      livePayload: payload,
      livePropagationChains: buildPropagationChains(payload),
      liveBindingError: null,
      bindingClient: requestedClient,
      bindingRun: requestedRun,
      reconciliationAwareness: reconciliationAwareness || null,
      domainTraceability: domainTraceability || null,
      substrateBinding: substrateBinding || null,
      reportBinding: reportBinding || null,
    },
    statusCode: 200,
  };
}

module.exports = {
  DEFAULT_BINDING_CLIENT,
  DEFAULT_BINDING_RUN,
  paramSafe,
  resolveFlagshipBinding,
};

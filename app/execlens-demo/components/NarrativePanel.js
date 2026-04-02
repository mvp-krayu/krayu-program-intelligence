/**
 * NarrativePanel.js
 * PIOS-51.4-RUN01-CONTRACT-v1
 *
 * Executive narrative — composed from existing query outputs only.
 * Composes ExecutivePanel + TemplateRenderer.
 *
 * Rules:
 *   R1  composed from existing outputs only — no synthesis, no inference
 *   R2  no additional logic beyond display
 *   R3  no signal duplication (signals owned by SignalPanel)
 */

import ExecutivePanel   from './ExecutivePanel'
import TemplateRenderer from './TemplateRenderer'

export default function NarrativePanel({ queryData }) {
  if (!queryData) return null

  return (
    <div className="narrative-panel-body">
      <ExecutivePanel data={queryData} />
      {queryData.template_section && (
        <TemplateRenderer
          templateSection={queryData.template_section}
          navigation={queryData.navigation}
          queryId={queryData.query_id}
        />
      )}
    </div>
  )
}

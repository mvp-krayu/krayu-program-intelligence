/**
 * ENLPanel.js
 * PIOS-51.4-RUN01-CONTRACT-v1
 *
 * Evidence + navigation exposure.
 * Composes EvidencePanel + NavigationPanel — no filtering logic, no new computation.
 * Collapsed by default (DisclosurePanel wrapper in index.js).
 *
 * Rules:
 *   R1  exposure only — no UI-side filtering
 *   R2  depth controlled by existing ENL output from adapter chain
 *   R3  no duplication of signal data (signals owned by SignalPanel)
 */

import EvidencePanel    from './EvidencePanel'
import NavigationPanel  from './NavigationPanel'

export default function ENLPanel({ signals, navigation }) {
  return (
    <div className="enl-panel-body">
      <EvidencePanel signals={signals} />
      <NavigationPanel navigation={navigation} />
    </div>
  )
}

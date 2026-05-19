import { useState } from 'react';

const ROLES = [
  { id: 'operator', label: 'Operator', identity: 'Primary operational actor', scope: 'Full — review, promote, acknowledge, escalate, resolve' },
  { id: 'reviewer', label: 'Reviewer', identity: 'Semantic review specialist', scope: 'Review — accept, reject, contest, partial accept, escalate' },
  { id: 'domain_authority', label: 'Domain Authority', identity: 'Structural domain owner', scope: 'Domain — review, crosswalk accept, escalate' },
  { id: 'promotion_authority', label: 'Promotion Authority', identity: 'Qualification advancement authority', scope: 'Governance — promote, deny, insufficiency, resolve arbitration' },
  { id: 'audit_authority', label: 'Audit Authority', identity: 'Read-only governance observer', scope: 'None — full visibility, zero action authority' },
];

export default function RoleDeclarationGate({ onRoleSelected }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [identifier, setIdentifier] = useState('');

  const canProceed = selectedRole && identifier.trim().length > 0;

  function handleProceed() {
    if (canProceed) {
      onRoleSelected(selectedRole, identifier.trim());
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && canProceed) {
      handleProceed();
    }
  }

  return (
    <div className="sqo-v2-role-gate">
      <div className="sqo-v2-role-gate__header">
        <span className="sqo-v2-role-gate__title">Operational Role Declaration</span>
        <span className="sqo-v2-role-gate__subtitle">Select your operational role for this session. This is declarative only — not production authentication.</span>
      </div>

      <div className="sqo-v2-role-gate__grid">
        {ROLES.map(role => (
          <button
            key={role.id}
            className={`sqo-v2-role-gate__card ${selectedRole === role.id ? 'sqo-v2-role-gate__card--selected' : ''}`}
            onClick={() => setSelectedRole(role.id)}
            type="button"
          >
            <span className="sqo-v2-role-gate__card-label">{role.label}</span>
            <span className="sqo-v2-role-gate__card-identity">{role.identity}</span>
            <span className="sqo-v2-role-gate__card-scope">{role.scope}</span>
          </button>
        ))}
      </div>

      {selectedRole && (
        <div className="sqo-v2-role-gate__identifier">
          <label className="sqo-v2-role-gate__identifier-label" htmlFor="sqo-v2-identifier">
            Operator Identifier
          </label>
          <input
            id="sqo-v2-identifier"
            className="sqo-v2-role-gate__identifier-input"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., khorrix"
            autoFocus
          />
          <span className="sqo-v2-role-gate__identifier-preview">
            actor_id: {selectedRole}:{identifier || '…'}
          </span>
        </div>
      )}

      {canProceed && (
        <button className="sqo-v2-role-gate__proceed" onClick={handleProceed} type="button">
          Enter Cockpit as {ROLES.find(r => r.id === selectedRole)?.label}
        </button>
      )}

      <div className="sqo-v2-role-gate__governance">
        DECLARATIVE ONLY — Not production RBAC. Not secure identity enforcement.
      </div>
    </div>
  );
}

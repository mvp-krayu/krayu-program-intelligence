# ExecLens Demo — Technical Setup
## PIOS-51.3-RUN01-CONTRACT-v1
## Supersedes: PIOS-42.9-RUN01-CONTRACT-v1

---

## System Requirements

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | ≥ 18 (tested: 20) | `node --version` |
| npm | ≥ 9 | bundled with Node 18+ |
| Python | 3.9+ (tested: 3.9.6) | `python3 --version` |
| requests | any | `pip install requests` — for validators |
| Obsidian | Any | optional — for deep-link activation (Step 9) |

---

## Setup Steps

### 1. Clone the repository

```bash
git clone <repo-url>
cd krayu-program-intelligence
```

### 2. Install Node dependencies

```bash
cd app/execlens-demo
npm install
```

This installs Next.js 14, React 18, and React DOM. No external API clients. No network calls at runtime.

### 3. Configure environment (optional — for Obsidian deep links)

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_OBSIDIAN_VAULT_NAME=pie_vault
```

To use Obsidian deep links, the vault must be registered in your local Obsidian installation:

1. Open Obsidian
2. Open vault → navigate to `docs/pios/41.2/pie_vault/` in this repository
3. The vault name displayed in Obsidian must match `NEXT_PUBLIC_OBSIDIAN_VAULT_NAME`

If Obsidian is not configured, all other functionality works normally. Navigation links display file paths instead of deep links.

### 4. Start the development server

```bash
# From app/execlens-demo/
npm run dev
```

Expected output:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Environments: .env.local
✓ Ready in ~2s
```

### 5. Verify RED node emphasis before demo

```bash
python3 -c "
import json
with open('docs/pios/44.2/projection_attachment.json') as f:
    d = json.load(f)
for p in d['projections']:
    e = p.get('emphasis', 'none')
    if e != 'none':
        print('ACTIVE:', p['node_reference']['node_id'], '->', e)
"
```

Expected output:
```
ACTIVE: C_30_Domain_Event_Bus -> high
```

If no output: the emphasis has not been materialized. Check 44.4C was applied.

### 6. Open the demo surface

```
http://localhost:3000
```

Verify: Domain Event Bus in the topology panel has a RED border and background.

---

## How the System Works

The browser calls `/api/execlens` which executes Python adapter scripts:

| Endpoint | Adapter | Description | Emphasis |
|----------|---------|-------------|----------|
| `?overview=true` | `scripts/pios/42.6/execlens_overview_adapter.py` | Landing gauge metrics | n/a |
| `?topology=true` | `scripts/pios/42.7/execlens_topology_adapter.py` | Structural topology with emphasis | reads 44.2 |
| `?topology=true&highlight=GQ-XXX` | `scripts/pios/42.7/execlens_topology_adapter.py` | Query-highlighted topology | reads 44.2 |
| `?query=GQ-NNN` | `scripts/pios/42.4/execlens_adapter.py` | Single query execution | n/a |
| `?list=true` | `scripts/pios/42.4/execlens_adapter.py` | Available query list | n/a |

Each Python adapter runs a deterministic traversal through locked 41.x artifacts.
No external network calls. No database. No inference.

The topology adapter (`42.7`) reads `docs/pios/44.2/projection_attachment.json`
and attaches the `emphasis` field to each node in the output. `emphasis:high` → RED rendering.

### ENL Routes (present but not active in current branch)

| Endpoint | Adapter | Status |
|---|---|---|
| `?status=true` | `scripts/pios/42.13/demo_activate.py` | ABSENT — requires 42.13 activation |
| `?enl=GQ-XXX` | `scripts/pios/42.15/enl_console_adapter.py` | ABSENT — requires 42.15 activation |
| `?persona=P&query=GQ-XXX` | `scripts/pios/42.16/persona_view_map.py` | ABSENT — requires 42.16 activation |

These routes are wired in `execlens.js` but their adapter scripts are not present in this branch.
Persona framing in the demo (Step 7–8) operates at the presentation layer from existing query output.
Live persona-scoped routing is a 42.x dependency (separate stream).

---

## Emphasis Rendering Verification

The 42.27 validator confirms emphasis rendering is functional:

```bash
python3 scripts/pios/42.27/validate_red_node_activation.py
```

Expected output:
```json
{
  "status": "PASS",
  "pass_count": 3,
  "results": [
    { "test": "topology_200", "ok": true },
    { "test": "emphasis_fields_present_and_valid", "ok": true },
    { "test": "emphasis_matches_baseline", "ok": true }
  ]
}
```

---

## Validating Obsidian Deep Links

```bash
# macOS
open 'obsidian://open?vault=pie_vault&file=01_Domains/D_11_Event_Driven_Architecture'
```

If Obsidian opens to the correct note, deep links are configured correctly.

If Obsidian shows "vault not found", register the vault:
```
Obsidian → Open another vault → Open folder as vault
→ select: <repo>/docs/pios/41.2/pie_vault
```

---

## Troubleshooting

**RED node not visible**
```bash
python3 -c "import json; d=json.load(open('docs/pios/44.2/projection_attachment.json')); [print(p['node_reference']['node_id'], p['emphasis']) for p in d['projections']]"
```
Check that `C_30_Domain_Event_Bus` shows `high`. If not, 44.4C has not been applied.

**Adapter execution failed**
```bash
python3 --version   # must be 3.9+
python3 scripts/pios/42.4/execlens_adapter.py GQ-003   # test directly
```

**Port 3000 in use**
```bash
npm run dev -- -p 3001
# Update validator base URL: --base http://localhost:3001/api/execlens
```

**Topology loads slowly**
The topology adapter processes all 10 queries to build the hierarchy and loads the
projection attachment. First load ~3–5 seconds. Subsequent loads use cached data.

**Obsidian link opens wrong vault**
The vault name in `NEXT_PUBLIC_OBSIDIAN_VAULT_NAME` must exactly match the vault
name registered in Obsidian (case-sensitive).

---

## Running Validators

```bash
# From repo root — with app running
python3 scripts/pios/42.27/validate_red_node_activation.py   # 3/3 emphasis validation
python3 scripts/pios/42.26/validate_runtime_contract.py       # 4/4 route validation
```

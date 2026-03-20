# ExecLens Demo — Technical Setup
## PIOS-42.9-RUN01-CONTRACT-v1

---

## System Requirements

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | ≥ 18 (tested: 20) | `node --version` |
| npm | ≥ 9 | bundled with Node 18+ |
| Python | 3.9+ (tested: 3.9.6) | `python3 --version` |
| Obsidian | Any | optional — for deep-link activation |

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

### 5. Open the demo surface

```
http://localhost:3000
```

---

## How the System Works

The browser calls `/api/execlens` which executes Python adapter scripts:

| Endpoint | Adapter | Description |
|----------|---------|-------------|
| `?overview=true` | `scripts/pios/42.6/execlens_overview_adapter.py` | Landing gauge metrics |
| `?topology=true` | `scripts/pios/42.7/execlens_topology_adapter.py` | Structural topology |
| `?query=GQ-NNN` | `scripts/pios/42.4/execlens_adapter.py` | Single query execution |
| `?list=true` | `scripts/pios/42.4/execlens_adapter.py` | Available query list |

Each Python adapter runs a deterministic traversal through locked 41.x artifacts.
No external network calls. No database. No inference.

---

## Validating Obsidian Deep Links

Test that a deep link resolves correctly:

```bash
# macOS
open 'obsidian://open?vault=pie_vault&file=01_Domains/D_11_Event_Driven_Architecture'

# Manual: paste into browser address bar
obsidian://open?vault=pie_vault&file=01_Domains/D_10_Platform_Infrastructure_and_Data
```

If Obsidian opens to the correct note, deep links are configured correctly.

If Obsidian shows "vault not found", register the vault:

```
Obsidian → Open another vault → Open folder as vault
→ select: <repo>/docs/pios/41.2/pie_vault
```

---

## Troubleshooting

**Adapter execution failed**
```
python3 --version   # must be 3.9+
python3 scripts/pios/42.4/execlens_adapter.py GQ-003   # test directly
```

**Port 3000 in use**
```bash
npm run dev -- -p 3001
```

**Topology loads slowly**
The topology adapter processes all 10 queries to build the hierarchy. First load takes ~3–5 seconds. Subsequent loads use the same data.

**Obsidian link opens wrong vault**
The vault name in `NEXT_PUBLIC_OBSIDIAN_VAULT_NAME` must exactly match the vault name registered in Obsidian (case-sensitive).

---

## Running Validators

```bash
# From repo root
python3 scripts/pios/42.4/validate_demo_surface.py      # 20/20
python3 scripts/pios/42.5/validate_demo_refinement.py   # 18/18
python3 scripts/pios/42.6/validate_overview_adapter.py  # 20/20
python3 scripts/pios/42.7/validate_topology_panel.py    # 22/22
python3 scripts/pios/42.8/validate_demo_choreography.py # 21/21
python3 scripts/pios/42.9/validate_demo_package.py      # package check
```

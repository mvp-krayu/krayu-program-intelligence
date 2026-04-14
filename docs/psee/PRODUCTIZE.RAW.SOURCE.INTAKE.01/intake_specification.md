# PRODUCTIZE.RAW.SOURCE.INTAKE.01 — Intake Specification

Status: LOCKED  
Authority: PRODUCTIZE.RAW.SOURCE.INTAKE.01  
Version: 1.0  

---

## SECTION 1 — PRINCIPLES

**Stream identity**: PRODUCTIZE.RAW.SOURCE.INTAKE.01

**Purpose**: Transform a local source path into a governed intake bundle that feeds the existing S0→S4 runtime unchanged. The intake layer operates exclusively pre-S0. Its output is a declared, hashed, and optionally git-enriched intake bundle stored under `clients/<tenant>/psee/intake/<intake_id>/`. This bundle serves as the source declaration record that links to a runtime run via `pios ledger create --source-version <intake_id>`.

**Upstream lock**: `runtime-cli-v1` (`scripts/pios/pios.py`, 9 commands) is authoritative and unchanged. This stream adds one new command (`pios intake create`) and does not modify, remove, or re-order any existing command, parser, function, or behavior.

**Scope boundary**: This stream covers only the intake layer (pre-S0). The S0–S4 pipeline commands (`ledger create`, `bootstrap`, `emit coverage`, `emit reconstruction`, `emit topology`, `emit signals`, `compute gauge`, `declare coherence`, `validate freshness`) and all GA contracts are unchanged.

**Fail-closed rule**: Any ambiguity, missing required input, invalid source path, existing output directory, git extraction failure, or hash failure → STOP immediately, call `_fail(msg)`, exit with code 1.

---

## SECTION 2 — SOURCE TYPE CONTRACT

Exactly two source types are defined. No other source type is recognized.

**LOCAL_DIRECTORY**  
Definition: Any local directory path that does NOT contain a `.git` subdirectory at its root.  
Detection rule: Check for existence of `<source_path>/.git` as a directory. If NOT present → `LOCAL_DIRECTORY`.

**GIT_DIRECTORY**  
Definition: Any local directory path that DOES contain a `.git` subdirectory at its root.  
Detection rule: Check for existence of `<source_path>/.git` as a directory. If present → `GIT_DIRECTORY`.

Detection implementation: `os.path.isdir(os.path.join(source_path, ".git"))` returns `True` → `GIT_DIRECTORY`; returns `False` → `LOCAL_DIRECTORY`.

The detected source type MUST be declared explicitly (as the exact string `"LOCAL_DIRECTORY"` or `"GIT_DIRECTORY"`) in every output artifact written by `pios intake create`.

---

## SECTION 3 — INTAKE COMMAND CONTRACT

**Command**: `pios intake create`

**Required arguments**:
- `--source-path PATH` (required, string): Absolute or relative path to the local source directory. The command resolves this to an absolute path using `os.path.abspath`.
- `--tenant TENANT` (required, string): Tenant/client identifier string. Example: `"blueedge"`. Used as the directory component in the output path `clients/<tenant>/psee/intake/<intake_id>/`.
- `--intake-id INTAKE_ID` (required, string): Unique intake identifier string. Example: `"intake_01_myproject"`. Used as the final directory component in the output path. Must be unique; if output directory already exists, fail closed.
- `--debug` (flag, optional): Enable debug logging. When set, debug-level messages are emitted per Section 8 debug output requirements.

**Behavior — exact execution order**:
1. Call `_configure_logging(args.debug)`.
2. Resolve `source_path` to absolute: `os.path.abspath(args.source_path)`.
3. Validate `source_path` exists and is a directory: `os.path.isdir(source_path)`. If not → call `_fail(f"source-path does not exist or is not a directory: {source_path}")`.
4. Detect source type per Section 2 rules.
5. Log debug: resolved source path, detected source type.
6. Walk source directory and build file list applying Section 4 inclusion/exclusion rules. Sort all relative file paths lexicographically.
7. Compute SHA-256 file hashes per Section 4.
8. Compute aggregate directory hash per Section 4.
9. If `GIT_DIRECTORY`: extract git metadata per Section 5. Fail closed if any git command fails.
10. Determine output directory path: `<repo_root>/clients/<tenant>/psee/intake/<intake_id>/`. If directory already exists → call `_fail(f"intake output directory already exists at {output_dir} — use a unique intake_id")`.
11. Create output directory: `os.makedirs(output_dir)`.
12. Write `intake_record.json` per Section 6 schema.
13. Write `source_manifest.json` per Section 6 schema.
14. Write `file_hash_manifest.json` per Section 4 manifest schema.
15. If `GIT_DIRECTORY`: write `git_metadata.json` per Section 5 schema.
16. Log completion: `_log(f"INTAKE_COMPLETE: {output_dir}")`, `_log(f"intake_id={intake_id} tenant={tenant} source_type={source_type} file_count={file_count} aggregate_hash={aggregate_hash}")`.

---

## SECTION 4 — HASHING CONTRACT

**Algorithm**: SHA-256. No other algorithm is used.

**Path normalization**: All file paths recorded in artifacts use POSIX-style forward-slash paths relative to `source_path` root. Example: if `source_path` is `/tmp/myproject` and the file is `/tmp/myproject/subdir/file.txt`, the normalized path is `subdir/file.txt`. Implementation: `os.path.relpath(abs_file_path, source_path).replace(os.sep, "/")`.

**Walk ordering**: Lexicographic sort of all relative file paths. Implementation: use `os.walk(source_path)` with `topdown=True`, collect all file paths, sort the complete list with `sorted()` before hashing.

**Included files**: All regular files under `source_path` that are not excluded by the rules below.

**Excluded paths** (applied during walk, before hashing):
- `.git/` directory and all of its contents: skip any directory named `.git` at any level.
- `__pycache__/` directories and all of their contents: skip any directory named `__pycache__` at any level.
- `*.pyc` files: skip any file whose name ends with `.pyc`.
- `.DS_Store` files: skip any file whose name is exactly `.DS_Store`.

**Exclusion implementation**: In `os.walk`, modify `dirs` in-place to remove `.git` and `__pycache__` entries before recursing. For files, filter out names ending in `.pyc` and names equal to `.DS_Store`.

**Binary files**: Include in hash manifest with SHA-256 of raw bytes. No special handling or encoding conversion. Read mode: `"rb"`.

**Symlinks**: Resolve to target before hashing using `os.path.realpath`. If the resolved target does not exist (broken symlink), record as `"status": "BROKEN_SYMLINK"` in the manifest entry, set `"sha256": null`, set `"size_bytes": null`, and skip from aggregate hash computation.

**Empty directories**: Not recorded in `file_hash_manifest.json`. Only files are hashed and listed.

**File hash manifest schema** for `file_hash_manifest.json`:
```json
{
  "intake_id": "<intake_id>",
  "source_path": "<absolute source path>",
  "source_type": "LOCAL_DIRECTORY | GIT_DIRECTORY",
  "hash_algorithm": "sha256",
  "generated_at": "<ISO 8601 UTC timestamp>",
  "file_count": <integer>,
  "files": [
    {
      "path": "<normalized relative path>",
      "sha256": "<hex digest> | null",
      "size_bytes": <integer> | null,
      "status": "OK | BROKEN_SYMLINK"
    }
  ],
  "aggregate_hash": "<sha256 hex digest>"
}
```
Field types:
- `intake_id`: string
- `source_path`: string (absolute path)
- `source_type`: string, one of `"LOCAL_DIRECTORY"` or `"GIT_DIRECTORY"`
- `hash_algorithm`: string, always `"sha256"`
- `generated_at`: string, ISO 8601 UTC format `YYYY-MM-DDTHH:MM:SSZ`
- `file_count`: integer, count of all included files (OK + BROKEN_SYMLINK combined)
- `files`: array of file entry objects
- `files[].path`: string, normalized POSIX relative path
- `files[].sha256`: string hex digest (64 characters) for OK files; `null` for BROKEN_SYMLINK
- `files[].size_bytes`: integer for OK files; `null` for BROKEN_SYMLINK
- `files[].status`: string, `"OK"` or `"BROKEN_SYMLINK"`
- `aggregate_hash`: string, SHA-256 hex digest of 64 characters

**Aggregate hash derivation**:
1. Collect all file entries with `"status": "OK"` in lexicographic path order (same order as the `files` array, which is already sorted).
2. For each OK entry, form the string: `"<normalized_path>:<sha256_hex>"`.
3. Join all such strings with a single newline character `"\n"`. No trailing newline.
4. Compute SHA-256 of the UTF-8 encoded result.
5. Record the hex digest as `aggregate_hash`.

If zero OK files exist, compute SHA-256 of the empty string `""`.

**Repeatability**: Given the same source content and same file tree, the aggregate_hash is identical across repeated runs on any system with the same file contents.

---

## SECTION 5 — GIT ENRICHMENT CONTRACT

Git enrichment is performed only for `GIT_DIRECTORY` sources. It is never performed for `LOCAL_DIRECTORY` sources.

**Extraction mechanism**: subprocess calls to the local `git` binary. No remote queries are made. No network access.

**Git commands** (all run with `git -C <source_path>`):

| Field | Command |
|---|---|
| repo_name | `git -C <source_path> rev-parse --show-toplevel` → `os.path.basename(result)` |
| branch | `git -C <source_path> rev-parse --abbrev-ref HEAD` |
| head_commit | `git -C <source_path> rev-parse HEAD` |
| dirty state | `git -C <source_path> status --porcelain` → non-empty output = dirty |

**Dirty state rule**:
- If `git status --porcelain` output is non-empty (any staged or unstaged changes) → `dirty: true`.
- If output is empty (clean working tree) → `dirty: false`.
- `dirty_files`: list of relative file paths parsed from `git status --porcelain` output lines, extracting the filename portion (columns 3 onward of each line, stripped). Empty list if clean.

**subprocess invocation**: Use `subprocess.run([...], capture_output=True, text=True, check=False)`. Check `returncode == 0`. If non-zero → call `_fail(f"git command failed: {cmd} — returncode={result.returncode} stderr={result.stderr.strip()}")`.

**Schema for `git_metadata.json`**:
```json
{
  "intake_id": "<intake_id>",
  "source_path": "<absolute source path>",
  "source_type": "GIT_DIRECTORY",
  "repo_name": "<basename of git toplevel>",
  "branch": "<branch name>",
  "head_commit": "<full SHA>",
  "dirty": true | false,
  "dirty_files": ["<relative path>", ...],
  "extracted_at": "<ISO 8601 UTC timestamp>",
  "extraction_method": "local-git-binary",
  "remote_queries": false
}
```
Field types:
- `intake_id`: string
- `source_path`: string (absolute path)
- `source_type`: string, always `"GIT_DIRECTORY"`
- `repo_name`: string
- `branch`: string
- `head_commit`: string (40-character SHA hex)
- `dirty`: boolean
- `dirty_files`: array of strings (relative file paths); empty array if clean
- `extracted_at`: string, ISO 8601 UTC format `YYYY-MM-DDTHH:MM:SSZ`
- `extraction_method`: string, always `"local-git-binary"`
- `remote_queries`: boolean, always `false`

**Failure rule**: If any git command returns a non-zero exit code (e.g., corrupt repo, missing git binary), fail closed with a descriptive error message via `_fail()`. Do not proceed to write any output artifacts.

---

## SECTION 6 — OUTPUT DIRECTORY CONTRACT

**Output root**: `clients/<tenant>/psee/intake/<intake_id>/`

Resolved as: `os.path.join(_repo_root(), "clients", tenant, "psee", "intake", intake_id)`

**No-overwrite guard**: If the output directory already exists at the time of creation, call `_fail(f"intake output directory already exists at {output_dir} — use a unique intake_id")` and exit with code 1. No partial writes are made.

**Required files**:
- `intake_record.json` — always written
- `source_manifest.json` — always written
- `file_hash_manifest.json` — always written
- `git_metadata.json` — written ONLY for `GIT_DIRECTORY` sources; NEVER written for `LOCAL_DIRECTORY` sources

**Schema for `intake_record.json`**:
```json
{
  "intake_id": "<intake_id>",
  "tenant": "<tenant>",
  "source_path": "<absolute path to source>",
  "source_type": "LOCAL_DIRECTORY | GIT_DIRECTORY",
  "governed_by": "PRODUCTIZE.RAW.SOURCE.INTAKE.01",
  "created_at": "<ISO 8601 UTC timestamp>",
  "file_count": <integer>,
  "aggregate_hash": "<sha256 aggregate hex digest>",
  "git_enriched": true | false,
  "handover_status": "READY_FOR_BOOTSTRAP"
}
```
Field types:
- `intake_id`: string
- `tenant`: string
- `source_path`: string (absolute path)
- `source_type`: string, `"LOCAL_DIRECTORY"` or `"GIT_DIRECTORY"`
- `governed_by`: string, always `"PRODUCTIZE.RAW.SOURCE.INTAKE.01"`
- `created_at`: string, ISO 8601 UTC format `YYYY-MM-DDTHH:MM:SSZ`
- `file_count`: integer
- `aggregate_hash`: string (SHA-256 hex digest, 64 characters)
- `git_enriched`: boolean; `true` if `GIT_DIRECTORY`, `false` if `LOCAL_DIRECTORY`
- `handover_status`: string, always `"READY_FOR_BOOTSTRAP"`

**Schema for `source_manifest.json`**:
```json
{
  "intake_id": "<intake_id>",
  "tenant": "<tenant>",
  "source_path": "<absolute path>",
  "source_type": "LOCAL_DIRECTORY | GIT_DIRECTORY",
  "created_at": "<ISO 8601 UTC timestamp>",
  "files": [
    {
      "path": "<normalized relative path>",
      "size_bytes": <integer> | null
    }
  ],
  "directory_count": <integer>,
  "file_count": <integer>
}
```
Field types:
- `intake_id`: string
- `tenant`: string
- `source_path`: string (absolute path)
- `source_type`: string, `"LOCAL_DIRECTORY"` or `"GIT_DIRECTORY"`
- `created_at`: string, ISO 8601 UTC format `YYYY-MM-DDTHH:MM:SSZ`
- `files`: array of file entry objects
- `files[].path`: string, normalized POSIX relative path
- `files[].size_bytes`: integer for OK files; `null` for BROKEN_SYMLINK
- `directory_count`: integer; count of distinct parent directories of all included files (computed as `len(set(os.path.dirname(f["path"]) for f in files))`)
- `file_count`: integer; count of all included files

---

## SECTION 7 — HANDOVER TO BOOTSTRAP

The intake layer produces a governed intake bundle under `clients/<tenant>/psee/intake/<intake_id>/`. This bundle declares the source. It does NOT replace, modify, or write into any run directory or any S0–S4 artifact.

**Handover rule**:
1. After `pios intake create` completes successfully (exit code 0), the operator runs `pios ledger create` with `--source-version <intake_id>`. The `intake_id` is used as the `source_version` value in `clients/<tenant>/psee/runs/<run_id>/intake_record.json`. This creates an immutable, traceable link from the run ledger to the intake bundle.
2. The `intake_id` value passed as `source_version` is stored in the run's `intake_record.json` under the `source_version` field. This is the only link between the intake bundle and the run.
3. No field in the intake bundle (`clients/<tenant>/psee/intake/<intake_id>/intake_record.json`) is written to or modified after initial creation. The intake bundle is immutable after `pios intake create` exits.
4. No field in the run's `intake_record.json` (`clients/<tenant>/psee/runs/<run_id>/intake_record.json`) is modified by `pios intake create`. These are separate namespaces with no shared mutation.
5. No S0–S4 contract is modified. Bootstrap (`pios bootstrap`) reads from its own run directory only and has no dependency on the intake bundle directory.

**Exact handover sequence**:
```
pios intake create --source-path <path> --tenant <tenant> --intake-id <intake_id>
pios ledger create --run-id <run_id> --client <tenant> --source-version <intake_id>
pios bootstrap --run-dir clients/<tenant>/psee/runs/<run_id>
pios emit coverage --run-dir clients/<tenant>/psee/runs/<run_id> --ig-dir <ig_dir>
pios emit reconstruction --run-dir clients/<tenant>/psee/runs/<run_id> --ig-dir <ig_dir>
pios emit topology --run-dir clients/<tenant>/psee/runs/<run_id> --run-id <run_id>
pios emit signals --run-dir clients/<tenant>/psee/runs/<run_id>
pios compute gauge --run-dir clients/<tenant>/psee/runs/<run_id>
pios declare coherence --run-dir clients/<tenant>/psee/runs/<run_id>
pios validate freshness --run-dir clients/<tenant>/psee/runs/<run_id>
```

---

## SECTION 8 — CLI SURFACE

**Single new command**: `pios intake create`

**Full CLI signature**:
```
pios intake create \
  --source-path <path> \
  --tenant <tenant> \
  --intake-id <intake_id> \
  [--debug]
```

**Exit codes**:
- `0`: Intake bundle written successfully. All required artifacts are present in the output directory.
- `1`: Any error condition. Includes: invalid or missing source path, existing output directory, git extraction failure, hash failure, any unexpected exception. Called via `_fail(msg)` which calls `sys.exit(1)`.

**Help text must describe**:
- Purpose: create a governed intake bundle from a local source directory (pre-S0 layer)
- Required arguments: `--source-path`, `--tenant`, `--intake-id`
- Output artifacts: `intake_record.json`, `source_manifest.json`, `file_hash_manifest.json`, `git_metadata.json` (GIT_DIRECTORY only)
- Failure behavior: fails closed on invalid path, existing output directory, or git extraction failure
- Authority reference: PRODUCTIZE.RAW.SOURCE.INTAKE.01

**Debug output** (emitted when `--debug` flag is set):
- Resolved absolute source path
- Detected source type (`LOCAL_DIRECTORY` or `GIT_DIRECTORY`)
- File walk count (number of files included before and after exclusions)
- Excluded file count
- Computed aggregate hash
- Output directory path
- Git metadata summary (if GIT_DIRECTORY): repo_name, branch, head_commit, dirty state

---

## SECTION 9 — END-TO-END FLOW

The complete governed flow from raw source to validated gauge output:

**Step I-01**: `pios intake create --source-path <path> --tenant <tenant> --intake-id <intake_id>`  
Layer: pre-S0 (intake bundle creation)  
Output: `clients/<tenant>/psee/intake/<intake_id>/` with `intake_record.json`, `source_manifest.json`, `file_hash_manifest.json`, and `git_metadata.json` (GIT_DIRECTORY only)

**Step I-02**: `pios ledger create --run-id <run_id> --client <tenant> --source-version <intake_id>`  
Layer: S0 (run identity declaration)  
Output: `clients/<tenant>/psee/runs/<run_id>/intake_record.json` with `source_version=<intake_id>`

**Step I-03**: `pios bootstrap --run-dir clients/<tenant>/psee/runs/<run_id>`  
Layer: S0 prerequisite  
Output: `package/engine_state.json`, `package/gauge_inputs.json` (unchanged)

**Step I-04**: `pios emit coverage --run-dir <run_dir> --ig-dir <ig_dir>`  
Layer: S1 (unchanged)  
Output: `package/coverage_state.json`

**Step I-05**: `pios emit reconstruction --run-dir <run_dir> --ig-dir <ig_dir>`  
Layer: S1 (unchanged)  
Output: `package/reconstruction_state.json`

**Step I-06**: `pios emit topology --run-dir <run_dir> --run-id <run_id>`  
Layer: S2 (unchanged)  
Output: `package/canonical_topology.json`

**Step I-07**: `pios emit signals --run-dir <run_dir>`  
Layer: S3 (unchanged)  
Output: `package/signal_registry.json`

**Step I-08**: `pios compute gauge --run-dir <run_dir>`  
Layer: S4 (unchanged)  
Output: `package/gauge_state.json`

**Step I-09**: `pios declare coherence --run-dir <run_dir>`  
Layer: S3/S4 boundary (unchanged)  
Output: `coherence_record.json`

**Step I-10**: `pios validate freshness --run-dir <run_dir>`  
Layer: L8 validation (unchanged)  
Output: admissibility chain verdict

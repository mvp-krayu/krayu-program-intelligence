#!/usr/bin/env python3
"""
scripts/pios/tests/test_projection_runtime.py
PRODUCTIZE.LENS.PROJECTION.RUNTIME.01 / PRODUCTIZE.LENS.ZONE2.SAFE.PAYLOAD.01

Projection runtime test suite.

Test cases:
  TC-01: valid claim_id → L1 payload (ZONE-1)
  TC-02: same claim → ZONE-2 filtering applied (Z1 fields absent)
  TC-03: invalid claim_id → fail-closed (ProjectionError, no content)
  TC-04: zone violation → blocked (L3 at ZONE-2 → ZONE_INSUFFICIENT_FOR_L3)
  TC-05: claim_set → multiple payloads (ClaimSetPayload structure)
  TC-06: BC-01 propagation → CLM-25 always CONDITIONAL with caveat
  TC-07: signal claim ZONE-2 → signal_id stripped, business_impact present
  TC-08: ZONE-2 error → no detail field (info-leak prevention)
  TC-09: export_fragments → generates files for both zones
  TC-10: project_for_lens → all outputs are ZONE-2
  TC-11: Zone-2 safe payload profile enforcement (ZONE2.SAFE.PAYLOAD.01)

Authority: PRODUCTIZE.LENS.PROJECTION.CONTRACT.01
          PRODUCTIZE.LENS.ZONE2.SAFE.PAYLOAD.01
"""

import json
import sys
import tempfile
import unittest
from pathlib import Path

# Allow running from repo root or from this file's directory
REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
sys.path.insert(0, str(REPO_ROOT / "scripts" / "pios"))

from projection_runtime import (
    ZONE_1, ZONE_2, ZONE_3,
    L1, L2, L3,
    EVIDENCE_CONDITIONAL, EVIDENCE_PARTIAL, EVIDENCE_VERIFIED, EVIDENCE_BLOCKED,
    BC_01_CAVEAT, SIG_005_CAVEAT,
    ZONE2_L1_ALLOWED_FIELDS, ZONE2_SIGNAL_ALLOWED_SUBFIELDS,
    ZONE2_FORBIDDEN_FIELDS, ZONE2_FORBIDDEN_CONTENT_SUBSTRINGS,
    project, project_set, project_for_lens, export_fragments,
    resolve_claim, enforce_zone,
    _default_vault_path, _validate_zone2_payload,
)

VAULT_PATH = REPO_ROOT / "clients" / "blueedge" / "vaults" / "run_01_authoritative"


def is_error(payload: dict) -> bool:
    return "error_type" in payload


class TC01_ValidClaimL1Zone1(unittest.TestCase):
    """TC-01: valid claim_id → L1 payload (ZONE-1)"""

    def test_returns_payload_not_error(self):
        result = project("CLM-09", ZONE_1, L1, VAULT_PATH)
        self.assertNotIn("error_type", result, f"Unexpected error: {result}")

    def test_envelope_fields_present(self):
        result = project("CLM-09", ZONE_1, L1, VAULT_PATH)
        for field in ("projection_id", "claim_id", "zone", "depth",
                      "evidence_class", "persona", "run_id", "generated_at",
                      "trace_available", "caveats"):
            self.assertIn(field, result, f"Missing envelope field: {field}")

    def test_claim_id_correct(self):
        result = project("CLM-09", ZONE_1, L1, VAULT_PATH)
        self.assertEqual(result["claim_id"], "CLM-09")

    def test_zone_in_payload(self):
        result = project("CLM-09", ZONE_1, L1, VAULT_PATH)
        self.assertEqual(result["zone"], ZONE_1)

    def test_value_has_raw_and_narrative(self):
        result = project("CLM-09", ZONE_1, L1, VAULT_PATH)
        value = result.get("value", {})
        self.assertIn("raw", value, "ZONE-1 should carry raw value")
        self.assertIn("narrative", value)

    def test_z1_fields_present(self):
        result = project("CLM-09", ZONE_1, L1, VAULT_PATH)
        self.assertIn("source_field", result, "source_field must be present in ZONE-1")
        self.assertIn("transformation_summary", result)

    def test_evidence_class_verified(self):
        result = project("CLM-09", ZONE_1, L1, VAULT_PATH)
        self.assertEqual(result["evidence_class"], EVIDENCE_VERIFIED)

    def test_claim_label_includes_id(self):
        result = project("CLM-09", ZONE_1, L1, VAULT_PATH)
        self.assertIn("CLM-09", result.get("claim_label", ""),
                      "ZONE-1 claim_label should include CLM-XX annotation")

    def test_projection_id_format(self):
        result = project("CLM-09", ZONE_1, L1, VAULT_PATH)
        pid = result.get("projection_id", "")
        self.assertTrue(pid.startswith("PROJ-CLM-09-ZONE-1-L1-"),
                        f"Unexpected projection_id: {pid}")


class TC02_Zone2FilteringApplied(unittest.TestCase):
    """TC-02: same claim at ZONE-2 → Z1 fields absent, ZONE-2 form correct"""

    def setUp(self):
        self.result = project("CLM-09", ZONE_2, L1, VAULT_PATH)

    def test_no_error(self):
        self.assertNotIn("error_type", self.result)

    def test_z1_field_source_field_absent(self):
        self.assertNotIn("source_field", self.result,
                         "source_field (Z1) must be stripped from ZONE-2 payload")

    def test_z1_field_transformation_summary_absent(self):
        self.assertNotIn("transformation_summary", self.result,
                         "transformation_summary (Z1) must be stripped from ZONE-2 payload")

    def test_value_has_no_raw(self):
        value = self.result.get("value", {})
        self.assertNotIn("raw", value, "value.raw (Z1) must be stripped from ZONE-2")

    def test_value_has_narrative(self):
        value = self.result.get("value", {})
        self.assertIn("narrative", value)
        self.assertIn("60", value["narrative"])

    def test_claim_label_no_clm_annotation(self):
        label = self.result.get("claim_label", "")
        self.assertNotIn("CLM-09", label,
                         "ZONE-2 claim_label must not contain CLM-XX annotation")

    def test_zone_in_payload(self):
        self.assertEqual(self.result["zone"], ZONE_2)

    def test_explanation_uses_why_it_matters(self):
        # ZONE-2 explanation comes from "Why It Matters" section
        explanation = self.result.get("explanation", "")
        self.assertGreater(len(explanation), 20, "ZONE-2 explanation should not be empty")
        # Should not contain technical PSEE internals
        self.assertNotIn("coverage_points", explanation.lower(),
                         "ZONE-2 explanation must not contain derivation formula")

    def test_projection_id_zone2(self):
        pid = self.result.get("projection_id", "")
        self.assertIn("ZONE-2", pid)


class TC03_InvalidClaimIdFailClosed(unittest.TestCase):
    """TC-03: invalid claim_id → fail-closed, no content leakage"""

    def test_returns_error_not_payload(self):
        result = project("CLM-99", ZONE_1, L1, VAULT_PATH)
        self.assertIn("error_type", result)

    def test_error_type_zone_filter_failure(self):
        result = project("CLM-99", ZONE_1, L1, VAULT_PATH)
        self.assertEqual(result["error_type"], "ZONE_FILTER_FAILURE")

    def test_reason_claim_not_found(self):
        result = project("CLM-99", ZONE_1, L1, VAULT_PATH)
        self.assertEqual(result["reason"], "CLAIM_NOT_IN_VAULT")

    def test_no_vault_content_in_error(self):
        result = project("CLM-99", ZONE_1, L1, VAULT_PATH)
        payload_str = json.dumps(result)
        self.assertNotIn("gauge_state.json", payload_str,
                         "Vault content must not appear in error response")
        self.assertNotIn("score.canonical", payload_str)

    def test_empty_string_claim_id(self):
        result = project("", ZONE_1, L1, VAULT_PATH)
        self.assertIn("error_type", result)

    def test_stage_field_present(self):
        result = project("CLM-99", ZONE_1, L1, VAULT_PATH)
        self.assertIn("stage", result)


class TC04_ZoneViolationBlocked(unittest.TestCase):
    """TC-04: zone violation → fail-closed with specific reason codes"""

    def test_l3_at_zone2_returns_error(self):
        result = project("CLM-09", ZONE_2, L3, VAULT_PATH)
        self.assertIn("error_type", result)

    def test_l3_at_zone2_reason(self):
        result = project("CLM-09", ZONE_2, L3, VAULT_PATH)
        self.assertEqual(result["reason"], "ZONE_INSUFFICIENT_FOR_L3")

    def test_l3_at_zone1_returns_error(self):
        result = project("CLM-09", ZONE_1, L3, VAULT_PATH)
        self.assertIn("error_type", result)
        self.assertEqual(result["reason"], "ZONE_INSUFFICIENT_FOR_L3")

    def test_l3_at_zone3_succeeds(self):
        result = project("CLM-09", ZONE_3, L3, VAULT_PATH)
        # Should succeed (not a zone violation)
        self.assertNotEqual(result.get("reason"), "ZONE_INSUFFICIENT_FOR_L3",
                            "L3 at ZONE-3 should not be a zone violation")

    def test_invalid_zone_value(self):
        result = project("CLM-09", "ZONE-9", L1, VAULT_PATH)
        self.assertIn("error_type", result)
        self.assertEqual(result["reason"], "INVALID_ZONE")

    def test_invalid_depth_value(self):
        result = project("CLM-09", ZONE_1, "L9", VAULT_PATH)
        self.assertIn("error_type", result)
        self.assertEqual(result["reason"], "INVALID_DEPTH")

    def test_stage_1_for_validation_errors(self):
        result = project("CLM-09", ZONE_2, L3, VAULT_PATH)
        self.assertEqual(result["stage"], "STAGE_1")


class TC05_ClaimSetMultiplePayloads(unittest.TestCase):
    """TC-05: claim_set → ClaimSetPayload with correct structure"""

    def setUp(self):
        self.result = project_set("SCORE_ZONE", ZONE_1, L1, VAULT_PATH)

    def test_not_error(self):
        self.assertNotIn("error_type", self.result)

    def test_has_claim_set_id(self):
        self.assertEqual(self.result["claim_set_id"], "SCORE_ZONE")

    def test_items_count(self):
        # SCORE_ZONE = CLM-09, CLM-10, CLM-12, CLM-11
        self.assertEqual(len(self.result["items"]), 4)

    def test_items_are_payloads(self):
        for item in self.result["items"]:
            self.assertNotIn("error_type", item, f"Item should not be an error: {item}")

    def test_set_evidence_class_present(self):
        self.assertIn("set_evidence_class", self.result)

    def test_set_caveats_present(self):
        self.assertIn("set_caveats", self.result)
        self.assertIsInstance(self.result["set_caveats"], list)

    def test_minimum_evidence_class(self):
        # CLM-10 is CONDITIONAL (achievable score requires runtime)
        # So the set should not be VERIFIED
        set_ec = self.result["set_evidence_class"]
        item_classes = [i.get("evidence_class") for i in self.result["items"]]
        from projection_runtime import EVIDENCE_ORDER
        min_ec = min(item_classes, key=lambda x: EVIDENCE_ORDER.index(x) if x in EVIDENCE_ORDER else 0)
        self.assertEqual(set_ec, min_ec, "set_evidence_class must be the weakest-link class")

    def test_unknown_claim_set_id(self):
        result = project_set("INVALID_ZONE_XYZ", ZONE_1, L1, VAULT_PATH)
        self.assertIn("error_type", result)
        self.assertEqual(result["reason"], "UNKNOWN_CLAIM_SET_ID")


class TC06_BC01_CLM25_Caveat(unittest.TestCase):
    """TC-06: CLM-25 always CONDITIONAL with BC-01 caveat (both zones)"""

    def test_zone1_conditional(self):
        result = project("CLM-25", ZONE_1, L1, VAULT_PATH)
        self.assertNotIn("error_type", result)
        self.assertEqual(result["evidence_class"], EVIDENCE_CONDITIONAL)

    def test_zone1_bc01_caveat_present(self):
        result = project("CLM-25", ZONE_1, L1, VAULT_PATH)
        caveats = result.get("caveats", [])
        self.assertTrue(any("CONCEPT-06" in c for c in caveats),
                        "BC-01 CONCEPT-06 caveat must be present")

    def test_zone2_conditional(self):
        result = project("CLM-25", ZONE_2, L1, VAULT_PATH)
        self.assertNotIn("error_type", result)
        self.assertEqual(result["evidence_class"], EVIDENCE_CONDITIONAL)

    def test_zone2_has_caveats(self):
        result = project("CLM-25", ZONE_2, L1, VAULT_PATH)
        self.assertTrue(len(result.get("caveats", [])) > 0,
                        "CONDITIONAL claim must have non-empty caveats")


class TC07_SignalClaimZone2(unittest.TestCase):
    """TC-07: signal claim (CLM-20) at ZONE-2 → signal_id stripped, business_impact present"""

    def setUp(self):
        self.result = project("CLM-20", ZONE_2, L1, VAULT_PATH)

    def test_no_error(self):
        self.assertNotIn("error_type", self.result)

    def test_signal_block_present(self):
        self.assertIn("signal", self.result, "Signal claims should carry signal block")

    def test_signal_id_stripped(self):
        signal = self.result.get("signal", {})
        self.assertNotIn("signal_id", signal,
                         "signal_id (Z1) must be stripped from ZONE-2 signal block")

    def test_signal_title_present(self):
        signal = self.result.get("signal", {})
        self.assertIn("title", signal)
        self.assertIsNotNone(signal["title"])

    def test_signal_business_impact_present(self):
        signal = self.result.get("signal", {})
        self.assertIn("business_impact", signal)
        self.assertIsNotNone(signal["business_impact"])

    def test_signal_risk_present(self):
        signal = self.result.get("signal", {})
        self.assertIn("risk", signal)
        self.assertIsNotNone(signal["risk"])

    def test_signal_id_present_in_zone1(self):
        result_z1 = project("CLM-20", ZONE_1, L1, VAULT_PATH)
        signal = result_z1.get("signal", {})
        self.assertIn("signal_id", signal,
                      "signal_id must be present in ZONE-1 signal block")


class TC08_Zone2ErrorNoDetail(unittest.TestCase):
    """TC-08: ZONE-2 errors must not carry detail field (info-leak prevention)"""

    def test_invalid_claim_zone2_no_detail(self):
        result = project("CLM-99", ZONE_2, L1, VAULT_PATH)
        self.assertIn("error_type", result)
        self.assertNotIn("detail", result,
                         "ZONE-2 error must not carry detail field")

    def test_zone_violation_zone2_no_detail(self):
        result = project("CLM-09", ZONE_2, L3, VAULT_PATH)
        self.assertIn("error_type", result)
        self.assertNotIn("detail", result,
                         "ZONE-2 error must not carry detail field")

    def test_zone1_error_has_detail(self):
        result = project("CLM-99", ZONE_1, L1, VAULT_PATH)
        self.assertIn("error_type", result)
        self.assertIn("detail", result,
                      "ZONE-1 error should carry detail for operator diagnostics")


class TC09_ExportFragments(unittest.TestCase):
    """TC-09: export_fragments → generates files for both zones"""

    def test_creates_fragment_files(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            output_dir = Path(tmpdir)
            count = export_fragments(output_dir, VAULT_PATH)
            self.assertGreater(count, 0, "Should export at least one fragment")

    def test_zone1_and_zone2_files_exist(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            output_dir = Path(tmpdir)
            export_fragments(output_dir, VAULT_PATH)
            files = list(output_dir.iterdir())
            zone1_files = [f for f in files if "ZONE-1" in f.name]
            zone2_files = [f for f in files if "ZONE-2" in f.name]
            self.assertGreater(len(zone1_files), 0, "Should have ZONE-1 fragments")
            self.assertGreater(len(zone2_files), 0, "Should have ZONE-2 fragments")

    def test_fragment_is_valid_json(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            output_dir = Path(tmpdir)
            export_fragments(output_dir, VAULT_PATH)
            for f in output_dir.iterdir():
                if f.suffix == ".json":
                    data = json.loads(f.read_text(encoding="utf-8"))
                    self.assertIsInstance(data, dict)
                    break  # spot check one file

    def test_zone2_fragment_has_no_z1_fields(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            output_dir = Path(tmpdir)
            export_fragments(output_dir, VAULT_PATH)
            for f in output_dir.iterdir():
                if "CLM-09-ZONE-2" in f.name:
                    data = json.loads(f.read_text(encoding="utf-8"))
                    self.assertNotIn("source_field", data)
                    self.assertNotIn("transformation_summary", data)
                    break


class TC10_ProjectForLens(unittest.TestCase):
    """TC-10: project_for_lens → all outputs are ZONE-2"""

    def test_returns_list(self):
        results = project_for_lens(["CLM-09", "CLM-10"], VAULT_PATH)
        self.assertIsInstance(results, list)
        self.assertEqual(len(results), 2)

    def test_all_zone2(self):
        results = project_for_lens(["CLM-09", "CLM-10", "CLM-25"], VAULT_PATH)
        for r in results:
            if "error_type" not in r:
                self.assertEqual(r.get("zone"), ZONE_2,
                                 "project_for_lens must produce ZONE-2 payloads only")

    def test_no_z1_fields_in_any_result(self):
        results = project_for_lens(["CLM-09", "CLM-20"], VAULT_PATH)
        for r in results:
            if "error_type" not in r:
                self.assertNotIn("source_field", r)
                self.assertNotIn("transformation_summary", r)

    def test_clm25_conditional_with_caveat(self):
        results = project_for_lens(["CLM-25"], VAULT_PATH)
        clm25 = results[0]
        if "error_type" not in clm25:
            self.assertEqual(clm25["evidence_class"], EVIDENCE_CONDITIONAL)
            self.assertTrue(len(clm25.get("caveats", [])) > 0)


class TC11_Zone2PayloadSafety(unittest.TestCase):
    """
    TC-11: Zone-2 safe payload profile enforcement
    Authority: PRODUCTIZE.LENS.ZONE2.SAFE.PAYLOAD.01

    Verifies that _validate_zone2_payload() enforces the canonical
    ZONE-2 safe payload profile at the field, key-pattern, subblock,
    and content-substring levels.
    """

    def test_no_forbidden_fields_present(self):
        """CLM-20 ZONE-2 payload contains none of the absolutely forbidden fields."""
        result = project("CLM-20", ZONE_2, L1, VAULT_PATH)
        self.assertNotIn("error_type", result, f"Projection failed: {result}")

        # Named forbidden fields
        for fname in ("source_field", "transformation_summary", "signal_id"):
            self.assertNotIn(fname, result, f"Forbidden field '{fname}' present in ZONE-2 payload")

        # Forbidden key patterns
        for key in result:
            for pattern in ("_path", "_file", "_graph"):
                self.assertNotIn(pattern, key,
                                 f"Key '{key}' contains forbidden pattern '{pattern}'")

    def test_allowed_fields_only(self):
        """Top-level keys in ZONE-2 payload are a subset of the allowed set."""
        for claim_id in ("CLM-09", "CLM-20", "CLM-25", "CLM-13"):
            result = project(claim_id, ZONE_2, L1, VAULT_PATH)
            if "error_type" in result:
                continue  # skip claims that error (e.g., BLOCKED)
            unknown = set(result.keys()) - ZONE2_L1_ALLOWED_FIELDS
            self.assertEqual(
                unknown, set(),
                f"CLM {claim_id} ZONE-2 payload contains unknown fields: {unknown}",
            )

    def test_signal_block_sanitized(self):
        """Signal subblock contains only the four allowed subfields; signal_id is absent."""
        result = project("CLM-20", ZONE_2, L1, VAULT_PATH)
        self.assertNotIn("error_type", result)

        signal = result.get("signal")
        self.assertIsNotNone(signal, "CLM-20 ZONE-2 should have a signal block")
        self.assertIsInstance(signal, dict)

        # signal_id must be absent
        self.assertNotIn("signal_id", signal, "signal_id (Z1) must be absent from ZONE-2 signal block")

        # Only allowed subfields
        unknown_sig = set(signal.keys()) - ZONE2_SIGNAL_ALLOWED_SUBFIELDS
        self.assertEqual(
            unknown_sig, set(),
            f"Signal subblock contains forbidden subfields: {unknown_sig}",
        )

        # Mandatory allowed subfields present
        for required in ("title", "business_impact", "risk", "evidence_confidence"):
            self.assertIn(required, signal, f"Signal subfield '{required}' missing from ZONE-2 signal block")

    def test_no_structural_leakage_strings(self):
        """explanation field does not contain internal ID substrings."""
        for claim_id in ("CLM-09", "CLM-20", "CLM-25", "CLM-24"):
            result = project(claim_id, ZONE_2, L1, VAULT_PATH)
            if "error_type" in result:
                continue
            explanation = result.get("explanation", "")
            for forbidden in ZONE2_FORBIDDEN_CONTENT_SUBSTRINGS:
                self.assertNotIn(
                    forbidden, explanation,
                    f"CLM {claim_id}: forbidden substring '{forbidden}' found in ZONE-2 explanation",
                )

    def test_profile_violation_fails(self):
        """Injecting a forbidden field into a ZONE-2 payload triggers ERROR_ZONE2_PROFILE_VIOLATION."""
        # Minimal mock payload: valid ZONE-2 envelope + forbidden field injected
        mock_payload = {
            "zone":          ZONE_2,
            "depth":         L1,
            "claim_id":      "CLM-09",
            "generated_at":  "2026-04-15T00:00:00+00:00",
            "source_field":  "gauge_state.json \u2192 score.canonical",  # FORBIDDEN
        }
        result = _validate_zone2_payload(mock_payload)
        self.assertIsNotNone(result, "Validator should return an error for forbidden field injection")
        self.assertEqual(result["reason"], "ERROR_ZONE2_PROFILE_VIOLATION")
        self.assertEqual(result["error_type"], "ZONE2_PROFILE_VIOLATION")

    def test_profile_violation_unknown_field(self):
        """Adding an unknown top-level field to a ZONE-2 payload triggers violation."""
        mock_payload = {
            "zone":              ZONE_2,
            "depth":             L1,
            "claim_id":          "CLM-09",
            "generated_at":      "2026-04-15T00:00:00+00:00",
            "projection_id":     "PROJ-CLM-09-ZONE-2-L1-xxxxx",
            "evidence_class":    "VERIFIED",
            "persona":           "shared",
            "run_id":            "run_test",
            "trace_available":   True,
            "caveats":           [],
            "claim_label":       "Proven Score",
            "value":             {"narrative": "Proven: 60/100"},
            "explanation":       "This is the proven floor.",
            "trace_depth_available": ["L2", "L3"],
            "undisclosed_field": "injected",  # NOT in allowed set
        }
        result = _validate_zone2_payload(mock_payload)
        self.assertIsNotNone(result)
        self.assertEqual(result["reason"], "ERROR_ZONE2_PROFILE_VIOLATION")

    def test_profile_no_violation_on_zone1(self):
        """_validate_zone2_payload is a no-op for ZONE-1 payloads."""
        mock_payload = {
            "zone":           ZONE_1,
            "source_field":   "gauge_state.json \u2192 score.canonical",
            "transformation_summary": "coverage_points(35) + ...",
        }
        result = _validate_zone2_payload(mock_payload)
        self.assertIsNone(result, "Validator must be a no-op for ZONE-1 payloads")

    def test_value_raw_forbidden_in_zone2(self):
        """value.raw in a ZONE-2 payload is a profile violation."""
        mock_payload = {
            "zone":          ZONE_2,
            "depth":         L1,
            "claim_id":      "CLM-09",
            "generated_at":  "2026-04-15T00:00:00+00:00",
            "projection_id": "PROJ-CLM-09-ZONE-2-L1-xxxxx",
            "evidence_class": "VERIFIED",
            "persona":        "shared",
            "run_id":         "run_test",
            "trace_available": True,
            "caveats":        [],
            "claim_label":    "Proven Score",
            "value":          {"narrative": "Proven: 60/100", "raw": "60"},  # raw FORBIDDEN
            "explanation":    "The proven floor.",
            "trace_depth_available": ["L2", "L3"],
        }
        result = _validate_zone2_payload(mock_payload)
        self.assertIsNotNone(result)
        self.assertEqual(result["reason"], "ERROR_ZONE2_PROFILE_VIOLATION")

    def test_live_zone2_payloads_pass_profile(self):
        """All representative live ZONE-2 projections pass the profile validator."""
        claims_to_check = ["CLM-09", "CLM-10", "CLM-12", "CLM-20", "CLM-25", "CLM-24"]
        for claim_id in claims_to_check:
            result = project(claim_id, ZONE_2, L1, VAULT_PATH)
            if "error_type" in result:
                continue  # skip claims that legitimately error
            violation = _validate_zone2_payload(result)
            self.assertIsNone(
                violation,
                f"CLM {claim_id} ZONE-2 live payload failed profile validation: {violation}",
            )


if __name__ == "__main__":
    unittest.main(verbosity=2)

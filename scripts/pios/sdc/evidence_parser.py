"""
Semantic Derivation Compiler — Evidence Parser (P1)
Deterministic HTML parsing → structured intermediate representation.
Uses stdlib html.parser only — no external dependencies.
"""

import hashlib
import json
from dataclasses import dataclass, field, asdict
from html.parser import HTMLParser
from pathlib import Path
from typing import Optional


# ---------------------------------------------------------------------------
# Intermediate representation
# ---------------------------------------------------------------------------

@dataclass
class ModuleCard:
    name: str
    description: str
    badge: str
    group_name: str
    section_id: str
    source_file: str

@dataclass
class FrontendPage:
    route: str
    name: str
    description: str
    section_id: str
    source_file: str

@dataclass
class DocumentSection:
    section_id: str
    number: str
    title: str
    description: str
    source_file: str

@dataclass
class LayerEntry:
    layer_label: str
    layer_name: str
    layer_description: str
    modules: list[ModuleCard] = field(default_factory=list)
    section_id: str = ""
    source_file: str = ""

@dataclass
class GroupBlock:
    name: str
    count_declared: Optional[int]
    modules: list[ModuleCard] = field(default_factory=list)
    section_id: str = ""
    source_file: str = ""

@dataclass
class TechnologyEntry:
    name: str
    description: str
    context: str
    section_id: str = ""
    source_file: str = ""

@dataclass
class EvidenceDocument:
    file_path: str
    file_hash: str
    title: str
    sections: list[DocumentSection] = field(default_factory=list)
    groups: list[GroupBlock] = field(default_factory=list)
    layers: list[LayerEntry] = field(default_factory=list)
    module_cards: list[ModuleCard] = field(default_factory=list)
    all_module_cards: list[ModuleCard] = field(default_factory=list)
    frontend_pages: list[FrontendPage] = field(default_factory=list)
    technology_entries: list[TechnologyEntry] = field(default_factory=list)
    stats: dict = field(default_factory=dict)

    def to_dict(self) -> dict:
        return asdict(self)

@dataclass
class ParseResult:
    documents: list[EvidenceDocument] = field(default_factory=list)
    total_components: int = 0
    total_frontend_pages: int = 0
    total_groups: int = 0
    total_sections: int = 0
    evidence_hashes: dict[str, str] = field(default_factory=dict)
    status: str = "OK"
    error: Optional[str] = None

    def to_dict(self) -> dict:
        return asdict(self)


# ---------------------------------------------------------------------------
# HTML parser — extracts structured elements from evidence HTML
# ---------------------------------------------------------------------------

class EvidenceHTMLParser(HTMLParser):

    def __init__(self, source_file: str):
        super().__init__()
        self.source_file = source_file

        # Parse state
        self._tag_stack: list[str] = []
        self._class_stack: list[str] = []
        self._current_text = ""
        self._capture_text = False

        # Section tracking
        self._current_section_id = ""
        self._current_section_number = ""
        self._current_section_title = ""
        self._current_section_desc = ""
        self._in_section_number = False
        self._in_section_title = False
        self._in_section_desc = False
        self.sections: list[DocumentSection] = []

        # Group tracking (.dia containers in s4)
        self._in_group_header = False
        self._current_group_name = ""
        self._current_group_count: Optional[int] = None
        self.groups: list[GroupBlock] = []
        self._current_group: Optional[GroupBlock] = None

        # Module card tracking (.m containers)
        self._in_module_card = False
        self._in_module_name = False
        self._in_module_desc = False
        self._in_module_badge = False
        self._current_module_name = ""
        self._current_module_desc = ""
        self._current_module_badge = ""
        self.module_cards: list[ModuleCard] = []

        # Frontend page tracking (.pi containers)
        self._in_page_item = False
        self._in_page_route = False
        self._in_page_name = False
        self._in_page_desc = False
        self._current_page_route = ""
        self._current_page_name = ""
        self._current_page_desc = ""
        self.frontend_pages: list[FrontendPage] = []

        # Layer tracking (.ly containers in s1)
        self._in_layer = False
        self._in_layer_label = False
        self._in_layer_name = False
        self._in_layer_desc = False
        self._current_layer_label = ""
        self._current_layer_name = ""
        self._current_layer_desc = ""
        self.layers: list[LayerEntry] = []
        self._current_layer: Optional[LayerEntry] = None

        # Stats from hero (.st containers)
        self._in_stat = False
        self._in_stat_value = False
        self._in_stat_label = False
        self._current_stat_value = ""
        self._current_stat_label = ""
        self.stats: dict[str, str] = {}

        # Title
        self._in_title = False
        self.title = ""

        # Technology tracking
        self.technology_entries: list[TechnologyEntry] = []

    def _get_class(self, attrs: list[tuple[str, Optional[str]]]) -> str:
        for name, value in attrs:
            if name == "class" and value:
                return value
        return ""

    def _get_id(self, attrs: list[tuple[str, Optional[str]]]) -> str:
        for name, value in attrs:
            if name == "id" and value:
                return value
        return ""

    def handle_starttag(self, tag: str, attrs: list[tuple[str, Optional[str]]]):
        cls = self._get_class(attrs)
        tag_id = self._get_id(attrs)
        self._tag_stack.append(tag)
        self._class_stack.append(cls)

        # Title
        if tag == "title":
            self._in_title = True
            self._current_text = ""

        # Section boundaries
        if tag == "section" and "sec" in cls.split():
            self._current_section_id = tag_id

        if "sn" in cls.split():
            self._in_section_number = True
            self._current_text = ""

        if "st2" in cls.split():
            self._in_section_title = True
            self._current_text = ""

        if "sd" in cls.split():
            self._in_section_desc = True
            self._current_text = ""

        # Stat blocks in hero
        if tag == "div" and "st" in cls.split() and "st2" not in cls.split():
            self._in_stat = True

        if self._in_stat and "v" in cls.split() and tag == "div":
            self._in_stat_value = True
            self._current_text = ""

        if self._in_stat and "l" in cls.split() and tag == "div":
            self._in_stat_label = True
            self._current_text = ""

        # Group headers (.dia > .dh > h3)
        if tag == "div" and "dia" in cls.split():
            self._current_group = GroupBlock(
                name="", count_declared=None,
                section_id=self._current_section_id,
                source_file=self.source_file
            )

        if tag == "div" and "dh" in cls.split():
            self._in_group_header = True

        if self._in_group_header and tag == "h3":
            self._capture_text = True
            self._current_text = ""

        # Layer entries (.ly containers)
        if tag == "div" and any(c.startswith("ly") for c in cls.split()):
            self._in_layer = True
            self._current_layer = LayerEntry(
                layer_label="", layer_name="", layer_description="",
                section_id=self._current_section_id,
                source_file=self.source_file
            )

        if self._in_layer and "lt" in cls.split():
            self._in_layer_label = True
            self._current_text = ""

        if self._in_layer and "ln" in cls.split():
            self._in_layer_name = True
            self._current_text = ""

        if self._in_layer and "ls" in cls.split():
            self._in_layer_desc = True
            self._current_text = ""

        # Module cards (.m inside .mods)
        if tag == "div" and "m" in cls.split() and len(cls.split()) == 1:
            self._in_module_card = True
            self._current_module_name = ""
            self._current_module_desc = ""
            self._current_module_badge = ""

        if self._in_module_card and "mn" in cls.split():
            self._in_module_name = True
            self._current_text = ""

        if self._in_module_card and "md" in cls.split():
            self._in_module_desc = True
            self._current_text = ""

        if self._in_module_card and cls.startswith("mb"):
            self._in_module_badge = True
            self._current_text = ""

        # Frontend pages (.pi inside .pg)
        if tag == "div" and "pi" in cls.split():
            self._in_page_item = True
            self._current_page_route = ""
            self._current_page_name = ""
            self._current_page_desc = ""

        if self._in_page_item and "pr" in cls.split():
            self._in_page_route = True
            self._current_text = ""

        if self._in_page_item and "pn" in cls.split():
            self._in_page_name = True
            self._current_text = ""

        if self._in_page_item and "pt" in cls.split():
            self._in_page_desc = True
            self._current_text = ""

    def handle_endtag(self, tag: str):
        if not self._tag_stack:
            return

        cls = self._class_stack[-1] if self._class_stack else ""

        # Title
        if tag == "title" and self._in_title:
            self.title = self._current_text.strip()
            self._in_title = False

        # Section number/title/desc
        if self._in_section_number and tag == "div":
            self._current_section_number = self._current_text.strip()
            self._in_section_number = False

        if self._in_section_title and tag == "div":
            self._current_section_title = self._current_text.strip()
            self._in_section_title = False

        if self._in_section_desc and tag == "div":
            self._current_section_desc = self._current_text.strip()
            self._in_section_desc = False
            self.sections.append(DocumentSection(
                section_id=self._current_section_id,
                number=self._current_section_number,
                title=self._current_section_title,
                description=self._current_section_desc,
                source_file=self.source_file
            ))

        # Stats
        if self._in_stat_value and tag == "div":
            self._current_stat_value = self._current_text.strip()
            self._in_stat_value = False

        if self._in_stat_label and tag == "div":
            self._current_stat_label = self._current_text.strip()
            self._in_stat_label = False
            if self._current_stat_label and self._current_stat_value:
                self.stats[self._current_stat_label] = self._current_stat_value

        if self._in_stat and tag == "div" and "st" in cls.split() and "st2" not in cls.split():
            self._in_stat = False

        # Group header close
        if self._in_group_header and tag == "h3":
            raw = self._current_text.strip()
            self._capture_text = False
            if self._current_group is not None:
                name, count = _parse_group_header(raw)
                self._current_group.name = name
                self._current_group.count_declared = count

        if self._in_group_header and tag == "div":
            self._in_group_header = False

        # Layer label/name/desc close
        if self._in_layer_label and tag == "div":
            if self._current_layer is not None:
                self._current_layer.layer_label = self._current_text.strip()
            self._in_layer_label = False

        if self._in_layer_name and tag == "div":
            if self._current_layer is not None:
                self._current_layer.layer_name = self._current_text.strip()
            self._in_layer_name = False

        if self._in_layer_desc and tag == "div":
            if self._current_layer is not None:
                self._current_layer.layer_description = self._current_text.strip()
            self._in_layer_desc = False

        # Module card fields
        if self._in_module_name and tag == "div":
            self._current_module_name = _strip_emoji(self._current_text.strip())
            self._in_module_name = False

        if self._in_module_desc and tag == "div":
            self._current_module_desc = self._current_text.strip()
            self._in_module_desc = False

        if self._in_module_badge and tag == "div":
            self._current_module_badge = self._current_text.strip()
            self._in_module_badge = False

        # Module card close
        if self._in_module_card and tag == "div" and "m" in cls.split() and len(cls.split()) == 1:
            group_name = ""
            if self._current_group is not None:
                group_name = self._current_group.name
            elif self._current_layer is not None:
                group_name = self._current_layer.layer_label

            card = ModuleCard(
                name=self._current_module_name,
                description=self._current_module_desc,
                badge=self._current_module_badge,
                group_name=group_name,
                section_id=self._current_section_id,
                source_file=self.source_file
            )
            self.module_cards.append(card)

            if self._current_group is not None:
                self._current_group.modules.append(card)
            if self._current_layer is not None:
                self._current_layer.modules.append(card)

            self._in_module_card = False

        # Layer close
        if self._in_layer and tag == "div" and any(
            c.startswith("ly") for c in cls.split()
        ):
            if self._current_layer is not None:
                self.layers.append(self._current_layer)
            self._current_layer = None
            self._in_layer = False

        # Group (.dia) close
        if tag == "div" and "dia" in cls.split():
            if self._current_group is not None and self._current_group.name:
                self.groups.append(self._current_group)
            self._current_group = None

        # Frontend page fields
        if self._in_page_route and tag == "div":
            self._current_page_route = self._current_text.strip()
            self._in_page_route = False

        if self._in_page_name and tag == "div":
            self._current_page_name = self._current_text.strip()
            self._in_page_name = False

        if self._in_page_desc and tag == "div":
            self._current_page_desc = self._current_text.strip()
            self._in_page_desc = False

        # Page item close
        if self._in_page_item and tag == "div" and "pi" in cls.split():
            self.frontend_pages.append(FrontendPage(
                route=self._current_page_route,
                name=self._current_page_name,
                description=self._current_page_desc,
                section_id=self._current_section_id,
                source_file=self.source_file
            ))
            self._in_page_item = False

        self._tag_stack.pop()
        self._class_stack.pop()

    def handle_data(self, data: str):
        if self._in_title:
            self._current_text += data
        if self._in_section_number:
            self._current_text += data
        if self._in_section_title:
            self._current_text += data
        if self._in_section_desc:
            self._current_text += data
        if self._in_stat_value:
            self._current_text += data
        if self._in_stat_label:
            self._current_text += data
        if self._capture_text:
            self._current_text += data
        if self._in_layer_label:
            self._current_text += data
        if self._in_layer_name:
            self._current_text += data
        if self._in_layer_desc:
            self._current_text += data
        if self._in_module_name:
            self._current_text += data
        if self._in_module_desc:
            self._current_text += data
        if self._in_module_badge:
            self._current_text += data
        if self._in_page_route:
            self._current_text += data
        if self._in_page_name:
            self._current_text += data
        if self._in_page_desc:
            self._current_text += data


# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------

def _strip_emoji(text: str) -> str:
    """Remove leading emoji characters from module names."""
    import re
    return re.sub(
        r'^[\U0001F300-\U0001FAFF\U00002702-\U000027B0\U0000FE00-\U0000FE0F'
        r'\U0000200D\U00002600-\U000026FF\U00002700-\U000027BF\s]+',
        '', text
    ).strip()


def _parse_group_header(raw: str) -> tuple[str, Optional[int]]:
    """Parse 'Group Name (N)' → ('Group Name', N)."""
    import re
    m = re.match(r'^(.*?)\s*\((\d+)\)\s*$', raw)
    if m:
        return m.group(1).strip(), int(m.group(2))
    return raw.strip(), None


def sha256_file(path: Path) -> str:
    """SHA256 hash of file contents, truncated to 16 hex chars."""
    h = hashlib.sha256(path.read_bytes()).hexdigest()
    return h[:16]


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def parse_evidence_file(file_path: Path) -> EvidenceDocument:
    """Parse a single HTML evidence file into structured intermediate form."""
    content = file_path.read_text(encoding="utf-8")
    file_hash = sha256_file(file_path)

    parser = EvidenceHTMLParser(source_file=file_path.name)
    parser.feed(content)

    # Filter module cards: only those in section s4 are the 63 backend modules
    s4_modules = [m for m in parser.module_cards if m.section_id == "s4"]
    # s4 groups are the named groupings of backend modules
    s4_groups = [g for g in parser.groups if g.section_id == "s4"]

    return EvidenceDocument(
        file_path=str(file_path),
        file_hash=file_hash,
        title=parser.title,
        sections=parser.sections,
        groups=s4_groups,
        layers=parser.layers,
        module_cards=s4_modules,
        all_module_cards=parser.module_cards,
        frontend_pages=parser.frontend_pages,
        technology_entries=parser.technology_entries,
        stats=parser.stats,
    )


def parse_evidence_directory(evidence_dir: Path) -> ParseResult:
    """Parse all HTML files in an evidence directory."""
    result = ParseResult()

    html_files = sorted(evidence_dir.glob("*.html"))
    if not html_files:
        result.status = "EVIDENCE_INSUFFICIENT"
        result.error = f"No HTML files found in {evidence_dir}"
        return result

    for html_file in html_files:
        file_hash = sha256_file(html_file)
        result.evidence_hashes[html_file.name] = file_hash

        doc = parse_evidence_file(html_file)
        result.documents.append(doc)
        result.total_components += len(doc.module_cards)
        result.total_frontend_pages += len(doc.frontend_pages)
        result.total_groups += len(doc.groups)
        result.total_sections += len(doc.sections)

    if result.total_components == 0 and result.total_frontend_pages == 0:
        result.status = "PARSE_INCOMPLETE"
        result.error = "Parser extracted zero components from all evidence files"

    return result


# ---------------------------------------------------------------------------
# CLI for standalone validation
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import argparse
    import sys

    ap = argparse.ArgumentParser(description="SDC Evidence Parser (P1)")
    ap.add_argument("--evidence-dir", required=True, type=Path,
                    help="Directory containing HTML evidence files")
    ap.add_argument("--output", type=Path, default=None,
                    help="Optional JSON output path for parse result")
    args = ap.parse_args()

    if not args.evidence_dir.is_dir():
        print(f"FAIL: evidence directory does not exist: {args.evidence_dir}",
              file=sys.stderr)
        sys.exit(1)

    result = parse_evidence_directory(args.evidence_dir)

    print(f"Status: {result.status}")
    print(f"Documents parsed: {len(result.documents)}")
    print(f"Total components (s4 modules): {result.total_components}")
    print(f"Total frontend pages: {result.total_frontend_pages}")
    print(f"Total groups: {result.total_groups}")
    print(f"Total sections: {result.total_sections}")

    for doc in result.documents:
        print(f"\n--- {doc.title} ({doc.file_hash}) ---")
        print(f"  Sections: {len(doc.sections)}")
        print(f"  Groups: {len(doc.groups)}")
        for g in doc.groups:
            print(f"    {g.name} ({g.count_declared}) → {len(g.modules)} cards")
        print(f"  Module cards: {len(doc.module_cards)}")
        print(f"  Frontend pages: {len(doc.frontend_pages)}")
        print(f"  Stats: {doc.stats}")

    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with open(args.output, "w") as f:
            json.dump(result.to_dict(), f, indent=2)
        print(f"\nParse result written to: {args.output}")

    if result.status != "OK":
        print(f"\nERROR: {result.error}", file=sys.stderr)
        sys.exit(1)

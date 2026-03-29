# External Surface Authority Model — W.1.C

Definition date: 2026-03-29
Input: W.1.A external_surface_inventory.md, W.1.B category_authority_diagnosis.md
Type: Architecture Definition — no implementation

---

## 1. Authority Ownership Model

Indexable authority is carried by the primary brand domain (krayu.be).
Runtime experience is carried by the primary brand domain (krayu.be).
The SSR mirror surface (mirror.krayu.be) is the crawl-delivery mechanism for the authority that krayu.be owns — it does not hold independent authority.
No subdomain, product domain, or external surface may accumulate or claim category authority independently of the primary brand domain.

---

## 2. Surface Role Definitions

### krayu.be

- **Role:** Primary authority domain. The canonical identity of the Krayu web presence. All category authority, brand identity, and page ownership belong to this domain.

- **Allowed functions:**
  - Holding canonical identity for all public-facing pages
  - Serving as the runtime experience layer for human users
  - Declaring the sitemap and robots.txt for the full public surface
  - Owning the canonical URL for every public page
  - Linking to mirror.krayu.be only as a technical crawl-delivery counterpart, not as a separate content authority

- **Forbidden functions:**
  - Delegating canonical authority to any subdomain or external domain
  - Exposing pages that lack governed content (drafts, placeholders, versioned artifacts)
  - Presenting a title or brand identity that diverges from the mirror's crawl-delivered equivalent
  - Existing without a crawl-deliverable counterpart for every public page it declares

---

### mirror.krayu.be

- **Role:** Crawl-delivery counterpart to krayu.be. Exists solely to make krayu.be's authority-carrying content accessible to crawlers that cannot execute JavaScript. Holds no independent authority.

- **Allowed functions:**
  - Rendering pre-built SSR/static HTML equivalents of krayu.be public pages
  - Delivering the same semantic content, titles, and structure as the krayu.be equivalents it represents
  - Being referenced by krayu.be as its crawl-delivery mechanism
  - Pointing crawlers to krayu.be as the canonical authority via canonical link declarations

- **Forbidden functions:**
  - Declaring independent authority for any page (no self-referencing canonical)
  - Holding pages that do not have an exact equivalent on krayu.be
  - Linking to krayu.be as an external source of truth (linking direction must be canonical declaration only, not editorial deference)
  - Diverging in title, structure, concept naming, or content framing from its krayu.be counterpart
  - Appearing in any index as the authority-holding surface for Krayu content

---

### Additional domains (signal-pi.com, signalpi.ai, others)

- **Role:** Reserved product or brand extension domains. Not currently active. May only be activated under a defined role that does not compete with krayu.be authority.

- **Allowed functions:**
  - Redirecting to krayu.be or to a defined krayu.be page (if activated)
  - Serving as a product-scoped surface with explicit canonical attribution to krayu.be

- **Forbidden functions:**
  - Accumulating independent indexable authority
  - Presenting content that duplicates or competes with krayu.be category content without canonical resolution
  - Serving as an entry point that does not resolve to krayu.be or to a krayu.be-attributed page

---

## 3. Page Authority Model

### Required characteristics of a valid public page

A page is valid for public exposure if and only if it satisfies all of the following:

1. **Declared purpose** — The page has a single, identifiable purpose that is distinct from all other public pages.
2. **Semantic content** — The page contains a unique semantic payload: a defined concept, argument, description, or structured information set. Presence of a title alone does not constitute semantic content.
3. **Crawl-deliverable counterpart** — A corresponding SSR-rendered version of the page exists on the mirror surface with identical title, matching structure, and equivalent content.
4. **Governed title** — The page title is a semantic description of the page's content. A title that reproduces the URL slug without transformation is not a governed title.
5. **Canonical declaration** — The page carries a canonical link declaration pointing to its krayu.be URL.
6. **Navigation reachability** — The page is reachable from at least one other public page via an internal link. Pages reachable only via the sitemap are not valid public pages.

### Forbidden page types

The following page types must not appear on any public surface:

- **Draft or versioned pages** — Pages identified by version suffix, numeric suffix, or any naming convention indicating a non-final state (e.g., `_v1`, `_v2`, `-draft`, `-old`).
- **Placeholder pages** — Pages with no semantic content, including pages whose titles or slugs indicate staging or parking functions.
- **Duplicate pages** — Pages whose content substantially replicates another public page without a defined, distinct purpose differentiating them.
- **Asset pages** — Pages that present a single non-navigable asset (a slide, a diagram, a document download) without contextual framing that constitutes a governed page.
- **Generic slug pages** — Pages whose URL slug carries no content signal (e.g., `/report`, `/slide`, `/file`) and whose titles reproduce that slug.
- **Orphan pages** — Pages that exist in the sitemap but are not reachable via internal navigation from any other public page.

---

## 4. Canonical Structure Rules

### URL structure principles

1. The URL path is the permanent, canonical identifier for a page. Once a public page is declared, its URL does not change.
2. Every public URL is a direct child of the root domain. Nested paths are permitted only where the hierarchy is semantically governed (e.g., a topic page that is a formal subsection of a parent page).
3. URL paths must be derivable from page purpose without ambiguity. A URL path and its corresponding page title must be semantically consistent with each other.

### Naming conventions

1. URL paths use lowercase letters and hyphens as word separators. No CamelCase, no underscores, no spaces, no version suffixes in public URLs.
2. Page titles are expressed in natural language. A page title is not the URL slug with capitalization applied.
3. Concept names used in URLs must be identical to the governed concept name used in the page content. A page about "Program Intelligence" carries a URL containing `program-intelligence`, not `ProgramIntelligence`, `pi`, or any abbreviation.
4. Version identifiers do not appear in public URLs. Versioned content is governed internally before promotion to a public URL.

### Hierarchy rules

1. The public URL space is hierarchically governed. Top-level paths (`/concept-name`) represent primary concepts or sections. Where a concept has formal sub-components, those sub-components occupy nested paths (`/concept-name/sub-component`).
2. A flat URL space (all pages at root depth) is permitted only for a surface with five or fewer distinct public pages. Beyond five pages, hierarchy must be declared.
3. Hierarchy is determined by semantic relationship, not by publication order. A page that is formally a sub-component of another concept occupies a child path of that concept's URL.

---

## 5. Surface Consistency Rules

### Content equivalence rules

For every public page declared on krayu.be, an SSR-rendered equivalent must exist on mirror.krayu.be. The equivalence requirement is:

- **Title:** Identical between krayu.be and its mirror counterpart.
- **Primary concept coverage:** The same governing concept, framework, and named constructs appear on both surfaces.
- **Section structure:** Mirror page section headings match krayu.be page section headings.

### Divergence rules

The following divergences are permitted:

- **Presentation format** — The mirror may use a simplified layout relative to the runtime experience on krayu.be, provided semantic content is not reduced.
- **Interactive elements** — Elements that require JavaScript execution (demos, dynamic tools) are not required to be reproduced on the mirror. Their absence must not leave the mirror page semantically incomplete.
- **Navigation chrome** — Visual navigation treatments may differ between surfaces provided the navigation links themselves are identical.

The following divergences are forbidden:

- **Title divergence** — A page on mirror.krayu.be may not carry a different title from its krayu.be counterpart.
- **Concept naming divergence** — Named constructs (discipline names, product names, framework component names) must be identical across surfaces.
- **Content framing divergence** — The mirror may not frame a concept differently from krayu.be (e.g., describing Krayu as an advisory firm on one surface and a discipline holder on another).
- **Page count divergence** — mirror.krayu.be may not expose pages that do not exist on krayu.be. krayu.be may not expose public pages that lack a mirror counterpart.

### Duplication rules

- Content duplication across pages on the same surface is forbidden. Each public page owns exactly one semantic payload.
- Cross-surface duplication (the same content appearing on both krayu.be and mirror.krayu.be) is required — this is the governed delivery mechanism, not a duplication violation.
- Content from one public page may be summarized or referenced on another page, provided the summary is clearly bounded and links to the authoritative page.

### SPA vs mirror relationship

The SPA (krayu.be) is the authority surface. The mirror (mirror.krayu.be) is the crawl-delivery mechanism.
This relationship is governed by the following rules:

1. The mirror does not exist as an independent entity. It exists as the crawl-deliverable projection of krayu.be.
2. Every change to a public page on krayu.be requires a corresponding update to its mirror counterpart before that page is considered governed.
3. The mirror carries no pages that krayu.be does not carry as public pages. The mirror's page inventory is a strict subset of krayu.be's public page inventory — and for all pages it carries, the content must be equivalent.
4. The mirror declares krayu.be as canonical for every page via canonical link markup. The mirror never self-canonicalizes.
5. The SPA does not link to the mirror editorially. The relationship between SPA and mirror is a technical deployment declaration, not a content hierarchy.

---

## 6. Sitemap Authority Rules

### What is allowed in the sitemap

A URL may appear in the public sitemap if and only if:

- It satisfies all requirements of a valid public page (§3)
- It has a crawl-deliverable counterpart on the mirror surface
- It is reachable via internal navigation from at least one other page
- Its title and content are in final, governed state

### What must never appear in the sitemap

The following must not appear in any public sitemap:

- Pages with version suffixes (`_v1`, `-v2`, `-draft`, or equivalent)
- Pages with placeholder or staging names (`parking`, `temp`, `test`, `wip`, or equivalent)
- Pages whose content is not in final governed state
- Pages that are not reachable via internal navigation
- Pages that serve as technical artifacts rather than semantic content units (redirect pages, error pages, asset-only pages)
- Duplicate pages (where a URL and its counterpart carry substantially identical content)
- Pages that have no crawl-deliverable mirror counterpart

### How the sitemap reflects authority

The sitemap is the complete and exact declaration of the public authority surface. Its inclusion of a URL is an assertion that the URL carries governed content, is indexable, and represents Krayu's public category presence. No URL appears in the sitemap as a side effect of technical routing or internal tooling. The sitemap is curated, not auto-generated from page routes.

A URL that does not appear in the sitemap is not a public page, regardless of whether it returns HTTP 200. A URL that appears in the sitemap is asserted to be a governed public page. These two conditions are mutually exclusive and exhaustive.

---

## 7. Linking Authority Rules

### Internal linking expectations

1. Every public page is reachable from at least one other public page via an explicit internal link.
2. Navigation links (present on all pages) constitute internal links for the purpose of reachability.
3. Internal links within body content are permitted only to other governed public pages. Links to draft, staging, or non-public pages are forbidden within body content.
4. Internal links use the krayu.be canonical URL as the link target, regardless of which surface the link appears on.

### Cross-domain linking rules

1. **mirror.krayu.be → krayu.be:** The only cross-domain links permitted from mirror.krayu.be to krayu.be are canonical link declarations in page metadata. Editorial body content on mirror.krayu.be does not contain outgoing links to krayu.be. The mirror is not a referrer to the SPA; it is a delivery mechanism for SPA content.

2. **krayu.be → mirror.krayu.be:** krayu.be does not link to mirror.krayu.be in any form visible to users or crawlers. The mirror is not a navigable destination from the primary surface.

3. **Additional domains → krayu.be:** Any active additional domain (signal-pi.com, signalpi.ai, or others) that links to krayu.be does so only via a redirect or via a canonical declaration. It does not contain editorial links that position krayu.be as an external source.

4. **External links:** External links from governed pages are permitted where they point to primary sources cited by the page content. External links do not point to other surfaces within the Krayu domain cluster as though they were external authorities.

### Canonical direction of links

The canonical direction is: mirror.krayu.be pages declare krayu.be as canonical. All other surfaces declare krayu.be as canonical. krayu.be does not declare any other surface as canonical. This direction is absolute and non-negotiable.

---

## 8. Semantic Integrity Constraint (CKR Alignment)

### Consistent terminology requirement

A named concept that appears on more than one public page must be named identically on every page where it appears. Variation in spelling, capitalization, abbreviation, or phrasing of a named concept across pages is a violation of this constraint.

This applies to:
- Discipline names (e.g., "Program Intelligence")
- Product and platform names (e.g., "Signäl")
- Framework component names (e.g., "Execution Stability Index," "Risk Acceleration Gradient")
- Organizational identity descriptors (how Krayu is described in relation to the discipline)

### Prohibition on semantic drift

A concept introduced on one page with a specific definition may not be used on another page with a different definition or framing. The definition carried by the authoritative page for that concept governs all references to it across the surface.

If a page references a concept whose governing definition is on another page, the reference must be consistent with that governing definition. A page may not independently reframe a concept that another page defines.

### Relationship between concept naming and page content

Each named concept that warrants a dedicated public page is governed by exactly one page on the public surface. That page is the definitional authority for the concept. All other pages that reference the concept are governed by the definition on the authoritative page, not by their own independent framing.

A concept that appears across multiple pages but has no single governing page is a governance gap. The concept must either be given a governing page or its usage must be bounded to a single page.

---

## 9. Authority Flow Model

### Entry points

There are two defined entry points into the Krayu public surface:

1. **Direct domain entry** — A user or crawler arriving at `krayu.be` or `krayu.be/<path>`.
2. **Crawl-delivered entry** — A crawler arriving at `mirror.krayu.be` or `mirror.krayu.be/<path>` as a result of indexing the mirror's crawlable content.

No other surface constitutes a governed entry point. Traffic arriving at non-governed surfaces (inactive domains, undeclared paths) is not part of the authority flow.

### Traversal expectations

**Human user traversal (krayu.be):**
A user arrives at the root (`krayu.be/`). The root page provides navigation to all primary concept pages. From each primary concept page, the user can navigate to related pages via internal links. Every public page is reachable within three steps from the root.

**Crawler traversal (mirror.krayu.be):**
A crawler arrives at `mirror.krayu.be/`. The root page provides full navigation links to all mirror pages. From each page, the crawler encounters the same navigation set, providing full coverage of the mirror's page inventory in one hop from the root. Each page carries a canonical declaration pointing to its krayu.be counterpart. The crawler assigns authority to krayu.be URLs based on the canonical declarations.

### Where authority accumulates

Authority accumulates at krayu.be URLs. The canonical declarations on mirror.krayu.be direct crawlers to treat krayu.be as the authoritative location for the content they read on the mirror. The crawl weight generated by the mirror's readable content accrues to krayu.be's URL identity.

The root (`krayu.be/`) receives authority from all public pages through internal linking. Each primary concept page receives authority from the root and from pages that link to it. Concept pages at lower hierarchy levels receive authority from their parent pages.

The flow is:

```
mirror.krayu.be/<page>  →  [canonical declaration]  →  krayu.be/<page>
                                                              ↑
                         krayu.be/                  →  krayu.be/<concept>
                         (root, navigates to all)
```

Authority does not accumulate at mirror.krayu.be. Authority does not split across surfaces. The accumulation point is singular: krayu.be.

---

## 10. Non-Negotiable Constraints

The following constraints are absolute. No implementation, operational decision, or deployment configuration may violate them.

**C-01 — Single authority domain**
krayu.be is the sole authority domain. No other domain or subdomain may accumulate independent indexable authority for Krayu category content.
*Testable: A crawler querying for primary Krayu concepts must attribute the content to krayu.be URLs, not to mirror or other subdomains.*

**C-02 — No non-governed pages on public surfaces**
A page is either governed (satisfies §3 requirements) or it is not on a public surface. There is no intermediate state. A page on a public surface that does not satisfy §3 is a violation.
*Testable: Every URL in the public sitemap satisfies all §3 requirements. No URL in the sitemap is a draft, versioned, placeholder, or asset-only page.*

**C-03 — No competing canonical signals**
No page on any surface within the Krayu domain cluster may carry a canonical declaration that conflicts with another page's canonical declaration. The canonical graph has exactly one head per content entity: the krayu.be URL.
*Testable: For any content entity, there is exactly one canonical URL, and it is a krayu.be URL.*

**C-04 — Mirror pages do not hold independent canonical identity**
mirror.krayu.be pages do not self-canonicalize. Each mirror page carries exactly one canonical declaration pointing to its krayu.be counterpart. A mirror page without a canonical declaration pointing to krayu.be is a violation.
*Testable: Every mirror page's canonical link element points to a krayu.be URL, not to itself or to any other URL.*

**C-05 — Page inventory parity between SPA and mirror**
The set of public pages on mirror.krayu.be is exactly equal to the set of public pages on krayu.be. No page exists on the mirror that lacks a krayu.be counterpart. No public page exists on krayu.be that lacks a mirror counterpart.
*Testable: The union of krayu.be public URLs and mirror.krayu.be URLs produces no asymmetric entries when cross-referenced.*

**C-06 — Sitemap contains no noise**
The krayu.be sitemap contains only URLs that satisfy §3 requirements. The presence of a URL in the sitemap is sufficient basis for asserting it as a governed public page. Any URL that cannot be so asserted must not appear in the sitemap.
*Testable: Every URL in the sitemap passes the §3 validity check. No URL with a version suffix, placeholder name, or absent mirror counterpart appears.*

**C-07 — Titles are governed on both surfaces simultaneously**
A page title on krayu.be and its counterpart on mirror.krayu.be are identical. A title change on one surface requires a corresponding change on the other before either is considered governed.
*Testable: For every public page, `title(krayu.be/<page>) == title(mirror.krayu.be/<page>)`.*

**C-08 — Concept naming is invariant across the public surface**
A named concept is spelled, capitalized, and framed identically on every public page where it appears. Observed variation in a concept name across pages is a governance violation.
*Testable: A search for any named concept across all public pages returns a single canonical form with no variation.*

**C-09 — No editorial cross-domain links from mirror to SPA**
mirror.krayu.be body content does not contain editorial outgoing links to krayu.be. Canonical link declarations are permitted; editorial links are not.
*Testable: No `<a href="https://krayu.be/...">` element appears in the body content of any mirror page.*

**C-10 — Inactive domains do not serve content**
Domains within the Krayu domain cluster that are not assigned a governed role under this model do not serve content. They redirect to krayu.be or return no response. An inactive domain serving independent content is a violation.
*Testable: Any domain in the Krayu cluster that is not krayu.be or its governed mirror either returns an HTTP redirect to krayu.be or returns DNS NXDOMAIN / connection refused.*

---

*Model produced: 2026-03-29 | Stream: W.1.C | Input: W.1.A, W.1.B | Type: Architecture Definition — no implementation*

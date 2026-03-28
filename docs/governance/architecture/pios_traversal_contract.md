# PiOS — Traversal Contract

Program: Krayu — Program Intelligence Discipline
Stream: D.1 — Traversal Contract (Graph → Experience)
Authority: [[canonical/canonical-layer-model]], [[program_intelligence_stack]], [[pios_whitepaper]]
Date: 2026-03-28

---

## Navigation (Obsidian)

→ [[pios_whitepaper]]
→ [[program_intelligence_stack]]
→ [[pios_technical_appendix]]
→ [[index]]

---

## 1. Purpose

Traversal is the governed movement of a reader or system through architecture truth. It is not a UI animation. It is not a presentation technique. It is not a choreographic device. A traversal is valid only when it moves through nodes that hold governed authority in the correct direction and preserves, at every step, the boundary discipline and evidence lineage that makes the architecture trustworthy.

This document defines the contract that governs traversal over the PiOS knowledge graph materialized in Stream C.3. It is downstream of [[canonical/canonical-layer-model]], which defines what the nodes are. It is downstream of [[program_intelligence_stack]], which defines how the nodes relate. It is downstream of the reading paths defined in [[pios_whitepaper]], which define how a human reader should engage with the corpus. This document adds one further layer: it defines how governed traversal moves through that corpus, what may change between personas, what ENL's role is in that movement, what runtime may and may not do with the traversal contract, and what happens when traversal encounters drift or remediation.

Traversal must preserve four properties regardless of the path taken. Authority must be preserved — every claim encountered during traversal must remain attributable to its canonical source without reinterpretation. Sequence integrity must be preserved — the direction of traversal must respect the constraint direction of the stack, which runs from discipline to architecture to product, never the reverse. Boundary discipline must be preserved — traversal may not cross a layer boundary it is not permitted to cross and may not represent a lower layer as having authority it does not hold. Non-invention must be preserved — traversal may not produce meaning that does not exist in the nodes it crosses. If a node is absent, traversal surfaces the absence. It does not fill it.

---

## 2. Traversal Objects

A traversal object is a document node in the governed corpus that holds a defined architectural position and a defined relationship to adjacent nodes. Traversal moves across these objects, not through arbitrary content. The following classes of traversal object are defined.

Canonical nodes are the highest-authority objects in the graph. They include [[canonical/canonical-layer-model]] and its companion artifacts — the validation record, the classification document, and the drift record. These nodes define the layer model, classify constructs against it, and record known deviations. Traversal begins at canonical nodes when the question being answered is architectural.

Stack nodes articulate the hierarchy of constraint. [[program_intelligence_stack]] is the primary stack node. It defines the relationship between the discipline, the operating system, the product surface, and the module layer. Stack nodes are the appropriate entry point when the question being answered is structural — how the layers relate to one another and in what direction authority flows.

Drift nodes record deviations from canonical architecture. [[drift_register]] is the primary drift node. Drift nodes are not primary traversal paths; they are entered when a traversal needs to explain why a particular boundary rule exists or why a particular construct is provisional. Traversal that begins at a drift node and moves toward canonical architecture is traversal in the wrong direction.

Remediation nodes record how deviations are corrected. The remediation corpus in `docs/governance/remediation/` constitutes the remediation node set. Remediation nodes are entered even less frequently than drift nodes — only when a traversal specifically needs to document or explain the correction chain for a known violation. Remediation nodes are enforcement artifacts, not architectural authorities. They apply the canonical model; they do not define it.

Appendix and evidence nodes hold technical depth and reconstruction history. [[pios_technical_appendix]] is the primary appendix node. Evidence nodes in `docs/pios/architecture_reconstruction/` hold the reconstruction record from which the current canonical model was restored. These nodes are reference destinations, not primary traversal paths.

Traversal objects are document nodes and governed relationships between them. A traversal object does not compute truth. It does not derive signals. It does not shape meaning. Movement through a traversal object changes the reader's position in the architecture; it does not change what the architecture says.

---

## 3. Traversal Sequence

The valid direction of traversal is from discipline toward architecture, from architecture toward structure, from structure toward supporting technical depth, and from the main path toward drift and remediation only when deviation explanation is required. This direction is not a stylistic preference — it follows the constraint direction of the stack defined in [[program_intelligence_stack]] §6, where constraints originate at the discipline and propagate downward through the system.

Four traversal paths are defined.

The primary path is the sequence a reader follows when encountering the corpus for the first time without a specific technical question. It begins at the discipline — the evidence-first doctrine held by Krayu — proceeds to the system architecture through the canonical layer model, proceeds to the structural hierarchy through the stack articulation, and arrives at the technical appendix as the complete formal reference. The primary path corresponds to Path C defined in [[pios_whitepaper]] §2, which moves through the investor narrative to the stack articulation to the technical appendix. Every traversal begins on the primary path. Departure from it is permitted only when a specific structural or deviation question requires a different entry point.

The technical deepening path is the sequence a reader follows when beginning from an architectural question rather than a discipline question. It enters at [[program_intelligence_stack]], proceeds to [[pios_technical_appendix]], and from there to the canonical governance artifacts in `docs/governance/architecture/canonical/`. This path assumes familiarity with the discipline. It is the path an architect or engineer follows when the question is where derivation belongs, what a specific layer may not do, or how a particular construct is classified. It does not bypass canonical authority — it begins closer to it.

The drift explanation path is entered when traversal encounters a boundary rule whose origin is not self-evident. This path begins at the node where the boundary rule appears — typically [[program_intelligence_stack]] §5 or [[pios_technical_appendix]] §7 — and descends to [[drift_register]] to establish why the rule exists through the documented failure that made it necessary. DRIFT-001 is the primary anchor example: the SSZ/SSI boundary collapse at L6 is the concrete case from which the rules against runtime derivation and surface-level semantic authority were hardened. The drift explanation path ends when the boundary rule has been grounded in its origin. It does not continue into the remediation corpus unless the correction chain itself is the subject of the traversal.

The product bridge path is the sequence a reader follows when the question concerns the relationship between PiOS and Signäl or between Signäl and its Lens modules. This path begins at [[pios_whitepaper]] §5, proceeds to [[program_intelligence_stack]] §3 and §4, and arrives at the boundary enforcement rules in §5. It answers the question of what the surface layer may do, what it may not do, and what governs the boundary between the intelligence system and the intelligence surface. The product bridge path does not enter the canonical layer model at depth — it references it as the authority source for the placement rules that govern Signäl and Lens, without requiring the reader to hold the full layer model detail.

Not all paths are equal. The primary path is authoritative and complete. The technical deepening path is precise and architecturally rigorous. The drift explanation path is explanatory and subordinate to the primary path. The product bridge path is structural and practical. A traversal that follows the drift explanation path to the exclusion of the primary path will understand a failure case without understanding the architecture it violated. A traversal that follows the product bridge path without grounding in the primary path will understand the surface constraints without understanding the discipline that necessitates them.

---

## 4. Persona as Depth Control

Persona is a traversal-depth modifier. It is not a truth modifier. It is not an authority filter. It is not a semantic switch that changes what the architecture says or what the governance record contains.

A persona determines how far a traversal descends into the governed graph and which nodes are the appropriate terminus for that reader's purpose. An executive persona follows the primary path as far as [[program_intelligence_stack]] and terminates there, having received the discipline framing, the system overview, and the product boundary. An investor persona enters through the investor narrative and follows the product bridge path as far as the read-only contract and the structural advantage it confers, without requiring the full layer model detail. An architect or engineer persona follows the technical deepening path through the canonical layer model and the technical appendix, with access to the drift explanation path as needed. An operator persona enters at the stack articulation and may proceed to the technical appendix or to specific remediation artifacts as operational questions require.

What persona does not do is more important than what it does. Persona does not change which nodes hold authority. An executive persona receives the same discipline from [[canonical/canonical-layer-model]] as an engineer persona — it simply does not require the reader to traverse the full depth of that document. Persona does not change what any node says. The investor narrative says the same thing regardless of whether it is read by an investor or an architect; the persona that traverses it does not alter its content. Persona does not filter out governance truth. A traversal that presents only the parts of the architecture that a particular audience finds convenient is not persona-adapted traversal — it is a violation of the non-invention rule, because it implies that the filtered-out portions do not exist or do not apply.

Persona affects how far a user descends into the governed graph. Persona does not alter what is true.

This principle is enforced by the traversal contract, not by runtime systems. Runtime may implement persona-sensitive path selection as a user experience mechanism, but it may only select among valid traversal paths as defined in §3. It may not invent a persona-specific path that bypasses an authority node, misrepresents a boundary rule, or presents a drift case as canonical architecture on the grounds that the audience would not benefit from knowing the distinction.

---

## 5. ENL as Traversal Mechanism

The Evidence Navigation Layer (ENL), defined at L2 in [[canonical/canonical-layer-model]] §4, is the governed navigation and retrieval structure over normalized evidence. In the traversal model, ENL is the pathing mechanism that allows movement through the architecture graph without semantic mutation. It enables traversal to locate, connect, and present governed content without producing new meaning in the act of moving through it.

ENL's canonical definition is precise: it provides evidence-addressable navigation and retrieval structure across normalized evidence. Its allowed outputs are evidence navigation structures, evidence paths, retrieval references, contextual evidence adjacency, and governed evidence selection surfaces. These outputs are relevant to traversal because traversal is itself a navigation problem — the question of how to move from one governed node to another without losing authority or introducing interpretation in the transition.

ENL is not a semantic authority. It does not interpret what nodes mean. It does not rank their significance. It does not produce executive insight about the architecture it is navigating. A traversal that uses ENL to locate the canonical layer model and then presents that model is ENL performing its correct function. A traversal that uses ENL to produce a ranking of which architecture documents are most important is ENL performing a function that belongs to L4. The distinction is structural, not stylistic.

ENL is not a UI convenience layer. The fact that ENL enables navigation does not make it a presentation component. It operates at L2, upstream of derivation, semantic shaping, and presentation assembly. The outputs of ENL are consumed by L3 for derivation purposes and, in the traversal model, by the traversal contract as path references. ENL does not produce the experience of traversal — it provides the governed pathing structure over which experience can be built.

ENL is not a derivation engine. It does not compute signals. It does not transform evidence into intelligence. Movement through ENL does not produce analytical claims; it produces navigation artifacts that other layers transform into claims through governed processes. In the traversal context, this means that ENL can tell you where a governance node is and what its adjacent nodes are, but it cannot tell you what those nodes imply about the architecture. Implication is the province of L3 and L4, not L2.

ENL is not a storytelling engine. The selection and ordering of paths through ENL is not a narrative act. When traversal moves from [[pios_whitepaper]] to [[program_intelligence_stack]] to [[pios_technical_appendix]], it is following a governed sequence — not constructing a story. The difference is that a governed sequence preserves authority and boundary integrity regardless of the effect it produces on the reader, while a story is constructed to produce an effect and may distort the evidence in service of that effect.

---

## 6. Runtime Consumption Rules

Signäl and its Lens modules may consume the traversal contract as a governing input for the paths they expose to users. This consumption is permitted and expected. What is not permitted is for the runtime to treat the traversal contract as a starting point for invention — as a loose template from which path logic may be inferred, extended, or supplemented wherever the contract does not specify exact behavior.

The following rules govern runtime consumption of the traversal contract.

Runtime may follow the traversal contract. Signäl may expose the reading paths defined in [[pios_whitepaper]] §2 and the traversal sequences defined in §3 of this document as navigation options for users. ExecLens may render the traversal structure as an interactive path — presenting canonical nodes, stack nodes, and appendix nodes in the governed sequence. This is the correct use of the traversal contract by the runtime layer.

Runtime may expose path options. Where the traversal contract defines multiple valid paths — the primary path, the technical deepening path, the drift explanation path, the product bridge path — runtime may present those options to a user. Presenting options is not the same as authoring them. The options exist in the contract; runtime surfaces them. Runtime does not define which options exist.

Runtime may not invent path logic outside governance. If a presentation context would benefit from a path that does not exist in the traversal contract, the correct response is to add that path to the traversal contract through the governed architectural stream. The correct response is not to implement the path at the runtime layer and treat it as a local experience decision. This is the traversal equivalent of the derivation ownership rule: just as signal derivation belongs at L3 and not at L6, traversal path authority belongs in the traversal contract and not in the runtime implementation.

Runtime may not skip authority nodes for convenience. A persona-sensitive implementation of the traversal contract may choose to surface only a subset of nodes appropriate to the user's role. But it may not skip an authority node — presenting a later node in the sequence as though it were the canonical entry point — because doing so misrepresents the architecture. If a user is shown [[pios_technical_appendix]] without the prior framing of [[program_intelligence_stack]], they are receiving the technical apparatus without the structural context that makes it coherent. Runtime may abbreviate traversal depth; it may not alter traversal order.

Runtime may not replace missing upstream nodes with presentation logic. Where a traversal path requires a node that has not been produced — a derivation that has not been specified at L3, a semantic shaping that has not been formalized at L4, an architectural document that has not been written — the runtime surfaces the absence. It does not substitute a plausible approximation. It does not fill the gap with inferred meaning. It does not narrate around the missing content as though the gap does not exist. The absence is the governed output where the governed content does not exist.

Runtime is allowed to render traversal. Runtime is not allowed to author traversal truth.

---

## 7. Drift and Exception Handling

Drift is not a primary traversal path. It is an exception-handling path entered when a traversal needs to explain the origin of a boundary rule, the reason a construct is provisional, or the circumstance under which a specific architectural decision was made. The primary traversal paths defined in §3 do not pass through drift nodes as a matter of course. Drift is entered when needed; it is exited as soon as the explanation it provides has been given.

DRIFT-001, documented in [[drift_register]], is the canonical anchor example for drift traversal. SSZ (Structural Stress Zone) and SSI (Structural Stress Index) were implemented at L6 — the Runtime Experience Layer — performing derivation computation that belongs at L3 — the Derivation Layer. The violation constitutes a layer boundary collapse: the runtime layer absorbed the ownership of the derivation layer without governing authority to do so. When a traversal encounters the rule that runtime may not perform derivation, it may enter the drift explanation path and arrive at DRIFT-001 to understand why that rule exists as a hard constraint rather than a guideline. Once that explanation has been given, the traversal returns to the primary path or the technical deepening path. It does not continue into the remediation corpus unless the correction chain itself is the subject.

Remediation nodes are entered even more infrequently than drift nodes. The remediation corpus records how known violations are being corrected — the derivation ownership restoration at Stream 40.12, the boundary audit at Stream 40.13, the disposition and planning at Streams 40.14 and 40.15, the domain execution at Streams 40.16 and 40.17. These records are relevant to traversal when the question is operational: what is being done to correct the deviation and in what sequence. They are not relevant to traversal when the question is architectural, because remediation artifacts apply the canonical model but do not define it. A reader who arrives at a remediation artifact and concludes that it defines the architecture it corrects has traversed in the wrong direction.

Drift and remediation must never become the architecture path itself. A traversal that moves from drift to canonical is moving in the wrong direction — toward authority, but starting from deviation, which means the framing of the authority is shaped by the failure rather than the principle. The correct traversal begins at the principle and reaches the failure as an explanatory case. DRIFT-001 is not what the architecture is; it is evidence of what happens when the architecture is violated and why the rules that prevent that violation are non-negotiable.

---

## 8. Reading Paths vs. Traversal Paths

Reading paths and traversal paths are distinct constructs that serve different purposes and are defined in different documents.

Reading paths, defined in [[pios_whitepaper]] §2 (Stream C.2), are sequences of documents organized for human readers. They answer the question: given my purpose, which documents should I read and in what order? Reading paths are organized by persona — executive, architect, full system — and they specify document entry points, document order, and the purpose served by each document in the sequence. Reading paths are navigational guidance for human engagement with the corpus.

Traversal paths, defined in this document (Stream D.1), are governed route logic for moving through the architecture graph. They answer a different question: given the graph of nodes and their governed relationships, what constitutes a valid movement from one node to another, what constraints govern that movement, and what may a consuming system do with that movement? Traversal paths are not addressed to human readers; they are addressed to any system — including Signäl and its Lens modules — that needs to navigate the graph in a governed way.

The relationship between these two constructs is hierarchical. Reading paths are an application of traversal paths for a specific consumer class. A reading path for the executive persona is a valid traversal — it follows the primary path, terminates at the stack articulation, and respects the direction of constraint. But traversal paths are more general. They define what is valid for any traversal, not just for human readers. A system that navigates the architecture graph to produce a governance report is following a traversal path, not a reading path. A system that surfaces canonical audit lineage is traversing governance nodes according to the rules of this contract.

Stream C.3 (Obsidian Materialization) created the graph — the nodes and their Obsidian link edges. Stream D.1 (this document) defines how that graph may be traversed in experience. These are distinct operations. The graph is a structure; the traversal contract is the governance of how that structure may be moved through. A graph without a traversal contract is a set of linked documents. A graph with a traversal contract is a governed architecture corpus with defined authority, sequence, persona, and consumption rules.

---

## 9. Control Rules

These rules govern the traversal contract without exception. They are not commentary on best practices. They are the structural conditions under which traversal remains governed.

Traversal cannot bypass canonical authority. Any traversal that reaches a conclusion about the architecture without passing through the canonical layer model, either directly or by citing a document that itself derives from it, has produced an ungoverned claim. The canonical layer model is the root authority for all layer definitions, placement rules, and enforcement invariants. Traversal that avoids it does not escape it; it simply produces claims that cannot be grounded in it.

Traversal cannot start at remediation and claim architecture. A traversal that begins at a remediation corpus artifact — a boundary audit finding, a disposition record, a remediation execution stream — and presents the conclusions of that artifact as canonical architecture has inverted the authority direction. Remediation artifacts apply the canonical model. They do not define it. A traversal that reads DRIFT-001 and concludes that the boundary rule against L6 derivation originates from DRIFT-001 has confused the evidence of a violation with the rule that was violated.

Traversal cannot let product surfaces redefine entry order. The reading paths in [[pios_whitepaper]] define the correct entry sequence for each persona. Signäl and ExecLens may surface those paths as navigational options. They may not reorder the paths to privilege product-convenient entry points. A traversal that presents [[pios_technical_appendix]] as the entry point for an executive persona because the appendix contains a compelling visual of the layer model is not persona adaptation — it is product convenience overriding governed sequence.

Traversal cannot hide drift when drift is the reason for a boundary rule. When a traversal explains why derivation cannot happen at L6, it must be prepared to acknowledge that a concrete instance of that violation occurred and was governed. DRIFT-001 is not confidential. It is the enforcement record that makes the boundary rule legible. A traversal that states the rule without acknowledging the drift case that hardens it is incomplete. A traversal that hides the drift case because it reflects poorly on the system is a traversal that has allowed presentation preference to override architectural honesty — which is itself the category of failure the discipline exists to prevent.

Traversal cannot replace absent evidence with narrative continuity. If a traversal arrives at a node that does not yet exist — a derivation specification that has not been written, a semantic shaping rule that has not been formalized, a governance document that is planned but not produced — the traversal surfaces the gap. It does not proceed as though the gap has been filled. It does not narrate around the absence using adjacent content. The absence is the accurate representation of the system's state. Narrative continuity purchased at the cost of accuracy is the definition of ungoverned output.

---

## 10. Final Model

The traversal contract defined here establishes the governed framework within which the PiOS architecture corpus may be navigated without losing authority, without inverting constraint direction, and without producing meaning that does not exist in the governed nodes.

Krayu defines the discipline. The Program Intelligence discipline holds the constitutive rules — evidence-first, separation of concerns, determinism, non-invention — that make the architecture trustworthy. These rules are not traversal artifacts; they are the conditions that traversal must preserve.

PiOS defines the architecture. The canonical layer model defines the nodes: L0 through L8, each with bounded responsibility, defined inputs, defined outputs, and explicit forbidden behaviors. These nodes are what traversal moves through. The traversal contract does not add to them, redefine them, or supersede them.

Traversal defines how a user may move through that architecture. The four traversal paths — primary, technical deepening, drift explanation, and product bridge — provide governed routes across the node graph. Persona determines traversal depth without altering traversal truth. ENL provides the pathing mechanism without acquiring semantic authority. Drift and remediation nodes are entered when deviation explanation is required and exited when that explanation is complete.

Signäl and ExecLens may expose traversal, but never govern traversal truth. The runtime is permitted to render the traversal contract as a navigational experience. It is not permitted to author path logic outside the contract, skip authority nodes for presentation convenience, replace missing nodes with invented content, or adapt persona depth by filtering out governance truth rather than adjusting traversal depth.

The graph exists. The contract governs how it may be traversed. Anything beyond that is the domain of the presentation layer, operating under the same read-only constraint that governs every Signäl surface.

---

*Authority: [[canonical/canonical-layer-model]] (Stream 00.2) | [[program_intelligence_stack]] | [[pios_whitepaper]] | [[drift_register]]*

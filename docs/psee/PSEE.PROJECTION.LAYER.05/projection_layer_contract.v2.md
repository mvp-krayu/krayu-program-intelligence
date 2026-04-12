⏺ PROJECTION LAYER V2 — FORMAL CONTRACT DEFINITION

  Contract ID: PSEE.PROJECTION.LAYER.CONTRACT.V2                                                                                                              
  Derivation basis: PSEE.PROJECTION.LAYER.04 structural scope
  Admissibility basis: PSEE.PROJECTION.LAYER.03 register                                                                                                      
  Blocker governance: B-01, B-02, B-03, B-04 (accepted, final)                                                                                                
  Relation to v1: Strictly additive — Projection Layer v1.1 remains complete, valid, and unchanged                                                            
                                                                                                                                                              
  ---                                                                                                                                                         
  CONTRACT ELEMENT: PL4-C1 — Type-Based Node Grouping                                                                                                         
                                                                                                                                                              
  1. CONTRACT ELEMENT
                                                                                                                                                              
  A deterministic partitioning operation that distributes the members of any v1 node-bearing collection into disjoint subsets, one per governed node type     
  value.
                                                                                                                                                              
  2. STRUCTURAL DEFINITION                                  

  Given a v1 node-bearing collection and the governed canonical type set (B-01: binding_context, capability_surface, component_entity), this element produces 
  a mapping from each governed type value to the ordered list of node identifiers in that collection whose node.type field equals that value.
                                                                                                                                                              
  The mapping:                                              
  - covers all three governed type values as keys regardless of whether any nodes of that type exist in the input (empty list is a valid output for a governed
   key)                                                                                                                                                       
  - contains no key for any type value outside the canonical set
  - preserves the input ordering of node_ids within each group                                                                                                
                                                              
  This element is a structural partition. It assigns no meaning to any group.                                                                                 
                                                                                                                                                              
  3. INPUT DEPENDENCY                                                                                                                                         
                                                                                                                                                              
  - nodes[] — v1 annotated node list (primary)                                                                                                                
  - orphans[] — v1 sorted orphan list (first application, per B-01 return condition)
  - node.type — v1 per-node annotation, passthrough from source                                                                                               
  - B-01 canonical type set — closed vocabulary: {binding_context, capability_surface, component_entity}                                                      
                                                                                                                                                              
  4. OUTPUT FORM                                                                                                                                              
                                                                                                                                                              
  A map structure keyed by governed type values, where each key maps to an ordered list of node_ids drawn from the input collection. The output is a          
  structural partition — the union of all value lists equals the input collection; the value lists are pairwise disjoint.
                                                                                                                                                              
  5. CONSTRAINTS                                            

  - Input collection must be a v1 governed node-bearing collection; no new collections may be introduced as input                                             
  - Keys in the output map must be exactly the three governed type values — no more, no fewer
  - Nodes whose node.type is absent or outside the canonical set must not appear in any output group; their presence in the input collection must not cause   
  silent omission — such nodes must be separately identified as out-of-contract                                                                               
  - No label, title, or semantic descriptor may be applied to any group key or group value at the projection layer
  - No ordering across groups is defined; group key order is not semantically significant                                                                     
  - Thresholds, rankings, and orderings must not be applied within or across groups                                                                           
                                                                                                                                                              
  6. TRACEABILITY                                                                                                                                             
                                                                                                                                                              
  Every node_id in the output map is directly traceable to its originating node record in nodes[] via node_id. The type value used as the grouping key is     
  traceable to the node.type passthrough field on that node record. The canonical key set is traceable to B-01 governance.
                                                                                                                                                              
  7. FAILURE CONDITIONS                                     

  This element is invalid if:                                                                                                                                 
  - node.type is not governed (B-01 not accepted)
  - the input collection is not a v1 governed node-bearing collection                                                                                         
  - any group key is outside the canonical set                       
  - grouping logic depends on label content, display state, or any presentation-layer attribute                                                               
  - the partition is not complete and disjoint over the governed type values                   
                                                                                                                                                              
  ---                                                                                                                                                         
  CONTRACT ELEMENT: PL4-C2 — Type-Based Node Filtering                                                                                                        
                                                                                                                                                              
  1. CONTRACT ELEMENT                                       

  A deterministic subset extraction operation that selects members of any v1 node-bearing collection whose node.type field equals a single specified governed 
  type value.
                                                                                                                                                              
  2. STRUCTURAL DEFINITION                                                                                                                                    
   
  Given a v1 node-bearing collection and a single governed type value from the B-01 canonical set, this element produces the ordered list of node identifiers 
  in that collection whose node.type equals the specified value. Input ordering is preserved. The result is a proper subset (possibly empty) of the input
  collection.                                                                                                                                                 
                                                            
  This element is a structural subset extraction. It is distinct from PL4-C1: grouping (C1) produces the complete partition across all governed type values   
  simultaneously; filtering (C2) produces a single governed-type subset on demand. Both derive from the same B-01 vocabulary.
                                                                                                                                                              
  3. INPUT DEPENDENCY                                       

  - nodes[] — v1 annotated node list                                                                                                                          
  - node.type — v1 per-node annotation, passthrough from source
  - Any other v1 governed node-bearing collection as input                                                                                                    
  - B-01 canonical type set — filter predicate must be one of: binding_context, capability_surface, component_entity                                          
                                                                                                                                                              
  4. OUTPUT FORM                                                                                                                                              
                                                                                                                                                              
  An ordered list of node_ids drawn from the input collection where node.type equals the specified governed type value. Preserves input ordering. May be      
  empty.
                                                                                                                                                              
  5. CONSTRAINTS                                            

  - Filter predicate must be exactly one value from the B-01 canonical set
  - Compound predicates (multiple type values, combined with other field conditions) are not admissible under this element
  - Nodes with absent or out-of-contract node.type values must not appear in the output regardless of predicate                                               
  - Output must not be described, labeled, or named as if it carries semantic meaning about the type being filtered                                           
  - No threshold, ranking, sorting, or ordering logic may be applied to the output                                                                            
                                                                                                                                                              
  6. TRACEABILITY                                                                                                                                             
                                                                                                                                                              
  Every node_id in the output is directly traceable to its source record in nodes[] via node_id. The filter predicate value is traceable to the B-01 canonical
   set. The filtering criterion (node.type equality) is traceable to the node.type passthrough field.
                                                                                                                                                              
  7. FAILURE CONDITIONS                                     

  This element is invalid if:
  - the filter predicate is not a member of the B-01 canonical set
  - node.type is absent or ungoverned for any matched node        
  - the filter applies to non-node.type attributes        
  - the output introduces ordering, ranking, or threshold logic beyond membership equality                                                                    
  - the filter logic is non-deterministic                                                                                                                     
                                                                                                                                                              
  ---                                                                                                                                                         
  CONTRACT ELEMENT: PL4-C3 — Signal Equality Check                                                                                                            
                                                                                                                                                              
  1. CONTRACT ELEMENT
                                                                                                                                                              
  A deterministic per-node boolean annotation that records whether any signal bound to a node carries a computation_state value other than the governed       
  nominal value AVAILABLE.
                                                                                                                                                              
  2. STRUCTURAL DEFINITION                                  

  For each node in the annotated node list, evaluate: does any signal in the node's signals[] array carry a computation_state value that is not equal to      
  AVAILABLE? The result is a boolean — true if at least one such signal exists; false if all signals carry computation_state == AVAILABLE or if the node has
  no bound signals.                                                                                                                                           
                                                            
  This element produces a structural fact only. It assigns no meaning to the result value. The boolean is not labeled as health, degradation, risk, warning,  
  or any equivalent descriptor at the projection layer.
                                                                                                                                                              
  3. INPUT DEPENDENCY                                       

  - nodes[].signals[] — v1 per-node signal array (passthrough from source)                                                                                    
  - computation_state — B-02 governed signal field
  - AVAILABLE — B-02 designated nominal value for computation_state                                                                                           
                                                                                                                                                              
  4. OUTPUT FORM                                                                                                                                              
                                                                                                                                                              
  A per-node boolean annotation. One value per node in nodes[]. Value is:                                                                                     
  - false when: node has no bound signals, or all bound signals carry computation_state == AVAILABLE
  - true when: at least one bound signal carries a computation_state value that is not AVAILABLE                                                              
                                                                                                
  The boolean annotation is added to each node record alongside existing v1 annotations. It does not replace or modify any existing field.                    
                                                                                                                                                              
  5. CONSTRAINTS
                                                                                                                                                              
  - The only comparison permitted is: computation_state == AVAILABLE (equality to the governed nominal value)                                                 
  - No other computation_state values may be used as comparison targets — other values are ungoverned at the projection layer
  - No other signal field may be evaluated under this element — B-02 governs only computation_state                                                           
  - The boolean result must carry no semantic descriptor at the projection layer                                                                              
  - Orphan signals (those in orphan_signals[] with no node attachment) are excluded from this evaluation — they have no node context for annotation           
                                                                                                                                                              
  6. TRACEABILITY                                                                                                                                             
                                                                                                                                                              
  The boolean result for any node is reproducible from the signals[] array on that node and the governed nominal value AVAILABLE (B-02). No transformation of 
  signal content occurs. The computation_state values used in the comparison are passthrough values from source.
                                                                                                                                                              
  7. FAILURE CONDITIONS                                     

  This element is invalid if:
  - computation_state is not governed (B-02 not accepted)
  - AVAILABLE is not declared as the nominal value       
  - the comparison involves transformation or normalization of signal values
  - the boolean result is used to derive condition, diagnosis, priority, or health state within projection scope                                              
  - evaluation depends on signal fields other than computation_state                                                                                          
                                                                                                                                                              
  ---                                                                                                                                                         
  CONTRACT ELEMENT: PL4-C4 — Signal Partition by Nominal State                                                                                                
                                                                                                                                                              
  1. CONTRACT ELEMENT                                       
                                                                                                                                                              
  A deterministic per-node structural partition of bound signals into two disjoint sets based on equality of computation_state to the governed nominal value  
  AVAILABLE.
                                                                                                                                                              
  2. STRUCTURAL DEFINITION                                  

  For each node in the annotated node list, partition the node's signals[] array into two disjoint subsets:                                                   
   
  - Set N (nominal): signals where computation_state == AVAILABLE                                                                                             
  - Set X (non-nominal): signals where computation_state != AVAILABLE
                                                                                                                                                              
  Each set is characterized by its count and the list of signal identifiers it contains. The union of Set N and Set X equals the complete signals[] array for 
  that node. The sets are disjoint. The names "nominal" and "non-nominal" are structural labels for set membership criteria only — not semantic
  interpretations of signal state.                                                                                                                            
                                                            
  This element is distinct from PL4-C3: C3 produces a boolean (any non-nominal signal present?); C4 produces the partition itself (which signals are nominal, 
  which are not, and how many of each).
                                                                                                                                                              
  3. INPUT DEPENDENCY                                       

  - nodes[].signals[] — v1 per-node signal array                                                                                                              
  - computation_state — B-02 governed signal field
  - AVAILABLE — B-02 designated nominal value                                                                                                                 
                                                            
  4. OUTPUT FORM

  A per-node structural annotation containing:                                                                                                                
  - count of signals where computation_state == AVAILABLE
  - count of signals where computation_state != AVAILABLE                                                                                                     
  - the partition is derivable from these counts and the source signals[] array
                                                                                                                                                              
  No new signal content is introduced. The counts are derived solely from equality evaluation against the governed nominal value.                             
                                                                                                                                                              
  5. CONSTRAINTS                                                                                                                                              
                                                                                                                                                              
  - Partition criterion is strictly: computation_state == AVAILABLE vs. computation_state != AVAILABLE                                                        
  - No further subdivision of the non-nominal set is permitted — values other than AVAILABLE are opaque and ungoverned at this layer
  - No scoring, weighting, ranking, or ordering across signals is introduced                                                                                  
  - The partition result must not be described as health, degradation, error rate, or any equivalent semantic descriptor                                      
  - Signals without a computation_state field are out-of-contract and must not be silently placed in either set                                               
  - This element does not replace PL4-C3; both may coexist as independent annotations                                                                         
                                                                                                                                                              
  6. TRACEABILITY                                                                                                                                             
                                                                                                                                                              
  Counts are directly derivable from the signals[] array on each node and the governed nominal value AVAILABLE. No transformation of signal content occurs.   
  The partition is fully reproducible from source values without external context.
                                                                                                                                                              
  7. FAILURE CONDITIONS                                     

  This element is invalid if:
  - computation_state is not governed (B-02 not accepted)
  - partition logic subdivides the non-nominal set further
  - counts aggregate across nodes rather than operating per-node
  - any part of the output is used to derive condition, diagnosis, or priority within projection scope                                                        
  - signals lacking computation_state are silently assigned to either partition set                   
                                                                                                                                                              
  ---                                                                                                                                                         
  CONTRACT ELEMENT: PL4-C5 — Evidence-Linked Overlap Edge Annotation                                                                                          
                                                                                                                                                              
  1. CONTRACT ELEMENT                                       

  A deterministic structural linkage annotation on OVERLAP_STRUCTURAL edge records that associates each edge with its corresponding governed evidence record  
  via an explicitly present identifier, under the condition that the source envelope carries B-03-compliant linkage structure.
                                                                                                                                                              
  2. STRUCTURAL DEFINITION                                  

  For each record in overlap_edges[], carry a reference to the identifier of the corresponding evidence record in constraint_flags.overlap_evidence (or the   
  equivalent governed evidence collection), where that reference is present as a discrete, addressable field value in the source envelope — not derived, not
  matched by heuristic, not inferred by position.                                                                                                             
                                                            
  Alternatively: for each evidence record in the governed evidence collection, carry a reference to the identifier(s) of the OVERLAP_STRUCTURAL edge(s) it    
  governs, where those references are present as discrete, addressable field values in the source envelope.
                                                                                                                                                              
  At least one direction of linkage must be present and traversable using field value equality alone.                                                         
   
  This element is conditional: it is applicable only when the source envelope carries linkage structure that satisfies B-03 section 4.3 (direct identifier    
  reference, passthrough identity, or set membership reference). If the source envelope does not carry such structure, this element has no operand and must
  not be applied.                                                                                                                                             
                                                            
  3. INPUT DEPENDENCY                                                                                                                                         
   
  - overlap_edges[] — v1 OVERLAP_STRUCTURAL edge records                                                                                                      
  - constraint_flags{} — v1 opaque passthrough (specifically the evidence collection within)
  - B-03 linkage governance — defines allowed linkage forms and forbidden forms                                                                               
  - Source envelope — must carry B-03-compliant direct identifier linkage (conditional)                                                                       
                                                                                                                                                              
  4. OUTPUT FORM                                                                                                                                              
                                                                                                                                                              
  A linkage annotation on overlap edge records: each record carries a reference field whose value identifies its corresponding evidence record, or each       
  evidence record carries a reference field whose value identifies its corresponding edge(s). The annotation is additive — no existing edge or evidence record
   content is modified. The reference is a passthrough of a value present in the source envelope; no value is computed or inferred.                           
                                                            
  5. CONSTRAINTS

  - Applicable only when the source envelope satisfies the B-03 conditionality requirement; must not be applied to an envelope that does not carry the        
  required linkage structure
  - Linkage must use only B-03 allowed forms: direct identifier reference, passthrough identity, or set membership reference                                  
  - Forbidden forms must not be used regardless of source data availability: substring matching, positional linkage, narrative-only linkage, implicit         
  correspondence                                                                                                                                              
  - The reference value must be a discrete, addressable field value from the source envelope — not a derived, computed, or normalized value                   
  - No evidence record content may be interpreted at the projection layer; the linkage is a structural pointer only                                           
  - Edge content and evidence record content remain unchanged; only the reference annotation is added                                                         
                                                                                                                                                              
  6. TRACEABILITY                                                                                                                                             
                                                                                                                                                              
  Each linkage reference is traceable to its originating field value in the source envelope — the reference is a passthrough, not a derivation. The traversal 
  from edge to evidence (or evidence to edge) is reproducible from the projection output alone using field value equality. No external context is required.
                                                                                                                                                              
  7. FAILURE CONDITIONS                                     

  This element is invalid if:
  - the source envelope does not carry B-03-compliant linkage structure (conditionality not satisfied)
  - the linkage uses any forbidden form (substring match, positional, narrative, implicit)                                                                    
  - the reference value is derived or computed rather than passed through from the source envelope
  - the annotation modifies existing edge or evidence record content                                                                                          
  - the linkage is used to interpret, explain, or derive meaning from evidence records within projection scope                                                
                                                                                                                                                              
  ---                                                                                                                                                         
  ---                                                       
  PROJECTION LAYER V2 — CONTRACT DEFINITION (MINIMAL)                                                                                                         
                                                            
  Contract ID: PSEE.PROJECTION.LAYER.CONTRACT.V2                                                                                                              
  Supersedes: Nothing — strictly additive to PSEE.PROJECTION.LAYER.CONTRACT.V1.1
                                                                                                                                                              
  ---                                                       
  Complete List of Contract Elements                                                                                                                          
                                                                                                                                                              
  ┌────────────────────────────────┬───────────┬───────────────────────────┬──────────────────────────────────────────────────────────────────────────────┐
  │            Element             │ Candidate │          Nature           │                                Conditionality                                │   
  ├────────────────────────────────┼───────────┼───────────────────────────┼──────────────────────────────────────────────────────────────────────────────┤
  │ Type-based node grouping       │ PL4-C1    │ Structural partition      │ Unconditional — requires B-01 acceptance                                     │
  ├────────────────────────────────┼───────────┼───────────────────────────┼──────────────────────────────────────────────────────────────────────────────┤
  │ Type-based node filtering      │ PL4-C2    │ Structural subset         │ Unconditional — requires B-01 acceptance                                     │   
  │                                │           │ extraction                │                                                                              │   
  ├────────────────────────────────┼───────────┼───────────────────────────┼──────────────────────────────────────────────────────────────────────────────┤   
  │ Signal equality check          │ PL4-C3    │ Per-node boolean          │ Unconditional — requires B-02 acceptance                                     │   
  │                                │           │ annotation                │                                                                              │
  ├────────────────────────────────┼───────────┼───────────────────────────┼──────────────────────────────────────────────────────────────────────────────┤   
  │ Signal partition by nominal    │ PL4-C4    │ Per-node count partition  │ Unconditional — requires B-02 acceptance                                     │
  │ state                          │           │                           │                                                                              │   
  ├────────────────────────────────┼───────────┼───────────────────────────┼──────────────────────────────────────────────────────────────────────────────┤
  │ Evidence-linked overlap        │ PL4-C5    │ Structural linkage        │ Conditional — applicable only when source envelope carries B-03-compliant    │   
  │ annotation                     │           │ annotation                │ linkage structure                                                            │
  └────────────────────────────────┴───────────┴───────────────────────────┴──────────────────────────────────────────────────────────────────────────────┘

  ---
  Interaction With Projection Layer v1.1
                                        
  - All five contract elements are strictly additive
  - No v1.1 field is modified, removed, or reinterpreted                                                                                                      
  - No v1.1 derivation rule is changed                                                                                                                        
  - Elements PL4-C1 and PL4-C2 operate on existing v1.1 collections (nodes[], orphans[]) as input; they do not alter those collections                        
  - Elements PL4-C3 and PL4-C4 operate on existing v1.1 per-node signals[] annotations; they add new per-node annotations without modifying existing ones     
  - Element PL4-C5 adds a linkage annotation to existing v1.1 overlap_edges[] records; it does not alter edge content                                         
                                                                                                                                                              
  ---                                                                                                                                                         
  Global Constraints                                                                                                                                          
                                                            
  G1 — Non-interpretation
  No contract element may assign meaning, derive condition, produce diagnosis, establish priority, or emit narrative. All elements are structural operations
  over governed field values.                                                                                                                                 
  
  G2 — Governed vocabularies only                                                                                                                             
  - Type operations (C1, C2): B-01 canonical set only — {binding_context, capability_surface, component_entity}
  - Signal operations (C3, C4): B-02 governed field (computation_state) and nominal value (AVAILABLE) only                                                    
  - Evidence linkage (C5): B-03 allowed linkage forms only                                                
                                                                                                                                                              
  G3 — Out-of-contract value handling                       
  Nodes with absent or ungoverned node.type values must not enter type-keyed outputs. Signals lacking computation_state must not enter signal partition       
  outputs. Edges in an envelope lacking B-03-compliant linkage structure must not receive a linkage annotation under C5.                                      
                                                                                                                                                              
  G4 — Traceability                                                                                                                                           
  Every output of every contract element must be directly traceable to source field values in the v1.1 governed input surface without external context,
  heuristic, or derivation beyond equality evaluation.                                                                                                        
  
  G5 — Determinism                                                                                                                                            
  Same input produces same output for all five elements. No element introduces randomness, ordering ambiguity, or context-dependent branching.
                                                                                                                                                              
  G6 — Minimality                                                                                                                                             
  No element introduces a structure, annotation, or collection beyond what is strictly required to express its structural role as defined in PL4. No element  
  is included merely because it is technically possible.                                                                                                      
                                                            
  G7 — Conditionality of PL4-C5                                                                                                                               
  Element PL4-C5 must carry its conditionality forward into all consuming contracts. Any downstream consumer that applies C5 is responsible for verifying
  source envelope compliance with B-03 before application. In the absence of compliant source structure, C5 has no output and must not be applied.            
  
  ---                                                                                                                                                         
  Excluded From This Contract                               
                                                                                                                                                              
  ┌────────────────────────────────────┬──────────────┬──────────────────────────────────────────────────────────────┐
  │                Item                │    Status    │                            Reason                            │                                        
  ├────────────────────────────────────┼──────────────┼──────────────────────────────────────────────────────────────┤
  │ PL3-C6 / capability_surfaces_index │ DEFERRED     │ B-04 return condition not met; no distinct governed use case │
  ├────────────────────────────────────┼──────────────┼──────────────────────────────────────────────────────────────┤
  │ PL3-C7 / semantic interpretation   │ INADMISSIBLE │ Crosses projection authority boundary permanently            │                                        
  └────────────────────────────────────┴──────────────┴──────────────────────────────────────────────────────────────┘    

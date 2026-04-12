  CANDIDATE ID: PL3-C1
                                                                                                                                                              
  1. CANDIDATE
  Type-based grouping by governed node vocabulary                                                                                                             
                                                            
  2. BASIS
  B-01 resolution — establishes the canonical node type set (binding_context, capability_surface, component_entity) as the complete governed vocabulary for
  this contract scope, treated as closed unless extended by future governed revision. Grouping by node.type was explicitly deferred in v1.1 Exclusion Register
   (orphan grouping by type — BLOCKED_BY_SEMANTICS) pending B-01 resolution. That condition is now met.
                                                                                                                                                              
  3. ADMISSIBILITY TEST                                     

  ┌───────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │           Test            │                                                          Result                                                           │
  ├───────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤   
  │ Structurally governed     │ YES — B-01 defines the complete canonical type set; grouping keys are bounded                                             │
  ├───────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤   
  │ Non-interpreting          │ YES — grouping is a structural partitioning operation; no meaning is assigned to groups                                   │   
  ├───────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Traceable                 │ YES — each node carries node_id and type; source traceability is direct                                                   │   
  ├───────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤   
  │ Non-redundant             │ YES — orphans_by_type{} was specifically deferred in v1.1 because this governance did not exist; the addition is distinct │
  │                           │  from orphans[]                                                                                                           │   
  ├───────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Inside Projection         │ YES — grouping is an allowed structural operation within projection scope                                                 │   
  │ authority                 │                                                                                                                           │
  └───────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  4. CLASSIFICATION
  ADMISSIBLE
                                                                                                                                                              
  5. REASON
  B-01 governance establishes the closed canonical type set, which provides the bounded key space required to specify a deterministic grouping operation. The 
  exact deferred item (orphans_by_type{}) is now evaluable and meets all admissibility tests. Grouping by type does not assign meaning — it partitions by a   
  governed field value.
                                                                                                                                                              
  6. CONSTRAINTS                                            
  - Grouping keys must be drawn exclusively from the B-01 canonical set: binding_context, capability_surface, component_entity
  - A node with an absent or out-of-contract type value must not be silently assigned to any group; its handling is ungoverned and must not enter a type-keyed
   structure                                                                                                                                                  
  - No semantic label may be assigned to any group at the projection layer; group keys are opaque identifiers within projection scope                         
  - Grouping must be applied only to fields already governed in v1.1 (e.g., orphans[] partitioned by node.type); new node collections may not be introduced
                                                                                                                                                              
  7. IMPACT ON FUTURE V2 SCOPE                                                                                                                                
  This candidate may enter a future v2 contract definition. The primary concrete addition it enables is orphans_by_type{} — a partition of the v1.1 orphans[] 
  list by governed type value. No further design detail is stated here.                                                                                       
                                                                                                                                                              
  ---                                                                                                                                                         
  CANDIDATE ID: PL3-C2                                      

  1. CANDIDATE
  Type-based filtering by governed node vocabulary

  2. BASIS
  B-01 resolution — same as PL3-C1. The bounded canonical type set makes type-value filter predicates deterministic and contract-traceable.
                                                                                                                                                              
  3. ADMISSIBILITY TEST
                                                                                                                                                              
  ┌─────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────┐
  │            Test             │                                        Result                                         │
  ├─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ Structurally governed       │ YES — filter predicates are drawn from the governed canonical set                     │
  ├─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ Non-interpreting            │ YES — filtering is structural inclusion/exclusion; no meaning is derived              │                                     
  ├─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤                                     
  │ Traceable                   │ YES — filter criteria are field value equalities against governed constants           │                                     
  ├─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤                                     
  │ Non-redundant               │ YES — v1.1 carries no type-based filtering; this is distinct from existing partitions │
  ├─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤                                     
  │ Inside Projection authority │ YES                                                                                   │
  └─────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────┘                                     
                                                            
  4. CLASSIFICATION
  ADMISSIBLE

  5. REASON                                                                                                                                                   
  B-01 establishes the bounded value set against which filter predicates can be written without embedding ungoverned assumptions. Type-based filtering does
  not interpret the meaning of any type — it includes or excludes nodes whose type field matches a governed value. The operation is deterministic and         
  structurally traceable.                                   
                                                                                                                                                              
  6. CONSTRAINTS                                            
  - Filter predicates must reference only the governed canonical type values from B-01
  - Filtering must produce subsets of already-governed node collections; it must not introduce new node collections                                           
  - The result of a type-based filter must not be described or consumed as if it carries semantic meaning — the filtered set is a structural partition only
  - Nodes with absent or out-of-contract type values must not be silently included or excluded by a governed type filter; their disposition is ungoverned     
                                                                                                                                                              
  7. IMPACT ON FUTURE V2 SCOPE                                                                                                                                
  This candidate may enter a future v2 contract definition as a general structural operation applicable wherever node.type is a relevant partition criterion. 
  No specific filter structures are designed here.                                                                                                            
                                                            
  ---                                                                                                                                                         
  CANDIDATE ID: PL3-C3                                      

  1. CANDIDATE
  Equality-based signal checks on governed signal field(s) only
                                                                                                                                                              
  2. BASIS
  B-02 resolution — governs computation_state as a named signal field and AVAILABLE as its designated nominal value. Explicitly states: "Equality check —     
  computation_state may be compared to the declared nominal value AVAILABLE without assigning meaning to either outcome." The deferred item                   
  has_degraded_signal in the v1.1 Exclusion Register (BLOCKED_BY_SEMANTICS, B-02) is now evaluable.
                                                                                                                                                              
  3. ADMISSIBILITY TEST                                     

  ┌──────────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │           Test           │                                                           Result                                                           │
  ├──────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Structurally governed    │ YES — computation_state and AVAILABLE are now governed by B-02                                                             │
  ├──────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Non-interpreting         │ YES — B-02 explicitly permits equality check without meaning assignment; the result is a boolean structural fact           │
  ├──────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤   
  │ Traceable                │ YES — the check references a governed field (computation_state) against a governed value (AVAILABLE); source is the        │
  │                          │ signals[] annotation on each node                                                                                          │   
  ├──────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Non-redundant            │ YES — v1.1 carries no per-node signal state check; has_degraded_signal was specifically deferred pending B-02              │   
  ├──────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Inside Projection        │ YES — boolean structural fact; no condition, diagnosis, or priority is derived                                             │   
  │ authority                │                                                                                                                            │
  └──────────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘   
                                                            
  4. CLASSIFICATION                                                                                                                                           
  ADMISSIBLE                                                
                                                                                                                                                              
  5. REASON                                                 
  B-02 provides the exact governance required: a named field, a named nominal value, and an explicit permission for equality comparison without meaning
  assignment. The deferred has_degraded_signal derivation is the direct application. The result is a per-node boolean — not a condition, not a health label,  
  not a priority signal. It is a structural fact derivable from governed field values.
                                                                                                                                                              
  6. CONSTRAINTS                                            
  - The only governed comparison is: computation_state == AVAILABLE or computation_state != AVAILABLE
  - The boolean result must carry no semantic label at the projection layer — it must not be named "healthy", "degraded", "error", "warning", or any          
  equivalent descriptor                                                                                                                             
  - No other signal field comparison is admissible under this candidate; B-02 governs only computation_state as a named field                                 
  - The check must be applied to governed signal objects only (those attached to nodes via signals[]; orphan signals are not excluded but carry no node
  context)                                                                                                                                                    
  - No inference of condition, cause, priority, or action from the boolean result is permitted within projection scope                                        
                                                                                                                                                              
  7. IMPACT ON FUTURE V2 SCOPE                                                                                                                                
  This candidate may enter a future v2 contract definition as a per-node boolean annotation. The specific addition it enables is a field indicating whether
  any signal bound to a node carries a computation_state value other than AVAILABLE. No field name or structural design is stated here.                       
                                                            
  ---                                                                                                                                                         
  CANDIDATE ID: PL3-C4                                      

  1. CANDIDATE
  Signal grouping/counting/filtering that remains non-interpreting

  2. BASIS
  Partially in v1.1 already (signals_by_node{}, signal_count, orphan_signals[]). The residual candidate — grouping, counting, or filtering signals using
  computation_state as a dimension — is enabled by B-02 resolution.                                                                                           
   
  3. ADMISSIBILITY TEST                                                                                                                                       
                                                            
  ┌─────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │          Test           │                                                           Result                                                            │
  ├─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Structurally governed   │ PARTIAL — operations on non-computation_state fields are already in v1.1; only computation_state-based operations are new   │
  ├─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Non-interpreting        │ YES — partitioning by field value equality does not assign meaning                                                          │   
  ├─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤   
  │ Traceable               │ YES for computation_state-based operations; source is governed                                                              │   
  ├─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤   
  │ Non-redundant           │ PARTIAL — existing operations (by node_id) are in v1.1 and require no v2 addition; operations by computation_state are new  │
  │                         │ and non-redundant with C3 (check vs. partition/count)                                                                       │   
  ├─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Inside Projection       │ YES                                                                                                                         │   
  │ authority               │                                                                                                                             │
  └─────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  4. CLASSIFICATION
  ADMISSIBLE — scoped to computation_state-based operations only
                                                                                                                                                              
  5. REASON
  Signal grouping, counting, and filtering by node attachment are already contracted in v1.1 and require no v2 addition. B-02 unlocks one new dimension:      
  computation_state. Operations that partition, count, or filter signals using computation_state == AVAILABLE as a criterion are non-interpreting, traceable, 
  and non-redundant with C3 (C3 produces a per-node boolean; C4-scope operations produce counts or partitioned collections). The existing v1.1 operations are
  unchanged.                                                                                                                                                  
                                                            
  6. CONSTRAINTS
  - Only computation_state-based operations are new v2 additions; existing operations remain as contracted in v1.1
  - Operations must use equality against AVAILABLE as the sole criterion; no other computation_state values may be used as filter/grouping keys (they are     
  ungoverned by B-02)                                                                                                                                    
  - Results must carry no semantic label; a group of signals where computation_state != AVAILABLE is a structural partition, not a "degraded" or "error"      
  collection                                                                                                                                            
  - No other signal field may be used as a grouping or filtering dimension; all fields beyond computation_state remain opaque passthrough per B-02            
                                                            
  7. IMPACT ON FUTURE V2 SCOPE                                                                                                                                
  This candidate may enter a future v2 contract definition as a narrow extension of existing signal operations, bounded to computation_state equality. No
  specific collection structures are designed here.                                                                                                           
                                                            
  ---                                                                                                                                                         
  CANDIDATE ID: PL3-C5                                      

  1. CANDIDATE
  Traceable evidence-linked derived outputs only

  2. BASIS
  B-03 resolution — defines the evidence linkage requirement: every projection output element must carry a structurally identifiable reference to its
  corresponding evidence record, or vice versa. Defines allowed linkage forms (direct identifier reference, passthrough identity, set membership reference)   
  and forbidden forms (substring matching, positional linkage, narrative-only linkage). The specific unresolved gap identified in v1.1 B-03 is the overlap
  edge ↔ constraint_flags.overlap_evidence[] disconnection.                                                                                                   
                                                            
  3. ADMISSIBILITY TEST

  ┌─────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │            Test             │                                                     Result                                                      │
  ├─────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Structurally governed       │ YES — B-03 defines the linkage requirement and allowed forms                                                    │
  ├─────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Non-interpreting            │ YES — linkage is a structural reference; it assigns no meaning to the linked elements                           │           
  ├─────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤           
  │ Traceable                   │ YES — by definition; traceability is the purpose of this candidate                                              │           
  ├─────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤           
  │ Non-redundant               │ YES — v1.1 carries only implicit derivation linkage; B-03-compliant explicit linkage is a new governed property │
  ├─────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤           
  │ Inside Projection authority │ YES — linkage is a projection-layer structural concern                                                          │
  └─────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘           
                                                            
  4. CLASSIFICATION                                                                                                                                           
  ADMISSIBLE — conditional on source data compliance
                                                                                                                                                              
  5. REASON                                                 
  B-03 governance defines the requirement, the allowed forms, and the constraint statements. The candidate is fully governed in principle. Its application is
  conditional: it is applicable only when the source data (the envelope) carries the linkage structure required by B-03 section 4.3 — a discrete, addressable 
  identifier enabling deterministic cross-reference between output elements and evidence records. Until the source data carries that structure, this candidate
   has no operand to act on within the current envelope. The governance is admissible; the application awaits source-side fulfillment.                        
                                                            
  6. CONSTRAINTS
  - Applicable only when the source data carries compliant linkage structure as defined in B-03 section 4.3
  - Linkage must use only allowed forms: direct identifier reference, passthrough identity, or set membership reference
  - Forbidden forms remain forbidden regardless of source data changes: substring matching, positional linkage, narrative-only linkage
  - Linkage must be deterministic and reproducible from projection output alone                                                                               
  - No evidence record may be interpreted at the projection layer — the reference is structural, not semantic                                                 
                                                                                                                                                              
  7. IMPACT ON FUTURE V2 SCOPE                                                                                                                                
  This candidate may enter a future v2 contract definition as a linkage annotation on OVERLAP_STRUCTURAL edge records and their corresponding evidence        
  records, once the envelope carries the required identifier structure. No specific field names or schema structures are designed here.                       
                                                            
  ---                                                                                                                                                         
  CANDIDATE ID: PL3-C6                                      

  1. CANDIDATE
  capability_surfaces_index as governed projection artifact

  2. BASIS
  B-04 resolution — classifies capability_surfaces_index as DEFERRED. States: no admissible projection use, content already reachable through nodes[] and
  containment_tree{}, return condition requires a formally defined use case not achievable through existing governed fields.                                  
   
  3. ADMISSIBILITY TEST                                                                                                                                       
                                                            
  ┌─────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │            Test             │                                                 Result                                                  │
  ├─────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Structurally governed       │ NO — no governed role defined; B-04 explicitly defers                                                   │
  ├─────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Non-interpreting            │ N/A                                                                                                     │                   
  ├─────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Traceable                   │ PARTIAL — passthrough of source data; but passthrough alone does not confer governed status per v1.1 C3 │                   
  ├─────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤                   
  │ Non-redundant               │ NO — content already present in nodes[] and containment_tree{}; no distinct governed value identified   │
  ├─────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤                   
  │ Inside Projection authority │ YES — technically within scope, but has no admissible role                                              │
  └─────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────┘                   
                                                            
  4. CLASSIFICATION                                                                                                                                           
  DEFERRED                                                  

  5. REASON
  B-04 governance establishes this artifact as DEFERRED with a stated return condition: a specific rendering use case must be formally defined that is not
  achievable through nodes[] and containment_tree{} alone. No such use case has been defined in any accepted blocker governance. The admissibility test fails 
  on non-redundancy — the data is already governed through existing fields. Admitting this artifact without a distinct use case would add noise to the
  projection output contract without adding governed value, violating the minimality rule.                                                                    
                                                            
  6. CONSTRAINTS
  This candidate remains deferred. It carries no admissible projection role. The return condition from B-04 applies without modification: admissibility
  requires a formally defined use case demonstrably not achievable through existing governed fields. No design, implementation, or rendering proposal         
  constitutes resolution.
                                                                                                                                                              
  7. IMPACT ON FUTURE V2 SCOPE                              
  This candidate may not enter a v2 contract definition until its B-04 return condition is met. It is not blocked by B-01 through B-03; it is blocked by the
  absence of a defined purpose. The deferred status carries forward unchanged.                                                                                
   
  ---                                                                                                                                                         
  CANDIDATE ID: PL3-C7                                      

  1. CANDIDATE
  Any candidate requiring semantic interpretation — general class
                                                                                                                                                              
  2. BASIS
  No accepted blocker governance unlocks interpretation. B-01 governs type vocabulary without semantic meaning. B-02 governs signal field equality without    
  value interpretation. B-03 governs evidence linkage without evidence meaning. B-04 defers capability_surfaces_index without assigning purpose. None of B-01 
  through B-04 extend projection authority into condition logic, diagnosis, prioritization, action, or narrative.
                                                                                                                                                              
  3. ADMISSIBILITY TEST                                     

  ┌─────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────┐
  │            Test             │                                         Result                                          │
  ├─────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ Structurally governed       │ NO — interpretation requires semantic authority not held by projection                  │
  ├─────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ Non-interpreting            │ NO — interpretation is the defining characteristic of this class                        │                                   
  ├─────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤                                   
  │ Traceable                   │ IRRELEVANT — fails at non-interpreting                                                  │                                   
  ├─────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤                                   
  │ Non-redundant               │ IRRELEVANT — fails at non-interpreting                                                  │
  ├─────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤                                   
  │ Inside Projection authority │ NO — interpretation crosses into condition, diagnosis, priority, or narrative authority │
  └─────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────┘                                   
   
  4. CLASSIFICATION                                                                                                                                           
  INADMISSIBLE                                              

  5. REASON
  Projection authority is structural only. No accepted blocker governance from B-01 through B-04 extends projection authority into any form of interpretation.
   Candidates in this class — assigning meaning to type values, interpreting signal states beyond equality, inferring conditions, drawing diagnostic          
  conclusions, producing prioritization outputs, or generating narrative — cross authority boundaries that projection does not hold. No amount of structural
  grounding makes an interpretive step admissible at the projection layer.                                                                                    
                                                            
  6. CONSTRAINTS
  None applicable. This class is inadmissible and must not appear in any projection contract. Any future candidate that requires semantic interpretation to
  justify its presence is inadmissible on the same basis regardless of how it is framed.                                                                      
   
  7. IMPACT ON FUTURE V2 SCOPE                                                                                                                                
  No candidate in this class may enter any future projection contract version. Interpretation belongs to upstream authorities (condition formation,
  intelligence formation, diagnosis, prioritization) and is outside projection scope permanently.                                                             
   
  ---                                                                                                                                                         
  ---                                                       
  PROJECTION LAYER V2 — MINIMAL ADMISSIBLE SCOPE

  ADMISSIBLE                                                                                                                                                  
   
  ┌───────────┬────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────┐   
  │ Candidate │                    Name                    │                                      Constraint Summary                                      │
  ├───────────┼────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤   
  │ PL3-C1    │ Type-based grouping by governed node       │ Keys from B-01 canonical set only; no semantic labels on groups; applied to existing         │
  │           │ vocabulary                                 │ governed collections only                                                                    │
  ├───────────┼────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤   
  │ PL3-C2    │ Type-based filtering by governed node      │ Predicates from B-01 canonical set only; results are structural subsets; out-of-contract     │
  │           │ vocabulary                                 │ type values ungoverned                                                                       │   
  ├───────────┼────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
  │ PL3-C3    │ Equality-based signal check on             │ Equality to AVAILABLE only; result is boolean structural fact; no semantic label; no other   │   
  │           │ computation_state                          │ signal field admissible                                                                      │   
  ├───────────┼────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
  │ PL3-C4    │ Signal operations using computation_state  │ computation_state equality only; results carry no semantic label; existing v1.1 signal       │   
  │           │ as dimension                               │ operations unchanged                                                                         │   
  ├───────────┼────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
  │ PL3-C5    │ Traceable evidence-linked derived outputs  │ Conditional — applicable only when source data carries B-03-compliant linkage structure;     │   
  │           │                                            │ allowed forms per B-03 section 4.3 only                                                      │   
  └───────────┴────────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                                                                                              
  DEFERRED                                                  

  ┌───────────┬─────────────────────────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┐   
  │ Candidate │                        Name                         │                                       Reason                                        │
  ├───────────┼─────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤   
  │ PL3-C6    │ capability_surfaces_index as governed projection    │ B-04 return condition not met; no defined use case; content redundant with existing │
  │           │ artifact                                            │  governed fields                                                                    │
  └───────────┴─────────────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘   
   
  INADMISSIBLE                                                                                                                                                
                                                            
  ┌───────────┬───────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Candidate │               Name                │                                                Reason                                                 │
  ├───────────┼───────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ PL3-C7    │ Any candidate requiring semantic  │ Crosses projection authority boundary; no accepted blocker governance extends projection into         │
  │           │ interpretation                    │ interpretation, condition, diagnosis, prioritization, or narrative                                    │
  └───────────┴───────────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────┘

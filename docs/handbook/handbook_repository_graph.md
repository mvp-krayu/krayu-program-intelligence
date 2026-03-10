PROGRAM INTELLIGENCE HANDBOOK
Repository Structure Graph

Purpose

This document provides a visual representation of the Program Intelligence repository structure and the relationship between:

• the handbook navigation layer  
• handbook chapters  
• stream indexes  
• authoritative artifact directories  

The graph below illustrates how the handbook acts as the entry point into the discipline and how it connects to the underlying stream artifacts.

---

DISCIPLINE STRUCTURE GRAPH

```mermaid
graph TD

    H[Program Intelligence Handbook]

    H --> I[Handbook Introduction]
    H --> VM[Visual Map]
    H --> NM[Navigation Model]
    H --> CS[Cross Stream Synthesis]

    H --> P1[Part I — Discipline]
    H --> P2[Part II — Framework]
    H --> P3[Part III — Signal Science]
    H --> P4[Part IV — Demonstrations]
    H --> P5[Part V — Case Studies]
    H --> P6[Part VI — Commercialization]

    H --> C[Conclusion]

    P1 --> S10[Stream 10 Index]
    P2 --> S20[Stream 20 Index]
    P3 --> S40[Stream 40 Index]
    P4 --> S50[Stream 50 Index]
    P5 --> S60[Stream 60 Index]
    P6 --> S30[Stream 30 Index]

    S10 --> D10[docs/program-intelligence-discipline]
    S20 --> D20[docs/program-intelligence-framework]
    S40 --> D40[docs/signal-science]
    S50 --> D50[docs/program-intelligence-demonstrations]
    S60 --> D60[docs/program-intelligence-case-studies]
    S30 --> D30[docs/program-intelligence-commercialization]
```

---

DISCIPLINE FLOW

The Program Intelligence discipline transforms observable execution evidence into executive insight through the following conceptual chain:

Execution Evidence  
→ Execution Signals  
→ Signal Interpretation  
→ Program Intelligence  
→ Executive Insight

---

REPOSITORY PRINCIPLE

The handbook is the navigation layer of the discipline.

The authoritative content resides in the stream artifact directories.

The handbook must therefore:

• link to authoritative artifacts rather than duplicate them  
• provide conceptual synthesis of the streams  
• expose artifact indexes for each stream domain

---

MAINTENANCE RULE

When new artifacts are introduced:

1. The artifact is placed in the appropriate stream directory
2. The stream index is updated or regenerated
3. The handbook chapter is updated if conceptual synthesis is affected
4. The repository graph may be updated if structural changes occur


---

STREAM 10 — DISCIPLINE ARTIFACT GRAPH

```mermaid
graph TD

    S10[Stream 10 — Program Intelligence Discipline]

    S10 --> D1[program_intelligence_definition.md]
    S10 --> D2[program_intelligence_manifesto.md]
    S10 --> D3[program_intelligence_body_of_knowledge.md]
```

---

STREAM 20 — FRAMEWORK ARTIFACT GRAPH

```mermaid
graph TD

    S20[Stream 20 — Program Intelligence Framework]

    S20 --> F1[framework_signal_alignment.md]
    S20 --> F2[program_intelligence_knowledge_map_togaf.md]
    S20 --> F3[program_intelligence_maturity_model.md]
    S20 --> F4[program_intelligence_pyramid.md]
    S20 --> F5[program_intelligence_three_layer_model.md]
    S20 --> F6[program_intelligence_value_loop.md]
```

---

STREAM 40 — SIGNAL SCIENCE ARTIFACT GRAPH

```mermaid
graph TD

    S40[Stream 40 — Execution Signal Science]

    S40 --> SS1[execution_signal_model.md]
    S40 --> SS2[execution_signal_taxonomy.md]
    S40 --> SS3[program_intelligence_signal_matrix.md]
    S40 --> SS4[signal_evidence_model.md]
    S40 --> SS5[signal_interpretation_model.md]
```

---

STREAM 50 — DEMONSTRATIONS ARTIFACT GRAPH

```mermaid
graph TD

    S50[Stream 50 — Program Intelligence Demonstrations]

    S50 --> DEM1[demonstration_exec_intelligence.md]
    S50 --> DEM2[demonstration_signal_pipeline.md]
    S50 --> DEM3[program_intelligence_demonstration_model.md]
    S50 --> DEM4[wow_30_day_demonstration.md]
```

---

STREAM 60 — CASE STUDIES ARTIFACT GRAPH

```mermaid
graph TD

    S60[Stream 60 — Program Intelligence Case Studies]

    S60 --> CS1[blueedge_program_case_study.md]
    S60 --> CS2[program_intelligence_case_study_index.md]
    S60 --> CS3[program_intelligence_case_study_model.md]
    S60 --> CS4[program_signal_behavior_case.md]
```

---

STREAM 30 — COMMERCIALIZATION ARTIFACT GRAPH

```mermaid
graph TD

    S30[Stream 30 — Program Intelligence Commercialization]

    S30 --> COM1[krayu_program_intelligence_positioning.md]
    S30 --> COM2[program_intelligence_advisory_engagement.md]
    S30 --> COM3[program_intelligence_advisory_model.md]
    S30 --> COM4[program_intelligence_value_proposition.md]
```

Maintenance Rule

Whenever a new artifact is introduced in a str
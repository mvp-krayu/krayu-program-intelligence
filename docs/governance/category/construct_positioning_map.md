# Construct Positioning Map

Entity: Problem Space (Program Intelligence)
Class: Doctrine Context Layer
Role: Definition of the structural problem domain preceding the discipline
Parent: Program Intelligence
Layer: Pre-Discipline Context Layer
Projection Depth: L1

Entity: Signal Infrastructure
Class: Signal Extraction Layer
Role: Execution signal production and structuring
Parent: Program Intelligence
Layer: Operational Bridge
Projection Depth: L2 (anchor surface under /program-intelligence/)

Entity: Signal
Class: Analytical Signal Layer
Role: Evidence-derived execution signal formation
Parent: Signal Infrastructure
Layer: Intermediate Analytical Layer
Projection Depth: L2

Entity: Portfolio Intelligence
Class: Aggregated Intelligence Layer
Role: Program-level execution aggregation and interpretation
Parent: Program Intelligence
Layer: Executive Aggregation Layer
Projection Depth: L2

Entity: Execution Stability Index (ESI)
Class: Execution Signal
Role: Stability Measurement Dimension
Parent: Signal Infrastructure
Layer: Category Primitive
Projection Depth: L3 (dedicated page allowed)

Entity: Risk Acceleration Gradient (RAG)
Class: Execution Signal
Role: Acceleration Measurement Dimension
Parent: Signal Infrastructure
Layer: Category Primitive
Projection Depth: L3 (dedicated page allowed)

Entity: Execution Blindness
Class: Condition
Role: Observable failure state of execution visibility
Parent: Program Intelligence
Projection Depth: L3

Entity: Program Intelligence Gap
Class: Problem Context
Role: Structural gap between execution reality and executive visibility
Parent: Program Intelligence
Projection Depth: L3

Entity: Early Warning Signals (Program Failure)
Class: Detection Layer
Role: Identification of program failure conditions via signal patterns
Parent: Program Intelligence
Layer: Derived Detection Layer
Projection Depth: L2

Entity: Why Dashboards Fail Programs
Class: Diagnostic Explanation Layer
Role: Explanation of metric-based visibility failure
Parent: Execution Blindness
Layer: Interpretive Diagnostic Layer
Projection Depth: L2

Entity: Execution Blindness Examples
Class: Pattern Illustration Layer
Role: Structured representation of execution blindness manifestations
Parent: Execution Blindness
Layer: Illustrative Layer
Projection Depth: L2

Constraint:
Execution Signals must not exist outside Signal Infrastructure context.

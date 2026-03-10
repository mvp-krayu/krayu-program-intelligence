PROGRAM INTELLIGENCE HANDBOOK
Handbook Maintenance Protocol

Purpose

This document defines the maintenance process for the Program Intelligence Handbook.

The handbook is a navigation and synthesis layer over the authoritative artifacts produced in the Program Intelligence streams. It must remain synchronized with the repository structure without duplicating stream artifacts.


HANDBOOK ROLE

The handbook performs three functions:

• provide a structured publication explaining the Program Intelligence discipline
• act as the navigation entry point for the repository
• link readers to authoritative artifacts produced in the streams

The handbook does not replace or duplicate the artifacts contained in the streams.


HANDBOOK LOCATION

All handbook artifacts are stored under:

~/Projects/Krayu_Signäl/docs/handbook/


TRIGGER EVENTS FOR HANDBOOK UPDATES

A handbook update is required when one of the following occurs:

1. A new artifact is created in a stream directory.
2. An artifact is renamed or moved.
3. A new conceptual element requires explanation in a handbook chapter.
4. A new stream is added to the Program Intelligence structure.


UPDATE PROCEDURE

Step 1 — Update the Stream Index

Locate the relevant stream index in the handbook directory.

Example:

docs/handbook/handbook_stream_20_index.md

Add a link to the new artifact using a relative path.

Example:

- [New Framework Model](../program-intelligence-framework/new_framework_model.md)

The stream index must always reflect the current artifact inventory of the stream directory.


Step 2 — Review the Corresponding Handbook Part

Check the related handbook part chapter.

Example:

handbook_part_2_framework.md

Update the chapter only if the new artifact introduces a new concept or changes the interpretation of the discipline.

Most artifact additions do not require changes to handbook narrative chapters.


Step 3 — Root Handbook File

Normally the root handbook file does not change.

program_intelligence_handbook.md

Update it only if:

• the handbook structure changes
• a new stream is introduced
• the navigation model of the discipline evolves


DIRECTORY RESPONSIBILITIES

Root navigation

program_intelligence_handbook.md

Structural definition

program_intelligence_handbook_structure.md

Orientation chapters

handbook_introduction.md
handbook_visual_map.md
handbook_navigation_model.md
handbook_cross_stream_synthesis.md

Part chapters

handbook_part_1_discipline.md
handbook_part_2_framework.md
handbook_part_3_signal_science.md
handbook_part_4_demonstrations.md
handbook_part_5_case_studies.md
handbook_part_6_commercialization.md

Stream indexes

handbook_stream_10_index.md
handbook_stream_20_index.md
handbook_stream_40_index.md
handbook_stream_50_index.md
handbook_stream_60_index.md
handbook_stream_30_index.md


MAINTENANCE PRINCIPLE

The handbook must always obey the following rule:

The handbook explains, organizes, and links.

The streams remain the authoritative source of artifacts.


EXPECTED MAINTENANCE FREQUENCY

Stream index updates:
Whenever a new artifact appears in a stream.

Handbook narrative updates:
Only when the discipline itself evolves or requires clarification.


FINAL OBJECTIVE

The Program Intelligence Handbook must remain:

• readable as a discipline publication
• navigable as a repository entry point
• synchronized with the evolving artifact structure of the Program Intelligence streams
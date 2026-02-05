---
name: galaxy-workflow-viz
description: Generate Galaxy-branded workflow visualization SVGs for IWC workflows. Creates static diagrams matching Galaxy's workflow editor style with bezier connections, node cards, and proper terminal positioning. Use when creating visual diagrams for workflows in this repository.
---

# Galaxy Workflow Visualization

Generate beautiful, static SVG workflow diagrams that match Galaxy's workflow editor visual style.

## When to Use This Skill

Use when:
- Creating visual diagrams for IWC workflow files (in `workflows/` directory)
- Generating workflow overview graphics for documentation
- Building workflow previews for the IWC website (iwc.galaxyproject.org)
- Need a Galaxy-branded visualization of a pipeline

## Relationship to Mermaid Diagrams

This repository already generates Mermaid diagrams via `scripts/create_mermaid.py` - those show the complete step-by-step workflow structure and are useful for detailed technical documentation.

This skill creates **complementary** visualizations that are:
- **Simplified** - Shows the workflow story, not every utility step
- **Branded** - Matches Galaxy's workflow editor visual style
- **Beautiful** - Designed for marketing, landing pages, and quick overviews
- **Hand-crafted** - LLM-generated with human review for quality

## IWC Workflow Locations

Workflows in this repository are organized by domain:
- `workflows/epigenetics/` - ChIP-seq, ATAC-seq, Hi-C
- `workflows/transcriptomics/` - RNA-seq
- `workflows/proteomics/` - Mass spec analysis
- `workflows/computational-chemistry/` - GROMACS, docking
- `workflows/genome-assembly/` - Assembly pipelines
- `workflows/variant-calling/` - SNP/variant detection

Each workflow directory contains a `.ga` file (Galaxy workflow JSON format).

## Visual Style Reference

The output should match Galaxy's actual workflow editor appearance.

### Colors (Galaxy Theme)

```
Primary (brand-primary):     #25537b  - Node headers, connections, borders
Background grid light:       #c5d5e4  - Minor grid lines
Background grid major:       #b0c4d8  - Major grid lines
Canvas background:           #f8f9fa  - Light gray
Output nodes:                #f97316  - Orange for workflow outputs
Report/QC nodes:             #10b981  - Green for MultiQC, reports
Text primary:                #495057  - Body text
Text secondary:              #868e96  - Descriptions, labels
```

### Node Design

Nodes are Bootstrap-style cards:
- **Width**: ~180-200px for standard nodes
- **Border radius**: 4px
- **Border**: 1px solid #25537b
- **Header**: 28px tall, filled with #25537b, white text
- **Header content**: Step number + tool name (e.g., "2: fastp")
- **Body**: White background, contains description text
- **Drop shadow**: `drop-shadow(1px 2px 3px rgba(0,0,0,0.15))`

### Connection Terminals

- **Standard terminal**: 6px radius circle, white fill, 2px #25537b stroke
- **Small terminal** (QC outputs): 5px radius, 1.5px stroke
- **Position**: At edge of node card (cx=0 for inputs, cx=width for outputs)

### Connection Lines (Bezier "Noodles")

- **Stroke width**: 4px for main flow, 3px for secondary
- **Color**: #25537b (same as nodes)
- **Line cap**: round
- **QC/optional connections**: stroke-dasharray="5 3"
- **Curve style**: Cubic bezier (CSS curveBasis approximation)

Forward connection (left-to-right):
```
M startX startY
C (startX + shift) startY, (endX - shift) endY, endX endY
```

Where `shift = 15 + (distanceX * 0.15) + (distanceY * 0.08)`

## SVG Structure Template

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 WIDTH HEIGHT" role="img" aria-label="WORKFLOW_NAME workflow diagram">
  <title>WORKFLOW_NAME</title>
  <desc>Brief description of the workflow</desc>

  <defs>
    <!-- Grid pattern -->
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#c5d5e4" stroke-width="0.5"/>
    </pattern>
    <pattern id="grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
      <rect width="100" height="100" fill="url(#grid)"/>
      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#b0c4d8" stroke-width="1"/>
    </pattern>

    <style>
      .connection {
        stroke: #25537b;
        stroke-width: 4;
        fill: none;
        stroke-linecap: round;
      }
      .connection-qc {
        stroke: #25537b;
        stroke-width: 3;
        fill: none;
        stroke-linecap: round;
        stroke-dasharray: 5 3;
      }
      .node-card {
        filter: drop-shadow(1px 2px 3px rgba(0,0,0,0.15));
      }
    </style>
  </defs>

  <!-- Background -->
  <rect width="WIDTH" height="HEIGHT" fill="#f8f9fa"/>
  <rect width="WIDTH" height="HEIGHT" fill="url(#grid-major)"/>

  <!-- Title bar -->
  <rect x="0" y="0" width="WIDTH" height="45" fill="#25537b"/>
  <text x="20" y="28" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="white">
    WORKFLOW_NAME
  </text>

  <!-- CONNECTIONS (draw first, behind nodes) -->
  <!-- ... bezier paths ... -->

  <!-- NODES -->
  <!-- ... node groups ... -->

  <!-- Legend (optional) -->
</svg>
```

## Node Template

```xml
<g class="node-card" transform="translate(X, Y)">
  <rect width="200" height="90" rx="4" fill="white" stroke="#25537b" stroke-width="1"/>
  <rect width="200" height="28" rx="4" fill="#25537b"/>
  <rect x="0" y="24" width="200" height="4" fill="#25537b"/>
  <text x="10" y="19" font-family="system-ui, sans-serif" font-size="11" fill="rgba(255,255,255,0.7)">N:</text>
  <text x="26" y="19" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="white">Tool Name</text>
  <text x="100" y="55" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="#495057">Description</text>
  <text x="100" y="72" text-anchor="middle" font-family="system-ui, sans-serif" font-size="9" fill="#868e96">Subtitle</text>
  <!-- Input terminal at left edge -->
  <circle cx="0" cy="45" r="6" fill="white" stroke="#25537b" stroke-width="2"/>
  <!-- Output terminal at right edge -->
  <circle cx="200" cy="45" r="6" fill="white" stroke="#25537b" stroke-width="2"/>
</g>
```

## Output Node Template (Orange header)

```xml
<g class="node-card" transform="translate(X, Y)">
  <rect width="100" height="50" rx="4" fill="white" stroke="#f97316" stroke-width="1.5"/>
  <rect width="100" height="20" rx="4" fill="#f97316"/>
  <rect x="0" y="16" width="100" height="4" fill="#f97316"/>
  <text x="50" y="14" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="white">Output Name</text>
  <text x="50" y="38" text-anchor="middle" font-family="system-ui, sans-serif" font-size="8" fill="#868e96">format info</text>
  <circle cx="50" cy="0" r="5" fill="white" stroke="#f97316" stroke-width="2"/>
</g>
```

## Subworkflow Node Template

For workflows containing subworkflows, use a larger card with diagonal stripe pattern:

```xml
<g class="subworkflow-card" transform="translate(X, Y)">
  <rect width="280" height="170" rx="6" fill="url(#subworkflow-pattern)" stroke="#25537b" stroke-width="2"/>
  <rect width="280" height="170" rx="6" fill="rgba(255,255,255,0.9)" stroke="#25537b" stroke-width="2"/>
  <!-- Header -->
  <rect width="280" height="32" rx="6" fill="#25537b"/>
  <text x="12" y="22" font-family="system-ui, sans-serif" font-size="14" fill="white">⎔</text>
  <text x="30" y="22" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="white">Subworkflow Name</text>
  <!-- Inner content: mini flow diagram, output list -->
</g>
```

## Workflow Analysis Process

When given a .ga file:

1. **Identify the main spine** - The longest path of domain-meaningful steps
2. **Classify tools** by category:
   - Input (data inputs, not parameters)
   - QC (fastp, FastQC, trimming tools)
   - Mapping (bowtie2, bwa, STAR, HISAT2)
   - Filtering (samtools filter, dedup)
   - Analysis (MACS2, featureCounts, DESeq2, domain-specific tools)
   - Report (MultiQC)
   - Output (workflow outputs)

3. **Simplify** - Don't show every step:
   - Skip utility steps (format conversion, flatten collection, map_param_value)
   - Skip parameter inputs (quality %, thresholds, boolean flags)
   - Keep data inputs (FASTQs, reference files, GTF annotations)
   - Group repeated similar steps if needed
   - Represent subworkflows as single boxes showing their purpose

4. **Layout** - Arrange for clarity:
   - Main spine flows left-to-right
   - QC branches curve down to a MultiQC node
   - Outputs positioned below or to the side of final analysis
   - Subworkflows as larger boxes with mini flow diagrams inside

## Connection Math

For a connection from output terminal at (x1, y1) to input terminal at (x2, y2):

```javascript
// Calculate line shift based on Galaxy's algorithm
const distanceX = Math.abs(x2 - x1);
const distanceY = Math.abs(y2 - y1);
const shift = 15 + (distanceX * 0.15) + (distanceY * 0.08);

// Forward connection (x2 >= x1)
const path = `M ${x1} ${y1} C ${x1 + shift} ${y1}, ${x2 - shift} ${y2}, ${x2} ${y2}`;

// Reverse connection (x2 < x1) - needs extra control points
const lineShiftY = (y2 - y1) / 2;
const path = `M ${x1} ${y1}
  C ${x1 + shift} ${y1}, ${x1 + shift} ${y1 + lineShiftY}, ${x1 + shift} ${y1 + lineShiftY}
  C ${x2 - shift} ${y2 - lineShiftY}, ${x2 - shift} ${y2}, ${x2} ${y2}`;
```

## Critical Rules

1. **Connections must connect to terminals** - Calculate absolute positions carefully:
   - Node at `translate(X, Y)` with terminal at `cx=CX, cy=CY`
   - Absolute terminal position is `(X + CX, Y + CY)`

2. **No animations** - Static diagrams only

3. **Draw connections BEFORE nodes** - So nodes appear on top

4. **Include accessibility** - `role="img"`, `aria-label`, `<title>`, `<desc>`

5. **Keep it simple** - Focus on the workflow story, not every detail

## Example Workflows

### Simple Linear (ChIP-seq style)
```
Input → QC/Trim → Mapping → Filtering → Analysis → Outputs
                                            ↓
                                         MultiQC
```

### Branching (RNA-seq style)
```
Input → QC → Mapping → ┬→ Quantification → Output
                       ├→ Coverage → Output
                       └→ MultiQC
```

### With Subworkflows (End-to-End DE)
```
Sample Sheet → [RNA-seq Processing] → [DE Analysis] → Results
     GTF ────────────┘                      │
                                      Volcano Plot
                                      Heatmaps
```

## Input Modes

1. **Path to .ga file**: `workflows/epigenetics/chipseq-pe/chipseq-pe.ga`
2. **Galaxy API URL**: `https://usegalaxy.org/api/workflows/{id}/download`
3. **Natural language**: "ChIP-seq workflow with fastp, bowtie2, MACS2"

## Output

Generate a complete, valid SVG file that:
- Can be viewed directly in a browser
- Scales cleanly (vector graphics)
- Matches Galaxy's visual identity
- Tells the workflow's story clearly

Save SVGs to:
- The workflow's directory: `workflows/domain/workflow-name/workflow-name-diagram.svg`
- Or `/tmp/` for review before committing

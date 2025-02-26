# Generate Nx and Size Plots for Multiple Assemblies

## Overview

This utility workflow generates standardized visualizations for comparing multiple genome assemblies, providing essential metrics for assembly quality assessment. The workflow creates both Nx plots (showing continuity metrics) and size distribution plots, enabling side-by-side evaluation of multiple assemblies from different sources, technologies, or assembly methods.

## Workflow Process

The Generate-Nx-and-Size-plots-for-multiple-assemblies workflow provides:

1. **Assembly Statistics Calculation**
   - Processes multiple FASTA-format assemblies
   - Calculates comprehensive contig/scaffold statistics for each assembly
   - Extracts sequence length distributions from all assemblies
   - Performs Nx calculations (N50, N90, etc.) for all assemblies
   - Standardizes metrics for consistent comparison

2. **Nx Plot Generation**
   - Creates standardized Nx plots showing assembly continuity
   - Displays cumulative sequence length across all assemblies
   - Includes N50 reference lines for quick quality assessment
   - Automatically generates appropriate scales based on assembly sizes
   - Produces publication-ready visualizations with consistent styling

3. **Size Distribution Visualization**
   - Generates contig/scaffold size distribution plots
   - Enables comparison of sequence length distributions across assemblies
   - Visualizes differences in fragmentation or continuity patterns
   - Provides insights into assembly algorithm performance
   - Facilitates detection of size anomalies or biases

## Input Requirements

**Required Inputs:**
- Collection of genome assemblies in FASTA format
  - Each item in the collection should be named appropriately
  - Names will be used as labels in the generated plots
  - Collection can include assemblies from different sources or methods

## Output Details

The workflow produces two primary visualization outputs:
1. **Nx Plot**
   - Shows sequence continuity metrics for all assemblies
   - X-axis represents Nx percentage (0-100%)
   - Y-axis shows sequence length (log scale)
   - Each assembly is represented by a different colored line
   - Assembly names from the collection are used in the legend

2. **Size Plot**
   - Visualizes contig/scaffold size distributions for all assemblies
   - X-axis represents size ranges
   - Y-axis shows sequence count or cumulative length
   - Each assembly is represented by a different colored distribution
   - Assembly names from the collection are used in the legend

## Applications

This visualization workflow is valuable for:
- Comparing assembly quality between different methods
- Evaluating improvements after polishing or scaffolding steps
- Benchmarking assembly performance across different datasets
- Creating standardized figures for publications and reports
- Quality control during the genome assembly process
# Species distribution EBV Workflow

## General description

This Galaxy workflow estimates species distribution within the framework of Essential Biodiversity Variables (EBV) using field observation data.
It is based on presence/absence or abundance data, combined with information on observation units, and uses generalised linear models (GLMs) to analyse spatial and temporal trends in populations.
The workflow is designed to produce EBV indicators related to species distribution and abundance.

## Objectives

- Transform abundance data into presence/absence tables
- Model species distribution using GLM
- Provide summary statistics and EBV indicators
- Generate visualisations from the models

## Input data

### Abundance data

Tabular file containing species observations, including:
- Location (site)
- Year
- Species
- Abundance
This file forms the basis for calculating presence/absence.

### Information on observation units

Tabular file describing observation units (unitobs), with all available information, for example:
- Site identifier
- Habitat
- Environmental variables
- Spatial or temporal metadata
This file is used in the modelling and visualisation stages.

## Workflow steps

### Step 1: Calculate presence/absence

Tool: Calculate presence absence table
Using abundance data, this step generates a presence/absence table by species and observation unit.

Output:
- Presence/absence table (tabular format)

### Step 2: GLM modelling of populations

Tool: Compute GLM on population data
A generalised linear model (GLM) is applied to presence/absence data, incorporating information from observation units.

Notable settings:
- Repeated variables: year, site, habitat
- Random effect: site

Outputs:
- Summary of GLM results (table)
- Descriptive statistics for the variables analysed (text)
- Evaluation file/analysis score (text)

### Step 3: Visualising the results

Tool: Create a plot from GLM data

This step produces graphs based on:
- The GLM results
- The presence/absence table
- Information about the observation units

Outputs:
- Distribution and trend graphs
- Text report associated with the visualisations

## Use cases

This workflow is intended for:
- Analysis of biodiversity monitoring data
- Production of EBV indicators
- Study of species distribution trends
- Ecological research or management projects

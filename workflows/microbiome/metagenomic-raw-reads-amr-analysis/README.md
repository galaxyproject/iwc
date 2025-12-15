# Raw read AMR analysis from metagenomic data

This workflow generates AMDR detection from paired short reads.

## Raw read Annotation

Directly from trimmed raw reads, following processing steps are performed:

* **AMR detection** with Groot and deepARG
* **Results uniformization** with argNorm

## Input Requirements

Input reads must be quality-filtered, with host reads removed.

* **Trimmed reads** : Quality-trimmed reads from individual samples, used solely for abundance estimation.

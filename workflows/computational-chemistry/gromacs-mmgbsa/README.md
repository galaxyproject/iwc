# GROMACS MMGBSA free energy calculation

Perform an ensemble of MD simulations of a user-specified size using GROMACS,
and calculate MMGBSA free energies using AmberTools. An ensemble average is
calculated and returned to the user as the final input.

The input protein (PDB) and ligand (SDF) files provided are parameterized by
the 'Protein-ligand complex parameterization' subworkflow.

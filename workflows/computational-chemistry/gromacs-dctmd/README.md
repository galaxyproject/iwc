# GROMACS dcTMD free energy calculation

Perform an ensemble of targeted MD simulations of a user-specified size using
the GROMACS PULL code and calculate dcTMD free energy and friction profiles
for the resulting dissocation pathway. Note that pathway separation is not
performed by the workflow; the user is responsible for checking the ensemble themselves.

The input protein (PDB) and ligand (SDF) files provided are parameterized by
the 'Protein-ligand complex parameterization' subworkflow.

## Citations
* Steffen Wolf and Gerhard Stock (2018), Targeted Molecular Dynamics Calculations of Free Energy Profiles Using a Nonequilibrium Friction Correction, J. Chem. Theory Comput. doi:10.1021/acs.jctc.8b00835
* Steffen Wolf, Benjamin Lickert, Simon Bray and Gerhard Stock (2020), Multisecond ligand dissociation dynamics from atomistic simulations, Nat. Commun. doi:10.1038/s41467-020-16655-1

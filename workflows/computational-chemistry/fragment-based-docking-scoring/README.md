# Fragment-based virtual screening with docking and pose scoring

Dock a compound library against a target protein with rDock and validate the
poses generated against a reference fragment using SuCOS to compare the feature
overlap. Poses are filtered by a user-specified SuCOS threshold.

A list of fragments should be specified which will be used to define the cavity
for docking, using the 'Frankenstein ligand' technique. For more details, please
see https://www.informaticsmatters.com/blog/2018/11/23/cavities-and-frankenstein-molecules.html

Compounds are split into collections and then recombined to allow the workflow
to be run in a highly parallelized fashion. To specify the level of
parallelization, use the 'Collection size' parameter.

# QCxMS Spectra Prediction from SDF Workflow

This workflow predicts electron ionization (EI) mass spectra using QCxMS, starting from a single SDF file containing the 3D coordinates of all atoms in the molecule. These files can typically be obtained from PubChem. The workflow converts the input file, performs neutral and production runs, and generates predicted spectra in MSP format.

## Workflow Steps

1. **Input SDF File**:
   - Accepts an SDF file containing one or multiple molecular structures with pre-generated conformers.

2. **Conversion to XYZ Format**:
   - Converts the input SDF file to XYZ format using Open Babel.

3. **QCxMS Neutral Run**:
   - Performs a neutral run to prepare the molecular structure for production calculations.

4. **QCxMS Production Run**:
   - Executes the production run to simulate fragmentation and generate intermediate results.

5. **QCxMS Get Results**:
   - Processes the results from the production run and generates the predicted EI mass spectra in MSP format.

## Inputs

- **Input SDF File**: A file containing molecular structures with 3D coordinates (e.g., obtained from PubChem).

## Outputs

- **Predicted Spectra**:
  - An MSP file containing the predicted EI mass spectra for the input molecules.

## Usage

This workflow is designed to be run on the Galaxy platform. Users can upload their SDF file, configure parameters, and execute the workflow to obtain predicted EI mass spectra.

## References

- [QCxMS Documentation](https://github.com/recetox/qcxms)
- [Open Babel Documentation](http://openbabel.org/)

## License

This workflow is distributed under the MIT License. Please ensure proper attribution when using or modifying this workflow.
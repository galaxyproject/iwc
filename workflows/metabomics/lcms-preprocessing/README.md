# Mass spectrometry: LC-MS preprocessing with XCMS 

This workflow uses the XCMS tool R package [(Smith, C.A. 2006)](https://bioconductor.org/packages/release/bioc/html/xcms.html) to extract, filter, align and fill gaps, and uses the CAMERA R package [(Kuhl, C 2012)](https://bioconductor.org/packages/release/bioc/html/CAMERA.html) to annotate isotopes, adducts and fragments.

🎓 For more information see the [Galaxy Training Network tutorial: Mass spectrometry: LC-MS preprocessing with XCMS](https://training.galaxyproject.org/training-material/topics/metabolomics/tutorials/lcms-preprocessing/tutorial.html)

## Inputs
### sampleMetadata
The sampleMetadata tabular file corresponds to a table containing information about your samples

A sample metadata file contains various information for each of your raw files:
- Classes which will be used during the preprocessing steps
- Analytical batches which will be useful for a batch correction step, along with sample types (pool/sample) and injection order
- Different experimental conditions which can be used for statistics
- Any information about samples that you want to keep, in a column format

The content of your sample metadata file has to be filled by you, since it is not contained in your raw data. Note that you can either:
- Upload an existing metadata file
- Use a template to create one (because it can be painful to get the sample list without misspelling or omission)
  - Generate a template with the `xcms get a sampleMetadata file` tool available in Galaxy
  - Fill it using your favorite table editor (Excel, LibreOffice)
  - Upload it within Galaxy

**Formats:** tab-separated values as tsv, tab, txt, ...

### Mass-spectrometry Dataset Collection
Mass-spectrometry data files gathered in a Galaxy Dataser Collection

**Formats:** open format as mzXML, mzMl, mzData and netCDF

## Main steps
1. MSnbase readMSData: read the mzXML and prepare for xcms
2. XCMS findChromPeaks: peak picking
3. XCMS groupChromPeaks: determining shared ions across samples
4. XCMS adjustRtime: retention time correction
5. XCMS fillChromPeaks: integrating areas of missing peaks
6. CAMERA.annotate: annotation

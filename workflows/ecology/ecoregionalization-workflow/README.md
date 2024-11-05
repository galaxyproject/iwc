# Ecoregionalization Workflow

This workflow allows you to create an ecoregionalization map from occurrences and environmental data using a boosted regression trees model for predictions.

The workflow is intended for processing occurrence data, which should include latitude, longitude and species presence or absence. You can use example test data available with the workflow, highlighting a use case centered on the Dumont d'Urville sea region and benthic invertebrates. The primary goal of this workflow is to generate species distribution maps and identify ecoregions within the study area. The project's objective is to offer accessible, reproducible, and transparent IT solutions for processing and analyzing species occurrence data.

This workflow is linked to the Galaxy training ecoregionalization tutorial. (https://ecology.usegalaxy.eu/training-material/topics/ecology/tutorials/Ecoregionalization_tutorial/tutorial.html)

For practical use the ecoregionalization workflow is split in two worklows. 

The first part use nine tools (5 for data formatting and 4 for the beginning of ecoregionalization workflow) :

- Advanced cut
- Column Regex Find And Replace
- Filter Tabular
- Merge Columns
- Interactive JupyterLab and notebook
- GeoNearestNeighbor
- BRT prediction tool
- TaxaSeeker
- ClusterEstimate

The second part use two tools:

- ClaraClust
- EcoMap

Some definitions:

Ecoregionalization: The process by which a territory is classified into a category of area that respond to the same environmental factors taking into account species information. 

Occurrences data: Data showing the presence of a species at a particular location.

Environmental data: Environmental data are any measurement or information that describe environmental processes, location, or conditions.

Boosted regression trees (BRT): Boosted Regression Trees is a kind of regression methodology based on Machine Learning. Unlike conventional regression methods (GLMs, GAMs), BRTs combine numerous basic decision trees to enhance the predictive performance. BRTs can handle complex relationships and interactions among predictors, and it is considered a robust technique that can control outliers and nonlinearity.

Clustering:Clustering is a machine learning method of grouping data points by similarity or distance.

CLARA/PAM: CLARA (Clustering Large Applications), is an extension to k-medoids (PAM) methods to deal with data containing a large number of objects. PAM stands for "Partition Around Medoids", the PAM algorithm searches for k representative objects in a data set (k medoids) and then assigns each object to the closest medoid in order to create clusters.

## Ecoregionalization workflow part 1 
### Input data set 
#### Environmental data

To run this workflow, you will first need environmental data.This workflow accepts several types of environmental parameters like temperature or soil type.However, there is a mandatory file format, the tabular format (.tsv) and each pixel of the study area must be described in this file by associating latitude and longitude with environmental parameters.

To test the workflow, you can use example environmental file available here: https://data.indores.fr/dataset.xhtml?persistentId=doi%3A10.48579%2FPRO%2FLQMHX9 containing seventeen abiotic and physical parameters of the Dumont D'Urville sea region. They were taken from oceanographic models and in situ measurements. The physical oceanographic parameters are mean temperature and its standard deviation, mean salinity and its standard deviation, mean current magnitude and its standard deviation, maximum current bearing, maximum current magnitude and sea ice production. Bathymetric parameters are depth, slope, and rugosity. Finally, the seabed substrate composition was characterized by percentages of biogenic carbonate, biogenic silica, gravel, sand, and mud.

Here an example of environmental file input: 

+------+------+---------+------+------+
| long | lat  |  Carbo  | Grav | ...  |
+------+------+---------+------+------+
|139.22|-65.57|   0.88  |28.59 | ...  |
+------+------+---------+------+------+
|139.25|-65.63|   0.88  |28.61 | ...  |
+------+------+---------+------+------+
| ...  | ...  |   ...   | ...  | ...  |
+------+------+---------+------+------+

#### Occurrence data

The second data file you will need to run this workflow is an occurrences data file. As defined above, occurrences data are showing the presence (1) or absence (0) of a species at a particular location. This data file also needs to be in tabular format (.tsv) and need to be construct as following: 

- latitude and longitude columns.

- One column per taxon where each box corresponding to a geographical point is marked 1 if the taxon is present or 0 if the taxon is absent. 

Here an example of occurrences data file input:

+----------+-----------+------------------------+-----------+-----+
|   lat    |   long    |Acanthorhabdus_fragilis | Acarnidae | ... | 
+----------+-----------+------------------------+-----------+-----+
|-65,9     |142,3      |1                       |0          | ... |
+----------+-----------+------------------------+-----------+-----+
|-66,3     |141,3      |0                       |1          | ... |
+----------+-----------+------------------------+-----------+-----+
|   ...    |   ...     |...                     |    ...    | ... | 
+----------+-----------+------------------------+-----------+-----+

To test this workflow, you can use example occurrences data from the Dumont d'Urville sea region available on GBIF (https://api.gbif.org/v1/occurrence/download/request/0030809-240506114902167.zip). These data were collected as part of the CEAMARC program (The Collaborative East Antarctic Marine Census) between December 2007 and January 2008. Prior to its inclusion in GBIF, these data originated from collections at the Muséum national d’Histoire naturelle (MNHN – Paris). A GBIF filter was used to download only the data of interest, namely the data from the CEAMARC expedition from the Aurora Australis icebreaker. The selected occurrences are invertebrates. In the GBIF query, five collections were selected: the cnidarians collection (IK), the echinoderm collection (IE), the crustaceans collection (IU), the molluscs collection (IM), and the tunicates collection (IT), and only occurrences recorded by “IPEV-AAD-MNHN" which correspond to the CEAMARC expedition.

#### Jupyter notebook for the interactive JupyerLab and notebook tool

To switch from the occurrence data download from GBIF to the occurrence data supported by the ecoregionalisation workflow, the final step of data preparation use the "Interactive JupyterLab and notebook" tool who needs a jupyter notebook to work (available here: https://data.indores.fr/dataset.xhtml?persistentId=doi%3A10.48579%2FPRO%2FLQMHX9) . In this Jupyter notebook, we used the pivot_wider function of the tidyr R package to transform our data into a wider format and adapt it to subsequent analyses as part of the Galaxy workflow for ecoregionalization. This transformation allowed us to convert our data to a format where each taxon becomes a separate column. We also took care to fill in the missing values with zeros and to sum the individual counts in case of duplications. Then all data >= 1 are replaced by 1 to have only presence (1) or absence (0) data.

### Output dataset

#### Prediction files

Galaxy return a 'Prediction files' collection who must contain a predictions file of the probability of the presence of each taxon for each “environmental pixel” (latitude, longitude) for each occurrence file you entered.

#### Validation file

In 'validation files collection' there must be a file containing for each taxon the validation metrics of the associated model.

#### Species distribution prediction maps 

In the 'Species distribution prediction maps' collection there must be for each taxon a map representing their probability of presence at each environmental layer pixel.

#### spatial dependence plot

In the ‘Partial dependence plots’ collection there should be graphs showing the percentage explanation of the model for each environmental parameter.

#### Summary of taxa model

This file is a summary file for each taxon indicating whether a BRT model was obtained and the number of occurrences per taxon.

#### List of taxa
Tihs file is a list of taxa for which a BRT model was obtained.

#### List of taxa clean
This file is a list of taxa cleaned (without “_”, “_sp”, etc.) that obtained BRT models to propose the list to WoRMS (World Register of Marine Species) or another taxonomic database and obtain more information about the taxa.

#### SIH index plot
This output is a graph presenting the value of the SIH index according to the number of clusters. The silhouette index provides a measure of the separation between clusters and the compactness within each cluster. The silhouette index ranges from -1 to 1. Values close to 1 indicate that objects are well grouped and separated from other clusters, while values close to -1 indicate that objects are poorly grouped and may be closer to other clusters. A value close to 0 indicates a situation where objects are located at the border between two neighboring clusters. Thus, the optimal number of clusters is the one that maximizes the value of the SIH index.With this graph you will be able to determine the optimal number of clusters retained for the construction of ecoregions. 

#### Data to cluster
This file contains the data to be partitioned.

#### Data.bio table
This file contains four pieces of information, latitude, longitude, presence prediction and corresponding taxon.

## Ecoregionalization workflow part 2
### Input data set 
The inputs of this second part of the ecoregionalization workflow are the environment file, the prediction matrix (Data_to_cluster), the prediction table (Data.bio_table) from the first part of the ecoragionalization workflow and finally the number of cluster that you have determined at the end of the first part thanks to the SIH index plot. 
 
### Output dataset

#### Cluster info file
This file contains all the information related to the clusters created, that is, in column: the latitude, the longitude, the corresponding cluster number and for each taxon the prediction value

#### Cluster points file
This file contains the latitude and longitude of each environmental point and the associated cluster number. This will be used in the EcoMap tool. 

#### Silhouette plot 
The workflow will produce a silhouette plot. A silhouette graph is a representation used to visualize the silhouette index of each observation in a clustered data set. It makes it possible to assess the quality of clusters and determine their coherence and separation. In a silhouette graph, each observation is represented by a horizontal bar whose length is proportional to its silhouette index. The longer the bar, the better the consistency of the observation with its cluster and the separation from other clusters. As mentioned above, the silhouette index ranges from -1 to 1. Values close to 1 indicate that objects are well grouped and separated from other clusters, while values close to -1 indicate that objects are poorly grouped and may be closer to other clusters. A value close to 0 indicates a situation where objects are located at the border between two clusters.

#### Ecomap
The last output is the map with clusters representing ecoregions. 


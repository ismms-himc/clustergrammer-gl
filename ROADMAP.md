# Clustergrammer-GL Roadmap
Clustergrammer-GL is a JavaScript library that produces interactive heatmaps using the WebGL library [regl](https://github.com/regl-project/regl). Clustergrammer-GL's primary use is as dependency of [Clustergrammer2](https://github.com/ismms-himc/clustergrammer2), which is a Jupyter Widget data analysis and visualization library built to analyze single cell high-dimensional biological datasets. Our goals are:

* improve the interactive visualizations produced by Clustergrammer-GL and the Jupyter Widget Clustergrammer2
* improve the front-end data analysis capabilities of Clustergrammer-GL (e.g. front-end re-clustering)
* integrate Clustergrammer-GL into [Clustergrammer-Web](http://github.com/maayanlab/clustergrammer-web) to enable visualizations of larger datasets on the web application

Last updated: July 26th, 2019


# Single Cell Data Visualization
Clustergrammer-GL is primarily being developed to facilitate the analysis of single cell biological datasets and has certain default behaviors (e.g. row gene information lookup on mouseover, enrichment analysis). 
* export genes to Enrichr: https://github.com/ismms-himc/clustergrammer-gl/issues/18

# Use within Jupyter Widget
We are setting up generalizable callback functions that will enable two-way communication to the Python kernel using the Jupyter Widget infrastructure. 
* allow callback functions https://github.com/ismms-himc/clustergrammer-gl/issues/new?assignees=&labels=&template=feature_request.md&title=


# High Dimensional Single Cell Data Visualization
Clustergrammer-GL is primarily being built as a dependency of [Clustergrammer2](https://github.com/ismms-himc/clustergrammer2), a single-cell data analysis toolkit. However, we are developing Clustergrammer-GL to be generalizable. We want Clustergrammer-GL to be useful for exploring datasets outside of biology (e.g. financial), embeddable into other contexts (e.g. custom web applications), and independent of a Python back-end (e.g. run clustering on JavaScript]). Issues associated with these goals are:

* front-end clustering https://github.com/ismms-himc/clustergrammer-gl/issues/1
* value-based category histograms https://github.com/ismms-himc/clustergrammer-gl/issues/31


# Documentation
Please see Clustergrammer's full documentation to see how Clustergrammer-GL fits into the larger project, which includes:
* [Clustergrammer-JS](https://github.com/maayanlab/clustergrammer)
* [Clustergrammer-Web](https://github.com/maayanlab/clustergrammer-web)
* [Clustergrammer2](https://github.com/ismms-himc/clustergrammer2)
* [Clustergrammer-Widget](https://github.com/maayanlab/clustergrammer-widget)


# Clustergrammer-GL Roadmap
Clustergrammer-GL is a JavaScript library that produces interactive heatmaps using the WebGL library regl. This library's primary use case is as dependency of [Clustergrammer2](https://github.com/ismms-himc/clustergrammer2), which is a Jupyter Widget data analysis and visualization library built to analyze single cell high-dimensional biological datasets. Our goals are:

* improve the interactive visualizations produced by Clustergrammer-GL
* improve the interactive visualizations produced by the Jupyter Widget Clustergrammer2
* integrate Clustergrammer-GL into Clustergrammer-Web to enable visualizations of larger datasets
* improve the front-end data analysis capabilities of Clustergrammer-GL (e.g. front-end re-clustering)

Last updated: July 20th, 2019

# Interactive Visualization of High Dimensional Single Cell Data
Clustergrammer-GL is primarily being built as a dependency of [Clustergrammer2](https://github.com/ismms-himc/clustergrammer2), a single-cell data analysis toolkit. However, we are developing Clustergrammer-GL to be generalizable. We want Clustergrammer-GL to be useful for exploring datasets outside of biology (e.g. financial), embeddable into other contexts (e.g. custom web applications), and independent of a Python back-end (e.g. run clustering on JavaScript). 

# Single Cell Data Analysis
Since Clustergrammer-GL is primarily being developed to facilitate the analysis of single cell biological datasets, we are setting up certain default behaviors (e.g. row gene information lookup on mouseover). Additionally, we are setting up generalizable callback functions that will enable two-way communication to the Python kernel using the Jupyter Widget infrastructure. 

# Documentation
Please see Clustergrammer's full documentation to see how Clustergrammer-GL fits into the larger project, which includes:
* [Clustergrammer-JS](https://github.com/maayanlab/clustergrammer)
* [Clustergrammer-Web](https://github.com/maayanlab/clustergrammer-web)
* [Clustergrammer2](https://github.com/ismms-himc/clustergrammer2)
* [Clustergrammer-Widget](https://github.com/maayanlab/clustergrammer-widget)


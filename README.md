<!-- # clustergrammer -->
<!-- # ![clustergrammer_logo](img/clustergrammer_logo.png | width=100) -->


<img src='img/clustergrammer-gl_logo.png' alt="Clustergramer" width="350px" >

[![NPM](https://img.shields.io/npm/v/clustergrammer-gl.svg)](https://www.npmjs.com/package/clustergrammer-gl)
[![NPM](https://img.shields.io/npm/l/clustergrammer-gl.svg)](https://github.com/ismms-himc/clustergrammer-gl/blob/master/LICENSE)

The Clustergrammer-GL repo contains the *in-development* WebGL/[regl](http://regl.party/) version of [Clustergrammer](https://github.com/MaayanLab/clustergrammer). See [live example](https://ismms-himc.github.io/clustergrammer-gl/).

# Using Clustergrammer-GL within Clustergrammer2
Clustergrammer-GL is being used by the Jupyter Widget [Clustergrammer2](https://github.com/ismms-himc/clustergrammer2). Please see examples below on using this widget.


### Basic Example of Running Clustergrammer2 on MyBinder

[![badge](https://img.shields.io/badge/launch-1.0_Running_Clustergrammer2-579ACA.svg?logo=data:image/png;base64,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)](https://mybinder.org/v2/gh/ismms-himc/clustergrammer2-notebooks/master?filepath=notebooks%2F1.0_Running_Clustergrammer2.ipynb) [![Nbviewer](https://github.com/jupyter/design/blob/master/logos/Badges/nbviewer_badge.svg)](https://nbviewer.jupyter.org/github/ismms-himc/clustergrammer2-notebooks/blob/master/notebooks/1.0_Running_Clustergrammer2.ipynb)

[![Running Clustergrammer2](http://img.youtube.com/vi/UgO5LLvcfB0/0.jpg)](http://www.youtube.com/watch?v=UgO5LLvcfB0)

The above notebook shows how Clustergrammer2 can be used to load a small dataset and visualize a large random DataFrame. By running the notebook on MyBinder using [Jupyter Lab](https://mybinder.org/v2/gh/ismms-himc/clustergrammer2_examples/master?urlpath=lab) it can also be used to visualize a user uploaded dataset. Please see the video tutorial above for more information.

For additional examples and tutorials please see:

* [Case Studies and Tutorials](https://clustergrammer.readthedocs.io/case_studies.html)
* [Clustergrammer2-Notebooks](https://github.com/ismms-himc/clustergrammer2-notebooks) GitHub repository


### 2,700 PBMC scRNA-seq
[![badge](https://img.shields.io/badge/launch-3.0_2700_PBMC_scRNAseq-579ACA.svg?logo=data:image/png;base64,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)](https://mybinder.org/v2/gh/ismms-himc/clustergrammer2-notebooks/master?filepath=notebooks%2F3.0_2700_PBMC_scRNA-seq.ipynb) [![Nbviewer](https://github.com/jupyter/design/blob/master/logos/Badges/nbviewer_badge.svg)](https://nbviewer.jupyter.org/github/ismms-himc/clustergrammer2-notebooks/blob/master/notebooks/3.0_2700_PBMC_scRNA-seq.ipynb?flush_cache=true)

[![2,700 PBMC scRNA-seq](http://img.youtube.com/vi/BEPspcC7vIY/0.jpg)](http://www.youtube.com/watch?v=BEPspcC7vIY)

Single cell RNA-seq (scRNA-seq) is a powerful method to interrogate gene expression across thousands of single cells. This method produces thousands of measurements (single cells) across thousands of dimensions (genes). This notebook uses Clustergrammer2 to interactively explore an example dataset measuring the gene expression of 2,700 PBMCs obtained from [10X Genomics](https://www.10xgenomics.com/resources/datasets/). Bulk gene expression signatures of cell types from [CIBERSORT](https://cibersort.stanford.edu/) were used to obtain a tentative cell type for each cell. Please see the video tutorial above for more information.

## Bundling

We're using a local version of packd to make a bundle of Clustergrammer-GL:

```
➜  packd git:(master) npm start

> packd@2.8.0 start /Users/nickfernandez/Documents/packd
> node server

packd debug started at Sat, 23 May 2020 17:15:21 GMT
listening on localhost:9000
packd info ::1 - - [Sat, 23 May 2020 17:15:30 GMT] "GET / HTTP/1.1"
packd info ::1 - - [Sat, 23 May 2020 17:15:41 GMT] "GET /clustergrammer-gl HTTP/1.1"
packd info ::1 - - [Sat, 23 May 2020 17:15:41 GMT] "GET /clustergrammer-gl@0.15.1 HTTP/1.1"
packd info [clustergrammer-gl] requested package
packd info [clustergrammer-gl] is not cached
packd info [clustergrammer-gl] fetching https://registry.npmjs.org/clustergrammer-gl/-/clustergrammer-gl-0.15.1.tgz
packd info [clustergrammer-gl] extracting to /Users/nickfernandez/Documents/packd/.tmp/ae4601021098ba82a59ab5c71569d10fa8897211/package
packd info [clustergrammer-gl] running  /Users/nickfernandez/Documents/packd/node_modules/.bin/npm install --production
packd info [clustergrammer-gl] added 168 packages from 123 contributors and audited 871 packages in 8.022s
packd info [clustergrammer-gl] found 3 vulnerabilities (2 low, 1 high)
packd info [clustergrammer-gl]   run `npm audit fix` to fix them, or `npm audit` for details
packd info [clustergrammer-gl]
packd info [clustergrammer-gl] npm WARN deprecated fsevents@1.2.13: fsevents 1 will break on node v14+ and could be using insecure binaries. Upgrade to fsevents 2.
packd info [clustergrammer-gl] npm WARN deprecated core-js@2.6.11: core-js@<3 is no longer maintained and not recommended for usage due to the number of issues. Please, upgrade your dependencies to the actual version of core-js@3.
packd info [clustergrammer-gl] npm notice created a lockfile as package-lock.json. You should commit this file.
packd info [clustergrammer-gl] npm WARN browser-sync-webpack-plugin@1.2.0 requires a peer of webpack@^1 || ^2 || ^3 but none is installed. You must install peer dependencies yourself.
packd info [clustergrammer-gl] npm WARN babel-loader@6.4.1 requires a peer of webpack@1 || 2 || ^2.1.0-beta || ^2.2.0-rc but none is installed. You must install peer dependencies yourself.
packd info [clustergrammer-gl]
packd info [clustergrammer-gl]
packd info [clustergrammer-gl] No ES2015 module found, using Browserify
packd info [clustergrammer-gl] bundled using Browserify
packd info [clustergrammer-gl] minifying
packd info [clustergrammer-gl] serving 266469 bytes

```

This was discussed on the Observable discussion board (https://talk.observablehq.com/t/help-with-reactive-updates-from-custom-library/2907/11) - and we followed the instructions from: https://github.com/Rich-Harris/packd#hosting-an-instance.

## Licensing
Clustergrammer-GL is being developed by the [Human Immune Monitoring Center](https://icahn.mssm.edu/research/human-immune-monitoring-center) and [Ma'ayan lab](http://labs.icahn.mssm.edu/maayanlab/) at the [Icahn School of Medicine at Mount Sinai](http://icahn.mssm.edu/). More information about Clustergrammer's license can be found in [Clustergrammer's Documentation](https://clustergrammer.readthedocs.io/license.html).

Please [contact us](http://clustergrammer.readthedocs.io/#funding-and-contact) for support, licensing questions, comments, and suggestions.

## Releasing
- Update versions in package.json
- Update version in main.js
- Set webpack to make all builds
- Run npm publish.

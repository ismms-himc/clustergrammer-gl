# Developing Clustergrammer-GL

Start by running 

`npm install` 

at the base directory to install dependencies. 

Run 

`webpack --watch` 

to get live updates to the `clustergrammer-gl.js` file.

# Releasing a new version
Do the following steps when releasing a new version:

* Update versions in package.json
* Update version in main.js
* Set webpack to make all builds
* Run `npm publish`

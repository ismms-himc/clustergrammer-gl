This is the output from running packd to make an Observable HQ compatible module.

```
➜  packd git:(master) npm start

> packd@2.8.0 start /Users/nickfernandez/Documents/packd
> node server

packd debug started at Mon, 27 Apr 2020 14:38:56 GMT
listening on localhost:9000
packd info ::1 - - [Mon, 27 Apr 2020 14:39:05 GMT] "GET / HTTP/1.1"
packd info ::1 - - [Mon, 27 Apr 2020 14:39:11 GMT] "GET /clustergrammer-gl HTTP/1.1"
packd info ::1 - - [Mon, 27 Apr 2020 14:39:12 GMT] "GET /clustergrammer-gl@0.11.10 HTTP/1.1"
packd info [clustergrammer-gl] requested package
packd info [clustergrammer-gl] is not cached
packd info [clustergrammer-gl] fetching https://registry.npmjs.org/clustergrammer-gl/-/clustergrammer-gl-0.11.10.tgz
packd info [clustergrammer-gl] extracting to /Users/nickfernandez/Documents/packd/.tmp/0b553201499e43b9ae86fe86ae405f4d04a67bf8/package
packd info [clustergrammer-gl] running  /Users/nickfernandez/Documents/packd/node_modules/.bin/npm install --production
packd info [clustergrammer-gl] added 168 packages from 123 contributors and audited 9612 packages in 13.618s
packd info [clustergrammer-gl] found 0 vulnerabilities
packd info [clustergrammer-gl]
packd info [clustergrammer-gl]
packd info [clustergrammer-gl] npm WARN deprecated core-js@2.6.11: core-js@<3 is no longer maintained and not recommended for usage due to the number of issues. Please, upgrade your dependencies to the actual version of core-js@3.
packd info [clustergrammer-gl] npm WARN deprecated fsevents@1.2.12: fsevents 1 will break on node v14+ and could be using insecure binaries. Upgrade to fsevents 2.
packd info [clustergrammer-gl] npm notice created a lockfile as package-lock.json. You should commit this file.
packd info [clustergrammer-gl] npm WARN browser-sync-webpack-plugin@1.2.0 requires a peer of webpack@^1 || ^2 || ^3 but none is installed. You must install peer dependencies yourself.
packd info [clustergrammer-gl] npm WARN babel-loader@6.4.1 requires a peer of webpack@1 || 2 || ^2.1.0-beta || ^2.2.0-rc but none is installed. You must install peer dependencies yourself.
packd info [clustergrammer-gl]
packd info [clustergrammer-gl]
packd info [clustergrammer-gl] No ES2015 module found, using Browserify
packd info [clustergrammer-gl] bundled using Browserify
packd info [clustergrammer-gl] minifying
packd info [clustergrammer-gl] serving 235772 bytes


```

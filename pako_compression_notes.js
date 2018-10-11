// http://jsfiddle.net/9yH7M/1/
// https://stackoverflow.com/questions/14620769/decompress-gzip-and-zlib-string-in-javascript

// parsing as json
// https://stackoverflow.com/questions/37225035/serialize-in-json-a-base64-encoded-data

// Get some base64 encoded binary data from the server. Imagine we got this:
var b64Data     = 'H4sIAAAAAAAAAwXB2w0AEBAEwFbWl2Y0IW4jQmziPNo3k6TuGK0Tj/ESVRs6yzkuHRnGIqPB92qzhg8yp62UMAAAAA==';

var b64Data = 'H4sIAKuMv1sC/6tWKkktLlGyUlAqzs9NLcnIzEtXhAKlWgAD8SwZHQAAAA=='

// Decode base64 (convert ascii to binary)
var strData     = atob(b64Data);

console.log(strData)

// Convert binary string to character-number array
var charData    = strData.split('').map(function(x){return x.charCodeAt(0);});

console.log(charData)

// Turn number array into byte-array
var binData     = new Uint8Array(charData);

console.log(binData)

// Pako magic
var data        = pako.inflate(binData);

console.log(data)

// Convert gunzipped byteArray back to ascii string:
var strData     = String.fromCharCode.apply(null, new Uint16Array(data));

console.log(strData)

// Output to console
alert(strData);
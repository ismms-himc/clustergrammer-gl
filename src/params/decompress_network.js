module.exports = function decompress_network(network){

  // decompress if necessary
  // https://stackoverflow.com/questions/8936984/uint8array-to-string-in-javascript
  var network;
  if (typeof (args.network) === 'string'){
    // Decode base64 (convert ascii to binary)
    var comp_net = JSON.parse(args.network).compressed;
    strData     = atob(comp_net);
    // Convert binary string to character-number array
    var charData    = strData.split('').map(function(x){return x.charCodeAt(0);});
    // Turn number array into byte-array
    var binData     = new Uint8Array(charData);
    // Pako magic
    var data        = pako.inflate(binData);
    var strData = new TextDecoder().decode(data)
    var uncomp_net = JSON.parse(strData)
    network = uncomp_net;
  } else {
    network = args.network;
  }

  return network
};

/*!
 * watchmouse.js
 * Copyright(c) 2011 Bernardo Gomez Palacio <bernardo@hashgo.com>
 * MIT Licensed
 */

/**
 * Library version.
 */

exports.version = 'v0.0.1-1-alpha';


var rest = require('restler');
var sys = require('util');

/** */
var WatchmouseFolder = function(wmCurrent, wmFolder, opts) {
   opts = opts || { }
   opt_apiBaseUrl = opts.apiBaseUrl || 'http://api.io.watchmouse.com/' 

   this.apiBaseUrl = opt_apiBaseUrl;
   this.wmCurrent = wmCurrent;
   this.wmFolder  = wmFolder;
};


WatchmouseFolder.prototype.endpoints = function(event, callback) {

  rest.get(this.apiBaseUrl + "/synth/current/" + this.wmCurrent + "/folder/" + this.wmFolder, {
    parser: rest.parsers.json
  }).on('success', function(data) {
    var respBody = {
      "code": data.code,
      "endpoints": [ ]
    };
    var endpoints = data.result;
    if (endpoints && endpoints.length > 0) {
      
      respBody.endpoints = new Array(endpoints.length);
      
      for (i = 0; i < endpoints.length; i++) {
        var endpoint = endpoints[i];
        respBody.endpoints[i] = {
            "name" : endpoint.info.name,
            "host" : endpoint.info.host,
            "status" : {
              "status": endpoint.cur.status,
              "upstatus": endpoint.cur.upstatus,
              "perfstatus": endpoint.cur.perfstatus,
              "score": endpoint.cur.score,
              "downtime": endpoint.cur.downtime
            }
        };
      }
    }
    callback(respBody, undefined);
    
  }).on('error', function(error, response) {
    callback(undefined, error);
    
  });
};

module.exports = WatchmouseFolder;


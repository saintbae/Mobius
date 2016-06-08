/**
 * Copyright (c) 2015, OCEAN
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * 3. The name of the author may not be used to endorse or promote products derived from this software without specific prior written permission.
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @file
 * @copyright KETI Korea 2015, OCEAN
 * @author Il Yeup Ahn [iyahn@keti.re.kr]
 */

var http = require('http');
var util = require('util');
var xml2js = require('xml2js');
var xmlbuilder = require('xmlbuilder');
var fs = require('fs');
var url = require('url');
var db = require('./db_action');

var merge = require('merge');

_this = this;

//
// function self_create_remoteCSE(cb_jsonObj) {
//     var node = {};
//     if(defaultbodytype == 'xml') {
//         if (defaultnmtype == 'long') {
//             node[0] = xmlbuilder.create('m2m:remoteCSE', {version: '1.0', encoding: 'UTF-8', standalone: true},
//                 {pubID: null, sysID: null}, {allowSurrogateChars: false, skipNullAttributes: false, headless: false, ignoreDecorators: false, stringify: {}}
//             ).att('xmlns:m2m', 'http://www.onem2m.org/xml/protocols').att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance').att('resourceName', cb_jsonObj["m2m:CSEBase"]['resourceName']);
//             node[0].ele('cseType', cb_jsonObj['m2m:CSEBase']['cseType']);
//             node[0].ele('CSE-ID', cb_jsonObj['m2m:CSEBase']['CSE-ID']);
//             node[0].ele('pointOfAccess', cb_jsonObj['m2m:CSEBase']['pointOfAccess']);
//             node[0].ele('requestReachability', 'true');
//             node[0].ele('CSEBase', cb_jsonObj['m2m:CSEBase']['resourceName']);
//             var poa_arr = cb_jsonObj['m2m:CSEBase']['pointOfAccess'].split(' ');
//         }
//         else { // defaultnmtype == 'short'
//             node[0] = xmlbuilder.create('m2m:csr', {version: '1.0', encoding: 'UTF-8', standalone: true},
//                 {pubID: null, sysID: null}, {allowSurrogateChars: false, skipNullAttributes: false, headless: false, ignoreDecorators: false, stringify: {}}
//             ).att('xmlns:m2m', 'http://www.onem2m.org/xml/protocols').att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance').att('rn', cb_jsonObj["m2m:cb"]['rn']);
//             node[0].ele('cst', cb_jsonObj['m2m:cb']['cst']);
//             node[0].ele('csi', cb_jsonObj['m2m:cb']['csi']);
//             node[0].ele('poa', cb_jsonObj['m2m:cb']['poa']);
//             node[0].ele('rr', 'true');
//             node[0].ele('cb', cb_jsonObj['m2m:cb']['rn']);
//             poa_arr = cb_jsonObj['m2m:cb']['poa'].split(' ');
//         }
//
//         // make comment because already know for information of IN-CSE
//         //for (var i = 0; i < poa_arr.length; i++) {
//         //    if (url.parse(poa_arr[i]).protocol == 'http:') {
//         //        usecbhost = url.parse(poa_arr[i]).hostname;
//         //        usecbhostport = url.parse(poa_arr[i]).port;
//         //    }
//         //    else if (url.parse(poa_arr[i]).protocol == 'mqtt:') {
//         //        usecsemqtt = url.parse(poa_arr[i]).hostname;
//         //
//         //        pxymqtt.connect(usecsemqtt);
//         //    }
//         //}
//
//         var bodyString = node[0].end({pretty: true, indent: '  ', newline: '\n'}).toString();
//
//         var options = {
//             hostname: 'localhost',
//             port: usecsebaseport,
//             path: '/' + usecsebase,
//             method: 'post',
//             headers: {
//                 'X-M2M-RI': '12345',
//                 'Accept': 'application/'+defaultbodytype,
//                 'X-M2M-Origin': 'Origin',
//                 'Content-Type': 'application/vnd.onem2m-res+'+defaultbodytype+'; ty=16'
//             }
//         };
//
//         var req = http.request(options, function (res) {
//             if(res.statusCode == 200) {
//                 NOPRINT == 'true' ? NOPRINT = 'true' : console.log('success to MN-CSE. csetype is MN-CSE');
//             }
//         });
//
//         req.on('error', function (e) {
//             NOPRINT == 'true' ? NOPRINT = 'true' : console.log('problem with request: ' + e.message);
//         });
//
//         // write data to request body
//         req.write(bodyString);
//         req.end();
//     }
//     else { // defaultbodytype == 'json'
//         if (defaultnmtype == 'long') {
//             node['m2m:remoteCSE'] = {};
//             node['m2m:remoteCSE'] = cb_jsonObj['m2m:CSEBase'];
//             node['m2m:remoteCSE']['requestReachability'] = 'true';
//             node['m2m:remoteCSE']['CSEBase'] = cb_jsonObj['m2m:CSEBase']['resourceName'];
//             delete node['m2m:remoteCSE'].resourceID;
//             delete node['m2m:remoteCSE'].lastModifiedTime;
//             delete node['m2m:remoteCSE'].creationTime;
//             delete node['m2m:remoteCSE'].resourceType;
//         }
//         else { // defaultnmtype == 'short'
//             node['m2m:csr'] = {};
//             node['m2m:csr'] = cb_jsonObj['m2m:cb'];
//             node['m2m:csr']['rr'] = 'true';
//             node['m2m:csr']['cb'] = cb_jsonObj['m2m:cb']['rn'];
//             delete node['m2m:csr'].ri;
//             delete node['m2m:csr'].lt;
//             delete node['m2m:csr'].ct;
//             delete node['m2m:csr'].ty;
//         }
//
//         bodyString = JSON.stringify(node);
//
//         options = {
//             hostname: 'localhost',
//             port: usecsebaseport,
//             path: '/' + usecsebase,
//             method: 'post',
//             headers: {
//                 'X-M2M-RI': '12345',
//                 'Accept': 'application/json',
//                 'X-M2M-Origin': 'Origin',
//                 'Content-Type': 'application/vnd.onem2m-res+json; ty=16'
//             }
//         };
//
//         req = http.request(options, function (res) {
//             var fullBody = '';
//             res.on('data', function(chunk) {
//                 fullBody += chunk.toString();
//             });
//
//             res.on('end', function () {
//                 if (res.statusCode == 200 || res.statusCode == 201 || res.statusCode == 403 || res.statusCode == 409) {
//                     console.log('success to MN-CSE. csetype is MN-CSE');
//                 }
//             });
//         });
//
//         req.on('error', function (e) {
//             NOPRINT == 'true' ? NOPRINT = 'true' : console.log('problem with request: ' + e.message);
//         });
//
//         // write data to request body
//         req.write(bodyString);
//         req.end();
//     }
// }

function retrieve_CSEBase(cbname, cbhost, cbhostport, callback) {
    var ri = '/' + cbname;
    var options = {
        hostname: cbhost,
        port: cbhostport,
        path: ri,
        method: 'get',
        headers: {
            'X-M2M-RI': '12345',
            'Accept': 'application/'+defaultbodytype,
            'X-M2M-Origin': 'Origin',
            'nmtype': defaultnmtype
        }
    };

    var req = http.request(options, function (res) {
        var fullBody = '';
        res.on('data', function(chunk) {
            fullBody += chunk.toString();
        });

        res.on('end', function () {
            if (res.statusCode == 200) {
                var jsonObj = {};
                if (defaultbodytype == 'xml') {
                    var parser = new xml2js.Parser({explicitArray: false});
                    parser.parseString(fullBody, function (err, result) {
                        if (err) {
                            console.log('[retrieve_CSEBase] fail to set csetype to MN-CSE. csetype is IN-CSE');
                        }
                        else {
                            result['m2m:cb'].rn = result['m2m:cb']['$'].rn;
                            delete result['m2m:cb']['$'];

                            if(result['m2m:cb'].poa) {
                                result['m2m:cb'].poa = result['m2m:cb'].poa.split(' ');
                            }

                            if(result['m2m:cb'].srt) {
                                result['m2m:cb'].srt = result['m2m:cb'].srt.split(' ');
                            }

                            if(result['m2m:cb'].lbl) {
                                result['m2m:cb'].lbl = result['m2m:cb'].lbl.split(' ');
                            }

                            if(result['m2m:cb'].acpi) {
                                result['m2m:cb'].acpi = result['m2m:cb'].acpi.split(' ');
                            }

                            jsonObj.csr = {};
                            jsonObj.csr = result['m2m:cb'];
                        }
                    });
                }
                else { // json
                    jsonObj = JSON.parse(fullBody);
                }

                for(var idx in jsonObj.csr) {
                    if(jsonObj.csr[idx] == null || jsonObj.csr[idx] == '' || jsonObj.csr[idx] == 'undefined' || jsonObj.csr[idx] == '[]') {
                        delete jsonObj.csr[idx];
                    }
                }

                delete jsonObj.csr.ty;
                delete jsonObj.csr.ri;
                delete jsonObj.csr.ct;
                delete jsonObj.csr.lt;
                delete jsonObj.csr.st;

                jsonObj.csr.cst = '5';
                jsonObj.csr.rr = 'true';
                jsonObj.csr.cb = jsonObj.csr.rn;

                callback(res.statusCode, jsonObj);
            }
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        callback('0', {});
    });

    // write data to request body
    req.write('');
    req.end();
}

function create_remoteCSE(cbname, cbhost, cbhostport, body_Obj, callback) {
    var rootnm = 'csr';
    if (defaultnmtype == 'long') {
        for (var index in body_Obj[rootnm]) {
            if (index == "$") {
                delete body_Obj['m2m:' + rsrcShortName][index];
                continue;
            }
            else if (index == 'enc') {
                body_Obj[rootnm][attrLname[index]] = {};
                body_Obj[rootnm][attrLname[index]][attrLname['net']] = body_Obj[rootnm][index]['net'];
            }
            else if (index == 'pv' || index == 'pvs') {
                body_Obj[rootnm][attrLname[index]] = {};
                for (var sub_attr in body_Obj[rootnm][index]) {
                    body_Obj[rootnm][attrLname[index]][attrLname[sub_attr]] = [];
                    for (var sub_attr2 in body_Obj[rootnm][index][sub_attr]) {
                        body_Obj[rootnm][attrLname[index]][attrLname[sub_attr]][sub_attr2] = {};
                        for (var sub_attr3 in body_Obj[rootnm][index][sub_attr][sub_attr2]) {
                            body_Obj[rootnm][attrLname[index]][attrLname[sub_attr]][sub_attr2][attrLname[sub_attr3]] = body_Obj[rootnm][index][sub_attr][sub_attr2][sub_attr3];
                        }
                    }
                }
            }
            else {
                body_Obj[rootnm][attrLname[index]] = body_Obj[rootnm][index];
            }
            delete body_Obj[rootnm][index];
        }
        body_Obj['m2m:' + rsrcLname[rootnm]] = body_Obj[rootnm];
        delete body_Obj[rootnm];
        rootnm = rsrcLname[rootnm];
    }
    else {
        body_Obj['m2m:' + rootnm] = body_Obj[rootnm];
        delete body_Obj[Object.keys(body_Obj)[0]];
    }

    var bodyString = JSON.stringify(body_Obj);

    if (defaultbodytype == 'xml') {
        var xml = xmlbuilder.create('m2m:' + rootnm, {version: '1.0', encoding: 'UTF-8', standalone: true},
            {pubID: null, sysID: null}, {allowSurrogateChars: false, skipNullAttributes: false, headless: false, ignoreDecorators: false, stringify: {}}
        ).att('xmlns:m2m', 'http://www.onem2m.org/xml/protocols').att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');

        for (index in body_Obj) {
            for (var attr in body_Obj[index]) {
                if (attr == 'resourceName' || attr == 'rn') {
                    xml.att(attr, body_Obj[index][attr]);
                }
                else if (attr == 'accessControlPolicyIDs' || attr == 'acpi') {
                    xml.ele(attr, body_Obj[index][attr].toString().replace(/,/g, ' '));
                }
                else if (attr == 'labels' || attr == 'lbl') {
                    xml.ele(attr, body_Obj[index][attr].toString().replace(/,/g, ' '));
                }
                else if (attr == 'supportedResourceType' || attr == 'srt') {
                    xml.ele(attr, body_Obj[index][attr].toString().replace(/,/g, ' '));
                }
                else if (attr == 'pointOfAccess' || attr == 'poa') {
                    xml.ele(attr, body_Obj[index][attr].toString().replace(/,/g, ' '));
                }
                else {
                    xml.ele(attr, body_Obj[index][attr]);
                }
            }
        }
        bodyString = xml.end({pretty: false, indent: '  ', newline: '\n'}).toString();
    }

    var ri = '/' + cbname;
    var options = {
        hostname: cbhost,
        port: cbhostport,
        path: ri,
        method: 'post',
        headers: {
            'X-M2M-RI': 'alkdflka',
            'Accept': 'application/'+defaultbodytype,
            'X-M2M-Origin': '1000',
            'Content-Type': 'application/'+defaultbodytype+';ty=16',
            'nmtype': defaultnmtype
        }
    };

    var req = http.request(options, function (res) {
        var fullBody = '';
        res.on('data', function(chunk) {
            fullBody += chunk.toString();
        });
        res.on('end', function() {
            callback(res.statusCode);
        });
    });

    req.on('error', function (e) {
        NOPRINT == 'true' ? NOPRINT = 'true' : console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write(bodyString);
    req.end();
}

exports.build_mn = function(ri, callback) {
    // check remotecse if parent cse exist
    var rspObj = {};
    var sql = util.format("select * from lookup where ri = \'%s\'", ri);
    db.getResult(sql, '', function (err, results_comm) {
        if(!err) {
            if (results_comm.length == 1) {
                sql = util.format("select * from cb where ri = \'%s\'", ri);
                db.getResult(sql, '', function (err, results_cb) {
                    if(!err) {
                        if (results_cb.length == 1) {
                            rspObj.csr = {};
                            rspObj.csr = merge(results_comm[0], results_cb[0]);

                            for(var idx in rspObj.csr) {
                                if(rspObj.csr[idx] == null || rspObj.csr[idx] == '' || rspObj.csr[idx] == 'undefined' || rspObj.csr[idx] == '[]') {
                                    delete rspObj.csr[idx];
                                }
                            }

                            delete rspObj.csr.ty;
                            delete rspObj.csr.ri;
                            delete rspObj.csr.ct;
                            delete rspObj.csr.lt;
                            delete rspObj.csr.st;

                            rspObj.csr.cst = '5';
                            rspObj.csr.rr = 'true';
                            rspObj.csr.cb = rspObj.csr.rn;

                            if (rspObj.csr.poa) {
                                rspObj.csr.poa = JSON.parse(rspObj.csr.poa);
                            }

                            if (rspObj.csr.lbl) {
                                rspObj.csr.lbl = JSON.parse(rspObj.csr.lbl);
                            }

                            if (rspObj.csr.acpi) {
                                rspObj.csr.acpi = JSON.parse(rspObj.csr.acpi);
                            }

                            if (rspObj.csr.srt) {
                                rspObj.csr.srt = JSON.parse(rspObj.csr.srt);
                            }

                            create_remoteCSE(usecbname, usecbhost, usecbhostport, rspObj, function (rsc) {
                                if (rsc == 200 || rsc == 201 || rsc == 403 || rsc == 409) {
                                    retrieve_CSEBase(usecbname, usecbhost, usecbhostport, function (rsc, jsonObj) {
                                        if (rsc == 200 || rsc == 201 || rsc == 403 || rsc == 409) {
                                            create_remoteCSE(usecsebase, 'localhost', usecsebaseport, jsonObj, function (rsc) {
                                                if (rsc == 200 || rsc == 201 || rsc == 403 || rsc == 409) {
                                                    rspObj = {};
                                                    rspObj.rsc = '2000';
                                                    rspObj.ri = ri;
                                                    rspObj.sts = "mn-cse setting success";
                                                    callback(rspObj);
                                                }
                                                else {
                                                    rspObj.rsc = '5000';
                                                    rspObj.ri = ri;
                                                    rspObj.sts = "mn-cse setting fail";
                                                    callback(rspObj);
                                                }
                                            });
                                        }
                                    });
                                }
                                else {
                                    console.log('MN : response status code error for create remoteCSE : ' + res.statusCode);
                                }
                            });
                        }
                    }
                    else {
                        rspObj.rsc = '5000';
                        rspObj.ri = ri;
                        rspObj.sts = results_cb.code;
                        callback(rspObj);
                    }
                });
            }
            else {
                rspObj.rsc = '2001';
                rspObj.ri = ri;
                rspObj.sts = '';
                callback(rspObj);
            }
        }
        else {
            rspObj.rsc = '5000';
            rspObj.ri = ri;
            rspObj.sts = results_comm.code;
            callback(rspObj);
        }
    });
};

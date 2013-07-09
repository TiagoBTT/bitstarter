#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2

   cmd line samples:
   -u http://pure-taiga-1588.herokuapp.com/ -c checks.json
   -f index.html -c checks.json
*/

var fs = require('fs');
var rest = require('restler');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://pure-taiga-1588.herokuapp.com/";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    var aFile = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = aFile(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

// downloads html from the internet
// callback is called with two arguments: err, html
// where err is null if there is no error
function download(url, callback) {
    var resp = rest.get(url);
    resp.on('complete', function(result) {
        if (result instanceof Error) {
            // callback(result);
            console.log('Error: ' + result.message);
            return;
        }
        callback(null, result);
    });
}

// checks html
function checkHtml(html, checks) {
    var a = cheerio.load(html);
    var out = {};
    for(var ii in checks) {
        var present = a(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
}

// this function loads checks & checks html
    function check(err, html) {
        if (err) {
            console.log('Error getting html: ' + err);
            process.exit(1);
        }
        var checks = loadChecks(program.checks);
        var checkJson = checkHtml(html, checks);
        var outJson = JSON.stringify(checkJson, null, 4);
        console.log(outJson);
    }

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url>','Where to retrieve index.html',URL_DEFAULT)
        .parse(process.argv);

     if (program.url) {
        // download the provided url and then check the html
        download(program.url, check);
    } else if (program.file) {
        // load html from a file and then check it
        fs.readFile(program.file, check);
    }
    //console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
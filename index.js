"use strict";
exports.__esModule = true;
var fs = require("fs");
var covDiff = function () {
    var fileA = process.argv[2];
    var fileB = process.argv[3];
    var outputFolder = process.argv[4];
    var jsonA = JSON.parse(fs.readFileSync(fileA, "utf8"));
    var jsonB = JSON.parse(fs.readFileSync(fileB, "utf8"));
    var codeFiles = Object.keys(jsonA);
    var _loop_1 = function (i) {
        console.log(codeFiles[i]);
        var linesA = Object.values(jsonA[codeFiles[i]].s);
        var linesB = Object.values(jsonB[codeFiles[i]].s);
        var result = [];
        for (var i_1 = 0; i_1 < linesA.length; i_1++) {
            if (linesA[i_1] > 0) {
                if (linesB[i_1] > 0) {
                    result[i_1] = "XX";
                }
                else {
                    result[i_1] = "X0";
                }
            }
            else {
                if (linesB[i_1] > 0) {
                    result[i_1] = "0X";
                }
                else {
                    result[i_1] = "00";
                }
            }
        }
        var jsonACode = jsonA[codeFiles[i]];
        var codePath = jsonACode.path;
        var codeLines = fs.readFileSync(codePath, 'utf8').split(/\r?\n/);
        var output = [];
        for (var i_2 = 0; i_2 < codeLines.length; i_2++) {
            output[i_2] = "  " + codeLines[i_2];
            // const trimmedLine = codeLines[i].replace(/\s/g, '')
            // if (codeLines[i].length !== 0 && trimmedLine.length !== 1 && !trimmedLine.startsWith("//")) {
            // } else {
            //     output[i] = "  " + codeLines[i];
            // }
        }
        var counter = 0;
        var statementMap = jsonACode.statementMap;
        while (counter < result.length) {
            for (var j = statementMap[counter].start.line - 1; j < statementMap[counter].end.line; j++) {
                output[j] = result[counter] + codeLines[j];
            }
            counter++;
        }
        var file = fs.createWriteStream(outputFolder + "/output_" + codePath.replace(/\//g, ''));
        file.on('error', function (err) {
            console.log(err);
        });
        output.forEach(function (v) {
            file.write(v + '\n');
        });
        file.end();
    };
    for (var i = 0; i < codeFiles.length; i++) {
        _loop_1(i);
    }
};
covDiff();

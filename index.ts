import * as fs from 'fs';

const covDiff = () => {
    const fileA = process.argv[2];
    const fileB = process.argv[3];
    const outputFolder = process.argv[4];

    const jsonA = JSON.parse(fs.readFileSync(fileA, `utf8`));
    const jsonB = JSON.parse(fs.readFileSync(fileB, `utf8`));

    const codeFiles = Object.keys(jsonA)

    for (let i = 0; i < codeFiles.length; i++) {

        console.log(codeFiles[i])

        const linesA = Object.values(jsonA[codeFiles[i]].s);
        const linesB = Object.values(jsonB[codeFiles[i]].s);

        let result = [];

        for (let i = 0; i < linesA.length; i++) {
            if (linesA[i] > 0) {
                if (linesB[i] > 0) {
                    result[i] = "XX"
                } else {
                    result[i] = "X0"
                }
            } else {
                if (linesB[i] > 0) {
                    result[i] = "0X"
                } else {
                    result[i] = "00"
                }
            }
        }

        const jsonACode = jsonA[codeFiles[i]];

        const codePath = jsonACode.path;

        const codeLines = fs.readFileSync(codePath, 'utf8').split(/\r?\n/);
        const output = [];

        for (let i = 0; i < codeLines.length; i++) {
            output[i] = "  " + codeLines[i];
            // const trimmedLine = codeLines[i].replace(/\s/g, '')
            // if (codeLines[i].length !== 0 && trimmedLine.length !== 1 && !trimmedLine.startsWith("//")) {
            // } else {
            //     output[i] = "  " + codeLines[i];
            // }
        }
        let counter = 0;
        const statementMap = jsonACode.statementMap;

        while (counter < result.length) {
            for (let j = statementMap[counter].start.line - 1; j < statementMap[counter].end.line; j++) {
                output[j] = result[counter] + codeLines[j];
            }
            counter++;
        }


        let file = fs.createWriteStream(`${outputFolder}/output_${codePath.replace(/\//g, '')}`);
        file.on('error', function (err) {
            console.log(err)
        });
        output.forEach((v) => {
            file.write(v + '\n');
        });
        file.end();
    }
}

covDiff();

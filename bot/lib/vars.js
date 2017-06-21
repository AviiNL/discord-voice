const fs       = require('fs');
const filename = `${__dirname}/../../database.json`;
let variables  = {};

if (fs.existsSync(filename)) {
    variables = require(filename);
}

const unique = (data) => {
    let a = data.concat();
    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) {
                a.splice(j--, 1);
            }
        }
    }

    return a;
};

const replaceAt = (string, index, length, replacement) => {
    return string.substr(0, index) + replacement + string.substr(index + length);
};

const think = (speech) => {

    let re = /\$(\w+)/g;
    let m;

    do {
        m = re.exec(speech);
        if (m) {

            if (variables.hasOwnProperty(m[1])) {
                speech = replaceAt(speech, m.index, m[0].length, variables[m[1]]);
            } else {
                speech = replaceAt(speech, m.index, m[0].length, "geen idee");
            }

        }
    } while (m);

    return speech;

};

const learn = (parameters) => {

    for (let i in parameters) {
        if (!parameters.hasOwnProperty(i)) {
            continue;
        }
        if (parameters[i].length === 0) {
            continue;
        }

        if (parameters[i] instanceof Array) {
            console.log(`${i} is a list, append it if it does not exist yet`);
            variables[i] = unique(variables[i].concat(parameters[i]));
        } else {
            variables[i] = parameters[i];
        }

        fs.writeFileSync(filename, JSON.stringify(variables));
    }
};

module.exports = {
    think: think,
    learn: learn
};
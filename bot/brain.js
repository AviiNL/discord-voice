const apiai = require('apiai');
const app   = apiai("8213cd394743475cb0cfb0ca8d9d8f00", {language: "nl"});
const fs    = require('fs');
const vars  = require('./lib/vars');

let variables = {
    'name': 'Ruben',
    'age':  2
};

// "Caution: engage brain before putting mouth in gear." - Ashleigh Brilliant quote
module.exports = (data, speaker) => {
    return new Promise((resolve, reject) => {
        let request = app.textRequest(data, {sessionId: `${speaker}-${new Date().getTime()}`});

        request.once('response', (response) => {

            let speech = response.result.fulfillment.speech;

            vars.learn(response.result.parameters);

            // search database first for a word
            speech = vars.think(speech);

            let neuron = response.result.action.substr(response.result.action.indexOf('.')+1);

            if(fs.existsSync(`${__dirname}/action/${neuron}.js`)) {
                speech = require(`${__dirname}/action/${neuron}.js`)(speech, response, {
                    input: {
                        data: data,
                        speaker: speaker
                    },
                });
            }

            console.log(response.result);
            if (response.result.action === 'input.unknown') {
                return reject(`${response.result.action}: ${data}`);
            }

            resolve(speech);
        });

        request.once('error', (error) => {
            reject(error);
        });

        request.end();
    });

};
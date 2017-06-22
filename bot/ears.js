const speech = require('@google-cloud/speech')();
delete require.cache[require.resolve('./lib/encoder')];
const Encoder = require('./lib/encoder');

const request = {
    config:          {
        encoding:        'LINEAR16',
        sampleRateHertz: 48000,
        languageCode:    'nl-NL',
    },
    singleUtterance: false,
    interimResults:  false, // If you want interim results, set this to true
};

module.exports = (stream) => {

    const encoder = new Encoder();

    return new Promise((resolve, reject) => {
        console.log("=== start ===");
        const recognizeStream = speech.createRecognizeStream(request)
            .on('error', e => reject(e))
            .on('data', (data) => {
                resolve(data.results);
            });

        stream.on('data', function(d) {
            console.log("Stream receiving data, writing to encoder transformer");
            encoder.write(d);
        });
        stream.on('end', () => {
            console.log('stream ended, ending encoder');
            encoder.end();
        });

        encoder.on('data', (encoder_data) => {
            console.log("Encoder received data, sending to recognizer");
            recognizeStream.write(encoder_data);
        });

        encoder.on('end', () => {
            console.log("Encoding ended, stopping recognizer");
            recognizeStream.end();
        });

        recognizeStream.on('end', () => {
            console.log("=== end ===");
        });

        console.log(stream);

    });

};
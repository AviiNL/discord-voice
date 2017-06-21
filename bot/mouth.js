const AWS    = require('aws-sdk');
const crypto = require('crypto');
const fs     = require('fs');

const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region:           'us-east-1'
});

module.exports = (text, voice) => {
    if (!voice) {
        voice = 'Ruben';
    }

    return new Promise((resolve, reject) => {

        let md5        = crypto.createHash('md5').update(`${voice}-${text}`).digest("hex");
        const filename = `${__dirname}/../tmp/${md5}.mp3`;

        if (fs.existsSync(filename)) {
            return resolve(filename);
        }

        Polly.synthesizeSpeech({
            'Text':         text,
            'OutputFormat': 'mp3',
            'VoiceId':      voice
        }, (err, data) => {
            if (err) {
                return reject(err);
            }
            if (data.AudioStream instanceof Buffer) {
                fs.writeFileSync(filename, data.AudioStream);
                resolve(filename);
            } else {
                reject("Not a buffer");
            }
        });

    });

};
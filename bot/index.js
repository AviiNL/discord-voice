const ears  = require('./ears');
const mouth = require('./mouth');
const brain = require('./brain');

class Bot {

    constructor(name, voice) {
        this.name  = name;
        this.voice = voice;
    }

    listen(stream, speaker) {

        let data = {};
        return new Promise((resolve, reject) => {
            ears(stream)
                .then((sentence) => {
                    return brain(sentence, speaker);
                })
                .then((response) => {
                    data.text = response;

                    // generate audio from response
                    return mouth(response, this.voice);
                })
                .then((response) => {
                    // send the filename back to discord
                    data.filename = response;
                    return data;
                })
                .then(data => resolve(data))
                .catch((err) => {
                    console.error(err);
                });
        });
    }

    getName() {
        return this.name;
    }

}

module.exports = Bot;
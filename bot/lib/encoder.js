const Stream  = require('stream');
const opus    = require('node-opus');
const encoder = new opus.OpusEncoder(48000, 1);

class Encoder extends Stream.Transform {

    constructor(options) {
        super(options);
    }

    _transform(chunk, encoding, next) {
        try {
            this.push(encoder.decode(chunk, 1920));
        } catch(e) {
            console.error(e);
        }
        console.log("Processing signals within the ears");
        next();
    }
}

module.exports = Encoder;

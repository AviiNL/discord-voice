const vars  = require('../lib/vars');

module.exports = (speech, response, request) => {
    console.log(speech);

    if(request.input.data.toLowerCase().indexOf('het is jouw verjaardag') !== -1) {
        console.log('IK BEN JARIG!');
        response.result.action = "input.other";
        // jarig
        let age = vars.think('$age');

        response.result.parameters.age = parseInt(age)+1;

        console.log(age);

        vars.learn(response.result.parameters);

        return 'Hoera!';
    }
};
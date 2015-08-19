var grunt = require('grunt');
var config = require('../lib/index.js');

exports.test = function(test) {
    test.expect(1);
    
    var input = JSON.stringify(config.main);
    var expected = grunt.file.read('test/expected/main.json');

    test.equal(input, expected, "Output doesn't match expected output.");
    
    test.done();
};
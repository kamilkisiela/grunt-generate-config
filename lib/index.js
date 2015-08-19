var grunt = require('grunt');

var settings = grunt.config.get().generateConfig;

var defaultDest = "";
if(settings.options && settings.options.dest) {
    defaultDest = grunt.config.process(settings.options.dest);
}

var config = {};

var dest;
for(var target in settings) {
    if(target !== 'options') {
        dest = settings[target].options && settings[target].options.dest ?
            grunt.config.process(settings[target].options.dest) : defaultDest;
        config[target] = grunt.file.readJSON(dest + target + '.json');
    }
}

module.exports = config;
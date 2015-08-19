var task = function(grunt) {

    var path = require('path');
    var url = require('url');
    var _ = require('lodash');
    var YAML = require('yamljs');

    var checkYAML = function(filePath) {
        // Remove nonexistent files.
        var extTest = /^ya?ml$/i;
        if (!grunt.file.exists(filePath)) {
            grunt.log.warn('Source file "' + filePath + '" not found.');
            return false;
        } else if (! extTest.test(path.extname(filePath).substr(1))) {
            grunt.log.warn('Source file "' + filePath + '" is not YAML file.');
            return false;
        } else {
            return true;
        }
    };

    function Binder () {
        var parameters = {};
        var dist = {};

        var checkFormat = function(p) {
            if(p && typeof p === 'object') {
                for(var i in p) {
                    if(typeof i !== 'string') {
                        throw new Error('Wrong parameters format (key is not string)');
                    }
                    if(typeof p[i] !== 'string' && typeof p[i] !== 'number') {
                        throw new Error('Wrong parameters format (value is not string or number)');
                    }
                }
            } else {
                throw new Error('Wrong parameters format');
            }

            return true;
        };

        this.setParametersFile = function(filePath){
            if(checkYAML(filePath)) {
                var p = grunt.file.readYAML(filePath);
                if(checkFormat(p)) {
                    parameters = p;
                }
            } else {
                throw new Error('Wrong parameters file format');
            }
        };

        this.setDistFile = function(filePath){
            var p = grunt.file.readYAML(filePath);
            if(checkFormat(p)) {
                dist = p;
            }
        };

        this.compare = function() {
            for(var key in dist) {
                if(!parameters[key]) {
                    throw new Error('Missing parameter "'+ key +'"');
                }
            }
        };

        this.compile = function(rawConfig) {
            for (var key in parameters) {
                var regex = new RegExp("\%" + key + "\%", "g");
                rawConfig = rawConfig.replace(regex, parameters[key]);
            }
            //return rawConfig;
            return YAML.parse(rawConfig);
        };
    };

    grunt.registerMultiTask("generateConfig", "", function() {
        var done = this.async();
        grunt.log.debug('Starting task "generateConfig"...');
        var options = this.options({
            dest: ""
        });
        options.target = this.target;

        this.files.forEach(function(file) {
            var dest = grunt.config.process(options.dest);
            var parameters = grunt.config.process(options.parameters);

            var binder = new Binder();
            binder.setParametersFile(parameters);
            binder.setDistFile(parameters + '.dist');
            binder.compare();

            grunt.log.debug('Handling output file "' + dest + options.target + '.json".');

            // Concatenate the source files.
            var config = {};
            var contentSources = file.src.filter(function(filePath) {
                grunt.log.debug('Using input file "' + filePath + '".');
                return checkYAML(filePath);
            }).map(	function(filePath) {
                return grunt.file.read(filePath);
            });

            for(var i in contentSources) {
                _.merge(config, binder.compile(contentSources[i]));
            }

            grunt.log.debug('Writing JSON...');
            grunt.file.write(dest + options.target+ '.json', JSON.stringify(config));
            grunt.log.debug('File "'+dest + options.target+ '.json" created.');
        });

        done();
    });
};

module.exports = task;
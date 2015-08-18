var YAML = require('yamljs');
var fs = require('fs');
var extend = require('extend');
var colog = require('colog');
var path = require('path');
var currentPath = path.resolve(path.dirname());

var ConfigManager = function () {
    /**
     * process.env.NODE_ENV
     * @type String
     */
    var environment = null;
    /**
     * path to config file
     * @type String
     */
    var configPath = null;
    /**
     * path to file with parameters
     * @type String
     */
    var paramsPath = null;
    /**
     * parameters container
     * @type JSON
     */
    var parameters = {};
    /**
     * config container
     * @type JSON
     */
    var config = {};
    /**
     * raw string
     * @type String
     */
    var rawConfig = null;

    /**
     * setter for environment
     * @param {String} env
     * @returns {undefined}
     */
    this.setEnvironment = function (env) {
        if (env === 'production' || env === 'development') {
            environment = env;
        } else {
            throw new Error('Config module: Invalid environment');
        }
    };
    /**
     * setter for configPath
     * @param {String} cfgPath
     * @returns {undefined}
     */
    this.setConfigPath = function (cfgPath) {
        try {
            configPath = cfgPath;
            rawConfig = fs.readFileSync(configPath, {
                encoding: 'utf-8'
            });
        } catch (e) {
            colog.error(e.message);
            throw new Error('Config module: file does not exist [ ' + cfgPath + ' ]');
        }
    };
    /**
     * setter for paramsPath
     * @param {String} prmPath
     * @returns {undefined}
     */
    this.setParametersFile = function (prmPath) {
        try {
            paramsPath = prmPath;
            parameters = YAML.parse(fs.readFileSync(paramsPath, {
                encoding: 'utf-8'
            }));
        } catch (e) {
            colog.error(e.message);
            throw new Error('Config module: file does not exist [ ' + prmPath + ' ]');
        }
    };
    /**
     *
     * @returns {undefined}
     */
    this.bind = function () {
        if (environment !== 'production' && environment !== 'development') {
            throw new Error('Config module: Invalid environment');
        }
        var p = parameters[environment];
        for (var i in p) {
            var regex = new RegExp("\%" + i + "\%", "g");
            rawConfig = rawConfig.replace(regex, p[i]);
        }
    };
    /**
     *
     * @returns {undefined}
     */
    this.compile = function () {
        this.bind();
        config = YAML.parse(rawConfig);
    };
    /**
     * getter for config
     * @returns {Object}
     */
    this.get = function () {
        return config;
    };

};

var Config = function (fileName) {
    this.config = {};

    // paths
    var dirpath = currentPath + '/configs/';
    var configPath = dirpath + fileName;
    var parametersPath = dirpath + 'parameters.yml';
    var distParametersPath = parametersPath + '.dist';
    // manager object
    var manager = new ConfigManager();
    // set manager
    manager.setConfigPath(configPath);
    try {
        manager.setParametersFile(parametersPath);
    } catch (e) {
        colog.error(e.message);
        colog.info('Config module: Load dist file instead');
        manager.setParametersFile(distParametersPath);
    }
    manager.setEnvironment(process.env.NODE_ENV || 'development');
    manager.compile();
    this.config = manager.get();
    colog.success('Config module: Config load [ ' + fileName + ' ]');

    /**
     * getter for config
     * @returns {Object}
     */
    this.get = function () {
        return this.config;
    };

    /**
     *
     * @param {String} filePath
     * @returns {undefined}
     */
    this.write = function (filePath) {
        var contents = "var nodeConfig = " + JSON.stringify(this.config) + ";";
        fs.writeFileSync(filePath, contents);
        colog.success('Config module: File created [ ' + filePath + ' ]');
    };
};

colog.headerSuccess(' - - - - - - - - - -');
colog.headerSuccess(' -     Config      -');
colog.headerSuccess(' - - - - - - - - - -');

// load configs
var internal = new Config('config.yml');
var external = new Config('external_config.yml');
external.write(currentPath + '/front/app/configs/_nodeConfig.js');

colog.success('Configuration done!');
console.log();
console.log();
console.log();

var exports = module.exports = internal.get();
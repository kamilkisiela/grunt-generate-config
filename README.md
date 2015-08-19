# grunt-generate-config

> Generates config from yaml files. You can also use parameters.

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install --save-dev kamilkisiela/grunt-generate-config
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-generate-config');
```

## The "generateConfig" task

### Overview
In your project's Gruntfile, add a section named `generateConfig` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  generateConfig: {
    options: {
      {
        parameters: '...',
        dest: '...'
      }
    },
    your_target: {
      src: [...]
    },
  },
})
```

### Options

#### options.dest
Type: `String`
Default value: `''`

Where we want our compiled config files to be exported. 

#### options.parameters
Type: `String`

Path to files with configuration parameters.
It is important to also have file with same name as parameters file in the same location but with `.dist` suffix.   
This file stores the canonical list of configuration parameters for the application.  
Whenever a new configuration parameter is defined for the application, you should also add it to this file and submit the changes to your version control system.  
Then, whenever a developer updates the project or deploys it to a server, grunt-generate-config task will check if there is any difference between the canonical parameters.yml.dist file and your local parameters.yml file.

#### target.src
Type: `String|Array`

Use it in the same way as in other grunt tasks.  
Include files to be compiled and exported as one configuration.

### Example configuration

```js
grunt.initConfig({
  generateConfig: {
    options: {
      dest: 'configs/sources/'
      parameters: 'configs/sources/parameters.yml'
    },
    api: {
      src: ['config/sources/api/*.yml']
    },
    app: {
      src: ['configs/sources/app/*.yaml', 'configs/sources/app.yml']
    }
  }
})
```

## The "grunt-generate-config" module
### Example

```js
var config = require('grunt-generate-config');
console.log(config.api);
console.log(config.app);
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
See [CHANGELOG.md](CHANGELOG.md).

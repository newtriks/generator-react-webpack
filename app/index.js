'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var generalUtils = require('../util.js');

var ReactWebpackGenerator = module.exports = function ReactWebpackGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
  this.option('es6');

  this.argument('appname', { type: String, required: false });
  this.appname = this.appname || path.basename(process.cwd());
  this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));
  this.scriptAppName = this._.capitalize(this.appname) + generalUtils.appName(this);

  this.config.set('app-name', this.appname);


  if (typeof this.options.appPath === 'undefined') {
    this.options.appPath = this.options.appPath || 'src';
  }

  this.appPath = this.options.appPath;

  args = [this.scriptAppName];

  this.composeWith('react-webpack:common', {
    args: args
  });

  this.composeWith('react-webpack:main', {
    args: args
  });

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'], bower: false });
  });


  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

  this.config.save();
};

util.inherits(ReactWebpackGenerator, yeoman.generators.Base);

ReactWebpackGenerator.prototype.welcome = function welcome() {
  // welcome message
  if (!this.options['skip-welcome-message']) {
    console.log(this.yeoman);
    console.log(
      'Out of the box I include Webpack and some default React components.\n'
    );
  }
};

ReactWebpackGenerator.prototype.askForReactRouter = function () {
  var done = this.async();
  this.prompt({
    type    : 'confirm',
    name    : 'reactRouter',
    message : 'Would you like to include react-router?',
    default : true
  }, function (props) {
    this.env.options.reactRouter = props.reactRouter;
    done();
  }.bind(this));
};

ReactWebpackGenerator.prototype.askForArchitecture  = function() {
  var done = this.async();
  this.prompt({
    type    : 'list',
    name    : 'architecture',
    message : 'Would you like to use one of these architectures?',
    choices: [
      {name:'No need for that, thanks',value:false},
      {name:'Flux',value:'flux'},
      {name:'ReFlux',value:'reflux'},
      {name:'Alt',value:'alt'}
    ],
    default : false
  }, function(props) {
    this.env.options.architecture = props.architecture;
    this.config.set('architecture', props.architecture);
    done();
  }.bind(this));
};

ReactWebpackGenerator.prototype.askForStylesLanguage = function () {
  var done = this.async();
  this.prompt({
    type    : 'list',
    name    : 'stylesLanguage',
    message : 'Which styles language you want to use?',
    choices: [
        {name: 'CSS', value: 'css'},
        {name: 'SASS', value: 'sass'},
        {name: 'SCSS', value: 'scss'},
        {name: 'LESS', value: 'less'},
        {name: 'Stylus', value: 'stylus'}
    ],
    default : 'css'
  }, function (props) {
    this.env.options.stylesLanguage = props.stylesLanguage;
    this.config.set('styles-language', props.stylesLanguage);
    done();
  }.bind(this));
};

// Allow to set the generated files suffix for the project when using components
// @see https://github.com/newtriks/generator-react-webpack/issues/99
ReactWebpackGenerator.prototype.askForComponentSuffix = function() {
  var done = this.async();
  this.prompt({
    type: 'list',
    name: 'componentSuffix',
    message: 'Which file suffix do you want to use for components?',
    choices: [
      { name: '.js (default)', value: 'js' },
      { name: '.jsx (deprecated)', value: 'jsx' }
    ],
    default: 'js'
  }, function (props) {
    this.env.options.componentSuffix = props.componentSuffix;
    this.config.set('component-suffix', props.componentSuffix);
    done();
  }.bind(this));
};

ReactWebpackGenerator.prototype.readIndex = function readIndex() {
  this.indexFile = this.engine(this.read('../../templates/common/index.html'), this);
};

ReactWebpackGenerator.prototype.createIndexHtml = function createIndexHtml() {
  this.indexFile = this.indexFile.replace(/&apos;/g, "'");
  this.write(path.join(this.appPath, 'index.html'), this.indexFile);
};

ReactWebpackGenerator.prototype.packageFiles = function () {
  this.es6 = this.options.es6;
  this.reactRouter = this.env.options.reactRouter;
  this.architecture = this.env.options.architecture;
  this.stylesLanguage = this.env.options.stylesLanguage;
  this.template('../../templates/common/_package.json', 'package.json');
  this.template('../../templates/common/_webpack.settings.js', 'webpack.settings.js');
  this.template('../../templates/common/_webpack.config.js', 'webpack.config.js');
  this.template('../../templates/common/_webpack.dist.config.js', 'webpack.dist.config.js');
  this.copy('../../templates/common/Gruntfile.js', 'Gruntfile.js');
  this.copy('../../templates/common/gitignore', '.gitignore');
};

ReactWebpackGenerator.prototype.styleFiles = function styleFiles() {
  var mainFile = 'main.css';
  this.copy('styles/' + mainFile, 'src/styles/' + mainFile);
};

ReactWebpackGenerator.prototype.imageFiles = function () {
  this.sourceRoot(path.join(__dirname, 'templates'));
  this.directory('images', 'src/images', true);
};

ReactWebpackGenerator.prototype.karmaFiles = function () {
  this.copy('../../templates/common/karma.conf.js', 'karma.conf.js');
};

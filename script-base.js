'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var generalUtils = require('./util.js');

var Generator = module.exports = function Generator() {
	yeoman.generators.NamedBase.apply(this, arguments);

	// Add capitalize mixin
    this._.mixin({ 'capitalize': generalUtils.capitalize });
    this._.mixin({ 'capitalizeFile': generalUtils.capitalizeFile });
	this._.mixin({ 'capitalizeClass': generalUtils.capitalizeClass });
	this._.mixin({ 'lowercase': generalUtils.lowercase });

	this.appname = path.basename(process.cwd());

	this.appname = this._.slugify(this._.humanize(this.appname));
	this.scriptAppName = this._.camelize(this._.capitalize(this.appname)) + generalUtils.appName(this);
	this.classedFileName = this._.capitalizeFile(this.name);
  this.classedName = this._.capitalizeClass(this.name);
  this.bootstrap = this.options.bootstrap;
  this.fontawesome = this.options.fontawesome;

	if (typeof this.options.appPath === 'undefined') {
		this.options.appPath = this.options.appPath || 'src/scripts';
	}

	if (typeof this.options.testPath === 'undefined') {
		this.options.testPath = this.options.testPath || 'test/spec';
	}

	if (typeof this.options.stylesPath === 'undefined') {
		this.options.stylesPath = this.options.stylesPath || 'src/styles';
	}

	var sourceRoot = '/templates/';
	this.scriptSuffix = '.js';
	this.reactSuffix = '.jsx';

	this.stylesSuffix = '.css';

	this.sourceRoot(path.join(__dirname, sourceRoot));
};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.appTemplate = function (src, dest) {
	yeoman.generators.Base.prototype.template.apply(this, [
		path.join('javascript', src + this.reactSuffix),
		path.join(this.options.appPath, dest) + this.reactSuffix
	]);
};

Generator.prototype.testTemplate = function (src, dest) {
	yeoman.generators.Base.prototype.template.apply(this, [
		src + this.scriptSuffix,
		path.join(this.options.testPath, dest) + this.scriptSuffix
	]);
};

Generator.prototype.stylesTemplate = function (src, dest) {
	console.log(src);
	yeoman.generators.Base.prototype.template.apply(this, [
		src + this.stylesSuffix,
		path.join(this.options.stylesPath, dest) + this.stylesSuffix
	]);
};

Generator.prototype.htmlTemplate = function (src, dest) {
	yeoman.generators.Base.prototype.template.apply(this, [
		src,
		path.join(this.options.appPath, dest.toLowerCase())
	]);
};

Generator.prototype.generateSourceAndTest = function (appTemplate, testTemplate, stylesTemplate, targetDirectory) {
	this.appTemplate(appTemplate, path.join(targetDirectory, this._.capitalizeFile(this.name)));
	this.testTemplate(testTemplate, path.join(targetDirectory, this._.capitalizeFile(this.name)));
	this.stylesTemplate(stylesTemplate, path.join(this._.capitalizeFile(this.name)));
};

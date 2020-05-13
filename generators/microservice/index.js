'use strict';
const BaseGenerator = require('../base-generator');
const constants = require('../constants');
const prompts = require('./prompts');
const path = require('path');

module.exports = class extends BaseGenerator {

    constructor(args, opts) {
        super(args, opts);
        this.configOptions = this.options.configOptions || {};
    }

    initializing() {
        this.logSuccess('Generando Microservicio...')
    }

    get prompting() {
        return prompts.prompting;
    }

    configuring() {
        this.destinationRoot(path.join(this.destinationRoot(), '/'+this.configOptions.appName));
        Object.assign(this.configOptions, constants);
        this.config.set(this.configOptions);
    }

    writing() {
        this.generateBuildToolConfig(this.configOptions);
        this._generateAppCode(this.configOptions);
    }

    end() {
        this.printGenerationSummary(this.configOptions);
    }

    _generateAppCode(configOptions) {

        const mainJavaTemplates = [
            'Application.java',
            'config/SwaggerConfig.java',
            'constant/Constants.java'
        ];
        this.generateMainJavaCode(configOptions, mainJavaTemplates);

        const mainResTemplates = [
            'application.yml'
        ];
        this.generateMainResCode(configOptions, mainResTemplates);

        const testJavaTemplates = [
            'ApplicationTests.java'
        ];
        this.generateTestJavaCode(configOptions, testJavaTemplates);
    }
};

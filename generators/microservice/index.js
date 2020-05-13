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
        this.logSuccess('Generating MicroService')
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
        this.generateDockerConfig(this.configOptions);
        //this.generateJenkinsfile(this.configOptions);
        //this.generateTravisCIfile(this.configOptions);
        //this.generateGithubCIfile(this.configOptions);
        //this._generateDockerComposeFiles(this.configOptions);
        this._generateAppCode(this.configOptions);
    }

    end() {
        this.printGenerationSummary(this.configOptions);
    }

    _generateAppCode(configOptions) {

        const mainJavaTemplates = [
            'Application.java',
            'config/WebMvcConfig.java',
            'config/SwaggerConfig.java',
            'exception/ExceptionResponse.java',
            'utils/Constants.java'
        ];
        this.generateMainJavaCode(configOptions, mainJavaTemplates);

        const mainResTemplates = [
            'application.properties',
            'application-docker.properties',
            'application-prod.properties',
            'application-heroku.properties'
        ];
        this.generateMainResCode(configOptions, mainResTemplates);

        const testJavaTemplates = [
            'common/ExceptionHandling.java',
            'common/AbstractIntegrationTest.java',
            'ApplicationTests.java'
        ];
        this.generateTestJavaCode(configOptions, testJavaTemplates);

        const testResTemplates = [
            'bootstrap.properties',
            'bootstrap-integration-test.properties'
        ];
        this.generateTestResCode(configOptions, testResTemplates);
    }

    _generateDockerComposeFiles(configOptions) {
        this._generateAppDockerComposeFile(configOptions);
        //this._generateELKConfig(configOptions);
        //this._generateMonitoringConfig(configOptions);
        //if(configOptions.distTracing === true) {
        //    this._generateDistTracingDockerComposeFile(configOptions);
        //}
    }

    _generateAppDockerComposeFile(configOptions) {
        const resTemplates = [
            'docker-compose.yml',
        ];
        this.generateFiles(configOptions, resTemplates, 'app/','docker/');
    }

    /*
    _generateDistTracingDockerComposeFile(configOptions) {
        const resTemplates = [
            'docker-compose-tracing.yml',
        ];
        this.generateFiles(configOptions, resTemplates, 'app/','docker/');
    }

    _generateELKConfig(configOptions) {
        const resTemplates = [
            'docker/docker-compose-elk.yml',
            'config/elk/logstash.conf',
        ];
        this.generateFiles(configOptions, resTemplates, 'app/','./');
    }

    _generateMonitoringConfig(configOptions) {
        const resTemplates = [
            'docker/docker-compose-monitoring.yml',
            'config/prometheus/prometheus.yml',
        ];
        this.generateFiles(configOptions, resTemplates, 'app/','./');

        this.fs.copy(
            this.templatePath('app/config/grafana'),
            this.destinationPath('config/grafana')
        );
    }
    */

};

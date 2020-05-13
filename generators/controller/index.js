'use strict';
const BaseGenerator = require('../base-generator');
const constants = require('../constants');
const _ = require('lodash');

module.exports = class extends BaseGenerator {

    constructor(args, opts) {
        super(args, opts);
        this.configOptions = this.options.configOptions || {};

        this.argument("entityName", {
            type: String,
            required: true,
            description: "Entity name"
        });

        this.option('base-path', {
            type: String,
            desc: "Base URL path for REST Controller"
        })
    }

    get initializing() {
        this.logSuccess('Genearndo JPA entity, repository, service, model, exception y controller');
        return {
            validateEntityName() {
                const context = this.context;
                console.log(`EntityName: ${this.options.entityName}, basePath: ${this.options.basePath}`);
            }
        }
    }

    configuring() {
        this.configOptions = Object.assign({}, this.configOptions, this.config.getAll());
        this.configOptions.basePath = this.options['base-path'];
        this.configOptions.entityName = this.options.entityName;
        this.configOptions.entityVarName = _.camelCase(this.options.entityName);
        this.configOptions.tableName = _.lowerCase(this.options.entityName)+'s';
    }

    writing() {
        this._generateAppCode(this.configOptions);
    }

    _generateAppCode(configOptions) {
        const mainJavaTemplates = [
            {src: 'entity/Entity.java', dest: 'entity/'+configOptions.entityName+'.java'},
            {src: 'repository/Repository.java', dest: 'repository/'+configOptions.entityName+'Repository.java'},
            {src: 'service/Service.java', dest: 'service/'+configOptions.entityName+'Service.java'},
            {src: 'service/impl/ServiceImpl.java', dest: 'service/impl/'+configOptions.entityName+'ServiceImpl.java'},
            {src: 'exception/ExceptionResponse.java', dest: 'exception/ExceptionResponse.java'},
            {src: 'exception/ModelNotFoundException.java', dest: 'exception/ModelNotFoundException.java'},
            {src: 'exception/ResponseExceptionHandler.java', dest: 'exception/ResponseExceptionHandler.java'},
            {src: 'model/Request.java', dest: 'model/'+configOptions.entityName+'Request.java'},
            {src: 'controller/Controller.java', dest: 'controller/'+configOptions.entityName+'Controller.java'},
        ];
        this.generateMainJavaCode(configOptions, mainJavaTemplates);

        const testJavaTemplates = [
        ];
        this.generateTestJavaCode(configOptions, testJavaTemplates);
    }
};

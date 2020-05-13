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
        this.logSuccess('Generating JPA entity, repository, service and controller');
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
        this._generateController(this.configOptions);
    }

    _generateAppCode(configOptions) {
        const mainJavaTemplates = [
            {src: 'entity/Entity.java', dest: 'entity/'+configOptions.entityName+'.java'},
            {src: 'repository/Repository.java', dest: 'repository/'+configOptions.entityName+'Repository.java'},
            {src: 'service/Service.java', dest: 'service/'+configOptions.entityName+'Service.java'},
        ];
        this.generateMainJavaCode(configOptions, mainJavaTemplates);

        const testJavaTemplates = [
        ];
        this.generateTestJavaCode(configOptions, testJavaTemplates);
    }

    _generateController(configOptions) {
        var mainJavaController = [];

        if (configOptions.distTracing) {
            mainJavaController = [
                {src: 'controller/Controller.java', dest: 'controller/'+configOptions.entityName+'Controller.java'},
            ];
        } else {
            mainJavaController = [
                {src: 'web/controller/Controller.java', dest: 'web/controller/'+configOptions.entityName+'Controller.java'},
            ];
        }
        this.generateMainJavaCode(configOptions, mainJavaController);
    }


    _generateFlywayMigration(configOptions) {
        const supportSequences = this._supportDatabaseSequences(configOptions.databaseType);
        const counter = configOptions[constants.KEY_FLYWAY_MIGRATION_COUNTER] + 1;
        let vendor = configOptions.databaseType;
        if(vendor === "mariadb") {
            vendor = "mysql";
        }
        const scriptTemplate = supportSequences ? "V1__new_table_with_seq.sql" : "V1__new_table_no_seq.sql";

        this.fs.copyTpl(
            this.templatePath('app/src/main/resources/db/migration/flyway/V1__new_table_with_seq.sql'),
            this.destinationPath('src/main/resources/db/migration/h2/V'+counter+'__create_'+configOptions.tableName+'_table.sql'),
            configOptions
        );
        this.fs.copyTpl(
            this.templatePath('app/src/main/resources/db/migration/flyway/'+scriptTemplate),
            this.destinationPath('src/main/resources/db/migration/'+vendor+
                '/V'+counter+'__create_'+configOptions.tableName+'_table.sql'),
            configOptions
        );
        const flywayMigrantCounter = {
            [constants.KEY_FLYWAY_MIGRATION_COUNTER]: counter
        };
        //const updatedConfig = Object.assign({}, this.config.getAll(), flywayMigrantCounter);
        this.config.set(flywayMigrantCounter);
    }

    _supportDatabaseSequences(databaseType) {
        return  databaseType === 'h2' ||
            databaseType === 'postgresql'
            ;
    }
};

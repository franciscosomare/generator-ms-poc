
module.exports = {
    prompting
};

function prompting() {

    const done = this.async();

    const prompts = [
        {
            type: 'string',
            name: 'appName',
            validate: input =>
                /^([a-z_][a-z0-9_]*)$/.test(input)
                    ? true
                    : 'The application name you have provided is not valid',
            message: 'Cual es el nombre de la Aplicacion?',
            default: 'miservicio'
        },
        {
            type: 'string',
            name: 'packageName',
            validate: input =>
                /^([a-z_]{1}[a-z0-9_]*(\.[a-z_]{1}[a-z0-9_]*)*)$/.test(input)
                    ? true
                    : 'The package name you have provided is not a valid Java package name.',
            message: 'Cual es paquete por default?',
            default: 'com.mycompany.myservice'
        },
        {
            type: 'confirm',
            name: 'sql',
            message: 'Desea usar Spring Jpa?',
            default: true
        },
        {
            when: response => response.sql === true,
            type: 'list',
            name: 'databaseType',
            message: 'Que Tipo de Bases de Datos va a usar?',
            choices: [
                {
                    value: 'postgresql',
                    name: 'Postgresql'
                },
                {
                    value: 'mysql',
                    name: 'MySQL'
                },
                {
                    value: 'mariadb',
                    name: 'MariaDB'
                }
            ],
            default: 'postgresql'
        },
        {
            type: 'list',
            name: 'buildTool',
            message: 'Que Herramienta de Building se usara?',
            choices: [
                {
                    value: 'maven',
                    name: 'Maven'
                },
                {
                    value: 'gradle',
                    name: 'Gradle'
                }
            ],
            default: 'maven'
        }
    ];

    this.prompt(prompts).then(answers => {
        Object.assign(this.configOptions, answers);
        this.configOptions.packageFolder = this.configOptions.packageName.replace(/\./g, '/');
        if(this.configOptions.sql === false) {
            this.configOptions.databaseType = 'none';
            this.configOptions.dbMigrationTool = 'none';
        }
        const features = this.configOptions.features || [];
        this.configOptions.distTracing = features.includes('distTracing');
        this.configOptions.eurekaClient = features.includes('eurekaClient');
        this.configOptions.configClient = features.includes('configClient');
        done();
    });
}

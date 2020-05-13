
module.exports = {
    prompting
};

function prompting() {

    const done = this.async();

    const prompts = [
        {
            type: 'list',
            name: 'appType',
            message: 'Bienvenido al Acelerador de Microservicios, presione ENTER para continuar',
            choices: [
                {
                    value: 'microservice',
                    name: 'SpringBoot MicroService'
                }
            ],
            default: 'microservice'
        }
    ];

    this.prompt(prompts).then(answers => {
        Object.assign(this.configOptions, answers);
        done();
    });
}

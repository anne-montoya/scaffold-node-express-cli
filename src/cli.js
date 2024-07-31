import chalk from 'chalk'
import figlet from 'figlet'
import { program } from 'commander'
import inquirer from 'inquirer'
import { prompts } from './const.js'
import { createProject } from './create-project.js'

export async function cli() {
    displayCLITitle()
    let options = await getInitialPrompt()
    options = await getMissingOptions(options)
    await createProject(options)
}

function displayCLITitle() {
    console.log(
        chalk.green(figlet.textSync('Node Express Scaffold', { width: 70} ))
    )
}


async function getInitialPrompt() {
    program
        .version('1.0.0')
        .description('Node-Express Scaffold')
        .option('-n, --name <name>')
        .option('-p, --port <port>')
        .parse()

    const options = program.opts()

    return {
        name: options.name,
        port: options.port
    }
}

async function getMissingOptions(options) {
    const questions = []
    if (!options.name) questions.push(prompts.name)
    if (!options.port) questions.push(prompts.port)

    const answers = await inquirer.prompt(questions)
    return {
        name: options.name ?? answers.name,
        port: options.port ?? answers.port
    }
}
#!/usr/bin/env node

import chalk from 'chalk'
import figlet from 'figlet'
import { program } from 'commander'
import inquirer from 'inquirer'

console.log(
    chalk.green(figlet.textSync('Node-Express Scaffold', { horizontalLayout: 'full'} ))
)

const prompts = {
        name: {
            type: 'input',
            name: 'name',
            message: `Project's name: `
        },
        port: {
            type: 'input',
            name: 'port',
            message: `Port: `
        }
    },
    visiblePrompts = []
let parameters = {}

program
    .version('1.0.0')
    .description('Node-Express Scaffold')
    .option('-n, --name <name>')
    .option('-p, --port <port>')
    .parse()

const options = program.opts()
parameters.name = options.name ?? visiblePrompts.push(prompts.name)
parameters.port = options.port ?? visiblePrompts.push(prompts.port)

if (visiblePrompts.length) {
    inquirer
        .prompt(visiblePrompts)
        .then((answers) => {
            parameters = { ...parameters, ...answers }
            console.log(parameters)
            // replace all occurance of name and port inside a folder
        })
}
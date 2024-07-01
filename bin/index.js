#!/usr/bin/env node
import fs from 'node:fs'
import { promisify } from 'node:util'
import path from 'node:path'
import chalk from 'chalk'
import figlet from 'figlet'
import { program } from 'commander'
import inquirer from 'inquirer'
import ncp from 'ncp'
import { exec as nativeExec } from 'node:child_process'

const access = promisify(fs.access)
const copy = promisify(ncp)
const exec = promisify(nativeExec)

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
        .then(async (answers) => {
            parameters = { ...parameters, ...answers }
            console.log(parameters)
            await copyTemplate(parameters)
            // await cleanTemplateFiles(parameters)
            await cleanTemplateFiles(parameters)
            console.log('%s Project ready', chalk.green.bold('DONE'))
            // replace all occurance of name and port inside a folder
        })
}

async function copyTemplate(options) {
    const dir = {
        templateDirectory: '',
        targetDirectory: path.resolve(process.cwd(), options.name)
    }

    const currentFileUrl = import.meta.url
    dir.templateDirectory = path.resolve(
        new URL(currentFileUrl).pathname,
        '../../template'
    )

    console.log(dir.templateDirectory)

    try {
        await access(dir.templateDirectory, fs.constants.R_OK)
    } catch(err) {
        console.log(err)
        console.error('%s Invalid template name', chalk.red.bold('ERROR'))
        process.exit(1)
    }

    await exec(`mkdir ${options.name}`)
    await copyTemplateFiles(dir)
}


async function copyTemplateFiles(options) {
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false
    })
}

async function cleanTemplateFiles(options) {
    return Promise.all([
        exec(`find ${options.name} -type f -exec sed -i '' -e "s/"#{name}"/"${options.name}"/g" {} +`),
        exec(`find ${options.name} -type f -exec sed -i '' -e "s/"#{port}"/"${options.port}"/g" {} +`)
    ]) 
}
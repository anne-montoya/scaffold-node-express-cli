#!/usr/bin/env node
import fs from 'node:fs'
import { promisify } from 'node:util'
import path from 'node:path'
import chalk from 'chalk'
import figlet from 'figlet'
import { program } from 'commander'
import inquirer from 'inquirer'
import ncp from 'ncp'
import { execa } from 'execa'

const access = promisify(fs.access)
const copy = promisify(ncp)

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

    await execa('mkdir', [options.name], { cwd: process.cwd() })
    await copyTemplateFiles(dir)
}


async function copyTemplateFiles(options) {
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false
    })
}

async function cleanTemplateFiles(options) {
    console.log('CWD: ',process.cwd())
    // const result = await execa(`find ${options.name} -type f -exec sed -i '' -e "s/"#{name}"/"${options.name}"/g" {} +`)
    const result = await execa(`find * -type f -exec sed -i '' -e "s/"#{name}"/"${options.name}"/g" {} +`, {cwd: path.resolve(process.cwd(), options.name)} )
    if (result.failed) {
        return Promise.reject(new Error('Failed to set project name'))
    }
}
async function initGit(options) {
    const result = await execa('git', ['init'], {
        cwd: options.targetDirectory
    })
    if (result.failed) {
        return Promise.reject(new Error('Failed to initialize git'))
    }

    return
}
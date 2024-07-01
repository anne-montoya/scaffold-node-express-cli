import { promisify } from 'node:util'
import { exec as nativeExec } from 'node:child_process'
import path from 'node:path'
import ncp from 'ncp'
import chalk from 'chalk'

const exec = promisify(nativeExec)
const copy = promisify(ncp)

export async function createProject(options) {
    try {
        await exec(`mkdir ${options.name}`)
        await copyTemplate(options)
        await cleanTemplate(options)
        console.log(`%s Project ready. Run via 'npm start'`, chalk.green.bold('DONE'))
    } catch(e) {
        console.error(`%s Creating project. Please delete project dir 'rm -rf ${options.name}'`, chalk.red.bold('ERROR'))
    }
}

async function copyTemplate(options) { 
    await copyTemplateFiles({
        targetDirectory: path.resolve(process.cwd(), options.name),
        templateDirectory: getTemplateDirectory()
    })
}

function getTemplateDirectory() {
    const currentFileUrl = import.meta.url
    return path.resolve(
        new URL(currentFileUrl).pathname,
        '../../template'
    )
}

function copyTemplateFiles({ templateDirectory, targetDirectory }) {
    return copy(templateDirectory, targetDirectory, {
        clobber: false
    })
}

async function cleanTemplate(options) {
    return Promise.all([
        exec(`find ${options.name} -type f -exec sed -i '' -e "s/"#{name}"/"${options.name}"/g" {} +`),
        exec(`find ${options.name} -type f -exec sed -i '' -e "s/"#{port}"/"${options.port}"/g" {} +`)
    ]) 
}
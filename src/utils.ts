import path from 'path'
import fs from 'fs'
import childProcess from 'child_process'

module.exports = {
  isPackageVersionPublished,
  getPackagePublishedVersions,
  getPackagePublishedInfo,
  findPackageJsonFile,
  getPackageName,
  getPackageVersion,
  getPackageProperty,
  publishPackage,
  runShellScript
}

async function isPackageVersionPublished(cwd: string, version: string): Promise<boolean> {
  const allPublishedVersions = await module.exports.getPackagePublishedVersions(cwd)

  for (const publishedVersion of allPublishedVersions) {
    if (publishedVersion === version) return true
  }

  return false
}

async function getPackagePublishedVersions (cwd: string): Promise<string[]> {
  const rawPackageInfo = await module.exports.getPackagePublishedInfo(cwd)
  const packageInfo = JSON.parse(rawPackageInfo)

  return packageInfo.data.versions
}

async function getPackagePublishedInfo (cwd: string): Promise<string> {
  const pathToPackageJson = await module.exports.findPackageJsonFile(cwd)
  const packageName = await module.exports.getPackageName(cwd)

  return module.exports.runShellScript(`yarn info '${packageName}' --json`, pathToPackageJson)
}

async function findPackageJsonFile (cwd: string): Promise<string> {
  const pathToPackageJson = path.resolve(cwd, 'package.json')
  if (await fileExistsAt(pathToPackageJson)) return pathToPackageJson

  const pathToParentFolder = path.dirname(cwd)
  if (pathToParentFolder === cwd) throw new Error('Could not find package.json')

  return module.exports.findPackageJsonFile(pathToParentFolder)
}

async function getPackageName (cwd: string): Promise<string> {
  return module.exports.getPackageProperty(cwd, 'name')
}

async function getPackageVersion (cwd: string): Promise<string> {
  return module.exports.getPackageProperty(cwd, 'version')
}

async function getPackageProperty (cwd: string, propertyName: string): Promise<string> {
  const pathToPackageJson = await module.exports.findPackageJsonFile(cwd)
  const fileContent = await readFile(pathToPackageJson)
  const packageJsonContent = JSON.parse(fileContent)

  return packageJsonContent[propertyName]
}

async function publishPackage (cwd: string): Promise<void> {
  await module.exports.runShellScript('npm publish', cwd)
}


function readFile (pathToFile: string): Promise<string> {
  return new Promise(function (resolve, reject) {
    fs.readFile(pathToFile, function (err, data) {
      return err
        ? reject(err)
        : resolve(data.toString())
    })
  })
}

function fileExistsAt (pathToFile: string): Promise<boolean> {
  return new Promise(function (resolve) {
    fs.exists(pathToFile, (exists) => resolve(exists))
  })
}

function runShellScript (shellScript: string, cwd: string): Promise<string> {
  return new Promise(function (resolve, reject) {
    childProcess.exec(shellScript, { cwd }, function (err, stdout) {
      return err
        ? reject(err)
        : resolve(stdout)
    })
  })
}

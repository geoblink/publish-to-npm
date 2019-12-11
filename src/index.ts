const utils = require('./utils')

async function main () {
  const pathToPackageJson = await utils.findPackageJsonFile(process.cwd())
  console.log(`Reading package.json at ${pathToPackageJson}`)

  const PACKAGE_NAME = await utils.getPackageName(process.cwd())
  console.log(`PACKAGE_NAME=${PACKAGE_NAME}`)
  const PACKAGE_VERSION = await utils.getPackageVersion(process.cwd())
  console.log(`PACKAGE_VERSION=${PACKAGE_VERSION}`)
  const PUBLISHED_VERSIONS = await utils.getPackagePublishedVersions(process.cwd())
  console.log(`PUBLISHED_VERSIONS=(${PUBLISHED_VERSIONS.join(' ')})`)
  const IS_VERSION_PUBLISHED = await utils.isPackageVersionPublished(process.cwd(), PACKAGE_VERSION)
  console.log(`IS_VERSION_PUBLISHED=${IS_VERSION_PUBLISHED}`)

  if (IS_VERSION_PUBLISHED) {
    console.log(`Not publishing version ${PACKAGE_VERSION} because it is published already!`)
  } else {
    await utils.publishPackage(process.cwd())
    console.log(`Version ${PACKAGE_VERSION} published!`)
  }
}

module.exports = main().catch(function (error) {
  console.error(error)
  process.exit(1)
})

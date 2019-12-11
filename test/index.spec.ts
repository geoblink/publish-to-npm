export { }

const mockFs = require('mock-fs')
const sinon = require('sinon')
const chaiInstance = require('chai')
const chaiAsPromised = require('chai-as-promised')
chaiInstance.use(chaiAsPromised)
const sinonChai = require('sinon-chai')
chaiInstance.use(sinonChai)
const { expect } = chaiInstance

const utils = require('../src/utils')

describe('Index', function () {
  const sandbox = sinon.createSandbox()

  beforeEach('Set up sandbox', function () {
    sandbox.restore()
    sandbox.stub(utils, 'findPackageJsonFile').resolves('my path')
    sandbox.stub(utils, 'getPackageName').resolves('my name')
    sandbox.stub(utils, 'getPackageVersion').resolves('my version')
    sandbox.stub(utils, 'getPackagePublishedVersions').resolves(['published version'])
    sandbox.stub(utils, 'publishPackage').resolves()
    sandbox.stub(console, 'log')
    sandbox.stub(console, 'error')
    sandbox.stub(process, 'exit')
  })

  afterEach('Clean up sandbox', function () {
    sandbox.restore()
  })

  beforeEach('Clean up mocked file system', function () {
    mockFs.restore()
  })

  afterEach('Clean up mocked file system', function () {
    mockFs.restore()
  })

  describe('#main', function (){
    it('Should publish version if not published', async function () {
      sandbox.stub(utils, 'isPackageVersionPublished').resolves(false)
      sandbox.stub(process, 'cwd').returns('my path')

      const promise = requireNoCache('../src/index')

      await expect(promise).to.be.eventually.fulfilled

      expect(utils.findPackageJsonFile).to.have.been.calledOnceWithExactly('my path')
      expect(console.log).to.have.been.calledWithExactly('Reading package.json at my path')

      expect(utils.getPackageName).to.have.been.calledOnceWithExactly('my path')
      expect(console.log).to.have.been.calledWithExactly('PACKAGE_NAME=my name')

      expect(utils.getPackageVersion).to.have.been.calledOnceWithExactly('my path')
      expect(console.log).to.have.been.calledWithExactly('PACKAGE_VERSION=my version')

      expect(utils.getPackagePublishedVersions).to.have.been.calledOnceWithExactly('my path')
      expect(console.log).to.have.been.calledWithExactly('PUBLISHED_VERSIONS=(published version)')

      expect(utils.isPackageVersionPublished).to.have.been.calledOnceWithExactly('my path', 'my version')
      expect(console.log).to.have.been.calledWithExactly('IS_VERSION_PUBLISHED=false')

      expect(utils.publishPackage).to.have.been.calledOnceWithExactly('my path')
      expect(console.log).to.have.been.calledWithExactly('Version my version published!')
    })

    it('Should not publish version if already published', async function () {
      sandbox.stub(utils, 'isPackageVersionPublished').resolves(true)
      sandbox.stub(process, 'cwd').returns('my path')

      const promise = requireNoCache('../src/index')

      await expect(promise).to.be.eventually.fulfilled

      expect(console.log).to.have.been.calledWithExactly('IS_VERSION_PUBLISHED=true')

      expect(utils.publishPackage).to.not.have.been.called
      expect(console.log).to.have.been.calledWithExactly('Not publishing version my version because it is published already!')
    })
  })
})

function requireNoCache<T> (path: string): T {
  var pathToModule = require.resolve(path)
  if (pathToModule) delete require.cache[pathToModule]
  return require(path)
}

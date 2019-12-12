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

describe('Utils', function () {
  const sandbox = sinon.createSandbox()

  beforeEach('Clean up sandbox', function () {
    sandbox.restore()
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

  describe('#isPackageVersionPublished', function (){
    it('Should return «true» if version is published', async function () {
      sandbox.stub(utils, 'getPackagePublishedVersions').resolves(['1.0.0'])
      await expect(utils.isPackageVersionPublished('', '1.0.0')).to.eventually.be.true
    })

    it('Should return «false» if version is not published', async function () {
      sandbox.stub(utils, 'getPackagePublishedVersions').resolves(['1.0.0'])
      await expect(utils.isPackageVersionPublished('', '2.0.0')).to.eventually.be.false
    })

    it('Should return «false» if no versions are published', async function () {
      sandbox.stub(utils, 'getPackagePublishedVersions').resolves([])
      await expect(utils.isPackageVersionPublished('', '2.0.0')).to.eventually.be.false
    })
  })

  describe('#getPackagePublishedVersions', function () {
    it('Should return proper versions from NPM response', async function () {
      sandbox.stub(utils, 'getPackagePublishedInfo').resolves(JSON.stringify({
        data: {
          versions: [
            'a version'
          ]
        }
      }))
      await expect(utils.getPackagePublishedVersions('')).to.eventually.deep.equal(['a version'])
    })
  })

  describe('#getPackagePublishedInfo', function () {
    it('Should return run yarn info with proper package name', async function () {
      sandbox.stub(utils, 'findPackageJsonFile').resolves('my-path/package.json')
      sandbox.stub(utils, 'getPackageName').resolves('my name')
      sandbox.stub(utils, 'runShellScript').resolves('my response')

      await expect(utils.getPackagePublishedInfo('')).to.eventually.equal('my response')

      expect(utils.runShellScript).to.have.been.calledOnceWithExactly('yarn info \'my name\' --json', 'my-path')
    })
  })

  describe('#findPackageJsonFile', function () {
    it('Should return cwd path if file exists', async function () {
      mockFs({
        '/test-only-folder/subfolder/package.json': ''
      })

      await expect(utils.findPackageJsonFile('/test-only-folder/subfolder')).to.eventually.equal('/test-only-folder/subfolder/package.json')
    })

    it('Should return path to parent if file exists there', async function () {
      mockFs({
        '/test-only-folder/package.json': ''
      })

      await expect(utils.findPackageJsonFile('/test-only-folder/subfolder')).to.eventually.equal('/test-only-folder/package.json')
    })

    it('Should throw if does not exist', async function () {
      mockFs({})

      await expect(utils.findPackageJsonFile('/test-only-folder/subfolder')).to.be.rejected
    })
  })

  describe('#getPackageName', function () {
    it('Should return «name» property of package.json', async function () {
      sandbox.stub(utils, 'getPackageProperty').resolves('my name')

      await expect(utils.getPackageName('')).to.eventually.equal('my name')

      expect(utils.getPackageProperty).to.have.been.calledOnceWithExactly('', 'name')
    })
  })

  describe('#getPackageVersion', function () {
    it('Should return «version» property of package.json', async function () {
      sandbox.stub(utils, 'getPackageProperty').resolves('my version')

      await expect(utils.getPackageVersion('')).to.eventually.equal('my version')

      expect(utils.getPackageProperty).to.have.been.calledOnceWithExactly('', 'version')
    })
  })

  describe('#getPackageProperty', function () {
    it('Should return «version» property of package.json', async function () {
      mockFs({
        '/my/path': JSON.stringify({ key: 'value' })
      })

      sandbox.stub(utils, 'findPackageJsonFile').resolves('/my/path')

      await expect(utils.getPackageProperty('', 'key')).to.eventually.equal('value')

      expect(utils.findPackageJsonFile).to.have.been.calledOnceWithExactly('')
    })
  })

  describe('#publishPackage', function () {
    it('Should run «npm publish»', async function () {
      sandbox.stub(utils, 'runShellScript').resolves()

      await expect(utils.publishPackage('')).to.eventually.be.fulfilled

      expect(utils.runShellScript).to.have.been.calledOnceWithExactly('npm publish', '')
    })
  })
})

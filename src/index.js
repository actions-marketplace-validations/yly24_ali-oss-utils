const core = require('@actions/core')
const OSS = require('ali-oss')
const fs = require('fs')
const path = require('path')

upload()

async function upload() {
  try {
    const oss = new OSS({
      region: core.getInput('region'),
      accessKeyId: core.getInput('access-key-id'),
      accessKeySecret: core.getInput('access-key-secret'),
      bucket: core.getInput('bucket')
    })

    const sourcePath = core.getInput('source', { required: true }).replace(/\/+$/g, '')
    const targetPath = core.getInput('target', { required: false }).replace(/\/+$/g, '')
    const paths = getFilePaths(sourcePath)

    for (const fileName of paths) {
      const objectName = getObjectName(fileName, sourcePath ,targetPath)
      const { res, url } = await oss.put(objectName, fileName)
      const { statusCode, statusMessage } = res
      statusCode === 200 ? core.info(`${objectName}, ${statusMessage}`) : core.error(`${objectName}, ${statusMessage}`)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

function getFilePaths(dir) {
  const paths = []

  function getDirPath(dir) {
    fs.readdirSync(dir).forEach((file) => {
      const pathname = path.join(dir, file)
      if (fs.statSync(pathname).isDirectory()) {
        getDirPath(pathname)
      } else {
        paths.push(pathname)
      }
    })
  }

  getDirPath(dir)
  return paths
}

function getObjectName(fileName, sourcePath, targetPath) {
  const filePath = fileName.split(sourcePath)[1]

  return `${targetPath || ''}${filePath}`
}

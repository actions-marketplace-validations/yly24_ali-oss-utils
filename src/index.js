const core = require('@actions/core')
const OSS = require('ali-oss')
const fs = require('fs')

upload()

async function upload() {
  try {
    const oss = new OSS({
      region: core.getInput('region'),
      accessKeyId: core.getInput('access-key-id'),
      accessKeySecret: core.getInput('access-key-secret'),
      bucket: core.getInput('bucket')
    })

    const assetPath = core.getInput('source', { required: true }).replace(/\/+$/g, '')
    const targetPath = core.getInput('target', { required: true }).replace(/\/+$/g, '')
    const paths = getFilePaths(assetPath)

    for (const fileName of paths) {
      const objectName = getObjectName(fileName, targetPath)
      const { res, url } = await oss.put(objectName, fileName)
      const { statusCode, statusMessage } = res
      statusCode === 200 ? core.info(`${url}, ${statusMessage}`) : core.error(`${url}, ${statusMessage}`)
    }
  } catch (error) {
    core.setFailed(err.message)
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

const getObjectName = (fileName, targetPath) => {
  const filePath = fileName.split('build')[1]
  return `${targetPath}${filePath}`
}

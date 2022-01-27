const fs = require('fs')
const exec = require('child_process').exec
const archiver = require('archiver')
const arguments = process.argv.slice(2)

function formatName(name) {
  return `${name}.pk3`
}

function createArchive(path, name, outputDirectory = '', cb) {
  return new Promise((resolve, reject) => {
    if (!path) reject('No path provided for compilation.')
    if (!name) reject('No name provided for mod.')

    const fileName = outputDirectory + formatName(name)
    const output = fs.createWriteStream(fileName)
    const archive = archiver('zip', {
      zlib: { level: 9 },
    })
    console.info('Compiling: ' + path)
    console.info('Output : ' + fileName)

    output.on('close', function () {
      console.info('Done, File closed.')
      console.info(archive.pointer() + ' total bytes')
      resolve()
    })

    output.on('end', function () {
      console.info('Data has been drained')
      resolve()
    })

    archive.on('warning', function (err) {
      if (err.code === 'ENOENT') {
      } else {
        reject(err)
      }
    })

    archive.on('error', function (err) {
      reject(err)
    })

    archive.pipe(output)

    archive.directory(path, false)

    archive.finalize()
  })
}

function DoomModsToolchain({
  modPath,
  outputPath,
  executablePath,
  executableModsPath,
}) {

  function compile(modName) {
    return createArchive(modPath, modName, outputPath)
  }

  function execute(modNames = []) {
    const mods = modNames
    if (!mods.length) {
      console.info("Loading GZDoom with no mods.")
    } else {
      console.info(`Opening GZDoom with: ${mods.map((x) => x).join(' ')}`)
    }

    const execModsPath = executableModsPath || outputPath
    const executable_path = executablePath

    const modsStr = mods.map((mod) => `${execModsPath}${mod}`).join(' ')
    exec(
      `${executable_path} -iwad doom2 -file ${modsStr}`,
      function (error, stdout, stderr) {
        if (error != null) {
          console.log(stderr)
        }
      }
    )
  }

  return {
    compile,
    execute,
  }
}

module.exports = DoomModsToolchain
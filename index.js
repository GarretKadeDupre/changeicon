'use strict'
const fs = require('fs')
const run = require('child_process').execSync
const request = require('request')
const rp = require('request-promise')
const path = require('path')

module.exports = changeIcon

/**
 * Change the icon of an executable file.
 * @param {string} exe - The name of the executable file.
 * @param {string} img - The name of the image to be used as an icon. 
 * If an ICO image is supplied, it must be an icon group. 
 * If a PNG or JPG image is supplied, it will be converted to an icon group via https://icoconvert.com.
 */
async function changeIcon(exe, img) {
  if (img.endsWith('.ico')) {
    let icon = img
    console.log(`Changing icon of ${exe} to ${icon} ...`)
    return new Promise((resolve, reject) => {
      let args = `-o "${exe}" -s "${exe}" -a addoverwrite -r "${icon}" -m ICONGROUP,AAAAAA,`
      // The icon name within the executable is named "AAAAAA" to ensure it is alphabetically first.
      // Windows Explorer displays the alphabetically first icon.
      run(`"${path.join(__dirname, 'resource_hacker', 'ResourceHacker.exe')}" ${args}`)
      console.log('Icon successfully changed!')
      resolve()
    })
  } else {
    let ext = img.match(/\.[0-9a-z]+$/i)[0]
    console.log(`${img} is not an icon.  Attempting to convert it with icoconvert.com ...`)
    await img2ico(img)
    let icon = img.replace(ext, '.ico')
    console.log(`${img} converted to ${icon}!`)
    await changeIcon(exe, icon)
  }
}

async function img2ico(img) {
  let ext = img.match(/\.[0-9a-z]+$/i)[0]
  let format = ext.replace('.', '')
  let options = {
    method: 'POST',
    url: 'https://icoconvert.com/upload.php',
    port: 443,
    formData: {
      uploaded: fs.createReadStream(img),
      submit: 'Convert Now!',
      icotype: 'cus',
      mulsize: 1,
      p16: 1,
      p24: 1,
      p32: 1,
      p48: 1,
      p64: 1,
      p96: 1,
      p128: 1,
      p192: 1,
      p256: 1,
      imgformat: format
    }
  }
  let url = await rp(options)
  url = url.match(/href="(.*?)" >/)[1]
  let filename = img.replace(ext, '.ico')
  return new Promise(async (resolve, reject) => {
    await rp.get(url).pipe(fs.createWriteStream(filename).on('finish', resolve))
  })
}

/**
 * Change the metadata of an executable file, such as version info.
 * @param {string} exe - The name of the executable file.
  * @param {{
  * CompanyName: string,
  * FileDescription: string, 
  * FileVersion: string,
  * LegalCopyright: string,
  * OriginalFilename: string,
  * ProductName: string,
  * ProductVersion: string
  * }} metaData - The desired metadata. FileVersion and ProductVersion must be formatted like 1.2.3.4
 */
changeIcon.changeMetaData = async function (exe, metaData) {
  console.log('Generating metadata script from the following data:')
  console.log(metaData)
  await writeScript(metaData)
  console.log('Compiling metadata script ...')
  await compileScript(path.join(__dirname, 'metadata.rc'))
  console.log(`Changing metadata of ${exe} ...`)
  await changeMetaData(exe, path.join(__dirname, 'metadata.res'))
  console.log('Metadata updated!')
}

async function writeScript(metaData) {
  metaData.FileVersion = metaData.FileVersion || '1.0.0.0'
  metaData.ProductVersion = metaData.ProductVersion || '1.0.0.0'
  let FILEVERSION = metaData.FileVersion.replace(/\./g, ',')
  let PRODUCTVERSION = metaData.ProductVersion.replace(/\./g, ',')
  let keys = Object.keys(metaData)
  keys.forEach(key => { metaData[key] = `            VALUE "${key}", "${metaData[key]}\\0"` })
  let block = Object.values(metaData).join(`\n`)
  let scriptContents = fs
    .readFileSync(path.join(__dirname, 'template.rc'), 'utf8')
    .replace('${FILEVERSION}', FILEVERSION)
    .replace('${PRODUCTVERSION}', PRODUCTVERSION)
    .replace('${block}', block)
  fs.writeFileSync(path.join(__dirname, 'metadata.rc'), scriptContents)
}

async function compileScript(scriptFileName) {
  let args = `-o "${scriptFileName}" -s "${scriptFileName.replace('.rc', '.res')}" -a compile -r`
  run(`"${path.join(__dirname, 'resource_hacker', 'ResourceHacker.exe')}" ${args}`)
}

async function changeMetaData(exe, resFileName) {
  let args = `-o "${exe}" -s "${exe}" -a addoverwrite -r "${resFileName}" -m versioninfo,1`
  run(`"${path.join(__dirname, 'resource_hacker', 'ResourceHacker.exe')}" ${args}`)
}
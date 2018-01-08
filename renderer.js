// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const fs = require('fs')
const klaw = require('klaw')
const toBlob = require('stream-to-blob')
const through2 = require('through2')

const excludeDirFilter = through2.obj(function (item, enc, next) {
    if (!item.stats.isDirectory()) this.push(item)
    next()
})

document.getElementById('file-select').onchange = function(e) {
    let dir = e.target.files[0];
    if(dir) {
        const files = []
        klaw(dir.path)
            .pipe(excludeDirFilter)
            .on('data', file => files.push(file.path))
            .on('end', () => {
                files.forEach(file => {
                    // files path
                    toBlob(fs.createReadStream(file), function (err, blob) {
                        if (err) {
                            console.log(file)
                            return console.error(err.message)
                        }
                        console.log(file, blob)
                    })
                })
            })
    }
}

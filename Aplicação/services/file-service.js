module.exports = {
    sendDataFileToChaosPop,
    getDataFiles, 
    sendOntologyFileToChaosPop
}

const dataAccess = require('../data-access/file-access')

function sendDataFileToChaosPop({name, path}, cb) {
    //res - file id....to do anything
    dataAccess.sendDataFileToChaosPop(path, (err, res) => {
        if(err) return cb(err)
        cb();
    })
}

function getDataFiles(cb) {
    dataAccess.getDataFiles((err, res) => {
        if(err) return cb(err)
        return cb(null, {files: res})
    })
}

function sendOntologyFileToChaosPop({name, path}, cb) {
    //res - file id....to do anything
    dataAccess.sendOntologyFileToChaosPop(path, (err, res) => {
        if(err) return cb(err)
        cb();
    })
}

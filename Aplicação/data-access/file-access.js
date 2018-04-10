module.exports = {
    sendDataFileToChaosPop,
    getDataFiles, 
    sendOntologyFileToChaosPop
}

const api = 'http://localhost:8080/chaos/wsapi';
const dataFile = `${api}/fileManager`
const ontologyFile = `${api}/ontologyManager`

const req = require('request')
const fs = require('fs')

function sendDataFileToChaosPop(path, cb) {
    let url = `${dataFile}/addFile`
    let options = {
        url: url,
        formData: {
            file: fs.createReadStream(path)
        }
    }
    //res - file id 
    req.post(options, (err, res) => {
        if(err) return cb(err)
        cb(null, res)
    })
}

function getDataFiles(cb) {
    let url = `${dataFile}/listDataFiles`
    req(url, (err, res) => {
        if (err) return cb(err)
        let obj = JSON.parse(res.body.toString())
        cb(null, obj)
    })
}

function sendOntologyFileToChaosPop(path, cb) {
    //this endpoint doenst exist (/addFile)
    let url = `${ontologyFile}/addFile`
    let options = {
        url: url,
        formData: {
            file: fs.createReadStream(path)
        }
    }
    //res - ontology file id 
    req.post(options, (err, res) => {
        if(err) return cb(err)
        cb(null, res)
    })
}
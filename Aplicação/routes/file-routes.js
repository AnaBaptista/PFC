const express = require('express')
const router = express.Router()

module.exports = router

const service = require('../services/file-service')
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()

router.post('/dataFile', multipartMiddleware,  addDataFile)
router.get('/dataFiles', getDataFiles)

router.post('/ontologyFile', multipartMiddleware, addOntologyFile)

function addDataFile(req, res, next) {
    let file = req.files["file"];
    service.sendDataFileToChaosPop(file, (err) => {
        if(err) return next(err)
        res.status(200).end()
    })
}

function getDataFiles(req, res, next) {
    service.getDataFiles((err, resp) => {
        if(err) return next(err)
        let arr = {layout: false}
        Object.assign(arr, resp);
        res.render('partials/fileList', arr);
    })
}

function addOntologyFile(req, res, next) {
    let file = req.files["file"];
    service.sendOntologyFileToChaosPop(file, (err) => {
        if(err) return next(err)
        res.status(200).end()
    })
}
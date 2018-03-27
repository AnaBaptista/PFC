const express = require('express')
const router = express.Router()
const multer = require('multer')
const uploads = multer({dest: 'uploads/'})

const fileService = require('../services/file-reader.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', null);
});


router.post('/save',uploads.any(),(req, resp, next) => {
    let file = req.files[0]
    fileService.readfile(file.destination, file.filename,file.originalname,(err,file)=>{
        if(err) next(err)
        resp.render('partials/file',
            {layout:false,
                file:file
            })
    })
})
module.exports = router;
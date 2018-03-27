const fs = require('fs')

module.exports= {
    readfile
}

function readfile(destination,filename, originalname,cb) {
    let path2 = './'+destination+filename
    let file
    fs.readFile(path2, (err,data)=>{

        if(err) return cb(err)
        file=data
        console.log(file.toString())
        let x = {
            filecontent: file,
            originalname: originalname
        }

        cb(null,x)
    })
}


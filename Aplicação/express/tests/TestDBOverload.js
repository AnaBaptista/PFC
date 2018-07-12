Overload()
function Overload () {
  const async = require('async')
  const db = require('../data-access/mongodb-access')
  OverloadX(5,10,async,db) // 5 docs. 1 obj com 10 fields per doc
  OverloadX(5,100,async,db) // 5 docs. 1 obj com 10 fields per doc
  OverloadX(5,1000,async,db) // 5 docs. 1 obj com 10 fields per doc
  OverloadX(5,10000,async,db) // 5 docs. 1 obj com 10 fields per doc
  OverloadX(5,100000,async,db) // 5 docs. 1 obj com 10 fields per doc
}




function OverloadX (nrOfObjs, nrOfFieldsPerObj, async, db) {
  let times = []
  //let currDate = new Date().getTime()

  let objs = generateXObjWithYFields(nrOfObjs, nrOfFieldsPerObj)

  console.log(`************Starting to process ${nrOfObjs} docs with ${nrOfFieldsPerObj} fields per object ******************`)
  async.each(objs,
    (obj, callback) => {
      let currDate = new Date().getTime()
      db.sendDocToDb('Tests', obj, (err) => {
        if (err) callback(err)
        let iterTime = new Date().getTime() - currDate
        console.log(`Iteration finished, time : ${iterTime} ms`)
        times.push(iterTime)
        callback()
      })
    },
    (err)=>{
      if(err) console.log(err)
      let meanOfTimes = times.reduce((a, b) => a + b, 0)/5
      console.log(`************Finished processing, Mean of times for ${nrOfObjs} Files : ${meanOfTimes} in ms******************`)
    }
  )
}

function generateXObjWithYFields(nrOfObjs,nrOfFields){
  let arrOfObj = []
  let i,j, string
  for(j = 0; j< nrOfObjs; j++){
    let obj = {'id' : j+1}
    for(i =0; i<nrOfFields; i++){
      string= `field${i+1}`
      obj[string] = '0123456789'

    }
    arrOfObj.push(obj)
  }
  return arrOfObj
}

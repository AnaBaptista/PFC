Overload()
function Overload () {
  const async = require('async')
  const fileMaker = require('../../utils/fake-file-maker').makeFakeFile
  //OverloadX(5,1,5,async,fileMaker) //5 list with 1 indmap with 5 props of each
  // OverloadX(5,10,5,async,fileMaker) //5 list with 10 indmap with 5 props of each
  // OverloadX(5,100,5,async,fileMaker) //5 list with 100 indmap with 5 props of each
  // OverloadX(5,1000,5,async,fileMaker) //5 list with 1000 indmap with 5 props of each
  // OverloadX(5,10000,5,async,fileMaker) //5 list with 10000 indmap with 5 props of each
  // OverloadX(5,100000,5,async,fileMaker) //5 list with 100000 indmap with 5 props of each

  // OverloadX(1,5,5,async,fileMaker) //1 list with 5 indmap with 5 props of each
  // OverloadX(10,5,5,async,fileMaker) //10 list with 5 indmap with 5 props of each
  // OverloadX(100,5,5,async,fileMaker) //100 list with 5 indmap with 5 props of each
  // OverloadX(1000,5,5,async,fileMaker) //1000 list with 5 indmap with 5 props of each
  // OverloadX(10000,5,5,async,fileMaker) //10000 list with 5 indmap with 5 props of each
  // OverloadX(100000,5,5,async,fileMaker) //100000 list with 5 indmap with 5 props of each
  //
  // OverloadX(5,5,1,async,fileMaker) //5 list with 5 indmap with 1 props of each
  // OverloadX(5,5,10,async,fileMaker) //5 list with 5 indmap with 10 props of each
  // OverloadX(5,5,100,async,fileMaker) //5 list with 5 indmap with 100 props of each
  // OverloadX(5,5,1000,async,fileMaker) //5 list with 5 indmap with 1000 props of each
  // OverloadX(5,5,10000,async,fileMaker) //5 list with 5 indmap with 10000 props of each
  // OverloadX(5,5,100000,async,fileMaker) //5 list with 5 indmap with 100000 props of each
}

function OverloadX (nrOfLists, nrOfObjs, nrOfFieldsPerObj, async, fileMaker) {
  let times = []
  let indMapListOfLists = generateLists(nrOfObjs,nrOfFieldsPerObj,nrOfLists)

  console.log(`************Starting to process ${nrOfLists} Lists with ${nrOfObjs} Individual Mappings with ${nrOfFieldsPerObj} Properties per IndMap ******************`)
  async.each(indMapListOfLists,
    (listOfIndMaps, callback) => {
      let currDate = new Date().getTime()
      fileMaker( listOfIndMaps, (err) => {
        if (err) callback(err)
        let iterTime = new Date().getTime() - currDate
        console.log(`Iteration finished, time : ${iterTime} ms`)
        times.push(iterTime)
        callback()
      })
    },
    (err) =>{
      if (err) return console.log(err)
      let meanOfTimes = times.reduce((a, b) => a + b, 0)/nrOfLists
      console.log(`************Finished processing, Mean of times for ${nrOfLists} Lists : ${meanOfTimes} in ms******************`)
    }
  )
}

function generateLists (nrOfObjs, nrOfFields, nrOfLists) {
  let list = []
  let i
  for(i=0;i<nrOfLists;i++)
    list.push(gererateXindMapsWithYPropsOfEach(nrOfObjs,nrOfFields))
  return list
}

function gererateXindMapsWithYPropsOfEach(nrOfObjs, nrOfFields) {
  let listOfIndMaps = []
  let i,j
  for(j = 0; j< nrOfObjs; j++){
    let indMap = {
      '_id': 'testeFaekFileMakerOverload',
      'originalIndividualName' : 'IndMap for testeFileMakerOverload',
      'dataPropsOriginal' : [],
      'objectPropsOriginal' : [],
      'annotationPropsOriginal' : []
    }
    for(i =0; i<nrOfFields; i++){
      indMap.dataPropsOriginal.push({
        'value': 'data prop',
        'id': 'dataProp'
      })
      indMap.objectPropsOriginal.push({
        'value': {
          'name': 'obj name'
        },
        'id': 'objProp'
      })
      indMap.annotationPropsOriginal.push({
        'value': 'annotation prop',
        'id': 'annProp'
      })
    }
    listOfIndMaps.push(indMap)
  }
  return listOfIndMaps
}

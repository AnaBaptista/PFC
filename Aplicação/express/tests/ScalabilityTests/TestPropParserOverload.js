Overload()

function Overload () {
  const async = require('async')
  const parser = require('../../utils/properties-parser')
  //**********************************************Annotation Test***************************************************//
  // OverloadX(5,1,async,parser.parseAnnotationProperties, generateXInMapWithYAnnProps, 'Annotation') // 5 indmaps. 1 indmap com 1 annotation per doc
  // OverloadX(5,10,async,parser.parseAnnotationProperties, generateXInMapWithYAnnProps, 'Annotation') // 5 indmaps. 10 indmap com 1 annotation per doc
  // OverloadX(5,100,async,parser.parseAnnotationProperties, generateXInMapWithYAnnProps, 'Annotation') // 5 indmaps. 100 indmap com 1 annotation per doc
  // OverloadX(5,1000,async,parser.parseAnnotationProperties, generateXInMapWithYAnnProps, 'Annotation') // 5 indmaps. 1000 indmap com 1 annotation per doc
  // OverloadX(5,10000,async,parser.parseAnnotationProperties, generateXInMapWithYAnnProps, 'Annotation') // 5 indmaps. 10000 indmap com 1 annotation per doc
  // OverloadX(5,100000,async,parser.parseAnnotationProperties, generateXInMapWithYAnnProps, 'Annotation') // 5 indmaps. 100000 indmap com 1 annotation per doc

  // OverloadX(1,5,async,parser.parseAnnotationProperties, generateXInMapWithYAnnProps, 'Annotation') // 1 indmaps. 5 indmap com 1 annotation per doc
  // OverloadX(10,5,async,parser.parseAnnotationProperties, generateXInMapWithYAnnProps, 'Annotation') // 10 indmaps. 5 indmap com 1 annotation per doc
  // OverloadX(100,5,async,parser.parseAnnotationProperties, generateXInMapWithYAnnProps, 'Annotation') // 100 indmaps. 5 indmap com 1 annotation per doc
  // OverloadX(1000,5,async,parser.parseAnnotationProperties, generateXInMapWithYAnnProps, 'Annotation') // 1000 indmaps. 5 indmap com 1 annotation per doc
  // OverloadX(10000,5,async,parser.parseAnnotationProperties, generateXInMapWithYAnnProps, 'Annotation') // 10000 indmaps. 5 indmap com 1 annotation per doc
  // OverloadX(100000,5,async,parser.parseAnnotationProperties, generateXInMapWithYAnnProps, 'Annotation') // 100000 indmaps. 5 indmap com 1 annotation per doc
  //**********************************************Data Test***************************************************//
  // OverloadX(5,1,async,parser.parseDataProperties, generateXInMapWithYDataProps, 'Data') // 5 indmaps. 1 indmap com 1 Data per doc
  // OverloadX(5,10,async,parser.parseDataProperties, generateXInMapWithYDataProps, 'Data') // 5 indmaps. 10 indmap com 1 Data per doc
  // OverloadX(5,100,async,parser.parseDataProperties, generateXInMapWithYDataProps, 'Data') // 5 indmaps. 100 indmap com 1 Data per doc
  // OverloadX(5,1000,async,parser.parseDataProperties, generateXInMapWithYDataProps, 'Data') // 5 indmaps. 1000 indmap com 1 Data per doc
  // OverloadX(5,10000,async,parser.parseDataProperties, generateXInMapWithYDataProps, 'Data') // 5 indmaps. 10000 indmap com 1 Data per doc
  // OverloadX(5,100000,async,parser.parseDataProperties, generateXInMapWithYDataProps, 'Data') // 5 indmaps. 100000 indmap com 1 Data per doc
  //
  // OverloadX(1,5,async,parser.parseDataProperties, generateXInMapWithYDataProps, 'Data') // 1 indmaps. 5 indmap com 1 Data per doc
  // OverloadX(10,5,async,parser.parseDataProperties, generateXInMapWithYDataProps, 'Data') // 10 indmaps. 5 indmap com 1 Data per doc
  // OverloadX(100,5,async,parser.parseDataProperties, generateXInMapWithYDataProps, 'Data') // 100 indmaps. 5 indmap com 1 Data per doc
  // OverloadX(1000,5,async,parser.parseDataProperties, generateXInMapWithYDataProps, 'Data') // 1000 indmaps. 5 indmap com 1 Data per doc
  // OverloadX(10000,5,async,parser.parseDataProperties, generateXInMapWithYDataProps, 'Data') // 10000 indmaps. 5 indmap com 1 Data per doc
  // OverloadX(100000,5,async,parser.parseDataProperties, generateXInMapWithYDataProps, 'Data') // 100000 indmaps. 5 indmap com 1 Data per doc
  //**********************************************Object Test***************************************************//
  // OverloadX(5,1,async,parser.parseObjectProperties, generateXInMapWithYObjProps, 'Object') // 5 indmaps. 1 indmap com 1 Data per doc
  // OverloadX(5,10,async,parser.parseObjectProperties, generateXInMapWithYObjProps, 'Object') // 5 indmaps. 10 indmap com 1 Data per doc
  // OverloadX(5,100,async,parser.parseObjectProperties, generateXInMapWithYObjProps, 'Object') // 5 indmaps. 100 indmap com 1 Data per doc
  // OverloadX(5,1000,async,parser.parseObjectProperties, generateXInMapWithYObjProps, 'Object') // 5 indmaps. 1000 indmap com 1 Data per doc
  // OverloadX(5,10000,async,parser.parseObjectProperties, generateXInMapWithYObjProps, 'Object') // 5 indmaps. 10000 indmap com 1 Data per doc
  // OverloadX(5,100000,async,parser.parseObjectProperties, generateXInMapWithYObjProps, 'Object') // 5 indmaps. 100000 indmap com 1 Data per doc
  //
  // OverloadX(1,5,async,parser.parseObjectProperties, generateXInMapWithYObjProps, 'Object') // 1 indmaps. 5 indmap com 1 Data per doc
  // OverloadX(10,5,async,parser.parseObjectProperties, generateXInMapWithYObjProps, 'Object') // 10 indmaps. 5 indmap com 1 Data per doc
  // OverloadX(100,5,async,parser.parseObjectProperties, generateXInMapWithYObjProps, 'Object') // 100 indmaps. 5 indmap com 1 Data per doc
  // OverloadX(1000,5,async,parser.parseObjectProperties, generateXInMapWithYObjProps, 'Object') // 1000 indmaps. 5 indmap com 1 Data per doc
  // OverloadX(10000,5,async,parser.parseObjectProperties, generateXInMapWithYObjProps, 'Object') // 10000 indmaps. 5 indmap com 1 Data per doc
  // OverloadX(100000,5,async,parser.parseObjectProperties, generateXInMapWithYObjProps, 'Object') // 100000 indmaps. 5 indmap com 1 Data per doc
}

function OverloadX (nrOfObjs, nrOfFieldsPerObj, async, parser, generator, type) {
  let times = []
    let indMapList = generator(nrOfObjs, nrOfFieldsPerObj)

  console.log(`************Starting to process ${nrOfObjs} Individual Mappings with ${nrOfFieldsPerObj} ${type} Properties per IndMap ******************`)
  async.each(indMapList,
    (indmap, callback) => {
      let currDate = new Date().getTime()
      parser(indmap.props,indmap.nodeId,indmap.dataFileId, (err, parsedprops) => {
        if (err) callback(err)
        let iterTime = new Date().getTime() - currDate
        console.log(`[${type}]Iteration finished, time : ${iterTime} ms`)
        times.push(iterTime)
        callback()
      })
    },
    (err) =>{
      if (err) return console.log(err)
      let meanOfTimes = times.reduce((a, b) => a + b, 0)/nrOfObjs
      console.log(`************Finished processing, [${type}]Mean of times for ${nrOfObjs} Individual Mappings : ${meanOfTimes} in ms******************`)
    }
  )
}

function generateXInMapWithYAnnProps (nrOfObjs, nrOfFields) {
  let listOfIndMaps = []
  let i,j, string
  for(j = 0; j< nrOfObjs; j++){
    let indMap = {
      'nodeId': '5b479e8b4f0c007b11957787',
      'dataFileId': '5b479e8b4f0c007b11957785',
      'props': []
    }
    for(i =0; i<nrOfFields; i++){
      indMap.props.push({
        'annotation': 'label',
        'toMapNodeId': [
          '5b479e8b4f0c007b1195778c'
        ]
      })
    }
    listOfIndMaps.push(indMap)
  }
  return listOfIndMaps
}

function generateXInMapWithYDataProps (nrOfObjs, nrOfFields) {
  let listOfIndMaps = []
  let i,j, string
  for(j = 0; j< nrOfObjs; j++){
    let indMap = {
      'nodeId': '5b479e8b4f0c007b11957787',
      'dataFileId': '5b479e8b4f0c007b11957785',
      'props': []
    }
    for(i =0; i<nrOfFields; i++){
      indMap.props.push({
        'owlClassIRI': 'http://chaospop.sysresearch.org/ontologies/family.owl#hasName',
        'type': 'String',
        'toMapNodeId': [
          '5b479e8b4f0c007b1195778c'
        ]
      })
    }
    listOfIndMaps.push(indMap)
  }
  return listOfIndMaps
}

function generateXInMapWithYObjProps (nrOfObjs, nrOfFields) {
  let listOfIndMaps = []
  let i,j, string
  for(j = 0; j< nrOfObjs; j++){
    let indMap = {
      'nodeId': '5b479e8b4f0c007b11957787',
      'dataFileId': '5b479e8b4f0c007b11957785',
      'props': []
    }
    for(i =0; i<nrOfFields; i++){
      indMap.props.push({
        'owlClassIRI': 'http://chaospop.sysresearch.org/ontologies/family.owl#hasAncestor',
        'toMapNodeId': [
          '5b479e8b4f0c007b1195778c'
        ]
      })
    }
    listOfIndMaps.push(indMap)
  }
  return listOfIndMaps
}

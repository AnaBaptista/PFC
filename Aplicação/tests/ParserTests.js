testeParser()
const Parser = require('../utils/PropertiesParser')

function testeParser () {
  let objProps = [
    {
      owlIRI: 'owl iri',
      nodeIds: [
        {
          parentId: 12,
          toMapId: 34
        },
        {
          parentId: 45,
          toMapId: 67
        }
      ]
    },
    {
      owlIRI: 'owl iri',
      nodeIds: [
        {
          parentId: 12,
          toMapId: 34
        },
        {
          parentId: 45,
          toMapId: 67
        }
      ]
    }
  ]
  Parser.parseObjectProperties('5af093d445193e040736e20f', objProps, () => {})
}



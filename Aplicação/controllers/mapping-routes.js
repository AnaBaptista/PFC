const router = require('express')()

const service = require()

router.post('/map/:mapId/individual/:individualId/dataProperty', mapDataProperty)
router.post('/map/:mapId/individual/:individualId/objectProperty', mapObjectProperty)
router.post('/map/:mapId/individual/', mapIndividual)
router.post('/map', map)

/*
 * Creates a Data Property Mapping
 * Id's needed in path:
 * :mapId -> this id refers to the mapping id for the mapping that was created.
 * :individualId -> this id refers to the individual mapping id for the individual mapping that was created
 * If not present will return a 400 (Bad Request)
 *
 * Body Parameters or cookie parameters:
 * (list/array) dataProperties. An array with the previous mapped data properties with the name 'dataProperties'. If not present, creates a new empty one
 * (string) IRI. The OWK link to the property that is going to be mapped
 * (string) path. The path to the property to be mapped, starting in the node that is to be mapped.
 *                Eg: mapping datatype property 'firstName' from node <member> with child <name> that also has another child <firstName>. the path should be: name-firstName
 * (string) dataType. The data type that its being mapper. DataTypes accepted: ['Boolean', 'Double', 'Float','Integer','String']
 */

function mapDataProperty (req, res, next) {

}

/*
 * Creates an Object Property Mapping
 * Id's needed in path:
 * :mapId -> this id refers to the mapping id for the mapping that was created.
 * :individualId -> this id refers to the individual mapping id for the individual mapping that was created
 * If not present will return a 400 (Bad Request)
 *
 * Body Parameters or cookie parameters:
 * (list/array) objectProperties. An array with the previous mapped object properties with the name 'objectProperties'. If not present, creates a new empty one.
 * (string) IRI. The OWK link to the object property that is going to be mapped
 * (string) path. The path to the property to be mapped, starting in the node that is to be mapped.
 *                Eg: mapping object property 'father' from node <member> with child <ancestor> that also has another child <father>. the path should be: ancestor-father
 */

function mapObjectProperty (req, res, next) {

}

/*
 * Creates an Individual Mapping
 * Id's needed in path:
 * :mapId -> this id refers to the mapping id for the mapping that was created.
 * If not present will return a 400 (Bad Request)
 *
 * Body Parameters:
 * (string) tag. The node's tag
 * (string) name. A name (?)
 * (string) label. A label (?)
 * (boolean) specification. It indicates that the created individual will modify the class of a previously created individual, as this is a subclass of the previously assigned class
 * (string) IRI. The OWL IRI that identifies the OWL class that is being mapped
 * ******** DEPENDENDO DA IMPLEMENTAÇÃO ************************
 * (list/array) objectProperties. The list of ObjectProperties
 * (list/array) objectProperties. The list of ObjectProperties
 */

function mapIndividual (req, res, next) {

}

/*
 * Creates a Mapping
 *
 * Body Parameters:
 * (string) outputOntologyFileName. The name of the Ontology file to be downloaded
 * (string) outputOntologyNamespace. The Namespace of the Ontology file to be downloaded
 * (list/array) fileList. The file list (?)
 * (list/array) directOntologyImports. The directly imported ontologies IRI array/list
 * ******** DEPENDENDO DA IMPLEMENTAÇÃO ************************
 * (list/array) individualMappings. The individuals mappings
 */


function map (req, res, next) {

}
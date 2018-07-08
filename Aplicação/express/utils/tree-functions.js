/**
 * It transforms an array to tree
 * @param list {Array}
 * @returns {{id: *, tag: *, children: Array}|*}
 */
function listToTree (list) {
  let parent = list.filter(object => !object.parent)
  parent = {
    id: parent[0]._id,
    tag: parent[0].tag,
    children: []
  }
  list = list.filter(object => object.parent)
  let nodes = []
  let i = 0
  list.forEach(node => {
    nodes[i] = {
      id: list[i]._id,
      tag: list[i].tag,
      value: list[i].value,
      parentid: list[i].parent,
      children: [],
      dataFileId: list[i].dataFileId
    }
    i++
  })
  parent.children = recursiveListToTree(nodes, parent)
  return parent
}

function recursiveListToTree (list, parent, tree) {
  if (!tree) {
    tree = []
  }

  let children = list.filter(child => child.parentid === parent.id)

  if (children) {
    if (!parent.parentid) {
      tree = children
    } else {
      parent.children = children
    }
    children.forEach(child => recursiveListToTree(list, child, tree))
  }
  return tree
}

/**
 * It searchs for speficied node on tree and returns it
 * @param tree {Object} tree object
 * @param id {String} node id to search
 * @returns {*}
 */
function searchById (tree, id) {
  let cnode
  if (tree !== null) {
    cnode = recursiveSearchById(tree, id)
  }
  return cnode
}

function recursiveSearchById (tree, id) {
  let cnode
  let i = 0
  if (tree.id === id) {
    cnode = tree
  } else if (tree.children.length !== 0) {
    i = 0
    while (!cnode && i < tree.children.length) {
      cnode = recursiveSearchById(tree.children[i], id)
      i++
    }
  }
  return cnode
}

module.exports = {
  listToTree,
  searchById
}

function drawIndentedTree (root, id) {
  root = {children: [root], id: 0}
  let margin = {
    top: -10,
    bottom: 10,
    left: 0,
    right: 10
  }
  let width = 300,
    minHeight = 800,
    barHeight = 20,
    barWidth = 50

  let i = 0, duration = 200

  let tree = d3.layout.tree()
    .nodeSize([0, 20])

  let diagonal = d3.svg.diagonal()
    .projection(function (d) { return [d.y, d.x] })

  let svg = d3.select(`#${id}`).append('svg')
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

// set initial coordinates
  root.x0 = 0
  root.y0 = 0

  function collapse (d) {
    if (d.children) {
      d.numOfChildren = d.children.length
      d._children = d.children
      d._children.forEach(collapse)
      d.children = null
    } else {
      d.numOfChildren = 0
    }
  }

  root.children.forEach(collapse)
  update(root)

  function update (source) {
    // Compute the flattened node list. TODO use d3.layout.hierarchy.
    let nodes = tree.nodes(root)

    let height = Math.max(minHeight, nodes.length * barHeight + margin.top + margin.bottom)

    d3.select('svg').transition()
      .duration(duration)
      .attr('height', height)

    // Compute the "layout".
    nodes.forEach(function (n, i) {
      n.x = i * barHeight
      // n.y = n.depth * 20
    })

    // Update the nodes…
    let node = svg.selectAll('.node')
      .data(nodes, function (d) {
        return d.index || (d.index = ++i)
      })

    let nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .style('opacity', 0.001)
      .attr('transform', function (d) {
        return `translate(${source.y0}, ${source.x0})`
      })
      .attr('id', (d) => {
        return `${d.id}`
      })

    // Enter any new nodes at the parent's previous position.
    nodeEnter.append('rect')
      .attr('y', -barHeight / 4)
      .attr('x', -barWidth / 8)
      .attr('height', barHeight / 2)
      .attr('width', barWidth / 4)
      .attr('rx', 7)
      .attr('ry', 7)
      .on('click', click)

    nodeEnter.append('text')
      .attr('dy', 4)
      .attr('dx', -3)
      .attr('id', 'text-symbol')

    node.select('text[id=text-symbol]').text(symbol)

    nodeEnter.append('text')
      .attr('dy', 5)
      .attr('dx', 16)
      .attr('id', 'text-tag')
      .on('click', showNode)
      .text(function (d) {
        let ret = d.tag
        if (d.value) {
          ret = `${ret} value: ${d.value}`
        }
        return ret
      })

    // Transition nodes to their new position.
    nodeEnter.transition()
      .duration(duration)
      .attr('transform', function (d) { return `translate(${d.y}, ${d.x})` })
      .style('opacity', 1)

    node.transition()
      .duration(duration)
      .attr('transform', function (d) { return `translate(${d.y}, ${d.x})` })
      .style('opacity', 1)
      .select('rect')
      .style('opacity', 1)

    // Transition exiting nodes to the parent's new position.
    node.exit().transition()
      .duration(duration)
      .attr('transform', function (d) { return `translate(${source.y}, ${source.x})` })
      .style('opacity', 1e-6)
      .remove()
  }

  // Toggle children on click.
  function click (d) {
    if (d.children) {
      d._children = d.children
      d.children = null
    } else {
      d.children = d._children
      d._children = null
    }
    update(d)
  }

  function symbol (d) {
    return d._children ? (d._children.length === 0 ? '' : '+') : d.children ? '-' : ''
  }

  function showNode (d) {
    changeDataFileTerm(d)
  }
}

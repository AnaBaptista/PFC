function drawIndentedTree (root, wherein) {
  root = {children: [root]}
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

  let svg = d3.select(`#${wherein}`).append('svg')
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

    // Enter any new nodes at the parent's previous position.
    nodeEnter.append('rect')
      .attr('y', -barHeight / 2)
      .attr('height', barHeight)
      .attr('width', barWidth)
      .style('fill', color)
      .on('click', click)

    nodeEnter.append('text')
      .attr('dy', 5)
      .attr('dx', 14)
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
      .style('fill', color)

    // Transition exiting nodes to the parent's new position.
    node.exit().transition()
      .duration(duration)
      .attr('transform', function (d) { return `translate(${source.y}, ${source.x})` })
      .style('opacity', 1e-6)
      .remove()

    // Stash the old positions for transition.
    root.each(function (d) {
      d.x0 = d.x
      d.y0 = d.y
    })
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

  function color (d) {
    // return d._children ? '#FFFFFF' : d.children ? '#FFFFFe' : '#FFFFF2'
    return d.children ? '#FFFFFF' : d._children ? '#FFFFFF' : '#FFFFF2'
  }

  function check(d) {
    d.Selected = !d.Selected;
    d3.select(this).style("opacity", boxStyle(d));
  }

  function boxStyle(d) {
    return d.Selected ? 1 : 0;
  }
}

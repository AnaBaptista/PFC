function id (d) { return d.Country ? d.Country : d.key };

var width = 960,
  height = 500

var layout = d3.layout.indent()
  .sort(function(a, b) { return d3.ascending(id(a), id(b)) })
  .children(function(d) { return d.values; })
  .nodeSize([10, 15])
  .separation(function(node, previousNode) { return node.parent === previousNode.parent || node.parent === previousNode ? 1 : 2; });

var nestAlpha = d3.nest()
  .key(function(d) { return d.Country.slice(0,1); });

var nestContinent = d3.nest()
  .key(function(d) { return d.Continent; });

d3.csv("countries.csv", function(error, countries) {
  var svg = d3.select("body").append("svg")
    .attr({
      width: width,
      height: height
    })
    .append("g")
    .attr("transform", "translate(10,10)");

  var continents = {
    key: "Countries",
    values: nestContinent.entries(countries)
  };

  var alphabet = {
    key: "Countries",
    values: nestAlpha.entries(countries)
  };

  var countries = {
    key: "Countries",
    values: countries
  }

  function update(tree) {
    var nodes = layout(tree);

    labels = svg.selectAll(".label")
      .data(nodes, function(d) { return d.Country + d.key });

    labels.enter()
      .append("text")
      .attr({
        "class": "label",
        dy: ".35em",
        transform: function(d) { return "translate(" + (d.x - 200) + "," + d.y + ")"; }
      })
      .style("font-weight", function(d) { return d.Country ? null : "bold" })
      .text(function(d) { return id(d); });

    labels.transition().delay(250).duration(1000)
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    labels.exit().transition()
      .attr("transform", function(d) { return "translate(" + (d.x - 200) + "," + d.y + ")"; })
      .remove()
  }

  function init() {
    update(countries);
    setTimeout(function() { update(continents) }, 3000);
    setTimeout(function() { update(alphabet) }, 6000);
    setTimeout(init, 9000);
  }

  init();
});
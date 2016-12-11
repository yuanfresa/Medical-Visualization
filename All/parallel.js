var margin = {top: 40, right: 20, bottom: 10, left: 10},
    p_width = 1210 - margin.left - margin.right,
    p_height = 300 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangePoints([0, p_width], 1),
    y = {},
    dragging = {};

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;

var color = d3.scale.ordinal()
    .range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf","#ff9896","#ffbb78","#9edae5","#dbdb8d"]);

var parallel_group = d3.select("svg")
    // .attr("width", p_width + margin.left + margin.right)
    // .attr("height", p_height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("id","parallel");

x.domain(dimensions = _data.names.filter(function(d) {
    return d != "name" && (y[d] = d3.scale.linear()
        .domain(d3.extent(data, function(p) { return +p[d]; }))
        .range([p_height, 0]));
  }));

  // Add grey background lines for context.
  background = parallel_group.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", path);

  // Add blue foreground lines for focus.
  foreground = parallel_group.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", path)
      .style("stroke", function(d) { return color(d.clusterID); });

  // Add a group element for each dimension.
  var g = parallel_group.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      .call(d3.behavior.drag()
        .origin(function(d) { return {x: x(d)}; })
        .on("dragstart", function(d) {
          dragging[d] = x(d);
          background.attr("visibility", "hidden");
        })
        .on("drag", function(d) {
          dragging[d] = Math.min(p_width, Math.max(0, d3.event.x));
          foreground.attr("d", path);
          dimensions.sort(function(a, b) { return position(a) - position(b); });
          x.domain(dimensions);
          g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
        })
        .on("dragend", function(d) {
          delete dragging[d];
          transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
          transition(foreground).attr("d", path);
          background
              .attr("d", path)
            .transition()
              .delay(500)
              .duration(0)
              .attr("visibility", null);
        }));

  // Add an axis and title.
  g.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; });

    var legend = g.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 18 + ")"; })
      //.style("font", "10px sans-serif");

      legend.append("text")
      .attr("x", p_width - 16)
      .attr("y", 5)
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .text(function(d,i) { return i; });

      legend.append("rect")
      .attr("x", p_width - 10)
      .attr("width", 18)
      .attr("height", 10)
      .attr("fill", color);
      
  // Add and store a brush for each axis.
  g.append("g")
      .attr("class", "brush")
      .each(function(d) {
        d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
      })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);
//});

function position(d) {
  var v = dragging[d];
  return v == null ? x(d) : v;
}

function transition(g) {
  return g.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
}

function brushstart() {
  d3.event.sourceEvent.stopPropagation();
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
      extents = actives.map(function(p) { return y[p].brush.extent(); });
  foreground.style("display", function(d) {
    return actives.every(function(p, i) {
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    }) ? null : "none";
  });
}

function showParallelMean(){

}

function showParallelAll(){

}

function showParallelCluster(index){

}

function ClearParallel(){

}
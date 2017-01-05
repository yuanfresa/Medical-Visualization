var margin = {top: 40, right: 40, bottom: 10, left: 10},
    p_width = width_window - margin.left - margin.right,
    p_height = height_window *0.55 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangePoints([0, p_width], 1),
    y = {},
    dragging = {};

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground,
    p_mean;

var color = d3.scale.ordinal()
    .range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf","#ff9896","#ffbb78","#9edae5","#dbdb8d"]);

var parallel_group = d3.select("svg")
   .append("g")
    .attr("transform", "translate(" + margin.left + "," + 0.45*height_window + ")")
    .attr("id","parallel");

x.domain(dimensions = _data.names.filter(function(d) {
  return d != "name" && (y[d] = d3.scale.linear()
      .domain(d3.extent(data, function(p) { return +p[d]; }))
      .range([p_height, 0]));
}));

// Add blue foreground lines for focus.
foreground = parallel_group.append("g")
    .attr("class", "foreground")
  .selectAll("path")
    .data(data)
  .enter().append("path")
    .attr("d", path)
    .style("stroke", function(d) { return color(d.clusterID); });

//Add mean value lines
p_mean = parallel_group.append("g")
    .attr("class", "mean")
  .selectAll("path")
    .data(mean)
  .enter().append("path")
    .attr("d", mean_path)
    .style("stroke", function(d,i) { return color(i); })
    .style("display","none");


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
      })
      .on("drag", function(d) {
        dragging[d] = Math.min(p_width, Math.max(0, d3.event.x));
        if(!p_showMean){
        foreground.attr("d", path); }
        else {
        p_mean.attr("d", mean_path);}
        dimensions.sort(function(a, b) { return position(a) - position(b); });
        x.domain(dimensions); 
        g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
      })
      .on("dragend", function(d,i) {
        delete dragging[d];
        if(!p_showMean){
        transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")"); //console.log(x(d));console.log(d);
        transition(foreground).attr("d", path).duration(500);}
        else {
          transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
          transition(p_mean).attr("d", mean_path).duration(500);}
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

var legend = parallel_group.selectAll(".legend")
  .data(color.domain())
  .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(10," + i * 18 + ")"; })
    .style("opacity", 1)
    .on("click", function(d, i){
          ClickLegendParallel(i);
      });

    legend.append("text")
    .attr("x", p_width - 6)
    .attr("y", 5)
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .text(function(d,i) { return i; });

    legend.append("rect")
    .attr("x", p_width)
    .attr("width", 10)
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

function position(d) {
  var v = dragging[d];
  return v == null ? x(d) : v;
}

function transition(g) {
  return g.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) { 
    return [position(p), y[p](d[p])]; }));
}

function mean_path(d) {
  return line(dimensions.map(function(p,i) { return [position(p), y[p](d[i])]; }));
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

var p_showMean=false;
showParallelAll();
// showParallelMean();
// ClearParallel();
// // showParallelMean();
// // ClearParallel();
// showParallelCluster(2);
// showParallelCluster(7);
// ClearParallel();

function showParallelMean(){
  parallel_cleared = true;
  p_showMean=true;
  foreground.style("display","none");
  p_mean.style("display",null);

  for(var i = 0; i < legend[0].length; i++)
    legend[0][i].style.opacity = 1;
}

function showParallelAll(){
  parallel_cleared = true;
  p_showMean=false;
  foreground.style("display",null);
  p_mean.style("display","none");

  for(var i = 0; i < legend[0].length; i++)
    legend[0][i].style.opacity = 1;
}

function showParallelCluster(index){

  if(parallel_cleared)
  {
    parallel_cleared=false;
    p_mean.style("display","none");
    foreground.style("display","none");

    for(var i = 0; i < legend[0].length; i++)
      legend[0][i].style.opacity = 0.2;
  }

  if(p_showMean)
    p_mean.filter(function(d,i) { return i== index })  
            .style("display", null);
  else
    foreground.filter(function(d) { return d.clusterID== index })  
              .style("display", null);

  legend[0][index].style.opacity = 1;
}

var parallel_cleared = true;

function ClearParallel(){
  
  parallel_cleared = true;
  p_mean.style("display","none");
  foreground.style("display","none");

  p_showMean?showParallelMean():showParallelAll();
}

function ClickLegendParallel(index)
{
  if(legend[0][index].style.opacity == 1)
  {
    legend[0][index].style.opacity = 0.2;
    if(p_showMean)
      p_mean.filter(function(d,i) { return i== index;})  
            .style("display", "none");
    else
      foreground.filter(function(d) { return d.clusterID== index; })  
              .style("display", "none");

    ClickLegendChord(index, "none");
  }
  else
  {
    legend[0][index].style.opacity = 1;
    if(p_showMean)
      p_mean.filter(function(d,i) { return i== index;})  
            .style("display", null);
    else
      foreground.filter(function(d) { return d.clusterID== index; })  
              .style("display", null);

    ClickLegendChord(index, null);
  }
}

function EmptyParallel()
{
  parallel_cleared = false;
  p_mean.style("display","none");
  foreground.style("display","none");

  for(var i = 0; i < legend[0].length; i++)
    legend[0][i].style.opacity = 0.2;
}
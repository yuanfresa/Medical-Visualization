var margin_h = { top: 100, right: 80, bottom: 50, left: 80 },
    row_num = cluster_names.length,
    col_num = marker_names.length,
    width_h = 960 - margin_h.left - margin_h.right,  //
    height_h = 630 - margin_h.top - margin_h.bottom, //
    gridSize = Math.floor(width_h / col_num),
    legendWidth = gridSize * 1.5;

 
 //color -> mean 

var maxMean = d3.max(d3.max(mean_matrix))[0],
    maxMean = Math.floor(maxMean)+1,
    buckets = 10,
    colors1 = colorbrewer.RdYlGn[buckets],
    colors_h = [];
    for (var i = 0; i < colors1.length; i++) {
      colors_h[i] = colors1[colors1.length-i-1];
    }
var colorScale_h = d3.scale.quantile()    // is a function
    .domain([0, maxMean])
    .range(colors_h);
    

var svg = d3.selectAll("svg")
        // .attr("width", width_h + margin_h.left + margin_h.right)
        // .attr("height", height_h + margin_h.top + margin_h.bottom)
        .append("g")
        .attr("id","heatmap")
        .attr("transform", "translate(" + margin_h.left + "," + margin_h.top + ")");

draw_heatmap(data_heatmap);

function ShowChordCluster(index)
{
  console.log("Chord of cluster : " + index);
}

function ShowChordMarker(index)
{
  console.log("Chord of marker : " + index);
}
function ShowParallelCluster(index)
{
  console.log("Parallel of cluster : " + index);
}

function draw_highlight_row(row) 
{
  console.log("highlight of row" + row);
  var highlight_row= svg.selectAll(".highlight_row")
      .append('rect')
      .attr("x", 0)
      .attr("y", gridSize * row)
      .attr("rx", 1)
      .attr("ry", 1)
      .attr("class", "cell-hover")
      .attr("width", gridSize*col_num)  
      .attr("height", gridSize) 
}

function draw_heatmap(data)
{
  // cluster y axis->row labels
  var rowLabels = svg.selectAll(".rowLabel")
      .data(cluster_names)
      .enter().append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return i * gridSize; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
        .attr("class", function (d,i) { return "cluster_names mono r" + i;})
        .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
        .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);})
        .on("click", function(d,i) {ShowChordCluster(i); ShowParallelCluster(i);})
  //marker x axis -> col labels    
  var colLabels = svg.selectAll(".colLabel")
      .data(marker_names)
      .enter().append("text")
        .text(function(d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return i * gridSize; })
        .style("text-anchor", "left")
        .attr("transform", "translate(" + gridSize / 2 + ", -6) rotate(-90)") 
        .attr("class", function (d,i) { return "marker_names mono r" + i;})
        .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
        .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);})
        .on("click", function(d,i) {
               ShowChordMarker(i);
          //highlight text
               draw_highlight_row(i);

        })
  
  //heatmap
  var heatMap = svg.selectAll(".heatMap")
      .data(data)
      .enter().append("rect")
      .attr("x", function(d) { return (d.dim_col - 1 + (1-Math.sqrt(d.variance_nor ))/2 ) * gridSize; })
      .attr("y", function(d) { return (d.dim_row - 1 + (1-Math.sqrt(d.variance_nor))/2) * gridSize; })
      .attr("rx", 1)
      .attr("ry", 1)
      .attr("class", "dim2 bordered")
      .attr("width", function(d){ return gridSize * Math.sqrt(d.variance_nor)})  
      .attr("height", function(d){ return gridSize * Math.sqrt(d.variance_nor)}) 
      .style("fill", '#aaa')
      .attr("class", "square")
      .on('mouseover', function(d) {
               //Update the tooltip position and value
               d3.select("#tooltip")
                 .style("left", (d3.event.pageX+10) + "px")
                 .style("top", (d3.event.pageY-10) + "px")
                 .select("#value")
                 .text("mean：" + d.mean + "\nvariance:" + d.variance);  
               //Show the tooltip
               d3.select("#tooltip").classed("hidden", false);

               //highlight text
               d3.select(this).classed("cell-hover",true);
               d3.selectAll(".cluster_names").classed("text-highlight",function(r,ri){ return ri==(d.dim_row-1);});
               d3.selectAll(".marker_names").classed("text-highlight",function(c,ci){ return ci==(d.dim_col-1);});
          })
      .on('mouseout', function(){
               d3.select(this).classed("cell-hover",false);
               d3.selectAll(".cluster_names").classed("text-highlight",false);
               d3.selectAll(".marker_names").classed("text-highlight",false);
               d3.select("#tooltip").classed("hidden", true);
             });        

    heatMap.transition()
        .style("fill", function(d) { return colorScale_h(d.mean); });



    var legend = svg.selectAll(".legend")
              .data(colors_h)
              .enter().append("g")
              .attr("class", "legend");

    legend.append("rect")
      .attr("x", function(d, i) { return gridSize * i ; })
      .attr("y", gridSize * (row_num + 1))
      .attr("width", gridSize)
      .attr("height", gridSize)
      .style("fill", function(d) { return d; })
      .attr("class", "square");


    var title = svg.append("text")
          .attr("class", "legend")
          .attr("x", -60 )
          .attr("y", gridSize * (row_num + 2))      
          .style("font-size", "14px")
          .text("Legend");
    var low = svg.append("text")
          .attr("class", "low")
          .attr("x", 0 )
          .attr("y", gridSize * (row_num + 3))     
          .text("Low");
    var high = svg.append("text")
          .attr("class", "high")
          .attr("x", gridSize * 9 )
          .attr("y", gridSize * (row_num + 3))     
          .text("High");
};
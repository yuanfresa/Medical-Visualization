var margin_h = { top: 50, right: 0, bottom: 30, left: 75 },
    row_num = cluster_names.length,
    col_num = marker_names.length,
    width_h = width_window*0.6 - margin_h.left - margin_h.right,  //
    height_h = height_window*0.4 - margin_h.top - margin_h.bottom, //
    gridSize = Math.min(width_h / col_num, height_h/row_num),
    legendWidth = gridSize ;

 
 //color -> mean 

var maxMean = d3.max(d3.max(mean_matrix))[0],
    maxMean = Math.floor(maxMean)+1,
    colors_h = ["#006837","#1a9850","#66bd63","#a6d96a","#d9ef8b","#fee08b","#fdae61","#f46d43","#d73027","#a50026"];
var colorScale_h = d3.scale.quantile()    // is a function
    .domain([0, maxMean])
    .range(colors_h);
    

var heatmap_group = d3.selectAll("svg")
        .attr("id","heatmap")
        .attr("width", width_h)
        .attr("height", height_h)
        .append("g")      
        .attr("transform", "translate(" + margin_h.left + "," + margin_h.top + ")");

draw_heatmap(data_heatmap);


function draw_heatmap(data_heatmap)
{
  // cluster y axis->row labels
  var rowLabels = heatmap_group.append("g")
      .selectAll(".rowLabel")
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
        .on("click", function(d,i) {
          ShowChordCluster(i); 
          //ShowParallelCluster(i);
          //update highlight position 
          d3.select("#highlight")
                 .style("height", (gridSize) + "px")
                 .style("width", (gridSize * col_num ) + "px")
                 .style("left", (margin_h.left ) + "px")
                 .style("top", (margin_h.top + i*gridSize ) + "px");
          
               //Show the highlight
          d3.select("#highlight").classed("hidden", false);  
        })

  //marker x axis -> col labels    
  var colLabels = heatmap_group.append("g")
      .selectAll(".colLabel")
      .data(marker_names)
      .enter().append("text")
      .text(function(d) { return d; })
      .attr("x", function (d, i) { return i * gridSize; })
      .attr("y", 0)
      .style("text-anchor", "left")
      .attr("transform", "translate(" + gridSize / 2 + ", -6) rotate(-90)") 
      .attr("class", function (d,i) { return "marker_names mono r" + i;})
      .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
      .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);})
      .on("click", function(d,i) {
        ShowChordMarker(i);
        //update highlight position 
        d3.select("#highlight")
               .style("height", (gridSize * row_num ) + "px")
               .style("width", (gridSize) + "px")
               .style("left", (margin_h.left + i*gridSize) + "px")
               .style("top", (margin_h.top) + "px");
        
             //Show the highlight
        d3.select("#highlight").classed("hidden", false);       
      })
  //heatmap
  var heatMap = heatmap_group.append("g")
      .selectAll(".heatMap")
      .data(data_heatmap)
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



    var legend = heatmap_group.selectAll(".legend")
              .data(colors_h)
              .enter().append("g")
              .attr("class", "legend");

    legend.append("rect")
      .attr("x", gridSize * (col_num + 1))
      .attr("y", function(d, i) { return gridSize * i ; })
      .attr("width", gridSize)
      .attr("height", gridSize)
      .style("fill", function(d) { return d; })
      .attr("class", "square");


    var title = heatmap_group.append("text")
          .attr("class", "legend")
          .attr("x", gridSize * (col_num + 1))
          .attr("y", -10)      
          .style("font-size", "15px")
          .text("Legend");
    var low = heatmap_group.append("text")
          .attr("class", "low")
          .attr("x", gridSize * (col_num + 2) )
          .attr("y", gridSize/2)     
          .text("Low");
    var high = heatmap_group.append("text")
          .attr("class", "high")
          .attr("x", gridSize * (col_num + 2) )
          .attr("y", gridSize * 10)     
          .text("High");
};
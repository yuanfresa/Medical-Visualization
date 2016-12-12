//Color functions
// var c20b = d3.scale.category20();

function colores_google(n) {
  var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  return colores_g[n % colores_g.length];
}

//Draw SVG_chord
var width_chord = width_window * 0.4,
	height_chord = height_window * 0.4,
	outerRadius = Math.min(width_chord, height_chord) / 2 - 10,
	innerRadius = outerRadius - 24;
 
var formatPercent = d3.format(".1%");
 
var arc = d3.svg.arc()
			.innerRadius(innerRadius)
			.outerRadius(outerRadius);
 
var layout = d3.layout.chord()
				.padding(.04);
				// .sortSubgroups(d3.descending)
				// .sortChords(d3.ascending);
 
var path = d3.svg.chord()
				.radius(innerRadius);
 
// var svg = d3.select("body").append("svg")
			//.attr("transform", "translate(" + 100 + "," + 100 + ")")
			//.attr("width", width_chord)
			//.attr("height", height_chord);

draw_chord();

//Update show_marker_num and remove all drawings on SVG
function ClearChord()
{
	var e = document.getElementById("show_num");
  	show_marker_num = e.selectedIndex + 1;
  	show_all_cluster = true;

  	d3.selectAll("#circle").remove();
  	draw_chord();
}

function ShowChordImportance(num)
{
	show_all_cluster = true;
	show_marker_num = num;

	d3.selectAll("#circle").remove();
  	draw_chord();
}

function ShowChordCluster(index)
{

	var chord = svg.selectAll("#circle").selectAll(".chord")

	// if(show_all_cluster)
	// {
	// 	show_all_cluster = false;
	// 	chord.classed("unshow", true);
	// }

	// chord.classed("unshow", function(p) {
	// 	return (p.source.index != index
	// 	&& p.target.index != index) && this.classList.contains("unshow");
	// });
	
	i = index;

	if(show_all_cluster)
	{
		show_all_cluster = false;
		chord.classed("unshow", true);
	}

	chord.classed("unshow", function(p) {
		if(p.source.index == i || p.target.index == i)
			return !this.classList.contains("unshow");
		else
			return this.classList.contains("unshow");
	});
}

function ShowChordMarker(index)
{
	var chord = svg.selectAll("#circle").selectAll(".chord")
	var i =  cluster_names.indexOf(marker_names[index]);
	
	i = index;
	chord.classed("unshow", function(p) {
		if(p.source.index == i || p.target.index == i)
			return !this.classList.contains("unshow");
		else
			return this.classList.contains("unshow");
	});
}

//Draw chord
function draw_chord()
{
	for (var i = 0; i < group_names.length; i++)
	{
		matrix_part[i] = [];
		for (var j = 0; j < group_names.length; j++)
			matrix_part[i][j] = 0;
	}

	for (var i = 0; i < cluster_names.length; i++)
	{
		for (var j = 0; j < show_marker_num; j++)
		{
			var marker_index = group_names.indexOf(marker_names[ranking_score_pair[i][j][1]]);
			matrix_part[i][marker_index] = matrix[i][marker_index];
			matrix_part[marker_index][marker_index] = 0.02;
		}		
	}

	var midpoint_x = width_window * 0.6+ width_chord/2,
		midpoint_y = height_chord/2 + 10;

	var circle = svg.append("g")
		.attr("id", "circle")
		.attr("width", width_chord)
        .attr("height", height_chord)
		.attr("transform", "translate(" + midpoint_x + "," + midpoint_y + ")");

	circle.append("circle")
		.attr("r", outerRadius);

	layout.matrix(matrix_part);
					 
	// Add a group per neighborhood.
	var group = circle.selectAll(".group")
			.data(layout.groups)	//each row
			.enter().append("g")
			.attr("class", "group")
			.on("mouseover", mouseover)
			.on("mousedown", mousedown);
	 
	// Add a mouseover title.
	// group.append("title").text(function(d, i) {
	// return cities[i].name + ": " + formatPercent(d.value) + " of origins";
	// });
	 
	// Add the group arc.
	var groupPath = group.append("path")
						.attr("id", function(d, i) { return "group" + i; })
						.attr("d", arc)
						.style("fill", function(d, i) { return colores_google(i); });
	 
	// Add a text label.
	var groupText = group.append("text")
						.attr("x", 6)
						.attr("dy", 15);
	 
	groupText.append("textPath")
			.attr("xlink:href", function(d, i) { return "#group" + i; })
			.text(function(d, i) { return group_names[i]; });
	 
	// Remove the labels that don't fit. :(
	groupText.filter(function(d, i) { return groupPath[0][i].getTotalLength() / 2 < this.getComputedTextLength() +25 || d3.max(matrix_part[i])==0})
		.remove();

	var path_end_point = [];
	var OuterLabel = group.append("path")
						.attr("class", "pathOuterLine")
						.attr("d", function(d, i){

							if(d3.max(matrix_part[i])==0 || d3.select(this.parentNode).selectAll("text")[0].length==1)
								return null;

							var d3line2 = d3.svg.line()
					                        .x(function(d){return d.x;})
					                        .y(function(d){return d.y;})
					                        .interpolate("linear");

					        var pathInfo = []; 
					        var linePoint = {};
					        var lineLength = 15;

							var angle = 0.5 * (d.startAngle + d.endAngle);
							linePoint.x = outerRadius * Math.sin(angle);
							linePoint.y = outerRadius * Math.cos(angle) * (-1);
							pathInfo.push(linePoint);

							linePoint = {};
							if(angle <= Math.PI * 0.5)
							{
								linePoint.x = pathInfo[0].x + lineLength;
								linePoint.y = pathInfo[0].y;
								pathInfo.push(linePoint);

								linePoint = {};
								linePoint.x = pathInfo[1].x + lineLength * 0.5;
								linePoint.y = pathInfo[1].y - lineLength * 0.5;
								pathInfo.push(linePoint);

								path_end_point[i] = pathInfo[pathInfo.length-1];
							}
							else if(angle <= Math.PI)
							{
								linePoint.x = pathInfo[0].x + lineLength;
								linePoint.y = pathInfo[0].y;
								pathInfo.push(linePoint);

								linePoint = {};
								linePoint.x = pathInfo[1].x + lineLength * 0.5;
								linePoint.y = pathInfo[1].y + lineLength * 0.5;
								pathInfo.push(linePoint);

								path_end_point[i] = pathInfo[pathInfo.length-1];
							}

							else if(angle <= Math.PI * 1.5)
							{
								linePoint.x = pathInfo[0].x - lineLength;
								linePoint.y = pathInfo[0].y;
								pathInfo.push(linePoint);

								linePoint = {};
								linePoint.x = pathInfo[1].x - lineLength * 0.5;
								linePoint.y = pathInfo[1].y + lineLength * 0.5;
								pathInfo.push(linePoint);

								path_end_point[i] = pathInfo[pathInfo.length-1];
							}
							else
							{
								linePoint.x = pathInfo[0].x - lineLength;
								linePoint.y = pathInfo[0].y;
								pathInfo.push(linePoint);

								linePoint = {};
								linePoint.x = pathInfo[1].x - lineLength * 0.5;
								linePoint.y = pathInfo[1].y - lineLength * 0.5;
								pathInfo.push(linePoint);

								path_end_point[i] = pathInfo[pathInfo.length-1];
							}


							return d3line2(pathInfo);
						})
				        .style("stroke-width", 1)
				        .style("stroke", "steelblue")
				        .style("fill", "none");

	group.append("text")
		.text(function(d, i){ return path_end_point[i]==null? null:group_names[i];})
		.attr("transform", function(d, i){
			if(path_end_point[i]==null) return "translate(0,0)";

			path_end_point[i].x -= path_end_point[i].x>0?0:25 / 4 * group_names[i].length;
			return "translate(" + path_end_point[i].x+ ", " + path_end_point[i].y +")";
		});
	 
	// Add the chords.
	var chord = circle.selectAll(".chord")
		.data(layout.chords)
		.enter().append("path")
		.attr("class", "chord")
		.style("fill", function(d) { return colores_google(d.target.index); })
		.attr("d", path);

	chord.filter(function(d, i) {
			return d.source.index == d.target.index;
		})
		.remove();
	 
	// Add an elaborate mouseover title for each chord.
	 chord.append("title").text(function(d) {
		 return group_names[d.source.index]
		 + " → " + group_names[d.target.index]
		 + ": " + formatPercent(d.source.value)
		 + "\n" + group_names[d.target.index]
		 + " → " + group_names[d.source.index]
		 + ": " + formatPercent(d.target.value);
	 });

	 function mouseover(d, i) {
		chord.classed("fade", function(p) {
			return p.source.index != i
			&& p.target.index != i;
		});
	}

	function mousedown(d, i){

		if(show_all_cluster && i >= marker_names.length)
		{
			show_all_cluster = false;
			chord.classed("unshow", true);
		}

		chord.classed("unshow", function(p) {
			if(p.source.index == i || p.target.index == i)
				return !this.classList.contains("unshow");
			else
				return this.classList.contains("unshow");
		});
	} 
}
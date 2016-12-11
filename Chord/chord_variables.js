var matrix = [];
var matrix_part = [];
var points = _data.points;	//
var marker_names = _data.names;	//
var cluster_names = [];
var group_names = cluster_names.concat(marker_names);
var group_num = [];
var show_marker_num = 2,
	cluster_marker_matrix = [],
	show_all_cluster = true;

var variance_matrix = [],
	mean_matrix = [];
var ranking_score = [];
var ranking_score_pair = [];
var cluster_length = cluster_names.length;



var width = 600,	//
	height = 600,	//
	outerRadius = Math.min(width, height) / 2 - 10,
	innerRadius = outerRadius - 24;
 
var formatPercent = d3.format(".1%"); //unused
 
var arc = d3.svg.arc()
			.innerRadius(innerRadius)
			.outerRadius(outerRadius);
 
var layout = d3.layout.chord()
				.padding(.04);
				// .sortSubgroups(d3.descending)
				// .sortChords(d3.ascending);
 
var path = d3.svg.chord()
				.radius(innerRadius);
 
var svg = d3.select("body").append("svg")	//
			.attr("width", width)
			.attr("height", height);
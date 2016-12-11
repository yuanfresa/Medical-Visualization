var points = _data.points;
var marker_names = _data.names;
var cluster_names = [];

var show_marker_num = 2,
  cluster_marker_matrix = [];

var variance_matrix = [],
  mean_matrix = [];

var variance_max = d3.max(d3.max(variance_matrix))[0],
    variance_min = d3.min(d3.min(variance_matrix))[0];

var margin_h = { top: 100, right: 80, bottom: 50, left: 80 },
    row_num = cluster_names.length,
    col_num = marker_names.length,
    width_h = 960 - margin.left - margin.right,  //
    height_h = 630 - margin.top - margin.bottom, //
    gridSize = Math.floor(width / col_num),
    legendWidth = gridSize * 1.5;

var maxMean = d3.max(d3.max(mean_matrix))[0],
    maxMean = Math.floor(maxMean)+1,
    buckets = 10,
    colors1 = colorbrewer.RdYlGn[buckets],
    colors_h = [];

var colorScale_h = d3.scale.quantile()    // is a function
    .domain([0, maxMean])
    .range(colors);

var svg_h = d3.select("body").append("svg")
        .attr("width", width_h + margin_h.left + margin_h.right)
        .attr("height", height_h + margin_h.top + margin_h.bottom)
        .append("g")
        .attr("id","heatmap")
        .attr("transform", "translate(" + margin_h.left + "," + margin_h.top + ")");




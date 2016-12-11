//Processing data
var matrix = [];
var matrix_part = [];
var points = _data.points;
var marker_names = _data.names;
var cluster_names = [];

for (var i = 0; i < points.length; i++)
{
	if(!cluster_names.includes("cluster" + points[i].clusterID))
		cluster_names.push("cluster" + points[i].clusterID);
}

var group_names = cluster_names.concat(marker_names);
var group_num = [];

for (var i = 0; i < group_names.length; i++)
{
	matrix[i] = [];
	matrix_part[i] = [];
	group_num[i] = 0;
	for (var j = 0; j < group_names.length; j++)
	{
		matrix_part[i][j] = 0;
		matrix[i][j] = 0;
	}
}

//Sort the importance of markers
var show_marker_num = 2,
	cluster_marker_matrix = [],
	show_all_cluster = true;

for (var i = 0; i < cluster_names.length; i++)
{
	cluster_marker_matrix[i] = [];
	for (var j = 0; j < marker_names.length; j++)
	{
		cluster_marker_matrix[i][j] = [];
	}
}

for (var i = 0; i < points.length; i++)
{
	for(var j = 0; j < points[i].expression.length; j++)
	{
		var cluster_index = cluster_names.indexOf("cluster"+points[i].clusterID);
		cluster_marker_matrix[cluster_index][j].push(points[i].expression[j]);
	}
}

var variance_matrix = [],
	mean_matrix = [];
for (var i = 0; i < cluster_names.length; i++)
{
	variance_matrix[i] = [];
	mean_matrix[i] = [];
	for (var j = 0; j < marker_names.length; j++)
	{
		variance_matrix[i][j] = [];
		mean_matrix[i][j] = [];

		variance_matrix[i][j].push(d3.deviation(cluster_marker_matrix[i][j]), j)
		mean_matrix[i][j].push(d3.mean(cluster_marker_matrix[i][j]), j);
	}
}

var ranking_score = [];
var ranking_score_pair = [];
for (var i = 0; i < cluster_names.length; i++)
{
	variance_matrix[i].sort(function(x, y){
	   return d3.descending(x[0], y[0]);
	});

	mean_matrix[i].sort(function(x, y){
	   return d3.ascending(x[0], y[0]);
	});

	ranking_score[i] = [];
	ranking_score_pair[i] = [];
	for(var j = 0; j < marker_names.length; j++)
	{
		ranking_score[i][variance_matrix[i][j][1]] = j;
		ranking_score[i][mean_matrix[i][j][1]] += j;
	}

	for(var j = 0; j < marker_names.length; j++)
	{
		ranking_score_pair[i][j] = [];
		ranking_score_pair[i][j].push(ranking_score[i][j], j);
	}

	ranking_score_pair[i].sort(function(x, y){
	   return d3.descending(x[0], y[0]);
	});
}

//Construct Matrix
var cluster_length = cluster_names.length;
for (var i = 0; i < points.length; i++)
{
	for(var j = 0; j < points[i].expression.length; j++)
	{
		var cluster_index = group_names.indexOf("cluster"+points[i].clusterID);
		var marker_index = group_names.indexOf(marker_names[j]);
		matrix[cluster_index][marker_index] += points[i].expression[j];
		group_num[cluster_index] += 1;
	}
}

for (var i = 0; i < group_names.length; i++)
{
	if(group_num[i]>0)
	{
		for (var j = 0; j < group_names.length; j++)
			matrix[i][j] /= group_num[i]; 
	}
}

//Update matrix_part
for (var i = 0; i < cluster_names.length; i++)
{
	for (var j = 0; j < show_marker_num; j++)
	{
		var marker_index = group_names.indexOf(marker_names[ranking_score_pair[i][j][1]]);
		matrix_part[i][marker_index] = matrix[i][marker_index];
		matrix_part[marker_index][marker_index] = 0.02;
	}		
}

//Heatmap
// normalize the variance matrix
var variance_max = d3.max(d3.max(variance_matrix))[0],
    variance_min = d3.min(d3.min(variance_matrix))[0];

var data_heatmap = [];
for (var i = 0; i < cluster_names.length; i++)
{
  for (var j = 0; j < marker_names.length; j++)
  {
    data_heatmap.push({
      dim_col: (j + 1),
      dim_row: (i + 1),
      "mean": mean_matrix[i][j][0],
      "variance" : variance_matrix[i][j][0],
      "variance_nor" : (-variance_matrix[i][j][0] + variance_max)/(variance_max-variance_min)
    });
  }
}

//Parallel
var data=[];
for (var i = 0; i < _data.points.length; i++){
  var object = {};
  object["clusterID"] = _data.points[i]["clusterID"];

  for (var j = 0; j  <marker_names.length; j++) {

     object[marker_names[j]] = _data.points[i]["expression"][j];
  }
  data.push(object);
}
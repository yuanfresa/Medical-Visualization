var w = window,
    d = document,
    //e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    width_window = w.outerWidth  ,//|| g.clientWidth, //|| e.clientWidth,
    height_window = w.outerHeight;//|| g.clientHeight; // || e.clientHeight

var svg = d3.select("body").append("svg")
        .attr("width", width_window)
        .attr("height", height_window)
        .append("g");

function updateWindow(){
    width_window = w.outWidth,// || e.clientWidth || g.clientWidth;
    height_window = w.outHeight;//|| e.clientHeight|| g.clientHeight;
    
    svg.attr("width", width_window).attr("height", height_window);
}
window.onresize = updateWindow;

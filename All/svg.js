var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    width_window = w.innerWidth || e.clientWidth || g.clientWidth,
    height_window = w.innerHeight|| e.clientHeight|| g.clientHeight;

var svg = d3.select("body").append("svg")
        .attr("width", width_window)
        .attr("height", width_window)
        //.append("g");

function updateWindow(){
    width_window = w.innerWidth || e.clientWidth || g.clientWidth;
    height_window = w.innerHeight|| e.clientHeight|| g.clientHeight;
    
    svg.attr("width", width_window).attr("height", height_window);
}
window.onresize = updateWindow;

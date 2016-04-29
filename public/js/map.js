d3.select(window)
      .on("resize", sizeChange);

var projection = d3.geo.albersUsa()
  .scale(1100);

var path = d3.geo.path()
  .projection(projection);

var svg = d3.select("#container")
  .append("svg")
  .attr("width", "100%")
      .append("g");

d3.json("../data/us-states.json", function(error, us) {

  console.log(us);

 //  svg.selectAll(".states")
 //  .data(topojson.object(us, us.objects.states).geometries)
 // .enter().append("path")
 //  .attr("class", "states")
 //  .attr("d", path);
});

function sizeChange() {
    d3.select("g").attr("transform", "scale(" + $("#container").width()/900 + ")");
    $("svg").height($("#container").width()*0.618);
}

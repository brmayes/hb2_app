
// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 750 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%d-%b-%y").parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(d3.time.day, 8)
    .tickFormat(d3.time.format('%b. %d'));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(1);

// setup fill color
var cValue = function(d) { return d.type;},
    color = function(d) {
    if (d.type == "Action") {
      return "rgb(217, 95, 14)";
    } else {
      return "rgb(254, 196, 79)";
    }
  };

// Define the line
// var valueline = d3.svg.line()
//     .x(function(d) { return x(d.date); })
//     .y(function(d) { return y(d.close); });

// Adds the svg canvas
var svg = d3.select("#timeline")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

//make tooltip
var tooltip = d3.select("body")
  .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Get the data
d3.csv("../data/timeline-data.csv", function(error, data) {
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.close; })]);

    // Add the valueline path.
    // svg.append("path")
    //     .attr("class", "line")
    //     .attr("d", valueline(data));

    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
      .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(0); })
        .style("fill", function(d) {
          if (d.type == "Action") {
            return "rgb(217, 95, 14)";
          } else {
            return "rgb(254, 196, 79)";
          }
        })
        .on("mouseover", function(d) {
            tooltip.transition()
                 .duration(200)
                 .style("opacity", .9);
            tooltip.html(d["event"])
                 .style("left", (d3.event.pageX - 45) + "px")
                 .style("top", (d3.event.pageY - 65) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
        });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // draw legend
    var legend = svg.selectAll(".legend")
        .data(data)
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // // draw legend colored rectangles
    // legend.append("rect")
    //     .attr("x", width - 18)
    //     .attr("width", 18)
    //     .attr("height", 18)
    //     .style("fill",  function(d) {
    //       // return color(cValue(d));
    //
    //       console.log(d.type);
    //       if (d.type == "Action") {
    //         return "rgb(217, 95, 14)";
    //       } else {
    //         return "rgb(254, 196, 79)";
    //       }
    //     });
    //
    // // draw legend text
    // legend.append("text")
    //     .attr("x", width - 24)
    //     .attr("y", 9)
    //     .attr("dy", ".35em")
    //     .style("text-anchor", "end")
    //     .text(function(d) { return d;})
});

//sources
//http:www.newsobserver.com/news/politics-government/state-politics/article72170307.html
//http://www.ibtimes.com/hb-2-anti-lgbt-laws-effect-list-concerts-events-canceled-north-carolina-mississippi-2356695

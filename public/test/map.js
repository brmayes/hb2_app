  var urls = {
    us: "us.json",
    data: "stateLaws.csv"
  };

  var margin = {
      top: 10,
      left: 10,
      bottom: 10,
      right: 10
    },
    width = parseInt(d3.select('#map').style('width')),
    width = width - margin.left - margin.right,
    mapRatio = .5,
    height = width * mapRatio;

  var formats = {
    percent: d3.format('%')
  };

  // projection and path setup
  var projection = d3.geo.albersUsa()
    .scale(width)
    .translate([width / 2, height / 2]);

  var path = d3.geo.path()
    .projection(projection);

  // scales and axes
  var colors = d3.scale.quantize()
    .range(colorbrewer.YlOrBr[3]);

  // make a map
  var map = d3.select('#map').append('svg')
    .style('height', height + 'px')
    .style('width', width + 'px');

  // queue and render
  queue()
    .defer(d3.json, urls.us)
    .defer(d3.csv, urls.data)
    .await(render);

  // catch the resize
  d3.select(window).on('resize', resize);

  // template, for later
  var template = _.template(d3.select('#tooltip-template').html());

  function render(err, us, data) {

    var land = topojson.mesh(us, us.objects.land),
      states = topojson.feature(us, us.objects.states);

    window.us = us;

    data = window.data = _(data).chain().map(function(d) {
      d.Total = +d.Total;
      d["Status"] = +d["Status"];
      d.percent = d["Status"];
      return [d.Name, d];
    }).object().value();

    colors.domain([
      0,
      d3.max(d3.values(data), function(d) {
        return d.percent;
      })
    ]);

    map.append('path')
      .datum(land)
      .attr('class', 'land')
      .attr('d', path);

    var states = map.selectAll('path.state')
      .data(states.features)
      .enter().append('path')
      .attr('class', 'state')
      .attr('id', function(d) {
        return d.properties.name.toLowerCase().replace(/\s/g, '-');
      })
      .attr('d', path)
      .style('fill', function(d) {
        var name = d.properties.name,
          value = data[name] ? data[name].percent : null;

        return colors(value);
      });

    states.on('mouseover', tooltipShow)
      .on('mouseout', tooltipHide);

  }

  function resize() {
    // adjust things when the window size changes
    width = parseInt(d3.select('#map').style('width'));
    width = width - margin.left - margin.right;
    height = width * mapRatio;

    // update projection
    projection
      .translate([width / 2, height / 2])
      .scale(width);

    // resize the map container
    map
      .style('width', width + 'px')
      .style('height', height + 'px');

    // resize the map
    map.select('.land').attr('d', path);
    map.selectAll('.state').attr('d', path);
  }

  function tooltipShow(d, i) {
    var datum = data[d.properties.name];
    if (!datum) return;

    datum.formats = formats;

    $(this).tooltip({
      title: template(datum),
      html: true,
      container: map.node().parentNode,
      placement: 'auto'
    }).tooltip('show');
  }

  function tooltipHide(d, i) {
    $(this).tooltip('hide');
  }

  // highlight my code blocks
  d3.selectAll('pre code').each(function() {
    var code = d3.select(this),
      highlight = hljs.highlight('javascript', code.html());

    code.html(highlight.value);
  });

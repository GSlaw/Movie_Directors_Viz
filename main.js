/////////////////////////////////////////////////////////
// GERAHRDT SLAWITSCHKA
// CS4460
// FALL 2022
// LAB 6
// FILM DIRECTOR FILMOGRAPHIES
/////////////////////////////////////////////////////////

// GLOBAL VARIABLES
var width = 850;
var height = 570;
var svg = d3.select('svg');
var chart1 = d3.select('#chart1');

// Y AXIS SETUP
var yScale = d3.scaleLinear().domain([0,10]).range([520, 80]);
var yAxis = d3.axisLeft().scale(yScale);

/////////////////////////////////////////////////////////
//                   FUNCTIONS
/////////////////////////////////////////////////////////

// A FUNCTION TO CREATE THE LEGEND //
function createLegend() {
  var legSVG = d3.select('#chart2').append('svg')
    .attr('id', 'gradient')
    .attr("width", 150)
    .attr("height", 270);

  legSVG.append('rect') 
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 150)
    .attr('height', 270)
    .style('fill', 'white');
  
  for (var i = 0; i < 120; i++) {
    legSVG.append('rect') 
      .attr('x', 42)
      .attr('y', 40+ i)
      .attr('width', 30)
      .attr('height', 2)
      .style('fill', function(d) {
        return myColor2(((120-i) /11))
      })
      .style('opacity', .8);
  };

  legSVG.append('circle')
    .attr('class', 'circlePoint')
    .attr('cx', 57)
    .attr('cy', 210)
    .attr('r', 30)
    .style('fill', function(d) {
      return myColor(4);
    })
    .style('opacity', .5);

  legSVG.append('circle')
    .attr('class', 'circlePoint')
    .attr('cx', 57)
    .attr('cy', 220)
    .attr('r', 20)
    .style('fill', function(d) {
      return myColor(4);
    })
    .style('opacity', .6);

  legSVG.append('circle')
    .attr('class', 'circlePoint')
    .attr('cx', 57)
    .attr('cy', 228)
    .attr('r', 12)
    .style('fill', function(d) {
      return myColor(4);
    })
    .style('opacity', .7);

  legSVG.append('text')
    .text('Area = Box Office')
    .attr("x", 42)
    .attr("y", 260)
    .attr("font-size", "12px")

  legSVG.append('text')
    .text('9.0')
    .attr("x", 80)
    .attr("y", 50)
    .attr("font-size", "12px")

  legSVG.append('text')
    .text('4.0')
    .attr("x", 80)
    .attr("y", 160)
    .attr("font-size", "12px")

  legSVG.append('text')
    .text('IMDB Rating')
    .attr("x", 42)
    .attr("y", 25)
    .attr("font-size", "12px")
}

// A FUNCTION TO INSERT COMMAS INTO NUMBERS
var format = d3.format(",");

// CUSTOM COLOR FUNCTION FOR CIRCLES
var myColor = d3.scaleSequential().domain([5,9])
  .interpolator(d3.interpolateSpectral);

// CUSTOM COLOR FUNCTION FOR LEGEND COLOR BAR
var myColor2 = d3.scaleSequential().domain([1,9.5])
  .interpolator(d3.interpolateSpectral);

// FUNCTION TO CONTROL CATEGORY CHANGES
function onCategoryChanged() {
  var select = d3.select('#categorySelect').node();
  var category = select.options[select.selectedIndex].value;
  updateChart(category);
};

// MAIN UPDATING FUNCTION
function updateChart(category) {
  if (category === 'All') {
    movies = data.filter(d => d['Director'] !== category);
  } else {
    movies = data.filter(d => d['Director'] === category);
  }
  
  // TOOLTIP STUFF ///////////////////////////////////////////////
  var tooltip = d3.select("#chart3")
    .style("opacity", 0)
    .attr("class", "tooltip")
  
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
    grossFormatted = format(d.Gross);
    if (grossFormatted < 10) {
      grossFormatted = "NA, Streaming Release";
    } else {
      grossFormatted = "$" + grossFormatted;
    }
    tooltip
      .html("Title: " + d.Title + "</a>" +  
      "<br/>" + " Director: " + d.Director +            
      "<br/>" + " Year: " + d.Year +
      "<br/>" + " Rating: " + d.Rating + "</a>" + 
      "<br/>" + " Gross: " + grossFormatted)
  }

  var mousemove = function(d) {
    grossFormatted = format(d.Gross);
    if (grossFormatted < 10) {
      grossFormatted = "NA, Streaming Release";
    } else {
      grossFormatted = "$" + grossFormatted;
    }
    tooltip
      .html("Title: " + d.Title + "</a>" +  
      "<br/>" + " Director: " + d.Director +            
      "<br/>" + " Year: " + d.Year +
      "<br/>" + " Rating: " + d.Rating + "</a>" + 
      "<br/>" + " Gross: " + grossFormatted)
  }

  var mouseleave = function(d) {
    tooltip
      .transition()
      .duration(20)
      .style("opacity", 0)
  }
  // END TOOLTIP /////////////////////////////////////////////////
  


  // CLEAR OLD X AXIS
  xAxisSelect = d3.select('#xAxis');
  xAxisSelect.remove();

  // CLEAR OLD CIRCLES
  oldCirclesSelect = d3.selectAll('.movieG');
  oldCirclesSelect.remove();

  // EXTENT CALCULATIONS
  // Calculate the number of years between oldest and newest selection
  var yearExtent = d3.extent(movies, function (row) {
    var date = row.Year;
    return date;
  });
  // Add padding to the years to improve aesthetics
  yearExtent[0] = yearExtent[0] - 1;  
  if (yearExtent[1] <= 2020) {
    yearExtent[1] = yearExtent[1] + 2; 
  }
  if (yearExtent[1] == 2021) {
    yearExtent[1] = yearExtent[1] + 1; 
  }

  ratingExtent = d3.extent(movies, function(row) {
    var rating = row.Rating;
    return rating;
  });

  grossExtent = d3.extent(movies, function(row) {
    var gross = row.Gross;
    return gross;
  });

  // Function to scale the X axis on time based on category
  var dateScale = d3.scaleTime()
    .domain([new Date(yearExtent[0], 0, 1), new Date(yearExtent[1], 0, 1)]).range([50,770]);
  
  // X Axis setup
  var xScale = d3.scaleLinear().domain(yearExtent).range([70, 790]);
  var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  //var rScale = d3.scaleLinear().domain(grossExtent).range([1, 120]);
  var rScale = d3.scaleSqrt().domain(grossExtent).range([3, 100]);

  // Add X Axis
  var xAxisG  = d3.select('#svgData')// or something else that selects the SVG element in your visualizations
    .append("g") // create a group node
    .attr('id', 'xAxis')
    .attr("transform", "translate(0," + (height - 50) + ")")
    .call(xAxis) // call the axis generator
    .append("text")
    .attr("class", "label")
    .attr("x", width - 16)
    .attr("y", -6)
    .style("text-anchor", "end");

  // FILTERING //////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////

  var nodes = d3.select('#svgData').selectAll(".movieG")
    .data(movies, function(d) {
      return d.Title;
    });

  var new_m_elements = nodes.enter()
    .append('g')
    .attr('class', 'movieG');

  new_m_elements.merge(nodes).append('circle')
    .attr('id',function(d,i) {
      d.id = i;
      return i;
    })
    .attr("fill", function(d) {
      return myColor(d.Rating) 
    })
    .attr('class', 'circlePoint')
    .attr('cx', function (d) {
      return xScale(d.Year); 
    })
    .attr('cy',function(d) {
      return yScale(d.Rating);
    })
    .attr('r', function(d) {
        return rScale(d.Gross); 
    })
    .on("mouseover", mouseover )
    .on("mousemove", mousemove )
    //.on("mouseleave", mouseleave )

  nodes.exit().remove();

}


/////////////////////////////////////////////////////////
//                   CSV CALL
/////////////////////////////////////////////////////////

d3.csv("directors.csv", function (csv) {

  data = csv; 
  for (var i = 0; i < csv.length; ++i) {
    csv[i].Gross = Number(csv[i].Gross);
    csv[i].Year = Number(csv[i].Year);
    csv[i].Rating = Number(csv[i].Rating);
  }

  //Create SVG for chart
  var chart1 = d3
    .select("#chart1")
    .append("svg")
    .attr("id", "svgData")
    .attr("width", width)
    .attr("height", height);

  // Y Axis Generation
  chart1 
    .append("g") 
    .attr("transform", "translate(70, 0)")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end");
  
  /////////////////////////////////////////////////////////
  //                   LABELS
  /////////////////////////////////////////////////////////

  // HEADER TITLE
  var title = d3.select('#title').append('svg')
    .attr('width', 800)
    .attr('height', 30);
  title.append('text')
    .text('Director Filmography Timeline')
    .attr('class', 'legend')
    .attr('x', width/2 -80)
    .attr('y', 14)
    .style("font-size", '14px');
  // X Label
    var yearLabel = d3
    .select("#svgData")
    .append("text")
    .attr("x", width/2)
    .attr("y", height - 5)
    .attr("font-size", "14px")
    .text("Year");
  // Y Label
    var ratingLabel = d3
    .select("#svgData")
    .append("text")
    .attr("x", -height/2 + 50)
    .attr("y", 40)
    .attr("font-size", "14px")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .text("IMDB Rating");

/////////////////////////////////////////////////////////
//            UPDATE CHART FUNCTION CALLS
/////////////////////////////////////////////////////////

  createLegend();
  updateChart('All');

});

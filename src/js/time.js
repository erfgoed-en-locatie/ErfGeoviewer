var width = 600,
    height = 7,
    x = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    xAxis,
    yAxis,
    formatCount = d3.format(",.0f"),
    margin = {top: 10, right: 10, bottom: 100, left: 40},
    margin2 = {top: 430, right: 10, bottom: 20, left: 40},
    height2 = 500 - margin2.top - margin2.bottom,
    theGraph = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

function initGraph() {
    'use strict';
    
    var parseDate = d3.time.format("%b %Y").parse;

    var x2 = d3.time.scale().range([0, width]),
        y2 = d3.scale.linear().range([height2, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var xAxis2 = d3.svg.axis()
        .scale(x2)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var brush = d3.svg.brush()
        .x(x2)
        .on("brush", brushed);
    
    var area = d3.svg.area()
        .interpolate("monotone")
        .x(function(d) { return x(d.date); })
        .y0(height);
        //.y1(function(d) { return y(d.price); });

    var focus = theGraph.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var context = theGraph.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
}

function brushed() {
    console.log('brushed');
    //x.domain(brush.empty() ? x2.domain() : brush.extent());
    //focus.select(".area").attr("d", area);
    //focus.select(".x.axis").call(xAxis);
}

function updateTime(collection) {
    'use strict';
    var fullYear,
        yearFound = false,
        formatDate = d3.time.format("%Y-%m-%d+%H:%M"),
        data = [],
        bar;
    
    for (var collectionItem in collection) {

        if (collection.hasOwnProperty(collectionItem) &&
        formatDate.parse(collection[collectionItem].date) &&
        formatDate.parse(collection[collectionItem].date).getFullYear() !== 0) {

            fullYear = formatDate.parse(collection[collectionItem].date).getFullYear();
            yearFound = false;

            for (var dataItem in data) {
                if (data[dataItem].year === fullYear) {
                    yearFound = true;
                    data[dataItem].count += 1;
                    //break;
                    //console.log('found ' + fullYear);
                }
            }

            if (yearFound === false) {
                data.push({year: fullYear, count: 1});
            }
        }
	}
    
    data = data.sort(function (a, b) {
          if (a.year > b.year) {
            return 1;
          }
          if (a.year < b.year) {
            return -1;
          }
          // a must be equal to b
          return 0;
    });
    //console.log('data length:' + data.length);
    console.log(data);

    //x.domain([data[0].year, data[data.length - 1].year]);
    	x.domain(data.map(
        function (d) {
            return d.year;
        }
    ));
    
    y.domain([0, d3.max(
        data,
        function (d) {
            return d.count;
        }
    )]);

    theGraph.selectAll("g").remove();
	bar = theGraph.selectAll(".bar")
		.data(data)
		.remove()
		.enter().append("g")
		.attr("class", function (d) {
			if (d.year) {
				return "bar-selected";
			} else {
				return "bar";
			}
        })
		.attr("onclick", function (d) {
            return "javascript:onYearClick('" + d.year + "')";
        })
		.attr("id", function (d) {
			return "bar_" + d.year;
        })
		.attr("transform", function (d) { return "translate(" + x(d.year) + "," + y(d.count) + ")"; });
		
	bar.append("rect")
		.attr("x", 1)
		.attr("width", 5)
		.attr("height", function (d) {
            return height - y(d.count);
        });

	/*
    bar.append("text")
		.attr("dy", ".75em")
		.attr("y", 6)
		.attr("x", x(data[0].year) / 2);
    */
	
    theGraph.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
}

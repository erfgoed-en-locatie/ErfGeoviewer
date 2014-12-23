var theGraph;
var width, height;
var x, y;
var xAxis;
var yAxis;
var formatCount = d3.format(",.0f");

function getKeys(obj, filter) {
    'use strict';
    var name, result = [];

    for (name in obj) {
        if (obj.hasOwnProperty(name)) {
            if ((!filter || filter.test(name)) && obj.hasOwnProperty(name)) {
                result[result.length] = name;
            }
        }
    }
    return result;
}

function initGraph() {
    'use strict';
    
	width = 600;
	height = 70;
	
	x = d3.scale.ordinal().rangeRoundBands([0, width], 1);
	y = d3.scale.linear().range([height, 0]);

	xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.ticks(10);

	yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(1);
	
	var margin = {top: 8, right: 5, bottom: 50, left: 5};
	theGraph = d3.select("#chart")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	theGraph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "middle");
}

function onYearClick(year) {
    'use strict';
    var el, scope, index, barElement;
    
	el = document.getElementById('rootContainer');
	scope = angular.element(el).scope();
	index = scope.Repository.selectedYears.indexOf(year);
	barElement = document.getElementById("bar_" + year);
	
	if (index !== -1) {//deselect
		scope.Repository.selectedYears.splice(index, 1);
		barElement.setAttribute("class", "bar");
	} else {//select
		scope.Repository.selectedYears.push(year);
		barElement.setAttribute("class", "bar-selected");
	}
	scope.$apply();

	//TODO: find better solution
	if (window.location.href.indexOf('item') !== -1) {
	    window.location.href = "#/";
	}
}

//returns if the year is enabled in the current selection
function yearInSelection(year) {
    'use strict';
    var el, scope, index, barElement, inside;
	
    el = document.getElementById('rootContainer');
	scope = angular.element(el).scope();
	index = scope.Repository.selectedYears.indexOf(year);
	barElement = document.getElementById("bar_" + year);
	inside = (index !== -1);

	return inside;
}

function updateTime(collection) {
    var formatDate, lustrums, index, data = [], lustrumKey, bar;
    
	if (theGraph === undefined) {
        return;
    }
	
	formatDate = d3.time.format("%Y-%m-%d+%H:%M");
	lustrums = {1940: 0, 1945: 0, 1950: 0, 1955: 0, 1960: 0, 1965: 0, 1970: 0, 1975: 0, 1980: 0, 1985: 0, 1990: 0, 1995: 0, 2000: 0, 2005: 0, 2010: 0, 2015: 0};
	
	for (item in collection) {
        if (collection.hasOwnProperty(item)) {
            if (formatDate.parse(collection[item].date)) {
                fullYear = formatDate.parse(collection[item].date).getFullYear()
                if (fullYear > 0) {
                    index = Math.floor(((fullYear - 1940) / 5));
                    lustrumKey = 1940 + (index * 5);

                    if(lustrumKey in lustrums) {
                        lustrums[lustrumKey] += 1;
                    } else {
                        console.log("lustrum not found: " + fullYear + " " + lustrumKey);
                    }
                }
            }
        }
	}
    
	keys = getKeys(lustrums);

	for (key in keys.sort()) {
        if (keys.hasOwnProperty(key)) {
            data.push({'jaar': parseInt(keys[key], 10), 'aantal': lustrums[keys[key]]});
        }
	}
		
	x.domain(data.map(
        function (d) {
            return d.jaar;
        }
    ));
    
    y.domain([0, d3.max(
        data,
        function (d) {
            return d.aantal;
        }
    )]);

	theGraph.selectAll("g").remove();
	bar = theGraph.selectAll(".bar")
		.data(data)
		.remove()
		.enter().append("g")
		.attr("class", function (d) {
			if (yearInSelection(d.jaar)) {
				return "bar-selected";
			} else {
				return "bar";
			}
        })
		.attr("onclick", function (d) {
            return "javascript:onYearClick('" + d.jaar + "')";
        })
		.attr("id", function (d) {
			return "bar_" + d.jaar;
        })
		.attr("transform", function (d) { return "translate(" + x(d.jaar) + "," + y(d.aantal) + ")"; });
		
	bar.append("rect")
		.attr("x", 1)
		.attr("width", 25)
		.attr("height", function (d) {
            return height - y(d.aantal);
        });

	bar.append("text")
		.attr("dy", ".75em")
		.attr("y", 6)
		.attr("x", x(data[0].jaar) / 2);
	
	theGraph.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
}

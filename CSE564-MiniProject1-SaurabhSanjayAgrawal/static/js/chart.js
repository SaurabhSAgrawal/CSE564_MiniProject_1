/*Variable initialization*/
var categoricalOptions = ["state", "vehicleType", "fuelType", "vehicleBrand", "year"];
var numericalOptions = ["rating", "renterTripCount", "reviewCount", "dailyRate"];
var optionLabels = {"state" : {"label" : "State", "heading" : "State located in"}, "vehicleType" : {"label" : "Vehicle Type", "heading" : "Type of the Vehicle"}, "fuelType" : {"label" : "Fuel Type", "heading" : "Type of Fuel used by the Vehicle"}, "vehicleBrand" : {"label" : "Brand", "heading" : "Brand of the Vehicle"}, "year" : {"label" : "Year", "heading" : "Manufacture Year of the Vehicle"}, "rating" : {"label" : "Rating", "heading" : "Customer Rating of the vehicle"}, "renterTripCount" : {"label" : "No. of trips", "heading" : "No. of trips taken"}, "reviewCount" : {"label" : "No. of Reviews", "heading" : "No. of Reviews"}, "dailyRate" : {"label" : "Daily Rate($)", "heading" : "Daily Rate of Vehicle"}};

var fuelType = {}, state = {}, vehicleType = {}, year = {}, vehicleBrand = {};
var rating = [], renterTripCount = [], reviewCount = [], dailyRate = [];
var fuelTypeSP = [], stateSP = [], vehicleTypeSP = [], yearSP = [], vehicleBrandSP = [];
var ratingSP = [], renterTripCountSP = [], reviewCountSP = [], dailyRateSP = [];

/*Read and process csv data*/
d3.csv("CarRentalData_Sampled.csv", function(data) {
    /*Processing data into appropriate data structures*/

    for(var i = 0; i < data.length; i++) {
        fuelType[data[i].Fuel_Type] = (fuelType[data[i].Fuel_Type] || 0) + 1;
        state[data[i].State] = (state[data[i].State] || 0) + 1;
        vehicleType[data[i].Vehile_Type] = (vehicleType[data[i].Vehile_Type] || 0) + 1;
        year[data[i].Vehicle_Year] = (year[data[i].Vehicle_Year] || 0) + 1;
        vehicleBrand[data[i].Vehicle_Brand] = (vehicleBrand[data[i].Vehicle_Brand] || 0) + 1;

        rating[i] = parseFloat(data[i].Rating);
        renterTripCount[i] = parseInt(data[i].Renter_Trip_Count);
        reviewCount[i] = parseInt(data[i].Review_Count);
        dailyRate[i] = parseFloat(data[i].Daily_Rate);

        fuelTypeSP[i] = data[i].Fuel_Type;
        stateSP[i] = data[i].State;
        vehicleTypeSP[i] = data[i].Vehile_Type;
        yearSP[i] = data[i].Vehicle_Year;
        vehicleBrandSP[i] = data[i].Vehicle_Brand;
    }

    ratingSP = rating;
    renterTripCountSP = renterTripCount;
    reviewCountSP = reviewCount;
    dailyRateSP = dailyRate;;
    
});

/*Function to hide and show radio buttons for Scatterplot*/
function showRadioButtons() {
    var x = document.getElementById("axisVar");
    isChecked = document.getElementById("yToggle").checked;
    if(isChecked) {
        x.removeAttribute("hidden");
    } else {
        x.setAttribute("hidden", "");
    }

}

/*Function that allows same option to be selected from the same dropdown*/
var flag = false;
function plotGraphUtil(opt) {
    if(flag) {
        plotGraph(opt);
        flag = false;
    } else {
        flag = true;
    }
}

/*Function for plotting graphs*/
var xAxisVariable = "state";
var yAxisVariable = "state";
function plotGraph(opt) {   
    if(!document.getElementById("yToggle").checked) {
        if(categoricalOptions.includes(opt)) { //Plot Bar chart
            drawBarGraph(window[opt], optionLabels[opt]["heading"], optionLabels[opt]["label"], 'Frequency');
        } else if(numericalOptions.includes(opt)) { //Plot Histogram
            plotHistogram(window[opt], optionLabels[opt]["heading"], optionLabels[opt]["label"], 'Frequency', 10);
        }
        xAxisVariable = "state";
        yAxisVariable = "state";
    } else { //Plot Scatterplot
        if(document.getElementById("xAxisVar").checked) {
            xAxisVariable = opt;
            drawScatterplot(xAxisVariable, yAxisVariable, window[xAxisVariable + "SP"], window[yAxisVariable + "SP"], optionLabels[xAxisVariable]["label"] + " vs " + optionLabels[yAxisVariable]["label"], optionLabels[xAxisVariable]["label"], optionLabels[yAxisVariable]["label"]);
        } else if(document.getElementById("yAxisVar").checked) {
            yAxisVariable = opt;
            drawScatterplot(xAxisVariable, yAxisVariable, window[xAxisVariable + "SP"], window[yAxisVariable + "SP"], optionLabels[xAxisVariable]["label"] + " vs " + optionLabels[yAxisVariable]["label"], optionLabels[xAxisVariable]["label"], optionLabels[yAxisVariable]["label"]);
        }
    }
}


var margin = 200, svgWidth = 650, svgHeight = 550, width = svgWidth - margin, height = svgHeight - margin;

/*Specifying range for scaling to X and Y axes*/
var xScale = d3.scaleBand().range([0, width]).padding(0.4);
var yScale = d3.scaleLinear().range([height, 0]);

var g;

/*Function to draw a Bar Graph*/
function drawBarGraph(freqArr, heading, xLabel, yLabel) {
    d3.selectAll("svg").remove();

    /*Canvas*/
    var svg = d3.select("body").select(".main")
                    .append("svg")
                        .attr("width", svgWidth)
                        .attr("height", svgHeight);
    
    /*Adding group element for graph*/
    g = svg.append("g")
                .attr("transform", "translate(" + 100 + "," + 100 + ")");

    /*Heading of chart*/
    svg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", (width / 2))
        .attr("y", 50)
        .attr("font-size", "24px")
        .style("text-anchor", "middle")
        .text(heading);

    /*Specifying domain for scaling to X and Y axes*/
    xScale.domain(Object.keys(freqArr));
    yScale.domain([0, d3.max(Object.values(freqArr))]);

    /* Add the x Axis */
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text") 
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
    /* Text label for the x axis */
    g.append("text")
        .attr("y", height + (margin / 3))
        .attr("x", (width / 2))
        .attr("text-anchor", "middle")
        .text(xLabel)
        .style('font-weight', 'bold');
    
    /* Add the y Axis */
    g.append("g")
        .call(d3.axisLeft(yScale).ticks(10));
    /* Text label for the y axis */
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (margin / 2))
        .attr("y", ((width + margin) / 20))
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .text(yLabel)
        .style('font-weight', 'bold');
    
    /*Adding bars with animation*/
    g.selectAll(".bar")
        .data(Object.entries(freqArr))
        .enter().append("rect")
            .attr("class", "bar")
            .on("mouseover", onMouseOver) //Add listener for the mouseover event
            .on("mouseout", onMouseOut)   //Add listener for the mouseout event
            .attr("x", function(d) { return xScale(d[0]); })
            .attr("y", function(d) { return yScale(d[1]); })
            .attr("width", xScale.bandwidth())
            .transition()
            .ease(d3.easeLinear)
            .duration(400)
            .delay(function (d, i) {
                return i * 50;
            })
            .attr("height", function(d) { return height - yScale(d[1]); });
}

/*Specifying scaling for X and Y axes of histogram*/
var xScale_hist = d3.scaleLinear().range([0, width]);
var yScale_hist = d3.scaleLinear().range([height, 0]);
/*Function to draw a Histogram*/
function plotHistogram(arr, heading, xLabel, yLabel, varBins) {
    d3.selectAll("svg").remove();

    /*Canvas*/
    var svg = d3.select("body").select(".main")
                    .append("svg")
                        .attr("width", svgWidth)
                        .attr("height", svgHeight);
    
    /*Adding group element for graph*/
    g = svg.append("g")
                .attr("transform", "translate(" + 100 + "," + 100 + ")");

    /*Heading of chart*/
    svg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", (width / 2))
        .attr("y", 50)
        .attr("font-size", "24px")
        .style("text-anchor", "middle")
        .text(heading);
    
    /*Specifying domain for scaling to X axis*/
    xScale_hist.domain([0, d3.max(arr)]);

    /*Setting parameters for the histogram*/
    var histogram = d3.histogram()
        .value(function(d) { return d; })
        .domain(xScale_hist.domain())
        .thresholds(xScale_hist.ticks(varBins));

    /*Get the bins */
    var bins = histogram(arr);

    /*Specifying domain for scaling to Y axis*/
    yScale_hist.domain([0, d3.max(bins, function(d) { return d.length; })]);

    //var xScale_ticks = d3.scaleLinear().range([0, width]).domain([-(xScale_hist(bins[0].x1) - xScale_hist(bins[0].x0)), d3.max(arr)]);

    /* Add the x Axis */
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale_hist).ticks(varBins))
        .selectAll("text") 
        .style("text-anchor", "end")
        .style("font-size", "8px")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
    /* Text label for the x axis */
    g.append("text")
        .attr("y", height + (margin / 3))
        .attr("x", (width / 2))
        .attr("text-anchor", "middle")
        .text(xLabel)
        .style('font-weight', 'bold');
    
    /* Add the y Axis */
    g.append("g")
    .call(d3.axisLeft(yScale_hist));
    /* Text label for the y axis */
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (margin / 2))
        .attr("y", ((width + margin) / 20))
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .text(yLabel)
        .style('font-weight', 'bold');
    
    /*Adding bars with animation*/
    g.selectAll(".bar")
        .data(bins)
        .enter().append("rect")
            .attr("class", "bar")
            .on("mouseover", onMouseOver_hist) //Add listener for the mouseover event
            .on("mouseout", onMouseOut_hist)   //Add listener for the mouseout event
            .attr("x", function(d) { return xScale_hist(d.x0); })
            .attr("y", function(d) { return yScale_hist(d.length); })
            .attr("width", function(d) { return (xScale_hist(d.x1) - xScale_hist(d.x0) - 1) > 0 ? (xScale_hist(d.x1) - xScale_hist(d.x0) - 1) : (xScale_hist(d.x1) - xScale_hist(d.x0) ); })
            .transition()
            .ease(d3.easeLinear)
            .duration(1000)
            .attr("height", function(d) { return height - yScale_hist(d.length); });
    
    /*For mouse click and drag feature*/
    var deltaX;
    var current;
    var numBins = varBins;
    var dragHandler = d3.drag()
        .on("start", function() {
            current = d3.event.x;
        })
        .on("drag", function() {
            deltaX = Math.floor((current - d3.event.x) / 50);
            numBins += deltaX;
            if(numBins < 2)
                numBins = 2;
            if(numBins > 100)
                numBins = 100;
        })
        .on("end", function() {
            plotHistogram(arr, heading, xLabel, yLabel, numBins); 
        });
    dragHandler(svg);
    
}

/*Function to highlight bar and display value on top on mouse hover for bar chart*/
function onMouseOver(d, i) {
    d3.select(this)
        .attr('class', 'highlight');
    d3.select(this)
        .transition()
        .duration(400)
        .attr('width', xScale.bandwidth() + 5)
        .attr("y", function(d) { return yScale(d[1]) - 10; })
        .attr("height", function(d) { return height - yScale(d[1]) + 10; });

    g.append("text")
        .attr('class', 'val') 
        .attr('x', function() {
            return (xScale(d[0]));
        })
        .attr('y', function() {
            return yScale(d[1]) - 15;
        })
        .text(function() {
            return [d[1]];
        })
        .style('fill', 'red');
}

/*Function to remove the highlighting and value on top after mouse is out of the bar for bar chart*/
function onMouseOut(d, i) {
    d3.select(this).attr('class', 'bar');
    d3.select(this)
        .transition()
        .duration(400)
        .attr('width', xScale.bandwidth())
        .attr("y", function(d) { return yScale(d[1]); })
        .attr("height", function(d) { return height - yScale(d[1]); });

    d3.selectAll('.val')
        .remove()
}

/*Function to highlight bar and display value on top on mouse hover for histogram*/
function onMouseOver_hist(d, i) {
    d3.select(this)
        .attr('class', 'highlight');
    d3.select(this)
        .transition()
        .duration(400)
        .attr('width', function(d) { return (xScale_hist(d.x1) - xScale_hist(d.x0) - 0.5) > 0 ? (xScale_hist(d.x1) - xScale_hist(d.x0) - 0.5) : (xScale_hist(d.x1) - xScale_hist(d.x0) ); })
        .attr("y", function(d) { return yScale_hist(d.length) - 10; })
        .attr("height", function(d) { return height - yScale_hist(d.length) + 10; });

    g.append("text")
        .attr('class', 'val') 
        .attr('x', function() {
            return (xScale_hist(d.x0));
        })
        .attr('y', function() {
            return yScale_hist(d.length) - 15;
        })
        .text(function() {
            return d.length;  // Value of the text
        })
        .style('fill', 'red');
}

/*Function to remove the highlighting and value on top after mouse is out of the bar for histogram*/
function onMouseOut_hist(d, i) {
    d3.select(this).attr('class', 'bar');
    d3.select(this)
        .transition()
        .duration(400)
        .attr('width', function(d) { return (xScale_hist(d.x1) - xScale_hist(d.x0) - 1) > 0 ? (xScale_hist(d.x1) - xScale_hist(d.x0) - 1) : (xScale_hist(d.x1) - xScale_hist(d.x0) ); })
        .attr("y", function(d) { return yScale_hist(d.length); })
        .attr("height", function(d) { return height - yScale_hist(d.length); });

    d3.selectAll('.val')
        .remove()
}

/*Specifying scaling for X and Y axes of scatter plot*/
var xScale_sp = d3.scaleLinear().range([0, width]);
var yScale_sp = d3.scaleLinear().range([height, 0]);

/*Function to plot Scatterplot*/
function drawScatterplot(xName, yName, xArr, yArr, heading, xLabel, yLabel) {
    d3.selectAll("svg").remove();
    
    /*Combining both arrays*/
    var combArr = xArr.map(function (value, index){
        return [value, yArr[index]]
    });

    /*Canvas*/
    var svg = d3.select("body").select(".main")
                    .append("svg")
                        .attr("width", svgWidth)
                        .attr("height", svgHeight);
    
    /*Adding group element for graph*/
    g = svg.append("g")
                .attr("transform", "translate(" + 100 + "," + 100 + ")");

    /*Heading of chart*/
    svg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", (width / 2))
        .attr("y", 50)
        .attr("font-size", "24px")
        .style("text-anchor", "middle")
        .text(heading);

    /*Specifying X and Y scales*/
    if(categoricalOptions.includes(xName)) {
        xScale_sp = d3.scaleBand().range([0, width]).padding(2);
        xScale_sp.domain(Object.keys(window[xName]));
    } else {
        xScale_sp = d3.scaleLinear().range([0, width]);
        xScale_sp.domain([d3.min(xArr), d3.max(xArr)]);
    }

    if(categoricalOptions.includes(yName)) {
        yScale_sp = d3.scaleBand().range([height, 0]).padding(2);
        yScale_sp.domain(Object.keys(window[yName]));
    } else {
        yScale_sp = d3.scaleLinear().range([height, 0]);
        yScale_sp.domain([d3.min(yArr), d3.max(yArr)]);
    }
    
    /* Add the x Axis */
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale_sp))
        .selectAll("text") 
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
    /* Text label for the x axis */
    g.append("text")
        .attr("y", height + (margin / 3))
        .attr("x", (width / 2))
        .attr("text-anchor", "middle")
        .text(xLabel)
        .style('font-weight', 'bold');
    
    /* Add the y Axis */
    g.append("g").call(d3.axisLeft(yScale_sp));
    /* Text label for the y axis */
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (margin / 2))
        .attr("y", ((width + margin) / 20))
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .text(yLabel)
        .style('font-weight', 'bold');
    
    /*Adding dots to the scatter plot*/
    g.selectAll("dot")
        .data(combArr)
        .enter()
        .append("circle")
            .transition()
            .delay(function(d,i){return(i)})
            .duration(300)
            .attr("cx", function (d) { 
                if(categoricalOptions.includes(xName)) {
                    return xScale_sp(d[0]) + Math.random() * 10; 
                } else {
                    return xScale_sp(d[0]);
                }
                } )
            .attr("cy", function (d) { 
                if(categoricalOptions.includes(yName)) {
                    return yScale_sp(d[1]) + Math.random() * 10; 
                } else {
                    return yScale_sp(d[1]);
                }
                } )
            .attr("r", 1.5)
            .style("fill", "steelblue");

    g.selectAll("circle")
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('100')
                .attr("r", 5)
                .style("fill", "red");

        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('200')
                .attr("r", 1.5)
                .style("fill", "#69b3a2");
        });
}
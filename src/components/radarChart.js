
import React, { useState, useEffect, useRef } from 'react'
import * as d3 from "d3";
import { defaultRadarColor } from '../palette';

export default function RadarChart(props) {

    let ref = useRef();
    let [data, setData] = useState([
        [//iPhone
            { axis: "Battery Life", value: 0.22 },
            { axis: "Brand", value: 0.28 },
            { axis: "Contract Cost", value: 0.29 },
            { axis: "Design And Quality", value: 0.17 },
            { axis: "Have Internet Connectivity", value: 0.22 },
            { axis: "Large Screen", value: 0. },
            { axis: "Price Of Device", value: 0.41 },
            { axis: "To Be A Smartphone", value: 0.50 }
        ],
        [//Samsung
            { axis: "Battery Life", value: 0.27 },
            { axis: "Brand", value: 0.16 },
            { axis: "Contract Cost", value: 0.35 },
            { axis: "Design And Quality", value: 0.13 },
            { axis: "Have Internet Connectivity", value: 0.20 },
            { axis: "Large Screen", value: 0.13 },
            { axis: "Price Of Device", value: 0.35 },
            { axis: "To Be A Smartphone", value: 0.38 }
        ], [//Nokia Smartphone
            { axis: "Battery Life", value: 0.26 },
            { axis: "Brand", value: 0.10 },
            { axis: "Contract Cost", value: 0.30 },
            { axis: "Design And Quality", value: 0.14 },
            { axis: "Have Internet Connectivity", value: 0.22 },
            { axis: "Large Screen", value: 0.04 },
            { axis: "Price Of Device", value: 0.41 },
            { axis: "To Be A Smartphone", value: 0.30 }
        ]
    ]);

    let radarColor = props || defaultRadarColor;
    let numOfAxis = 8;
    let axisData = [];
    for (let i = 0; i < numOfAxis; i++)
        axisData.push(i);

    var margin = { top: 100, right: 100, bottom: 100, left: 100 },
        width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
        height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

    var cfg = {
        w: 400,				//Width of the circle
        h: 400,				//Height of the circle
        margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
        levels: 6,				//How many levels or inner circles should there be drawn
        maxValue: 0, 			//What is the value that the biggest circle will represent
        labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
        opacityArea: 0.35, 	//The opacity of the area of the blob
        dotRadius: 4, 			//The size of the colored circles of each blog
        opacityCircles: 0.1, 	//The opacity of the circles of each blob
        strokeWidth: 2, 		//The width of the stroke around each blob
        roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
        color: d3.scaleOrdinal(d3.schemeCategory10)	//Color function
    };

    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    var maxValue = Math.max(cfg.maxValue, d3.max(data, function (i) { return d3.max(i.map(function (o) { return o.value; })) }));

    var allAxis = (data[0].map(function (i, j) { return i.axis })),	//Names of each axis
        total = allAxis.length,					//The number of different axes
        radius = Math.min(cfg.w / 2, cfg.h / 2), 	//Radius of the outermost circle
        angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

    //Scale for the radius
    var rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue]);

    useEffect(() => {
        //Initiate the radar chart SVG
        var svg = d3.select(ref.current).append("svg")
            .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
            .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
            .attr("class", "radar-chart");

        //Append a g element		
        var g = svg.append("g")
            .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");

        //Wrapper for the grid & axes
        var axisGrid = g.append("g").attr("class", "axisWrapper");

        //Draw the background circles
        axisGrid.selectAll(".levels")
            .data(d3.range(1, (cfg.levels + 1)).reverse())
            .enter()
            .append("circle")
            .attr("class", "gridCircle")
            .attr("r", function (d, i) { return radius / cfg.levels * d; })
            .style("fill", props.radarColor || defaultRadarColor)
            .style("stroke", (d, i) => i === 0 ? props.radarColor || defaultRadarColor : 'white')
            .style("fill-opacity", cfg.opacityCircles)

        //Create the straight lines radiating outward from the center
        var axis = axisGrid.selectAll(".axis")
            .data(axisData)
            .enter()
            .append("g")
            .attr("class", "axis");
        //Append the lines
        axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", function (d, i) { return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2); })
            .attr("y2", function (d, i) { return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); })
            .attr("class", "line")
            .style("stroke", "white")
            .style("stroke-width", "2px");


        //The radial line function
        var radarLine = d3.lineRadial()
            .radius(function (d) { return rScale(d.value); })
            .angle(function (d, i) { return i * angleSlice; });

        if (cfg.roundStrokes) {
            radarLine.interpolate("cardinal-closed");
        }

        //Create a wrapper for the blobs	
        var blobWrapper = g.selectAll(".radarWrapper")
            .data(data)
            .enter().append("g")
            .attr("class", "radarWrapper");


        //Append the circles
        blobWrapper.selectAll(".radarCircle")
            .data(function (d, i) { return d; })
            .enter().append("circle")
            .attr("class", "radarCircle")
            .attr("r", cfg.dotRadius)
            .attr("cx", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2) + 10; })
            .attr("cy", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
            .style("fill", function (d, i, j) { return cfg.color(j); })
            .style("fill-opacity", 0.8);

    }, [])



    return (
        <>
            <h2>Radar Chart</h2>
            <div
                ref={ref}
                className='radar-chart'
            >

            </div>
        </>
    );
}

//Taken from http://bl.ocks.org/mbostock/7555321
//Wraps SVG text	
function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.4, // ems
            y = text.attr("y"),
            x = text.attr("x"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}




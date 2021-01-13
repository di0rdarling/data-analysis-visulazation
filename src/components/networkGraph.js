import React, { useState, useEffect, useRef } from 'react'
import * as d3 from "d3";
import { Paper } from '@material-ui/core';


export default function NetworkGraph() {

    const WIDTH = 300;
    const HEIGHT = 300;

    let ref = useRef();
    let [hoveredNode, setHoveredNode] = useState({
        name: null,
        age: null,
        sex: null,
        x: null,
        y: null
    })

    let [data, setData] = useState({
        nodes: [
            { name: "Travis", sex: "M", age: 10 },
            { name: "Rake", sex: "M", age: 19 },
            { name: "Diana", sex: "F", age: 9 },
            { name: "Rachel", sex: "F", age: 35 },
            { name: "Shawn", sex: "M", age: 25 },
            { name: "Emerald", sex: "F", age: 1 }
        ],
        links: [
            { source: "Travis", target: "Rake" },
            { source: "Diana", target: "Rake" },
            { source: "Diana", target: "Rachel" },
            { source: "Rachel", target: "Rake" },
            { source: "Rachel", target: "Shawn" },
            { source: "Emerald", target: "Rachel" }
        ]
    })

    useEffect(() => {

        //Remove any previous graphs drawn to prevent duplicate graph's appearing. 
        d3.selectAll('g').remove();
        let svg = d3.select(ref.current);

        //Create a new simulation with the specified nodes data. 
        var simulation = d3.forceSimulation()
            //add nodes
            .nodes(data.nodes);

        //Gravity determines how strongly the nodes push / pull each other.
        //The lower the number, the more spread out the graph will be.
        const gravity = -100;

        //Set a charge. This is how attracted the nodes will be to each other. 
        //add a centering force
        simulation
            .force("charge", d3.forceManyBody().strength(gravity))
            .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2))

        //draw nodes
        var node = svg.append("g")
            .attr("class", "node")
            .selectAll("g")
            .data(data.nodes)
            .enter()
            .append("g")

        //draw lines for the links 
        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter().append("line")
            .attr("stroke-width", 1)
            .attr('stroke', 'black');

        //draw circles for the nodes 
        var circle = node.append('circle')
            .attr("class", "circle")
            .attr("r", d => d.age > 18 ? 10 : 5)
            .attr("fill", d => d.sex === 'F' ? "pink" : 'blue')

        //Set the node position on a hover event.
        circle.on('mouseover', (event) => {
            let currentTarget = d3.pointer(event, node.node());
            console.log(event.target.__data__)
            setHoveredNode({
                name: event.target.__data__.name,
                age: event.target.__data__.age,
                sex: event.target.__data__.sex,
                x: currentTarget[0],
                y: currentTarget[1]
            })
        })

        circle.on("mouseout", () => {
            setHoveredNode({
                name: null,
                age: null,
                sex: null,
                x: null,
                y: null
            })
        });

        //Add drag behaviour.
        circle.call(d3.drag()
            .on('start', (event, d) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on('end', (event, d) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }))

        let label = node
            .append('text')
            .text(d => d.name)



        //add tick instructions: 
        simulation.on("tick", () => {

            //update link positions 
            //simply tells one end of the line to follow one node around
            //and the other end of the line to follow the other node around
            link
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            //update circle positions each tick of the simulation 
            circle
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; })

            label
                .attr('x', (d) => { return d.x + 10 })
                .attr('y', (d) => { return d.y + 15 })

        });

        //Create the link force 
        //We need the id accessor to use named sources and targets 
        var link_force = d3.forceLink(data.links)
            .id(function (d) { return d.name; })

        simulation.force("links", link_force)

    }, [])
    return (
        <>
            <h2>Network Graph</h2>
            <svg
                ref={ref}
                className='network-graph'
                width={`${WIDTH}vw`}
                height={`${HEIGHT}vh`}
            />
            <div style={{
                position: 'absolute',
                left: hoveredNode.x,
                top: hoveredNode.y
            }}>
                <Paper style={{
                    padding: 20
                }}>
                    <h1>{hoveredNode.name}</h1>
                    <p>Age: {hoveredNode.age}</p>
                    <p>Sex: {hoveredNode.sex}</p>
                </Paper>
            </div>
        </>
    )
}
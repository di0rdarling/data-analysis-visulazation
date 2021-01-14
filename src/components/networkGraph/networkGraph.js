import React, { useEffect, useRef } from 'react'
import * as d3 from "d3";
import { networkGraphLegend } from '../../palette';


export default function NetworkGraph(props) {

    const WIDTH = 1000;
    const HEIGHT = 500;

    let ref = useRef();
    let { nodes, links, setHoveredNode } = props;

    useEffect(() => {

        //Remove any previous graphs drawn to prevent duplicate graph's appearing. 
        d3.selectAll('g').remove();
        let svg = d3.select(ref.current);

        //Create a new simulation with the specified nodes data. 
        var simulation = d3.forceSimulation()
            //add nodes
            .nodes(nodes);

        //Gravity determines how strongly the nodes push / pull each other.
        //The lower the number, the more spread out the graph will be.
        const gravity = -50;

        //Set a charge. This is how attracted the nodes will be to each other. 
        //add a centering force
        simulation
            .force("charge", d3.forceManyBody().strength(gravity))
            .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2))

        //draw nodes
        var node = svg.append("g")
            .attr("class", "node")
            .selectAll("g")
            .data(nodes)
            .enter()
            .append("g")

        //draw circles for the nodes 
        var circle = node.append('circle')
            .attr("class", "circle")
            .attr("r", 5)
            .attr("fill", d => d.role === 'head' ? networkGraphLegend.source : networkGraphLegend.target)


        //Set the node position on a hover event.
        circle.on('mouseover', (event) => {
            let currentTarget = d3.pointer(event, node.node());
            setHoveredNode({
                name: event.target.__data__.name,
                age: event.target.__data__.age,
                gender: event.target.__data__.gender,
                x: currentTarget[0],
                y: currentTarget[1]
            })
        })

        circle.on("mouseout", () => {
            setHoveredNode({
                name: null,
                age: null,
                gender: null,
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


        //draw lines for the links 
        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke-width", 1)
            .attr('stroke', 'black');

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
        var link_force = d3.forceLink(links)
            .id(function (d) { return d.name; })

        simulation.force("links", link_force)

    }, [])

    return (
        <svg
            ref={ref}
            className='network-graph'
            width={`${WIDTH}px`}
            height={`${HEIGHT}px`}
        />

    )
}
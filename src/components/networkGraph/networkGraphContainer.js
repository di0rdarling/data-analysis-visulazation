import React, { useState } from 'react'
import { generateNetworkData } from '../../utils/dataGenerator';
import NetworkGraph from './networkGraph';
import { makeStyles, Paper } from '@material-ui/core';
import { networkGraphLegend } from '../../palette';
import Legend from './legend';

const useStyles = makeStyles({
    graphRoot: {
        border: 'solid think lightgray',
        padding: 24
    },
    body: {
        display: 'flex',
        position: 'relative'
    },
});

export default function NetworkGraphContainer() {
    let classes = useStyles();
    let [data] = useState(generateNetworkData());
    let [hoveredNode, setHoveredNode] = useState({
        name: null,
        age: null,
        gender: null,
        x: null,
        y: null
    })

    return (
        <div className={classes.graphRoot}>
            <h2>Network Graph</h2>
            <div className={classes.body}>
                <NetworkGraph nodes={data.nodes} links={data.links} setHoveredNode={setHoveredNode} />
                <div style={{
                    position: 'absolute',
                    left: hoveredNode.x,
                    top: hoveredNode.y
                }}>
                    {hoveredNode.x && hoveredNode.y && (
                        <Paper style={{
                            padding: 20
                        }}>
                            <h1>{hoveredNode.name}</h1>
                            <p>Age: {hoveredNode.age}</p>
                            <p>Gender: {hoveredNode.gender}</p>
                        </Paper>
                    )}
                </div>
                <Legend legendEntries={Object.entries(networkGraphLegend)} />
            </div>
        </div>
    )
}
import React, { } from 'react'
import { makeStyles, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles({

    legendContainer: {
        padding: 16,
        width: 100,
        height: 100,
        position: 'absolute',
        right: 0
    },
    keyContainer: {
        display: 'flex',
        alignItems: 'center',
        margin: '8px 0px'
    },
    key: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        marginRight: 8
    }
});

export default function Legend(props) {
    let classes = useStyles();
    let { legendEntries } = props;
    let [key, color] = legendEntries;

    return (
        <>
            <Paper className={classes.legendContainer}>
                <Typography>Legend</Typography>
                {[key, color].map(([k, c]) => (
                    <div className={classes.keyContainer}>
                        <div className={classes.key} style={{
                            backgroundColor: c
                        }} />
                        <Typography>{k}</Typography>
                    </div>
                ))}
            </Paper>
        </>
    )
}
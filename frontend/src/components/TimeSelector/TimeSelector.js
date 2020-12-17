import React from 'react'
//style
import classes from './TimeSelector.module.scss'

function timeSelector(props) {
    const timeList = [
        { time: 15 },
        { time: 15 },
        { time: 15 },
        { time: 15 },
        { time: 15 },
        { time: 15 },
        { time: 15 },
        { time: 15 },
        { time: 15 }
    ]

    const timeSelections = timeList.map(time => (
        <div className={classes.SelectionDiv}>
            {time.time}
        </div>
    ))
    return (
        <div className={classes.TimeSelector}>
            <h3>選擇時段</h3>
            <div className={classes.SelectionsContainer}>
                {timeSelections}
            </div>
        </div>
    )
}

export default timeSelector
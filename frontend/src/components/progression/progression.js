import React from 'react';

import classes from './Progression.module.scss'

function progression(props) {
    const currentStep = props.currentStep? props.currentStep: 1
    const quotes = [
        "個人資訊",
        "選擇老師",
        "選擇時間",
        "完成預約"
    ]

    //step1 - step 4, take int 1 - 4
    let circles = []
    for (let i = 0; i < 4; i++) {

        if (i === currentStep - 1) {
            circles.push(
                <div key={i} className={`${classes.step} ${classes.selected}`} id={`${i}`}></div>
            )
        } else if (i < currentStep - 1){
            circles.push(
                <div key={i} className={`${classes.step} ${classes.completed}`} id={`${i}`}>
                    <span id={classes.checkMark}>&#10003;</span>
                </div>
            )
        } else {
            circles.push(
                <div key={i} className={classes.step} id={`${i}`}></div>
            )
        }
    }

    const progression = `${((currentStep - 1) * 32)}%`

    const quote = (
        <div id={classes[`quote${currentStep}`]}>{quotes[currentStep - 1]}</div>
    )

    return (
        <div className={classes.progression}>
            <div className={classes.container}>
                <div className={classes.progress}>
                <div 
                    className={classes.percent}
                    style={{"width": progression}}></div>
                </div>
                <div className={classes.steps}>
                    {circles}
                </div>
                <div className={classes.quote}>
                    {quote}
                </div>
            </div>
        </div>
    )
}

export default progression
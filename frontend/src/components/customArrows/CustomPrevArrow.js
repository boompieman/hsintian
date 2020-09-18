import React from 'react';

import classes from './CustomPrevArrow.module.scss';

const customPrevArrow = (props) => {
    return (
        <div 
            className={classes.GridBox}
            onClick={props.onClick}>
            <div className={classes.ArrowContainer}>
                <span className={classes.prevArrow}></span>
            </div>
        </div>
    )
}

export default customPrevArrow;
import React from 'react';

import classes from './CustomNextArrow.module.scss';

const customNextArrow = (props) => {
    return (
        <div 
            className={classes.GridBox} 
            onClick={props.onClick}>
            <div className={classes.ArrowContainer}>
                <span className={classes.nextArrow}></span>
            </div>
        </div>
    )
}

export default customNextArrow;
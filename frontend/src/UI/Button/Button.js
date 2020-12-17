import React from 'react';

import classes from './Button.module.scss';

const button = (props) => {
    return (
        <button 
            className={classes.button}
            onClick={props.onClickHandler}
            style={{
                "backgroundColor": props.backgroundColor,
                "color": props.color,
                "border": props.border,
                "width": props.width
            }}> 
            {props.children}
        </button>
    )
}

export default button;
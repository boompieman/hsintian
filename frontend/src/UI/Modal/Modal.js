import React from 'react';

import classes from './Modal.module.scss';

const modal = (props) => {
    return (
        <div className={classes.Modal}>
            {props.children}
        </div>
    )
}

export default modal;
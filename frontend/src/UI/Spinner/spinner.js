import React from 'react';

import classes from './spinner.module.scss';

const spinner = () => {
    return (
        <div className={classes.ldsSpinner}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    )
}

export default spinner;
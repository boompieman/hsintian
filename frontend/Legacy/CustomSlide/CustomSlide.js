import React from 'react';

import classes from './CustomSlide.module.scss';

import converToString from '../../container/SimpleSlider/convert_dateObject_to_dateString';

const customSlide = (props) => {
    const ch_dayArr = [
        '日',
        'ㄧ',
        '二',
        '三',
        '四',
        '五',
        '六',
    ]

    const currentDay = ch_dayArr[props.dateObject.getDay()];


    if (converToString(props.dateObject) === converToString(props.selectedDate)){
        return (
            <div 
                className={classes.CurrentDateSlide}
                onClick={() => {
                    console.log(props.dateObject)
                    console.log(props.slideIndex);
                    props.selectDateHandler(props.dateObject);
                    props.setCurrentIndex(props.slideIndex - 1)
                }}>
                <h5>
                    {
                        `${props.dateObject.getMonth()+1}` + '/' +
                        `${props.dateObject.getDate()}` + 
                        `(${currentDay})`
                    }
                </h5>
            </div>
        )
    } else {
        return (
            <div 
                className={classes.Slide}
                onClick={() => {
                        console.log(props.dateObject);
                        console.log(props.slideIndex);
                        props.selectDateHandler(props.dateObject);
                        props.setCurrentIndex(props.slideIndex - 1);
                    }
                }
                >
                <h5>
                    {
                        `${props.dateObject.getMonth()+1}` + '/' +
                        `${props.dateObject.getDate()}`
                    }
                </h5>
            </div>
        )
    }
}

export default customSlide;
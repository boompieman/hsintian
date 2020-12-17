import React from 'react';
//scss style
import classes from './Calendar.module.scss'

function getDaysInMonth(year, month) {
    console.log(year, month)
    return new Date(year, month, 0).getDate()
}

function getDay(year, month, date) {
    console.log(new Date(year, month, date))
    return new Date(year, month, date).getDay()
}

function Calendar(props) {
    const currentTime = props.currentTime
    const currentMonth = currentTime.getMonth() + 1
    const currentYear = currentTime.getFullYear()
    const currentDate = currentTime.getDate()
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const daysInLastMonth = getDaysInMonth(currentYear, currentMonth - 2)
    console.log(currentDate)
    const firstDayInMonth = getDay(currentYear, currentMonth - 1, 1)
    console.log(firstDayInMonth)
    const lastDayInMonth = getDay(currentYear, currentMonth, 0)
    console.log(lastDayInMonth)
    const iterateTimes = firstDayInMonth + daysInMonth + (6 - lastDayInMonth)
    let datesArray = []

    let calendarArray = []
    for (let i = 0; i < iterateTimes; i++) {
        let date = {
            number: null,
            select: null
        }
        if (i < firstDayInMonth ) {
            date.number = daysInLastMonth - (firstDayInMonth - i)
        } else if ( i > (firstDayInMonth + daysInMonth - 1)) {
            date.number = i - (firstDayInMonth + daysInMonth) + 1
        } else {
            if ( i < firstDayInMonth + currentDate - 1) {
                date.number = i - firstDayInMonth + 1
            } else {
                date.number = i - firstDayInMonth + 1
                date.select = props.selectDate
            }
        }

        if (date.number === currentDate) {
            calendarArray.push(
                <div 
                    className={`${classes.Day} ${classes.current}`}
                    onClick={() => date.select()}>{date.number}</div>
            )
        } else {
            calendarArray.push(
                <div 
                    className={date.select? `${classes.Selectable} ${classes.Day}`: classes.Day}
                    onClick={date.select? () => date.select(): null}>
                    {date.number}
                </div>
            )
        }
    }

    return (
        <div className={classes.Calendar}>
            <div className={`${classes.DayTitle} ${classes.Red}`}>日</div>
            <div className={classes.DayTitle}>一</div>
            <div className={classes.DayTitle}>二</div>
            <div className={classes.DayTitle}>三</div>
            <div className={classes.DayTitle}>四</div>
            <div className={classes.DayTitle}>五</div>
            <div className={`${classes.DayTitle} ${classes.Red}`}>六</div>
            {calendarArray}
        </div>
    )
}

export default Calendar
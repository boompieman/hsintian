import React from 'react';
//scss style
import classes from './Calendar.module.scss'

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate()
}

function getDay(year, month, date) {
    return new Date(year, month, date).getDay()
}

//date user to generate calendar
//date selected to display circle on certain date

function Calendar(props) {
    let selectedDate, selectedMonth, selectedYear
    if (props.selectedDate) {
        selectedYear = props.selectedDate.slice(0,4)
        selectedMonth = props.selectedDate.slice(5,7)
        selectedDate = props.selectedDate.slice(8,10)
        console.log(selectedYear, selectedMonth, selectedDate)
    }

    const displayedTime = props.displayedTime
    const month = displayedTime.getMonth() + 1 > 9? `${displayedTime.getMonth() + 1}` : `0${displayedTime.getMonth() + 1}`
    const year = `${displayedTime.getFullYear()}`
    const daysInMonth = getDaysInMonth(year, Number(month - 1))
    console.log("daysInMonth", daysInMonth)
    const daysInLastMonth = getDaysInMonth(year, Number(month - 2))
    const firstDayInMonth = getDay(year, Number(month) - 1, 1)
    const lastDayInMonth = getDay(year, month, 0)
    const iterateTimes = firstDayInMonth + daysInMonth + (6 - lastDayInMonth)
    
    const currentDateObj = new Date()
    const currentDateString = currentDateObj.getDate() > 9? `${currentDateObj.getDate()}` : `0${currentDateObj.getDate()}`
    const currentMonthString = currentDateObj.getMonth() + 1 > 9? `${currentDateObj.getMonth() + 1}` : `0${currentDateObj.getMonth() + 1}`
    const currentYearString = `${currentDateObj.getFullYear()}`

    const lastMonth = new Date(year, month - 2, 1)

    const nextMonth = new Date(year, month, 1)

    let calendarArray = []
    for (let i = 0; i < iterateTimes; i++) {
        let date = {
            year: null,
            month: null,
            number: null,
            select: null,
        }
        if (i < firstDayInMonth) {
            date.number = `${daysInLastMonth - (firstDayInMonth - i) + 1}`
            date.year = `${lastMonth.getFullYear()}`
            date.month = lastMonth.getMonth() + 1 > 9? `${lastMonth.getMonth() + 1}` : `0${lastMonth.getMonth() + 1}`
        } else if (i > (firstDayInMonth + daysInMonth - 1)) {
            date.number = i - (firstDayInMonth + daysInMonth) + 1 > 0? `${i - (firstDayInMonth + daysInMonth) + 1}` : `0${i - (firstDayInMonth + daysInMonth) + 1}`
            date.year = `${nextMonth.getFullYear()}`
            date.month = nextMonth.getMonth() + 1 > 9? `${nextMonth.getMonth() + 1}` : `0${nextMonth.getMonth() + 1}`
        } else {
            if (i < firstDayInMonth + date - 1) {
                date.number = i - firstDayInMonth + 1 > 9? `${i - firstDayInMonth + 1}` : `0${i - firstDayInMonth + 1}`
                date.month = month
                date.year = year
            } else {
                date.number = i - firstDayInMonth + 1 > 9? `${i - firstDayInMonth + 1}` : `0${i - firstDayInMonth + 1}`
                date.month = month
                date.year = year
                date.select = props.selectDate
            }
        }

        if (date.number === selectedDate && date.month === selectedMonth && date.year === selectedYear) {
            calendarArray.push(
                <div 
                    key={i}
                    className={`${classes.Day} ${classes.current}`}
                    onClick={() => date.select(year, month, date.number)}>{date.number}</div>
            )
        } else if (date.month < selectedMonth && date.year === selectedYear) {
            calendarArray.push(
                <div 
                    key={i}
                    className={`${classes.Day} ${classes.Unselectable}`}>
                    {date.number}
                </div>
            )
        } else if (Number(date.number) <= Number(currentDateString) && date.month === currentMonthString && date.year === currentYearString) {
            calendarArray.push(
                <div 
                    key={i}
                    className={`${classes.Day} ${classes.Unselectable}`}>
                    {date.number}
                </div>
            )
        } 
        
        else {
            calendarArray.push(
                <div 
                    key={i}
                    className={date.select? `${classes.Selectable} ${classes.Day}`: classes.Day}
                    onClick={date.select? () => date.select(year, month, date.number): null}>
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
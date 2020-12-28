import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../store/action/actions'
//scss
import classes from './SelectTimePage.module.scss'
//components
import Progression from '../../components/progression/progression'
import Calendar from '../../components/Calendar/Calendar'
import TimeSelector from '../../components/TimeSelector/TimeSelector'
//img
import rightArrow from './right-arrow.png'
import leftArrow from './left-arrow.png'
import selecTimePNG from './selectTime.png'
//controllers
import { getData } from '../../controllers/fetchData'

function SelectTimepage(props) {
    const [timeList, setTimeList] = useState([])
    const [selectedMonth, setSelectedMonth] = useState(new Date())
    const [selectedDateTimeList, setSelectedDateTimeList] = useState([])
    const [selectedMaster, setSelectedMaster] = useState(null)
    
    useEffect(() => {
        console.log(props.masterGid)
        console.log(props.masterId)
        getData(`/groups/${props.masterGid}/freetime`)
        .then(data => {
            console.log(data)
            const masterGid = props.masterGid
            let cachedData = {
                dateString: "",
                index: -1
            }
            let dateList = []
            setTimeList(data)
        })
        .catch(error => console.log(error))
    }, [props.masterGid])

    useEffect(() => {
        if (props.selectedDate) {
            let timeArray = []

            for (let master in  timeList) {
                const matchedTime = timeList[master].freetime.filter(time => {
                    return time.includes(props.selectedDate)
                })
                console.log(matchedTime)
                if (matchedTime.length) {
                    timeArray.push({
                        name: timeList[master].name,
                        masterId: master,
                        timeList: matchedTime
                    })
                }
            }
            
            return setSelectedDateTimeList(timeArray)
        } else {
            setSelectedDateTimeList(null)
        }
    }, [props.selectedDate, timeList])

    const selectDate = (year, month, date) => {
        const selectedDateString = `${year}-${month}-${date}`
        if (selectedDateString === props.selectedDate) {
            props.setSelectedDate(null)
            return setSelectedMaster(null)
        } else {
            console.log(selectedDateString)
            let timeArray = []

            for (let master in  timeList) {
                const matchedTime = timeList[master].freetime.filter(time => {
                    return time.includes(selectedDateString)
                })
                console.log(matchedTime)
                if (matchedTime.length) {
                    timeArray.push({
                        name: timeList[master].name,
                        masterId: master,
                        timeList: matchedTime
                    })
                }
            }
            console.log(timeArray)
            setSelectedMaster(null)
            return props.setSelectedDate(selectedDateString)
        }
    }

    const nextMonth = () => {
        const currentYear = selectedMonth.getFullYear()
        const nextMonth = selectedMonth.getMonth() + 1
        const nextMonthDate = new Date(currentYear, nextMonth, 1)
        console.log(selectedMonth, nextMonthDate)
        setSelectedMonth(nextMonthDate)
    }

    const lastMonth = () => {
        const currentYear = selectedMonth.getFullYear()
        const lastMonth = selectedMonth.getMonth() - 1
        const lastMonthDate = new Date(currentYear, lastMonth, 1)
        const lastMonthString = lastMonthDate.getMonth() + 1 > 10? lastMonthDate.getMonth() + 1 : `0${lastMonthDate.getMonth() + 1}`
        const lastMonthYM = `${lastMonthDate.getFullYear()}${lastMonthString}`
        const currentTime = new Date()
        const currentMonth = currentTime.getMonth() + 1 > 10? currentTime.getMonth() + 1 : `0${currentTime.getMonth() + 1}`
        const currentMonthYM = `${currentTime.getFullYear()}${currentMonth}`
        if (lastMonthYM < currentMonthYM) {
            return 
        }
        setSelectedMonth(lastMonthDate)
    }

    const selectMaster = (masterId) => {
        const matchedMaster = selectedDateTimeList.find(master => master.masterId === masterId)
        console.log(matchedMaster)
        if (selectedMaster) {
            if (matchedMaster.masterId === selectedMaster.masterId) {
                return setSelectedMaster(null)
            }
        }
        return setSelectedMaster(matchedMaster)
    }

    return (
        <div className={classes.SelectTimePage}>
            <img src={selecTimePNG} alt="選擇時間"/>
            <Progression currentStep={3}/>
            <div className={classes.MonthSelector}>
                <div>
                    <img 
                        className={classes.Arrow} src={leftArrow} alt="Left Arrow"
                        onClick={() => lastMonth()}/>
                </div>
                <div className={classes.MonthDisplay}>
                    {selectedMonth.getMonth() + 1}月
                </div>
                <div>
                    <img className={classes.Arrow} src={rightArrow} alt="Right Arrow"
                        onClick={() => nextMonth()}/>
                </div>
            </div>
            <Calendar 
                selectDate={selectDate}
                selectedDate={props.selectedDate}
                displayedTime={selectedMonth} />
            <TimeSelector 
                selectedDateTimeList={selectedDateTimeList}
                selectedMaster={selectedMaster}
                selectMaster={selectMaster}/>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        selectedDate: state.selectedDate,
        masterId: state.masterId,
        masterGid: state.masterGid
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setSelectedDate: (selectedDate) => dispatch(actions.setSelectedDate(selectedDate))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectTimepage)

//select date and filter matched time List
/* 
    const selectedDate = "YYYY-MM-DD"
    let timeArray = [
        {
            name: "",
            masterId: "",
            timeList: []
        }
    ]

    for (let master in  data) {
        const matchedTime = data[master][freetime].filter(time => {
            return time.includes(selectedData)
        })

        if (matchedTime) {
            timeArray.push({
                name: data[master].name
                masterId: master,
                timeList: matchedTime
            })
        }
    }
*/
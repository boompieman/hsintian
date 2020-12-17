import React, {useEffect} from 'react'
import { connect } from 'react-redux'
//scss
import classes from './SelectTimePage.module.scss'
//components
import Progression from '../../components/progression/progression'
import Calendar from '../../components/Calendar/Calendar'
import TimeSelector from '../../components/TimeSelector/TimeSelector'
import Footer from '../../components/Footer/Footer'
//img
import rightArrow from './right-arrow.png'
import leftArrow from './left-arrow.png'
//controllers
import getTimeList from './controllers/getTimeList'

function SelectTimepage(props) {
    console.log(props)
    useEffect(() => {
        console.log("useeffect")
        getTimeList(81, "20201201")
        .then(data => console.log(data))
        .catch(error => console.log(error))
    }, [])

    const selectDate = () => {
        console.log("select Date")
    }

    const nextMonth = () => {
        const currentMonth = props.selectedDate.getMonth()
        const currentYear = props.selectedDate.getFullYear()
        const nextMonth = currentMonth + 1
        const nextMonthDate = new Date(currentYear, nextMonth, 1)
        console.log(currentMonth, nextMonthDate)
    }

    nextMonth()

    return (
        <div className={classes.SelectTimePage}>
            <Progression currentStep={3}/>
            <div className={classes.MonthSelector}>
                <div>
                    <img className={classes.Arrow} src={leftArrow} alt="Left Arrow"/>
                </div>
                <div className={classes.MonthDisplay}>一月</div>
                <div>
                    <img className={classes.Arrow} src={rightArrow} alt="Right Arrow"/>
                </div>
            </div>
            <Calendar 
                selectDate={selectDate}
                currentTime={props.selectedDate} />
            <TimeSelector />
            <Footer />
        </div>
    )
}

const mapStateToProps = state => {
    return {
        selectedDate: state.selectedDate
    }
}

// const mapDispatchToProps = dispatch => {
//     return {
        
//     }
// }

export default connect(mapStateToProps)(SelectTimepage)
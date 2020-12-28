import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../../store/action/actions'
//style
import classes from './TimeSelector.module.scss'

function TimeSelector(props) {
    const {selectedMaster, selectMaster, selectedDateTimeList} = props

    const selectTime = (event, masterId, datetimeString) => {
        event.stopPropagation()
        console.log(datetimeString)
        props.setMasterDatetimeString(masterId, datetimeString)
    }

    let masterSelection
    if (selectedDateTimeList !== null && !selectedDateTimeList.length) {
        masterSelection = (
            <div className={classes.NoTime}>
                本日無可預約時段
            </div>
        )
    } else if (selectedDateTimeList && selectedDateTimeList.length) {
        let masterTimeList
        if (selectedMaster) {
            masterTimeList = selectedMaster.selectedDateTimeList.map(time => {
                const content = time.slice(11, 16)
                return (
                    <div 
                        key={time}
                        className={classes.TimeBlock}
                        onClick={(e) => selectTime(e, props.masterId, time)}>
                        {content}
                    </div>
                )
            })

            masterSelection = selectedDateTimeList.map(master => {
                if (selectedMaster.masterId === master.masterId){
                    return (
                        <div 
                            key={master.masterId}
                            className={`${classes.MasterBox} ${classes.Selected}`}
                            onClick={() => selectMaster(master.masterId)}>
                            <p>
                                {master.name}
                            </p>
                            <div className={classes.timeBlocksContainer}>
                                {masterTimeList}
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div 
                            key={master.masterId}
                            className={classes.MasterBox}
                            onClick={() => selectMaster(master.masterId)}>
                            <p>
                                {master.name}
                            </p>
                        </div>
                    )
                }
            })
        } else {
            masterSelection = selectedDateTimeList.map(master => (
                <div 
                    key={master.masterId}
                    className={classes.MasterBox}
                    onClick={() => selectMaster(master.masterId)}>
                    <p>
                        {master.name}
                    </p>
                </div>
            ))
        }
    }

    return (
        <div className={classes.TimeSelector}>
            <h3>選擇時段</h3>
            <div className={classes.SelectionsContainer}>
                {masterSelection}
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        masterId: state.masterId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setDateTimeString: (datetimgString) => dispatch(actions.setDateTimeString(datetimgString)),
        setMasterDatetimeString: (masterId, selectedDatetimeString) => dispatch(actions.setMasterDatetimeString(masterId, selectedDatetimeString))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeSelector)
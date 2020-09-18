import React, { Component } from 'react';

import Loading from '../../UI/Loading/Loading';

import classes from './TimeSelection.module.scss';

class TimeSelection extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        console.log('TimeSelection, componentDidMount', this.props.selectedDate_timeList);
    }

    onClickHandler = (e, number) => {
        this.props.onSelectClassTimeHandler(e, number);
    }

    onCancelClickHandler = (e) => {
        this.props.cancelClassTimeHandler(e);
    }

    render(){
        const timePeriodArr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        console.log('timeSelection', this.props.classTime);
        console.log(this.props.selectedDate_timeList);

        let masterList = {
            masterID_list: [],
            masterName_list: []
        }

        if ( this.props.selectedDate_timeList ){
            this.props.selectedDate_timeList.forEach(doctor_time => {
                if ( !masterList.masterID_list.length ){
                    masterList.masterID_list.push(doctor_time.master_id);
                    masterList.masterName_list.push(doctor_time.master_display_name);
                } else if ( !masterList.masterID_list.includes(doctor_time.master_id) ){
                    masterList.masterID_list.push(doctor_time.master_id);
                    masterList.masterName_list.push(doctor_time.master_display_name);
                }
            })
        }
        console.log(masterList);

        let timePeriodDivs = [];


        if(this.props.selectedDate_timeList !== 'no free time' && this.props.selectedDate_timeList){
            this.props.selectedDate_timeList.map((time) => {
                timePeriodDivs.push(
                    <div className={classes.TimePeriodDiv}>
                        <div className={classes.InfoDiv}>
                            <p>{time.master_display_name}</p>
                            <p>時間：{time.time}</p>
                        </div>
                        <p
                            id={classes.ReserveButton}
                            onClick={() => this.props.makeReservation(time.master_id, time.time)}>
                            <u>預&nbsp;&nbsp;約</u>
                        </p>
                    </div>
                )
            })
        }

        let no_res = null;

        let timeList = {
            morning: [],
            afternoon: [],
            evening: []
        }

        if ( this.props.selectedDate_timeList !== 'no free time' && this.props.selectedDate_timeList ){
            this.props.selectedDate_timeList.forEach(time => {
                if ( Number(time.time) < 1200 && Number(time.time) >= 800){
                    timeList.morning.push(time);
                } else if ( Number(time.time) < 1600 && Number(time.time) >= 1200){
                    timeList.afternoon.push(time);
                } else if ( Number(time.time) < 2000 && Number(time.time) >= 1600){
                    timeList.evening.push(time);
                }
            })
        }

        console.log('timePeriod', this.props.timePeriod);
        if ( this.props.timePeriod.length ){
            timePeriodDivs = timeList[this.props.timePeriod].map(time => {
                if ( time.master_id === this.props.selectedDoctor ){
                    return (
                        <div className={classes.TimePeriodDiv}>
                            <div className={classes.InfoDiv}>
                                <p>{time.master_display_name}</p>
                                <p>時間：{time.time}</p>
                            </div>
                            <p
                                id={classes.ReserveButton}
                                onClick={() => this.props.makeReservation(time.master_id, time.time)}>
                                <u>預&nbsp;&nbsp;約</u>
                            </p>
                        </div>
                    )
                }
            });
            console.log(timePeriodDivs);
        }

        let masterListDivs = [];

        if ( this.props.phase === 1 ){
            if (this.props.no_res){
                no_res = (
                    <div>
                        <h3>本月無可預約時段</h3>
                    </div>
                )
            }

            if ( masterList.masterID_list.length ){
                console.log(timeList);
                console.log(masterList);
                masterList.masterName_list.forEach((doctor, index) => {
                    console.log(doctor);
                    masterListDivs.push(
                        <div className={classes.DoctorDiv}>
                            <div className={classes.TitleBar}>
                            <p className={classes.DoctorName}>{doctor}</p>
                            </div>
                                <div className={classes.ButtonRow}>
                                {
                                    timeList.morning.find(time => time.master_display_name === doctor)? 
                                    (
                                        <div 
                                            className={classes.TimePeriodButton}
                                            onClick={() => this.props.selectDoctorHandler(masterList.masterID_list[index], 'morning')}>08:00 AM - 12:00 PM</div>
                                    ):null
                                }
                                {
                                    timeList.afternoon.find(time => time.master_display_name === doctor)? 
                                    (
                                        <div 
                                            className={classes.TimePeriodButton}
                                            onClick={() => this.props.selectDoctorHandler(masterList.masterID_list[index], 'afternoon')}>12:00 PM - 04:00 PM</div>
                                    ):null
                                }
                                {
                                    timeList.evening.find(time => time.master_display_name === doctor)? 
                                    (
                                        <div 
                                        className={classes.TimePeriodButton}
                                        onClick={() => this.props.selectDoctorHandler(masterList.masterID_list[index], 'evening')}>04:00 PM - 08:00 PM</div>
    
                                    ): null
                                }
                            </div>
                        </div>
                    )
                })
            }

            return (
                <div className={classes.TimeDivsContainer}>
                    {masterListDivs}
                    {no_res}
                </div>
            )
        }

        if (this.props.no_res){
            no_res = (
                <div>
                    <h3>本月無可預約時段</h3>
                </div>
            )
        }

        if ( this.props.selectedDate_timeList === null || this.props.isFetchingTime === true ){
            return (
                <div className={classes.TimeDivsContainer}>
                    <Loading />
                </div>
            )
        } else {
            return (
                <div className={classes.TimeDivsContainer}>
                    {timePeriodDivs}
                    {no_res}
                </div>
            )
        }
    }
}

export default TimeSelection;
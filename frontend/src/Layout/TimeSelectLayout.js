import React, { Component } from 'react';

import MonthSlider from '../container/MonthSlider/MonthSlider';
import SimpleSlider from '../container/SimpleSlider/SimpleSlider';
import TimeSelection from '../container/TimeSelection/TimeSelection';
import Spinner from '../UI/Spinner/spinner';
import BackDrop from '../UI/Backdrop/Backdrop';
import Button from '../UI/Button/Button';
import Aux from '../hoc/aux';

import convertToDateString from '../container/SimpleSlider/convert_dateObject_to_dateString';
import converToDateObject from '../container/SimpleSlider/convert_dateString_to_dateObject';

import classes from './TimeSelectLayout.module.scss';

class TimeSelectLayout extends Component {
    constructor(props){
        super(props);
    }

    state = {
        selectedDate_object: new Date(),
        timedata: [],
        monthList: '',
        dateList: [],
        selectedMonth: '',
        selectedDate: '',
        timeList: '',
        datetime_object: {},
        loading: true,
        phase: 1,
        timePeriod: '',
        selectedDoctor: ''
    }

    selectMonthHandler = (month) => {
        console.log(month);

        const dateList = this.state.datetime_object[month].map((date) => {
            return converToDateObject(date.date);
        })
        console.log(dateList);

        if (dateList.length){
            console.log(dateList[0])
            this.setState({
                selectedMonth: month,
                dateList,
                selectedDate: dateList[0],
                timeList: this.state.datetime_object[month][0].time_list
            });

            this.props.setDateTimeString(dateList[0])
        } else {
            this.setState({
                selectedMonth: month,
                dateList,
                timeList: []
            })
        }
    };

    selectDateHandler = (date, index) => {
        if (date === this.state.selectedDate){
            return ;
        };

        const datetime_string = convertToDateString(date);

        const targetDate = this.state.timedata.infos.datetime.find((date) => {
            return date.date === datetime_string;
        });


        this.setState({
            selectedDate: date,
            timeList: targetDate.time_list
        })

        this.props.setDateTimeString(date);
    }

    phaseHandler = () => {
        this.setState({
            phase: 1
        })
    }

    selectDoctorHandler = ( doctorId, timePeriod ) => {
        this.setState({
            selectedDoctor: doctorId,
            timePeriod,
            phase: 2
        })
    }

    lastStepHandler = () => {
        if ( this.state.phase === 1 ){
            return this.props.prevStep();
        } else {
            this.setState({
                phase: 1
            })
        }
    }

    componentDidMount(){
        const fetch_timedata = () => {
            const datetime_string = convertToDateString(new Date());

            const params = {
                gid: this.props.masterGid,
                day: 60,
                start_date: datetime_string
            }

            let esc = encodeURIComponent;
            const queryString = Object.keys(params)
                                    .map((ele) => esc(ele) + '=' + esc(params[ele])).join('&');
            
                                
            fetch('https://hsintian.tk/api/freetime/get/?' + queryString, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                const firstDate = converToDateObject(data.infos.datetime[0].date);

                const datetime_object = new Object();
                
                data.infos.datetime.forEach((date) => {
                    const dateObject = converToDateObject(date.date);
                    const month_of_date = dateObject.getMonth() + 1;
                    
                    if (!datetime_object[month_of_date]){
                        datetime_object[month_of_date] = [];

                        if (date.time_list.length){
                            datetime_object[month_of_date].push(date);
                        }
                    } else {
                        if (date.time_list.length){
                            datetime_object[month_of_date].push(date);
                        }
                    }
                });

                const monthList = [];
                for (let key in datetime_object){
                    monthList.push(key);
                }

                const dateList = datetime_object[monthList[0]].map((date) => {
                    return converToDateObject(date.date);
                });

                if (!dateList.length){
                    this.setState({
                        timedata: data,
                        monthList,
                        selectedMonth: monthList[0],
                        dateList,
                        datetime_object,
                        loading: false
                    })
                } else {
                    this.setState({
                        timedata: data,
                        monthList,
                        selectedMonth: monthList[0],
                        selectedDate: converToDateObject(datetime_object[monthList[0]][0].date),
                        dateList,
                        timeList: datetime_object[monthList[0]][0].time_list,
                        datetime_object,
                        loading: false
                    });

                    this.props.setDateTimeString(converToDateObject(datetime_object[monthList[0]][0].date));
                }
            })
            .catch(err => console.log(err))
        };

        fetch_timedata();
    };

    componentDidUpdate(prevState){
        console.log(this.state);
    }
    
    render(){
        console.log(this.props);
        if (this.state.loading){
            return (
                <div className={classes.timeSelectLayout}>
                    <Spinner />
                </div>
            )
        }

        return (
            <div className={classes.timeSelectLayout}>
                {
                    this.props.isPending?
                    (
                        <Aux>
                            <BackDrop />
                            <Spinner />
                        </Aux>
                    ): null
                }
                {
                    this.props.error?
                    (
                        <Aux>
                            <BackDrop onClickHandler={this.props.backdropHandler}/>
                            <div className={classes.ErrorMessage}>
                                <p>{this.props.error}</p>
                            </div>
                        </Aux>
                    ): null
                }
                
                <div className={classes.TitleBar}>
                    <div className={classes.ButtonContainer}>
                        <Button
                            onClickHandler={this.lastStepHandler.bind(this)}
                            border="none"
                            backgroundColor="#CC0000"
                            color="white">
                            上一步
                        </Button>
                    </div>
                    <div>
                        <h2 id={classes.timeSelectTitle}>請選擇時間</h2>
                    </div>
                </div>
                <div className={classes.YearAndMonthBar}>
                    <h2 className={classes.YearBar}>
                        { this.state.selectedDate_object ?
                            `${this.state.selectedDate_object.getFullYear()}` + '年':
                            null
                        }
                    </h2>
                    <MonthSlider 
                        monthList={this.state.monthList}
                        // currentDate_object={this.state.currentDate_object} 
                        selectMonthHandler={this.selectMonthHandler.bind(this)}/>
                </div>
                <div className={classes.DateSliderContainer}>
                    <SimpleSlider 
                        loading={this.state.loading}
                        dateList={this.state.dateList}
                        selectedDate={this.state.selectedDate}
                        selectDateHandler={this.selectDateHandler.bind(this)}/>
                </div>
                <TimeSelection
                    selectedDate_timeList={this.state.timeList}
                    no_res={!this.state.dateList.length}
                    makeReservation={this.props.makeReservation}
                    selectedDoctor={this.state.selectedDoctor}
                    selectDoctorHandler={this.selectDoctorHandler}
                    phase={this.state.phase}
                    timePeriod={this.state.timePeriod}
                />
            </div>
        )
    }
}

export default TimeSelectLayout;
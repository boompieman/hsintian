import React, { Component } from 'react';
import classes from './App.module.scss';
import { connect } from 'react-redux';

import InfoPage from './container/InfoPage/InfoPage';
import TeacherSelection from './container/TeacherSelection/TeacherSelection';
import TimeSelectLayout from './Layout/TimeSelectLayout';
import SelectTimePage from './container/SelectTimePage/SelectTimePage'

import * as actions from './store/action/actions';

import convertToString from './container/SimpleSlider/convert_dateObject_to_dateString';

const liff = window.liff;

class App extends Component {
    constructor(props){
        super(props);
        this.initializeLIFF = this.initializeLIFF.bind(this);
    }
    state = {
        isPending: false,
        error: null,
    }

    componentDidMount(){
        // this.initializeLIFF();
    }

    makeReservation = (master_id, time) => {
        this.setState({ isPending: true })
        const datetime_string = convertToString(this.props.datetime_string) + time;
        const saved_data = {
            master_id: master_id,
            dt: datetime_string,
            line_id: this.props.line_id,
            name: this.props.chineseName,
            phone: this.props.phoneNumber,
            introducer: this.props.introducer,
            gender: this.props.gender,
            age: this.props.age,
            city: this.props.city,
            district: this.props.district
        };

        const reservation_data = new FormData();
        for ( let ele in saved_data){
            reservation_data.append(ele, saved_data[ele]);
        };

        fetch('https://hsintian.tk/api/reservation/post', {
            method: 'POST',
            body: reservation_data
        })
        .then(res => res.json())
        .then(data => {
            if (data.status ==='success'){
                const reservation_post_datetime = (
                    data.info.datetime.slice(0, 4) + '/' +
                    data.info.datetime.slice(4, 6) + '/' +
                    data.info.datetime.slice(6, 8) + ' ' + 
                    data.info.datetime.slice(8, 10) + ':' +
                    data.info.datetime.slice(10, 12)
                );

                const reservationObj = {
                    line_id: data.info.line_id,
                    reservation_id: data.info.reservation_id,
                    name: data.info.name,
                    datetime: reservation_post_datetime,
                    master: this.props.masterName
                }

                const reservationFormData = new FormData();
                for ( let ele in reservationObj){
                    reservationFormData.append(ele, reservationObj[ele]);
                };

                return fetch('https://hsintian.tk/api/send_reservation/post', {
                    method: 'POST',
                    body: reservationFormData
                })
                .then(data => liff.closeWindow())
                .catch(err => {
                    this.props.setErrorMsg(`${err}`)
                })
            } else {
                this.setState({
                    error: data.error_message,
                    isPending: false
                })
            }
        })
        .catch(err => console.log(err))
    }

    backdropHandler = () => {
        this.setState({
            error: null
        })
    }

    initializeLIFF(){
        liff.init( async data => {
            const profile = await liff.getProfile();
            this.props.setInfoContent('line_id', profile.userId);
            this.props.setInfoContent('line_data_status', 'success');
        }, err => {
            console.log(err)
        })
    }

    componentDidUpdate(){
        if (this.props.line_id && this.props.line_data_status === 'success'){
            fetch('https://hsintian.tk/api/customer/get/?line_id=' + this.props.line_id, {
                method: 'get'
            })
            .then( res => res.json())
            .then( data => {
                if (data.info.is_black === true){
                    liff.sendMessages([{
                        type: 'text',
                        text: '您之前因為有缺席紀錄，我們系統自動將您列入觀察名單，請您聯繫客服完成訂位喔'
                    }])
                    .then(() => liff.closeWindow())
                    .catch(err => this.props.setErrorMsg(`${err}`));
                } else {
                    this.props.setInfoContent('chineseName', data.info.name);
                    this.props.setInfoContent('phoneNumber', data.info.phone);
                    this.props.setInfoContent('line_data_status', 'used');
                    this.props.setInfoContent('city', data.info.city);
                    this.props.setInfoContent('district', data.info.district);
                    this.props.setInfoContent('age', data.info.age);
                    this.props.setInfoContent('gender', data.info.gender);
                }
            })
            .catch(err => this.props.setErrorMsg(`${err}`));
        }
    }

    render(){
        return (
            <div className={classes.App}>
                <SelectTimePage />
            </div>
        )
        // if (this.props.step === 'info_page'){
        //     return (
        //         <div className={classes.App}>
        //             <InfoPage 
        //                 onChangeHandler={this.props.onChangeHandler}
        //                 dropDownSelectHandler={this.props.dropDownSelectHandler}
        //                 chineseName={this.props.chineseName}
        //                 phoneNumber={this.props.phoneNumber}
        //                 city={this.props.city}
        //                 district={this.props.district}
        //                 gender={this.props.gender}
        //                 age={this.props.age}
        //                 nextStep={this.props.nextStep}
        //                 unfilled_blanks={this.props.unfilled_blanks}/>ˋ
        //         </div>
        //     );
        // } else if (this.props.step === 'teacher_select'){
        //     return (
        //         <div className={classes.App}>
        //             <TeacherSelection
        //                 masterGid={this.props.masterGid}
        //                 onSelectMasterGroup={this.props.onSelectMasterGroup}
        //                 nextStep={this.props.nextStep}
        //                 prevStep={this.props.prevStep}/>
        //         </div>
        //     )
        // } else if (this.props.step === 'time_select'){
        //     if (this.props.errMsg !== null){
        //         return (
        //             <div className={classes.App}>
        //                 <p>{this.props.errMsg}</p>
        //             </div>
        //         )
        //     } else {
        //         return (
        //             <div className={classes.App}>
        //                 <TimeSelectLayout
        //                     isPending={this.state.isPending}
        //                     error={this.state.error}
        //                     backdropHandler={this.backdropHandler.bind(this)}
        //                     isFetchingTime={this.props.isFetchingTime}
        //                     prevStep={this.props.prevStep}
        //                     masterGid={this.props.masterGid}
        //                     datetime_string={this.props.datetime_string}
        //                     setDateTimeString={this.props.setDateTimeString}
        //                     selectedDate_timeList={this.props.selectedDate_timeList}
        //                     setSelectedDate_timeList={this.props.setSelectedDate_timeList}
        //                     makeReservation={this.makeReservation}
        //                     fetchTime={this.props.fetchTime}/>
        //             </div>
        //         )
        //     }
        // } else if (this.props.step === 'finished'){
        //     return (
        //         <div className={classes.App}>
        //             <p>{this.props.errMsg}</p>
        //         </div>
        //     )
        // }
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
}

const mapStateToProps = state => {
    return {
        chineseName: state.chineseName,
        phoneNumber: state.phoneNumber,
        introducer: state.introducer,
        city: state.city,
        district: state.district,
        gender: state.gender,
        age: state.age,
        unfilled_blanks: state.unfilled_blanks,
        masterGid: state.masterGid,
        masterName: state.masterName,
        step: state.step,
        selectedDate_timeList: state.selectedDate_timeList,
        datetime_string: state.datetime_string,
        line_id: state.line_id,
        line_data_status: state.line_data_status,
        errMsg: state.errMsg,
        isFetchingTime: state.isFetchingTime
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setInfoContent: (infoType, updatedValue) => dispatch(actions.setInfoContent(infoType, updatedValue)),
        onChangeHandler: (e, language_of_name) => dispatch(actions.onChangeHandler(e, language_of_name)),
        dropDownSelectHandler: (selection_name, value) => dispatch(actions.DROP_DOWN_SELECT(selection_name, value)),
        onSelectMasterGroup: (teacherName, masterName) => dispatch(actions.onSelectMasterGroup(teacherName, masterName)),
        nextStep: () => dispatch(actions.nextStep()),
        prevStep: () => dispatch(actions.prevStep()),
        setDateTimeString: (datetimestring) => dispatch(actions.setDateTimeString(datetimestring)),
        setSelectedDate_timeList: (timeList) => dispatch(actions.setSelectedDate_timeList(timeList)),
        setErrorMsg: (errMsg) => dispatch(actions.setErrorMsg(errMsg)),
        fetchTime: (isFetching) => dispatch(actions.fetchTime(isFetching))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

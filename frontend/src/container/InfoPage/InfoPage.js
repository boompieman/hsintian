import React from 'react';
import { connect } from 'react-redux';

import cities from './cities';
import ages from './ages';
import Button from '../../UI/Button/Button';
import Progression from '../../components/progression/progression'

import classes from './InfoPage.module.scss';

import welcome_pic from "../../welcome.png";

const infoPage = (props) => {
    const cities_arr = Object.keys(cities);

    const cities_options = cities_arr.map((city) => (
        <option key={city}>{city}</option>
    ));

    let district_arr = null;
    let district_options = [];

    if( props.city ){
        district_arr = cities[props.city];
        district_options = district_arr.map((district) => (
            <option key={district}>
                {district}
            </option>
        ))
    };

    const ages_options = ages.map((age_range) => (
        <option key={age_range}>
            {age_range}
        </option>
    ))

    const onChangeHandler = (e, type) => {
        if ( type === 'phoneNumber' ){
            const phoneNumber_pattern = new RegExp("^[0-9 +]+$");
            if ( phoneNumber_pattern.test(e.target.value) || e.target.value === ''){
                props.onChangeHandler(e, type);
            } else {
                return ;
            }
        }

        if ( type === 'chineseName'){
            const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]<>/?~！@#￥……&*（）——|{}    【】‘；：”“'。，、？]");

            if ( pattern.test(e.target.value) ){
                return ;
            } else {
                props.onChangeHandler(e, type);
            }
        }
    }

    return (
        <div className={classes.FormContainer}>
            <img id={classes.welcomePic} 
                src={welcome_pic}
                src='https://hsintian.tk/static/media/welcome.d4ee6e82.png' 
                />
            <Progression currentStep={1} />
            {/* <h2>請輸入個人資訊</h2> */}
            <form className={classes.InfoForm}>
                <div className={classes.infoTitle}>
                    <label>
                        中文姓名
                    </label>
                    {   props.unfilled_blanks.find((ele) => { return ele === 'chineseName' }) ?
                        <p>請填入您的中文名字</p>: null
                    }
                    <input
                        required
                        autoComplete='off'
                        placeholder='必填'
                        value={props.chineseName}
                        name='chineseName'
                        className={classes.InfoInput}
                        onChange={(e) => onChangeHandler(e, 'chineseName')}/>
                </div>
                <div className={classes.infoTitle}>
                    <label>
                        手機號碼
                    </label>
                    {   props.unfilled_blanks.find((ele) => { return ele === 'phoneNumber' }) ?
                        <p>請填入您的手機號碼</p>: null
                    }
                    <input
                        required
                        autoComplete='off'
                        placeholder='必填'
                        value={props.phoneNumber}
                        name='phoneNumber'
                        className={classes.InfoInput}
                        onChange={(e) => onChangeHandler(e, 'phoneNumber')}/>
                </div>
                <div className={classes.infoTitle}>
                    <label>介紹人</label>
                    <input 
                        autoComplete='off'
                        placeholder='若無則不填'
                        className={classes.InfoInput}
                        onChange={(e) => onChangeHandler(e, 'introducer')}/>
                </div>
                <div className={classes.selectionBar}>
                    <select 
                        style={
                            props.unfilled_blanks.find((info) => {
                                return info === 'gender'
                            })? {color: 'red'} : null
                        }
                        onChange={(e) => props.dropDownSelectHandler('gender', e.target.value)}
                        value={props.gender || '性別'}>
                        <option disabled>性別</option>
                        <option>男性</option>
                        <option>女性</option>
                        <option>其他</option>
                    </select>
                    <select
                        style={
                            props.unfilled_blanks.find((info) => {
                                return info === 'age'
                            })? {color: 'red'} : null
                        }
                        className={classes.rightSelect}
                        onChange={(e) => props.dropDownSelectHandler('age', e.target.value)}
                        value={props.age || '年齡'}>
                        <option disabled>年齡</option>
                        {ages_options}
                    </select>
                </div>
                <div className={classes.selectionBar}>
                    <select 
                        style={
                            props.unfilled_blanks.find((info) => {
                                return info === 'city'
                            })? {color: 'red'} : null
                        }
                        onChange={(e) => props.dropDownSelectHandler('city', e.target.value)} 
                        value={props.city || '城市'}>
                        <option disabled>城市</option>
                        {cities_options}
                    </select>
                    <select
                        style={
                            props.unfilled_blanks.find((info) => {
                                return info === 'district'
                            })? {color: 'red'} : null
                        }                    
                        className={classes.rightSelect}
                        onChange={(e) => props.dropDownSelectHandler('district', e.target.value)} 
                        value={props.district || '區、鎮、鄉'}
                        defaultValue="區、鎮、鄉">
                        <option disabled value='區、鎮、鄉'>區、鎮、鄉</option>
                        {district_options}
                    </select>
                </div>
                <div className={classes.ButtonContainer}>
                    <Button
                        onClickHandler={(e) => {
                            e.preventDefault();
                            props.nextStep();
                        }}
                        backgroundColor="#CC0000"
                        color="white"
                        border="none"
                        width="80%">        
                        下一步
                    </Button>
                </div>
            </form>
            <footer className={classes.Footer}></footer>
        </div>
    )
}

export default connect()(infoPage);
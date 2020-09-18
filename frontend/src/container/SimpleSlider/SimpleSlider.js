import React, { Component } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import CustomNextArrow from '../../components/customArrows/CustomNextArrow';
import CustomPrevArrow from '../../components/customArrows/CustomPrevArrow';
import CustomSlide from '../../components/CustomSlide/CustomSlide';

import convertToDateString from './convert_dateObject_to_dateString';
import converToDateObject from './convert_dateString_to_dateObject';
import intializeTimeList from './initializeTimeList';

import * as actions from '../../store/action/actions';

import classes from './SimpleSlider.module.scss';


class SimpleSlider extends Component {
    state = {
        currentSlideIndex: 0,
        onSelectDate: '',
        //array of producing innerSliders
        dateListArr: [],
        newDateListArrLength: 0,
        //to store the freetimelist got from the api
        dateTimeList: null,
        selectedGrp_datetime: null,
    }

    render(){
        let settings = {
            accessibility: true,
            infinite: false,
            speed: 300,
            slidesToShow: 3,
            slidesToScroll: 3,
            swipe: true,
            arrows: true,
            nextArrow: <CustomNextArrow />,     
            prevArrow: <CustomPrevArrow />,
            afterChange: (currentIndex) => {
                console.log(currentIndex);
                this.setState({
                    currentSlideIndex: currentIndex
                })
            },
            slickGoTo: !this.props.loading? this.state.slickGoTo : null
        };

        let innerSliders = null;

        console.log(this.props.selectedDate)
        
        if (this.props.dateList.length){
            innerSliders = this.props.dateList.map((ele, index) => {
                return (
                    <CustomSlide
                        key={'sliderIndex' + index}
                        dateObject={ele} 
                        selectedDate={this.props.selectedDate}
                        selectDateHandler={this.props.selectDateHandler}
                        onSelectDate={this.state.onSelectDate}
                        slideIndex={index}
                        // selectDateHandler={this.selectDateHandler}
                        setCurrentIndex={() => this.slider.slickGoTo()}
                        onSelectTimeHandler={this.props.onSelectTimeHandler}/>
                )
            })
        }

        return (
            <div className={classes.SliderContainer}>
                <Slider ref={ slider => (this.slider = slider)} {...settings} >
                    {innerSliders}
                </Slider>
            </div>                
        )
    }
}

export default SimpleSlider;
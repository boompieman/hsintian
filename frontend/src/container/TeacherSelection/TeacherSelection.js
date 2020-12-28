import React, { Component } from 'react'
import hsintian_url from '../../hsintian_url'

import TeacherDiv from '../../components/TeacherDiv/TeacherDiv';
import Loading from '../../UI/Loading/Loading';
import Button from '../../UI/Button/Button';
import Spinner from '../../UI/Spinner/spinner';
import Aux from '../../hoc/aux';
import Progression from '../../components/progression/progression'

import classes from './TeacherSelection.module.scss';
import selectMasterPic from "../../selectMaster.png";
//
import { getData } from '../../controllers/fetchData'

class teachderSelection extends Component {
    constructor(props){
        super(props);
    }

    state = {
        teachersList: [],
        isLoading: false,
        picLoaded: false
    }

    componentDidMount(){
        this.setState({ isLoading: true });
        getData('/groups/')
        .then(data => {
            console.log(data)
            this.setState({
                teachersList: data,
                isLoading: false
            })
        })
        .catch(error => console.log(error))
    };

    onLoadHandler = () => {
        this.setState({
            picLoaded: true
        })
    }

    onLoadErrorHandler = () => {
        this.setState({
            picLoaded: true
        });
    }

    render(){
        let teacherDivs = [];
    
        if (this.state.teachersList.length !== 0){
            this.state.teachersList.forEach((masterGrp, index) => {
                teacherDivs.push(
                    <TeacherDiv
                        key={masterGrp.gid}
                        imgSrc={masterGrp.image}
                        groupName={masterGrp.group}
                        masterGid={masterGrp.id}
                        teacherIntro={masterGrp.descript}
                        onSelectMasterGroup={this.props.onSelectMasterGroup}
                    />
                )
            })
        }

        let pageContent = (
            <Aux>
                <div className={classes.ButtonContainer}>
                    <Button
                        className={classes.PrevStepButton}
                        onClickHandler={this.props.prevStep}
                        color="white"
                        border="1px solid white"
                        backgroundColor="#CC0000">
                        上一步
                    </Button>
                </div>
                <Progression currentStep={2}/>
                {this.state.isLoading?
                    <Loading />:
                    <div className={classes.TeacherDivsContainer}>
                        {teacherDivs}
                    </div>

                }
            </Aux>
        )

        return (
            <div className={classes.TeacherSelectionPage}>
                <img 
                    onLoad={this.onLoadHandler.bind(this)}
                    onError={() => console.log('error')}
                    className={classes.BannerImg} 
                    src='https://hsintian.tk/static/media/selectMaster.09b4ec19.jpg' 
                    // src={selectMasterPic}
                />

                { this.state.picLoaded ? 
                    pageContent: null }
            </div>
        )
    }
}

export default teachderSelection;
import React, {useState} from 'react'
import {connect} from 'react-redux'
import * as actions from '../../store/action/actions'
//component
import Progression from '../../components/progression/progression'
import Spinner from '../../UI/Spinner/spinner'
import Button from '../../UI/Button/Button'
//image
import confirmImage from './confirmation.jpg'
//style
import classes from './Confirmation.module.scss'

const Confirmation = (props) => {
    const [pendingReservation, setPendingReservation] = useState(false)

    let pageContent
    pageContent = pendingReservation? (
        <div className={classes.SpinnerContainer}>
            <div class={classes.Loading}>
                <Spinner />
                <h4>正在預約中...</h4>
            </div>
        </div>
    ) : (
        <div className={classes.InfoContainer}>
            <div className={classes.InfoRow}>選取師傅：</div><div className={classes.InfoRow}>測試用</div>
            <div className={classes.InfoRow}>選取時間：</div><div className={classes.InfoRow}>2020-12-28</div>
            <div className={classes.InfoRow}>選取時段：</div><div className={classes.InfoRow}>17:00</div>
            <div className={classes.Buttons}>
                <button
                    style={{color: 'green'}}
                    onClick={props.confirmReservation}>確認</button>
                <button 
                    style={{color: 'red'}}
                    onClick={props.cancelReservation}>取消</button>
            </div>
        </div>
    )

    return (
        <div>
            <img src={confirmImage} alt="Confirmation Header Image"/>
            <div className={classes.ButtonContainer}>
                <Button
                    className={classes.PrevStepButton}
                    onClickHandler={props.prevStep}
                    color="white"
                    border="1px solid white"
                    backgroundColor="#CC0000">
                    上一步
                </Button>
            </div>
            <Progression currentStep={4}/>
            {pageContent}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        datetime_string: state.datetime_string,
        masterName: state.masterName,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        prevStep: () => dispatch(actions.prevStep())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Confirmation);
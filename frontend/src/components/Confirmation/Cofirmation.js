import React from 'react';

import Aux from '../../hoc/aux';
import Modal from '../../UI/Modal/Modal';
import Backdrop from '../../UI/Backdrop/Backdrop';

const confirmation = (props) => {
    return (
        <Aux>
            <Backdrop />
            <Modal>
                <h3>確認預約</h3>
                <p>時間：{props.classTime}</p>
                <p>師傅：{props.teacherName}</p>
                <div>
                    <button 
                        style={{ color: 'red' }}
                        onClick={props.cancelReservation}>取消</button>
                    <button
                        style={{ color: 'green' }}
                        onClick={props.confirmReservation}>確認</button>
                </div>
            </Modal>
        </Aux>
    )
}

export default confirmation;
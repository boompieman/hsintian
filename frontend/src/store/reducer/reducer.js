import * as actionTypes from '../action/actionTypes';

const initialState = {
    chineseName: '',
    phoneNumber: '',
    introducer: '',
    age: '',
    city: '',
    gender: '',
    district: '',
    unfilled_blanks: [],
    masterId: '',   
    masterGid: null,
    masterName: '',
    step: 'info_page',
    selectedDate_timeList: null,
    datetime_string: null,
    isFetchingTime: false,
    line_id: null,
    line_data_status: null,
    errMsg: null
}

const reducer = ( state = initialState , action ) => {
    switch(action.type){
        case actionTypes.SET_INFO_CONTENT: 
            const cloned_state = { ... state };
            cloned_state[action.infoType] = action.updatedValue;
            return cloned_state;

        case actionTypes.CHANGE_NAME:
            if (action.language_of_name === 'chineseName'){
                return {
                    ...state,
                    chineseName: action.updatedValue
                };
            } else if (action.language_of_name === 'phoneNumber'){
                return {
                    ...state,
                    phoneNumber: action.updatedValue
                };
            } else if (action.language_of_name === 'introducer'){
                return {
                    ...state,
                    introducer: action.updatedValue
                };
            } else {
                return state;
            }
        break;
        
        case actionTypes.DROP_DOWN_SELECT:
            return {
                ...state,
                [action.selection_name]: action.value
            }

        case actionTypes.SELECT_MASTER_GROUP:
            return {
                ...state,
                masterGid: action.masterGid,
                masterName: action.masterName,
                step: 'time_select'
            }
        break;

        case actionTypes.NEXT_STEP:
            if (state.step === 'info_page'){
                const info_validate = () => {
                    const info_list = [ 'chineseName', 'phoneNumber', 'gender', 'age', 'city', 'district' ];
                    const unfilled_infos = [];
                    info_list.forEach((info) => {
                        console.log(state[info]);
                        if ( !state[info] ){
                            unfilled_infos.push(info)
                        }
                    })

                    if (!unfilled_infos.length){
                        return 'passed';
                    } else {
                        return unfilled_infos;
                    }
                }

                if ( info_validate() === 'passed' ){
                    return {
                        ...state,
                        step: 'teacher_select'
                    }
                } else {
                    return {
                        ...state,
                        unfilled_blanks: info_validate()
                    }
                }
            }

        case actionTypes.PREV_STEP:
            if (state.step === 'teacher_select'){
                return {
                    ...state,
                    step: 'info_page',
                    teacherName: ''
                }
            } else if (state.step === 'time_select'){
                return {
                    ...state,
                    step: 'teacher_select',
                    classTime: '',
                    selectedDate_timeList: null,
                    datetime_string: null,
                }
            } else {
                return state;
            }
        break;

        case actionTypes.SET_INITIAL_DATE:
            return {
                ...state,
                year: action.year,
                month: action.month,
                date: action.date
            }
        break;

        case actionTypes.SET_DATE_TIME_STRING:
            return {
                ...state,
                datetime_string: action.datetime_string
            }

        case actionTypes.SET_SELECTED_DATE_TIME_LIST:
            return {
                ...state,
                selectedDate_timeList: action.timeList
            }

        case actionTypes.SET_ERROR_MSG: 
            return {
                ...state,
                errMsg: action.errMsg
            }

        case actionTypes.FETCH_TIME:
            return {
                ...state,
                isFetchingTime: action.isFetching
            }

        default:
            return state;
    }
}

export default reducer;
import React from 'react';

import classes from './TeacherDiv.module.scss';

const teacherDiv = (props) => {

    const lineBreak = (script) => {
        const script_arr = script.split('\r\n');
        return script_arr;
    }

    const intro_li = lineBreak(props.teacherIntro).map((intro, index) => {
        let intro_words = null;
        switch(index){
            case 0: 
                intro_words = intro.replace('A:', ' ')
                break;
            case 1:
                intro_words = intro.replace('B:', ' ')
                break;
            case 2:
                intro_words = intro.replace('C:', ' ');
                break;
            case 3:
                intro_words = intro.replace('D:', ' ');
                break;
            case 4:
                intro_words = intro.replace('E:', ' ')
                break;
            case 5:
                intro_words = intro.replace('F:', ' ')
                break;
            default:
                return;
        }
        return (
            <li>{intro_words}</li>
        )
    });

    return (
        <div 
            className={classes.TeacherDiv}
            onClick={() => props.onSelectMasterGroup(props.masterGid, props.groupName)}>
            <img className={classes.TeacherImg} src={'https://hsintian.tk/static/images/' + props.imgSrc} alt={`${props.imgSrc}`}/>
            <div className={classes.TeacherInfo}>
                <ul className={classes.TeacherIntroContent} style={{"listStyleType": "none"}}>
                    {/* {props.teacherIntro} */}
                    {intro_li}
                </ul>
            </div>
        </div>
    )
}

export default teacherDiv;
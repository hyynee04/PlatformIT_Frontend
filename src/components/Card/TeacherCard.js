import '../../assets/scss/card/Card.css'
import { useState } from 'react';
import default_ava from "../../assets/img/default_ava.png"
import { FaGraduationCap, FaRegFile } from "react-icons/fa6";


const TeacherCard = () => {
    const [imgCourse, setImgCourse] = useState("")

    return(
        <div className='card-container'>
            <div className='teacher-card-container'>
                <img src={default_ava} />
                <div className='teacher-card-body'>
                    <span className='teacher-card-title'>Mr. Right</span>
                    <div className='teacher-card-info'><FaGraduationCap color='#757575' />Data Science</div>
                    <div className='teacher-card-info'><FaRegFile color='#757575' />100</div>
                </div>
            </div>
        </div>
    )
}

export default TeacherCard;
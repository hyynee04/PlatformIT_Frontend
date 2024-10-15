import Card from 'react-bootstrap/Card';
import '../assets/scss/card/TeacherCard.css'
import { useState } from 'react';
import default_ava from "../assets/img/default_ava.png"
import { RiGroupLine } from "react-icons/ri";
import { LuFile } from "react-icons/lu";


const TeacherCard = () => {
    const [imgCourse, setImgCourse] = useState("")

    return(
        <div className='course-card-container'>
            <Card>
                <img className='teacher-ava' variant="top" src={default_ava} />
                <Card.Body>
                    <Card.Title>Benny</Card.Title>
                    <span className='teacher-technical'>Software Testing</span>
                </Card.Body>
                <div className='teachercard-footer'>
                    <div className='teachercard-group'>
                    <LuFile color='#757575' />
                        <span className='now-price'>100</span>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default TeacherCard;
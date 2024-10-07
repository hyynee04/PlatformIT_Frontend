import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import '../assets/scss/card/Course.css'
import { useState } from 'react';
import ExampleImage_Course from "../assets/img/ExampleImage_Course.png"
import { LuClock, LuDollarSign } from "react-icons/lu";

const Course = (props) => {
    const [imgCourse, setImgCourse] = useState("")

    return (
        <div className='course-card-container'>
            <Card>
                <Card.Img variant="top" src={ExampleImage_Course} />
                <Card.Body>
                    <Card.Title>Artificial Intelligence - First Bootscamp of 2024 - Join now for good deal</Card.Title>
                    <div className='tag-container'>
                        <div className='tag-content'>Web Developer</div>
                        <div className='tag-content'>Software</div>
                        <div className='tag-content-more'>+3</div>
                    </div>
                    <div className='course-time'> <LuClock color='#757575' /> 8/6/2024 - 8/12/2024</div>
                    {/* <div className='course-time'> <LuClock color='#757575' /> Created on 8/12/2024</div> */}
                </Card.Body>
                <div className='course-footer'>
                    <div className='course-price-container'>
                        <LuDollarSign color='#757575' />
                        <span className='now-price'>100</span>
                        <span className='last-price'>150</span>
                    </div>
                    <div className='tag-content period-tag'>Registering</div>
                </div>
            </Card>
        </div>
    )
}

export default Course;
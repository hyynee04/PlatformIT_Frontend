import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { 
    LuClock, 
    LuDollarSign, 
    LuBuilding2, 
    LuUsers, 
    LuStar 
} from "react-icons/lu";
import ExampleImage_Course from "../assets/img/ExampleImage_Course.png";
import '../assets/scss/card/Course.css';

const Course = (props) => {
    const [imgCourse, setImgCourse] = useState("")
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className='course-card-container'>
            <Card
                className='course-card'
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <img className='course-card-img-top' variant="top" src={ExampleImage_Course} />
                <Card.Body>
                    <Card.Title className='course-title'>Artificial Intelligence - First Bootscamp of 2024 - Join now for good deal</Card.Title>
                    <div className='tag-container'>
                        <div className='tag-content'>Web Developer</div>
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

            {isHovered && (
                <Card
                    className='course-card hover-card'
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <Card.Img className='course-card-img-top' variant="top" src={ExampleImage_Course} />
                    <Card.Body>
                        <Card.Title className='course-title-hover'>Artificial Intelligence - First Bootscamp of 2024 - Join now for good deal</Card.Title>
                        <div className='tag-container'>
                            <div className='tag-content'>Web Developer</div>
                            <div className='tag-content-more'>+3</div>
                        </div>
                        <div className='course-time'> <LuBuilding2 color='#757575' /> Center Name</div>
                        <div className='course-time'> <LuClock color='#757575' /> 8/6/2024 - 8/12/2024</div>
                        {/* <div className='course-time'> <LuClock color='#757575' /> Created on 8/12/2024</div> */}
                        <div className='course-time'> <LuUsers color='#757575' /> 100</div>
                        <div className='course-time'> <LuStar color='#757575' /> 2.5/5</div>
                    </Card.Body>
                    <div className='course-footer'>
                        <div className='course-price-container'>
                            <LuDollarSign color='#757575' />
                            <span className='now-price'>100</span>
                            <span className='last-price'>150</span>
                        </div>
                        <button className='view-detail-btn'>View Detail</button>
                    </div>
                </Card>
            )}
        </div>
    )
}

export default Course;
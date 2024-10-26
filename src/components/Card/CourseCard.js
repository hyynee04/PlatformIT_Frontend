import {
    LuClock,
    LuDollarSign
} from "react-icons/lu";
import ExampleImage_Course from "../../assets/img/ExampleImage_Course.png";
import "../../assets/scss/card/Card.css";

const CourseCard = (props) => {
    return (
        <div className="card-container">
            <div className="course-card-container">
                <img src={ExampleImage_Course} />

                <div className="course-card-body">
                    <span className="course-card-title">
                        Artificial Intelligence
                        - First Bootscamp of 2024
                        - Join now for good deal
                    </span>
                    <div className="course-card-tag-container">
                        <div className='tag-content'>Web Developer</div>
                        <div className='tag-content-more'>+3</div>
                    </div>
                    <div className='course-card-info'> <LuClock color='#757575' /> 8/6/2024 - 8/12/2024</div>
                    {/* <div className='course-time'> <LuClock color='#757575' /> Created on 8/12/2024</div> */}
                </div>

                <div className="course-card-footer">
                    <div className='course-card-price'>
                        <LuDollarSign color='#757575' />
                        <span className='discount-price'>150</span>
                        <span className='initial-price'>300</span>
                    </div>
                    <div className='course-card-period'>Registering</div>
                </div>
            </div>
        </div>
    )
}

export default CourseCard;
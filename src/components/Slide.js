import Carousel from 'react-bootstrap/Carousel';
import "../assets/scss/Slide.css";
import Course from './Course';
import TeacherCard from './TeacherCard';
import { MdArrowForwardIos } from "react-icons/md";


const Slide = (props) => {
    return (
        <>
            <div className="slide-container" slide={true}>
                <div className='carousel-header'>
                    <span className='carousel-header-title'>Top Course</span>
                    <span className='carousel-header-viewall'>View all courses <MdArrowForwardIos color='#757575' /> </span>
                </div>
                <Carousel variant='dark'>
                    <Carousel.Item>
                        <div className='item-holder'>
                            <Course />
                            <Course />
                            <Course />
                            <Course />
                        </div>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div className='item-holder'>
                            <Course />
                            <Course />
                            <Course />
                            <Course />
                        </div>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div className='item-holder'>
                            <Course />
                            <Course />
                            <Course />
                            <Course />
                        </div>
                    </Carousel.Item>
                </Carousel>
            </div>


            <div className="slide-container" slide={true}>
            <div className='carousel-header'>
                    <span className='carousel-header-title'>Top Teacher</span>
                    <span className='carousel-header-viewall'>View all teachers <MdArrowForwardIos color='#757575' /> </span>
                </div>
                <Carousel variant='dark'>
                    <Carousel.Item>
                        <div className='item-holder'>
                            <TeacherCard />
                            <TeacherCard />
                            <TeacherCard />
                            <TeacherCard />
                        </div>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div className='item-holder'>
                            <TeacherCard />
                            <TeacherCard />
                            <TeacherCard />
                            <TeacherCard />
                        </div>
                    </Carousel.Item><Carousel.Item>
                        <div className='item-holder'>
                            <TeacherCard />
                            <TeacherCard />
                            <TeacherCard />
                            <TeacherCard />
                        </div>
                    </Carousel.Item>
                </Carousel>
            </div>


            <div className="slide-container" slide={false}>
            <div className='carousel-header'>
                    <span className='carousel-header-title'>Top Teacher</span>
                    <span className='carousel-header-viewall'>View all teachers <MdArrowForwardIos color='#757575' /> </span>
                </div>
                <Carousel variant='dark'>
                    <Carousel.Item>
                        <div className='item-holder'>
                            <TeacherCard />

                        </div>
                    </Carousel.Item>
                </Carousel>
            </div>
            
        </>

    )
}

export default Slide;
import Carousel from 'react-bootstrap/Carousel';
import "../assets/scss/Slide.css";
import Course from './Course';


const Slide = (props) => {
    return (
        <div className="slide-container" slide={true}>
            <Carousel variant='dark'>
                <Carousel.Item>
                    <div className='course-holder'>
                        <Course />
                        <Course />
                        <Course />
                        <Course />
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div className='course-holder'>
                        <Course />
                        <Course />
                        <Course />
                        <Course />
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div className='course-holder'>
                        <Course />
                        <Course />
                        <Course />
                        <Course />
                    </div>
                </Carousel.Item>

            </Carousel>
        </div>

    )
}

export default Slide;
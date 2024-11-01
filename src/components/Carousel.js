import { React, useEffect, useRef, useState } from 'react';
import { IoMdOpen } from "react-icons/io";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import '../assets/scss/Carousel.css'; // Import your CSS file for styling
import CenterCard from './Card/CenterCard';
import CourseCard from './Card/CourseCard';
import TeacherCard from './Card/TeacherCard';

const Carousel = (props) => {
    const { object, totalTracks, itemsPerTrack, header, listInfo } = props;
    const [currentTrack, setCurrentTrack] = useState(0);
    const autoSlideRef = useRef(null);

    const handleNext = () => {
        if (currentTrack < totalTracks - 1) {
            setCurrentTrack(currentTrack + 1);
        }
    };

    const handlePrev = () => {
        if (currentTrack > 0) {
            setCurrentTrack(currentTrack - 1);
        }
    };

    const handleDotClick = (index) => {
        setCurrentTrack(index);
    };

    // Auto-slide function
    const startAutoSlide = () => {
        autoSlideRef.current = setInterval(() => {
            setCurrentTrack(prevTrack => (prevTrack + 1) % totalTracks);
        }, 5000); // Auto-slide every 3 seconds
    };

    // Stop auto-slide
    const stopAutoSlide = () => {
        if (autoSlideRef.current) {
            clearInterval(autoSlideRef.current);
        }
    };

    const renderItems = () => {
        const startIndex = currentTrack * itemsPerTrack;
        const endIndex = startIndex + itemsPerTrack;

        switch (object) {
            case 1: // Courses
            const coursesToShow = listInfo.slice(startIndex, endIndex); // Lấy phần tử cần hiển thị
            return coursesToShow.map((course) => (
                <CourseCard 
                    key={course.idCourse} 
                    course={course} 
                />
            ));
            case 2: // Teachers
                const teachersToShow = listInfo.slice(startIndex, endIndex); // Lấy phần tử cần hiển thị
                return teachersToShow.map((teacher) => (
                    <TeacherCard 
                        key={teacher.idUser} 
                        teacher={teacher} 
                    />
                ));
            case 3: // Centers
                const centersToShow = listInfo.slice(startIndex, endIndex); // Slice the centers to show
                return centersToShow.map((center, i) => (
                    <CenterCard 
                        key={center.idCenter} 
                        center={center} 
                    />
                ));
            default:
                return null;
        }
    }

    // Handle auto-slide with useEffect
    useEffect(() => {
        startAutoSlide();

        // Cleanup the interval on unmount
        return () => stopAutoSlide();
    }, [totalTracks]);

    return (
        <div
            className="carousel"
            onMouseEnter={stopAutoSlide}  // Stop auto-slide on hover
            onMouseLeave={startAutoSlide} // Restart auto-slide on mouse leave
        >
            <div className='carousel-header'>
                <span>{header}</span>
                <button>View more <IoMdOpen /></button>
            </div>
            <div className="carousel-wrapper">
                {Array.from({ length: totalTracks }).map((_, index) => (
                    <div
                        key={index}
                        className={`carousel-track ${currentTrack !== index ? 'no-opacity' : 'add-opacity'}`}
                        style={{ transform: `translateX(-${currentTrack * 100}%)` }}
                    >
                        {renderItems()}
                    </div>
                ))}
            </div>


            <button
                className="carousel-button prev"
                onClick={handlePrev}
                disabled={currentTrack === 0}
            >
                <MdArrowBackIos />
            </button>
            <button
                className="carousel-button next"
                onClick={handleNext}
                disabled={currentTrack === totalTracks - 1}
            >
                <MdArrowForwardIos />
            </button>

            {/* Dots for navigation */}
            <div className="carousel-dots">
                {Array.from({ length: totalTracks }).map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${currentTrack === index ? 'active' : ''}`}
                        onClick={() => handleDotClick(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default Carousel;

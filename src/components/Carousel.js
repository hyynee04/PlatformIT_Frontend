import { React, useEffect, useState, useRef } from 'react';
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { IoMdOpen } from "react-icons/io";
import '../assets/scss/Carousel.css'; // Import your CSS file for styling
import CenterCard from './Card/CenterCard';
import CourseCard from './Card/CourseCard';
import TeacherCard from './Card/TeacherCard';

const Carousel = (props) => {
    const { object, totalTracks, itemsPerTrack, header } = props;
    const [currentTrack, setCurrentTrack] = useState(0);
    const autoSlideRef = useRef(null);
    // const [totalTracks, setTotalTracks] = useState(3);

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
        switch (object) {
            case 1: // Courses
                return Array.from({ length: itemsPerTrack }).map((_, i) => <CourseCard key={i} />);
            case 2: // Teachers
                return Array.from({ length: itemsPerTrack }).map((_, i) => <TeacherCard key={i} />);
            case 3: // Centers
                return Array.from({ length: itemsPerTrack }).map((_, i) => <CenterCard key={i} />);
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

                {/* <div
                    className={`carousel-track ${currentTrack !== 0 ? 'no-opacity' : ''}`}
                    style={{ transform: `translateX(-${currentTrack * 100}%)` }}
                >
                    {object &&
                        object === CarouselObject.course ?
                        (
                            <>
                                <CourseCard />
                                <CourseCard />
                                <CourseCard />
                                <CourseCard />
                            </>
                        )
                        :
                        object === CarouselObject.teacher ?
                            (
                                <>
                                    <TeacherCard />
                                    <TeacherCard />
                                    <TeacherCard />
                                    <TeacherCard />
                                </>
                            )
                            :
                            (
                                <>
                                    <CenterCard />
                                    <CenterCard />
                                    <CenterCard />
                                    <CenterCard />
                                </>
                            )
                    }
                </div>

                <div
                    className={`carousel-track ${currentTrack !== 1 ? 'no-opacity' : ''}`}
                    style={{ transform: `translateX(-${currentTrack * 100}%)` }}
                >
                    {object &&
                        object === CarouselObject.course ?
                        (
                            <>
                                <CourseCard />
                                <CourseCard />
                                <CourseCard />
                                <CourseCard />
                            </>
                        )
                        :
                        object === CarouselObject.teacher ?
                            (
                                <>
                                    <TeacherCard />
                                    <TeacherCard />
                                    <TeacherCard />
                                    <TeacherCard />
                                </>
                            )
                            :
                            (
                                <>
                                    <CenterCard />
                                    <CenterCard />
                                    <CenterCard />
                                    <CenterCard />
                                </>
                            )
                    }
                </div>

                <div
                    className={`carousel-track ${currentTrack !== 2 ? 'no-opacity' : ''}`}
                    style={{ transform: `translateX(-${currentTrack * 100}%)` }}
                >
                    {object &&
                        object === CarouselObject.course ?
                        (
                            <>
                                <CourseCard />
                                <CourseCard />
                                <CourseCard />
                                <CourseCard />
                            </>
                        )
                        :
                        object === CarouselObject.teacher ?
                            (
                                <>
                                    <TeacherCard />
                                    <TeacherCard />
                                    <TeacherCard />
                                    <TeacherCard />
                                </>
                            )
                            :
                            (
                                <>
                                    <CenterCard />
                                    <CenterCard />
                                    <CenterCard />
                                    <CenterCard />
                                </>
                            )
                    }
                </div>*/}

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

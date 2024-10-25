import { useState } from "react";
import { BsPlusCircle } from "react-icons/bs";
import { FaDollarSign, FaGraduationCap, FaRegFile } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { LuClock } from "react-icons/lu";
import { RiChat3Line, RiGroupLine } from "react-icons/ri";
import { FiCheckSquare } from "react-icons/fi";
import StarRatings from 'react-star-ratings';
import default_ava from "../../assets/img/default_ava.png";
import default_image from "../../assets/img/default_image.png";
import "../../assets/scss/Detail.css";

const CourseDetail = (props) => {
    const [isShowed, setisShowed] = useState(false)

    const handleIsShowed = () => {
        setisShowed(!isShowed)
    }
    return (
        <div className="detail-container">
            <div className="left-container">
                <div className="block-container">
                    <img className="biography-ava center" src={default_image} />
                    <div className="biography-block">
                        <span className="biography-name center">Artificial Intelligence</span>
                        <div className='course-card-price'>
                            <FaDollarSign color='#003B57' />
                            <span className='discount-price'>150</span>
                            <span className='initial-price'>300</span>
                        </div>
                        <div className="tag-container">
                            <div className='tag-content'>Web Developer</div>
                            <div className='tag-content'>Web Developer</div>
                            <div className='tag-content'>Web Developer</div>
                            <div className='tag-content'>Web Developer</div>
                        </div>
                        <div className="center-information">
                            <span className="number-course"><LuClock color="#757575" /> Create on: 03/22/2024</span>
                            {/* <span className="number-course"><LuClock color="#757575" />03/22/2023 - 06/22/2024</span> */}
                            <span className=""><RiGroupLine color="#757575" /> 100 students</span>
                            <span>Say something about this course</span>
                        </div>
                        <button>Buy Now</button>
                    </div>
                </div>

                <div className="block-container">
                    <span className="block-container-title">Center</span>
                    <div className="block-container-row">
                        <img src={default_image} />
                        <div className="center-block">
                            <span className="name-center">Name</span>
                            <span className="quote-center">Say something I'm giving up on you</span>
                        </div>
                    </div>
                </div>

                <div className="block-container">
                    <span className="block-container-title">Teacher</span>
                    <div className="block-container-col">
                        <div className="teacher-header">
                            <img className="small-ava" src={default_ava} />
                            <span className="teacher-name">Name</span>
                        </div>
                    </div>
                    <div className="biography-block">
                        <div className="teacher-information">
                            <span className="biography-brand">Biography</span>
                            <span className="teaching-major"><FaGraduationCap color="#757575" /> Teaching major</span>
                            <span className="number-course"><FaRegFile color="#757575" /> 100 courses</span>
                        </div>
                    </div>
                    <button className="chat-button">Chat <RiChat3Line /></button>
                </div>

                <div className="block-container">
                    <div className="block-container-header">
                        <span className="block-container-title">Review</span>
                        <button className="add-review-button"><BsPlusCircle /> Add review</button>
                    </div>
                    <div className="block-container-col">
                        <div className="review-content">
                            <img className="small-ava" src={default_image} />
                            <div className="review-body">
                                <span className="review-name">Name</span>
                                <StarRatings
                                    rating={3}
                                    starRatedColor='rgb(255, 204, 0)'
                                    // changeRating={this.changeRating}
                                    starDimension="1.3rem"
                                    starSpacing="2px"
                                    numberOfStars={5}
                                    name='rating'
                                />
                                <span className="review-title"><b>Review title:</b> body didi did did did</span>
                                <span className="review-date">12/03/2024</span>
                            </div>
                        </div>
                        <div className="review-content">
                            <img className="small-ava" src={default_image} />
                            <div className="review-body">
                                <span className="review-name">Name</span>
                                <StarRatings
                                    rating={3}
                                    starRatedColor='rgb(255, 204, 0)'
                                    // changeRating={this.changeRating}
                                    starDimension="1.3rem"
                                    starSpacing="2px"
                                    numberOfStars={5}
                                    name='rating'
                                />
                                <span className="review-title"><b>Review title:</b> body didi did did did</span>
                                <span className="review-date">12/03/2024</span>
                            </div>
                        </div>
                    </div>
                    <div className="total-rating">
                        4.8/5
                        <StarRatings
                            rating={1}
                            starRatedColor='rgb(255, 204, 0)'
                            // changeRating={this.changeRating}
                            starDimension="1.5rem"
                            numberOfStars={1}
                            name='rating'
                        />
                    </div>
                </div>
            </div>


            <div className="right-container">

                <div className="block-container">
                    <div className="block-container-header">
                        <span className="block-container-title">Course Content</span>
                        <span className="block-container-sub-title">2 sections - 3 lectures</span>
                    </div>
                    <div className="block-container-col">
                        <div className="lecture">
                            <div className={`lecture-header ${isShowed ? "" : "change-border-radius"} `}>
                                <span className="section-name">Section 1</span>
                                <div className="section-info">
                                    <span className="section-name">2 lectures</span>
                                    <button
                                        className="showhide-button"
                                        onClick={() => handleIsShowed()}
                                    >
                                        {isShowed ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                    </button>
                                </div>
                            </div>
                            <div
                                className={`lecture-block ${isShowed ? "" : "adjust-lecture-block"}`}>
                                <div className={`lecture-content ${isShowed ? "" : "remove-border"} `}>
                                    <div className="lecture-name">
                                        <span className="lecture-title">Title</span>
                                        <span className="lecture-exercise-num">3 exercises</span>
                                    </div>
                                    <span className="lecture-description">
                                        Body text for whatever you’d like to say.
                                        Add main takeaway points, quotes, anecdotes, or even a very very short story.
                                    </span>
                                </div>
                                <div className={`lecture-content ${isShowed ? "" : "remove-border"} `}>
                                    <div className="lecture-name">
                                        <span className="lecture-title">Title</span>
                                        <span className="lecture-exercise-num">3 exercises</span>
                                    </div>
                                    <span className="lecture-description">
                                        Body text for whatever you’d like to say.
                                        Add main takeaway points, quotes, anecdotes, or even a very very short story.
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="block-container">
                    <span className="block-container-title">Test</span>
                    <div className="block-container-col">
                        <div className="qualification">
                            <div className="qualification-body">
                                <div className="test-header">
                                    <span className="test-name">Title</span>
                                    <div className="test-info">Due: 09/15/2024, 23:59</div>
                                </div>
                                
                                <div className="test-description">Description</div>
                            </div>
                        </div>

                        <div className="qualification">
                            <div className="qualification-body">
                                <div className="test-header">
                                    <span className="test-name">Title</span>
                                    <div className="test-info past-due">Past Due</div>
                                </div>
                                
                                <div className="test-description">Description</div>
                            </div>
                        </div>

                        <div className="qualification">
                            <div className="qualification-body">
                                <div className="test-header">
                                    <span className="test-name">Title</span>
                                    <div className="test-info">Submitted <FiCheckSquare /></div>
                                </div>
                                
                                <div className="test-description">Description</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseDetail;
import { useEffect, useState } from "react";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { BsGenderTrans } from "react-icons/bs";
import { IoMdOpen } from "react-icons/io";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { LuGlobe2, LuMail, LuPhone } from "react-icons/lu";
import { RiChat3Line } from "react-icons/ri";
import "../../assets/css/Detail.css";
import default_ava from "../../assets/img/default_ava.png";
import Carousel from "../../components/Carousel";
import { getAllCourseCards } from "../../services/courseService";

const StudentDetail = (props) => {
    const [listCourse, setListCourse] = useState([])
    const [totalCourseTracks, setTotalCourseTracks] = useState(0)

    const getCourseCards = async () => {
        let courses = await getAllCourseCards();
        //courses.sort((a, b) => new Date(b.courseStartDate) - new Date(a.courseStartDate));
        if (courses.length > 12) {
            setTotalCourseTracks(3);
        }
        else
            setTotalCourseTracks(Math.ceil(courses.length / 4))
        setListCourse(courses)
    };

    useEffect(() => {
        getCourseCards();
    }, []);
    return (
        <div className="detail-container">
            <div className="left-container">
                <div className="block-container">
                    <img className="biography-ava teacher" src={default_ava} />
                    <div className="biography-block">
                        <span className="biography-name">Jang Jae Young</span>
                    </div>
                </div>

                <div className="block-container">
                    <span className="block-container-title">Information</span>
                    <div className="block-container-col">
                        <div className="info-line">
                            <LuMail />
                            <span>JJY_sematic_error@gmail.com</span>
                        </div>
                        <div className="info-line">
                            <LuPhone />
                            <span>0987 645 463</span>
                        </div>
                        <div className="info-line">
                            <BsGenderTrans />
                            <span>Other</span>
                        </div>
                        <div className="info-line">
                            <LiaBirthdayCakeSolid />
                            <span>10/04/1993</span>
                        </div>
                        <div className="info-line">
                            <LuGlobe2 />
                            <span>Korea</span>
                        </div>
                    </div>
                </div>

                <button className="contact-block">
                    Contact <RiChat3Line />
                </button>
            </div>

            <div className="right-container">
                <div className="block-container">
                    <span className="block-container-title">Name Course</span>
                    <div className="block-container-row">
                        <div className='progress-section'>
                            <div className='progress-container'>
                                <CircularProgressbar
                                    strokeWidth={12}
                                    value={53}
                                    text="8/15"
                                />
                            </div>

                            <label>Lecture</label>
                        </div>

                        <div className='progress-section'>
                            <div className='progress-container'>
                                <CircularProgressbar
                                    strokeWidth={12}
                                    value={57}
                                    text="4/7"
                                />
                            </div>
                            <label>Assignment</label>
                        </div>

                    </div>
                </div>

                <div className="block-container">
                    <div className="carousel-block">
                        <div className='carousel-header'>
                            <span>Courses</span>
                            <button>View more <IoMdOpen /></button>
                        </div>
                        <Carousel
                            object={1} //course
                            totalTracks={totalCourseTracks}
                            itemsPerTrack={2}
                            listInfo={listCourse}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentDetail;
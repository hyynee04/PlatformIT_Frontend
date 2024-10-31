import { useEffect, useState } from "react";
import { LuFile } from "react-icons/lu";
import { RiGroupLine } from "react-icons/ri";
import default_image from "../../assets/img/default_image.png";
import "../../assets/scss/Detail.css";
import Carousel from "../../components/Carousel";
import { getAllCourseCards } from "../../services/courseService";
import { getAllTeacherCards } from "../../services/userService";

const CenterDetail = (props) => {
    const [listTeacher, setListTeacher] = useState([])
    const [totalTeacherTracks, setTotalTeacherTracks] = useState(0)

    const [listCourse, setListCourse] = useState([])
    const [totalCourseTracks, setTotalCourseTracks] = useState(0)

    const getTeacherCards = async () => {
        let teachers = await getAllTeacherCards();
        teachers.sort((a, b) => b.coursesCount - a.coursesCount);
        if (teachers.length > 12) {
            setTotalTeacherTracks(3);
        }
        else
            setTotalTeacherTracks(Math.ceil(teachers.length / 4))
        setListTeacher(teachers)
    };

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
        getTeacherCards();
        getCourseCards();
    }, []);
    return (
        <div className="detail-container">
            <div className="left-container">
                <div className="block-container">
                    <img className="biography-ava center" src={default_image} />
                    <div className="biography-block">
                        <span className="biography-name center">Do IT Center</span>
                        <div className="tag-container">
                            <div className='tag-content'>Web Developer</div>
                            <div className='tag-content'>Web Developer</div>
                            <div className='tag-content'>Web Developer</div>
                            <div className='tag-content'>Web Developer</div>
                        </div>
                        <div className="center-information">
                            <span className="number-course"><LuFile color="#757575" /> 100 courses</span>
                            <span className=""><RiGroupLine color="#757575" /> 100 students</span>
                            <span>Say something about this center</span>
                        </div>
                    </div>
                </div>

                <div className="block-container">
                    <span className="block-container-title">Professional Qualification</span>
                    <div className="block-container-col">
                        <div className="qualification">
                            <img src={default_image} />
                            <div className="qualification-body">
                                <span className="qualification-name">Title</span>
                                <span className="qualification-description">Description</span>
                            </div>
                        </div>

                        <div className="qualification">
                            <img src={default_image} />
                            <div className="qualification-body">
                                <span className="qualification-name">Title</span>
                                <span className="qualification-description">Description</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="right-container">
                <div className="block-container">
                    <div className="carousel-block">
                        <Carousel
                            object={1} //course
                            totalTracks={totalCourseTracks}
                            itemsPerTrack={2}
                            header={"Courses"}
                            listInfo={listCourse}
                        />
                    </div>
                </div>

                <div className="block-container">
                    <div className="carousel-block">
                        <Carousel
                            object={2} //teacher
                            totalTracks={totalTeacherTracks}
                            itemsPerTrack={2}
                            header={"Top Teachers"}
                            listInfo={listTeacher}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CenterDetail;
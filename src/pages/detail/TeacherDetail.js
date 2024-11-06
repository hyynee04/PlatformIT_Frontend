import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { BsFiletypePdf } from "react-icons/bs";
import { FaGraduationCap, FaRegFile } from "react-icons/fa6";
import { IoMdOpen } from "react-icons/io";
import { RiChat3Line } from "react-icons/ri";
import default_ava from "../../assets/img/default_ava.png";
import default_image from "../../assets/img/default_image.png";
import "../../assets/scss/Detail.css";
import Carousel from "../../components/Carousel";
import { Role } from "../../constants/constants";

import { getTeacherDetail } from "../../services/userService";

const TeacherDetail = (props) => {
    const location = useLocation();

    const [listCourse, setListCourse] = useState([])
    const [totalCourseTracks, setTotalCourseTracks] = useState(0)
    const [idRole, setIDRole] = useState("")
    const [teacherInfo, setTeacherInfo] = useState({})

    console.log(teacherInfo.courses)

    const fetchTeacherDetail = async (idTeacher) => {
        let data = await getTeacherDetail(idTeacher);
        setTeacherInfo(data);
        data.courses.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        if(data.courses.length > 6) {
            setTotalCourseTracks(3);
        }
        else 
            setTotalCourseTracks(Math.ceil(data.courses.length / 2))
        setListCourse(data.courses)
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const state = location.state;
        if (state) {
            setIDRole(state.idRole);
            fetchTeacherDetail(state.idTeacher);
        }
    }, []);

    return (
        <div className="detail-container">
            <div className="left-container">
                <div className="block-container">
                    <img className="biography-ava teacher" src={teacherInfo.teacherAvatar !== null ? teacherInfo.teacherAvatar : default_ava} alt="teacher avatar" />
                    <div className="biography-block">
                        <span className="biography-name">
                            {teacherInfo.name !== null ? teacherInfo.name : "(unknown)"}
                        </span>
                        <div className="teacher-information">
                            {teacherInfo.teacherDescription && (
                                <span>{teacherInfo.teacherDescription}</span>
                            )}
                            <span className="teaching-major"><FaGraduationCap color="#757575" />
                                {teacherInfo.teachingMajor || "(unknown)"}
                            </span>
                            <span className="number-course"><FaRegFile color="#757575" /> {teacherInfo.coursesCount} courses</span>
                        </div>
                    </div>
                </div>

                {idRole && idRole === +Role.student && (
                    <button className="contact-block">
                        Contact <RiChat3Line />
                    </button>
                )}

                <div className="block-container">
                    <span className="block-container-title">{teacherInfo.centerName}</span>
                    <div className="block-container-row center">
                        <img src={default_image} alt="center background" />
                        <div className="center-block">
                            <span className="name-center">
                                {teacherInfo.centerName}
                            </span>
                            <span className="quote-center">
                                {teacherInfo.centerDescription || "(No description)"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="block-container">
                    <span className="block-container-title">Social/Profile Link</span>
                    <div className="block-container-col">
                        {teacherInfo.links && teacherInfo.links.map((link) => (
                            <div
                                key={link.idProfileLink}
                                className="link-transfer"
                                onClick={() => window.open(link.url)}
                            >
                                <span>{link.name}</span>
                                <IoMdOpen color="#757575" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="right-container">
                <div className="block-container">
                    <span className="block-container-title">Professional Qualification</span>
                    <div className="block-container-col">
                        {teacherInfo.qualificationModels && teacherInfo.qualificationModels.map((qualification) => (
                            <div
                                key={qualification.idQualification}
                                className="qualification"
                                onClick={() => window.open(qualification.path)}

                            >
                                {qualification.path.endsWith(".pdf") ?
                                    <BsFiletypePdf color="#757575" />
                                    :
                                    <img src={qualification.path || default_image} />
                                }
                                <div className="qualification-body">
                                    <span className="qualification-name">{qualification.qualificationName}</span>
                                    <span className="qualification-description">{qualification.description}</span>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

                <div className="block-container">
                    {(teacherInfo.courses && teacherInfo.courses.length !== 0) ? (
                        <div className="carousel-block">
                            <Carousel
                                object={1} //course
                                totalTracks={totalCourseTracks}
                                itemsPerTrack={2}
                                header={"Courses"}
                                listInfo={listCourse}
                            />
                        </div>
                    )
                        :
                        <span className="block-container-title">Courses</span>
                    }

                </div>
            </div>
        </div>
    )
}

export default TeacherDetail;
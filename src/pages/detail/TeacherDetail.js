import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


import { BsFiletypePdf } from "react-icons/bs";
import { FaGraduationCap, FaRegFile } from "react-icons/fa6";
import { ImSpinner2 } from "react-icons/im";
import { IoMdOpen } from "react-icons/io";
import { RiChat3Line } from "react-icons/ri";
import "../../assets/css/Detail.css";
import default_ava from "../../assets/img/default_ava.png";
import default_image from "../../assets/img/default_image.png";
import Carousel from "../../components/Carousel";
import { Object, Role } from "../../constants/constants";

import { getTeacherDetail } from "../../services/userService";

const TeacherDetail = (props) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [listCourse, setListCourse] = useState([])
    const [totalCourseTracks, setTotalCourseTracks] = useState(0)
    const [idRole, setIDRole] = useState("")
    const [idUser, setIDUser] = useState("")
    const [teacherInfo, setTeacherInfo] = useState({})


    const fetchTeacherDetail = async (idTeacher) => {
        setLoading(true);
        try {
            let response = await getTeacherDetail(idTeacher);
            let data = response.data;
            setTeacherInfo(data);
            data.courses.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            if (data.courses.length > 6) {
                setTotalCourseTracks(3);
            }
            else
                setTotalCourseTracks(Math.ceil(data.courses.length / 2))
            setListCourse(data.courses)
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const state = location.state;
        if (state) {
            setIDRole(state.idRole);
            setIDUser(state.idUser);
            fetchTeacherDetail(state.idTeacher);
        }
    }, []);

    if (loading) {
        return (
            <div className="loading-page">
                <ImSpinner2 color="#397979" />
            </div>
        ); // Show loading while waiting for API response
    }

    return (
        <div className="detail-container">
            <div className="left-container slide-to-right">
                <div className="block-container">
                    <img className="biography-ava teacher" src={teacherInfo.teacherAvatar !== null ? teacherInfo.teacherAvatar : default_ava} alt="teacher avatar" />
                    <div className="biography-block">
                        <span className="biography-name">
                            {teacherInfo.name !== null ? teacherInfo.name : ""}
                        </span>
                        <div className="teacher-information">
                            {teacherInfo.teacherDescription && (
                                <span>{teacherInfo.teacherDescription}</span>
                            )}
                            <span className="teaching-major"><FaGraduationCap color="#757575" />
                                {teacherInfo.teachingMajor || ""}
                            </span>
                            <span className="number-course"><FaRegFile color="#757575" />
                                {`${teacherInfo.coursesCount} ${teacherInfo.coursesCount > 1 ? "courses" : "course"}`}
                            </span>
                        </div>
                    </div>
                </div>

                {idRole && idRole === +Role.student && (
                    <button className="contact-block">
                        Contact <RiChat3Line />
                    </button>
                )}

                <div className="block-container">
                    <span className="block-container-title">Center</span>
                    <div
                        className="block-container-row center"
                        onClick={() => {
                            navigate('/centerDetail', {
                                state: {
                                    idCenter: teacherInfo.idCenter,
                                    idUser: localStorage.getItem("idUser"),
                                    idRole: localStorage.getItem("idRole")
                                }
                            });
                        }}
                    >
                        <img src={teacherInfo.centerAvatar || default_image} alt="center background" />
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

                {teacherInfo.links && teacherInfo.links.length !== 0 && (
                    <div className="block-container">
                        <span className="block-container-title">Social/Profile Link</span>
                        <div className="block-container-col">
                            {teacherInfo.links.map((link) => (
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
                )}

            </div>

            <div className="right-container slide-to-left">

                {teacherInfo.qualificationModels && teacherInfo.qualificationModels.length !== 0 && (
                    <div className="block-container">
                        <span className="block-container-title">Professional Qualification</span>
                        <div className="block-container-col">
                            {teacherInfo.qualificationModels.map((qualification) => (
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
                )}

                {teacherInfo.courses && teacherInfo.courses.length !== 0 && (
                    <div className="block-container">
                        <div className="carousel-block">
                            <div className='carousel-header'>
                                <span>Courses</span>
                                <button
                                    onClick={() =>
                                        navigate('/viewAll', {
                                            state: {
                                                object: Object.course,
                                                listContent: listCourse,
                                            }
                                        })
                                    }
                                >View more <IoMdOpen /></button>
                            </div>
                            <Carousel
                                object={1} //course
                                totalTracks={totalCourseTracks}
                                itemsPerTrack={2}
                                listInfo={listCourse}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TeacherDetail;
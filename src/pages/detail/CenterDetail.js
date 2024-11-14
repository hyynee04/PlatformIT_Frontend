import { BsFiletypePdf } from "react-icons/bs";
import { GrLocation } from "react-icons/gr";
import { IoMdOpen } from "react-icons/io";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { LuFile, LuMail, LuPhone } from "react-icons/lu";
import { MdOutlineHandshake } from "react-icons/md";
import { RiGroupLine } from "react-icons/ri";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import default_image from "../../assets/img/default_image.png";
import "../../assets/scss/Detail.css";

import Carousel from "../../components/Carousel";
import { Object } from "../../constants/constants";
import { getCenterDetail } from "../../services/centerService";

const CenterDetail = (props) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [listTeacher, setListTeacher] = useState([])
    const [totalTeacherTracks, setTotalTeacherTracks] = useState(0)

    const [listCourse, setListCourse] = useState([])
    const [totalCourseTracks, setTotalCourseTracks] = useState(0)

    const [idRole, setIDRole] = useState("")
    const [idUser, setIDUser] = useState("")
    const [centerInfo, setCenterInfo] = useState({})

    const fetchCenterDetail = async (idCenter) => {
        let response = await getCenterDetail(idCenter);
        let data = response.data;
        setCenterInfo(data);

        // Set center's Courses Carousel
        if (data.courseCards && data.courseCards.length) {
            data.courseCards.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            setTotalCourseTracks(data.courseCards.length > 6 ? 3 : Math.ceil(data.courseCards.length / 2));
            setListCourse(data.courseCards);
        } else {
            console.warn("No courseCards data available");
        }

        // Set center's Teachers Carousel
        if (data.teacherCards && data.teacherCards.length) {
            data.teacherCards.sort((a, b) => b.coursesCount - a.coursesCount);
            setTotalTeacherTracks(data.teacherCards.length > 6 ? 3 : Math.ceil(data.teacherCards.length / 2));
            setListTeacher(data.teacherCards);
        } else {
            console.warn("No teacherCards data available");
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        const state = location.state;
        if (state) {
            setIDRole(state.idRole);
            setIDUser(state.idUSer);
            fetchCenterDetail(state.idCenter);
        }

    }, []);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric"
    });

    return (
        <div className="detail-container">
            <div className="left-container">
                <div className="block-container">
                    <img className="biography-ava center" src={centerInfo.avatarPath ? centerInfo.avatarPath : default_image} alt="center background" />
                    <div className="biography-block">
                        <span className="biography-name center">{centerInfo.centerName}</span>
                        {centerInfo.listTagCourses && centerInfo.listTagCourses.length !== 0 && (
                            <div className="tag-container">
                                {centerInfo.listTagCourses.map((tag) => (
                                    <div
                                        key={tag.idTag}
                                        className='tag-content'
                                    >{tag.tagName}</div>
                                ))}
                            </div>
                        )}

                        <div className="center-information">
                            <span className="number-course">
                                <LuFile color="#757575" /> {`${centerInfo.courseCount} ${centerInfo.courseCount > 1 ? "courses" : "course"}`}
                            </span>
                            <span className="">
                                <RiGroupLine color="#757575" /> {`${centerInfo.studentCount} ${centerInfo.studentCount > 1 ? "students" : "student"}`}
                            </span>
                            {centerInfo.description && (
                                <span>{centerInfo.description}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="block-container">
                    <span className="block-container-title">Information</span>
                    <div className="block-container-col">
                        <div className="info-line">
                            <LuMail />
                            <span>{centerInfo.centerEmail || "(Email)"}</span>
                        </div>
                        <div className="info-line">
                            <LuPhone />
                            <span>{centerInfo.phoneNumber && centerInfo.phoneNumber.length === 10
                                ? centerInfo.phoneNumber.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")
                                : "(Phone number)"
                            }</span>
                        </div>
                        <div className="info-line">
                            <GrLocation />
                            <span>{centerInfo.address || "(address)"}</span>
                        </div>
                        <div className="info-line">
                            <LiaBirthdayCakeSolid />
                            <span>{formatDate(centerInfo.establishedDate)} (Established date)</span>
                        </div>
                        <div className="info-line">
                            <MdOutlineHandshake />
                            <span>{formatDate(centerInfo.submissionDate)} (Created date)</span>
                        </div>
                    </div>
                </div>

                {centerInfo.qualifications && centerInfo.qualifications.length !== 0 && (
                    <div className="block-container">
                        <span className="block-container-title">Professional Qualification</span>
                        <div className="block-container-col">
                            {centerInfo.qualifications.map((qualification) => (
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

                {centerInfo.profileLinks && centerInfo.profileLinks.length !== 0 && (
                    <div className="block-container">
                        <span className="block-container-title">Social/Profile Link</span>
                        <div className="block-container-col">
                            {centerInfo.profileLinks.map((link) => (
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

            <div className="right-container">
                {centerInfo.workingHourModel && centerInfo.workingHourModel.length !== 0 && (
                    <div className="block-container">
                        <span className="block-container-title">Working hours</span>
                        <table>
                            <tr>
                                {centerInfo.workingHourModel.map((day) => (
                                    <th key={day.day}>{day.day}</th>
                                ))}
                            </tr>
                            <tr>
                                {centerInfo.workingHourModel.map((day) => (
                                    <td key={day.day}>
                                        {day.isOpen ? (
                                            <>
                                                {day.startTime}
                                                <br />-<br />
                                                {day.closeTime}
                                            </>
                                        ) : (
                                            "Closed"
                                        )}
                                    </td>
                                ))}
                            </tr>
                        </table>
                    </div>
                )}

                {centerInfo.courseCards && centerInfo.courseCards.length !== 0 && (
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


                {centerInfo.teacherCards && centerInfo.teacherCards.length !== 0 && (
                    <div className="block-container">
                        <div className="carousel-block">
                            <div className='carousel-header'>
                                <span>Teachers</span>
                                <button
                                    onClick={() =>
                                        navigate('/viewAll', {
                                            state: {
                                                object: Object.teacher,
                                                listContent: listTeacher,
                                            }
                                        })
                                    }
                                >View more <IoMdOpen /></button>
                            </div>
                            <Carousel
                                object={2} //teacher
                                totalTracks={totalTeacherTracks}
                                itemsPerTrack={2}
                                listInfo={listTeacher}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CenterDetail;
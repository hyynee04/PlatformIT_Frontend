import { BsFiletypePdf } from "react-icons/bs";
import { GrLocation } from "react-icons/gr";
import { IoMdOpen } from "react-icons/io";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { LuFile, LuMail, LuPhone } from "react-icons/lu";
import { MdOutlineHandshake } from "react-icons/md";
import { RiGroupLine } from "react-icons/ri";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import default_image from "../../assets/img/default_image.png";
import "../../assets/scss/Detail.css";

import Carousel from "../../components/Carousel";
import { getCenterDetail } from "../../services/centerService";

const CenterDetail = (props) => {
    const location = useLocation();

    const [listTeacher, setListTeacher] = useState([])
    const [totalTeacherTracks, setTotalTeacherTracks] = useState(0)

    const [listCourse, setListCourse] = useState([])
    const [totalCourseTracks, setTotalCourseTracks] = useState(0)

    const [idRole, setIDRole] = useState("")
    const [idUser, setIDUser] = useState("")
    const [centerInfo, setCenterInfo] = useState({})

    const fetchCenterDetail = async (idCenter) => {
        let data = await getCenterDetail(idCenter);
        setCenterInfo(data);

        // Set center's Courses Carousel
        data.courseCards.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        if (data.courseCards.length > 6) {
            setTotalCourseTracks(3);
        }
        else
            setTotalCourseTracks(Math.ceil(data.courses.length / 2))
        setListCourse(data.courseCards)

        // Set center's Teachers Carousel
        data.teacherCards.sort((a, b) => b.coursesCount - a.coursesCount);
        if (data.courseCards.length > 6) {
            setTotalTeacherTracks(3);
        }
        else
            setTotalTeacherTracks(Math.ceil(data.teacherCards.length / 2))
        setListTeacher(data.teacherCards)
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
                        <div className="tag-container">
                            {centerInfo.listTagCourses && centerInfo.listTagCourses.map((tag) => (
                                <div
                                    key={tag.idTag}
                                    className='tag-content'
                                >{tag.tagName}</div>
                            ))}
                        </div>
                        <div className="center-information">
                            <span className="number-course"><LuFile color="#757575" /> {centerInfo.courseCount} courses</span>
                            <span className=""><RiGroupLine color="#757575" /> {centerInfo.studentCount} students</span>
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
                            <Carousel
                                object={1} //course
                                totalTracks={totalCourseTracks}
                                itemsPerTrack={2}
                                header={"Courses"}
                                listInfo={listCourse}
                            />
                        </div>
                    </div>
                )}


                {centerInfo.teacherCards && centerInfo.teacherCards.length !== 0 && (
                    <div className="block-container">

                        <div className="carousel-block">
                            <Carousel
                                object={2} //teacher
                                totalTracks={totalTeacherTracks}
                                itemsPerTrack={2}
                                header={"Teachers"}
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
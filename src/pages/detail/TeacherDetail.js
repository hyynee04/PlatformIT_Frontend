import { FaGraduationCap, FaRegFile } from "react-icons/fa6";
import { IoMdOpen } from "react-icons/io";
import { MdArrowForwardIos } from "react-icons/md";
import default_ava from "../../assets/img/default_ava.png";
import default_image from "../../assets/img/default_image.png";
import "../../assets/scss/Detail.css";
import Carousel from "../../components/Carousel";

const TeacherDetail = (props) => {
    return (
        <div className="detail-container">
            <div className="left-container">
                <div className="biography-container">
                    <img src={default_ava} />
                    <div className="biography-content">
                        <span className="biography-name">Alexander Happy Hoogan Morgan Hana</span>
                        <div className="teacher-information">
                            <span className="biography-brand">Biography</span>
                            <span className="teaching-major"><FaGraduationCap color="#757575" /> Teaching major</span>
                            <span className="number-course"><FaRegFile color="#757575" /> 100 courses</span>
                        </div>
                    </div>
                </div>

                <div className="center-card-container">
                    <span>Center</span>
                    <div className="center-card-information">
                        <img src={default_image} />
                        <div className="center-card-body">
                            <span className="name-center">Name</span>
                            <span className="quote-center">Say something I'm giving up on you</span>
                        </div>
                    </div>
                </div>

                <div className="link-container">
                    <span>Social/Profile Link</span>
                    <div className="link-content">
                        <div className="link-transfer">
                            <span className="name-center">Github</span>
                            <IoMdOpen color="#757575" />
                        </div>
                        <div className="link-transfer">
                            <span className="name-center">Facebook</span>
                            <IoMdOpen color="#757575" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="right-container">
                <div className="qualification-container">
                    <span>Professional Qualification</span>
                    <div className="qualification-content">
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

                <div className="course-carousel-container">
                    <Carousel 
                        object={1}
                        header={"Course"}
                        totalTracks={2}
                        itemsPerTrack={3}
                    />
                </div>
            </div>
        </div>
    )
}

export default TeacherDetail;
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { BsGenderTrans } from "react-icons/bs";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { LuGlobe2, LuMail, LuPhone } from "react-icons/lu";
import { RiChat3Line } from "react-icons/ri";
import default_ava from "../../assets/img/default_ava.png";
import "../../assets/scss/Detail.css";
import Carousel from "../../components/Carousel";

const StudentDetail = (props) => {
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
                        <Carousel
                            object={1}
                            header={"Course"}
                            totalTracks={2}
                            itemsPerTrack={3}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentDetail;
import { FaGraduationCap, FaRegFile } from "react-icons/fa6";
import { IoMdOpen } from "react-icons/io";
import { LuFile } from "react-icons/lu";
import { RiGroupLine } from "react-icons/ri";
import default_image from "../../assets/img/default_image.png";
import "../../assets/scss/Detail.css";
import Carousel from "../../components/Carousel";

const CenterDetail = (props) => {
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
                            object={1}
                            header={"Course"}
                            totalTracks={2}
                            itemsPerTrack={3}
                        />
                    </div>
                </div>

                <div className="block-container">
                    <div className="carousel-block">
                        <Carousel
                            object={2}
                            header={"Teacher"}
                            totalTracks={2}
                            itemsPerTrack={3}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CenterDetail;
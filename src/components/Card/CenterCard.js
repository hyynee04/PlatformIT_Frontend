import { LuFile } from "react-icons/lu";
import { RiGroupLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import "../../assets/css/card/Card.css";
import default_image from "../../assets/img/default_image.png";

const CenterCard = (props) => {
    const navigate = useNavigate();

    const { center } = props;
    const longest_tag = center.listTagCourses && center.listTagCourses.length > 0
        ? center.listTagCourses.reduce((longest, current) =>
            current.tagName.length > longest.tagName.length ? current : longest
        ).tagName
        : "";
    const remain_tag_number = center.listTagCourses ? center.listTagCourses.length - 1 : 0;

    return (
        <div
            className='card-container hover'
            onClick={() => {
                navigate('/centerDetail', {
                    state: {
                        idCenter: center.idCenter,
                        idUser: localStorage.getItem("idUser"),
                        idRole: localStorage.getItem("idRole")
                    }
                });
            }}
            style={{ cursor: "pointer" }}
        >
            <div className='center-card-container'>
                <img src={center.avatarPath || default_image} alt="center image" />
                <div className='center-card-body'>
                    <span className="center-card-title">{center.centerName !== null ? center.centerName : ""}</span>
                    <span className="center-card-quote">
                        {center.description !== null ? center.description : ""}
                    </span>
                    <div className="center-card-tag-container">
                        {longest_tag && (
                            <div className='tag-content'>{longest_tag}</div>
                        )}
                        {remain_tag_number > 0 && (
                            <div className='tag-content-more'>+{remain_tag_number}</div>
                        )}
                    </div>
                </div>
                <div className='center-card-footer'>
                    <div className='center-card-info'>
                        <LuFile color='#757575' />
                        <span>{center.coursesCount || 0}</span>
                    </div>
                    <div className='center-card-info'>
                        <span>{center.studentsCount || 0}</span>
                        <RiGroupLine color='#757575' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CenterCard;

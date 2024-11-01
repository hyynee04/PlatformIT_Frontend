import { LuFile } from "react-icons/lu";
import { RiGroupLine } from "react-icons/ri";
import default_image from "../../assets/img/default_image.png";
import "../../assets/scss/card/Card.css";

const CenterCard = (props) => {
    const { center } = props;
    const longest_tag = center.listTagCourses && center.listTagCourses.length > 0
        ? center.listTagCourses.reduce((longest, current) =>
            current.tagName.length > longest.tagName.length ? current : longest
        ).tagName
        : "(no tag)";
    const remain_tag_number = center.listTagCourses ? center.listTagCourses.length - 1 : 0;

    return (
        <div className='card-container'>
            <div className='center-card-container'>
                <img src={center.avatarPath !== "" ? center.avatarPath : default_image} alt="center image" />
                <div className='center-card-body'>
                    <span className="center-card-title">{center.centerName !== null ? center.centerName : "(unknown)"}</span>
                    <span className="center-card-quote">
                        {center.description !== null ? center.description : "(no description)"}
                    </span>
                    <div className="center-card-tag-container">
                        <div className='tag-content'>{longest_tag}</div>
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

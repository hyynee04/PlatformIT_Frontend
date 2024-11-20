import CourseMgmt from "../../components/CourseMgmt";
import { Role } from "../../constants/constants";

const TeacherCourseMgmt = () => {
    return (
        <>
            <CourseMgmt
                role={Role.teacher}
                id={localStorage.getItem("idUser")}
            />
        </>
    )
}

export default TeacherCourseMgmt;
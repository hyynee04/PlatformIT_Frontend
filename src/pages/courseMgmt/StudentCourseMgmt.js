import CourseMgmt from "../../components/CourseMgmt";
import { Role } from "../../constants/constants";

const StudentCourseMgmt = () => {
    return (
        <>
            <CourseMgmt
                role={Role.student}
                id={localStorage.getItem("idUser")}
            />
        </>
    )
}

export default StudentCourseMgmt;
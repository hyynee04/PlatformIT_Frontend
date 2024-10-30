import axios from "../utils/axiosCustomize";

const getAllCourseCards = () => {
    return axios.get("api/Course/GetAllCourseCards");
}

export {
    getAllCourseCards,
}
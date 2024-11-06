import axios from "../utils/axiosCustomize";

const getAllCourseCards = () => {
    return axios.get("api/Course/GetAllCourseCards");
}

const getCourseDetail = (idCourse) => {
    return axios.get("api/Course/GetCourseDetail", {
      params: {
        idCourse: idCourse
      }
    });
  }

export {
    getAllCourseCards,
    getCourseDetail,
}
import axios from "../utils/axiosCustomize";

const getAllCourseCards = () => {
  return axios.get("api/Course/GetAllCourseCards");
};
const getAllTags = async () => {
  return await axios.get("api/Course/GetAllTagModel");
};
const getCourseDetail = (idCourse) => {
  return axios.get("api/Course/GetCourseDetail", {
    params: {
      idCourse: idCourse,
    },
  });
};

export { getAllCourseCards, getCourseDetail, getAllTags };

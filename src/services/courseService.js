import axios from "../utils/axiosCustomize";

const getAllCourseCards = () => {
  return axios.get("api/Course/GetAllCourseCards");
};
const getAllTags = async () => {
  return await axios.get("api/Course/GetAllTagModel");
};
export { getAllCourseCards, getAllTags };

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
const postAddCourse = async (dataToSubmit) => {
  const idCreatedBy = +localStorage.getItem("idUser");
  const idCenter = +localStorage.getItem("idCenter");
  try {
    const formData = new FormData();
    formData.append("IdCenter", idCenter);
    formData.append("Title", dataToSubmit.title);
    formData.append("Description", dataToSubmit.description);
    formData.append("CourseAvatar", dataToSubmit.coverImg);

    if (dataToSubmit.isLimitedTime) {
      formData.append("IsLimitedTime", 1);
      formData.append("StartDate", dataToSubmit.startDate);
      formData.append("EndDate", dataToSubmit.endDate);
      formData.append("RegistStartDate", dataToSubmit.registStartDate);
      formData.append("RegistEndDate", dataToSubmit.registEndDate);
    } else {
      formData.append("IsLimitedTime", 0);
    }
    if (dataToSubmit.isLimitAttendees) {
      formData.append("IsLimitAttendees", 1);
      formData.append("MaxAttendees", dataToSubmit.maxAttendees);
    } else {
      formData.append("IsLimitAttendees", 0);
    }
    if (dataToSubmit.isPremiumCourse) {
      formData.append("IsPremiumCourse", 1);
      formData.append("Price", dataToSubmit.price);
      formData.append("DiscountedPrice", dataToSubmit.discountedPrice);
    } else {
      formData.append("IsPremiumCourse", 0);
    }
    formData.append("IsSequenced", dataToSubmit.isSequenced ? 1 : 0);
    formData.append(
      "IsApprovedLecture",
      dataToSubmit.isApprovedLecture ? 1 : 0
    );
    dataToSubmit.tags.forEach((tag) => {
      formData.append("Tags", tag);
    });
    formData.append("IdTeacher", dataToSubmit.idTeacher);
    return await axios.post(
      `api/Course/AddCourse?idCreatedBy=${idCreatedBy}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  } catch (error) {
    console.error("Error add course:", error.response?.data || error.message);
  }
};
const getAllActiveCourseOfTeacher = async () => {
  const idTeacher = +localStorage.getItem("idUser");
  return await axios.get("api/Course/GetAllActiveCourseOfTeacher", {
    params: {
      idTeacher: idTeacher,
    },
  });
};
export {
  getAllCourseCards,
  getCourseDetail,
  getAllTags,
  postAddCourse,
  getAllActiveCourseOfTeacher,
};

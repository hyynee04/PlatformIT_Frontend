import axios from "../utils/axiosCustomize";

const getAllCourseCards = (idStudent) => {
  return axios.get("api/Course/GetAllCourseCards", {
    params: {
      idStudent: idStudent,
    },
  });
};
const getAllCourseCardsByIdCenter = (idCenter) => {
  return axios.get("api/Course/GetAllCourseCardsByIdCenter", {
    params: {
      idCenter: idCenter,
    },
  });
};
const getAllCourseCardsByIdTeacher = (idTeacher) => {
  return axios.get("api/Course/GetAllCourseCardsByIdTeacher", {
    params: {
      idTeacher: idTeacher,
    },
  });
};
const getAllCourseCardsByIdStudent = (idStudent) => {
  return axios.get("api/Course/GetAllCourseCardsByIdStudent", {
    params: {
      idStudent: idStudent,
    },
  });
};
const getAllTagModel = async () => {
  return await axios.get("api/Course/GetAllTagModel");
};
const getCourseDetail = (idCourse) => {
  return axios.get("api/Course/GetCourseDetail", {
    params: {
      idCourse: idCourse,
    },
  });
};
const getViewCourse = (idCourse) => {
  return axios.get("api/Course/ViewCourse", {
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
    formData.append("Introduction", dataToSubmit.introduction);
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
const postUpdateCourse = async (courseInfo) => {
  try {
    const formData = new FormData();
    formData.append("IdCourse", courseInfo.idCourse);
    formData.append("Title", courseInfo.title);
    formData.append("IsDeletedFile", courseInfo.isDeletedFile);
    formData.append("Introduction", courseInfo.introduction || "");
    formData.append("CourseAvatar", courseInfo.coverImg);
    formData.append("IsLimitedTime", courseInfo.isLimitedTime);
    if (courseInfo.isLimitedTime === 1) {
      formData.append("StartDate", courseInfo.startDate);
      formData.append("EndDate", courseInfo.endDate);
      formData.append("RegistStartDate", courseInfo.registStartDate);
      formData.append("RegistEndDate", courseInfo.registEndDate);
    }
    formData.append("IsLimitAttendees", courseInfo.isLimitAttendees);
    if (courseInfo.isLimitAttendees === 1) {
      formData.append("MaxAttendees", courseInfo.maxAttendees);
    }
    formData.append("IsPremiumCourse", courseInfo.isPremiumCourse);
    formData.append("Price", courseInfo.price || "");
    formData.append("DiscountedPrice", courseInfo.discountedPrice || "");
    formData.append(
      "IsSequenced",
      courseInfo.isSequenced === 1 || courseInfo.isSequenced ? 1 : 0
    );
    formData.append(
      "IsApprovedLecture",
      courseInfo.isApprovedLecture === 1 || courseInfo.isApprovedLecture ? 1 : 0
    );
    courseInfo.tags.forEach((tag) => {
      formData.append("Tags", tag);
    });
    formData.append("IdTeacher", courseInfo.idTeacher);
    return await axios.post(
      `api/Course/UpdateCourseInfo?idUpdatedBy=${Number(
        localStorage.getItem("idUser")
      )}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  } catch (error) {
    throw error;
  }
};
const getIsEnRolledCourse = async (idCourse) => {
  const idUser = +localStorage.getItem("idUser");
  return await axios.get("api/Course/IsEnrolledCourse", {
    params: {
      idStudent: idUser,
      idCourse: idCourse,
    },
  });
};
const getIsChatAvailable = async (idStudent, idTeacher) => {
  return await axios.get("api/User/IsChatAvailable", {
    params: {
      idStudent: idStudent,
      idTeacher: idTeacher,
    },
  });
};
const postEnrollCourse = async (idCourse) => {
  const idUser = +localStorage.getItem("idUser");
  return await axios.post("api/Course/EnrollCourse", null, {
    params: {
      idStudent: idUser,
      idCourse: idCourse,
      idCreatedBy: idUser,
    },
  });
};
const getAllActiveCourseOfTeacher = async () => {
  const idTeacher = +localStorage.getItem("idUser");
  return await axios.get("api/Course/GetAllActiveCourseOfTeacher", {
    params: {
      idTeacher: idTeacher,
    },
  });
};
const getAllActiveSectionOfCourse = async (idCourse) => {
  return await axios.get("api/Course/GetAllActiveSectionOfCourse", {
    params: {
      idCourse: idCourse,
    },
  });
};
const getAllActiveLecturesOfCoure = async (idCourse) => {
  return await axios.get("api/Lecture/GetAllActiveLecturesOfCourse", {
    params: {
      idCourse: idCourse,
    },
  });
};

const postAddSection = (sectionName, idCourse, idCreatedBy) => {
  return axios.post(`api/Course/AddSection`, null, {
    params: {
      sectionName: sectionName,
      idCourse: idCourse,
      idCreatedBy: idCreatedBy,
    },
  });
};

const inactiveSection = (idSection, idCreatedBy) => {
  return axios.post(`api/Lecture/InactiveSection`, null, {
    params: {
      idSection: idSection,
      idCreatedBy: idCreatedBy,
    },
  });
};
const inactiveLecture = (idLecture, idCreatedBy) => {
  return axios.post(`api/Lecture/InactiveLecture`, null, {
    params: {
      idLecture: idLecture,
      idCreatedBy: idCreatedBy,
    },
  });
};

const updateSection = (idSection, newSectionName, idUpdatedBy) => {
  return axios.post(`api/Course/UpdateSection`, null, {
    params: {
      idSection: idSection,
      newSectionName: newSectionName,
      idUpdatedBy: idUpdatedBy,
    },
  });
};

const postAddLecture = async (idList, lectureData) => {
  try {
    const formData = new FormData();

    // Append basic fields to formData
    formData.append("IdCourse", idList.idCourse);
    formData.append("IdSection", idList.idSection);
    formData.append("Title", lectureData.Title);
    formData.append("Introduction", lectureData.Introduction);

    // Append lecture video
    formData.append("LectureVideo", lectureData.LectureVideo);
    // Append main materials
    formData.append("MainMaterials", lectureData.MainMaterials);
    // Append support materials (handling multiple)
    lectureData.SupportMaterials.forEach((material, index) => {
      formData.append(`SupportMaterials`, material); // each material is appended as SupportMaterials
    });

    // Make the request with the required headers
    return await axios.post(
      `api/Lecture/AddLecture?idCreatedBy=${idList.idCreatedBy}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // needed for file uploads
        },
      }
    );
  } catch (error) {
    console.error(
      "Error adding lecture:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const getLectureDetail = (idLecture) => {
  return axios.get("api/Lecture/GetLectureDetail", {
    params: {
      idLecture: idLecture,
    },
  });
};

const getCourseProgress = (idCourse) => {
  return axios.get("api/Course/GetCourseProgress", {
    params: {
      idCourse: idCourse,
    },
  });
};

const getCourseContentStructure = (idCourse, idStudent) => {
  return axios.get("api/Course/GetCourseContentStructure", {
    params: {
      idCourse: idCourse,
      ...(idStudent && { idStudent: idStudent }),
    },
  });
};

const getExerciseOfLecture = (idLecture, idStudent) => {
  return axios.get("api/Assignment/GetExerciseOfLecture", {
    params: {
      idLecture: idLecture,
      idStudent: idStudent,
    },
  });
};

const getCourseProgressByIdStudent = (idCourse, idStudent) => {
  return axios.get("api/Course/GetCourseProgressByIdStudent", {
    params: {
      idCourse: idCourse,
      idStudent: idStudent,
    },
  });
};

const getSectionDetail = (idCourse) => {
  return axios.get("api/Course/GetSectionDetail", {
    params: {
      idCourse: idCourse,
    },
  });
};
const deleteCourse = (idCourse) => {
  return axios.delete("api/Course/DeleteCourse", {
    params: {
      idCourse: idCourse,
      idUpdatedBy: Number(localStorage.getItem("idUser")),
    },
  });
};
const postUpdateLecture = async (idList, lectureData, LectureStatus) => {
  try {
    const formData = new FormData();

    // Append basic fields to formData
    formData.append("IdLecture", idList.idLecture);
    formData.append("IdCourse", idList.idCourse);
    formData.append("IdSection", idList.idSection);
    formData.append("LectureStatus", LectureStatus);
    formData.append("Title", lectureData.Title);
    formData.append("Introduction", lectureData.Introduction);

    // Append lecture video
    formData.append("LectureVideo", lectureData.LectureVideo);
    // Append main materials
    formData.append("MainMaterials", lectureData.MainMaterials);
    // Append support materials (handling multiple)
    lectureData.SupportMaterials.forEach((material) => {
      formData.append(`SupportMaterials`, material); // each material is appended as SupportMaterials
    });
    lectureData.IdFileNotDelete.forEach((id) => {
      formData.append("IdFileNotDelete", id);
    });

    // Make the request with the required headers
    return await axios.post(
      `api/Lecture/UpdateLecture?idUpdatedBy=${idList.idCreatedBy}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // needed for file uploads
        },
      }
    );
  } catch (error) {
    console.error(
      "Error adding lecture:",
      error.response?.data || error.message
    );
    throw error;
  }
};
const getAllPendingLectureOfCenter = () => {
  return axios.get("api/Lecture/GetAllPendingLectureOfCenter", {
    params: {
      idCenter: Number(localStorage.getItem("idCenter")),
    },
  });
};
const postApproveLecture = (idLecture) => {
  return axios.post("api/Lecture/ApproveLecture", null, {
    params: {
      idLecture: idLecture,
      idUpdatedBy: Number(localStorage.getItem("idUser")),
    },
  });
};
const postRejectLecture = (idLecture, reason) => {
  return axios.post("api/Lecture/RejectLecture", null, {
    params: {
      idLecture: idLecture,
      reason: reason,
      idUpdatedBy: Number(localStorage.getItem("idUser")),
    },
  });
};
const getLectureInfoForCmtNoti = (idLecture) => {
  return axios.get("api/Lecture/GetLectureInfoForCmtNoti", {
    params: {
      idLecture: idLecture,
    },
  });
};
const postAddReview = (idUser, idCourse, rating) => {
  return axios.post("api/Course/AddRating", {
    idUser: idUser,
    idCourse: idCourse,
    content: rating.content,
    ratingNumber: rating.number,
  });
};
const deleteReview = (idRating, idUpdatedBy) => {
  return axios.delete("api/Course/DeleteRating", {
    params: {
      idRating: idRating,
      idUpdatedBy: idUpdatedBy,
    },
  });
};
const getAllRatingsOfCourse = (idCourse) => {
  return axios.get("api/Course/GetAllRatingsOfCourse", {
    params: {
      idCourse: idCourse,
    },
  });
};
const postFinishLecture = (idLecture, idStudent) => {
  return axios.post(`api/Lecture/FinishLectures`, null, {
    params: {
      idLecture: idLecture,
      idStudent: idStudent,
    },
  });
};

export {
  getAllActiveCourseOfTeacher,
  getAllActiveLecturesOfCoure,
  getAllActiveSectionOfCourse,
  getAllCourseCards,
  getAllCourseCardsByIdCenter,
  getAllCourseCardsByIdStudent,
  getAllCourseCardsByIdTeacher,
  getAllTagModel,
  getCourseContentStructure,
  getCourseDetail,
  getViewCourse,
  getCourseProgress,
  getExerciseOfLecture,
  getIsEnRolledCourse,
  getIsChatAvailable,
  getLectureDetail,
  postAddCourse,
  postUpdateCourse,
  postAddLecture,
  postAddSection,
  postEnrollCourse,
  getCourseProgressByIdStudent,
  getSectionDetail,
  inactiveSection,
  updateSection,
  inactiveLecture,
  deleteCourse,
  postUpdateLecture,
  getAllPendingLectureOfCenter,
  postApproveLecture,
  postRejectLecture,
  getLectureInfoForCmtNoti,
  postAddReview,
  getAllRatingsOfCourse,
  deleteReview,
  postFinishLecture,
};

import axios from "../utils/axiosCustomize";

const getAllCourseCards = () => {
  return axios.get("api/Course/GetAllCourseCards");
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
const getIsEnRolledCourse = async (idCourse) => {
  const idUser = +localStorage.getItem("idUser");
  return await axios.get("api/Course/IsEnrolledCourse", {
    params: {
      idStudent: idUser,
      idCourse: idCourse,
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
const getAllAssignmentCardOfTeacher = async () => {
  return await axios.get("api/Assignment/GetAllAssignmentCardOfTeacher", {
    params: {
      idTeacher: +localStorage.getItem("idUser"),
    },
  });
};
const postAddManualAssignment = async (dataToSubmit) => {
  const idCreatedBy = +localStorage.getItem("idUser");
  try {
    const formData = new FormData();
    formData.append("Title", dataToSubmit.title);
    formData.append("IdCourse", dataToSubmit.idCourse);

    if (!dataToSubmit.isTest) {
      formData.append("IsTest", 0);
      formData.append("IdLecture", dataToSubmit.idLecture);
    } else {
      formData.append("IsTest", 1);
    }

    formData.append("StartDate", dataToSubmit.startDate);
    formData.append("DueDate", dataToSubmit.endDate);
    formData.append("Duration", dataToSubmit.duration);
    formData.append("AssignmentType", dataToSubmit.assignmentType);

    formData.append("IsPublish", dataToSubmit.isPublish ? 1 : 0);
    formData.append(
      "IsShufflingQuestion",
      dataToSubmit.isShufflingQuestion ? 1 : 0
    );
    // Duyệt qua từng câu hỏi trong mảng questions
    dataToSubmit.questions.forEach((question, index) => {
      formData.append(`AssignmentItems[${index}].Question`, question.question);
      formData.append(`AssignmentItems[${index}].Mark`, question.mark);
      formData.append(
        `AssignmentItems[${index}].AssignmentItemAnswerType`,
        question.assignmentItemAnswerType
      );

      // Nếu có file đính kèm
      if (question.attachedFile) {
        formData.append(
          `AssignmentItems[${index}].AttachedFile`,
          question.attachedFile
        );
      }
    });
    formData.append("CreatedBy", idCreatedBy);
    return await axios.post("api/Assignment/CreateManualAssignment", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("Error add course:", error.response?.data || error.message);
  }
};
const postAddQuizAssignment = async (dataToSubmit) => {
  const idCreatedBy = +localStorage.getItem("idUser");
  try {
    const formData = new FormData();
    formData.append("Title", dataToSubmit.title);
    formData.append("IdCourse", dataToSubmit.idCourse);

    if (!dataToSubmit.isTest) {
      formData.append("IsTest", 0);
      formData.append("IdLecture", dataToSubmit.idLecture);
    } else {
      formData.append("IsTest", 1);
    }

    formData.append("StartDate", dataToSubmit.startDate);
    formData.append("DueDate", dataToSubmit.endDate);
    formData.append("Duration", dataToSubmit.duration);
    formData.append("AssignmentType", dataToSubmit.assignmentType);

    formData.append("IsPublish", dataToSubmit.isPublish ? 1 : 0);

    formData.append(
      "IsShufflingQuestion",
      dataToSubmit.isShufflingQuestion ? 1 : 0
    );
    formData.append(
      "IsShufflingAnswer",
      dataToSubmit.isShufflingAnswer ? 1 : 0
    );
    formData.append("ShowAnswer", dataToSubmit.isShowAnswer ? 1 : 0);
    // Duyệt qua từng câu hỏi trong mảng questions
    dataToSubmit.questions.forEach((question, index) => {
      formData.append(`AssignmentItems[${index}].Question`, question.question);
      formData.append(`AssignmentItems[${index}].Mark`, question.mark);
      formData.append(
        `AssignmentItems[${index}].Explanation`,
        question.explanation
      );
      formData.append(
        `AssignmentItems[${index}].IsMultipleAnswer`,
        question.isMultipleAnswer ? 1 : 0
      );

      // Duyệt qua các item của câu hỏi (các lựa chọn đáp án)
      question.items.forEach((item, itemIndex) => {
        formData.append(
          `AssignmentItems[${index}].Items[${itemIndex}].Content`,
          item.content
        );
        formData.append(
          `AssignmentItems[${index}].Items[${itemIndex}].IsCorrect`,
          item.isCorrect ? 1 : 0
        );
      });

      // Nếu có file đính kèm
      if (question.attachedFile) {
        formData.append(
          `AssignmentItems[${index}].AttachedFile`,
          question.attachedFile
        );
      }
    });
    formData.append("CreatedBy", idCreatedBy);
    return await axios.post("api/Assignment/CreateQuizAssignment", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("Error add course:", error.response?.data || error.message);
  }
};
const deleteAssignment = async (idAssignment) => {
  const idUpdatedBy = +localStorage.getItem("idUser");
  try {
    return await axios.delete("api/Assignment/DeleteAssignment", {
      params: {
        idAssignment: idAssignment,
        idUpdatedBy: idUpdatedBy,
      },
    });
  } catch (error) {
    throw error;
  }
};
export {
  getAllActiveCourseOfTeacher,
  getAllActiveLecturesOfCoure,
  getAllActiveSectionOfCourse,
  getAllAssignmentCardOfTeacher,
  getAllCourseCards,
  getAllCourseCardsByIdCenter,
  getAllCourseCardsByIdStudent,
  getAllCourseCardsByIdTeacher,
  getAllTagModel,
  getCourseDetail,
  getIsEnRolledCourse,
  postAddCourse,
  postAddManualAssignment,
  postAddQuizAssignment,
  postEnrollCourse,
  deleteAssignment,
};

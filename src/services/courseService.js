import { AssignmentType } from "../constants/constants";
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
const getAllTestCardOfStudent = async () => {
  return await axios.get("api/Assignment/GetAllTestCardOfStudent", {
    params: {
      idStudent: +localStorage.getItem("idUser"),
    },
  });
};
const getAssignmentInfo = async (idAssignment) => {
  return await axios.get("api/Assignment/GetAssignmentInfo", {
    params: {
      idAssignment: idAssignment,
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
        if (question.attachedFile instanceof File) {
          formData.append(
            `AssignmentItems[${index}].AttachedFile`,
            question.attachedFile
          );
        } else if (typeof question.attachedFile === "string") {
          formData.append(
            `AssignmentItems[${index}].PathFile`,
            question.attachedFile
          );
          formData.append(
            `AssignmentItems[${index}].FileName`,
            question.nameFile
          );
        }
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
    for (const [index, question] of dataToSubmit.questions.entries()) {
      formData.append(`AssignmentItems[${index}].Question`, question.question);
      formData.append(`AssignmentItems[${index}].Mark`, question.mark);
      formData.append(
        `AssignmentItems[${index}].Explanation`,
        question.explanation ?? ""
      );
      formData.append(
        `AssignmentItems[${index}].IsMultipleAnswer`,
        question.isMultipleAnswer ? 1 : 0
      );
      if (question.attachedFile) {
        if (question.attachedFile instanceof File) {
          formData.append(
            `AssignmentItems[${index}].AttachedFile`,
            question.attachedFile
          );
        } else if (typeof question.attachedFile === "string") {
          formData.append(
            `AssignmentItems[${index}].PathFile`,
            question.attachedFile
          );
          formData.append(
            `AssignmentItems[${index}].FileName`,
            question.nameFile
          );
        }
      }

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
    }
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
const postPublishAssignment = async (idAssignment) => {
  const idUpdatedBy = +localStorage.getItem("idUser");
  try {
    return await axios.post("api/Assignment/PublishAssignment", null, {
      params: {
        idAssignment: idAssignment,
        idUpdatedBy: idUpdatedBy,
      },
    });
  } catch (error) {
    throw error;
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
const postUpdateAssignment = async (dataToSubmit) => {
  const updatedBy = +localStorage.getItem("idUser");
  try {
    const formData = new FormData();
    formData.append("IdAssignment", dataToSubmit.idAssignment);
    formData.append("Title", dataToSubmit.title);
    formData.append("StartDate", dataToSubmit.startDate);
    formData.append("DueDate", dataToSubmit.endDate);
    formData.append("Duration", dataToSubmit.duration);
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
    formData.append("AssignmentStatus", dataToSubmit.assignmentStatus);
    // Duyệt qua từng câu hỏi trong mảng questions

    for (const [index, question] of dataToSubmit.questions.entries()) {
      formData.append(
        `AssignmentItems[${index}].idAssignmentItem`,
        question.idAssignmentItem
      );
      formData.append(`AssignmentItems[${index}].question`, question.question);
      formData.append(`AssignmentItems[${index}].mark`, question.mark);

      formData.append(
        `AssignmentItems[${index}].assignmentItemStatus`,
        question.assignmentItemStatus
      );
      formData.append(
        `AssignmentItems[${index}].isDeletedFile`,
        question?.isDeletedFile || 0
      );

      if (question.attachedFile) {
        if (question.attachedFile instanceof File) {
          formData.append(
            `AssignmentItems[${index}].attachedFile`,
            question.attachedFile
          );
        }
      }

      if (dataToSubmit.assignmentType === AssignmentType.manual) {
        formData.append(
          `AssignmentItems[${index}].assignmentItemAnswerType`,
          question.assignmentItemAnswerType
        );
      }

      if (dataToSubmit.assignmentType === AssignmentType.quiz) {
        formData.append(
          `AssignmentItems[${index}].explanation`,
          question.explanation ?? ""
        );
        formData.append(
          `AssignmentItems[${index}].isMultipleAnswer`,
          question.isMultipleAnswer ? 1 : 0
        );

        for (const [itemIndex, item] of question.items.entries()) {
          formData.append(
            `AssignmentItems[${index}].Items[${itemIndex}].idMultipleAssignmentItem`,
            item.idMultipleAssignmentItem
          );
          formData.append(
            `AssignmentItems[${index}].Items[${itemIndex}].content`,
            item.content
          );
          formData.append(
            `AssignmentItems[${index}].Items[${itemIndex}].isCorrect`,
            item.isCorrect ? 1 : 0
          );
          formData.append(
            `AssignmentItems[${index}].Items[${itemIndex}].multipleAssignmentItemStatus`,
            item.multipleAssignmentItemStatus
          );
        }
      }
    }
    return await axios.post(
      `api/Assignment/UpdateAssignment?updatedBy=${updatedBy}`,
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

const postAddSection = (sectionName, idCourse, idCreatedBy) => {
  return axios.post(`api/Course/AddSection`, null, {
    params: {
      sectionName: sectionName,
      idCourse: idCourse,
      idCreatedBy: idCreatedBy,
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
      `http://localhost:5000/api/Lecture/AddLecture?idCreatedBy=${idList.idCreatedBy}`,
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

const getNotificationBoardOfCourse = (idCourse) => {
  return axios.get("api/Notification/GetNotificationBoardOfCourse", {
    params: {
      idCourse: idCourse,
    },
  });
};

const postAddBoardNotificationForCourse = (idCourse, content, idCreatedBy) => {
  return axios.post(`api/Notification/AddBoardNotificationForCourse`, null, {
    params: {
      idCourse: idCourse,
      content: content,
      idCreatedBy: idCreatedBy,
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

const getTestOfCourseStudent = (idCourse, idStudent) => {
  return axios.get("api/Course/GetTestOfCourseStudent", {
    params: {
      idCourse: idCourse,
      idStudent: idStudent,
    },
  });
};

export {
  deleteAssignment,
  getAllActiveCourseOfTeacher,
  getAllActiveLecturesOfCoure,
  getAllActiveSectionOfCourse,
  getAllAssignmentCardOfTeacher,
  getAllCourseCards,
  getAllCourseCardsByIdCenter,
  getAllCourseCardsByIdStudent,
  getAllCourseCardsByIdTeacher,
  getAllTagModel,
  getAllTestCardOfStudent,
  getAssignmentInfo,
  getCourseContentStructure,
  getCourseDetail,
  getCourseProgress,
  getExerciseOfLecture,
  getIsEnRolledCourse,
  getLectureDetail,
  getNotificationBoardOfCourse,
  postAddBoardNotificationForCourse,
  postAddCourse,
  postAddLecture,
  postAddManualAssignment,
  postAddQuizAssignment,
  postAddSection,
  postEnrollCourse,
  postPublishAssignment,
  postUpdateAssignment,
  getCourseProgressByIdStudent,
  getTestOfCourseStudent,
};

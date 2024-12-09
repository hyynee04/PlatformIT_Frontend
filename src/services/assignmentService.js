import { AssignmentType } from "../constants/constants";
import axios from "../utils/axiosCustomize";

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
const getOverviewAssignment = async (idAssignment, idCourse) => {
  console.log("idCourse", idCourse);

  return await axios.get("api/Assignment/GetOverviewAssignment", {
    params: {
      idAssignment: idAssignment,
      idCourse: idCourse,
    },
  });
};
const getDetailAssignmentForStudent = async (idAssignment) => {
  return await axios.get("api/Assignment/GetDetailAssignmentForStudent", {
    params: {
      idAssignment: idAssignment,
      idStudent: Number(localStorage.getItem("idUser")),
    },
  });
};
const getDetailAssignmentItemForStudent = async (idAssignment) => {
  return await axios.get("api/Assignment/GetDetailAssignmentItemForStudent", {
    params: {
      idAssignment: idAssignment,
    },
  });
};
const getAssignmentAnswer = async (idAssignment) => {
  return await axios.get("api/Assignment/GetAssignmentAnswer", {
    params: {
      idAssignment: idAssignment,
      idStudent: Number(localStorage.getItem("idUser")),
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
    formData.append("ShowAnswer", dataToSubmit.showAnswer ? 1 : 0);
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

const postSubmitQuizAssignment = async (requestData) => {
  try {
    return await axios.post(
      "api/Assignment/SubmitQuizAssignment",
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    throw error;
  }
};
const postSubmitManualQuestion = async () => {
  try {
    return await axios.post("api/Assignment/SubmitManualAssignment", {});
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

export {
  getAllAssignmentCardOfTeacher,
  getAllTestCardOfStudent,
  getAssignmentInfo,
  getOverviewAssignment,
  getDetailAssignmentForStudent,
  getDetailAssignmentItemForStudent,
  getAssignmentAnswer,
  postAddManualAssignment,
  postAddQuizAssignment,
  postPublishAssignment,
  postUpdateAssignment,
  deleteAssignment,
  postSubmitQuizAssignment,
  postSubmitManualQuestion,
};

import axios from "../utils/axiosCustomize";

const postAddComment = async (commentData) => {
  try {
    const data = {
      idLecture: commentData.idLecture,
      idSender: commentData.idSender,
      idReceiver: commentData.idReceiver || null,
      idCommentRef: commentData.idCommentRef || null,
      content: commentData.content,
    };
    return await axios.post("api/Comment/AddComment", data);
  } catch (error) {
    console.error(
      "Error adding comment: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

const getAllCommentOfLecture = (idLecture) => {
  return axios.get("api/Comment/GetAllCommentOfLecture", {
    params: {
      lectureId: idLecture,
    },
  });
};

const deleteComment = (idComment, idUpdatedBy) => {
  return axios.delete("api/Comment/DeleteComment", {
    params: {
      idComment: idComment,
      idUpdatedBy: idUpdatedBy,
    },
  });
};

export { postAddComment, getAllCommentOfLecture, deleteComment };

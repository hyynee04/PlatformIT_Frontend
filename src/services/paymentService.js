import axios from "../utils/axiosCustomize";

const getPayment = (paymentData) => {
  return axios.get("/api/Payment/payment", {
    params: {
      amount: paymentData.amount,
      idStudent: paymentData.idStudent,
      idCourse: paymentData.idCourse,
    },
    maxRedirects: 0,
  });
};
const getAllPaymentOfStudent = (idStudent) => {
  return axios.get("api/Payment/GetAllPaymentOfStudent", {
    params: {
      idStudent: idStudent,
    },
  });
};
const getAllPaymentOfCenter = (idCenter) => {
  return axios.get("api/Payment/GetAllPaymentOfCenter", {
    params: {
      idCenter: idCenter,
    },
  });
};

export { getPayment, getAllPaymentOfStudent, getAllPaymentOfCenter };

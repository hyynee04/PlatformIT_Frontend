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

export { getPayment };

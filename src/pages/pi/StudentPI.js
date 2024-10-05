import React from "react";

import "../../assets/scss/PI.css";
import BasicInfoForm from "../../components/BasicInfoForm";
import { useCookies } from "react-cookie";

const StudentPI = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const idRole = cookies.idRole;
  return (
    <div>
      <BasicInfoForm></BasicInfoForm>
    </div>
  );
};

export default StudentPI;

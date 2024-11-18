import React from "react";
import CourseMgmt from "../../components/CourseMgmt";
import { Role } from "../../constants/constants";

const CenterAdCourseMgmt = () => {
  return (
    <>
      <CourseMgmt
        role={Role.centerAdmin}
        id={localStorage.getItem("idCenter")}
      />
    </>
  );
};

export default CenterAdCourseMgmt;

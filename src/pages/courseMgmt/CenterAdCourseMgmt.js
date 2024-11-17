import React from "react";
import CourseMgmt from "../../components/CourseMgmt";

const CenterAdCourseMgmt = () => {
  return (
    <>
      <CourseMgmt idCenter={localStorage.getItem("idCenter")} />
    </>
  );
};

export default CenterAdCourseMgmt;

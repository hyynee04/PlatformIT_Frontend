import React, { useEffect, useState } from "react";
import UpdateAssignment from "./UpdateAssignment";
import { useLocation } from "react-router-dom";

const DuplicateAssign = () => {
  const location = useLocation();
  const [idAssignment, setIdAssignment] = useState("");
  useEffect(() => {
    const state = location.state;
    if (state) {
      if (state.idAssignment) {
        setIdAssignment(state.idAssignment);
      }
    }
  }, [location, idAssignment]);
  return (
    <div>
      <UpdateAssignment isDuplicate={true} />
    </div>
  );
};

export default DuplicateAssign;

import React, { useEffect, useState } from "react";
import { LuChevronDown, LuFilter, LuSearch } from "react-icons/lu";
import { Role } from "../../constants/constants";

import "../../assets/scss/UserMgmt.css";
import { getAllUser } from "../../services/userService";
const PlatformAdUserMgmt = () => {
  const [activeRole, setActiveRole] = useState(Role.centerAdmin);
  const [listUser, setListUser] = useState([]);

  useEffect(() => {
    const getListUser = async () => {
      try {
        let data = await getAllUser();
        console.log(data);

        let usersWithRole = data.filter((user) => user.idRole === activeRole);
        setListUser(usersWithRole);
      } catch (error) {}
    };
    getListUser();
  }, []);
  const handleRoleClick = (role) => {
    setActiveRole(role);
  };
  //   const renderGender(gender) => {
  //     switch
  //   }
  return (
    <>
      <div className="page-user-container">
        <div className="role-users-group">
          <button
            className={`role-btn ${
              activeRole === Role.centerAdmin ? "active" : ""
            }`}
            onClick={() => handleRoleClick(Role.centerAdmin)}
          >
            Center Administrator
          </button>
          <button
            className={`role-btn ${
              activeRole === Role.teacher ? "active" : ""
            }`}
            onClick={() => handleRoleClick(Role.teacher)}
          >
            Teacher
          </button>
          <button
            className={`role-btn ${
              activeRole === Role.student ? "active" : ""
            }`}
            onClick={() => handleRoleClick(Role.student)}
          >
            Student
          </button>
        </div>
        <div className="filter-search">
          <div className="filter-sort-btns">
            <div className="btn">
              <LuFilter className="icon" />
              <span>Fiter</span>
            </div>
            <div className="btn">
              <span>Sort by</span>
              <LuChevronDown className="icon" />
            </div>
          </div>
          <div className="search-container">
            <input type="text" className="search-field" placeholder="Search" />
            <LuSearch className="icon search-icon" />
          </div>
        </div>
        <div className="list-container">
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Full Name</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Date Joined</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {listUser.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.fullName}</td>
                  <td>{}</td>
                  <td>{user.email}</td>
                  <td>{user.joinedDate.split("T")[0]}</td>
                  <td>{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PlatformAdUserMgmt;

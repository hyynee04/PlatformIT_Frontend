import React, { useEffect, useState } from "react";
import {
  LuChevronDown,
  LuFilter,
  LuSearch,
  LuMoreHorizontal,
  LuChevronsLeft,
  LuChevronsRight,
  LuUserPlus,
} from "react-icons/lu";
import { CenterAdminLevel, Role, Status } from "../../constants/constants";
import FilterUser from "../../components/FilterUser";
import UserOption from "../../components/UserOption";
import {
  getAllStudentByIdCenter,
  getAllTeacherByIdCenter,
} from "../../services/centerService";

import "../../assets/scss/UserMgmt.css";
import DiagAddTeacherForm from "../../components/DiagAddTeacherForm";

const CenterAdUserMgmt = () => {
  const idCenter = +localStorage.getItem("idCenter");
  const [activeRole, setActiveRole] = useState(Role.teacher);
  const [listUser, setListUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [filterVisble, setFilterVisble] = useState(false);

  const [gender, setGender] = useState(null);
  const [level, setLevel] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [status, setStatus] = useState(null);

  const [isModalAddTeacherOpen, setIsModalAddTeacherOpen] = useState(false);
  const openAddTeacherModal = () => setIsModalAddTeacherOpen(true);
  const closeAddTeacherModal = () => setIsModalAddTeacherOpen(false);
  useEffect(() => {
    const getListUser = async () => {
      try {
        let data;

        if (activeRole === Role.teacher) {
          const response = await getAllTeacherByIdCenter(idCenter);
          data = response;
        } else if (activeRole === Role.student) {
          const response = await getAllStudentByIdCenter(idCenter);
          data = response;
        }

        console.log("data", data);

        if (data) {
          let usersWithRole = data.filter((user) => user.idRole === activeRole);
          setListUser(usersWithRole);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getListUser();
  }, [activeRole, idCenter]);

  const handleRoleClick = (role) => {
    setActiveRole(role);
  };
  const handleFilterChange = ({ gender, level, dateRange, status }) => {
    setGender(gender);
    setLevel(level);
    setDateRange(dateRange);
    setStatus(status);
  };

  const filteredUser = listUser.filter((user) => {
    const searchTermLower = searchTerm.toLowerCase();

    const matchesSearchTerm = Object.keys(user).some((key) => {
      if (user[key] === null || user[key] === undefined) return false;
      if (typeof user[key] === "string" || typeof user[key] === "number") {
        return user[key].toString().toLowerCase().includes(searchTermLower);
      }
      if (key === "joinedDate") {
        return new Date(user[key])
          .toLocaleDateString("en-US")
          .includes(searchTermLower);
      }
      if (key === "status") {
        return (user[key] === Status.active ? "Active" : "Inactive")
          .toLowerCase()
          .includes(searchTermLower);
      }
      if (key === "isMainCenterAdmin" && activeRole === Role.centerAdmin) {
        return (user[key] ? "Main" : "Mem")
          .toLowerCase()
          .includes(searchTermLower);
      }
      return false;
    });

    const matchesGender =
      gender === null || gender === undefined || user.gender === gender;

    const matchesLevel =
      level === null ||
      level === undefined ||
      (activeRole === Role.centerAdmin &&
        (level === CenterAdminLevel.main
          ? user.isMainCenterAdmin
          : !user.isMainCenterAdmin));

    const matchesDateJoined =
      (!dateRange.startDate && !dateRange.endDate) ||
      (user.joinedDate &&
        new Date(user.joinedDate) >= new Date(dateRange.startDate) &&
        new Date(user.joinedDate) <= new Date(dateRange.endDate));

    const matchesStatus =
      status === null || status === undefined || user.status === status;

    return (
      matchesSearchTerm &&
      matchesGender &&
      matchesLevel &&
      matchesDateJoined &&
      matchesStatus
    );
  });

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 30;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredUser.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredUser.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const handleMoreIconClick = (idUser) => {
    setSelectedUserId((prevSelectedId) =>
      prevSelectedId === idUser ? null : idUser
    );
  };
  return (
    <>
      <div className="page-user-container">
        <div className="role-users-group">
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
            <div className="btn" onClick={() => setFilterVisble(!filterVisble)}>
              <LuFilter className="icon" />
              <span>Filter</span>
            </div>
            {filterVisble && <FilterUser onFilterChange={handleFilterChange} />}
            <div className="btn">
              <span>Sort by</span>
              <LuChevronDown className="icon" />
            </div>
          </div>

          <div className="search-container">
            <input
              type="text"
              className="search-field"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <LuSearch className="icon search-icon" />
          </div>
        </div>
        {activeRole === Role.teacher && (
          <div className="add-btn">
            <div className="btn" onClick={() => openAddTeacherModal()}>
              <LuUserPlus className="icon" />
              <span>Add teacher</span>
            </div>
            <DiagAddTeacherForm
              isOpen={isModalAddTeacherOpen}
              onClose={closeAddTeacherModal}
            />
          </div>
        )}
        <div className="list-container">
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Full Name</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Date Joined</th>
                {activeRole === Role.teacher && <th>Teaching Major</th>}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {records.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.fullName}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.joinedDate &&
                      (() => {
                        const date = new Date(user.joinedDate);
                        const day = String(date.getDate()).padStart(2, "0");
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0"
                        ); // Tháng trong JavaScript bắt đầu từ 0
                        const year = date.getFullYear();

                        return `${month}/${day}/${year}`;
                      })()}
                  </td>
                  {activeRole === Role.teacher && <td>{user.teachingMajor}</td>}
                  <td className="table-cell" style={{ cursor: "pointer" }}>
                    <LuMoreHorizontal
                      onClick={() => handleMoreIconClick(user.idUser)}
                    />
                    {selectedUserId === user.idUser && (
                      <UserOption
                        className="user-option"
                        idUserSelected={user.idUser}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-container">
          <nav>
            <ul className="pagination">
              <li className="page-item">
                <button className="page-link" onClick={prePage}>
                  <LuChevronsLeft />
                </button>
              </li>
              {numbers.map((n, i) => (
                <li
                  className={`page-item ${currentPage === n ? "active" : ""}`}
                  key={i}
                >
                  <button
                    className="page-link btn"
                    onClick={() => changeCPage(n)}
                  >
                    {n}
                  </button>
                </li>
              ))}
              <li className="page-item">
                <button className="page-link" onClick={nextPage}>
                  <LuChevronsRight />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  function changeCPage(id) {
    setCurrentPage(id);
  }
  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }
};

export default CenterAdUserMgmt;

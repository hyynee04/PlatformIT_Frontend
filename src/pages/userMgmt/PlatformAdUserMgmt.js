import React, { useEffect, useState } from "react";
import {
  LuChevronDown,
  LuFilter,
  LuSearch,
  LuMoreHorizontal,
  LuChevronsLeft,
  LuChevronsRight,
} from "react-icons/lu";
import {
  CenterAdminLevel,
  Role,
  Status,
  UserGender,
} from "../../constants/constants";
import { getAllUser } from "../../services/userService";
import UserOption from "../../components/UserOption";
import FilterUser from "../../components/FilterUser";

import "../../assets/scss/UserMgmt.css";

const PlatformAdUserMgmt = () => {
  const [activeRole, setActiveRole] = useState(Role.centerAdmin);
  const [listUser, setListUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [filterVisble, setFilterVisble] = useState(false);

  const [gender, setGender] = useState(null);
  const [level, setLevel] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const getListUser = async () => {
      try {
        let data = await getAllUser();

        let usersWithRole = data.filter((user) => user.idRole === activeRole);
        setListUser(usersWithRole);
      } catch (error) {}
    };
    getListUser();
  }, [activeRole]);
  const handleRoleClick = (role) => {
    setActiveRole(role);
  };
  const renderGender = (gender) => {
    switch (gender) {
      case UserGender.male:
        return "Male";
      case UserGender.female:
        return "Female";
      case UserGender.other:
        return "Other";
      default:
        return "";
    }
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
        <div className="list-container">
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Full Name</th>
                <th>Gender</th>
                <th>Email</th>
                {activeRole !== Role.student && <th>Affiliated Center</th>}
                {activeRole === Role.centerAdmin && <th>Level</th>}
                <th>Date Joined</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {records.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.fullName}</td>
                  <td>{renderGender(user.gender)}</td>
                  <td>{user.email}</td>
                  {activeRole !== Role.student && <td>{user.centerName}</td>}
                  {activeRole === Role.centerAdmin && (
                    <td>{user.isMainCenterAdmin ? "Main" : "Mem"}</td>
                  )}
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
                  <td
                    className={`status ${
                      user.status === Status.active
                        ? "active"
                        : user.status === Status.pending
                        ? "pending"
                        : "inactive"
                    }`}
                  >
                    {user.status === Status.active
                      ? "Active"
                      : user.status === Status.pending
                      ? "Pending"
                      : "Inactive"}
                  </td>
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

export default PlatformAdUserMgmt;

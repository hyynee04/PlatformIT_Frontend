import React, { useEffect, useState } from "react";
import {
  LuChevronDown,
  LuFilter,
  LuSearch,
  LuMoreHorizontal,
  LuChevronRight,
  LuChevronLeft,
} from "react-icons/lu";
import {
  CenterAdminLevel,
  CenterStatus,
  Role,
  UserStatus,
  UserGender,
} from "../../constants/constants";
import UserOption from "../../components/option/UserOption";
import FilterUser from "../../components/FilterUser";
import SortByUser from "../../components/SortByUser";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../store/userSlice";
import Spinner from "react-bootstrap/Spinner";

import "../../assets/scss/UserMgmt.css";

const PlatformAdUserMgmt = () => {
  const dispatch = useDispatch();
  const {
    users = [],
    loading,
    error,
  } = useSelector((state) => state.users || {});
  const [activeRole, setActiveRole] = useState(Role.centerAdmin);
  const [listUser, setListUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState({ field: "fullname", order: "asc" });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [filterVisble, setFilterVisble] = useState(false);
  const [sortByVisible, setSortByVisible] = useState(false);

  const [gender, setGender] = useState(null);
  const [level, setLevel] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users && users.length > 0) {
      const usersWithRole = users.filter((user) => user.idRole === activeRole);
      setListUser(usersWithRole);
    }
  }, [users, activeRole]);
  const handleRoleClick = (role) => {
    setActiveRole(role);
    setGender(null);
    setLevel(null);
    setDateRange({ startDate: "", endDate: "" });
    setStatus(null);
    setSearchTerm("");
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
  const handleSortByChange = ({ field, order }) => {
    setSortBy({ field, order });
  };
  const getStatusString = (status) => {
    switch (status) {
      case UserStatus.active:
        return "Active";
      case UserStatus.pending:
        return "Pending";
      case UserStatus.inactive:
        return "Inactive";
      default:
        return "";
    }
  };
  const getRoleDescription = (user) => {
    return user.isMainCenterAdmin !== null
      ? user.isMainCenterAdmin === 1
        ? "Main"
        : "Sub"
      : user.status === UserStatus.inactive
      ? "Rejected"
      : "Pending";
  };

  const filteredUser = listUser
    .filter((user) => {
      const searchTermLower = searchTerm.toLowerCase();
      const roleDescription = String(getRoleDescription(user)).toLowerCase();
      const matchesSearchTerm =
        (user.fullName &&
          user.fullName.toLowerCase().includes(searchTermLower)) ||
        (user.gender &&
          (user.gender === UserGender.female
            ? "Female"
            : user.gender === UserGender.male
            ? "Male"
            : "Other"
          )
            .toLowerCase()
            .includes(searchTermLower)) ||
        (user.email && user.email.toLowerCase().includes(searchTermLower)) ||
        (user.centerName &&
          user.centerName.toLowerCase().includes(searchTermLower)) ||
        (activeRole === Role.centerAdmin &&
          roleDescription.includes(searchTermLower)) ||
        (user.joinedDate &&
          new Date(user.joinedDate)
            .toLocaleDateString("en-US")
            .includes(searchTermLower)) ||
        getStatusString(user.status).toLowerCase().includes(searchTermLower);

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
    })
    .sort((a, b) => {
      let aValue, bValue;

      if (sortBy.field === "fullname") {
        aValue = a.fullName ? a.fullName.toLowerCase() : "";
        bValue = b.fullName ? b.fullName.toLowerCase() : "";
      } else if (sortBy.field === "dateJoined") {
        aValue = new Date(a.joinedDate) || new Date(0);
        bValue = new Date(b.joinedDate) || new Date(0);
      }

      return sortBy.order === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
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
    setFilterVisble(false);
    setSortByVisible(false);
  };
  // if (loading) {
  //   // return <div>Loading...</div>;
  //   return (
  //     <div className="loading-container">
  //       <Spinner animation="border" />;
  //     </div>
  //   );
  // }

  if (error) {
    return <div>Error: {error}</div>;
  }
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
            <div
              className="btn"
              onClick={() => {
                setFilterVisble(!filterVisble);
                setSortByVisible(false);
              }}
            >
              <LuFilter className="icon" />
              <span>Filter</span>
            </div>
            {filterVisble && <FilterUser onFilterChange={handleFilterChange} />}
            <div
              className="btn"
              onClick={() => {
                setSortByVisible(!sortByVisible);
                setFilterVisble(false);
              }}
            >
              <span>Sort by</span>
              <LuChevronDown className="icon" />
            </div>
            {sortByVisible && (
              <SortByUser onSortByChange={handleSortByChange} />
            )}
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
                <th style={{ textAlign: "center" }}>No.</th>
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
                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                  <td>{user.fullName}</td>
                  <td>{renderGender(user.gender)}</td>
                  <td>{user.email}</td>
                  {activeRole !== Role.student && <td>{user.centerName}</td>}
                  {activeRole === Role.centerAdmin && (
                    <td>
                      {user.isMainCenterAdmin !== null
                        ? user.isMainCenterAdmin === 1
                          ? "Main"
                          : "Sub"
                        : user.status === UserStatus.inactive
                        ? "Rejected"
                        : "Pending"}
                    </td>
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
                  <td>
                    <span
                      className={`status ${
                        user.status === UserStatus.active
                          ? "active"
                          : user.status === UserStatus.pending
                          ? "pending"
                          : user.status === UserStatus.inactive ||
                            user.status === UserStatus.locked
                          ? "inactive"
                          : ""
                      }`}
                    >
                      {user.status === UserStatus.active
                        ? "Active"
                        : user.status === UserStatus.pending
                        ? "Pending"
                        : user.status === UserStatus.inactive
                        ? "Inactive"
                        : user.status === UserStatus.locked
                        ? "Locked"
                        : ""}
                    </span>
                  </td>
                  <td className="table-cell" style={{ cursor: "pointer" }}>
                    <LuMoreHorizontal
                      onClick={() => handleMoreIconClick(user.idUser)}
                    />
                    {selectedUserId === user.idUser && (
                      <UserOption
                        className="user-option"
                        idUserSelected={user.idUser}
                        {...(!user.isMainCenterAdmin
                          ? { statusUserSelected: user.status }
                          : {})}
                        onUserInactivated={() => setSelectedUserId(null)}
                        {...(user.centerStatus === CenterStatus.active ||
                        user.idRole === Role.student
                          ? {
                              isReactivatable: true,
                            }
                          : {})}
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
                  <LuChevronLeft />
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
                  <LuChevronRight />
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

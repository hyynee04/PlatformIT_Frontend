import React, { useEffect, useRef, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import {
  LuChevronDown,
  LuFilter,
  LuMoreHorizontal,
  LuSearch,
} from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import FilterUser from "../../components/FilterUser";
import UserOption from "../../components/option/UserOption";
import SortByUser from "../../components/SortByUser";
import {
  CenterStatus,
  Role,
  UserGender,
  UserStatus,
} from "../../constants/constants";
import { fetchAllUsers } from "../../store/userSlice";

import "../../assets/css/UserMgmt.css";
import { formatDate, getPagination } from "../../functions/function";

const PlatformAdUserMgmt = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { users = [], error } = useSelector((state) => state.users || {});
  const [activeRole, setActiveRole] = useState(Role.centerAdmin);
  const [listUser, setListUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState({ field: "fullname", order: "asc" });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const filterButtonRef = useRef(null);
  const [sortByVisible, setSortByVisible] = useState(false);
  const sortByButtonRef = useRef(null);

  const [gender, setGender] = useState(null);
  const [level, setLevel] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [status, setStatus] = useState(null);

  const fetchListUser = async () => {
    setLoading(true);
    try {
      await dispatch(fetchAllUsers());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchListUser();
  }, []);

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
      case UserStatus.locked:
        return "Locked";
      default:
        return "";
    }
  };
  const getRoleDescription = (user) => {
    return user.isMainCenterAdmin !== null
      ? user.isMainCenterAdmin === 1
        ? "Main"
        : "Mem"
      : user.status === UserStatus.inactive
      ? "Rejected"
      : "Pending";
  };

  const filteredUser = listUser
    .filter((user) => {
      const searchTermLower = searchTerm.trim().toLowerCase();
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
          formatDate(user.joinedDate).includes(searchTermLower)) ||
        getStatusString(user.status).toLowerCase().includes(searchTermLower);

      const matchesGender =
        gender === null || gender === undefined || user.gender === gender;

      const matchesLevel =
        level === null ||
        level === undefined ||
        (activeRole === Role.centerAdmin &&
          ((level === "main" && user.isMainCenterAdmin === 1) ||
            (level === "mem" && user.isMainCenterAdmin === 0) ||
            (level === "pending" && user.status === UserStatus.pending) ||
            (level === "rejected" && user.status === UserStatus.inactive)));

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

  const optionBtnRefs = useRef([]);
  const handleMoreIconClick = (idUser) => {
    setSelectedUserId((prevSelectedId) =>
      prevSelectedId === idUser ? null : idUser
    );
  };
  const totalColumns =
    7 +
    (activeRole !== Role.student ? 1 : 0) +
    (activeRole === Role.centerAdmin ? 1 : 0);
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (loading) {
    return (
      <div className="loading-page">
        <ImSpinner2 color="#397979" />
      </div>
    );
  }
  return (
    <>
      <div className="page-list-container">
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
            <button
              ref={filterButtonRef}
              className="btn"
              onClick={(e) => {
                e.stopPropagation();
                setFilterVisible((prev) => !prev);
              }}
            >
              <LuFilter className="icon" />
              <span>Filter</span>
            </button>
            {filterVisible && (
              <FilterUser
                gender={gender}
                level={level}
                dateRange={dateRange}
                status={status}
                onFilterChange={handleFilterChange}
                onClose={() => setFilterVisible(false)}
                filterButtonRef={filterButtonRef}
              />
            )}
            <button
              ref={sortByButtonRef}
              className="btn"
              onClick={(e) => {
                e.stopPropagation();
                setSortByVisible((prev) => !prev);
              }}
            >
              <span>Sort by</span>
              <LuChevronDown className="icon" />
            </button>
            {sortByVisible && (
              <SortByUser
                onSortByChange={handleSortByChange}
                onClose={() => setSortByVisible(false)}
                sortByButtonRef={sortByButtonRef}
              />
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
              {records.length > 0 ? (
                records.map((user, index) => (
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
                            : "Mem"
                          : user.status === UserStatus.inactive
                          ? "Rejected"
                          : "Pending"}
                      </td>
                    )}
                    <td>{user.joinedDate && formatDate(user.joinedDate)}</td>
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
                    <td className="table-cell">
                      <div
                        ref={(el) => (optionBtnRefs.current[index] = el)}
                        onClick={() => {
                          handleMoreIconClick(user.idUser);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <LuMoreHorizontal />
                      </div>

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
                          roleUserSelected={user.idRole}
                          optionBtnRef={() => optionBtnRefs.current[index]}
                          onClose={() => setSelectedUserId(null)}
                        />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={totalColumns} style={{ textAlign: "center" }}>
                    "Currently, there are no items in this list."
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          {getPagination(currentPage, npage).map((n, i) => (
            <button
              key={i}
              className={`page-item ${currentPage === n ? "active" : ""}`}
              onClick={() => changeCPage(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </>
  );
  function changeCPage(id) {
    setCurrentPage(id);
  }
};

export default PlatformAdUserMgmt;

import React, { useEffect, useState } from "react";
import {
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuFilter,
  LuMoreHorizontal,
  LuSearch,
  LuUserPlus,
} from "react-icons/lu";
import { Role, UserStatus } from "../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchListUserOfCenter,
  setActiveRoleUserOfCenter,
} from "../../store/listUserOfCenter";
import UserOption from "../../components/option/UserOption";
import FilterUserOfCenter from "../../components/FilterUserOfCenter";
import SortByUserOfCenter from "../../components/SortByUserOfCenter";
import DiagAddUserForm from "../../components/diag/DiagAddUserForm";

import "../../assets/scss/UserMgmt.css";

const CenterAdUserMgmt = () => {
  const dispatch = useDispatch();
  const {
    listUserOfCenter = [],
    loading,
    error,
  } = useSelector((state) => state.listUserOfCenter || {});

  const activeRole = useSelector((state) => state.listUserOfCenter.activeRole);
  const [listUser, setListUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState({ field: "fullname", order: "asc" });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [filterVisble, setFilterVisble] = useState(false);
  const [sortByVisible, setSortByVisible] = useState(false);

  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [status, setStatus] = useState(null);

  const [isModalAddTeacherOpen, setIsModalAddTeacherOpen] = useState(false);
  const openAddTeacherModal = () => setIsModalAddTeacherOpen(true);
  const closeAddTeacherModal = () => setIsModalAddTeacherOpen(false);

  useEffect(() => {
    dispatch(fetchListUserOfCenter(activeRole));
  }, [dispatch, activeRole]);

  useEffect(() => {
    setListUser(listUserOfCenter);
  }, [listUserOfCenter]);

  const handleRoleClick = (role) => {
    dispatch(setActiveRoleUserOfCenter(role));
  };
  const handleFilterChange = ({ dateRange, status }) => {
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
  const filteredUser = listUser
    .filter((user) => {
      const searchTermLower = searchTerm.toLowerCase();

      const matchesSearchTerm =
        (user.fullName &&
          user.fullName.toLowerCase().includes(searchTermLower)) ||
        (user.phoneNumber &&
          user.phoneNumber.toLowerCase().includes(searchTermLower)) ||
        (user.email && user.email.toLowerCase().includes(searchTermLower)) ||
        (user.joinedDate &&
          new Date(user.joinedDate)
            .toLocaleDateString("en-US")
            .includes(searchTermLower)) ||
        getStatusString(user.status).toLowerCase().includes(searchTermLower);
      user.teachingMajor &&
        user.teachingMajor.toLowerCase().includes(searchTermLower);

      const matchesDateJoined =
        (!dateRange.startDate && !dateRange.endDate) ||
        (user.joinedDate &&
          new Date(user.joinedDate) >= new Date(dateRange.startDate) &&
          new Date(user.joinedDate) <= new Date(dateRange.endDate));

      const matchesStatus =
        status === null || status === undefined || user.status === status;

      return matchesSearchTerm && matchesDateJoined && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;

      if (sortBy.field === "fullname") {
        aValue = a.fullName ? a.fullName.toLowerCase() : "";
        bValue = b.fullName ? b.fullName.toLowerCase() : "";
      } else if (sortBy.field === "phoneNumber") {
        aValue = a.phoneNumber ? a.phoneNumber.toLowerCase() : "";
        bValue = b.phoneNumber ? b.phoneNumber.toLowerCase() : "";
      } else if (sortBy.field === "email") {
        aValue = a.email ? a.email.toLowerCase() : "";
        bValue = b.email ? b.email.toLowerCase() : "";
      } else if (sortBy.field === "dateJoined") {
        aValue = new Date(a.joinedDate) || new Date(0);
        bValue = new Date(b.joinedDate) || new Date(0);
      } else if (sortBy.field === "teachingMajor") {
        aValue = a.teachingMajor ? a.teachingMajor.toLowerCase() : "";
        bValue = b.teachingMajor ? b.teachingMajor.toLowerCase() : "";
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
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
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
            {filterVisble && (
              <FilterUserOfCenter onFilterChange={handleFilterChange} />
            )}
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
              <SortByUserOfCenter onSortByChange={handleSortByChange} />
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
        {activeRole === Role.teacher && (
          <div className="add-btn">
            <div className="btn" onClick={() => openAddTeacherModal()}>
              <LuUserPlus className="icon" />
              <span>Add teacher</span>
            </div>
            <DiagAddUserForm
              isOpen={isModalAddTeacherOpen}
              onClose={closeAddTeacherModal}
              roleAdded={Role.teacher}
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
                {activeRole === Role.teacher && <th>Status</th>}
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
                        );
                        const year = date.getFullYear();

                        return `${month}/${day}/${year}`;
                      })()}
                  </td>
                  {activeRole === Role.teacher && <td>{user.teachingMajor}</td>}
                  {activeRole === Role.teacher && (
                    <td>
                      <span
                        className={`status ${
                          user.status === UserStatus.active
                            ? "active"
                            : user.status === UserStatus.pending
                            ? "pending"
                            : user.status === UserStatus.inactive
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
                          : ""}
                      </span>
                    </td>
                  )}
                  <td className="table-cell" style={{ cursor: "pointer" }}>
                    <LuMoreHorizontal
                      onClick={() => handleMoreIconClick(user.idUser)}
                    />
                    {selectedUserId === user.idUser && (
                      <UserOption
                        className="user-option"
                        idUserSelected={user.idUser}
                        {...(activeRole === Role.teacher && {
                          statusUserSelected: user.status,
                        })}
                        onUserInactivated={() => setSelectedUserId(null)}
                        roleUserSelected={Role.teacher}
                        {...(user.idRole === Role.teacher
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

export default CenterAdUserMgmt;

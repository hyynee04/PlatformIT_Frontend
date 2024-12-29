import React, { useEffect, useRef, useState } from "react";
import {
  LuChevronDown,
  LuFilter,
  LuMoreHorizontal,
  LuSearch,
  LuUserPlus,
} from "react-icons/lu";
import { ImSpinner2 } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import FilterUserOfCenter from "../../components/FilterUserOfCenter";
import SortByUserOfCenter from "../../components/SortByUserOfCenter";
import DiagAddUserForm from "../../components/diag/DiagAddUserForm";
import UserOption from "../../components/option/UserOption";
import { Role, UserStatus } from "../../constants/constants";
import {
  fetchListUserOfCenter,
  setActiveRoleUserOfCenter,
} from "../../store/listUserOfCenter";

import "../../assets/css/UserMgmt.css";
import { getPagination } from "../../functions/function";

const CenterAdUserMgmt = () => {
  const dispatch = useDispatch();
  const { listUserOfCenter = [] } = useSelector(
    (state) => state.listUserOfCenter || {}
  );

  const activeRole = useSelector((state) => state.listUserOfCenter.activeRole);
  const [loading, setLoading] = useState(false);
  const [listUser, setListUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState({ field: "fullname", order: "asc" });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [filterVisble, setFilterVisble] = useState(false);
  const filterButtonRef = useRef(null);
  const [sortByVisible, setSortByVisible] = useState(false);
  const sortByButtonRef = useRef(null);

  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [status, setStatus] = useState(null);

  const [isModalAddTeacherOpen, setIsModalAddTeacherOpen] = useState(false);
  const openAddTeacherModal = () => setIsModalAddTeacherOpen(true);
  const closeAddTeacherModal = () => setIsModalAddTeacherOpen(false);

  useEffect(() => {
    const fectchData = async () => {
      setLoading(true);
      try {
        await dispatch(fetchListUserOfCenter(activeRole));
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };
    fectchData();
  }, [dispatch, activeRole]);

  useEffect(() => {
    setListUser(listUserOfCenter);
  }, [listUserOfCenter]);

  const handleRoleClick = (role) => {
    dispatch(setActiveRoleUserOfCenter(role));
    setDateRange({ startDate: "", endDate: "" });
    setStatus(null);
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

  const handleMoreIconClick = (idUser) => {
    setSelectedUserId((prevSelectedId) =>
      prevSelectedId === idUser ? null : idUser
    );
  };
  const totalColumns = 6 + (activeRole === Role.teacher ? 2 : 0);
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
              onClick={() => {
                setFilterVisble(!filterVisble);
                setSortByVisible(false);
              }}
            >
              <LuFilter className="icon" />
              <span>Filter</span>
            </button>
            {filterVisble && (
              <FilterUserOfCenter
                dateRange={dateRange}
                status={status}
                onFilterChange={handleFilterChange}
                onClose={() => setFilterVisble(false)}
                filterButtonRef={filterButtonRef}
              />
            )}
            <button
              ref={sortByButtonRef}
              className="btn"
              onClick={() => {
                setSortByVisible(!sortByVisible);
                setFilterVisble(false);
              }}
            >
              <span>Sort by</span>
              <LuChevronDown className="icon" />
            </button>
            {sortByVisible && (
              <SortByUserOfCenter
                onSortByChange={handleSortByChange}
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
        {activeRole === Role.teacher && (
          <div className="add-btn">
            <button className="btn" onClick={() => openAddTeacherModal()}>
              <LuUserPlus className="icon" />
              <span>Add teacher</span>
            </button>
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
              {records.length > 0 ? (
                records.map((user, index) => (
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
                    {activeRole === Role.teacher && (
                      <td>{user.teachingMajor}</td>
                    )}
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

export default CenterAdUserMgmt;

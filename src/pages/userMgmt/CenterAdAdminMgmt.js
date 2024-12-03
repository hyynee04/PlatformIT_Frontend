import React, { useEffect, useState } from "react";
import { Role, UserStatus } from "../../constants/constants";
import { fetchListUserOfCenter } from "../../store/listUserOfCenter";
import { useDispatch, useSelector } from "react-redux";
import {
  LuChevronDown,
  LuFilter,
  LuSearch,
  LuMoreHorizontal,
  LuChevronLeft,
  LuChevronRight,
  LuUserPlus,
} from "react-icons/lu";
import { ImSpinner2 } from "react-icons/im";
import SortByUserOfCenter from "../../components/SortByUserOfCenter";
import FilterUserOfCenter from "../../components/FilterUserOfCenter";
import DiagAddUserForm from "../../components/diag/DiagAddUserForm";
import UserOption from "../../components/option/UserOption";

const CenterAdAdminMgmt = () => {
  const idUser = +localStorage.getItem("idUser");
  const dispatch = useDispatch();
  const { listUserOfCenter = [] } = useSelector(
    (state) => state.listUserOfCenter || {}
  );
  const [loading, setLoading] = useState(false);
  const [listUser, setListUser] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState({
    field: "isMainCenterAdmin",
    order: "desc",
  });
  const [filterVisble, setFilterVisble] = useState(false);
  const [sortByVisible, setSortByVisible] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [status, setStatus] = useState(null);

  const [isModalAddAdminOpen, setIsModalAddAdminOpen] = useState(false);
  const openAddAdminModal = () => setIsModalAddAdminOpen(true);
  const closeAddAdminModal = () => setIsModalAddAdminOpen(false);

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
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await dispatch(fetchListUserOfCenter(Role.centerAdmin));
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    setListUser(listUserOfCenter);
  }, [listUserOfCenter]);

  const filteredUser = listUser
    .filter((user) => {
      const searchTermLower = searchTerm.toLowerCase();

      const matchesSearchTerm =
        (user.fullName &&
          user.fullName.toLowerCase().includes(searchTermLower)) ||
        (user.email && user.email.toLowerCase().includes(searchTermLower)) ||
        (user.centerName &&
          user.centerName.toLowerCase().includes(searchTermLower)) ||
        (user.joinedDate &&
          new Date(user.joinedDate)
            .toLocaleDateString("en-US")
            .includes(searchTermLower)) ||
        getStatusString(user.status).toLowerCase().includes(searchTermLower);

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
      if (a.isMainCenterAdmin && !b.isMainCenterAdmin) {
        return -1;
      }
      if (!a.isMainCenterAdmin && b.isMainCenterAdmin) {
        return 1;
      }
      if (a.idUser === idUser && b.idUser !== idUser) {
        return -1;
      }
      if (a.idUser !== idUser && b.idUser === idUser) {
        return 1;
      }
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
      }

      return sortBy.order === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
    });

  const handleFilterChange = ({ dateRange, status }) => {
    setDateRange(dateRange);
    setStatus(status);
  };

  const handleSortByChange = ({ field, order }) => {
    setSortBy({ field, order });
  };
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 30;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredUser.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredUser.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const isCurrentUserMainAdmin = records.some(
    (user) => user.idUser === idUser && user.isMainCenterAdmin
  );
  const handleMoreIconClick = (idUser) => {
    setSelectedUserId((prevSelectedId) =>
      prevSelectedId === idUser ? null : idUser
    );
  };

  if (loading) {
    return (
      <div className="loading-page">
        <ImSpinner2 color="#397979" />
      </div>
    );
  }
  return (
    <div>
      <div className="admin-info">
        <div className="title-info">
          <b>Admin Management</b>
        </div>
        <div className="page-list-container">
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
                <SortByUserOfCenter
                  onSortByChange={handleSortByChange}
                  sortCenterAdmin={true}
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
          {isCurrentUserMainAdmin && (
            <div className="add-btn">
              <div className="btn" onClick={() => openAddAdminModal()}>
                <LuUserPlus className="icon" />
                <span>Add admin</span>
              </div>
              <DiagAddUserForm
                isOpen={isModalAddAdminOpen}
                onClose={closeAddAdminModal}
                roleAdded={Role.centerAdmin}
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
                  <th>Admin Level</th>
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
                    <td>{user.phoneNumber}</td>
                    <td>{user.email}</td>
                    <td>{user.isMainCenterAdmin ? "Main" : "Sub"}</td>
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
                    <td className="table-cell" style={{ cursor: "pointer" }}>
                      {user.idUser !== idUser && (
                        <LuMoreHorizontal
                          onClick={() => handleMoreIconClick(user.idUser)}
                        />
                      )}
                      {selectedUserId === user.idUser && (
                        <UserOption
                          className="user-option"
                          idUserSelected={user.idUser}
                          onUserInactivated={() => setSelectedUserId(null)}
                          roleUserSelected={Role.centerAdmin}
                          // statusUserSelected={user.status}
                          {...(isCurrentUserMainAdmin && {
                            statusUserSelected: user.status,
                            isReactivatable: true,
                          })}
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
      </div>
    </div>
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

export default CenterAdAdminMgmt;

import React, { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import {
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuFilter,
  LuMoreHorizontal,
  LuSearch,
} from "react-icons/lu";
import DiagActionCenterForm from "../../components/diag/DiagActionCenterForm";
import FilterCenter from "../../components/FilterCenter";
import CenterOption from "../../components/option/CenterOption";
import SortByCenter from "../../components/SortByCenter";
import { CenterStatus } from "../../constants/constants";

import { useDispatch, useSelector } from "react-redux";
import "../../assets/css/UserMgmt.css";
import {
  fetchCenters,
  setActiveStatusCenter,
} from "../../store/listCenterSlice";

const PlatformAdCenterMgmt = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { centers = [] } = useSelector((state) => state.centers || {});

  const activeStatusCenter = useSelector(
    (state) => state.centers.activeStatusCenter
  );

  const [listCenter, setListCenter] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState({ field: "name", order: "asc" });
  const [filterVisble, setFilterVisble] = useState(false);
  const [sortByVisible, setSortByVisible] = useState(false);
  const [selectedCenterId, setSelectedCenterId] = useState(null);
  const [approvedCenterId, setApprovedCenterId] = useState(null);
  const [rejectedCenterId, setRejectedCenterId] = useState(null);
  const [isModalActionOpen, setIsModalActionOpen] = useState(false);

  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  const fetchListCenter = async () => {
    setLoading(true);
    try {
      await dispatch(fetchCenters(activeStatusCenter));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };
  useEffect(() => {
    fetchListCenter();
  }, [activeStatusCenter]);

  useEffect(() => {
    setListCenter(centers);
  }, [centers]);
  const filteredCenters = listCenter
    .filter((center) => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchedSearchTerm =
        (center.centerAdminName &&
          center.centerAdminName.toLowerCase().includes(searchTermLower)) ||
        (center.centerName &&
          center.centerName.toLowerCase().includes(searchTermLower)) ||
        (center.centerAdminEmail &&
          center.centerAdminEmail.toLowerCase().includes(searchTermLower)) ||
        (center.centerEmail &&
          center.centerEmail.toLowerCase().includes(searchTermLower)) ||
        (center.tin && center.tin.toLowerCase().includes(searchTermLower)) ||
        (center.submissionDate &&
          new Date(center.submissionDate)
            .toLocaleDateString("en-US")
            .includes(searchTermLower)) ||
        (center.establishedDate &&
          new Date(center.establishedDate)
            .toLocaleDateString("en-US")
            .includes(searchTermLower));
      const matchedDate =
        (!dateRange.startDate && !dateRange.endDate) || // Nếu không có khoảng thời gian được chọn
        (center.submissionDate &&
          new Date(center.submissionDate) >= new Date(dateRange.startDate) &&
          new Date(center.submissionDate) <= new Date(dateRange.endDate)) || // Kiểm tra submissionDate
        (center.establishedDate &&
          new Date(center.establishedDate) >= new Date(dateRange.startDate) &&
          new Date(center.establishedDate) <= new Date(dateRange.endDate));
      return matchedSearchTerm && matchedDate;
    })
    .sort((a, b) => {
      let aValue, bValue;

      if (sortBy.field === "name") {
        if (activeStatusCenter === CenterStatus.pending) {
          aValue = a.centerAdminName ? a.centerAdminName.toLowerCase() : "";
          bValue = b.centerAdminName ? b.centerAdminName.toLowerCase() : "";
        } else {
          aValue = a.centerName ? a.centerName.toLowerCase() : "";
          bValue = b.centerName ? b.centerName.toLowerCase() : "";
        }
      } else if (sortBy.field === "email") {
        if (activeStatusCenter === CenterStatus.pending) {
          aValue = a.centerAdminEmail ? a.centerAdminEmail.toLowerCase() : "";
          bValue = b.centerAdminEmail ? b.centerAdminEmail.toLowerCase() : "";
        } else {
          aValue = a.centerEmail ? a.centerEmail.toLowerCase() : "";
          bValue = b.centerEmail ? b.centerEmail.toLowerCase() : "";
        }
      } else if (sortBy.field === "tin") {
        aValue = a.tin ? a.tin.toLowerCase() : "";
        bValue = b.tin ? b.tin.toLowerCase() : "";
      } else if (sortBy.field === "date") {
        if (activeStatusCenter === CenterStatus.pending) {
          aValue = new Date(a.submissionDate) || new Date(0);
          bValue = new Date(b.submissionDate) || new Date(0);
        } else {
          aValue = new Date(a.establishedDate) || new Date(0);
          bValue = new Date(b.establishedDate) || new Date(0);
        }
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
  const records = filteredCenters.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredCenters.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const handleStatusCenterClick = (centerStatus) => {
    dispatch(setActiveStatusCenter(centerStatus));
  };

  const handleFilterChange = ({ dateRange }) => {
    setDateRange(dateRange);
  };
  const handleSortByChange = ({ field, order }) => {
    setSortBy({ field, order });
  };
  const handleMoreIconClick = (idCenter) => {
    setSelectedCenterId((prevSelectedId) =>
      prevSelectedId === idCenter ? null : idCenter
    );
  };

  const handleApproveCenter = (idCenter) => {
    setApprovedCenterId((prevSelectedId) =>
      prevSelectedId === idCenter ? null : idCenter
    );
    setRejectedCenterId(null);
  };
  const handleRejectCenter = (idCenter) => {
    setRejectedCenterId((prevSelectedId) =>
      prevSelectedId === idCenter ? null : idCenter
    );
    setApprovedCenterId(null);
  };
  const openActionModal = () => setIsModalActionOpen(true);
  const closeActionModal = () => setIsModalActionOpen(false);

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
            className={`role-btn ${activeStatusCenter === CenterStatus.active ? "active" : ""
              }`}
            onClick={() => handleStatusCenterClick(CenterStatus.active)}
          >
            Approval
          </button>
          <button
            className={`role-btn ${activeStatusCenter === CenterStatus.pending ? "active" : ""
              }`}
            onClick={() => handleStatusCenterClick(CenterStatus.pending)}
          >
            Pending Approval
          </button>
          <button
            className={`role-btn ${activeStatusCenter === CenterStatus.inactive ? "active" : ""
              }`}
            onClick={() => handleStatusCenterClick(CenterStatus.inactive)}
          >
            Inactive
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
              <FilterCenter onFilterChange={handleFilterChange} />
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
              <SortByCenter onSortByChange={handleSortByChange} />
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
          {activeStatusCenter === CenterStatus.pending ? (
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>No.</th>
                  <th>Center Admin Name</th>
                  <th>Center Admin Email</th>
                  <th>TIN</th>
                  <th>Description</th>
                  <th>Submission Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {records.map((center, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                    <td>{center.centerAdminName}</td>
                    <td>{center.centerAdminEmail}</td>
                    <td>{center.tin}</td>
                    <td>{center.description}</td>
                    <td>
                      {center.submissionDate &&
                        (() => {
                          const date = new Date(center.submissionDate);
                          const day = String(date.getDate()).padStart(2, "0");
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            "0"
                          );
                          const year = date.getFullYear();
                          return `${month}/${day}/${year}`;
                        })()}
                    </td>
                    <td
                      className={`table-cell ${activeStatusCenter === CenterStatus.pending
                          ? "pending"
                          : ""
                        }`}
                      style={{ cursor: "pointer" }}
                    >
                      <button
                        className="btn approve"
                        onClick={() => {
                          handleApproveCenter(center.idCenter);
                          openActionModal();
                        }}
                      >
                        Approve
                      </button>
                      {approvedCenterId === center.idCenter && (
                        <DiagActionCenterForm
                          isOpen={isModalActionOpen}
                          onClose={closeActionModal}
                          idCenterSelected={center.idCenter}
                          activeStatus={activeStatusCenter}
                          isApproveAction={true}
                        />
                      )}
                      <button
                        className="btn reject"
                        onClick={() => {
                          handleRejectCenter(center.idCenter);
                          openActionModal();
                        }}
                      >
                        Reject
                      </button>
                      {rejectedCenterId === center.idCenter && (
                        <DiagActionCenterForm
                          isOpen={isModalActionOpen}
                          onClose={closeActionModal}
                          idCenterSelected={center.idCenter}
                          activeStatus={activeStatusCenter}
                          isApproveAction={false}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>No.</th>
                  <th>Center Name</th>
                  <th>Center Email</th>
                  {/* <th>Center Admin Name</th> */}
                  <th>Center Admin Email</th>
                  <th>TIN</th>
                  <th>Established Date</th>
                  {/* <th>Status</th> */}
                  {activeStatusCenter === CenterStatus.inactive && (
                    <th>Reason Inactive</th>
                  )}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let count = 0; // Khởi tạo biến đếm bên ngoài map
                  return records.map((center, index) => {
                    const shouldDisplay =
                      (activeStatusCenter === CenterStatus.active &&
                        center.centerStatus === CenterStatus.active) ||
                      (activeStatusCenter === CenterStatus.inactive &&
                        (center.centerStatus === CenterStatus.inactive ||
                          center.centerStatus === CenterStatus.locked));
                    if (shouldDisplay) {
                      count++; // Tăng biến đếm khi hiển thị dòng
                      return (
                        <React.Fragment key={index}>
                          <tr>
                            <td style={{ textAlign: "center" }}>{count}</td>
                            <td>{center.centerName}</td>
                            <td>{center.centerEmail}</td>
                            {/* <td>{center.centerAdminName}</td> */}
                            <td>{center.centerAdminEmail}</td>
                            <td>{center.tin}</td>
                            <td>
                              {center.establishedDate &&
                                (() => {
                                  const date = new Date(center.submissionDate);
                                  const day = String(date.getDate()).padStart(
                                    2,
                                    "0"
                                  );
                                  const month = String(
                                    date.getMonth() + 1
                                  ).padStart(2, "0");
                                  const year = date.getFullYear();
                                  return `${month}/${day}/${year}`;
                                })()}
                            </td>
                            {activeStatusCenter === CenterStatus.inactive && (
                              <td
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                                title={center.reason}
                              >
                                {center.reason
                                  ? center.reason
                                  : center.centerStatus === CenterStatus.locked
                                    ? "Locked"
                                    : ""}
                              </td>
                            )}
                            <td
                              className={`table-cell ${center.centerStatus === CenterStatus.pending
                                  ? "pending"
                                  : ""
                                }`}
                              style={{ cursor: "pointer" }}
                            >
                              <LuMoreHorizontal
                                onClick={() =>
                                  handleMoreIconClick(center.idCenter)
                                }
                              />
                              {selectedCenterId === center.idCenter && (
                                <CenterOption
                                  className="user-option"
                                  idCenterSelected={center.idCenter}
                                  statusCenterSelected={center.centerStatus}
                                  {...(center.centerStatus ===
                                    CenterStatus.locked && {
                                    isReactivatable: true,
                                  })}
                                  onCenterOption={() =>
                                    setSelectedCenterId(null)
                                  }
                                />
                              )}
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    }
                    return null;
                  });
                })()}
              </tbody>
            </table>
          )}
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

export default PlatformAdCenterMgmt;

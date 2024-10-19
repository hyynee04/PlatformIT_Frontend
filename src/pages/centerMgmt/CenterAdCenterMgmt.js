import React, { useState } from "react";
import {
  LuChevronDown,
  LuFilter,
  LuSearch,
  LuMoreHorizontal,
  LuChevronsLeft,
  LuChevronsRight,
  LuUserPlus,
  LuTrash2,
  LuCheck,
  LuLock,
} from "react-icons/lu";
import { Status } from "../../constants/constants";
import UserOption from "../../components/UserOption";
import default_ava from "../../assets/img/default_image.png";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "../../assets/scss/PI.css";

const CenterAdCenterMgmt = () => {
  //Center Infomation
  const [avaImg, setAvaImg] = useState(null);
  const [centerName, setCenterName] = useState(null);
  const [contactNumber, setContactNumber] = useState(null);
  const [dateCreated, setDateCreated] = useState(null);
  const [TIN, setTIN] = useState(null);
  const [centerLinks, setCenterLinks] = useState([
    { idCenterLink: 0, name: "", url: "" },
  ]);
  const [address, setAddress] = useState(null);
  const [email, setEmail] = useState(null);
  const [dateEstablished, setDateEstablished] = useState(null);
  const [description, setDescription] = useState(null);

  //Admin Management
  const [listUser, setListUser] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState({ field: "fullname", order: "asc" });
  const [filterVisble, setFilterVisble] = useState(false);
  const [sortByVisible, setSortByVisible] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [status, setStatus] = useState(null);

  const getStatusString = (status) => {
    switch (status) {
      case Status.active:
        return "Active";
      case Status.pending:
        return "Pending";
      case Status.inactive:
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
      <div className="center-info">
        <div className="title-info">
          <b>Center Infomation</b>
          <div
            className="btn"
            // onClick={() => openAddTeacherModal()}
          >
            <LuLock className="icon" />
            <span>Lock</span>
          </div>
        </div>
        <div className="container-pi">
          <div className="container-ava">
            <div className="sub-container-ava">
              <img
                src={avaImg ? avaImg : default_ava}
                alt=""
                className="main-center-image"
              />
            </div>
          </div>
          <div className="container-specialized">
            <div className="container-info">
              <div className="container-field">
                <div className="container-left">
                  <div className="info">
                    <span>Center Name</span>
                    <input
                      type="text"
                      className="input-form-pi"
                      value={centerName || ""}
                      onChange={(e) => setCenterName(e.target.value)}
                    />
                  </div>
                  <div className="info">
                    <span>Contact Number</span>
                    <input
                      type="text"
                      className="input-form-pi"
                      value={contactNumber || ""}
                      onChange={(e) => setContactNumber(e.target.value)}
                    />
                  </div>
                  <div className="info">
                    <span>Date Created</span>
                    <input
                      type="date"
                      className="input-form-pi"
                      value={dateCreated}
                      onChange={(e) => setDateCreated(e.target.value)}
                    />
                  </div>
                  <div className="info">
                    <span>Tax Identification Number (TIN)</span>
                    <input
                      type="text"
                      className="input-form-pi"
                      value={TIN || ""}
                      onChange={(e) => setTIN(e.target.value)}
                      disabled
                    />
                  </div>
                  <div className="info">
                    <span>Social/Website Center Links</span>
                    {centerLinks.some(
                      (profile) => profile.name && profile.url
                    ) &&
                      centerLinks.map((profile, index) => (
                        <div className="container-link" key={index}>
                          <InputGroup className="mb-3">
                            <input
                              type="text"
                              value={profile.name}
                              className="title-link"
                              readOnly
                            />
                            <Form.Control
                              placeholder="Link"
                              className="main-link"
                              value={profile.url}
                              readOnly
                            />
                          </InputGroup>
                          <div
                            className="icon-button"
                            onClick={() => {
                              //   removeProfileLinks(profile.idProfileLink, index);
                            }}
                          >
                            <LuTrash2 className="icon" />
                          </div>
                        </div>
                      ))}
                    <div className="container-link">
                      <InputGroup className="mb-3">
                        <select
                          //   onChange={handleNameProfileLinkChange}
                          className="title-link"
                        >
                          <option value="" className="option-link">
                            Select type
                          </option>
                          <option value="Github" className="option-link">
                            Github
                          </option>
                          <option value="LinkedIn" className="option-link">
                            LinkedIn
                          </option>
                          <option value="Portfolio" className="option-link">
                            Portfolio
                          </option>
                          <option value="Youtube" className="option-link">
                            Youtube
                          </option>
                          <option value="Facebook" className="option-link">
                            Facebook
                          </option>
                        </select>
                        <Form.Control
                          placeholder="Link"
                          className="main-link"
                          //   value={newProfileLink.url}
                          //   onChange={handleURLProfileLinkChange}
                        />
                      </InputGroup>
                      <div
                        className="icon-button"
                        //   onClick={addProfileLink}
                      >
                        <LuCheck className="icon" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="container-gap"></div>
                <div className="container-right">
                  <div className="info">
                    <span>Address</span>
                    <input
                      type="text"
                      className="input-form-pi"
                      value={address || ""}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="info">
                    <span>Email</span>
                    <input
                      type="text"
                      className="input-form-pi"
                      value={email || ""}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="info">
                    <span>Date Established</span>
                    <input
                      type="date"
                      className="input-form-pi"
                      value={dateEstablished}
                      onChange={(e) => setDateEstablished(e.target.value)}
                    />
                  </div>
                  <div className="info">
                    <span>Description</span>
                    <Form.Control
                      as="textarea"
                      className="input-area-form-pi"
                      value={description || ""}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="container-button">
                <button className="change-pass">Add Working Hours</button>
                <button
                  className="save-change"
                  onClick={() => {
                    // updateBasicInfo();
                  }}
                >
                  Save change
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="admin-info">
        <div className="title-info">
          <b>Admin Management</b>
        </div>
        <div className="page-user-container">
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
              {/* {filterVisble && (
                <FilterUser onFilterChange={handleFilterChange} />
              )} */}
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
              {/* {sortByVisible && (
                <SortByUser onSortByChange={handleSortByChange} />
              )} */}
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
          <div className="add-btn">
            <div
              className="btn"
              // onClick={() => openAddTeacherModal()}
            >
              <LuUserPlus className="icon" />
              <span>Add admin</span>
            </div>
            {/* <DiagAddTeacherForm
              isOpen={isModalAddTeacherOpen}
              onClose={closeAddTeacherModal}
            /> */}
          </div>
          <div className="list-container">
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Full Name</th>
                  <th>Phone Number</th>
                  <th>Email</th>
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
                    <td>{user.phoneNum}</td>
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
                    <td
                      className={`status ${
                        user.status === Status.active
                          ? "active"
                          : user.status === Status.pending
                          ? "pending"
                          : user.status === Status.inactive
                          ? "inactive"
                          : ""
                      }`}
                    >
                      {user.status === Status.active
                        ? "Active"
                        : user.status === Status.pending
                        ? "Pending"
                        : user.status === Status.inactive
                        ? "Inactive"
                        : ""}
                    </td>
                    <td className="table-cell" style={{ cursor: "pointer" }}>
                      <LuMoreHorizontal
                        onClick={() => handleMoreIconClick(user.idUser)}
                      />
                      {selectedUserId === user.idUser && (
                        <UserOption
                          className="user-option"
                          idUserSelected={user.idUser}
                          statusUserSelected={user.status}
                          onUserInactivated={() => setSelectedUserId(null)}
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

export default CenterAdCenterMgmt;

import React, { useEffect, useState } from "react";
import {
  LuChevronDown,
  LuFilter,
  LuSearch,
  LuMoreHorizontal,
} from "react-icons/lu";
import "../../assets/scss/UserMgmt.css";
import { CenterStatus, Status } from "../../constants/constants";
import { getAllCenter, getPendingCenter } from "../../services/centerService";
import UserOption from "../../components/UserOption";
import DiagApproveCenterForm from "../../components/DiagApproveCenterForm";

const PlatformAdCenterMgmt = () => {
  const [activeStatusCenter, setActiveCenterStatus] = useState(
    CenterStatus.active
  );
  const [listCenter, setListCenter] = useState([]);
  const [selectedCenterId, setSelectedCenterId] = useState(null);

  // const [rejectedCenterId, setRejectedCenterId] = useState(null);

  useEffect(() => {
    const getListCenter = async () => {
      try {
        let data;
        if (activeStatusCenter === Status.active) {
          const respone = await getAllCenter();
          data = respone;
        } else if (activeStatusCenter === Status.pending) {
          const respone = await getPendingCenter();
          data = respone;
        }
        console.log("data", data);
        let centersWithStatus = data.filter(
          (center) => center.centerStatus === activeStatusCenter
        );

        setListCenter(centersWithStatus);
      } catch (error) {}
    };
    getListCenter();
  }, [activeStatusCenter]);

  const handleStatusCenterClick = (centerStatus) => {
    setActiveCenterStatus(centerStatus);
  };
  const handleMoreIconClick = (idCenter) => {
    setSelectedCenterId((prevSelectedId) =>
      prevSelectedId === idCenter ? null : idCenter
    );
  };

  //Approve center
  const [approvedCenterId, setApprovedCenterId] = useState(null);
  const handleApproveCenter = (idCenter) => {
    setApprovedCenterId((prevSelectedId) =>
      prevSelectedId === idCenter ? null : idCenter
    );
  };
  const [isModalApproveOpen, setIsModalApproveOpen] = useState(false);
  const openApproveModal = () => setIsModalApproveOpen(true);
  const closeApproveModal = () => setIsModalApproveOpen(false);
  return (
    <>
      <div className="page-user-container">
        <div className="role-users-group">
          <button
            className={`role-btn ${
              activeStatusCenter === CenterStatus.active ? "active" : ""
            }`}
            onClick={() => handleStatusCenterClick(CenterStatus.active)}
          >
            Approval
          </button>
          <button
            className={`role-btn ${
              activeStatusCenter === CenterStatus.pending ? "active" : ""
            }`}
            onClick={() => handleStatusCenterClick(CenterStatus.pending)}
          >
            Pending Approval
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
                <th>
                  {activeStatusCenter === CenterStatus.active
                    ? "Center Name"
                    : "Center Admin Name"}
                </th>
                <th>
                  {activeStatusCenter === CenterStatus.active
                    ? "Center Email"
                    : "Center Admin Email"}
                </th>
                <th>TIN</th>
                <th>
                  {activeStatusCenter === CenterStatus.active
                    ? "Date Created"
                    : "Submission Date"}
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {listCenter.map((center, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    {activeStatusCenter === CenterStatus.active
                      ? center.centerName
                      : center.centerAdminName}
                  </td>
                  <td>
                    {activeStatusCenter === CenterStatus.active
                      ? center.centerEmail
                      : center.centerAdminEmail}
                  </td>
                  <td>{center.tin}</td>
                  <td>
                    {center.submissionDate &&
                      (() => {
                        const date = new Date(center.submissionDate);
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
                    className={`table-cell ${
                      activeStatusCenter === CenterStatus.pending
                        ? "pending"
                        : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    {activeStatusCenter === CenterStatus.active ? (
                      <>
                        <LuMoreHorizontal
                          onClick={() => handleMoreIconClick(center.idCenter)}
                        />
                        {selectedCenterId === center.idCenter && (
                          <UserOption
                            className="user-option"
                            idUserSelected={center.idCenter}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        <button
                          className="btn approve"
                          onClick={() => {
                            handleApproveCenter(center.idCenter);
                            openApproveModal();
                          }}
                        >
                          Approve
                        </button>
                        {approvedCenterId === center.idCenter && (
                          <DiagApproveCenterForm
                            isOpen={isModalApproveOpen}
                            onClose={closeApproveModal}
                            idCenterSelected={center.idCenter}
                          />
                        )}
                        <button className="btn reject">Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PlatformAdCenterMgmt;

import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { LuCheck, LuX } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import { convertToVietnamTime, formatDateTime } from "../functions/function";

const TransactionResponse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Parse the query parameters from location.search
  const queryParams = new URLSearchParams(location.search);

  const isSuccess = +queryParams.get("IsSuccess");
  console.log(isSuccess);

  const encodedName = queryParams.get("SenderName");
  const senderName = decodeURIComponent(encodedName);

  const encodedTime = queryParams.get("TransactionTime");
  const TransactionTime = decodeURIComponent(encodedTime);
  const TransactionNo = queryParams.get("TransactionNo");
  const Amount = queryParams.get("Amount");

  console.log("isSuccess: ", isSuccess, typeof isSuccess);

  return (
    <div className="transacton-response-page">
      <div className="body">
        <div class="concentric-circles">
          <div
            class="circle outer-circle"
            style={{
              backgroundColor:
                isSuccess === 0
                  ? "rgba(192, 15, 12, 0.1)"
                  : "rgba(20, 174, 92, 0.1)",
            }}
          >
            <div
              class="circle middle-circle"
              style={{
                backgroundColor:
                  isSuccess === 0
                    ? "rgba(192, 15, 12, 0.2)"
                    : "rgba(20, 174, 92, 0.2)",
              }}
            >
              <div
                class="circle inner-circle"
                style={{
                  backgroundColor:
                    isSuccess === 0
                      ? "rgba(192, 15, 12, 0.3)"
                      : "rgba(20, 174, 92, 0.3)",
                }}
              >
                <div
                  class="circle center-circle"
                  style={{
                    backgroundColor:
                      isSuccess === 0
                        ? "rgba(192, 15, 12, 1)"
                        : "rgba(20, 174, 92, 1)",
                  }}
                >
                  {isSuccess === 0 ? <LuX /> : <LuCheck />}
                </div>
              </div>
            </div>
          </div>
          <label>
            {isSuccess === 0
              ? "Something went wrong..."
              : "Transaction Successful"}
          </label>
        </div>
        <div className="info-box">
          <div className="transaction-info after-line">
            <div className="info-field">
              <label>Sender name</label>
              <span title={senderName}>{senderName}</span>
            </div>
            <div className="info-field">
              <label>Transaction time</label>
              <span>
                {isSuccess === 0 ? "" : convertToVietnamTime(TransactionTime)}
              </span>
            </div>
            <div className="info-field">
              <label>Transaction number</label>
              <span>{isSuccess === 0 ? "" : TransactionNo}</span>
            </div>
          </div>
          <div className="transaction-info">
            <div className="info-field">
              <label>Amount</label>
              <span>
                {Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                <span className="currency">đ</span>
              </span>
            </div>
          </div>
        </div>

        <div className="button-back-container">
          <button
            className="home-page"
            onClick={() => navigate("/studentHome")}
          >
            <IoIosArrowBack /> Home page
          </button>
          {isSuccess !== 0 ? (
            <button
              className="my-course"
              onClick={() => navigate("/studentCourse")}
            >
              My course <IoIosArrowForward />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default TransactionResponse;

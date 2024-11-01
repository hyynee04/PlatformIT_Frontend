import React from "react";
import { LuInfo } from "react-icons/lu";
const PendingApproveCenter = () => {
  return (
    <div
      className="modal-container"
      style={{ justifySelf: "center", margin: "50px" }}
    >
      <div className="diag-header">
        <div className="container-title">
          <LuInfo className="diag-icon" />
          <span className="diag-title">Notification</span>
        </div>
      </div>
      <div className="diag-body">
        <h5
          style={{
            marginBottom: "8px",
          }}
        >
          Welcome to <strong>Plait</strong>!
        </h5>
        <p
          style={{
            maxWidth: "500px",
            lineHeight: "1.5",
            margin: "16px 0",
            textAlign: "justify",
          }}
        >
          Your registration for the center is currently under review. Our team
          is carefully processing your request to ensure all details meet our
          standards. This review process typically takes a few business days,
          and we will notify you via your registered email once it’s complete.
        </p>
        <p
          style={{
            maxWidth: "500px",
            lineHeight: "1.5",
            margin: "16px 0",
            textAlign: "justify",
          }}
        >
          We appreciate your patience and are excited to support your center
          once approval is finalized. If you have any questions or require
          further assistance, please feel free to reach out to our support team
          at{" "}
          <a href="mailto:plaitplatform@gmail.com">plaitplatform@gmail.com</a>.
        </p>
        <div>
          <strong>Thank you for choosing Plait!</strong>
        </div>
      </div>
    </div>
  );
};

export default PendingApproveCenter;

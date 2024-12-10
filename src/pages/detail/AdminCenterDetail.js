import "../../assets/css/Detail.css";
import { BsGenderTrans } from "react-icons/bs";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { LuGlobe2, LuMail, LuPhone } from "react-icons/lu";
import default_ava from "../../assets/img/default_ava.png";
import default_image from "../../assets/img/default_image.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPI } from "../../services/userService";
import { APIStatus } from "../../constants/constants";
import { ImSpinner2 } from "react-icons/im";
import { formatDate } from "../../functions/function";

const AdminCenterDetail = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const [adminInfo, setAdminInfo] = useState({});

  const fetchadminPI = async (idUser) => {
    setLoading(true);
    try {
      let response = await getPI(idUser);
      if (response.status === APIStatus.success) {
        setAdminInfo(response.data);
      } else console.warn(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const state = location.state;
    if (state && state.idUser) {
      fetchadminPI(state.idUser);
    }
  }, [location.state]);

  console.log(adminInfo);
  if (loading) {
    return (
      <div className="loading-page">
        <ImSpinner2 color="#397979" />
      </div>
    ); // Show loading while waiting for API response
  }
  return (
    <div className="detail-container">
      <div className="left-container" style={{ width: "40%" }}>
        <div className="block-container">
          <img
            className="biography-ava teacher"
            src={adminInfo.avatar || default_ava}
            alt="avatar"
          />
          <div className="biography-block">
            <span className="biography-name">{adminInfo.fullName}</span>
          </div>
        </div>
      </div>
      <div className="right-container" style={{ width: "60%" }}>
        <div className="block-container-admincenter">
          {/* <span className="block-container-title">Information</span> */}
          <div
            className="block-container-col"
            style={{ gap: "1rem", width: "50%" }}
          >
            <div className="info-line">
              <LuMail />
              <span>{adminInfo.email || "(Email)"}</span>
            </div>
            <div className="info-line">
              <LuPhone />
              <span>
                {adminInfo.phoneNumber?.replace(
                  /(\d{4})(\d{3})(\d{3})/,
                  "$1 $2 $3"
                ) || "(Phone number)"}
              </span>
            </div>
            <div className="info-line">
              <BsGenderTrans />
              <span>{adminInfo.gender || "(Gender)"}</span>
            </div>
            <div className="info-line">
              <LiaBirthdayCakeSolid />
              <span>
                {adminInfo.dob ? formatDate(adminInfo.dob) : "(Birthday)"}
              </span>
            </div>
            <div className="info-line">
              <LuGlobe2 />
              <span>{adminInfo.nationality || "(Nationality)"}</span>
            </div>
          </div>
          <div className="center-of-admincenter-container">
            <div className="center-of-admincenter">
              <div className="center-ava-container">
                <img src={default_image} alt="center" />
              </div>
              <div className="center-infomation">
                <span className="center-name">{adminInfo.centerName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCenterDetail;

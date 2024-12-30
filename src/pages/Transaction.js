import { useEffect, useRef, useState } from "react";
import {
  LuArrowRight,
  LuChevronDown,
  LuFilter,
  LuMinus,
  LuPlus,
  LuSearch,
} from "react-icons/lu";
import { TbCurrencyDong } from "react-icons/tb";
import default_ava from "../assets/img/default_ava.png";
import default_image from "../assets/img/default_image.png";
import "../assets/css/Transaction.css";
import { APIStatus, Role } from "../constants/constants";
import {
  getAllPaymentOfCenter,
  getAllPaymentOfStudent,
} from "../services/paymentService";
import { formatDateTime, getPagination } from "../functions/function";
import { useAsyncError, useNavigate } from "react-router-dom";
import { ImSpinner2 } from "react-icons/im";

const Transaction = () => {
  const navigate = useNavigate();
  const idUser = +localStorage.getItem("idUser");
  const idRole = +localStorage.getItem("idRole");
  const idCenter = +localStorage.getItem("idCenter");
  const [loading, setLoading] = useState(false);

  const [activeFilter, setActiveFilter] = useState(false);
  const [activeSortby, setActiveSortby] = useState(false);

  const filterButtonRef = useRef(null);
  const sortButtonRef = useRef(null);
  const filterBoxRef = useRef(null);
  const sortBoxRef = useRef(null);

  const [paymentListBase, setPaymentListBase] = useState([]);
  const [paymentList, setPaymentList] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [sortCondition, setSortCondition] = useState({
    field: "",
    direction: "",
  });
  const [filterCondition, setFilterCondition] = useState({
    startPrice: null,
    endPrice: null,
    startDate: null,
    endDate: null,
  });

  const handleResetSort = () => {
    setSortCondition({
      field: "",
      direction: "",
    });
    setPaymentList(paymentListBase);
  };

  const handleResetFilter = () => {
    setFilterCondition({
      startPrice: null,
      endPrice: null,
      startDate: null,
      endDate: null,
    });
    setPaymentList(paymentListBase);
  };

  const handleChangeData = (content) => {
    const filterByPriceAndDate = (payment) => {
      const priceToCheck = payment.discountedPrice || payment.price;

      // Price filtering
      const isPriceInRange =
        (!parseInt(filterCondition.startPrice) &&
          !parseInt(filterCondition.endPrice)) ||
        (!parseInt(filterCondition.startPrice) &&
          parseInt(filterCondition.endPrice) &&
          priceToCheck <= parseInt(filterCondition.endPrice)) ||
        (parseInt(filterCondition.startPrice) &&
          !parseInt(filterCondition.endPrice) &&
          priceToCheck >= parseInt(filterCondition.startPrice)) ||
        (priceToCheck >= parseInt(filterCondition.startPrice) &&
          priceToCheck <= parseInt(filterCondition.endPrice));

      // Date filtering
      const paymentDate = new Date(payment.paymentDate);
      const startDate = filterCondition.startDate
        ? new Date(filterCondition.startDate)
        : null;
      const endDate = filterCondition.endDate
        ? new Date(filterCondition.endDate)
        : null;

      const isDateInRange =
        (!startDate && !endDate) ||
        (!startDate && endDate && paymentDate <= endDate) ||
        (startDate && !endDate && paymentDate >= startDate) ||
        (startDate &&
          endDate &&
          paymentDate >= startDate &&
          paymentDate <= endDate);

      return isPriceInRange && isDateInRange;
    };

    const sortPayments = (a, b) => {
      if (!sortCondition.field || !sortCondition.direction) return 0;

      const { field, direction } = sortCondition;
      const dirMultiplier = direction === "asc" ? 1 : -1;

      let aValue, bValue;

      if (field === "price") {
        aValue = a.discountedPrice || a.price;
        bValue = b.discountedPrice || b.price;
      } else if (field === "paymentDate") {
        aValue = new Date(a[field]).getTime();
        bValue = new Date(b[field]).getTime();
      } else {
        aValue = a[field];
        bValue = b[field];
      }

      if (aValue < bValue) return -1 * dirMultiplier;
      if (aValue > bValue) return 1 * dirMultiplier;
      return 0;
    };

    const searchPayments = (payment) => {
      const priceToCheck = payment.discountedPrice || payment.price;

      return (
        payment.studentName?.toLowerCase().includes(content?.toLowerCase()) ||
        payment.courseName?.toLowerCase().includes(content?.toLowerCase()) ||
        priceToCheck?.toString().includes(content)
      );
    };

    const filteredList = paymentListBase
      ?.filter(filterByPriceAndDate)
      .sort(sortPayments)
      .filter(searchPayments);

    setPaymentList(filteredList);
  };

  const fetchAllPayment = async () => {
    setLoading(true);
    try {
      let response;
      if (idRole === Role.student) {
        response = await getAllPaymentOfStudent(idUser);
      } else response = await getAllPaymentOfCenter(idCenter);

      if (response.status === APIStatus.success) {
        const sortList = response.data.sort(
          (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
        );
        setPaymentList(sortList);
        setPaymentListBase(sortList);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAllPayment();
  }, []);

  // Pagination
  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  let currentItemsPage = [];
  currentItemsPage = paymentList.slice(
    currentPage * itemsPerPage - itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginationNumbers = getPagination(
    currentPage,
    Math.ceil(paymentList.length / itemsPerPage)
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterBoxRef.current &&
        !filterBoxRef.current.contains(event.target) &&
        (!filterButtonRef.current ||
          (filterButtonRef.current.style.display !== "none" &&
            filterButtonRef.current.style.visibility !== "hidden" &&
            !filterButtonRef.current.contains(event.target))) &&
        sortBoxRef.current &&
        !sortBoxRef.current.contains(event.target) &&
        (!sortButtonRef.current ||
          (sortButtonRef.current.style.display !== "none" &&
            sortButtonRef.current.style.visibility !== "hidden" &&
            !sortButtonRef.current.contains(event.target)))
      ) {
        setActiveFilter(false);
        setActiveSortby(false);
      }
    };
    // Attach both event listeners
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup both event listeners on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-page">
        <ImSpinner2 color="#397979" />
      </div>
    ); // Show loading while waiting for API response
  }
  return (
    <div className="transaction-page">
      <div className="filter-search-section">
        <div className="filter-sort-btns">
          <div
            ref={filterButtonRef}
            className="button"
            onClick={() => {
              setActiveFilter(!activeFilter);
              setActiveSortby(false);
            }}
          >
            <LuFilter color="#397979" />
            <span>Filter</span>
          </div>
          <div
            ref={sortButtonRef}
            className="button"
            onClick={() => {
              setActiveSortby(!activeSortby);
              setActiveFilter(false);
            }}
          >
            <span>Sort by</span>
            <LuChevronDown color="#397979" />
          </div>
        </div>
        <div className="search-container">
          <input
            type="text"
            className="search-field"
            placeholder="Search"
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
              handleChangeData(event.target.value);
            }}
          />
          <LuSearch color="#397979" />
        </div>

        {/*Filter Box*/}
        <div
          ref={filterBoxRef}
          className={`filter-sort-box ${activeFilter ? "active" : ""}`}
        >
          <span className="box-title">Filter</span>
          <div className="main-box">
            <div className="field">
              <label className="field-name">Price</label>
              <div className="input-number-container">
                <input
                  className="input-number"
                  type="number"
                  value={filterCondition.startPrice}
                  placeholder="E.g. 50"
                  onChange={(event) =>
                    setFilterCondition({
                      ...filterCondition,
                      startPrice: event.target.value,
                    })
                  }
                />
                <TbCurrencyDong color="#757575" />
              </div>
              <LuArrowRight />
              <div className="input-number-container">
                <input
                  className="input-number"
                  type="number"
                  value={filterCondition.endPrice}
                  placeholder="E.g. 50"
                  onChange={(event) =>
                    setFilterCondition({
                      ...filterCondition,
                      endPrice: event.target.value,
                    })
                  }
                />
                <TbCurrencyDong color="#757575" />
              </div>
            </div>

            <div className="field">
              <label className="field-name">Transaction Date</label>
              <div className="input-number-container">
                <input
                  className="input-number date"
                  type="date"
                  value={filterCondition.startDate}
                  onChange={(event) =>
                    setFilterCondition({
                      ...filterCondition,
                      startDate: event.target.value,
                    })
                  }
                />
              </div>
              <LuArrowRight />
              <div className="input-number-container">
                <input
                  className="input-number date"
                  type="date"
                  value={filterCondition.endDate}
                  onChange={(event) =>
                    setFilterCondition({
                      ...filterCondition,
                      endDate: event.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div className="box-footer">
            <button
              className="cancel"
              onClick={() => {
                handleResetFilter();
                setActiveFilter(false);
              }}
            >
              Clear
            </button>
            <button
              className="save"
              onClick={() => {
                handleChangeData(searchText);
                setActiveFilter(false);
              }}
            >
              Filter
            </button>
          </div>
        </div>

        {/* Sort Box */}
        <div
          ref={sortBoxRef}
          className={`filter-sort-box ${activeSortby ? "active" : ""}`}
        >
          <span className="box-title">Sort</span>
          <div className="main-box">
            <div className="field">
              <label className="field-name">Sort by</label>
              <select
                className="select-sortby"
                onChange={(e) =>
                  setSortCondition({
                    ...sortCondition,
                    field: e.target.value,
                  })
                }
              >
                <option value="">Field</option>

                {idRole === Role.centerAdmin && (
                  <option value="studentName">Student name</option>
                )}
                <option value="courseName">Course name</option>
                <option value="price">Price</option>
                <option value="paymentDate">Transaction date</option>
              </select>
              <select
                className="select-sortby"
                onChange={(e) =>
                  setSortCondition({
                    ...sortCondition,
                    direction: e.target.value,
                  })
                }
              >
                <option value="">Direction</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          <div className="box-footer">
            <button
              className="cancel"
              onClick={() => {
                handleResetSort();
                setActiveSortby(false);
              }}
            >
              Clear
            </button>
            <button
              className="save"
              onClick={() => {
                handleChangeData(searchText);
                setActiveFilter(false);
              }}
            >
              Sort
            </button>
          </div>
        </div>
      </div>

      <div className="main-content slide-to-top">
        <div className="transaction-table">
          {idRole === Role.centerAdmin ? (
            <table>
              <tr className="header-row">
                <th>Student</th>
                <th>Course</th>
                <th>Transaction Date</th>
                <th>Ammount</th>
              </tr>
              {paymentList.length > 0 &&
                currentItemsPage.map((payment, index) => (
                  <tr>
                    <td className="enable-click">
                      <div className="many-items">
                        <img
                          className="ava-student"
                          src={payment.studentAvatar || default_ava}
                          alt="error"
                        />
                        <span className="student-name">
                          {payment.studentName}
                        </span>
                      </div>
                    </td>
                    <td className="enable-click">{payment.courseName}</td>
                    <td>{formatDateTime(payment.paymentDate)}</td>
                    <td>
                      <div className="many-items">
                        <LuPlus />
                        <span>
                          {payment.discountedPrice
                            ? payment.discountedPrice
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                            : payment.price
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        </span>
                        <span className="currency">đ</span>
                      </div>
                    </td>
                  </tr>
                ))}
            </table>
          ) : (
            <table className="student-transaction">
              <tr className="header-row">
                <th>Course</th>
                <th>Transaction Date</th>
                <th>Ammount</th>
              </tr>
              {paymentList.length > 0 &&
                currentItemsPage.map((payment, index) => (
                  <tr
                    onClick={() =>
                      navigate("/courseDetail", {
                        state: {
                          idCourse: payment.idCourse,
                          idUser: localStorage.getItem("idUser"),
                          idRole: localStorage.getItem("idRole"),
                        },
                      })
                    }
                  >
                    <td>
                      <div className="many-items">
                        <img
                          className="course-background"
                          src={payment.courseAvatar || default_image}
                          alt="error"
                        />
                        <span className="student-name">
                          {payment.courseName}
                        </span>
                      </div>
                    </td>
                    <td>{formatDateTime(payment.paymentDate)}</td>
                    <td>
                      <div className="many-items">
                        <LuMinus />
                        <span>
                          {" "}
                          {payment.discountedPrice
                            ? payment.discountedPrice
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                            : payment.price
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        </span>
                        <span className="currency">đ</span>
                      </div>
                    </td>
                  </tr>
                ))}
            </table>
          )}
        </div>
        <div className="pagination">
          {paginationNumbers.map((number, index) => (
            <button
              key={index}
              onClick={() =>
                typeof number === "number" && setCurrentPage(number)
              }
              className={number === currentPage ? "active" : ""}
              disabled={number === "..."}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transaction;

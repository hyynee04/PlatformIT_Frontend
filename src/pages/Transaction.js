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
import { Role } from "../constants/constants";

const Transaction = () => {
  const idUser = +localStorage.getItem("idUser");
  const idRole = +localStorage.getItem("idRole");

  const [courseType, setCourseType] = useState("All");
  const [activeFilter, setActiveFilter] = useState(false);
  const [activeSortby, setActiveSortby] = useState(false);

  const filterButtonRef = useRef(null);
  const sortButtonRef = useRef(null);
  const filterBoxRef = useRef(null);
  const sortBoxRef = useRef(null);

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
            // value={searchCourse}
            // onChange={(event) => {
            //   setSearchCourse(event.target.value);
            //   handleChangeData(event.target.value);
            // }}
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
                  // value={startPrice}
                  placeholder="E.g. 50"
                  // onChange={(event) => setStartPrice(event.target.value)}
                />
                <TbCurrencyDong color="#757575" />
              </div>
              <LuArrowRight />
              <div className="input-number-container">
                <input
                  className="input-number"
                  type="number"
                  // value={endPrice}
                  placeholder="E.g. 50"
                  // onChange={(event) => setEndPrice(event.target.value)}
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
                  // value={startDate}
                  // onChange={(event) => setStartDate(event.target.value)}
                />
              </div>
              <LuArrowRight />
              <div className="input-number-container">
                <input
                  className="input-number date"
                  type="date"
                  // value={endDate}
                  // onChange={(event) => setEndDate(event.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="box-footer">
            <button
              className="cancel"
              onClick={() => {
                // handleResetFilter();
                setActiveFilter(false);
              }}
            >
              Clear
            </button>
            <button
              className="save"
              onClick={() => {
                // handleChangeData(searchCourse);
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
                // onChange={(e) =>
                //   setSortConditionCourse({
                //     ...sortConditionCourse,
                //     field: e.target.value,
                //   })
                // }
              >
                <option value="">Field</option>
                <option value="">Student name</option>
                <option value="courseTitle">Course name</option>
                <option value="price">Price</option>
                <option value="courseStartDate">Transaction date</option>
              </select>
              <select
                className="select-sortby"
                // onChange={(e) =>
                //   setSortConditionCourse({
                //     ...sortConditionCourse,
                //     direction: e.target.value,
                //   })
                // }
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
                // handleResetSort();
                setActiveSortby(false);
              }}
            >
              Clear
            </button>
            <button
              className="save"
              onClick={() => {
                // handleChangeData(searchCourse);
                setActiveFilter(false);
              }}
            >
              Sort
            </button>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="transaction-table">
          {idRole === Role.centerAdmin ? (
            <table>
              <tr className="header-row">
                <th>Student</th>
                <th>Course</th>
                <th>Transaction Date</th>
                <th>Ammount</th>
              </tr>
              {Array.from({ length: 8 }).map((_, index) => (
                <tr>
                  <td>
                    <div className="many-items">
                      <img
                        className="ava-student"
                        src={default_ava}
                        alt="error"
                      />
                      <span className="student-name">
                        Phan Tran Nhat Ha Phan Tran Nhat Ha Phan Tran Nhat Ha
                        Phan Tran Nhat Ha
                      </span>
                    </div>
                  </td>
                  <td>
                    Python beginner Python beginner Python beginner Python
                    beginner Python beginner
                  </td>
                  <td>12/27/2024, 12:00</td>
                  <td>
                    <div className="many-items">
                      <LuPlus />
                      <span>300.000.000</span>
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
              {Array.from({ length: 8 }).map((_, index) => (
                <tr>
                  <td>
                    <div className="many-items">
                      <img
                        className="course-background"
                        src={default_image}
                        alt="error"
                      />
                      <span className="student-name">
                        Python beginner Python beginner Python beginner Python
                        beginner Python beginner
                      </span>
                    </div>
                  </td>
                  <td>12/27/2024, 12:00</td>
                  <td>
                    <div className="many-items">
                      <LuMinus />
                      <span>300.000.000</span>
                      <span className="currency">đ</span>
                    </div>
                  </td>
                </tr>
              ))}
            </table>
          )}
        </div>
        <div className="pagination">
          {/* {paginationNumbers.map((number, index) => (
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
          ))} */}
          <button className="active">1</button>
        </div>
      </div>
    </div>
  );
};

export default Transaction;

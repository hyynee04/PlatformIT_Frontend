import "../../assets/scss/ViewAll.css";
import {
    LuChevronDown,
    LuFilter,
    LuSearch,
  } from "react-icons/lu";

const ViewAllTeacher = () => {
    return (
        <div className="viewall-container">
            <div className="filter-search-section">
                <div className="filter-sort-btns">
                    <div className="btn">
                        <LuFilter className="icon" />
                        <span>Filter</span>
                    </div>
                    
                    <div className="btn">
                        <span>Sort by</span>
                        <LuChevronDown className="icon" />
                    </div>
                </div>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-field"
                        placeholder="Search"
                    />
                    <LuSearch className="icon search-icon" />
                </div>
            </div>

            <div className="filter-sort-box">
                <div className="filter-box">
                    
                </div>
            </div>

        </div>
    )
}

export default ViewAllTeacher;
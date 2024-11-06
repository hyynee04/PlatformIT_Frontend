import { useEffect, useRef, useState } from "react";
import {
    LuArrowRight,
    LuChevronDown,
    LuFilter,
    LuSearch
} from "react-icons/lu";
import "../../assets/scss/ViewAll.css";

const ViewAllTeacher = () => {
    const [activeFilter, setActiveFilter] = useState(false);
    const [activeSortby, setActiveSortby] = useState(false);

    // Use refs to identify the Filter and Sort by divs
    const filterRef = useRef(null);
    const sortbyRef = useRef(null);

    useEffect(() => {
        // Define the click handler for outside clicks
        const handleClickOutside = (event) => {
            // Check if the clicked element is outside both refs
            if (
                filterRef.current && !filterRef.current.contains(event.target) &&
                sortbyRef.current && !sortbyRef.current.contains(event.target)
            ) {
                setActiveFilter(false);
                setActiveSortby(false);
            }
        };
        // Attach the event listener to document
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="viewall-container">
            <div className="filter-search-section">
                <div className="filter-sort-btns">
                    <div
                        ref={filterRef}
                        className="btn"
                        onClick={() => {
                            setActiveFilter(!activeFilter);
                            setActiveSortby(false);
                        }}
                    >
                        <LuFilter className="icon" />
                        <span>Filter</span>
                    </div>

                    <div
                        ref={sortbyRef}
                        className="btn"
                        onClick={() => {
                            setActiveSortby(!activeSortby);
                            setActiveFilter(false);
                        }}
                    >
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

            <div className={`filter-sort-box ${activeFilter ? 'active' : ''}`}>
                <span className="box-title">Filter</span>
                <div className="main-box">
                    <div className="field">
                        <label className="field-name">Number of courses</label>
                        <input
                            className="input-number"
                            type="number"
                            placeholder="E.g. 50"
                        />
                        <LuArrowRight />
                        <input
                            className="input-number"
                            type="number"
                            placeholder="E.g. 100"
                        />
                    </div>
                </div>
                <div className="box-footer">
                    <button className="cancel">Cancel</button>
                    <button className="save">Save</button>
                </div>
            </div>

            <div className={`filter-sort-box ${activeSortby ? 'active' : ''}`}>
                <span className="box-title">Sort</span>
                <div className="main-box">
                    <div className="field">
                        <label className="field-name">Sort by</label>
                        <select className="select-sortby">
                            <option>Full name</option>
                            <option>Teaching major</option>
                            <option>Course number</option>
                        </select>
                        <select className="select-sortby">
                            <option>Ascending</option>
                            <option>Descending</option>
                        </select>
                    </div>
                </div>
                <div className="box-footer">
                    <button className="cancel">Cancel</button>
                    <button className="save">Save</button>
                </div>
            </div>

        </div>
    )
}

export default ViewAllTeacher;
import { useEffect, useRef, useState } from "react";
import {
    LuArrowRight,
    LuChevronDown,
    LuDollarSign,
    LuFilter,
    LuSearch,
    LuX
} from "react-icons/lu";
import "../assets/scss/ViewAll.css";

const ViewAll = () => {
    const [menuIndex, setMenuIndex] = useState(1)
    const menuItems = [
        { label: "Courses", index: 1 },
        { label: "Teachers", index: 2 },
        { label: "Centers", index: 3 }
    ];
    const [activeFilter, setActiveFilter] = useState(false);
    const [activeSortby, setActiveSortby] = useState(false);
    const [tagPopup, setTagPopup] = useState(false);

    // Separate refs for each box
    const filterButtonRef = useRef(null);
    const sortButtonRef = useRef(null);
    const filterBoxRef = useRef(null);
    const sortBoxRef = useRef(null);

    console.log(menuIndex)
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click is outside both the filter and sort boxes and buttons
            // console.log(">> Filter outside", filterBoxRef.current, filterBoxRef.current.contains(event.target))
            // console.log(">> Sort outside", sortBoxRef.current, sortBoxRef.current.contains(event.target))
            // console.log(">> Filter button", filterButtonRef.current.contains(event.target))
            // console.log(">> Sort button", sortButtonRef.current.contains(event.target))

            if (
                filterBoxRef.current &&
                !filterBoxRef.current.contains(event.target) &&
                !filterButtonRef.current.contains(event.target) &&

                sortBoxRef.current &&
                !sortBoxRef.current.contains(event.target) &&
                !sortButtonRef.current.contains(event.target)
            ) {
                setActiveFilter(false);
                setActiveSortby(false);
            }

        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="viewall-container">
            <div className="viewall-menu-section">
                {menuItems.map(item => (
                    <button
                        key={item.index}
                        className={`menu-button ${menuIndex === item.index ? "active" : ""}`}
                        onClick={() => setMenuIndex(item.index)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="filter-search-section">
                <div className="filter-sort-btns">
                    <div
                        ref={filterButtonRef}
                        className="btn"
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
                        className="btn"
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
                    />
                    <LuSearch color="#397979" />
                </div>

                {/*Filter Box*/}
                <div
                    ref={filterBoxRef}
                    className={`filter-sort-box ${activeFilter ? 'active' : ''}`}
                >
                    <span className="box-title">Filter</span>
                    {menuIndex
                        && menuIndex === 1 ?
                        (
                            <div className="main-box">
                                <div className="field tag">
                                    <label className="field-name">Tags</label>
                                    <div className="tag-field">
                                        <input
                                            type="text"
                                            placeholder="Find tag name"
                                        />
                                        <button
                                            onClick={() => setTagPopup(!tagPopup)}
                                        ><LuChevronDown color="#397979" /></button>
                                        <div className="tag-container">
                                            <div className="tag-showed">
                                                <span>Web Development</span>
                                                <button><LuX /></button>
                                            </div>
                                            <div className="tag-showed">
                                                <span>Testing</span>
                                                <button><LuX /></button>
                                            </div>
                                        </div>
                                        <div className={`tag-popup ${tagPopup ? "active" : ""}`}>
                                            <button>Web Development</button>
                                            <button>Front end</button>
                                            <button>Back end</button>
                                            <button>Testing</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="field-name">Price</label>
                                    <div className="input-number-container">
                                        <input
                                            className="input-number"
                                            type="number"
                                            placeholder="E.g. 50"
                                        />
                                        <LuDollarSign color="#757575" />
                                    </div>
                                    <LuArrowRight />
                                    <div className="input-number-container">
                                        <input
                                            className="input-number"
                                            type="number"
                                            placeholder="E.g. 50"
                                        />
                                        <LuDollarSign color="#757575" />
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="field-name">Course type</label>
                                    <div className="course-type">
                                        <input name="course-type" type="radio" /> All
                                    </div>
                                    <div className="course-type">
                                        <input name="course-type" type="radio" /> Limit
                                    </div>
                                    <div className="course-type">
                                        <input name="course-type" type="radio" /> Unlimit
                                    </div>

                                </div>

                                <div className="field">
                                    <label className="field-name">Registration date</label>
                                    <div className="input-number-container">
                                        <input
                                            className="input-number date"
                                            type="date"
                                        />
                                    </div>
                                    <LuArrowRight />
                                    <div className="input-number-container">
                                        <input
                                            className="input-number date"
                                            type="date"
                                        />
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="field-name">Course duration</label>
                                    <div className="input-number-container">
                                        <input
                                            className="input-number date"
                                            type="date"
                                        />
                                    </div>
                                    <LuArrowRight />
                                    <div className="input-number-container">
                                        <input
                                            className="input-number date"
                                            type="date"
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                        : (menuIndex === 2 ?
                            (
                                <div className="main-box">
                                    <div className="field">
                                        <label className="field-name">Number of courses</label>
                                        <div className="input-number-container">
                                            <input
                                                className="input-number"
                                                type="number"
                                                placeholder="E.g. 50"
                                            />
                                        </div>
                                        <LuArrowRight />
                                        <div className="input-number-container">
                                            <input
                                                className="input-number"
                                                type="number"
                                                placeholder="E.g. 50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                            :
                            (
                                <div className="main-box"></div>
                            )
                        )
                    }

                    <div className="box-footer">
                        <button
                            className="cancel"
                            onClick={() => setActiveFilter(false)}
                        >Cancel</button>
                        <button className="save">Filter</button>
                    </div>
                </div>

                {/*Sort Box*/}
                <div
                    ref={sortBoxRef}
                    className={`filter-sort-box ${activeSortby ? 'active' : ''}`}
                >
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
                        <button
                            className="cancel"
                            onClick={() => setActiveSortby(false)}
                        >Cancel</button>
                        <button className="save">Sort</button>
                    </div>
                </div>
            </div>

            <div className="viewall-main-section"></div>
        </div>
    )
}

export default ViewAll;

import React, { useEffect, useState } from "react";
import { LuClock7, LuX } from "react-icons/lu";
import {
  getWorkingHours,
  postAddOrUpdateWorkingHours,
} from "../../services/centerService";
const DiagWorkingHourForm = ({ isOpen, onClose }) => {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [workingHours, setWorkingHours] = useState(
    daysOfWeek.map((day) => ({
      day: day,
      startTime: "08:30",
      closeTime: "16:00",
      isOpen: true,
    }))
  );
  const [errorString, setErrorString] = useState("");
  const fetchWorkingHours = async () => {
    try {
      const response = await getWorkingHours();
      if (response !== "Center not found or no working hours available.") {
        setWorkingHours(response);
      }
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    if (isOpen) {
      fetchWorkingHours();
    }
  }, [isOpen]);
  const toggleOpenClose = (day) => {
    setWorkingHours((prevHours) =>
      prevHours.map((hour) =>
        hour.day === day ? { ...hour, isOpen: !hour.isOpen } : hour
      )
    );
  };
  const handleTimeChange = (day, field, value) => {
    setWorkingHours((prevHours) => {
      const updatedHours = prevHours.map((hour) =>
        hour.day === day ? { ...hour, [field]: value } : hour
      );

      let errorFound = false;
      for (const hour of updatedHours) {
        const { startTime, closeTime } = hour;
        if (closeTime < startTime) {
          errorFound = true;
          setErrorString("Close time cannot be before start time.");
          break;
        }
      }
      if (!errorFound) {
        setErrorString("");
      }

      return updatedHours;
    });
  };
  const handleSaveWorkingHour = async () => {
    try {
      await postAddOrUpdateWorkingHours(workingHours);
    } catch (error) {
      throw error;
    }
  };
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="diag-header">
          <div className="container-title">
            <LuClock7 className="diag-icon" />
            <span className="diag-title">Working Hours</span>
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          <div className="work-hours-container">
            {daysOfWeek.map((day) => {
              const dayData = workingHours.find((item) => item.day === day);
              return (
                <div key={day} className="day-row">
                  <span>{day}</span>
                  <div className="setting-times">
                    <span
                      className="block"
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleOpenClose(day)}
                    >
                      {dayData.isOpen ? "Open" : "Close"}
                    </span>
                    <input
                      type="time"
                      className="form-control block"
                      value={dayData.startTime}
                      onChange={(e) =>
                        handleTimeChange(day, "startTime", e.target.value)
                      }
                      disabled={!dayData.isOpen}
                    />
                    <input
                      type="time"
                      className="form-control block"
                      value={dayData.closeTime}
                      onChange={(e) =>
                        handleTimeChange(day, "closeTime", e.target.value)
                      }
                      disabled={!dayData.isOpen}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="str-btns">
            {errorString && <span className="error-str">{errorString}</span>}
            <div className="act-btns">
              <button className="btn diag-btn cancel" onClick={onClose}>
                cancel
              </button>
              <button
                className="btn diag-btn signout"
                onClick={() => {
                  handleSaveWorkingHour();
                  onClose();
                }}
                disabled={!!errorString}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagWorkingHourForm;

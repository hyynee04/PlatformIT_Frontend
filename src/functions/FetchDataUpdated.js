import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from "react";

const FetchDataUpdated = (idUser, idLecture, object) => {
  const [updatedNotifications, setUpdatedNotifications] = useState([]);
  const [updatedUnreadCount, setUpdatedUnreadCount] = useState(0);
  const [updatedComments, setUpdatedComments] = useState([]);
  const idUserBase = +localStorage.getItem("idUser");

  useEffect(() => {
    if (!idUserBase) {
      console.warn(
        "idUserBase does not exist. SignalR connection will not start."
      );
      return;
    }

    console.log("Attempting to connect to SignalR hub...");
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(
        `https://myidvndut.id.vn:5000/notificationHub?userId=${idUser}&lectureId=${idLecture}`
      )
      .configureLogging(signalR.LogLevel.Information)
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("Connected to SignalR hub.");

        if (object === "notification") {
          connection.on("UpdateNotifications", (updatedNotifications) => {
            console.log(
              "Received UpdateNotifications event:",
              updatedNotifications
            );

            // Update notifications and unread count
            const unread = updatedNotifications.filter(
              (notification) => notification.isRead === 0
            ).length;
            setUpdatedUnreadCount(unread > 99 ? "99+" : unread);
            setUpdatedNotifications(updatedNotifications);
          });
        } else if (object === "comment") {
          connection.on(
            "UpdateCommentsOfLecture",
            (updateCommentsOfLecture) => {
              console.log(
                "Received UpdateComments event:",
                updateCommentsOfLecture
              );

              // Update comments
              setUpdatedComments(updateCommentsOfLecture);
            }
          );
        }
      } catch (error) {
        console.error("SignalR Connection Error:", error);
      }
    };

    startConnection();

    // Retry connection if closed
    connection.onclose((error) => {
      console.error("SignalR connection closed:", error);
      setTimeout(() => startConnection(), 5000); // Retry every 5 seconds
    });

    // Cleanup on component unmount
    return () => {
      console.log("Stopping SignalR connection...");
      connection.stop().then(() => console.log("SignalR connection stopped."));
    };
  }, [idUserBase]); // Dependency array ensures effect re-runs if these values change

  return object === "notification"
    ? {
        updatedNotifications,
        updatedUnreadCount,
      }
    : object === "comment"
    ? {
        updatedComments,
      }
    : {};
};

export default FetchDataUpdated;

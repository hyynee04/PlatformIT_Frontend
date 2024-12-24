import React, { useEffect, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { ImSpinner2 } from "react-icons/im";
import { RiSendPlaneFill } from "react-icons/ri";
import default_ava from "../assets/img/default_ava.png";
import "../assets/css/Chat.css";
import {
  getAllUserConversations,
  getConversation,
  postSendMessage,
  postUpdateReadStatus,
} from "../services/messageService";
import { APIStatus, Role } from "../constants/constants";
import {
  calculateRelativeTime,
  formatDateTimeWithTimeZone,
  parseRelativeTime,
} from "../functions/function";
import { getIsChatAvailable } from "../services/courseService";
import { useLocation } from "react-router-dom";

const Chat = () => {
  const idUser = Number(localStorage.getItem("idUser"));
  const idRole = Number(localStorage.getItem("idRole"));
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const location = useLocation();
  const [listConversations, setListConversations] = useState([]);
  const [selectedSender, setSelectedSender] = useState({});
  const [detailCoversation, setDetailConversation] = useState([]);
  const [isChatAvailable, setIsChatAvailable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [contentSent, setContentSent] = useState("");
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchListConversations = async () => {
    setLoading(true);
    try {
      let response = await getAllUserConversations();
      if (response.status === APIStatus.success) {
        const state = location.state;
        if (state?.selectedSender) {
          setSelectedSender(state.selectedSender);
        } else {
          setSelectedSender(response.data[0]);
        }
        const processedData = response.data.map((conversation) => ({
          ...conversation,
          timestamp: parseRelativeTime(conversation.relativeTime),
        }));
        setListConversations(processedData);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const handleReadMessage = async (idSendUser) => {
    const response = await postUpdateReadStatus(idUser, idSendUser);
    if (response.status === APIStatus.success) {
      setListConversations((prev) =>
        prev.map((conversation) =>
          conversation.userId === idSendUser
            ? { ...conversation, isRead: 1 }
            : conversation
        )
      );
    }
  };
  const fetchDetailConver = async (idSender) => {
    setLoadingMsg(true);
    try {
      let response = await getConversation(idSender);
      if (response.status === APIStatus.success) {
        setDetailConversation(response.data);
      }
      let responseCanChat = await getIsChatAvailable({
        idStudent: idRole === Role.student ? idUser : idSender,
        idTeacher: idRole === Role.teacher ? idUser : idSender,
      });
      if (responseCanChat.status === APIStatus.success) {
        setIsChatAvailable(response.data);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoadingMsg(false);
    }
  };
  useEffect(() => {
    fetchListConversations();
    const interval = setInterval(() => {
      setListConversations((prevNotifications) =>
        prevNotifications.map((conversation) => ({
          ...conversation,
          relativeTime: calculateRelativeTime(conversation.timestamp),
        }))
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (selectedSender?.userId) {
      fetchDetailConver(selectedSender.userId);
      handleReadMessage(selectedSender.userId);
    }
  }, [selectedSender]);
  useEffect(() => {
    scrollToBottom();
    window.scrollTo(0, 0);
  }, [detailCoversation]);
  const searchedListCoversation = listConversations
    .filter((conversation) => {
      const searchLower = searchTerm.toLowerCase().trim();
      if (
        searchTerm &&
        !(
          conversation.name &&
          conversation.name.toLowerCase().includes(searchLower)
        )
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      let aValue, bValue;
      aValue = new Date(a.lastMessageTime) || new Date(0);
      bValue = new Date(b.lastMessageTime) || new Date(0);

      return aValue < bValue ? 1 : -1;
    });

  const shouldShowTime = (current, previous) => {
    if (!previous) return true;
    const currentDate = new Date(current.split(".")[0] + "Z");
    const previousDate = new Date(previous.split(".")[0] + "Z");

    const diffMs = currentDate - previousDate;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return (
      diffMinutes >= 15 || currentDate.getDate() !== previousDate.getDate()
    );
  };
  const shouldShowAvatar = (message, previousMessage) => {
    if (!previousMessage) return true;
    const diffMs =
      new Date(message.createdDate) - new Date(previousMessage.createdDate);
    const diffMinutes = diffMs / (1000 * 60);
    return message.idSender !== previousMessage.idSender || diffMinutes > 15;
  };
  const handleSendMessage = async () => {
    if (!contentSent.trim()) return;
    const newMessage = {
      idSender: idUser,
      idReceiver: selectedSender.userId,
      content: contentSent,
      createdBy: idUser,
      createdDate: new Date().toISOString(),
    };
    try {
      let respone = await postSendMessage(newMessage);
      if (respone.status === APIStatus.success) {
        setDetailConversation((prev) => [...prev, newMessage]);
        setContentSent("");
        setListConversations((prev) => {
          const conversationExists = prev.some(
            (conversation) => conversation.userId === selectedSender.userId
          );

          if (!conversationExists) {
            // Nếu không có, thêm một conversation mới vào listConversations
            return [
              ...prev,
              {
                userId: selectedSender.userId,
                avatar: selectedSender.avatar,
                name: selectedSender.name,
                lastMessage: contentSent,
                lastMessageTime: new Date().toISOString(),
                relativeTime: "Just now",
              },
            ];
          }
          const updatedConversations = prev.map((conversation) =>
            conversation.userId === selectedSender.userId
              ? {
                  ...conversation,
                  lastMessage: contentSent,
                  lastMessageTime: new Date().toISOString(),
                  relativeTime: "Just now",
                }
              : conversation
          );

          // Sắp xếp lại để đưa conversation được cập nhật lên đầu
          const sortedConversations = updatedConversations.sort((a, b) => {
            if (a.userId === selectedSender.userId) return -1; // Đưa lên đầu
            if (b.userId === selectedSender.userId) return 1;
            return new Date(b.lastMessageTime) - new Date(a.lastMessageTime); // Sắp xếp theo thời gian
          });

          return sortedConversations;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
      setDetailConversation((prev) => prev.filter((msg) => msg !== newMessage));
    }
  };
  if (loading) {
    return (
      <div className="loading-page">
        <ImSpinner2 color="#397979" />
      </div>
    );
  }
  return (
    <div className="main-chat-container">
      <div className="chat-page">
        <div className="list-conversations">
          <label htmlFor="">Coversations</label>
          <div className="search-container">
            <input
              type="text"
              className="search-field"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <LuSearch className="icon search-icon" />
          </div>
          <div className="list-items-container">
            {searchedListCoversation.map((conversation, index) => (
              <div
                className={`conversation-item ${
                  conversation.userId === selectedSender.userId ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedSender(conversation);
                  handleReadMessage(conversation.userId);
                }}
              >
                <img
                  src={conversation.avatar || default_ava}
                  alt=""
                  className="ava-img"
                />
                <div className="name-last-message">
                  <label className="name-user">{conversation.name}</label>
                  <label className="last-message">
                    {conversation.idLassMessageSender === idUser && "You: "}
                    {conversation.lastMessage}
                  </label>
                </div>
                <div className="relative-time">
                  {conversation.isRead === 0 && <div className="read-status" />}
                  <label>{conversation.relativeTime}</label>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="detail-conversation">
          <div className="detail-header">
            <img
              src={selectedSender?.avatar || default_ava}
              alt=""
              className="ava-img"
            />
            <label className="sender-name">{selectedSender?.name}</label>
          </div>

          <div className="detail-body">
            <div className="messages-container">
              {detailCoversation.map((message, index) => {
                const previousMessage = detailCoversation[index - 1];
                const showTime = shouldShowTime(
                  message.createdDate,
                  previousMessage?.createdDate
                );
                const showAvatar = shouldShowAvatar(message, previousMessage);
                return (
                  <div key={message.idMessage}>
                    {showTime && (
                      <div
                        style={{
                          textAlign: "center",
                          color: "var(--text-gray)",
                          fontSize: "12px",
                          padding: "24px",
                        }}
                      >
                        {formatDateTimeWithTimeZone(message.createdDate)}
                      </div>
                    )}
                    <div
                      className={`message-item ${
                        message.idSender === idUser
                          ? "message-right"
                          : "message-left"
                      }`}
                    >
                      {message.idSender !== idUser &&
                        (showAvatar ? (
                          <img
                            src={message.senderAvatar || default_ava}
                            alt=""
                            className="ava-img"
                          />
                        ) : (
                          <div style={{ width: "40px", height: "40px" }} />
                        ))}

                      <label className="message-content">
                        {message.content}
                      </label>
                    </div>
                  </div>
                );
              })}
              <div className="message-end">
                {!loading && !loadingMsg && !isChatAvailable && (
                  <label htmlFor="">
                    You can't message this{" "}
                    {idRole === Role.teacher ? " student" : " teacher"} as your
                    courses have expired. They look forward to seeing you in
                    future courses!
                  </label>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>
            <div className="input-container">
              <div className="info">
                <div className="select-container">
                  <input
                    type="text"
                    className="input-form-pi"
                    value={contentSent}
                    onChange={(e) => setContentSent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage(contentSent); // Gửi tin nhắn khi nhấn Enter
                        setContentSent(""); // Reset trường nhập
                      }
                    }}
                    placeholder="Type a message..."
                    disabled={!isChatAvailable}
                  />
                  <RiSendPlaneFill
                    className="icon-send"
                    onClick={() => handleSendMessage()}
                    disabled={!isChatAvailable}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

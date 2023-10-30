import React, { useState, useEffect } from 'react';
import { getChatMessages } from '../contexts/FirebaseContext'; // Import the function to get chat messages

const ChatComponent = () => {
  const [chatList, setChatList] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    // Fetch the list of chats from your Firebase context or API
    // For example:
    // const fetchedChatList = await fetchChatList();
    // setChatList(fetchedChatList);

    // Mock data for demonstration purposes
    const mockChatList = [
      { bookingId: 'booking1', senderId: 'user1', receiverId: 'pandit1' },
      { bookingId: 'booking2', senderId: 'user2', receiverId: 'pandit2' },
      // Add more chat items here
    ];

    setChatList(mockChatList);
  }, []); // Empty dependency array means this effect runs once after the initial render

  // Function to load chat messages for the selected booking ID
  const loadChatMessages = async (bookingId) => {
    try {
      const messages = await getChatMessages(bookingId);
      setChatMessages(messages);
      setSelectedBookingId(bookingId);
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Chat list */}
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Chat List</h2>
        <ul className="space-y-2">
          {chatList.map((chatItem) => (
            <li
              key={chatItem.bookingId}
              className={`cursor-pointer p-2 rounded hover:bg-gray-300 ${selectedBookingId === chatItem.bookingId ? 'bg-gray-300' : ''}`}
              onClick={() => loadChatMessages(chatItem.bookingId)}
            >
              Booking ID: {chatItem.bookingId}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-4 border-l border-gray-300">
        <h2 className="text-lg font-semibold mb-4">Chat Messages</h2>
        <div className="h-96 overflow-y-auto">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 p-2 rounded ${message.senderId === message.senderId ? 'bg-blue-200 self-end' : 'bg-gray-200'}`}
            >
              {message.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;

  import "../styles/Chat.css";
  import React, { useEffect, useState, useRef } from 'react';
  import axios from "axios";

  const Chat = ({ onClose, data }) => {
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [showTypingIndicator, setShowTypingIndicator] = useState(false);
    const initialMessageSent = useRef(false);

    useEffect(() => {
      if (!initialMessageSent.current) {
        initialMessageSent.current = true;
        setShowTypingIndicator(true);

        const initialMessageTimeout = setTimeout(() => {
          setMessages([
            { type: 'received', text: 'Hello, how can I assist you?' }
          ]);
          setShowTypingIndicator(false);
        }, 2000);

        return () => clearTimeout(initialMessageTimeout);
      }
    }, []);

    const handleInputChange = (e) => {
      setInputMessage(e.target.value);
    };

    const handleSubmit = async () => {
      if (inputMessage.trim() === '') return;

      setMessages(prevMessages => [
        ...prevMessages,
        { type: 'sent', text: inputMessage }
      ]);

      setShowTypingIndicator(true);

      generateAnswer(inputMessage);
      setInputMessage('');
    };

    async function generateAnswer(message) {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
          {
            contents: [{ parts: [{ text: `${message} in ${data.packageDestination} (give response in brief)` }] }],
          }
        );

        const formattedResponse = formatResponse(response.data.candidates[0].content.parts[0].text);

        setMessages(prevMessages => [
          ...prevMessages.filter(msg => !(msg.type === 'received' && msg.isTyping)),
          { type: 'received', text: formattedResponse }
        ]);
      } catch (error) {
        console.log(error);
      } finally {
        setShowTypingIndicator(false); 
      }
    }

    const formatResponse = (text) => {
      // Process the response to handle formatting
      const lines = text.split('\n');
      return lines.map((line, index) => {
        const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
        return <p key={index} dangerouslySetInnerHTML={{ __html: formattedLine }}></p>;
      });
    };

    return (
      <div className="chat-container">
        <div className="chat-header bg-green-700 text-white flex justify-between items-center p-2 rounded-t-lg">
          <h3 className="font-semibold">Chat</h3>
          <button onClick={onClose} className="chat-close-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="chat-body">
          <div className="flex flex-col h-full">
            <div className="flex-grow p-4 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'sent' ? 'justify-end' : ''} mb-4`}>
                  <div className={`max-w-sm ${message.type === 'sent' ? 'bg-green-700 text-white' : 'bg-gray-200'} p-4 rounded-lg`}>
                    {message.type === 'received' && message.text instanceof Array
                      ? message.text.map((line, idx) => <React.Fragment key={idx}>{line}</React.Fragment>)
                      : message.text
                    }
                  </div>
                </div>
              ))}
              {showTypingIndicator && (
                <div className="flex justify-start mb-4">
                  <div className="max-w-sm bg-gray-200 p-4 rounded-lg typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-100 rounded-b-lg">
              <textarea
                placeholder="Type your message..."
                style={{ resize: 'none' }} 
                className="w-full border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                value={inputMessage}
                onChange={handleInputChange}
                
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <button
                className="bg-green-700 text-white px-8 py-2 mt-4 rounded-lg"
                onClick={handleSubmit}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Chat;

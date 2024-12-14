import { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import './chatgpt.css';

const API_KEY = "sk-Diz3rDmbYKoKMbXI39E19cA74b1e437780A9008fC5720e66"
const systemMessage = {
  "role": "system", "content": "Explain things like you're talking to a software professional with 2 years of experience."
};

function ChatGPT() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
      direction: 'incoming'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
    "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    };

    await fetch("https://api.keyai.shop/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization":  `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("API Response:", data); // Thêm dòng này để kiểm tra cấu trúc response
      const reply = data?.choices?.[0]?.message?.content; // Sửa lại nếu cấu trúc khác
      if (reply) {
        setMessages([...chatMessages, {
          message: reply,
          direction: 'incoming',
          sender: "ChatGPT"
        }]);
      } else {
        console.error("Unexpected API response:", data);
        setMessages([...chatMessages, {
          message: "Something went wrong. Please try again later.",
          direction: 'incoming',
          sender: "ChatGPT"
        }]);
      }
      setIsTyping(false);
    })
    
  }

  return (
    <div className="ChatGpt" style={{ marginTop: "50px" }}>
      <div style={{ position: "relative", height: "600px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
            
              {messages.map((message, i) => (
                <Message
                  key={i}
                  model={message}
                  className={`message-${message.direction}`} // Add class based on message direction
                  height='50px'
                  margin
                />
              ))}
              
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default ChatGPT;

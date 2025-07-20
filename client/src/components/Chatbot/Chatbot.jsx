import React, { useState } from 'react';

function formatMarkdown(markdown) {
    return markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')              // bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>')                          // italic
      .replace(/`(.*?)`/g, '<code>$1</code>')                        // inline code
      .replace(/\n/g, '<br>')                                        // line breaks
      .replace(/^\* (.*$)/gm, '<li>$1</li>')                         // bullet points
      .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');                    // wrap <li> in <ul>
  }  

const ChatModal = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); // New flag

  const sendMessage = async () => {
    if (!input.trim() || loading) return; // Block if already loading

    const userMsg = { sender: 'You', text: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true); // Lock input while awaiting response

    try {
      const res = await fetch('http://127.0.0.1:5050/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMsg = { sender: 'Gemini', text: data.response };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'Error', text: 'Failed to connect to API.' }]);
    } finally {
      setLoading(false); // Unlock after success or failure
      setInput('');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 9999
    }}>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 1)', padding: 20, width: 400, borderRadius: 10 }}>
        <h2>Gemini Chat</h2>
        <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #ccc', padding: 10 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
                <strong>{msg.sender}:</strong>
                <div dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }} />
            </div>
          ))}
        </div>
        <input
          type="text"
          value={input}
          disabled={loading} // Disable input while loading
          placeholder="Ask something..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && sendMessage()}
          style={{ width: '100%', marginTop: 10 }}
        />
        <button
          onClick={sendMessage}
          disabled={loading} // Disable button while loading
          style={{ marginTop: 5, width: '100%', opacity: loading ? 0.5 : 1 }}
        >
          {loading ? 'Waiting for response...' : 'Send'}
        </button>
        <button
          onClick={onClose}
          disabled={loading}
          style={{ marginTop: 10, width: '100%' }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ChatModal;

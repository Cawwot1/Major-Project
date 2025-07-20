import React, { useState, useEffect } from 'react';

function formatMarkdown(markdown) {
  if (typeof markdown !== 'string') return '';

  return markdown
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')              // bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>')                          // italic
    .replace(/`(.*?)`/g, '<code>$1</code>')                        // inline code
    .replace(/\n/g, '<br>')                                        // line breaks
    .replace(/^\* (.*$)/gm, '<li>$1</li>')                         // bullet points
    .replace(/(?:<li>.*<\/li>)/gs, match => `<ul>${match}</ul>`);  // wrap list items
}

const ChatModal = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Load chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const csrfToken = localStorage.getItem('csrfToken');
        const res = await fetch('http://localhost:5050/chat-history', {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken || ''
          },
          credentials: 'include'
        });

        const data = await res.json();

        if (data && Array.isArray(data.response)) {
            const history = data.response;
            const formatted = history.map(item => ({
              sender: item.role === 'user' ? 'You' : 'Gemini',
              text: item.content
            }));
            setMessages(formatted);
          }
          
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };

    fetchHistory();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { sender: 'You', text: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const csrfToken = localStorage.getItem('csrfToken');
      const res = await fetch('http://localhost:5050/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || ''
        },
        credentials: 'include',
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMsg = { sender: 'Gemini', text: data.response };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { sender: 'Error', text: 'Failed to connect to API.' }]);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white', padding: 20, width: 400,
        borderRadius: 10, boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
      }}>
        <h2>Gemini Chat</h2>
        <div style={{
          maxHeight: 300, overflowY: 'auto',
          border: '1px solid #ccc', padding: 10, marginBottom: 10
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <strong>{msg.sender}:</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html: formatMarkdown(msg.text) || '[Invalid message]'
                }}
              />
            </div>
          ))}
        </div>
        <input
          type="text"
          value={input}
          disabled={loading}
          placeholder="Ask something..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && sendMessage()}
          style={{ width: '100%', marginBottom: 5 }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{ width: '100%', marginBottom: 5, opacity: loading ? 0.5 : 1 }}
        >
          {loading ? 'Waiting for response...' : 'Send'}
        </button>
        <button
          onClick={onClose}
          disabled={loading}
          style={{ width: '100%' }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ChatModal;

'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function Chat() {
  const { id } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Simulate chat (in real app use Socket.io or Pusher)
  useEffect(() => {
    setMessages([
      { id: 1, sender: 'Seller', text: 'Hi! How can I help you?', time: '10:05' },
      { id: 2, sender: 'You', text: 'Is the iPhone still available?', time: '10:06' },
    ]);
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'You', text: newMessage, time: '10:07' }]);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-black text-white p-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-700 rounded-2xl"></div>
        <div>
          <p className="font-semibold">Seller</p>
          <p className="text-xs text-green-400">Online</p>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-[#0F0F12] space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-5 py-3 rounded-3xl ${msg.sender === 'You' ? 'bg-[#C9A84C] text-black' : 'bg-gray-800 text-white'}`}>
              <p>{msg.text}</p>
              <p className="text-[10px] opacity-60 mt-1 text-right">{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t flex gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border border-gray-200 rounded-3xl px-6 py-4 focus:outline-none"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-black text-white px-8 rounded-3xl font-medium">Send</button>
      </div>
    </div>
  );
}
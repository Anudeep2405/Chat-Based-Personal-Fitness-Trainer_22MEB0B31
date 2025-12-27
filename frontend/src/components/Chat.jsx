import { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../utils/api';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchChatHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchChatHistory = async () => {
        try {
            const response = await chatAPI.getHistory();
            // Reverse to show oldest first
            setMessages(response.history.reverse());
        } catch (err) {
            console.error('Failed to fetch chat history:', err);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setError('');

        // Add user message immediately
        const tempUserMsg = {
            userMessage,
            aiResponse: '',
            timestamp: new Date(),
            _id: Date.now(),
        };
        setMessages(prev => [...prev, tempUserMsg]);
        setLoading(true);

        try {
            const response = await chatAPI.sendMessage(userMessage);

            // Update with AI response
            setMessages(prev =>
                prev.map(msg =>
                    msg._id === tempUserMsg._id
                        ? { ...msg, aiResponse: response.reply }
                        : msg
                )
            );
        } catch (err) {
            setError(err.message || 'Failed to send message');
            // Remove temp message on error
            setMessages(prev => prev.filter(msg => msg._id !== tempUserMsg._id));
        } finally {
            setLoading(false);
        }
    };

    const quickPrompts = [
        'Create a weekly workout plan for me',
        'Give me nutrition advice for my goals',
        'What exercises should I do today?',
        'How can I improve my endurance?',
    ];

    const handleQuickPrompt = (prompt) => {
        setInput(prompt);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="card">
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Chat with Your AI Fitness Coach
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Ask anything about workouts, nutrition, or fitness advice
                    </p>
                </div>

                {/* Quick Prompts */}
                {messages.length === 0 && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Try asking:</p>
                        <div className="flex flex-wrap gap-2">
                            {quickPrompts.map((prompt, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuickPrompt(prompt)}
                                    className="text-xs bg-primary-50 text-primary-700 px-3 py-2 rounded-lg hover:bg-primary-100 transition-colors"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Messages */}
                <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto mb-4">
                    {messages.length === 0 && !loading && (
                        <div className="text-center text-gray-500 mt-20">
                            <p className="text-4xl mb-2">💬</p>
                            <p>Start a conversation with your AI fitness coach!</p>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div key={msg._id || index} className="mb-4">
                            {/* User Message */}
                            <div className="flex justify-end mb-2">
                                <div className="bg-primary-600 text-white rounded-lg px-4 py-2 max-w-md">
                                    <p className="text-sm">{msg.userMessage}</p>
                                </div>
                            </div>

                            {/* AI Response */}
                            {msg.aiResponse && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 max-w-md">
                                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                            {msg.aiResponse}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Loading indicator for current message */}
                            {!msg.aiResponse && loading && index === messages.length - 1 && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Input Form */}
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask your fitness coach..."
                        className="input-field flex-1"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="btn-primary px-6"
                    >
                        {loading ? '...' : 'Send'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chat;

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Mail, MessageCircle, UserCog, Users, ChevronDown, Send, X, Loader2, Trash2, Bot } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useScrollToTop } from '../contexts/ScrollToTopContext';
import { geminiApiService, GeminiMessage } from '../services/geminiApi';

/**
 * Support Component
 * A page providing support options and FAQs, with a support chat button and modal for real-time user assistance.
 */
const Support = () => {
  const { setPosition } = useScrollToTop();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false); // Support chat modal visibility
  const [supportMessage, setSupportMessage] = useState(''); // Support chat input message
  const [chatHistory, setChatHistory] = useState<{ user: string; message: string }[]>([]); // Support chat history
  const [geminiChatHistory, setGeminiChatHistory] = useState<GeminiMessage[]>([]);
  const [isHoveringSupportSubmit, setIsHoveringSupportSubmit] = useState(false); // Hover state for support submit button
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const supportButtonRef = useRef<HTMLButtonElement>(null); // Reference to support button

  const faqs = [
    {
      question: 'How do I submit my project?',
      answer:
        "Navigate to the 'Submit Project' page and fill out the form with your project details, including title, description, category, and author information.",
    },
    {
      question: 'What types of projects are accepted?',
      answer:
        'We accept innovative projects from all academic disciplines including AI, Robotics, Medicine, Engineering, Computer Science, Environmental, Business, Arts, and Social Impact.',
    },
    {
      question: 'How is project scoring calculated?',
      answer:
        'Project scores are based on innovation, technical complexity, potential impact, and community engagement. Scores are updated regularly based on views and support.',
    },
    {
      question: 'Can I collaborate with other students?',
      answer:
        'Yes! Use the Chat feature to connect with other student innovators and discuss potential collaborations on projects.',
    },
    {
      question: 'How do I get support for my project?',
      answer:
        'Users can support projects by viewing, sharing, and engaging with them. Higher engagement leads to better visibility and potential funding opportunities.',
    },
  ];

  const supportOptions = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      action: 'support@BrainFuel.com',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      action: 'Start Chat',
      link: '/chat',
    },
    {
      icon: UserCog,
      title: 'BrainFuel Team',
      description: 'Let know about BrainFuel Team 🚀',
      action: 'View Team',
      link: '/card',
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Ask questions in our community',
      action: 'Join Forum',
      link: '/Forum',
    },
  ];

  const clearChatHistory = () => {
    setChatHistory([]);
    setGeminiChatHistory([]);
  };

  // Handle support chat form submission
  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (supportMessage.trim() && !isLoadingResponse) {
      const userMessage = supportMessage.trim();
      const newChat = { user: 'You', message: userMessage };
      
      // Add user message to chat history
      setChatHistory(prev => [...prev, newChat]);
      setSupportMessage('');
      setIsLoadingResponse(true);

      try {
        // Send message directly to Gemini API
        const response = await geminiApiService.sendMessage(userMessage);
        
        // Add AI response to chat history
        const aiResponse = { user: 'BrainFuel AI', message: response };
        setChatHistory(prev => [...prev, aiResponse]);
        
      } catch (error) {
        console.error('Error getting AI response:', error);
        const errorResponse = { 
          user: 'BrainFuel AI', 
          message: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.' 
        };
        setChatHistory(prev => [...prev, errorResponse]);
      } finally {
        setIsLoadingResponse(false);
      }
    }
  };

  // Set scroll to top button position for pages with support modal
  useEffect(() => {
    setPosition('support');
    return () => setPosition('default');
  }, [setPosition]);

  // Add welcome message when chat is opened for the first time
  useEffect(() => {
    if (isSupportModalOpen && chatHistory.length === 0) {
             const welcomeMessage = {
         user: 'BrainFuel AI',
         message: 'مرحباً! أنا مساعد BrainFuel الذكي 🤖\nكيف يمكنني مساعدتك اليوم؟\n\nHello! I\'m the BrainFuel AI Assistant 🤖\nHow can I help you today?'
       };
      setChatHistory([welcomeMessage]);
    }
  }, [isSupportModalOpen, chatHistory.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent p-4 sm:p-6 md:p-8 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-3 mb-4"
          >
            <HelpCircle className="w-8 h-8 text-accent-primary" />
            <h1 className="text-3xl font-bold text-text-primary">Support Center</h1>
          </motion.div>
          <p className="text-text-secondary text-lg">
            Need help with your project or have questions about the platform? We're here to help!
          </p>
        </div>

        {/* Support Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {supportOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-background-secondary/30 backdrop-blur-md border border-border-primary rounded-xl p-6 text-center hover:border-accent-primary/50 transition-colors"
            >
              <div className="w-12 h-12 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <option.icon className="w-6 h-6 text-accent-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{option.title}</h3>
              <p className="text-text-secondary mb-4">{option.description}</p>
              {option.link ? (
                <NavLink
                  to={option.link}
                  className="text-accent-primary hover:text-accent-secondary transition-colors font-medium"
                >
                  {option.action}
                </NavLink>
              ) : (
                <button className="text-accent-primary hover:text-accent-secondary transition-colors font-medium">
                  {option.action}
                </button>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-3 mb-8">
            <HelpCircle className="w-6 h-6 text-accent-primary" />
            <h2 className="text-3xl font-bold text-text-primary">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{
                  scale: 1.03, // Slightly scale up on hover
                  y: -5, // Lift the card slightly
                  boxShadow: "0 8px 24px rgba(139, 92, 246, 0.3)", // Add a purple glow shadow
                  borderColor: "rgba(139, 92, 246, 0.5)", // Highlight border on hover
                  transition: { duration: 0.2, ease: "easeOut" }, // Smooth transition
                }}
                className="bg-background-secondary/30 backdrop-blur-md border border-border-primary rounded-xl p-6 cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-text-primary mb-3">{faq.question}</h3>
                <p className="text-text-secondary">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 backdrop-blur-md border border-accent-primary/20 rounded-xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-4">Still Need Help?</h2>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Our support team is available 24/7 to help you with any questions or issues you might have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink
              to="/Forum"
              className="glow-button bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-accent-primary/25 hover:shadow-accent-primary/40"
            >
              Contact Support
            </NavLink>
                         <NavLink
               to="/schedule-call"
               className="px-8 py-3 border border-accent-primary text-accent-primary rounded-lg font-semibold hover:bg-accent-primary hover:text-white transition-colors"
             >
               Schedule a Call
             </NavLink>
          </div>
        </motion.div>

        {/* Support Chat Button */}
        <motion.button
          ref={supportButtonRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{
            scale: 1.1,
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
            transition: { duration: 0.15 },
          }}
          onClick={() => setIsSupportModalOpen((prev) => !prev)}
          className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-800 to-purple-800 rounded-full text-white shadow-lg shadow-purple-800/25 transition"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isSupportModalOpen ? (
              <motion.div
                key="chevron"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="help"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <HelpCircle className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Enhanced Support Chat Modal - Same style as Chat page */}
        <AnimatePresence>
          {isSupportModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setIsSupportModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="bg-gradient-to-br from-gray-900/95 to-gray-950/95 border border-gray-700 backdrop-blur-md rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-text-primary">BrainFuel AI</h2>
                      <p className="text-xs text-text-secondary">Your Innovation Assistant</p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.15, rotate: 360 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsSupportModalOpen(false)}
                    className="p-2 text-text-secondary hover:text-accent-primary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Chat History */}
                <div className="h-80 overflow-y-auto mb-6 p-4 bg-background-secondary/30 rounded-xl border border-border-primary">
                  {chatHistory.map((chat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                      className={`mb-4 p-3 rounded-xl text-sm max-w-[85%] ${
                        chat.user === 'You'
                          ? 'ml-auto bg-gradient-to-br from-purple-600/80 to-indigo-600/80 text-white'
                          : 'mr-auto bg-background-tertiary text-text-primary border border-border-primary'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs">
                          {chat.user === 'You' ? 'You' : 'BrainFuel AI'}
                        </span>
                        <span className="text-xs opacity-70">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span className="whitespace-pre-line text-sm">{chat.message}</span>
                    </motion.div>
                  ))}
                  
                  {isLoadingResponse && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mr-auto p-3 rounded-xl text-sm max-w-[85%] bg-background-tertiary text-text-primary border border-border-primary"
                    >
                      <div className="flex items-center space-x-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="w-4 h-4" />
                        </motion.div>
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input Form */}
                <form onSubmit={handleSupportSubmit} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Ask me anything about your project..."
                    disabled={isLoadingResponse}
                    className="flex-1 px-4 py-3 bg-background-secondary border border-border-primary rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary transition disabled:opacity-50"
                  />
                  <motion.button
                    type="submit"
                    disabled={isLoadingResponse || !supportMessage.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-600/25"
                  >
                    {isLoadingResponse ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </motion.button>
                </form>

                {/* Clear Chat Button */}
                {chatHistory.length > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearChatHistory}
                    className="mt-4 w-full px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4 inline mr-2" />
                    Clear Chat History
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Support;
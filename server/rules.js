// Rule-based chatbot engine.
// Each rule has a list of patterns (strings or regexes) and a reply
// (a string, an array of strings to pick from, or a function).
// Rules are checked in order; the first match wins.

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const rules = [
  // Specific topics go first so they win over generic ones like "hi".
  {
    name: 'chennai',
    patterns: [/\bchennai\b/i, /\bmadras\b/i],
    reply:
      'Chennai is the capital of Tamil Nadu, India, on the Bay of Bengal coast. Known for Marina Beach, Kapaleeshwarar Temple, Fort St. George, Carnatic music, and South Indian food like idli, dosa and filter coffee. Best time to visit: November to February.',
  },
  {
    name: 'greeting',
    patterns: [/\b(hi|hello|hey|hola|namaste|good (morning|afternoon|evening))\b/i],
    reply: [
      'Hello! 👋 How can I help you today?',
      'Hi there! What can I do for you?',
      'Hey! Nice to see you. Ask me anything.',
    ],
  },
  {
    name: 'how_are_you',
    patterns: [/\bhow are (you|u)\b/i, /\bhow('s| is) it going\b/i, /\bwhat'?s up\b/i],
    reply: [
      "I'm doing great, thanks for asking! How about you?",
      "All systems running smoothly. How can I help?",
    ],
  },
  {
    name: 'name',
    patterns: [/\b(your name|who are you|what are you)\b/i],
    reply: "I'm RuleBot, a simple rule-based chatbot built with Node.js and React.",
  },
  {
    name: 'help',
    patterns: [/\b(help|options|menu|what can you do)\b/i],
    reply:
      'I can help with: 🕒 business hours, 📍 location, 📞 contact info, 💰 pricing, 📦 order status, and a few jokes. Just ask!',
  },
  {
    name: 'hours',
    patterns: [/\b(hours|timing|timings|open|opening|close|closing)\b/i],
    reply: "We're open Monday to Saturday, 9:00 AM – 6:00 PM (IST). Closed on Sundays.",
  },
  {
    name: 'location',
    patterns: [/\b(where|location|address|located|find you)\b/i],
    reply: 'Our office is at 123 Main Street, Chennai, Tamil Nadu, India.',
  },
  {
    name: 'contact',
    patterns: [/\b(contact|phone|call|email|reach)\b/i],
    reply: 'You can reach us at support@example.com or call +91 12345 67890.',
  },
  {
    name: 'pricing',
    patterns: [/\b(price|pricing|cost|plans?|how much|fees?)\b/i],
    reply:
      'Our plans: Basic – ₹499/month, Pro – ₹999/month, Enterprise – custom pricing. Want details on any plan?',
  },
  {
    name: 'order_status',
    patterns: [/\b(order|track|tracking|delivery|shipment|shipping)\b/i],
    reply: (input) => {
      const match = input.match(/#?(\d{4,})/);
      return match
        ? `Order #${match[1]} is currently being processed and should ship within 2 business days. 📦`
        : 'Sure! Please share your order number (e.g. "order 12345") and I\'ll check the status.';
    },
  },
  {
    name: 'refund',
    patterns: [/\b(refund|return|cancel|cancellation)\b/i],
    reply: 'Refunds are accepted within 7 days of purchase. Email support@example.com with your order number to begin.',
  },
  {
    name: 'joke',
    patterns: [/\b(joke|funny|make me laugh)\b/i],
    reply: [
      'Why do programmers prefer dark mode? Because light attracts bugs! 🐛',
      "There are 10 kinds of people: those who understand binary and those who don't.",
      'Why did the developer go broke? He used up all his cache. 💸',
    ],
  },
  {
    name: 'thanks',
    patterns: [/\b(thanks|thank you|thx|appreciate)\b/i],
    reply: ["You're welcome! 😊", 'Happy to help!', 'Anytime!'],
  },
  {
    name: 'goodbye',
    patterns: [/\b(bye|goodbye|see you|cya|exit|quit)\b/i],
    reply: ['Goodbye! Have a great day! 👋', 'See you soon!', 'Bye! Come back anytime.'],
  },
];

const FALLBACK = [
  "Sorry, I didn't understand that. Try asking about hours, pricing, location, or type \"help\".",
  "Hmm, I don't have an answer for that yet. Type \"help\" to see what I can do.",
];

function getReply(input) {
  const text = String(input || '').trim();
  if (!text) return { reply: 'Please type something so I can help! 🙂', rule: 'empty' };

  for (const rule of rules) {
    const matched = rule.patterns.some((p) =>
      p instanceof RegExp ? p.test(text) : text.toLowerCase().includes(String(p).toLowerCase())
    );
    if (matched) {
      const r = rule.reply;
      const reply = typeof r === 'function' ? r(text) : Array.isArray(r) ? pick(r) : r;
      return { reply, rule: rule.name };
    }
  }
  return { reply: pick(FALLBACK), rule: 'fallback' };
}

const suggestions = ['Hello', 'Help', 'Business hours', 'Pricing', 'Track my order 12345', 'Tell me a joke'];

module.exports = { getReply, suggestions, rules };

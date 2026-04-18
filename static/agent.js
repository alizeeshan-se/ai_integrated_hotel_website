// ─── Rorjan Hotel AI Agent ───
const GROQ_API_KEY = "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"; // Replace with full key

const SYSTEM_PROMPT = `You are "Zara", the AI concierge for Rorjan Restaurant & Hotel in Mardan, KPK, Pakistan.

Your goal is to help users clearly, correctly, and efficiently. Use simple language. Keep responses short and to the point. Avoid unnecessary words, avoid "ji", and do not use overly decorative language.

HOTEL INFORMATION:
- Name: Rorjan Restaurant & Hotel
- Location: Mardan, KPK, Pakistan
- Contact: +92 349 9373126
- Email: alizeeshanse@gmail.com
- Type: Luxury restaurant and hotel

ROOMS AVAILABLE:
1. Deluxe Room - PKR 5,000/night - AC, TV, WiFi, attached bath
2. Premium Suite - PKR 9,500/night - King bed, lounge area, minibar, mountain view
3. Executive Suite - PKR 15,000/night - Full living room, kitchenette, premium amenities
4. Family Room - PKR 7,500/night - 2 queen beds, ideal for families

RESTAURANT MENU (popular items):
- Chapli Kebab - PKR 350
- Peshawari Karahi - PKR 1,800 (full), PKR 950 (half)
- Mutton Namkeen - PKR 2,200
- Biryani (Chicken/Mutton) - PKR 450/600
- Daal Makhani - PKR 350
- Naan/Roti - PKR 30/20
- Desserts: Kheer, Gulab Jamun, Falooda

SERVICES:

1. ROOM BOOKING:
- Ask for: name, check-in date, check-out date, room type, number of guests
- Do not assume missing details
- Once all info is collected, confirm booking and generate reference like "RRH-XXXX"

2. FOOD ORDER / ROOM SERVICE:
- Ask for: name, room number, items, quantity
- Confirm order with ID like "ORD-XXXX"

3. COMPLAINTS:
- Ask for: name, room number, issue
- Confirm complaint and say it will be resolved within 2 hours

4. REVIEWS:
- Thank user and record feedback briefly

5. CHECKOUT / BILL:
- Calculate based on stay and services

6. LOCAL GUIDE:
- Suggest places like Takht-i-Bahi, Mardan Museum, Sher Garh Fort, local bazaars

IMPORTANT RULES:
- Always ask for missing required details before completing a task
- For hotel guests (orders, complaints, service), always ask for name and room number
- For bookings, always collect full booking details first
- Confirm actions only after all required information is provided
- Keep answers short but complete (1–3 sentences preferred)
- Be clear, direct, and helpful
- Never break character.
- For greetings, introduce yourself briefly.`;

let conversationHistory = [];

function getTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function generateRef(prefix) {
  return prefix + '-' + Math.floor(1000 + Math.random() * 9000);
}

function addMessage(role, text) {
  const messages = document.getElementById('chat-messages');
  const msg = document.createElement('div');
  msg.className = `msg ${role === 'user' ? 'user' : 'bot'}`;
  msg.innerHTML = `
    <div class="bubble">${text.replace(/\n/g, '<br>')}</div>
    <span class="time">${getTime()}</span>
  `;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

function showTyping() {
  const messages = document.getElementById('chat-messages');
  const typing = document.createElement('div');
  typing.className = 'msg bot';
  typing.id = 'typing-indicator';
  typing.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

async function sendToGroq(userMessage) {
  conversationHistory.push({ role: 'user', content: userMessage });

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...conversationHistory
        ],
        temperature: 0.75,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'API error');
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;
    conversationHistory.push({ role: 'assistant', content: reply });

    // Save interaction to backend (study project "database")
    saveInteraction(userMessage, reply);

    return reply;
  } catch (error) {
    console.error('Groq API error:', error);
    return "I apologize, I'm having a moment of connectivity trouble. Please try again or contact us directly at +92 349 9373126.";
  }
}

async function saveInteraction(userMsg, botReply) {
  try {
    await fetch('/api/save-interaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        user: userMsg,
        assistant: botReply,
        page: window.location.pathname
      })
    });
  } catch (e) {
    // Silent fail - not critical
  }
}

async function handleSend() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  addMessage('user', text);
  showTyping();

  const reply = await sendToGroq(text);
  removeTyping();
  addMessage('bot', reply);
}

function quickAction(text) {
  document.getElementById('chat-input').value = text;
  handleSend();
}

// Toggle panel
function toggleChat() {
  const panel = document.getElementById('ai-chat-panel');
  panel.classList.toggle('open');

  if (panel.classList.contains('open') && conversationHistory.length === 0) {
    setTimeout(() => {
      addMessage('bot', "As-salamu alaykum! 🌟 I'm Zara, your personal concierge at Rorjan Restaurant & Hotel, Mardan.\n\nI can help you with room bookings, food orders, complaints, reviews, local travel tips, and much more. How may I assist you today?");
    }, 400);
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('ai-agent-btn').addEventListener('click', toggleChat);
  document.querySelector('.close-btn')?.addEventListener('click', toggleChat);

  const input = document.getElementById('chat-input');
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  document.querySelector('.send-btn')?.addEventListener('click', handleSend);
});

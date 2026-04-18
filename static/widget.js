// Agent Widget HTML — injected into every page
function injectAgentWidget() {
  const widget = `
  <!-- AI Agent Button -->
  <button id="ai-agent-btn" title="Chat with Zara — AI Concierge">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
      <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 18a8 8 0 110-16 8 8 0 010 16zM8 10h2v4H8zm6 0h2v4h-2z" style="display:none"/>
    </svg>
  </button>

  <!-- AI Chat Panel -->
  <div id="ai-chat-panel">
    <div class="chat-header">
      <div class="agent-avatar">🌟</div>
      <div class="agent-info">
        <h4>Zara — AI Concierge</h4>
        <span>● Online Now</span>
      </div>
      <button class="close-btn" onclick="toggleChat()">✕</button>
    </div>

    <div class="quick-actions">
      <button class="quick-btn" onclick="quickAction('I want to book a room')">🛏 Book Room</button>
      <button class="quick-btn" onclick="quickAction('I want to order food')">🍽 Order Food</button>
      <button class="quick-btn" onclick="quickAction('I have a complaint')">📢 Complaint</button>
      <button class="quick-btn" onclick="quickAction('I want to leave a review')">⭐ Review</button>
      <button class="quick-btn" onclick="quickAction('What are local attractions in Mardan?')">🗺 Explore</button>
    </div>

    <div class="chat-messages" id="chat-messages"></div>

    <div class="chat-input-area">
      <input type="text" id="chat-input" placeholder="Ask Zara anything..." autocomplete="off"/>
      <button class="send-btn">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML('beforeend', widget);
}

document.addEventListener('DOMContentLoaded', injectAgentWidget);

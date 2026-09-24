/**
 * SkillBridge Interactive Chat Messenger Controller
 * Contacts list, message rendering, sending, and realistic dummy replies
 */

let activeChatId = 'chat_01';

document.addEventListener('DOMContentLoaded', () => {
  // Check for contact query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const contactParam = urlParams.get('contact');

  const chats = SkillBridgeDB.getChats();
  if (contactParam) {
    const found = chats.find(c => c.contactId === contactParam);
    if (found) {
      activeChatId = found.id;
    }
  }

  renderChatContacts();
  renderActiveConversation();

  // Chat message input listener
  const chatForm = document.getElementById('chat-form');
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSendMessage();
    });
  }

  // Contact search input
  const contactSearch = document.getElementById('chat-contact-search');
  if (contactSearch) {
    contactSearch.addEventListener('input', (e) => {
      renderChatContacts(e.target.value.toLowerCase().trim());
    });
  }
});

function renderChatContacts(filterQuery = '') {
  const chats = SkillBridgeDB.getChats();
  const contactsList = document.getElementById('chat-contacts-list');
  if (!contactsList) return;

  const filtered = chats.filter(c => {
    return !filterQuery || 
      c.contactName.toLowerCase().includes(filterQuery) ||
      c.exchangeSkill.toLowerCase().includes(filterQuery);
  });

  contactsList.innerHTML = filtered.map(chat => `
    <div class="chat-contact-item ${chat.id === activeChatId ? 'active' : ''}" onclick="selectConversation('${chat.id}')">
      <div class="contact-avatar-wrap">
        <img src="${chat.contactAvatar}" class="user-avatar" alt="${chat.contactName}">
        <span class="online-dot ${chat.isOnline ? '' : 'offline'}"></span>
      </div>
      <div class="chat-contact-info">
        <div class="chat-contact-top">
          <div class="chat-contact-name">${chat.contactName}</div>
          <div class="chat-contact-time">${chat.lastTime || '10:42 AM'}</div>
        </div>
        <div class="chat-contact-last-msg">${chat.lastMessage || 'Start conversation...'}</div>
        <div class="chat-skill-badge">${chat.exchangeSkill}</div>
      </div>
      ${chat.unreadCount > 0 ? `<div class="chat-unread-count">${chat.unreadCount}</div>` : ''}
    </div>
  `).join('');
}

function selectConversation(chatId) {
  activeChatId = chatId;
  const chats = SkillBridgeDB.getChats();
  const activeChat = chats.find(c => c.id === chatId);
  if (activeChat) {
    activeChat.unreadCount = 0;
    SkillBridgeDB.updateChats(chats);
    updateGlobalBadgeCounts();
  }

  renderChatContacts();
  renderActiveConversation();

  // Switch mobile view if applicable
  const container = document.querySelector('.chat-container');
  if (container) container.classList.add('chat-active-view');
}

function renderActiveConversation() {
  const chats = SkillBridgeDB.getChats();
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];
  if (!activeChat) return;

  // Header info
  const nameEl = document.getElementById('chat-header-name');
  if (nameEl) nameEl.textContent = activeChat.contactName;

  const statusEl = document.getElementById('chat-header-status');
  if (statusEl) statusEl.textContent = activeChat.isOnline ? 'Online on campus' : 'Offline';

  const avatarEl = document.getElementById('chat-header-avatar');
  if (avatarEl) {
    avatarEl.src = activeChat.contactAvatar;
    avatarEl.alt = activeChat.contactName;
  }

  const exchangeEl = document.getElementById('chat-header-exchange');
  if (exchangeEl) {
    exchangeEl.innerHTML = `Barter: <span class="highlight">${activeChat.exchangeSkill}</span>`;
  }

  // Render messages
  const msgArea = document.getElementById('chat-messages-area');
  if (!msgArea) return;

  msgArea.innerHTML = `
    <div class="chat-date-separator">
      <span>Exchange Discussion Started</span>
    </div>
    ${(activeChat.messages || []).map(msg => {
      const isMe = msg.sender === 'me';
      return `
        <div class="message-bubble-group ${isMe ? 'sent' : 'received'}">
          <div class="message-bubble">
            ${escapeHTML(msg.text)}
            <div class="message-time">
              ${msg.time || '10:45 AM'} ${isMe ? '✓✓' : ''}
            </div>
          </div>
        </div>
      `;
    }).join('')}
  `;

  // Scroll to bottom
  msgArea.scrollTop = msgArea.scrollHeight;
}

function handleSendMessage() {
  const input = document.getElementById('chat-message-input');
  const text = input.value.trim();
  if (!text) return;

  const chats = SkillBridgeDB.getChats();
  const activeChat = chats.find(c => c.id === activeChatId);
  if (!activeChat) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add my message
  const myMsg = {
    id: 'm_' + Date.now(),
    sender: 'me',
    text: text,
    time: timeStr
  };

  activeChat.messages.push(myMsg);
  activeChat.lastMessage = text;
  activeChat.lastTime = timeStr;
  SkillBridgeDB.updateChats(chats);

  input.value = '';
  renderActiveConversation();
  renderChatContacts();

  // Simulated Peer Auto-Reply
  setTimeout(() => {
    const peerReplies = [
      "Sounds like a plan! Let's meet at the library 2nd floor study tables.",
      "Got it! I am reviewing the code files you mentioned.",
      "Awesome, see you then! Feel free to ping if you have any questions beforehand.",
      "Perfect timing! I just set up the shared project repository."
    ];
    const randomReply = peerReplies[Math.floor(Math.random() * peerReplies.length)];

    const replyMsg = {
      id: 'm_' + Date.now(),
      sender: 'them',
      text: randomReply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    activeChat.messages.push(replyMsg);
    activeChat.lastMessage = randomReply;
    activeChat.lastTime = replyMsg.time;
    SkillBridgeDB.updateChats(chats);

    renderActiveConversation();
    renderChatContacts();
    showToast(`New Message from ${activeChat.contactName}`, randomReply, 'info');
  }, 1400);
}

function backToContacts() {
  const container = document.querySelector('.chat-container');
  if (container) container.classList.remove('chat-active-view');
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/**
 * SkillBridge Global Application Helpers
 * UI interactions, toast notifications, modals, and common handlers
 */

// Initialize Toast Container
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('toast-container')) {
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  // Setup mobile navigation toggle for public pages
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Setup sidebar toggle for dashboard pages
  const sidebarToggleBtn = document.querySelector('.sidebar-toggle-btn');
  const sidebar = document.querySelector('.sidebar');
  const sidebarClose = document.querySelector('.sidebar-close');

  if (sidebarToggleBtn && sidebar) {
    sidebarToggleBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
    });
  }

  if (sidebarClose && sidebar) {
    sidebarClose.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }

  // Close modals when clicking backdrop or close buttons
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });

    const closeBtn = backdrop.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        closeModal(backdrop.id);
      });
    }
  });

  // Update notification badge counter if in dashboard
  updateGlobalBadgeCounts();
});

/**
 * Toast Notification function
 * @param {string} title - Header of toast
 * @param {string} message - Details of toast
 * @param {string} type - 'success' | 'error' | 'warning' | 'info'
 */
function showToast(title, message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`,
    error: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`,
    warning: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`,
    info: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
  };

  toast.innerHTML = `
    <div class="toast-icon">${iconMap[type] || iconMap.info}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
  `;

  container.appendChild(toast);

  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * Open Modal Dialog
 * @param {string} modalId
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Close Modal Dialog
 * @param {string} modalId
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

/**
 * Render Interactive or Readonly Star Rating
 */
function createStarRatingHTML(rating, isInteractive = false, onSelectCallback = null) {
  let starsHtml = '';
  const fullStars = Math.round(rating);

  for (let i = 1; i <= 5; i++) {
    const isFilled = i <= fullStars ? 'filled' : '';
    starsHtml += `<span class="star ${isFilled}" data-value="${i}">★</span>`;
  }

  const container = document.createElement('div');
  container.className = `star-rating ${isInteractive ? 'interactive' : 'readonly'}`;
  container.innerHTML = starsHtml;

  if (isInteractive && onSelectCallback) {
    const starEls = container.querySelectorAll('.star');
    starEls.forEach(star => {
      star.addEventListener('mouseenter', () => {
        const val = parseInt(star.getAttribute('data-value'));
        starEls.forEach(s => {
          s.classList.toggle('hovered', parseInt(s.getAttribute('data-value')) <= val);
        });
      });

      star.addEventListener('mouseleave', () => {
        starEls.forEach(s => s.classList.remove('hovered'));
      });

      star.addEventListener('click', () => {
        const val = parseInt(star.getAttribute('data-value'));
        starEls.forEach(s => {
          s.classList.toggle('filled', parseInt(s.getAttribute('data-value')) <= val);
        });
        onSelectCallback(val);
      });
    });
  }

  return container;
}

/**
 * Update global unread badge counters across topbar & sidebar
 */
function updateGlobalBadgeCounts() {
  if (typeof SkillBridgeDB === 'undefined') return;

  const notifs = SkillBridgeDB.getNotifications();
  const unreadNotifs = notifs.filter(n => !n.read).length;
  const notifBadge = document.getElementById('topbar-notif-badge');
  if (notifBadge) {
    notifBadge.style.display = unreadNotifs > 0 ? 'block' : 'none';
  }

  const reqs = SkillBridgeDB.getRequests();
  const pendingIncoming = reqs.filter(r => r.type === 'incoming' && r.status === 'pending').length;
  const reqBadge = document.getElementById('sidebar-request-badge');
  if (reqBadge) {
    reqBadge.textContent = pendingIncoming;
    reqBadge.style.display = pendingIncoming > 0 ? 'inline-block' : 'none';
  }

  const chats = SkillBridgeDB.getChats();
  const totalUnreadChat = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const chatBadge = document.getElementById('sidebar-chat-badge');
  if (chatBadge) {
    chatBadge.textContent = totalUnreadChat;
    chatBadge.style.display = totalUnreadChat > 0 ? 'inline-block' : 'none';
  }
}

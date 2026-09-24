/**
 * SkillBridge Notifications Controller
 * Filtering, reading, and clearing alerts
 */

let activeNotifFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  renderNotifications();

  // Filter buttons
  document.querySelectorAll('.notif-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.notif-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeNotifFilter = btn.getAttribute('data-filter');
      renderNotifications();
    });
  });
});

function renderNotifications() {
  const allNotifs = SkillBridgeDB.getNotifications();
  const container = document.getElementById('notifications-list');
  if (!container) return;

  let list = allNotifs;
  if (activeNotifFilter === 'unread') {
    list = list.filter(n => !n.read);
  } else if (activeNotifFilter !== 'all') {
    list = list.filter(n => n.type === activeNotifFilter);
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 2rem; background: var(--white); border-radius: var(--radius-lg); border: 1px dashed var(--slate-300);">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔔</div>
        <h3>No Notifications Found</h3>
        <p class="text-sm text-muted">You are all caught up on your campus exchanges!</p>
      </div>
    `;
    return;
  }

  const iconMap = {
    request: '🤝',
    message: '💬',
    success: '✓',
    badge: '🏆'
  };

  container.innerHTML = list.map(item => `
    <div class="card card-hover" style="padding: 1.25rem 1.5rem; display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; border-left: 4px solid ${item.read ? 'var(--slate-200)' : 'var(--primary)'}; background: ${item.read ? 'var(--white)' : '#fafcff'};">
      <div style="display: flex; gap: 1rem; align-items: flex-start; flex: 1;">
        <div style="width: 40px; height: 40px; border-radius: var(--radius-md); background: ${item.read ? 'var(--slate-100)' : 'var(--primary-light)'}; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0;">
          ${iconMap[item.type] || '📌'}
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.2rem;">
            <h4 style="font-size: 0.95rem; color: var(--navy-900);">${item.title}</h4>
            ${!item.read ? '<span style="width: 8px; height: 8px; border-radius: 50%; background: var(--primary);" title="Unread"></span>' : ''}
          </div>
          <p class="text-sm" style="color: var(--navy-700); margin-bottom: 0.35rem;">${item.message}</p>
          <span class="text-xs text-muted">${item.time}</span>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <a href="${item.link || '#'}" class="btn btn-outline btn-sm" onclick="markOneRead('${item.id}')">View</a>
        <button class="btn btn-secondary btn-sm" onclick="dismissOne('${item.id}')" title="Dismiss">✕</button>
      </div>
    </div>
  `).join('');
}

function markAllAsRead() {
  const notifs = SkillBridgeDB.getNotifications();
  notifs.forEach(n => n.read = true);
  SkillBridgeDB.updateNotifications(notifs);
  showToast('Notifications Marked', 'All notifications marked as read.', 'info');
  renderNotifications();
  updateGlobalBadgeCounts();
}

function clearAllNotifications() {
  if (confirm('Clear all notifications?')) {
    SkillBridgeDB.updateNotifications([]);
    showToast('Notifications Cleared', 'All alerts have been cleared.', 'info');
    renderNotifications();
    updateGlobalBadgeCounts();
  }
}

function markOneRead(id) {
  const notifs = SkillBridgeDB.getNotifications();
  const target = notifs.find(n => n.id === id);
  if (target) {
    target.read = true;
    SkillBridgeDB.updateNotifications(notifs);
    updateGlobalBadgeCounts();
  }
}

function dismissOne(id) {
  const notifs = SkillBridgeDB.getNotifications();
  const updated = notifs.filter(n => n.id !== id);
  SkillBridgeDB.updateNotifications(updated);
  renderNotifications();
  updateGlobalBadgeCounts();
}

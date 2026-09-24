/**
 * SkillBridge Learning Requests Controller
 * Handles Incoming & Outgoing requests, tabs, and Accept/Decline actions
 */

let activeRequestTab = 'incoming';
let activeStatusFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  renderRequests();

  // Tab toggling
  const tabIncoming = document.getElementById('tab-req-incoming');
  const tabOutgoing = document.getElementById('tab-req-outgoing');

  if (tabIncoming) {
    tabIncoming.addEventListener('click', () => {
      activeRequestTab = 'incoming';
      tabIncoming.classList.add('active');
      tabOutgoing.classList.remove('active');
      renderRequests();
    });
  }

  if (tabOutgoing) {
    tabOutgoing.addEventListener('click', () => {
      activeRequestTab = 'outgoing';
      tabOutgoing.classList.add('active');
      tabIncoming.classList.remove('active');
      renderRequests();
    });
  }

  // Status Filter buttons
  document.querySelectorAll('.status-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.status-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeStatusFilter = btn.getAttribute('data-status');
      renderRequests();
    });
  });
});

function renderRequests() {
  const allRequests = SkillBridgeDB.getRequests();
  const container = document.getElementById('requests-list-container');
  if (!container) return;

  // Filter by type
  let list = allRequests.filter(r => r.type === activeRequestTab);

  // Filter by status
  if (activeStatusFilter !== 'all') {
    list = list.filter(r => r.status === activeStatusFilter);
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 2rem; background: var(--white); border-radius: var(--radius-lg); border: 1px dashed var(--slate-300);">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📬</div>
        <h3>No ${activeStatusFilter !== 'all' ? activeStatusFilter : ''} Requests Found</h3>
        <p class="text-sm text-muted" style="margin-bottom: 1.25rem;">
          ${activeRequestTab === 'incoming' 
            ? 'When other students want to exchange skills with you, their proposals will appear here.'
            : 'You haven’t sent any exchange requests matching this criteria.'}
        </p>
        <a href="search-skills.html" class="btn btn-primary btn-sm">Explore Skills to Barter</a>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(req => {
    const isIncoming = req.type === 'incoming';
    const partnerName = isIncoming ? req.senderName : req.receiverName;
    const partnerAvatar = isIncoming ? req.senderAvatar : req.receiverAvatar;
    const partnerDept = isIncoming ? req.senderDept : req.receiverDept;
    const partnerId = isIncoming ? req.senderId : req.receiverId;

    let badgeClass = 'badge-pending';
    let badgeText = 'Pending Approval';
    if (req.status === 'accepted') {
      badgeClass = 'badge-accepted';
      badgeText = 'Accepted & Active';
    } else if (req.status === 'rejected') {
      badgeClass = 'badge-rejected';
      badgeText = 'Declined';
    }

    return `
      <div class="request-card">
        <div class="request-main">
          <img src="${partnerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}" class="user-avatar user-avatar-lg" alt="${partnerName}">
          <div class="request-details">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
              <h3 style="font-size: 1.15rem;">${partnerName}</h3>
              <span class="badge ${badgeClass}">${badgeText}</span>
              <span class="text-xs text-muted">Submitted ${req.createdAt || 'recently'}</span>
            </div>

            <div class="text-xs text-muted" style="margin-bottom: 0.75rem;">${partnerDept}</div>

            <div style="background: var(--slate-50); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--slate-200); margin-bottom: 0.85rem;">
              <div class="request-exchange-info" style="margin-bottom: 0.4rem;">
                <span class="tag tag-teach"><strong>${isIncoming ? partnerName + ' Teaches' : 'You Learn'}:</strong> ${isIncoming ? req.offeredSkill : req.requestedSkill}</span>
                <span>⇄</span>
                <span class="tag tag-learn"><strong>${isIncoming ? 'You Teach' : partnerName + ' Learns'}:</strong> ${isIncoming ? req.requestedSkill : req.offeredSkill}</span>
              </div>
              <div class="text-xs" style="color: var(--navy-800);">
                <strong>Proposed Schedule:</strong> ${req.proposedSchedule || 'Flexible'}
              </div>
              ${req.message ? `
                <div class="text-xs text-muted" style="margin-top: 0.35rem; font-style: italic;">
                  "${req.message}"
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="request-actions">
          ${isIncoming && req.status === 'pending' ? `
            <button class="btn btn-success btn-sm" onclick="acceptRequest('${req.id}')">Accept Barter</button>
            <button class="btn btn-danger-outline btn-sm" onclick="rejectRequest('${req.id}')">Decline</button>
          ` : ''}

          ${!isIncoming && req.status === 'pending' ? `
            <button class="btn btn-secondary btn-sm" onclick="cancelRequest('${req.id}')">Cancel Request</button>
          ` : ''}

          ${req.status === 'accepted' ? `
            <a href="chat.html?contact=${partnerId}" class="btn btn-primary btn-sm">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              Chat & Coordinate
            </a>
            <button class="btn btn-secondary btn-sm" onclick="completeExchange('${req.id}', '${partnerName}')">
              Mark Completed
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function acceptRequest(reqId) {
  const reqs = SkillBridgeDB.getRequests();
  const target = reqs.find(r => r.id === reqId);
  if (target) {
    target.status = 'accepted';
    SkillBridgeDB.updateRequests(reqs);
    showToast('Barter Accepted!', `You accepted the skill barter offer with ${target.senderName}. Check your Chat to arrange a session!`, 'success');
    renderRequests();
    updateGlobalBadgeCounts();
  }
}

function rejectRequest(reqId) {
  const reqs = SkillBridgeDB.getRequests();
  const target = reqs.find(r => r.id === reqId);
  if (target) {
    target.status = 'rejected';
    SkillBridgeDB.updateRequests(reqs);
    showToast('Request Declined', 'You declined this learning request.', 'warning');
    renderRequests();
    updateGlobalBadgeCounts();
  }
}

function cancelRequest(reqId) {
  const reqs = SkillBridgeDB.getRequests();
  const updated = reqs.filter(r => r.id !== reqId);
  SkillBridgeDB.updateRequests(updated);
  showToast('Request Cancelled', 'Your outgoing request was cancelled.', 'info');
  renderRequests();
  updateGlobalBadgeCounts();
}

function completeExchange(reqId, partnerName) {
  showToast('Exchange Completed', `Congratulations on completing your exchange session with ${partnerName}! Please leave a rating & review.`, 'success');
  setTimeout(() => {
    window.location.href = 'reviews.html';
  }, 1200);
}

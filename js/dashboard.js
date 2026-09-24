/**
 * SkillBridge Student Dashboard Controller
 * Hydrates metrics, active requests, suggested matches, and recent activity
 */

document.addEventListener('DOMContentLoaded', () => {
  renderStudentDashboard();
});

function renderStudentDashboard() {
  const user = SkillBridgeDB.getCurrentUser();
  const requests = SkillBridgeDB.getRequests();
  const skills = SkillBridgeDB.getSkills();
  const reviews = SkillBridgeDB.getReviews();

  // Populate User Profile Header
  const welcomeName = document.getElementById('user-welcome-name');
  if (welcomeName) welcomeName.textContent = user.name;

  const sidebarUserName = document.getElementById('sidebar-user-name');
  if (sidebarUserName) sidebarUserName.textContent = user.name;

  const sidebarUserRole = document.getElementById('sidebar-user-role');
  if (sidebarUserRole) sidebarUserRole.textContent = `${user.department} • ${user.year}`;

  const userAvatars = document.querySelectorAll('.dynamic-user-avatar');
  userAvatars.forEach(img => {
    img.src = user.avatar;
    img.alt = user.name;
  });

  // Calculate & Set Metrics
  const activeExchanges = requests.filter(r => r.status === 'accepted').length;
  const pendingRequests = requests.filter(r => r.type === 'incoming' && r.status === 'pending').length;

  const statActive = document.getElementById('stat-active-exchanges');
  if (statActive) statActive.textContent = activeExchanges;

  const statTeaching = document.getElementById('stat-teaching-skills');
  if (statTeaching) statTeaching.textContent = user.teachSkills ? user.teachSkills.length : 4;

  const statHours = document.getElementById('stat-hours');
  if (statHours) statHours.textContent = user.exchangesCompleted ? `${user.exchangesCompleted * 1.5}h` : '27h';

  const statRating = document.getElementById('stat-rating');
  if (statRating) statRating.textContent = `${user.rating || 4.9} ★`;

  // Render Pending & Active Requests Preview
  const requestsContainer = document.getElementById('dashboard-requests-list');
  if (requestsContainer) {
    const recentRequests = requests.slice(0, 3);
    if (recentRequests.length === 0) {
      requestsContainer.innerHTML = `<div class="p-4 text-center text-muted">No exchange requests yet. <a href="search-skills.html">Explore skills</a> to send one!</div>`;
    } else {
      requestsContainer.innerHTML = recentRequests.map(req => {
        const isIncoming = req.type === 'incoming';
        const partnerName = isIncoming ? req.senderName : req.receiverName;
        const partnerAvatar = isIncoming ? req.senderAvatar : req.receiverAvatar;
        const partnerDept = isIncoming ? req.senderDept : req.receiverDept;

        let statusBadge = '';
        if (req.status === 'pending') {
          statusBadge = `<span class="badge badge-pending">Pending Review</span>`;
        } else if (req.status === 'accepted') {
          statusBadge = `<span class="badge badge-accepted">Active Exchange</span>`;
        } else {
          statusBadge = `<span class="badge badge-rejected">Declined</span>`;
        }

        return `
          <div class="request-card" style="padding: 1.15rem 1.25rem;">
            <div class="request-main">
              <img src="${partnerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}" class="user-avatar" alt="${partnerName}">
              <div class="request-details">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.2rem;">
                  <h4 style="font-size: 0.95rem;">${partnerName}</h4>
                  ${statusBadge}
                </div>
                <div class="text-xs text-muted">${partnerDept}</div>
                <div class="request-exchange-info" style="margin-top: 0.35rem;">
                  <span class="tag tag-teach">Teaches: ${isIncoming ? req.offeredSkill : req.requestedSkill}</span>
                  <span>⇄</span>
                  <span class="tag tag-learn">Learns: ${isIncoming ? req.requestedSkill : req.offeredSkill}</span>
                </div>
              </div>
            </div>
            <div class="request-actions">
              ${req.status === 'pending' && isIncoming ? `
                <button class="btn btn-success btn-sm" onclick="quickAcceptRequest('${req.id}')">Accept</button>
                <button class="btn btn-danger-outline btn-sm" onclick="quickDeclineRequest('${req.id}')">Decline</button>
              ` : `
                <a href="requests.html" class="btn btn-outline btn-sm">View Details</a>
              `}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Render Suggested Skill Matches (Matching what user wants to learn)
  const matchesContainer = document.getElementById('dashboard-matches-grid');
  if (matchesContainer) {
    const matchedSkills = skills.filter(s => s.mentorId !== user.id).slice(0, 3);
    matchesContainer.innerHTML = matchedSkills.map(skill => `
      <div class="card card-hover" style="display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <span class="badge badge-primary">${skill.category}</span>
          <span style="color: #f59e0b; font-weight: 700; font-size: 0.85rem;">★ ${skill.rating}</span>
        </div>
        <h4 style="font-size: 1.05rem; margin-bottom: 0.25rem;">${skill.title}</h4>
        <p class="text-xs text-muted" style="margin-bottom: 0.85rem;">Mentored by <strong>${skill.mentorName}</strong> (${skill.mentorDept})</p>
        <p class="text-xs" style="color: var(--navy-600); margin-bottom: 1rem; flex: 1;">${skill.description}</p>
        <div style="background: var(--slate-50); padding: 0.5rem 0.75rem; border-radius: 6px; font-size: 0.75rem; margin-bottom: 1rem;">
          <span class="text-muted">Seeking in return:</span> <strong>${skill.seekingSkill}</strong>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <a href="search-skills.html?skill=${encodeURIComponent(skill.id)}" class="btn btn-primary btn-sm" style="flex: 1;">Request Barter</a>
          <a href="chat.html?contact=${skill.mentorId}" class="btn btn-secondary btn-sm" title="Direct Message">💬</a>
        </div>
      </div>
    `).join('');
  }

  // Render Recent Activity Feed
  const activityContainer = document.getElementById('dashboard-activity-feed');
  if (activityContainer) {
    activityContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; gap: 0.75rem; font-size: 0.85rem;">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--success); margin-top: 6px;"></div>
          <div>
            <strong>Sarah Chen</strong> accepted your exchange request for <em>Python Machine Learning</em>.
            <div class="text-xs text-muted">Yesterday at 4:30 PM</div>
          </div>
        </div>
        <div style="display: flex; gap: 0.75rem; font-size: 0.85rem;">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--primary); margin-top: 6px;"></div>
          <div>
            You received a <strong>5-Star Review</strong> from <strong>Liam O’Connor</strong> on <em>Node.js & REST APIs</em>.
            <div class="text-xs text-muted">3 days ago</div>
          </div>
        </div>
        <div style="display: flex; gap: 0.75rem; font-size: 0.85rem;">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--warning); margin-top: 6px;"></div>
          <div>
            <strong>Marcus Vance</strong> proposed a new barter session for <em>React.js ⇄ Figma</em>.
            <div class="text-xs text-muted">4 hours ago</div>
          </div>
        </div>
      </div>
    `;
  }
}

function quickAcceptRequest(reqId) {
  const reqs = SkillBridgeDB.getRequests();
  const target = reqs.find(r => r.id === reqId);
  if (target) {
    target.status = 'accepted';
    SkillBridgeDB.updateRequests(reqs);
    showToast('Request Accepted', `You agreed to exchange skills with ${target.senderName}!`, 'success');
    renderStudentDashboard();
    updateGlobalBadgeCounts();
  }
}

function quickDeclineRequest(reqId) {
  const reqs = SkillBridgeDB.getRequests();
  const target = reqs.find(r => r.id === reqId);
  if (target) {
    target.status = 'rejected';
    SkillBridgeDB.updateRequests(reqs);
    showToast('Request Declined', `You declined the exchange request.`, 'warning');
    renderStudentDashboard();
    updateGlobalBadgeCounts();
  }
}

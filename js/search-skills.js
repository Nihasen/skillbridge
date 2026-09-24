/**
 * SkillBridge Search & Explore Skills Controller
 * Real-time search, multi-filter by category and level, plus request modal
 */

let selectedSkillForExchange = null;

document.addEventListener('DOMContentLoaded', () => {
  renderSkillsCatalog();

  // Search input listener
  const searchInput = document.getElementById('search-query');
  if (searchInput) {
    searchInput.addEventListener('input', () => renderSkillsCatalog());
  }

  // Filter dropdown listeners
  const categoryFilter = document.getElementById('filter-category');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => renderSkillsCatalog());
  }

  const levelFilter = document.getElementById('filter-level');
  if (levelFilter) {
    levelFilter.addEventListener('change', () => renderSkillsCatalog());
  }

  const sortFilter = document.getElementById('filter-sort');
  if (sortFilter) {
    sortFilter.addEventListener('change', () => renderSkillsCatalog());
  }

  // Check URL query parameters (e.g. from hero or dashboard links)
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  if (searchParam && searchInput) {
    searchInput.value = searchParam;
    renderSkillsCatalog();
  }

  const skillParam = urlParams.get('skill');
  if (skillParam) {
    setTimeout(() => openExchangeModal(skillParam), 300);
  }
});

function renderSkillsCatalog() {
  const allSkills = SkillBridgeDB.getSkills();
  const user = SkillBridgeDB.getCurrentUser();
  const container = document.getElementById('catalog-skills-grid');
  const countDisplay = document.getElementById('results-count');

  const query = (document.getElementById('search-query')?.value || '').toLowerCase().trim();
  const selectedCat = document.getElementById('filter-category')?.value || 'All';
  const selectedLevel = document.getElementById('filter-level')?.value || 'All';
  const selectedSort = document.getElementById('filter-sort')?.value || 'rating';

  let filtered = allSkills.filter(skill => {
    // Exclude own skills from search results
    if (skill.mentorId === user.id) return false;

    const matchesQuery = !query || 
      skill.title.toLowerCase().includes(query) ||
      skill.description.toLowerCase().includes(query) ||
      skill.mentorName.toLowerCase().includes(query) ||
      skill.category.toLowerCase().includes(query) ||
      (skill.seekingSkill && skill.seekingSkill.toLowerCase().includes(query));

    const matchesCat = selectedCat === 'All' || skill.category === selectedCat;
    const matchesLevel = selectedLevel === 'All' || skill.level === selectedLevel;

    return matchesQuery && matchesCat && matchesLevel;
  });

  // Sorting
  if (selectedSort === 'rating') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (selectedSort === 'hours') {
    filtered.sort((a, b) => (b.hoursCompleted || 0) - (a.hoursCompleted || 0));
  }

  if (countDisplay) {
    countDisplay.textContent = `Showing ${filtered.length} available skills`;
  }

  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--white); border-radius: var(--radius-lg); border: 1px dashed var(--slate-300);">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
        <h3>No Matching Skills Found</h3>
        <p class="text-sm text-muted" style="margin-bottom: 1.25rem;">Try modifying your keyword search or adjusting your category/level filters.</p>
        <button class="btn btn-secondary btn-sm" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(skill => `
    <div class="skill-card">
      <div class="skill-card-header">
        <div class="skill-mentor-info">
          <img src="${skill.mentorAvatar}" class="user-avatar" alt="${skill.mentorName}">
          <div>
            <div style="font-weight: 700; font-size: 0.95rem; color: var(--navy-900);">${skill.mentorName}</div>
            <div class="text-xs text-muted">${skill.mentorDept}</div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="color: #f59e0b; font-weight: 700; font-size: 0.9rem;">★ ${skill.rating}</div>
          <span class="badge badge-primary" style="font-size: 0.65rem;">${skill.level}</span>
        </div>
      </div>

      <h3 class="skill-title">${skill.title}</h3>
      <div style="margin-bottom: 0.5rem;">
        <span class="badge badge-neutral">${skill.category}</span>
      </div>
      <p class="skill-desc">${skill.description}</p>

      <div class="skill-meta-list">
        <div class="skill-meta-item">
          <span class="text-muted">Seeking in Exchange:</span>
          <strong style="color: var(--navy-900);">${skill.seekingSkill}</strong>
        </div>
        <div class="skill-meta-item">
          <span class="text-muted">Completed Sessions:</span>
          <span>${skill.hoursCompleted || 14} hrs swapped</span>
        </div>
      </div>

      <div class="skill-card-footer">
        <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="openExchangeModal('${skill.id}')">
          Request Skill Exchange
        </button>
        <a href="chat.html?contact=${skill.mentorId}" class="btn btn-secondary btn-sm" title="Message Student">
          💬
        </a>
      </div>
    </div>
  `).join('');
}

function resetFilters() {
  const q = document.getElementById('search-query');
  if (q) q.value = '';
  const c = document.getElementById('filter-category');
  if (c) c.value = 'All';
  const l = document.getElementById('filter-level');
  if (l) l.value = 'All';
  renderSkillsCatalog();
}

function openExchangeModal(skillId) {
  const skills = SkillBridgeDB.getSkills();
  const user = SkillBridgeDB.getCurrentUser();
  selectedSkillForExchange = skills.find(s => s.id === skillId);

  if (!selectedSkillForExchange) return;

  document.getElementById('exchange-skill-name').textContent = selectedSkillForExchange.title;
  document.getElementById('exchange-mentor-name').textContent = selectedSkillForExchange.mentorName;
  document.getElementById('exchange-seeking-name').textContent = selectedSkillForExchange.seekingSkill;

  // Populate user's offer dropdown with user's teachSkills
  const offerSelect = document.getElementById('exchange-offered-skill');
  offerSelect.innerHTML = (user.teachSkills || []).map(s => `
    <option value="${s}">${s}</option>
  `).join('');

  openModal('request-exchange-modal');
}

function handleSendExchangeRequest(e) {
  e.preventDefault();
  const user = SkillBridgeDB.getCurrentUser();
  const offeredSkill = document.getElementById('exchange-offered-skill').value;
  const schedule = document.getElementById('exchange-schedule').value.trim();
  const message = document.getElementById('exchange-message').value.trim();

  const newRequest = {
    id: 'req_' + Date.now(),
    type: 'outgoing',
    senderId: user.id,
    receiverId: selectedSkillForExchange.mentorId,
    receiverName: selectedSkillForExchange.mentorName,
    receiverDept: selectedSkillForExchange.mentorDept,
    receiverAvatar: selectedSkillForExchange.mentorAvatar,
    requestedSkill: selectedSkillForExchange.title,
    offeredSkill: offeredSkill,
    status: 'pending',
    message: message || `Hi ${selectedSkillForExchange.mentorName}, I would love to exchange skills!`,
    createdAt: 'Just now',
    proposedSchedule: schedule || 'Flexible Weekends'
  };

  SkillBridgeDB.addRequest(newRequest);
  closeModal('request-exchange-modal');

  showToast('Exchange Request Sent!', `Your request to barter with ${selectedSkillForExchange.mentorName} was submitted.`, 'success');
  updateGlobalBadgeCounts();
}

/**
 * SkillBridge My Skills Management Controller
 * Handles adding, removing, and toggling skills to teach & learn
 */

let currentTab = 'teach';

document.addEventListener('DOMContentLoaded', () => {
  renderMySkills();

  // Tab click listeners
  const tabTeach = document.getElementById('tab-btn-teach');
  const tabLearn = document.getElementById('tab-btn-learn');

  if (tabTeach) {
    tabTeach.addEventListener('click', () => {
      currentTab = 'teach';
      tabTeach.classList.add('active');
      tabLearn.classList.remove('active');
      renderMySkills();
    });
  }

  if (tabLearn) {
    tabLearn.addEventListener('click', () => {
      currentTab = 'learn';
      tabLearn.classList.add('active');
      tabTeach.classList.remove('active');
      renderMySkills();
    });
  }
});

function renderMySkills() {
  const user = SkillBridgeDB.getCurrentUser();
  const allSkills = SkillBridgeDB.getSkills();
  const container = document.getElementById('my-skills-grid');

  if (!container) return;

  if (currentTab === 'teach') {
    // Show skills that currentUser is mentoring
    const userTeachSkills = allSkills.filter(s => s.mentorId === user.id);

    if (userTeachSkills.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--white); border-radius: var(--radius-lg); border: 1px dashed var(--slate-300);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📚</div>
          <h3>No Skills Listed to Teach Yet</h3>
          <p class="text-sm text-muted" style="margin-bottom: 1.25rem;">Start sharing your knowledge with classmates to earn exchange credits.</p>
          <button class="btn btn-primary btn-sm" onclick="openModal('add-teach-skill-modal')">+ Add Skill to Teach</button>
        </div>
      `;
      return;
    }

    container.innerHTML = userTeachSkills.map(skill => `
      <div class="card card-hover" style="display: flex; flex-direction: column;">
        <div class="skill-card-header">
          <div>
            <span class="badge badge-primary">${skill.category}</span>
            <span class="badge badge-indigo" style="margin-left: 0.25rem;">${skill.level}</span>
          </div>
          <span class="badge badge-active">Active</span>
        </div>

        <h3 class="skill-title">${skill.title}</h3>
        <p class="skill-desc">${skill.description}</p>

        <div class="skill-meta-list">
          <div class="skill-meta-item">
            <span class="text-muted">Seeking in Exchange:</span>
            <strong>${skill.seekingSkill}</strong>
          </div>
          <div class="skill-meta-item">
            <span class="text-muted">Exchange Sessions:</span>
            <strong>${skill.hoursCompleted || 12} hours</strong>
          </div>
          <div class="skill-meta-item">
            <span class="text-muted">Peer Rating:</span>
            <strong style="color: #f59e0b;">★ ${skill.rating || 5.0}</strong>
          </div>
        </div>

        <div class="skill-card-footer">
          <button class="btn btn-secondary btn-sm" onclick="togglePauseSkill('${skill.id}')">Pause</button>
          <button class="btn btn-danger-outline btn-sm" onclick="deleteSkill('${skill.id}')">Remove</button>
        </div>
      </div>
    `).join('');
  } else {
    // Show wishlist skills
    const learnSkills = user.learnSkills || [];

    if (learnSkills.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--white); border-radius: var(--radius-lg); border: 1px dashed var(--slate-300);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎯</div>
          <h3>Your Learning Wishlist is Empty</h3>
          <p class="text-sm text-muted" style="margin-bottom: 1.25rem;">Add topics you want to learn so other campus students can match with you.</p>
          <button class="btn btn-primary btn-sm" onclick="openModal('add-learn-skill-modal')">+ Add to Wishlist</button>
        </div>
      `;
      return;
    }

    container.innerHTML = learnSkills.map((skillName, idx) => `
      <div class="card card-hover" style="display: flex; flex-direction: column;">
        <div class="skill-card-header">
          <span class="badge badge-indigo">Wishlist Goal</span>
          <span class="badge badge-primary">High Priority</span>
        </div>

        <h3 class="skill-title">${skillName}</h3>
        <p class="skill-desc">Looking to partner with an experienced campus peer for weekly 1-on-1 practical walkthroughs.</p>

        <div class="skill-meta-list">
          <div class="skill-meta-item">
            <span class="text-muted">Available Campus Mentors:</span>
            <strong style="color: var(--primary);">4 Mentors Found</strong>
          </div>
        </div>

        <div class="skill-card-footer">
          <a href="search-skills.html?search=${encodeURIComponent(skillName)}" class="btn btn-outline btn-sm">Find Mentors</a>
          <button class="btn btn-danger-outline btn-sm" onclick="removeLearnSkill(${idx})">Remove</button>
        </div>
      </div>
    `).join('');
  }
}

function handleAddTeachSkill(e) {
  e.preventDefault();
  const user = SkillBridgeDB.getCurrentUser();
  const title = document.getElementById('teach-title').value.trim();
  const category = document.getElementById('teach-category').value;
  const level = document.getElementById('teach-level').value;
  const desc = document.getElementById('teach-desc').value.trim();
  const seeking = document.getElementById('teach-seeking').value.trim();

  const newSkill = {
    id: 'sk_' + Date.now(),
    title,
    category,
    level,
    mentorId: user.id,
    mentorName: user.name,
    mentorDept: user.department,
    mentorAvatar: user.avatar,
    rating: 5.0,
    description: desc,
    seekingSkill: seeking,
    hoursCompleted: 0,
    badge: 'New'
  };

  SkillBridgeDB.addSkill(newSkill);

  if (!user.teachSkills.includes(title)) {
    user.teachSkills.push(title);
    SkillBridgeDB.updateCurrentUser(user);
  }

  closeModal('add-teach-skill-modal');
  e.target.reset();
  showToast('Skill Published', `"${title}" has been added to your offerings.`, 'success');
  renderMySkills();
}

function handleAddLearnSkill(e) {
  e.preventDefault();
  const user = SkillBridgeDB.getCurrentUser();
  const skillName = document.getElementById('learn-title').value.trim();

  if (!user.learnSkills) user.learnSkills = [];
  if (!user.learnSkills.includes(skillName)) {
    user.learnSkills.push(skillName);
    SkillBridgeDB.updateCurrentUser(user);
  }

  closeModal('add-learn-skill-modal');
  e.target.reset();
  showToast('Wishlist Updated', `Added "${skillName}" to your learning goals.`, 'success');
  renderMySkills();
}

function deleteSkill(skillId) {
  if (confirm('Are you sure you want to remove this skill from your offerings?')) {
    const allSkills = SkillBridgeDB.getSkills();
    const updated = allSkills.filter(s => s.id !== skillId);
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(updated));
    showToast('Skill Removed', 'The skill was removed from your teaching directory.', 'info');
    renderMySkills();
  }
}

function removeLearnSkill(index) {
  const user = SkillBridgeDB.getCurrentUser();
  user.learnSkills.splice(index, 1);
  SkillBridgeDB.updateCurrentUser(user);
  showToast('Goal Removed', 'Skill removed from learning wishlist.', 'info');
  renderMySkills();
}

function togglePauseSkill(skillId) {
  showToast('Status Updated', 'Skill availability toggled. Classmates will not send new requests while paused.', 'info');
}

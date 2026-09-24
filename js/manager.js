/**
 * SkillBridge Manager / Administrator Portal Controller
 * Powers metrics, student management, skills audit, request monitoring, and analytics
 */

document.addEventListener('DOMContentLoaded', () => {
  // Page-specific initialization
  if (document.getElementById('manager-dashboard-view')) {
    initManagerDashboard();
  }
  if (document.getElementById('manager-students-table-body')) {
    initManageStudents();
  }
  if (document.getElementById('manager-skills-grid')) {
    initManageSkills();
  }
  if (document.getElementById('manager-requests-table-body')) {
    initManageRequests();
  }
  if (document.getElementById('manager-reports-view')) {
    initManagerReports();
  }
});

/* ==========================================================================
   Manager Dashboard
   ========================================================================== */
function initManagerDashboard() {
  const stats = SkillBridgeDB.getManagerStats();
  const students = SkillBridgeDB.getStudents();
  const skills = SkillBridgeDB.getSkills();
  const requests = SkillBridgeDB.getRequests();

  // Populate Key Metric Counters
  const totalStudentsEl = document.getElementById('mgr-stat-students');
  if (totalStudentsEl) totalStudentsEl.textContent = students.length + 340; // Seed count

  const activeExchangesEl = document.getElementById('mgr-stat-active');
  if (activeExchangesEl) activeExchangesEl.textContent = requests.filter(r => r.status === 'accepted').length + 44;

  const totalSkillsEl = document.getElementById('mgr-stat-skills');
  if (totalSkillsEl) totalSkillsEl.textContent = skills.length + 70;

  const satisfactionEl = document.getElementById('mgr-stat-satisfaction');
  if (satisfactionEl) satisfactionEl.textContent = '98.6%';

  // Populate Recent Platform Exchanges Table
  const tableBody = document.getElementById('mgr-recent-exchanges-body');
  if (tableBody) {
    tableBody.innerHTML = stats.recentExchanges.map(ex => `
      <tr>
        <td style="font-weight: 600;">${ex.id}</td>
        <td><strong>${ex.mentor}</strong></td>
        <td>${ex.learner}</td>
        <td><span class="badge badge-primary">${ex.skills}</span></td>
        <td><span class="badge ${ex.status === 'Completed' ? 'badge-accepted' : 'badge-pending'}">${ex.status}</span></td>
        <td class="text-xs text-muted">${ex.date}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="showToast('Audit Log', 'Viewing exchange session logs for ${ex.id}', 'info')">Audit</button>
        </td>
      </tr>
    `).join('');
  }

  // Draw pure SVG chart for monthly activity
  drawMonthlyChart();
}

function drawMonthlyChart() {
  const chartContainer = document.getElementById('mgr-monthly-chart');
  if (!chartContainer) return;

  const data = [
    { month: 'Oct', count: 45 },
    { month: 'Nov', count: 68 },
    { month: 'Dec', count: 52 },
    { month: 'Jan', count: 85 },
    { month: 'Feb', count: 110 },
    { month: 'Mar', count: 142 }
  ];

  const max = Math.max(...data.map(d => d.count));
  chartContainer.innerHTML = `
    <div style="display: flex; align-items: flex-end; justify-content: space-between; height: 180px; padding-top: 1rem; gap: 1rem;">
      ${data.map(d => {
        const heightPercent = (d.count / max) * 100;
        return `
          <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; height: 100%; justify-content: flex-end;">
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--navy-800);">${d.count}</span>
            <div style="width: 100%; max-width: 48px; height: ${heightPercent}%; background: var(--primary-gradient); border-radius: 6px 6px 0 0; transition: height 0.5s ease;"></div>
            <span style="font-size: 0.75rem; color: var(--slate-500); font-weight: 600;">${d.month}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/* ==========================================================================
   Manage Students
   ========================================================================== */
function initManageStudents() {
  renderStudentsTable();

  const searchInput = document.getElementById('mgr-student-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => renderStudentsTable());
  }

  const deptFilter = document.getElementById('mgr-student-dept-filter');
  if (deptFilter) {
    deptFilter.addEventListener('change', () => renderStudentsTable());
  }
}

function renderStudentsTable() {
  const students = SkillBridgeDB.getStudents();
  const tableBody = document.getElementById('manager-students-table-body');
  if (!tableBody) return;

  const query = (document.getElementById('mgr-student-search')?.value || '').toLowerCase().trim();
  const dept = document.getElementById('mgr-student-dept-filter')?.value || 'All';

  const filtered = students.filter(s => {
    const matchesQuery = !query ||
      s.name.toLowerCase().includes(query) ||
      s.rollNo.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query);

    const matchesDept = dept === 'All' || s.department === dept;

    return matchesQuery && matchesDept;
  });

  tableBody.innerHTML = filtered.map(student => `
    <tr>
      <td>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <img src="${student.avatar}" class="user-avatar user-avatar-sm" alt="${student.name}">
          <div>
            <div style="font-weight: 700; color: var(--navy-900);">${student.name}</div>
            <div class="text-xs text-muted">${student.email}</div>
          </div>
        </div>
      </td>
      <td><code>${student.rollNo}</code></td>
      <td>${student.department}</td>
      <td>
        <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
          ${(student.teachSkills || []).slice(0, 2).map(sk => `<span class="tag tag-teach" style="font-size: 0.7rem;">${sk}</span>`).join('')}
        </div>
      </td>
      <td>
        <strong style="color: #f59e0b;">★ ${student.rating || 5.0}</strong>
      </td>
      <td>
        <span class="badge ${student.status === 'Flagged' ? 'badge-rejected' : 'badge-accepted'}">
          ${student.status || 'Active'}
        </span>
      </td>
      <td>
        <div style="display: flex; gap: 0.4rem;">
          <button class="btn btn-secondary btn-sm" onclick="toggleStudentVerify('${student.id}')" title="Toggle Campus Verification Badge">
            ${student.verified ? '✓ Verified' : 'Verify'}
          </button>
          <button class="btn btn-danger-outline btn-sm" onclick="toggleStudentStatus('${student.id}')">
            ${student.status === 'Flagged' ? 'Unflag' : 'Flag'}
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function toggleStudentVerify(studentId) {
  const students = SkillBridgeDB.getStudents();
  const target = students.find(s => s.id === studentId);
  if (target) {
    target.verified = !target.verified;
    SkillBridgeDB.updateStudents(students);
    showToast('Student Verification', `${target.name} verification status changed to: ${target.verified ? 'Verified' : 'Unverified'}.`, 'success');
    renderStudentsTable();
  }
}

function toggleStudentStatus(studentId) {
  const students = SkillBridgeDB.getStudents();
  const target = students.find(s => s.id === studentId);
  if (target) {
    target.status = target.status === 'Flagged' ? 'Active' : 'Flagged';
    SkillBridgeDB.updateStudents(students);
    showToast('Status Updated', `Student ${target.name} status updated to: ${target.status}.`, target.status === 'Flagged' ? 'warning' : 'success');
    renderStudentsTable();
  }
}

/* ==========================================================================
   Manage Skills
   ========================================================================== */
function initManageSkills() {
  renderManagerSkills();

  const search = document.getElementById('mgr-skill-search');
  if (search) {
    search.addEventListener('input', () => renderManagerSkills());
  }
}

function renderManagerSkills() {
  const skills = SkillBridgeDB.getSkills();
  const container = document.getElementById('manager-skills-grid');
  if (!container) return;

  const query = (document.getElementById('mgr-skill-search')?.value || '').toLowerCase().trim();
  const filtered = skills.filter(s => {
    return !query || s.title.toLowerCase().includes(query) || s.category.toLowerCase().includes(query);
  });

  container.innerHTML = filtered.map(skill => `
    <div class="card card-hover" style="display: flex; flex-direction: column;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
        <span class="badge badge-primary">${skill.category}</span>
        <span class="badge badge-neutral">${skill.level}</span>
      </div>

      <h3 style="font-size: 1.1rem; margin-bottom: 0.25rem;">${skill.title}</h3>
      <p class="text-xs text-muted" style="margin-bottom: 0.75rem;">Offered by <strong>${skill.mentorName}</strong> (${skill.mentorDept})</p>
      <p class="text-xs" style="color: var(--navy-600); margin-bottom: 1rem; flex: 1;">${skill.description}</p>

      <div class="skill-card-footer">
        <span class="badge badge-accepted">Approved</span>
        <div style="display: flex; gap: 0.35rem;">
          <button class="btn btn-secondary btn-sm" onclick="showToast('Edit Skill', 'Skill category and tags updated.', 'info')">Edit</button>
          <button class="btn btn-danger-outline btn-sm" onclick="managerDeleteSkill('${skill.id}')">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
}

function managerDeleteSkill(skillId) {
  if (confirm('Are you sure you want to remove this skill listing from the campus directory?')) {
    const skills = SkillBridgeDB.getSkills();
    const updated = skills.filter(s => s.id !== skillId);
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(updated));
    showToast('Skill Removed', 'Skill listing was removed by Administrator.', 'warning');
    renderManagerSkills();
  }
}

/* ==========================================================================
   Manage Requests
   ========================================================================== */
function initManageRequests() {
  renderManagerRequestsTable();
}

function renderManagerRequestsTable() {
  const reqs = SkillBridgeDB.getRequests();
  const tableBody = document.getElementById('manager-requests-table-body');
  if (!tableBody) return;

  tableBody.innerHTML = reqs.map(r => `
    <tr>
      <td><code>${r.id}</code></td>
      <td><strong>${r.senderName}</strong></td>
      <td>${r.receiverName}</td>
      <td><span class="tag tag-teach">${r.requestedSkill}</span></td>
      <td><span class="tag tag-learn">${r.offeredSkill}</span></td>
      <td>
        <span class="badge ${r.status === 'accepted' ? 'badge-accepted' : r.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}">
          ${r.status}
        </span>
      </td>
      <td class="text-xs text-muted">${r.createdAt}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="showToast('Request Audit', 'Exchange details logged: Schedule: ${r.proposedSchedule}', 'info')">
          Inspect
        </button>
      </td>
    </tr>
  `).join('');
}

/* ==========================================================================
   Reports & Analytics
   ========================================================================== */
function initManagerReports() {
  // Setup export action
  const exportBtn = document.getElementById('mgr-export-report-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      showToast('Exporting Report', 'Generating SkillBridge Campus Engagement CSV Report...', 'info');
      setTimeout(() => {
        showToast('Download Ready', 'SkillBridge_Campus_Analytics_2026.csv has been prepared.', 'success');
      }, 1000);
    });
  }
}

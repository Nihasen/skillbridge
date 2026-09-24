/**
 * SkillBridge Ratings & Reviews Controller
 * Star selection, review submissions, and testimonials rendering
 */

let selectedReviewRating = 5;

document.addEventListener('DOMContentLoaded', () => {
  renderReviewsPage();
  setupInteractiveStars();
});

function setupInteractiveStars() {
  const stars = document.querySelectorAll('#review-star-selector .star');
  stars.forEach(star => {
    star.addEventListener('mouseenter', () => {
      const val = parseInt(star.getAttribute('data-value'));
      stars.forEach(s => {
        s.classList.toggle('hovered', parseInt(s.getAttribute('data-value')) <= val);
      });
    });

    star.addEventListener('mouseleave', () => {
      stars.forEach(s => s.classList.remove('hovered'));
    });

    star.addEventListener('click', () => {
      selectedReviewRating = parseInt(star.getAttribute('data-value'));
      document.getElementById('rating-score-display').textContent = `${selectedReviewRating} out of 5 stars`;
      stars.forEach(s => {
        s.classList.toggle('filled', parseInt(s.getAttribute('data-value')) <= selectedReviewRating);
      });
    });
  });
}

function renderReviewsPage() {
  const reviews = SkillBridgeDB.getReviews();
  const listContainer = document.getElementById('reviews-full-list');
  if (!listContainer) return;

  if (reviews.length === 0) {
    listContainer.innerHTML = `<div class="p-4 text-center text-muted">No reviews yet. Complete your first peer exchange session to earn feedback!</div>`;
    return;
  }

  listContainer.innerHTML = reviews.map(rev => `
    <div class="card card-hover" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.85rem;">
          <img src="${rev.reviewerAvatar}" class="user-avatar" alt="${rev.reviewerName}">
          <div>
            <h4 style="font-size: 1rem; color: var(--navy-900);">${rev.reviewerName}</h4>
            <div class="text-xs text-muted">${rev.reviewerDept}</div>
          </div>
        </div>

        <div style="text-align: right;">
          <div style="color: #fbbf24; font-size: 1.15rem; letter-spacing: 2px;">
            ${'★'.repeat(rev.rating)}${'☆'.repeat(5 - rev.rating)}
          </div>
          <div class="text-xs text-muted" style="margin-top: 0.2rem;">${rev.date}</div>
        </div>
      </div>

      <div style="background: var(--slate-50); padding: 0.5rem 0.85rem; border-radius: var(--radius-md); font-size: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
        <span class="text-muted">Exchanged Skill:</span>
        <strong style="color: var(--primary);">${rev.skill}</strong>
      </div>

      <p style="font-size: 0.925rem; color: var(--navy-800); line-height: 1.6;">
        "${rev.comment}"
      </p>

      <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
        <span class="badge badge-accepted" style="font-size: 0.7rem;">✓ Verified Campus Exchange</span>
      </div>
    </div>
  `).join('');
}

function handleSubmitReview(e) {
  e.preventDefault();
  const peerSelect = document.getElementById('review-peer');
  const skillExchanged = document.getElementById('review-skill').value.trim();
  const comment = document.getElementById('review-comment').value.trim();

  const peerData = {
    'Sarah Chen': { dept: 'Data Science & AI', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250' },
    'Marcus Vance': { dept: 'Design & Media', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250' },
    'Liam O’Connor': { dept: 'Business & Management', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250' },
    'Priya Sharma': { dept: 'Electronics & Comm.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250' }
  };

  const selectedName = peerSelect.value;
  const peerInfo = peerData[selectedName] || { dept: 'Computer Science', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' };

  const newReview = {
    id: 'rev_' + Date.now(),
    studentId: 'std_01',
    reviewerName: selectedName,
    reviewerDept: peerInfo.dept,
    reviewerAvatar: peerInfo.avatar,
    rating: selectedReviewRating,
    skill: skillExchanged,
    comment: comment,
    date: 'Just now'
  };

  SkillBridgeDB.addReview(newReview);
  closeModal('write-review-modal');
  e.target.reset();

  showToast('Review Published', `Your rating and review for ${selectedName} was submitted.`, 'success');
  renderReviewsPage();
}

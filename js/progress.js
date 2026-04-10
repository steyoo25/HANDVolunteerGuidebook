/* ============================================================
   DUKE HAND VOLUNTEER GUIDEBOOK — Progress Tracking
   ============================================================ */

const PROGRESS_KEY = 'duke-hand-progress';

function getProgress() {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : {
      module1: false,
      module2: false,
      module3: false,
      module4: false
    };
  } catch (e) {
    return { module1: false, module2: false, module3: false, module4: false };
  }
}

function setModuleComplete(moduleId) {
  const progress = getProgress();
  progress[moduleId] = true;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  updateAllProgress();
}

function getCompletionCount() {
  const p = getProgress();
  return Object.values(p).filter(Boolean).length;
}

function getCompletionPercent() {
  return Math.round((getCompletionCount() / 4) * 100);
}

function updateAllProgress() {
  updateNavProgress();
  updateHomeProgress();
}

function updateNavProgress() {
  const percent = getCompletionPercent();
  const fill = document.querySelector('.nav-progress-fill');
  const label = document.querySelector('.nav-progress-percent');

  if (fill) fill.style.width = percent + '%';
  if (label) label.textContent = percent + '%';
}

function updateHomeProgress() {
  const percent = getCompletionPercent();
  const fill = document.querySelector('.progress-fill');
  const label = document.querySelector('.progress-label span');

  if (fill) fill.style.width = percent + '%';
  if (label) label.textContent = percent + '%';

  updateModuleCards();
}

function updateModuleCards() {
  const progress = getProgress();

  document.querySelectorAll('.module-card').forEach((card, idx) => {
    const moduleId = 'module' + (idx + 1);
    const isComplete = progress[moduleId];
    const badge = card.querySelector('.status-badge');

    if (isComplete && badge) {
      badge.className = 'status-badge complete';
      badge.innerHTML = '<span class="status-dot"></span> Completed';
      const btn = card.querySelector('.btn-start');
      if (btn) {
        btn.textContent = 'Review';
      }
    }
  });
}

function initCompletionButton(moduleId) {
  const btn = document.getElementById('mark-complete-btn');
  if (!btn) return;

  const progress = getProgress();

  if (progress[moduleId]) {
    markBtnCompleted(btn);
  }

  btn.addEventListener('click', function() {
    const currentProgress = getProgress();

    if (currentProgress[moduleId]) {
      // Unmark as complete
      currentProgress[moduleId] = false;
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(currentProgress));
      markBtnIncomplete(btn);
      updateAllProgress();
    } else {
      // Mark as complete
      setModuleComplete(moduleId);
      markBtnCompleted(btn);
      showCompletionMessage();
    }
  });
}

function markBtnCompleted(btn) {
  btn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Module Complete!`;
  btn.classList.add('is-complete');
  btn.disabled = false;
}

function markBtnIncomplete(btn) {
  btn.innerHTML = `Mark Module Complete`;
  btn.classList.remove('is-complete');
  btn.disabled = false;
}

function showCompletionMessage() {
  let toast = document.getElementById('completion-toast');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'completion-toast';
    toast.textContent = '🎉 Great work! Your progress has been saved.';
    document.body.appendChild(toast);
  }

  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  updateAllProgress();

  const moduleId = document.body.getAttribute('data-module');
  if (moduleId) {
    initCompletionButton(moduleId);
  }
});

// Update nav active link based on scroll
document.addEventListener('DOMContentLoaded', function() {
  const tocLinks = document.querySelectorAll('.toc-link');

  if (tocLinks.length === 0) return;

  window.addEventListener('scroll', function() {
    let current = tocLinks[0];

    tocLinks.forEach(link => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section && section.offsetTop <= window.scrollY + 120) {
        current = link;
      }
    });

    tocLinks.forEach(link => link.classList.remove('active'));
    current.classList.add('active');
  });
});

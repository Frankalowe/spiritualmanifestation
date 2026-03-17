/* ===================================
   SPIRITUAL MANIFESTATIONS — APP.JS
   =================================== */

// === UTILS ===
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const getTodayISO = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const toISO = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const fromISO = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const showToast = (msg, duration = 3000) => {
  const toast = $('#toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
};

// === STORAGE ===
const Storage = {
  getEntry(date) {
    const raw = localStorage.getItem(`sm_entry_${date}`);
    return raw ? JSON.parse(raw) : null;
  },
  saveEntry(date, data) {
    localStorage.setItem(`sm_entry_${date}`, JSON.stringify({
      date,
      ...data,
      savedAt: new Date().toISOString()
    }));
  },
  getAllDates() {
    return Object.keys(localStorage)
      .filter(k => k.startsWith('sm_entry_'))
      .map(k => k.replace('sm_entry_', ''))
      .sort((a, b) => b.localeCompare(a));
  },
  getResults() {
    const raw = localStorage.getItem('sm_results');
    return raw ? JSON.parse(raw) : [];
  },
  saveResult(result) {
    const results = this.getResults();
    results.unshift({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...result
    });
    localStorage.setItem('sm_results', JSON.stringify(results));
  },
  deleteResult(id) {
    const results = this.getResults();
    localStorage.setItem('sm_results', JSON.stringify(results.filter(r => r.id !== id)));
  },
  exportData() {
    const data = { entries: {}, results: this.getResults() };
    this.getAllDates().forEach(date => {
      data.entries[date] = this.getEntry(date);
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spiritual_manifestations_backup_${getTodayISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.results) localStorage.setItem('sm_results', JSON.stringify(data.results));
      if (data.entries) {
        Object.keys(data.entries).forEach(date => {
          localStorage.setItem(`sm_entry_${date}`, JSON.stringify(data.entries[date]));
        });
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  clearAll() {
    localStorage.clear();
  }
};

// === QUOTES (Sample set to save size, originally 100) ===
const QUOTES = [
  { t: "What you seek is seeking you.", a: "Rumi" },
  { t: "The universe is not outside of you. Look inside yourself; everything that you want, you already are.", a: "Rumi" },
  { t: "Ask for what you want and be prepared to get it.", a: "Maya Angelou" },
  { t: "Imagination is everything. It is the preview of life's coming attractions.", a: "Albert Einstein" },
  { t: "Gratitude unlocks the fullness of life.", a: "Melody Beattie" },
  { t: "You are the creator of your own reality.", a: "Abraham Hicks" },
  { t: "The power of intention is the power to manifest.", a: "Dr. Wayne Dyer" },
  { t: "Acknowledging the good that you already have in your life is the foundation for all abundance.", a: "Eckhart Tolle" },
  { t: "See yourself living in abundance and you will attract it.", a: "Rhonda Byrne" },
  { t: "Whatever the mind can conceive and believe, the mind can achieve.", a: "Napoleon Hill" },
  { t: "Act as if what you do makes a difference. It does.", a: "William James" },
  { t: "Be thankful for what you have; you'll end up having more.", a: "Oprah Winfrey" },
  { t: "What we think, we become.", a: "Buddha" },
  { t: "Once you make a decision, the universe conspires to make it happen.", a: "Ralph Waldo Emerson" },
  { t: "A grateful heart is a magnet for miracles.", a: "Unknown" },
  { t: "When you are grateful, fear disappears and abundance appears.", a: "Tony Robbins" },
  { t: "The secret of getting ahead is getting started.", a: "Mark Twain" },
  { t: "Abundance is not something we acquire. It is something we tune into.", a: "Dr. Wayne Dyer" },
  { t: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
  { t: "Joy is the simplest form of gratitude.", a: "Karl Barth" },
  { t: "When you arise in the morning, think of what a precious privilege it is to be alive.", a: "Marcus Aurelius" },
  { t: "Positive thinking will let you do everything better than negative thinking will.", a: "Zig Ziglar" },
  { t: "Luck is what happens when preparation meets opportunity.", a: "Seneca" },
  { t: "Be the energy you want to attract.", a: "Unknown" },
  { t: "When you want something, all the universe conspires in helping you to achieve it.", a: "Paulo Coelho" }
];

const initQuotes = () => {
  const d = new Date();
  const dayOfYear = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  const seed = dayOfYear * 2654435761 + d.getFullYear();
  const idx = Math.abs(seed) % QUOTES.length;
  const q = QUOTES[idx];
  
  $('#quote-text').textContent = q.t;
  $('#quote-author').textContent = `— ${q.a}`;

  $('#quote-share').onclick = () => {
    navigator.clipboard.writeText(`"${q.t}" — ${q.a}`);
    showToast('Quote copied to clipboard!');
  };
};

// === DARK MODE ===
const initDarkMode = () => {
  const toggle = $('#dark-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedTheme = localStorage.getItem('sm_darkmode');

  const isDark = storedTheme === 'dark' || (!storedTheme && prefersDark);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  toggle.textContent = isDark ? '☀️' : '🌙';

  toggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('sm_darkmode', newTheme);
    toggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  });
};

// === ONBOARDING ===
const Onboarding = {
  init() {
    const hasSeen = localStorage.getItem('sm_onboarded');
    if (!hasSeen) {
      $('#onboarding-overlay').style.display = 'flex';
      this.bindEvents();
    }
  },
  bindEvents() {
    let currentSlide = 0;
    const slides = $$('.onboarding-slide');
    const dots = $$('.dot');
    const nextBtn = $('#onboarding-next');
    
    const showSlide = (idx) => {
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      slides[idx].classList.add('active');
      dots[idx].classList.add('active');
      
      if (idx === slides.length - 1) {
        nextBtn.textContent = 'Get Started ✨';
      } else {
        nextBtn.textContent = 'Next →';
      }
    };

    nextBtn.onclick = () => {
      if (currentSlide < slides.length - 1) {
        currentSlide++;
        showSlide(currentSlide);
      } else {
        this.finish();
      }
    };

    $('#onboarding-skip').onclick = () => this.finish();
  },
  finish() {
    $('#onboarding-overlay').style.display = 'none';
    localStorage.setItem('sm_onboarded', 'true');
    fireConfetti();
  }
};

// === ROUTER ===
const Router = {
  pages: ['dashboard', 'entry', 'history', 'results'],
  init() {
    $$('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => this.navigate(btn.dataset.page));
    });
    $('#dashboard-cta').addEventListener('click', () => this.navigate('entry'));

    window.addEventListener('hashchange', () => this.handleHash());
    this.handleHash();
  },
  handleHash() {
    let hash = window.location.hash.replace('#', '');
    if (!this.pages.includes(hash)) hash = 'dashboard';
    this.showPage(hash);
  },
  navigate(page) {
    window.location.hash = page;
  },
  showPage(page) {
    $$('.page').forEach(el => el.classList.remove('active'));
    $(`#page-${page}`).classList.add('active');

    $$('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === page);
    });

    if (page === 'dashboard') Dashboard.render();
    if (page === 'entry') DailyEntry.initView();
    if (page === 'history') HistoryViewer.render();
    if (page === 'results') ResultsViewer.render();

    window.scrollTo(0, 0);
  }
};

// === ANIMATE NUMBERS ===
const animateValue = (obj, start, end, duration) => {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
};

// === ENTRY COMPLETION HELPER ===
const isEntryComplete = (entry) => {
  if (!entry) return false;
  return entry.gratitude.every(x => x.trim() !== '') &&
         entry.manifestations.every(x => x.trim() !== '') &&
         entry.affirmations.every(x => x.trim() !== '');
};

const isEntryPartial = (entry) => {
  if (!entry) return false;
  return !isEntryComplete(entry) &&
    (entry.gratitude.some(x => x.trim() !== '') || 
     entry.manifestations.some(x => x.trim() !== '') ||
     entry.affirmations.some(x => x.trim() !== '') ||
     (entry.journal && entry.journal.trim() !== ''));
};

// === BADGES & WEEKLY SUMMARY ===
const BADGES = [
  { id: 'first', name: 'First Entry', icon: '🌱', req: (days) => days >= 1 },
  { id: 'streak3', name: '3 Day Streak', icon: '🔥', req: (days, streak) => streak >= 3 },
  { id: 'streak7', name: '7 Day Streak', icon: '⭐', req: (days, streak) => streak >= 7 },
  { id: 'streak30', name: '30 Day Streak', icon: '👑', req: (days, streak) => streak >= 30 },
  { id: 'total10', name: '10 Days Total', icon: '🌸', req: (days) => days >= 10 },
  { id: 'total50', name: '50 Days Total', icon: '🌟', req: (days) => days >= 50 },
  { id: 'result1', name: 'Manifestation', icon: '✨', req: (days, streak, results) => results >= 1 },
];

// === DASHBOARD & CALENDAR ===
const Dashboard = {
  currentDate: new Date(),

  render() {
    this.renderCalendar(this.currentDate, $('#cal-month-label'), $('#cal-grid'), true);
    
    const stats = this.calculateStats();
    
    // Animate numbers
    const dur = 800;
    if ($('#stat-total').dataset.target != stats.total) {
      animateValue($('#stat-total'), 0, stats.total, dur);
      $('#stat-total').dataset.target = stats.total;
    }
    if ($('#stat-streak').dataset.target != stats.streak) {
      animateValue($('#stat-streak'), 0, stats.streak, dur);
      $('#stat-streak').dataset.target = stats.streak;
    }
    if ($('#stat-longest').dataset.target != stats.longest) {
      animateValue($('#stat-longest'), 0, stats.longest, dur);
      $('#stat-longest').dataset.target = stats.longest;
    }

    this.renderBadges(stats.total, stats.streak, Storage.getResults().length);
    this.renderWeeklySummary();

    const todayISO = getTodayISO();
    const entry = Storage.getEntry(todayISO);
    const cta = $('#dashboard-cta');
    const statusText = $('#today-status-text');

    if (!entry) {
      cta.textContent = '✦ Begin Today\'s Practice';
      statusText.textContent = 'You haven\'t started today\'s entries yet.';
    } else if (isEntryComplete(entry)) {
      cta.textContent = '✦ View Today\'s Practice';
      statusText.textContent = '✨ You\'ve completed today\'s practice!';
    } else {
      cta.textContent = '✦ Continue Today\'s Practice';
      statusText.textContent = '⚠️ Your practice is partially saved (Draft).';
    }
  },

  calculateStats() {
    const allDates = Storage.getAllDates();
    const completedSet = new Set(allDates.filter(date => isEntryComplete(Storage.getEntry(date))));
    
    const total = completedSet.size;
    let currentStreak = 0;
    let longestStreak = 0;

    if (total === 0) return { total: 0, streak: 0, longest: 0 };

    const sortedCompleted = [...completedSet].sort();
    let lTemp = 1;
    for (let i = 1; i < sortedCompleted.length; i++) {
      const prev = fromISO(sortedCompleted[i - 1]);
      const curr = fromISO(sortedCompleted[i]);
      if (Math.round((curr - prev) / 86400000) === 1) {
        lTemp++;
        if (lTemp > longestStreak) longestStreak = lTemp;
      } else {
        lTemp = 1;
      }
    }
    if (longestStreak === 0) longestStreak = 1;

    const todayISO = getTodayISO();
    const today = fromISO(todayISO);
    let checkDate = new Date(today);

    if (!completedSet.has(todayISO)) checkDate.setDate(checkDate.getDate() - 1);

    while (true) {
      const iso = toISO(checkDate);
      if (completedSet.has(iso)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    longestStreak = Math.max(longestStreak, currentStreak);
    return { total, streak: currentStreak, longest: longestStreak };
  },

  renderBadges(totalDays, currentStreak, totalResults) {
    const row = $('#badges-row');
    row.innerHTML = '';
    
    BADGES.forEach(b => {
      const earned = b.req(totalDays, currentStreak, totalResults);
      const div = document.createElement('div');
      div.className = `badge-item ${earned ? 'earned' : 'locked'}`;
      div.innerHTML = `
        <div class="badge-icon">${b.icon}</div>
        <div class="badge-name">${b.name}</div>
      `;
      row.appendChild(div);
    });
  },

  renderWeeklySummary() {
    const today = fromISO(getTodayISO());
    const dayOfWeek = today.getDay(); // 0 is Sunday
    
    // Get start of week (Sunday)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek);
    
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    let html = '<div class="weekly-grid">';
    
    let completedThisWeek = 0;
    
    for (let i = 0; i < 7; i++) {
      const iterDate = new Date(startDate);
      iterDate.setDate(startDate.getDate() + i);
      const iso = toISO(iterDate);
      
      let statusClass = 'future';
      let icon = '';
      
      if (iso <= getTodayISO()) {
        const entry = Storage.getEntry(iso);
        if (isEntryComplete(entry)) {
          statusClass = 'done'; icon = '✅';
          completedThisWeek++;
        } else if (isEntryPartial(entry)) {
          statusClass = 'partial'; icon = '⚠️';
        } else {
          statusClass = 'missed'; icon = '';
        }
      }
      
      html += `
        <div class="weekly-day">
          <div class="weekly-day-label">${days[i]}</div>
          <div class="weekly-day-dot ${statusClass}">${icon}</div>
        </div>
      `;
    }
    html += '</div>';
    
    html += `
      <div class="weekly-stats-row">
        <div class="weekly-stat">
          <div class="weekly-stat-value">${completedThisWeek}/7</div>
          <div class="weekly-stat-label">Days Complete</div>
        </div>
        <div class="weekly-stat">
          <div class="weekly-stat-value">${Math.round((completedThisWeek/7)*100)}%</div>
          <div class="weekly-stat-label">Consistency</div>
        </div>
      </div>
    `;
    
    $('#weekly-summary-content').innerHTML = html;
  },

  renderCalendar(targetDate, labelEl, gridEl, isDashboard = false, onDayClick = null) {
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const todayISO = getTodayISO();

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    labelEl.textContent = `${monthNames[month]} ${year}`;

    gridEl.innerHTML = '';

    ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach(d => {
      const el = document.createElement('div');
      el.className = 'cal-dow';
      el.textContent = d;
      gridEl.appendChild(el);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const el = document.createElement('div');
      el.className = 'cal-day empty';
      gridEl.appendChild(el);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const el = document.createElement('div');
      const dateISO = toISO(new Date(year, month, i));

      el.className = 'cal-day';
      el.textContent = i;
      el.setAttribute('data-date', dateISO);

      if (dateISO === todayISO) el.classList.add('today');
      if (dateISO > todayISO) el.classList.add('future');

      const entry = Storage.getEntry(dateISO);
      if (entry) {
        if (isEntryComplete(entry)) el.classList.add('status-done');
        else if (isEntryPartial(entry)) el.classList.add('status-partial');
      } else if (dateISO < todayISO) {
        el.classList.add('status-none');
      }

      if (dateISO <= todayISO) {
        el.addEventListener('click', () => {
          if (onDayClick) {
            onDayClick(dateISO);
          } else if (isDashboard) {
            if (dateISO === todayISO) Router.navigate('entry');
            else {
              HistoryViewer.selectDate(dateISO);
              Router.navigate('history');
            }
          } else {
            HistoryViewer.selectDate(dateISO);
          }
        });
      } else {
        el.classList.add('future');
      }

      gridEl.appendChild(el);
    }
  }
};

$('#cal-prev').addEventListener('click', () => {
  Dashboard.currentDate.setMonth(Dashboard.currentDate.getMonth() - 1);
  Dashboard.render();
});
$('#cal-next').addEventListener('click', () => {
  Dashboard.currentDate.setMonth(Dashboard.currentDate.getMonth() + 1);
  Dashboard.render();
});


// === DAILY ENTRY ===
const DailyEntry = {
  entryDate: null,
  fieldsBuilt: false,
  eventsbound: false,
  saveTimeout: null,
  currentMood: null,

  initView() {
    this.entryDate = getTodayISO();

    const d = fromISO(this.entryDate);
    $('#entry-date-label').textContent = d.toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    if (!this.fieldsBuilt) {
      this.buildFields();
      this.fieldsBuilt = true;
    }

    if (!this.eventsbound) {
      this.bindEvents();
      this.eventsbound = true;
    }

    this.loadData();
    this.switchTab('gratitude');

    $('#past-readonly-banner').style.display = 'none';
    $$('.entry-textarea').forEach(ta => ta.removeAttribute('readonly'));
    $('#submit-wrap').style.display = 'flex';
  },

  buildFields() {
    const build = (containerId, prefix, placeholder) => {
      const container = $(`#${containerId}`);
      container.innerHTML = '';
      for (let i = 1; i <= 10; i++) {
        const div = document.createElement('div');
        div.className = 'entry-field';
        div.innerHTML = `
          <div class="entry-number">${i}.</div>
          <textarea class="entry-textarea auto-save-bind" id="${prefix}-${i}" rows="2" placeholder="${placeholder}"></textarea>
        `;
        container.appendChild(div);
      }
    };

    build('gratitude-fields', 'g', 'I am grateful for…');
    build('manifestation-fields', 'm', 'Dear Universe, I am having…');
    build('affirmation-fields', 'a', 'I am…');
  },

  bindEvents() {
    $$('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    // Auto-save binding
    $$('.auto-save-bind').forEach(el => {
      el.addEventListener('input', () => this.triggerAutoSave());
    });
    $('#journal-textarea').addEventListener('input', () => this.triggerAutoSave());

    // Mood tracking
    $$('.mood-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        $$('.mood-btn').forEach(b => b.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
        this.currentMood = e.currentTarget.dataset.mood;
        this.triggerAutoSave();
      });
    });

    $('#submit-btn').addEventListener('click', () => this.save(true));
  },

  triggerAutoSave() {
    this.validate();
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => this.save(false), 2000); // 2s defer
  },

  switchTab(tab) {
    $$('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    $$('.tab-content').forEach(c => c.classList.remove('active'));
    $(`#content-${tab}`).classList.add('active');
  },

  loadData() {
    const entry = Storage.getEntry(this.entryDate) || { gratitude: [], manifestations: [], affirmations: [], journal: '', mood: null };
    
    for (let i = 0; i < 10; i++) {
      const gEl = $(`#g-${i + 1}`);
      const mEl = $(`#m-${i + 1}`);
      const aEl = $(`#a-${i + 1}`);
      if (gEl) gEl.value = entry.gratitude[i] || '';
      if (mEl) mEl.value = entry.manifestations[i] || '';
      if (aEl) aEl.value = entry.affirmations[i] || '';
    }
    
    $('#journal-textarea').value = entry.journal || '';
    
    $$('.mood-btn').forEach(b => b.classList.remove('selected'));
    this.currentMood = entry.mood;
    if (this.currentMood) {
      const mb = $(`.mood-btn[data-mood="${this.currentMood}"]`);
      if (mb) mb.classList.add('selected');
    }

    this.validate();
  },

  validate() {
    const countFilled = (prefix) => {
      let count = 0;
      for (let i = 1; i <= 10; i++) {
        const el = $(`#${prefix}-${i}`);
        if (el && el.value.trim().length > 0) count++;
      }
      return count;
    };

    const gCount = countFilled('g');
    const mCount = countFilled('m');
    const aCount = countFilled('a');

    $('#progress-gratitude').style.width = `${(gCount / 10) * 100}%`;
    $('#progress-manifestations').style.width = `${(mCount / 10) * 100}%`;
    $('#progress-affirmations').style.width = `${(aCount / 10) * 100}%`;

    const canSubmit = gCount === 10 && mCount === 10 && aCount === 10;
    const btn = $('#submit-btn');
    btn.disabled = !canSubmit;

    if (canSubmit) {
      $('#submit-hint').textContent = 'Ready to save ✨';
      $('#submit-hint').style.color = 'var(--green)';
    } else {
      $('#submit-hint').textContent = `Gratitude: ${gCount}/10 · Manifestations: ${mCount}/10 · Affirmations: ${aCount}/10`;
      $('#submit-hint').style.color = 'var(--text-muted)';
    }
  },

  save(isManual = false) {
    const gratitude = [];
    const manifestations = [];
    const affirmations = [];

    for (let i = 1; i <= 10; i++) {
      gratitude.push($(`#g-${i}`).value.trim());
      manifestations.push($(`#m-${i}`).value.trim());
      affirmations.push($(`#a-${i}`).value.trim());
    }

    const journal = $('#journal-textarea').value.trim();

    Storage.saveEntry(this.entryDate, { 
      gratitude, manifestations, affirmations, journal, mood: this.currentMood 
    });
    
    this.validate();
    Dashboard.render();

    if (isManual) {
      showToast('✨ Today\'s practice saved!');
      fireConfetti();
    } else {
      // Show auto-save indicator
      const ind = $('#autosave-indicator');
      ind.style.display = 'flex';
      setTimeout(() => { ind.style.display = 'none'; }, 2000);
    }
  }
};

// === HISTORY VIEWER ===
const HistoryViewer = {
  currentDate: new Date(),
  selectedISO: null,

  render() {
    Dashboard.renderCalendar(
      this.currentDate,
      $('#hist-cal-month-label'),
      $('#hist-cal-grid'),
      false,
      (dateISO) => this.selectDate(dateISO)
    );

    if (this.selectedISO) {
      $$('#hist-cal-grid .cal-day').forEach(cell => {
        cell.style.outline = cell.dataset.date === this.selectedISO
          ? '2px solid var(--accent-1)'
          : '';
      });
      this.renderEntryView();
    } else {
      this.showEmptyState();
    }
  },

  selectDate(iso) {
    this.selectedISO = iso;
    const d = fromISO(iso);
    this.currentDate = new Date(d.getFullYear(), d.getMonth(), 1);
    this.render();
  },

  showEmptyState() {
    $('#history-viewer').innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📖</div>
        <p>Select a date on the calendar above to view your entries.</p>
      </div>
    `;
  },

  renderEntryView() {
    const entry = Storage.getEntry(this.selectedISO);
    const viewer = $('#history-viewer');
    const d = fromISO(this.selectedISO);
    const dateStr = d.toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    if (!entry) {
      viewer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🍃</div>
          <h3 style="font-family:'Cormorant Garamond',serif; margin:12px 0 8px;">${dateStr}</h3>
          <p>No practice was recorded on this day.</p>
        </div>
      `;
      return;
    }

    const renderList = (arr) => {
      if (!arr || arr.length === 0) return '';
      return arr.map((item, i) => item.trim()
        ? `<li><span class="num">${i + 1}.</span><span>${item}</span></li>`
        : '').join('');
    };

    let moodHtml = '';
    if (entry.mood) {
      const emojis = { amazing: '🤩 Amazing', happy: '😊 Happy', neutral: '😐 Neutral', sad: '😢 Sad', stressed: '😰 Stressed' };
      moodHtml = `<div class="history-mood">Overall mood: <span class="mood-emoji">${emojis[entry.mood]}</span></div>`;
    }

    let journalHtml = '';
    if (entry.journal && entry.journal.trim()) {
      journalHtml = `
        <div class="section-label mt-20">📝 Journal</div>
        <div class="history-journal">${entry.journal.replace(/\n/g, '<br>')}</div>
      `;
    }

    viewer.innerHTML = `
      <div class="history-entry card" style="margin-top:16px;">
        <h3 style="font-family:'Cormorant Garamond',serif; font-weight:400; text-align:center; margin-bottom:20px;">${dateStr}</h3>
        ${moodHtml}

        <div class="section-label">🌸 Gratitude</div>
        <ul class="entry-list" style="margin-bottom:24px;">${renderList(entry.gratitude)}</ul>

        <div class="section-label">🌟 Manifestations</div>
        <ul class="entry-list" style="margin-bottom:24px;">${renderList(entry.manifestations)}</ul>

        <div class="section-label">💎 Affirmations</div>
        <ul class="entry-list">${renderList(entry.affirmations)}</ul>
        
        ${journalHtml}
      </div>
    `;
  }
};

$('#hist-cal-prev').addEventListener('click', () => {
  HistoryViewer.currentDate.setMonth(HistoryViewer.currentDate.getMonth() - 1);
  HistoryViewer.render();
});
$('#hist-cal-next').addEventListener('click', () => {
  HistoryViewer.currentDate.setMonth(HistoryViewer.currentDate.getMonth() + 1);
  HistoryViewer.render();
});


// === MANIFESTATION RESULTS ===
const ResultsViewer = {
  activeFilter: 'all',

  render() {
    this.populateSelect();
    this.renderTimeline();

    if (!$('#result-date').value) {
      $('#result-date').value = getTodayISO();
    }

    $('#result-save-btn').onclick = () => {
      const desc = $('#result-desc').value.trim();
      const date = $('#result-date').value;
      const linked = $('#result-link').value;
      const category = $('#result-category').value;

      if (!desc) { showToast('Please describe what manifested.'); return; }
      if (!date) { showToast('Please set a date achieved.'); return; }

      Storage.saveResult({ 
        description: desc, 
        dateAchieved: date, 
        linkedEntry: linked || null,
        category: category || null
      });

      $('#result-desc').value = '';
      $('#result-category').value = '';
      this.renderTimeline();
      this.populateSelect();
      showToast('✨ Result logged successfully!');
      fireConfetti();
    };

    // Filters
    $$('.filter-chip').forEach(btn => {
      btn.onclick = (e) => {
        $$('.filter-chip').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.activeFilter = e.currentTarget.dataset.filter;
        this.renderTimeline();
      };
    });
  },

  populateSelect() {
    const sel = $('#result-link');
    sel.innerHTML = '<option value="">— None —</option>';
    Storage.getAllDates().forEach(iso => {
      const opt = document.createElement('option');
      opt.value = iso;
      const d = fromISO(iso);
      opt.textContent = `Entry – ${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
      sel.appendChild(opt);
    });
  },

  renderTimeline() {
    let results = Storage.getResults();
    const timeline = $('#results-timeline');

    if (this.activeFilter !== 'all') {
      results = results.filter(r => r.category === this.activeFilter);
    }

    if (results.length === 0) {
      timeline.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🌟</div>
          <p>${this.activeFilter === 'all' ? 'Log your first manifestation result above — every achievement is a miracle worth recording.' : 'No results found in this category.'}</p>
        </div>
      `;
      return;
    }

    const catLabels = {
      health: '🏥 Health', career: '💼 Career', relationships: '💕 Relations',
      personal: '🌱 Personal', spiritual: '🙏 Spiritual', material: '🏠 Material', other: '✨ Other'
    };

    let html = '<div class="timeline">';
    results.forEach(res => {
      const linkedHtml = res.linkedEntry
        ? `<div class="timeline-linked">🔗 ${fromISO(res.linkedEntry).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>`
        : '';
        
      const catHtml = res.category
        ? `<div class="timeline-category">${catLabels[res.category]}</div>`
        : '';

      html += `
        <div class="timeline-item">
          <div class="timeline-card">
            <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;">
              <div class="timeline-desc" style="flex:1;">${res.description}</div>
              <button class="delete-result" data-id="${res.id}" aria-label="Delete result" title="Delete">🗑️</button>
            </div>
            <div class="timeline-meta">
              <div class="timeline-date">📅 ${fromISO(res.dateAchieved).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              ${catHtml}
              ${linkedHtml}
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';

    timeline.innerHTML = html;

    $$('.delete-result').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm('Remove this result?')) {
          Storage.deleteResult(id);
          this.renderTimeline();
        }
      });
    });
  }
};

// === SETTINGS & DATA MANAGEMENT ===
const Settings = {
  init() {
    const toggle = $('#settings-toggle');
    const close = $('#settings-close');
    const panel = $('#settings-panel');

    toggle.onclick = () => { panel.style.display = 'block'; };
    close.onclick = () => { panel.style.display = 'none'; };

    // Reminders
    const remToggle = $('#reminder-toggle');
    const remTime = $('#reminder-time-wrap');
    
    remToggle.checked = localStorage.getItem('sm_reminders') === 'true';
    if (remToggle.checked) remTime.style.display = 'block';
    
    remToggle.onchange = (e) => {
      localStorage.setItem('sm_reminders', e.target.checked);
      remTime.style.display = e.target.checked ? 'block' : 'none';
      if (e.target.checked && 'Notification' in window) {
        Notification.requestPermission();
      }
    };

    // Export / Import
    $('#export-data-btn').onclick = () => Storage.exportData();
    
    $('#import-data-btn').onclick = () => $('#import-file-input').click();
    $('#import-file-input').onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (Storage.importData(ev.target.result)) {
          showToast('Data imported successfully!');
          setTimeout(() => location.reload(), 1500);
        } else {
          showToast('Import failed. Invalid file format.');
        }
      };
      reader.readAsText(file);
    };

    // Reset
    $('#reset-data-btn').onclick = () => {
      if (confirm('WARNING: This will permanently delete ALL entries and results. Are you completely sure?')) {
        Storage.clearAll();
        location.reload();
      }
    };
  }
};

// === CONFETTI ===
function fireConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#c4956a', '#9b7fa6', '#7a9e9f', '#6bbd8b', '#f0c060'];

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2 + 100,
      r: Math.random() * 6 + 2,
      dx: Math.random() * 20 - 10,
      dy: Math.random() * -20 - 5,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      p.dy += 0.5; // gravity
      if (p.y < canvas.height) active = true;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    if (active) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  animate();
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initQuotes();
  Router.init();
  Settings.init();
  Onboarding.init();
});

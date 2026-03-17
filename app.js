/* ===================================
   SPIRITUAL MANIFESTATIONS — APP.JS
   =================================== */

// === UTILS ===
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/** Returns today's date as YYYY-MM-DD in LOCAL timezone */
const getTodayISO = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** Returns a YYYY-MM-DD string for any local date object */
const toISO = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** Parse an ISO date string (YYYY-MM-DD) as a LOCAL midnight Date */
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
  }
};

// === QUOTES (100) ===
const QUOTES = [
  { t: "What you seek is seeking you.", a: "Rumi" },
  { t: "The universe is not outside of you. Look inside yourself; everything that you want, you already are.", a: "Rumi" },
  { t: "Let yourself be silently drawn by the strange pull of what you really love.", a: "Rumi" },
  { t: "Respond to every call that excites your spirit.", a: "Rumi" },
  { t: "The wound is the place where the Light enters you.", a: "Rumi" },
  { t: "Ask for what you want and be prepared to get it.", a: "Maya Angelou" },
  { t: "We delight in the beauty of the butterfly, but rarely admit the changes it has gone through.", a: "Maya Angelou" },
  { t: "Your imagination is your preview of life's coming attractions.", a: "Albert Einstein" },
  { t: "Imagination is everything. It is the preview of life's coming attractions.", a: "Albert Einstein" },
  { t: "To bring anything into your life, imagine that it's already there.", a: "Richard Bach" },
  { t: "Everything you want is out there waiting for you to ask.", a: "Jack Canfield" },
  { t: "Gratitude unlocks the fullness of life.", a: "Melody Beattie" },
  { t: "Gratitude makes sense of our past, brings peace for today, and creates a vision for tomorrow.", a: "Melody Beattie" },
  { t: "You are the creator of your own reality.", a: "Abraham Hicks" },
  { t: "The better you feel, the more you allow.", a: "Abraham Hicks" },
  { t: "Reach for the thought that feels better, and allow the natural Well-Being that is yours.", a: "Abraham Hicks" },
  { t: "The power of intention is the power to manifest.", a: "Dr. Wayne Dyer" },
  { t: "You'll see it when you believe it.", a: "Dr. Wayne Dyer" },
  { t: "Change the way you look at things and the things you look at change.", a: "Dr. Wayne Dyer" },
  { t: "If you change the way you look at things, the things you look at change.", a: "Dr. Wayne Dyer" },
  { t: "Acknowledging the good that you already have in your life is the foundation for all abundance.", a: "Eckhart Tolle" },
  { t: "Realize deeply that the present moment is all you ever have.", a: "Eckhart Tolle" },
  { t: "Life is the dancer and you are the dance.", a: "Eckhart Tolle" },
  { t: "See yourself living in abundance and you will attract it.", a: "Rhonda Byrne" },
  { t: "Whatever is in your mind is what you are attracting.", a: "Rhonda Byrne" },
  { t: "Your thoughts become things.", a: "Rhonda Byrne" },
  { t: "Whatever the mind can conceive and believe, the mind can achieve.", a: "Napoleon Hill" },
  { t: "Desire is the starting point of all achievement.", a: "Napoleon Hill" },
  { t: "Every adversity carries with it the seed of an equal or greater benefit.", a: "Napoleon Hill" },
  { t: "The only limit to our realization of tomorrow is our doubts of today.", a: "Franklin D. Roosevelt" },
  { t: "You create your own universe as you go along.", a: "Winston Churchill" },
  { t: "Act as if what you do makes a difference. It does.", a: "William James" },
  { t: "The greatest discovery of all time is that a person can change their future by merely changing their attitude.", a: "Oprah Winfrey" },
  { t: "Be thankful for what you have; you'll end up having more.", a: "Oprah Winfrey" },
  { t: "The more you praise and celebrate your life, the more there is in life to celebrate.", a: "Oprah Winfrey" },
  { t: "Turn your wounds into wisdom.", a: "Oprah Winfrey" },
  { t: "You become what you believe.", a: "Oprah Winfrey" },
  { t: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
  { t: "What we think, we become.", a: "Buddha" },
  { t: "The mind is everything. What you think you become.", a: "Buddha" },
  { t: "Peace comes from within. Do not seek it without.", a: "Buddha" },
  { t: "With our thoughts, we make the world.", a: "Buddha" },
  { t: "In the middle of difficulty lies opportunity.", a: "Albert Einstein" },
  { t: "Everything is energy and that's all there is to it.", a: "Albert Einstein" },
  { t: "Once you make a decision, the universe conspires to make it happen.", a: "Ralph Waldo Emerson" },
  { t: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", a: "Ralph Waldo Emerson" },
  { t: "The only person you are destined to become is the person you decide to be.", a: "Ralph Waldo Emerson" },
  { t: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", a: "Ralph Waldo Emerson" },
  { t: "A grateful heart is a magnet for miracles.", a: "Unknown" },
  { t: "The universe is always speaking to us. Sending us little messages.", a: "Nancy Thayer" },
  { t: "Miracles happen every day, change your perception of what a miracle is and you'll see them all around you.", a: "Jon Bon Jovi" },
  { t: "When you are grateful, fear disappears and abundance appears.", a: "Tony Robbins" },
  { t: "It's not what we do once in a while that shapes our lives, but what we do consistently.", a: "Tony Robbins" },
  { t: "The secret of getting ahead is getting started.", a: "Mark Twain" },
  { t: "Every moment is a fresh beginning.", a: "T.S. Eliot" },
  { t: "What you focus on expands.", a: "Tony Robbins" },
  { t: "Where focus goes, energy flows.", a: "Tony Robbins" },
  { t: "Your life does not get better by chance, it gets better by change.", a: "Jim Rohn" },
  { t: "Take care of your body. It's the only place you have to live.", a: "Jim Rohn" },
  { t: "Happiness is not by chance, but by choice.", a: "Jim Rohn" },
  { t: "Either you run the day or the day runs you.", a: "Jim Rohn" },
  { t: "Abundance is not something we acquire. It is something we tune into.", a: "Dr. Wayne Dyer" },
  { t: "The law of attraction states that whatever you focus on, think about, read about, and talk about intensely, you're going to attract more of into your life.", a: "Jack Canfield" },
  { t: "Everything you've ever wanted is on the other side of fear.", a: "George Addair" },
  { t: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
  { t: "Your time is limited, don't waste it living someone else's life.", a: "Steve Jobs" },
  { t: "When I started counting my blessings, my whole life turned around.", a: "Willie Nelson" },
  { t: "Joy is the simplest form of gratitude.", a: "Karl Barth" },
  { t: "Gratitude is a powerful catalyst for happiness.", a: "Amy Collette" },
  { t: "The soul that gives thanks can find comfort in everything.", a: "Hannah Whitall Smith" },
  { t: "When you arise in the morning, think of what a precious privilege it is to be alive.", a: "Marcus Aurelius" },
  { t: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", a: "Marcus Aurelius" },
  { t: "Dwell on the beauty of life. Watch the stars and see yourself running with them.", a: "Marcus Aurelius" },
  { t: "The happiness of your life depends on the quality of your thoughts.", a: "Marcus Aurelius" },
  { t: "You are never too old to set another goal or to dream a new dream.", a: "C.S. Lewis" },
  { t: "Hardships often prepare ordinary people for an extraordinary destiny.", a: "C.S. Lewis" },
  { t: "What you get by achieving your goals is not as important as what you become by achieving your goals.", a: "Zig Ziglar" },
  { t: "Positive thinking will let you do everything better than negative thinking will.", a: "Zig Ziglar" },
  { t: "Keep your face always toward the sunshine and shadows will fall behind you.", a: "Walt Whitman" },
  { t: "Not how long, but how well you have lived is the main thing.", a: "Seneca" },
  { t: "Luck is what happens when preparation meets opportunity.", a: "Seneca" },
  { t: "We suffer more in imagination than in reality.", a: "Seneca" },
  { t: "It is not the man who has too little, but the man who craves more, that is poor.", a: "Seneca" },
  { t: "The best time to plant a tree was 20 years ago. The second best time is now.", a: "Chinese Proverb" },
  { t: "The energy you give off is the energy you receive. Be grateful, be loving, be kind.", a: "Unknown" },
  { t: "Be the energy you want to attract.", a: "Unknown" },
  { t: "What you radiate outward in your thoughts, feelings, and mental images, you attract into your life.", a: "Catherine Ponder" },
  { t: "Thought is the original source of all wealth, all success, all material gain.", a: "Claude M. Bristol" },
  { t: "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.", a: "Christian D. Larson" },
  { t: "When you want something, all the universe conspires in helping you to achieve it.", a: "Paulo Coelho" },
  { t: "And when you want something, all the universe conspires to help you realize your desire.", a: "Paulo Coelho" },
  { t: "Don't give up. Normally it is the last key on the ring which opens the door.", a: "Paulo Coelho" },
  { t: "The secret of life is to fall seven times and get up eight times.", a: "Paulo Coelho" },
  { t: "Start by doing what's necessary; then do what's possible; and suddenly you are doing the impossible.", a: "Francis of Assisi" },
  { t: "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.", a: "Nikola Tesla" },
  { t: "I am thankful for my struggle because without it I wouldn't have stumbled upon my strength.", a: "Alex Elle" },
  { t: "You were born with potential. You were born with goodness and trust.", a: "Rumi" },
  { t: "Don't be satisfied with stories of how things have gone with others. Unfold your own myth.", a: "Rumi" },
  { t: "Live life as if everything is rigged in your favor.", a: "Rumi" },
  { t: "Set your life on fire. Seek those who fan your flames.", a: "Rumi" },
  { t: "Whatever you hold in your mind on a consistent basis is exactly what you will experience in your life.", a: "Tony Robbins" },
];

/** Pick a seeded-random quote per day (same quote all day, different each day) */
const initQuotes = () => {
  const d = new Date();
  const dayOfYear = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  // Simple seeded pseudo-random using day-of-year + year
  const seed = dayOfYear * 2654435761 + d.getFullYear();
  const idx = Math.abs(seed) % QUOTES.length;
  const q = QUOTES[idx];
  $('#quote-text').textContent = q.t;
  $('#quote-author').textContent = `— ${q.a}`;
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

// === ENTRY COMPLETION HELPER ===
const isEntryComplete = (entry) => {
  if (!entry) return false;
  return entry.gratitude.every(x => x.trim() !== '') &&
         entry.manifestations.every(x => x.trim() !== '');
};

const isEntryPartial = (entry) => {
  if (!entry) return false;
  return !isEntryComplete(entry) &&
    (entry.gratitude.some(x => x.trim() !== '') || entry.manifestations.some(x => x.trim() !== ''));
};

// === DASHBOARD & CALENDAR ===
const Dashboard = {
  currentDate: new Date(),

  render() {
    this.renderCalendar(this.currentDate, $('#cal-month-label'), $('#cal-grid'), true);
    this.calculateStats();

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
      statusText.textContent = '⚠️ Your practice is not yet complete.';
    }
  },

  calculateStats() {
    const allDates = Storage.getAllDates();
    // Only count fully completed days
    const completedSet = new Set(
      allDates.filter(date => isEntryComplete(Storage.getEntry(date)))
    );

    $('#stat-total').textContent = completedSet.size;

    if (completedSet.size === 0) {
      $('#stat-streak').textContent = '0';
      $('#stat-longest').textContent = '0';
      return;
    }

    // Walk backwards from today to calculate streaks
    const todayISO = getTodayISO();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let streakBroken = false;

    // Collect all days we need to check
    const sortedCompleted = [...completedSet].sort();
    if (sortedCompleted.length === 0) return;

    // Longest streak: iterate sorted dates detecting consecutive days
    let lTemp = 1;
    for (let i = 1; i < sortedCompleted.length; i++) {
      const prev = fromISO(sortedCompleted[i - 1]);
      const curr = fromISO(sortedCompleted[i]);
      const diff = Math.round((curr - prev) / 86400000);
      if (diff === 1) {
        lTemp++;
        if (lTemp > longestStreak) longestStreak = lTemp;
      } else {
        lTemp = 1;
      }
    }
    if (longestStreak === 0) longestStreak = 1; // at least 1 if any completed

    // Current streak: count consecutive days backwards from today
    const today = fromISO(todayISO);
    let checkDate = new Date(today);

    // If today isn't done, we can still have streak from yesterday
    if (!completedSet.has(todayISO)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

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

    $('#stat-streak').textContent = currentStreak;
    $('#stat-longest').textContent = longestStreak;
  },

  renderCalendar(targetDate, labelEl, gridEl, isDashboard = false, onDayClick = null) {
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const todayISO = getTodayISO();

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    labelEl.textContent = `${monthNames[month]} ${year}`;

    gridEl.innerHTML = '';

    // Day-of-week headers
    ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach(d => {
      const el = document.createElement('div');
      el.className = 'cal-dow';
      el.textContent = d;
      gridEl.appendChild(el);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty leading cells
    for (let i = 0; i < firstDay; i++) {
      const el = document.createElement('div');
      el.className = 'cal-day empty';
      gridEl.appendChild(el);
    }

    // Day cells
    for (let i = 1; i <= daysInMonth; i++) {
      const el = document.createElement('div');
      // Use local date to get ISO — avoids UTC shift
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

      // Click handler
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

  initView() {
    this.entryDate = getTodayISO();

    // Format date in local time properly
    const d = fromISO(this.entryDate);
    $('#entry-date-label').textContent = d.toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Build fields only once
    if (!this.fieldsBuilt) {
      this.buildFields();
      this.fieldsBuilt = true;
    }

    // Bind events only once
    if (!this.eventsbound) {
      this.bindEvents();
      this.eventsbound = true;
    }

    this.loadData();
    this.switchTab('gratitude');

    // Hide past readonly banner (only shown from history)
    $('#past-readonly-banner').style.display = 'none';
    // Make all fields editable
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
          <textarea class="entry-textarea" id="${prefix}-${i}" rows="2" placeholder="${placeholder}"></textarea>
        `;
        container.appendChild(div);
      }
    };

    build('gratitude-fields', 'g', 'I am grateful for…');
    build('manifestation-fields', 'm', 'Dear Universe, I am having…');
  },

  bindEvents() {
    $$('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    $('#gratitude-fields').addEventListener('input', () => this.validate());
    $('#manifestation-fields').addEventListener('input', () => this.validate());

    $('#submit-btn').addEventListener('click', () => this.save());
  },

  switchTab(tab) {
    $$('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    $$('.tab-content').forEach(c => c.classList.remove('active'));
    $(`#content-${tab}`).classList.add('active');
  },

  loadData() {
    const entry = Storage.getEntry(this.entryDate);
    for (let i = 0; i < 10; i++) {
      const gEl = $(`#g-${i + 1}`);
      const mEl = $(`#m-${i + 1}`);
      if (gEl) gEl.value = entry ? (entry.gratitude[i] || '') : '';
      if (mEl) mEl.value = entry ? (entry.manifestations[i] || '') : '';
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

    $('#progress-gratitude').style.width = `${(gCount / 10) * 100}%`;
    $('#progress-manifestations').style.width = `${(mCount / 10) * 100}%`;

    const canSubmit = gCount === 10 && mCount === 10;
    const btn = $('#submit-btn');
    btn.disabled = !canSubmit;

    if (canSubmit) {
      $('#submit-hint').textContent = 'Ready to save ✨';
      $('#submit-hint').style.color = 'var(--green)';
    } else {
      $('#submit-hint').textContent = `Gratitude: ${gCount}/10 · Manifestations: ${mCount}/10`;
      $('#submit-hint').style.color = 'var(--text-muted)';
    }
  },

  save() {
    const gratitude = [];
    const manifestations = [];

    for (let i = 1; i <= 10; i++) {
      gratitude.push($(`#g-${i}`).value.trim());
      manifestations.push($(`#m-${i}`).value.trim());
    }

    Storage.saveEntry(this.entryDate, { gratitude, manifestations });
    showToast('✨ Today\'s practice saved!');

    // Refresh submit area to reflect saved state
    this.validate();
    // Refresh dashboard in background
    Dashboard.render();
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
      // Re-highlight selected cell
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
    // Update month if needed
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

    const renderList = (arr) =>
      arr.map((item, i) => item.trim()
        ? `<li><span class="num">${i + 1}.</span><span>${item}</span></li>`
        : '').join('');

    viewer.innerHTML = `
      <div class="history-entry card" style="margin-top:16px;">
        <h3 style="font-family:'Cormorant Garamond',serif; font-weight:400; text-align:center; margin-bottom:20px;">${dateStr}</h3>

        <div class="section-label">🌸 Gratitude</div>
        <ul class="entry-list" style="margin-bottom:24px;">${renderList(entry.gratitude)}</ul>

        <div class="section-label">🌟 Manifestations</div>
        <ul class="entry-list">${renderList(entry.manifestations)}</ul>
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
  render() {
    this.populateSelect();
    this.renderTimeline();

    // Set default date to today (avoid re-setting on every render if user changed it)
    if (!$('#result-date').value) {
      $('#result-date').value = getTodayISO();
    }

    // Use onclick to avoid multiple listeners
    $('#result-save-btn').onclick = () => {
      const desc = $('#result-desc').value.trim();
      const date = $('#result-date').value;
      const linked = $('#result-link').value;

      if (!desc) { showToast('Please describe what manifested.'); return; }
      if (!date) { showToast('Please set a date achieved.'); return; }

      Storage.saveResult({ description: desc, dateAchieved: date, linkedEntry: linked || null });

      $('#result-desc').value = '';
      this.renderTimeline();
      this.populateSelect();
      showToast('✨ Result logged successfully!');
    };
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
    const results = Storage.getResults();
    const timeline = $('#results-timeline');

    if (results.length === 0) {
      timeline.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🌟</div>
          <p>Log your first manifestation result above — every achievement is a miracle worth recording.</p>
        </div>
      `;
      return;
    }

    let html = '<div class="timeline">';
    results.forEach(res => {
      const linkedHtml = res.linkedEntry
        ? `<div class="timeline-linked">🔗 ${fromISO(res.linkedEntry).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>`
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

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initQuotes();
  Router.init();
});

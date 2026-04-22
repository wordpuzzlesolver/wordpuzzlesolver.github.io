// Word Puzzle Solver — Core Engine
class WordSolver {
  constructor() {
    this.wordList = [];
    this.loaded = false;
    this.loadWords();
  }

  async loadWords() {
    try {
      const response = await fetch('data/words.txt');
      const text = await response.text();
      this.wordList = text.split(/\r?\n/).map(w => w.trim().toLowerCase()).filter(w => w.length > 0);
      this.loaded = true;
      document.dispatchEvent(new CustomEvent('wordsLoaded', { detail: { count: this.wordList.length } }));
    } catch (err) {
      console.error('Failed to load word list:', err);
      // Fallback: small built-in list
      this.wordList = ['able','ace','act','add','age','ago','aid','aim','air','all','and','ant','any','ape','app','are','arm','art','ask','ate','axe','bag','ban','bar','bat','bay','bed','bet','big','bit','bog','bow','box','boy','bud','bug','bun','bus','but','buy','cab','can','cap','car','cat','cob','cod','cog','cop','cow','cry','cub','cup','cut','dab','dad','dam','dim','dip','dog','dot','dry','dub','dug','ear','eat','egg','ego','elf','elk','elm','end','era','eve','ewe','eye','fad','fan','far','fat','fax','fed','few','fig','fit','fix','fly','fog','foe','for','fox','fry','fun','fur','gag','gap','gas','gel','gem','get','gin','gnu','god','got','gum','gun','gut','guy','gym','had','ham','has','hat','hay','hem','hen','hew','him','hip','his','hit','hob','hog','hot','hub','hug','hum','hut','ice','ill','imp','ink','ion','ire','ivy','jab','jam','jar','jaw','jay','jig','job','jot','joy','jug','jut','keg','key','kin','kit','lab','lad','lap','law','lax','lay','lea','led','leg','lid','lip','lit','log','lot','low','lug','mad','man','map','mat','maw','may','mob','mod','mop','mud','mug','nab','nag','nap','nip','nit','nod','nor','not','now','nun','nut','oak','oar','oat','odd','ode','off','oft','ohm','oil','old','one','opt','orb','ore','our','out','owl','own','pad','pan','par','pat','paw','pay','pea','peg','pen','pew','pie','pig','pin','pit','pod','pot','pow','pro','pub','pun','pup','pus','put','rad','ram','ran','rap','rat','raw','ray','red','rid','rig','rip','rob','rod','rot','row','rub','rug','rum','run','rut','rye','sac','sad','sag','sap','sat','saw','say','sea','set','sew','shy','sin','sip','sir','sis','sit','six','sky','sob','sod','son','sow','soy','spa','spy','sty','sub','sue','sum','sun','sup','tab','tan','tap','tar','tax','tea','ten','the','tie','tin','tip','toe','tog','ton','too','top','toy','try','tub','two','urn','use','van','vat','via','vie','war','was','way','web','wed','who','why','wig','win','wit','woe','woo','yak','yam','yap','yew','you'];
      this.loaded = true;
      document.dispatchEvent(new CustomEvent('wordsLoaded', { detail: { count: this.wordList.length } }));
    }
  }

  // Check if a word can be formed from given letters
  canFormWord(word, letters) {
    const available = letters.toLowerCase().split('');
    const needed = word.toLowerCase().split('');
    const pool = [...available];
    for (const ch of needed) {
      const idx = pool.indexOf(ch);
      if (idx === -1) return false;
      pool.splice(idx, 1);
    }
    return true;
  }

  // Check if word matches a pattern (? = any letter)
  matchesPattern(word, pattern) {
    if (!pattern) return true;
    if (word.length !== pattern.length) return false;
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] !== '?' && pattern[i].toLowerCase() !== word[i]) return false;
    }
    return true;
  }

  // Check if word contains required letters
  containsRequired(word, required) {
    if (!required) return true;
    for (const ch of required.toLowerCase()) {
      if (!word.includes(ch)) return false;
    }
    return true;
  }

  // Check if word excludes forbidden letters
  excludesForbidden(word, forbidden) {
    if (!forbidden) return true;
    for (const ch of forbidden.toLowerCase()) {
      if (word.includes(ch)) return false;
    }
    return true;
  }

  solve({ letters, pattern, minLength, maxLength, mustInclude, mustExclude, startsWith, endsWith }) {
    if (!this.loaded || !letters.trim()) return [];

    const results = this.wordList.filter(word => {
      if (minLength && word.length < minLength) return false;
      if (maxLength && word.length > maxLength) return false;
      if (startsWith && !word.startsWith(startsWith.toLowerCase())) return false;
      if (endsWith && !word.endsWith(endsWith.toLowerCase())) return false;
      if (!this.canFormWord(word, letters)) return false;
      if (!this.matchesPattern(word, pattern)) return false;
      if (!this.containsRequired(word, mustInclude)) return false;
      if (!this.excludesForbidden(word, mustExclude)) return false;
      return true;
    });

    // Sort: longer words first, then alphabetically
    return results.sort((a, b) => b.length - a.length || a.localeCompare(b));
  }
}

// ─── Solver UI ──────────────────────────────────────────────────────────────
class SolverUI {
  constructor(solver) {
    this.solver = solver;
    this.history = JSON.parse(localStorage.getItem('wps_history') || '[]');
    this.init();
  }

  init() {
    document.addEventListener('wordsLoaded', (e) => {
      const badge = document.getElementById('wordCount');
      if (badge) badge.textContent = e.detail.count.toLocaleString();
    });

    const form = document.getElementById('solverForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.runSolver();
      });
    }

    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) clearBtn.addEventListener('click', () => this.clearAll());

    const copyBtn = document.getElementById('copyResults');
    if (copyBtn) copyBtn.addEventListener('click', () => this.copyResults());

    const toggleAdv = document.getElementById('toggleAdvanced');
    const advPanel = document.getElementById('advancedPanel');
    if (toggleAdv && advPanel) {
      toggleAdv.addEventListener('click', () => {
        const open = advPanel.classList.toggle('open');
        toggleAdv.setAttribute('aria-expanded', String(open));
        toggleAdv.textContent = open ? '▲ Hide Advanced Options' : '▼ Advanced Options';
      });
    }

    // Letter tiles live preview
    const lettersInput = document.getElementById('lettersInput');
    if (lettersInput) {
      lettersInput.addEventListener('input', () => this.updateTilePreview());
    }

    this.renderHistory();
  }

  updateTilePreview() {
    const val = document.getElementById('lettersInput').value.toUpperCase().replace(/[^A-Z]/g, '');
    const preview = document.getElementById('tilePreview');
    if (!preview) return;
    preview.innerHTML = val.split('').map(ch =>
      `<span class="letter-tile" style="animation-delay:${Math.random()*0.2}s">${ch}</span>`
    ).join('');
  }

  runSolver() {
    const letters = document.getElementById('lettersInput').value;
    if (!letters.trim()) return;

    const pattern = document.getElementById('patternInput')?.value || '';
    const minLength = parseInt(document.getElementById('minLen')?.value) || 1;
    const maxLength = parseInt(document.getElementById('maxLen')?.value) || 20;
    const mustInclude = document.getElementById('mustInclude')?.value || '';
    const mustExclude = document.getElementById('mustExclude')?.value || '';
    const startsWith = document.getElementById('startsWith')?.value || '';
    const endsWith = document.getElementById('endsWith')?.value || '';

    this.showLoading();

    setTimeout(() => {
      const results = this.solver.solve({ letters, pattern, minLength, maxLength, mustInclude, mustExclude, startsWith, endsWith });
      this.displayResults(results, letters);
      this.addToHistory(letters, results.length);
    }, 50);
  }

  showLoading() {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    container.innerHTML = `
      <div class="loading-state" role="status" aria-live="polite">
        <div class="spinner"></div>
        <p>Searching dictionary…</p>
      </div>`;
  }

  displayResults(results, letters) {
    const container = document.getElementById('resultsContainer');
    const statsEl = document.getElementById('resultStats');
    if (!container) return;

    if (statsEl) {
      statsEl.innerHTML = results.length > 0
        ? `<strong>${results.length}</strong> word${results.length !== 1 ? 's' : ''} found for <em>"${letters.toUpperCase()}"</em>`
        : `No words found for <em>"${letters.toUpperCase()}"</em>`;
    }

    if (results.length === 0) {
      container.innerHTML = `
        <div class="empty-state" role="status">
          <div class="empty-icon">🔍</div>
          <h3>No matching words found</h3>
          <p>Try adding more letters, relaxing your filters, or check your spelling.</p>
        </div>`;
      return;
    }

    // Group by word length
    const grouped = {};
    results.forEach(word => {
      const len = word.length;
      if (!grouped[len]) grouped[len] = [];
      grouped[len].push(word);
    });

    const lengths = Object.keys(grouped).map(Number).sort((a, b) => b - a);

    let html = `<div class="results-tabs" role="tablist" aria-label="Results by word length">`;
    html += `<button class="tab-btn active" data-len="all" role="tab" aria-selected="true">All (${results.length})</button>`;
    lengths.forEach(len => {
      html += `<button class="tab-btn" data-len="${len}" role="tab" aria-selected="false">${len} Letters (${grouped[len].length})</button>`;
    });
    html += `</div>`;

    html += `<div class="results-grid-wrapper">`;
    html += `<div class="results-group active" id="group-all">`;
    results.forEach((word, i) => {
      html += `<button class="word-chip" style="animation-delay:${Math.min(i * 0.015, 0.5)}s" title="Click to see definition" data-word="${word}">${word.toUpperCase()}</button>`;
    });
    html += `</div>`;

    lengths.forEach(len => {
      html += `<div class="results-group" id="group-${len}">`;
      grouped[len].forEach((word, i) => {
        html += `<button class="word-chip" style="animation-delay:${i * 0.02}s" title="Click to see definition" data-word="${word}">${word.toUpperCase()}</button>`;
      });
      html += `</div>`;
    });
    html += `</div>`;

    container.innerHTML = html;

    // Tab switching
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        container.querySelectorAll('.results-group').forEach(g => g.classList.remove('active'));
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const target = container.querySelector(`#group-${btn.dataset.len}`);
        if (target) target.classList.add('active');
      });
    });

    // Word click → definition lookup
    container.querySelectorAll('.word-chip').forEach(chip => {
      chip.addEventListener('click', () => this.showWordInfo(chip.dataset.word));
    });

    // Store results for copy
    this._lastResults = results;
  }

  showWordInfo(word) {
    const modal = document.getElementById('wordModal');
    const modalWord = document.getElementById('modalWord');
    const modalDef = document.getElementById('modalDef');
    if (!modal) return;
    modalWord.textContent = word.toUpperCase();
    modalDef.innerHTML = `<div class="spinner small"></div> Looking up definition…`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    // Use Free Dictionary API
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data[0]?.meanings) {
          const meanings = data[0].meanings;
          let html = '';
          meanings.slice(0, 2).forEach(m => {
            html += `<span class="pos-badge">${m.partOfSpeech}</span>`;
            m.definitions.slice(0, 2).forEach(d => {
              html += `<p class="definition">${d.definition}</p>`;
              if (d.example) html += `<p class="example">"${d.example}"</p>`;
            });
          });
          if (data[0].phonetic) html = `<p class="phonetic">${data[0].phonetic}</p>` + html;
          modalDef.innerHTML = html;
        } else {
          modalDef.innerHTML = `<p class="no-def">Definition not found in our database.</p>`;
        }
      })
      .catch(() => {
        modalDef.innerHTML = `<p class="no-def">Could not fetch definition. Check your connection.</p>`;
      });
  }

  copyResults() {
    if (!this._lastResults || this._lastResults.length === 0) return;
    const text = this._lastResults.join(', ');
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('copyResults');
      if (btn) { btn.textContent = '✓ Copied!'; setTimeout(() => btn.textContent = '⧉ Copy All', 2000); }
    });
  }

  clearAll() {
    document.getElementById('lettersInput').value = '';
    document.getElementById('tilePreview').innerHTML = '';
    document.getElementById('resultsContainer').innerHTML = '<div class="idle-state"><p>Enter your letters above to begin</p></div>';
    const statsEl = document.getElementById('resultStats');
    if (statsEl) statsEl.textContent = '';
    ['patternInput','mustInclude','mustExclude','startsWith','endsWith'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const minLen = document.getElementById('minLen');
    const maxLen = document.getElementById('maxLen');
    if (minLen) minLen.value = 2;
    if (maxLen) maxLen.value = '';
    this._lastResults = [];
  }

  addToHistory(letters, count) {
    const entry = { letters: letters.toUpperCase(), count, time: new Date().toLocaleTimeString() };
    this.history.unshift(entry);
    if (this.history.length > 8) this.history.pop();
    localStorage.setItem('wps_history', JSON.stringify(this.history));
    this.renderHistory();
  }

  renderHistory() {
    const container = document.getElementById('searchHistory');
    if (!container) return;
    if (this.history.length === 0) {
      container.innerHTML = '<p class="history-empty">Your recent searches will appear here.</p>';
      return;
    }
    container.innerHTML = this.history.map(entry =>
      `<button class="history-chip" data-letters="${entry.letters}" title="${entry.count} words found at ${entry.time}">
        <span class="history-letters">${entry.letters}</span>
        <span class="history-count">${entry.count} words</span>
      </button>`
    ).join('');

    container.querySelectorAll('.history-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.getElementById('lettersInput').value = chip.dataset.letters;
        this.updateTilePreview();
        this.runSolver();
        document.getElementById('solver').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }
}

// ─── Modal ───────────────────────────────────────────────────────────────────
function initModal() {
  const modal = document.getElementById('wordModal');
  const closeBtn = document.getElementById('modalClose');
  if (!modal) return;

  closeBtn?.addEventListener('click', () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  });
}

// ─── Scroll Animations ───────────────────────────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ─── Stats Counter ───────────────────────────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = Math.round(current).toLocaleString();
        }, 16);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const solver = new WordSolver();
  new SolverUI(solver);
  initModal();
  initScrollAnimations();
  initCounters();
});

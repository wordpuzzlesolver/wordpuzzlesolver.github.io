// Header Component
class Header {
  constructor() {
    this.render();
    this.initScrollBehavior();
  }

  render() {
    const header = document.createElement('header');
    header.id = 'site-header';
    header.innerHTML = `
      <nav class="navbar" role="navigation" aria-label="Main navigation">
        <div class="nav-container">
          <a href="/" class="nav-brand" aria-label="WordPuzzleSolver Home">
            <div class="brand-icon">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="2" y="2" width="16" height="16" rx="3" fill="var(--accent)"/>
                <rect x="22" y="2" width="16" height="16" rx="3" fill="var(--accent-2)"/>
                <rect x="2" y="22" width="16" height="16" rx="3" fill="var(--accent-2)"/>
                <rect x="22" y="22" width="16" height="16" rx="3" fill="var(--accent)"/>
                <text x="7" y="15" font-size="11" font-weight="800" fill="white" font-family="serif">W</text>
                <text x="26" y="15" font-size="11" font-weight="800" fill="white" font-family="serif">P</text>
                <text x="7" y="35" font-size="11" font-weight="800" fill="white" font-family="serif">S</text>
                <text x="26" y="35" font-size="11" font-weight="800" fill="white" font-family="serif">✓</text>
              </svg>
            </div>
            <div class="brand-text">
              <span class="brand-name">WordPuzzle<strong>Solver</strong></span>
              <span class="brand-tagline">Unscramble Anything</span>
            </div>
          </a>
          <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navMenu" aria-label="Toggle navigation">
            <span></span><span></span><span></span>
          </button>
          <ul class="nav-menu" id="navMenu" role="list">
            <li><a href="#solver" class="nav-link">Solver</a></li>
            <li><a href="#how-it-works" class="nav-link">How It Works</a></li>
            <li><a href="#word-games" class="nav-link">Word Games</a></li>
            <li><a href="#strategies" class="nav-link">Strategies</a></li>
            <li><a href="#about" class="nav-link">About</a></li>
            <li><a href="#solver" class="nav-cta">Try Solver <span>→</span></a></li>
          </ul>
        </div>
      </nav>
    `;
    document.body.prepend(header);
  }

  initScrollBehavior() {
    const header = document.getElementById('site-header');
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('open');
      toggle.classList.toggle('active');
    });

    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
            menu.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.classList.remove('active');
          }
        }
      });
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 100) {
          current = section.getAttribute('id');
        }
      });
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => new Header());

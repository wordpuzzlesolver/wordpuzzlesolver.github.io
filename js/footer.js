// Footer Component
class Footer {
  constructor() {
    this.render();
  }

  render() {
    const footer = document.createElement('footer');
    footer.id = 'site-footer';
    footer.innerHTML = `
      <div class="footer-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--footer-bg)"/>
        </svg>
      </div>
      <div class="footer-body">
        <div class="footer-container">
          <div class="footer-brand">
            <a href="/" class="footer-logo" aria-label="WordPuzzleSolver Home">
              <span class="logo-tile">W</span><span class="logo-tile">P</span><span class="logo-tile">S</span>
            </a>
            <p class="footer-desc">The most powerful free word puzzle solver online. Unscramble letters, solve anagrams, and find hidden words instantly using our comprehensive English dictionary.</p>
            <div class="footer-social" aria-label="Social links">
              <a href="#" aria-label="Twitter/X" class="social-btn">𝕏</a>
              <a href="#" aria-label="Facebook" class="social-btn">f</a>
              <a href="#" aria-label="Reddit" class="social-btn">r</a>
            </div>
          </div>

          <div class="footer-links">
            <div class="footer-col">
              <h3>Solver Tools</h3>
              <ul>
                <li><a href="#solver">Anagram Solver</a></li>
                <li><a href="#solver">Word Unscrambler</a></li>
                <li><a href="#solver">Pattern Matcher</a></li>
                <li><a href="#solver">Letter Filter</a></li>
                <li><a href="#solver">Word Finder</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h3>Word Games</h3>
              <ul>
                <li><a href="#word-games">Scrabble Helper</a></li>
                <li><a href="#word-games">Wordle Solver</a></li>
                <li><a href="#word-games">Crossword Aid</a></li>
                <li><a href="#word-games">Words With Friends</a></li>
                <li><a href="#word-games">Jumble Solver</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h3>Learn</h3>
              <ul>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#strategies">Word Strategies</a></li>
                <li><a href="#tips">Pro Tips</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-container footer-bottom-inner">
            <p class="copyright">© ${new Date().getFullYear()} <strong>WordPuzzleSolver</strong> — wordpuzzlesolver.github.io. All rights reserved.</p>
            <div class="footer-legal">
              <a href="#">Privacy Policy</a>
              <span aria-hidden="true">·</span>
              <a href="#">Terms of Use</a>
              <span aria-hidden="true">·</span>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(footer);
  }
}

document.addEventListener('DOMContentLoaded', () => new Footer());

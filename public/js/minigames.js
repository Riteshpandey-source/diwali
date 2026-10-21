// ========================================================
// DIWALI FESTIVAL MINI-GAMES & COIN ACTIVITIES
// ========================================================

class DiwaliMiniGamesManager {
  constructor() {
    this.activeGame = null;
    this.sprintTimer = null;
    this.sprintTimeLeft = 20;
    this.sprintScore = 0;
  }

  init() {
    this.setupUI();
  }

  setupUI() {
    const openGamesBtn = document.getElementById('openGamesBtn');
    if (openGamesBtn) {
      openGamesBtn.addEventListener('click', () => this.openGamesModal());
    }

    document.querySelectorAll('[data-close="miniGamesModal"]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeGamesModal();
      });
    });

    const startSprintBtn = document.getElementById('startDiyaSprintBtn');
    if (startSprintBtn) {
      startSprintBtn.addEventListener('click', () => this.launchDiyaSprint());
    }

    const startRangoliBtn = document.getElementById('startRangoliBtn');
    if (startRangoliBtn) {
      startRangoliBtn.addEventListener('click', () => this.launchRangoliArtisan());
    }

    const startQuizBtn = document.getElementById('startQuizBtn');
    if (startQuizBtn) {
      startQuizBtn.addEventListener('click', () => this.launchTriviaQuiz());
    }
  }

  openGamesModal() {
    const modal = document.getElementById('miniGamesModal');
    const area = document.getElementById('activeMiniGameArea');
    const grid = document.querySelector('.minigames-selection-grid');

    if (area) area.classList.add('hidden');
    if (grid) grid.classList.remove('hidden');
    if (modal) modal.classList.remove('hidden');

    window.festiveAudio.playDiyaChime();
  }

  closeGamesModal() {
    if (this.sprintTimer) {
      clearInterval(this.sprintTimer);
      this.sprintTimer = null;
    }
    const modal = document.getElementById('miniGamesModal');
    if (modal) modal.classList.add('hidden');
  }

  // ========================================================
  // 1. DIYA LIGHTING SPRINT
  // ========================================================
  launchDiyaSprint() {
    const grid = document.querySelector('.minigames-selection-grid');
    const area = document.getElementById('activeMiniGameArea');
    if (grid) grid.classList.add('hidden');
    if (area) area.classList.remove('hidden');

    this.sprintTimeLeft = 20;
    this.sprintScore = 0;
    const targetCount = 12;

    area.innerHTML = `
      <div class="mg-header-bar">
        <span>⏱️ Time: <span id="sprintTimerText">${this.sprintTimeLeft}</span>s</span>
        <span>Diyas Lit: <span id="sprintScoreText">0</span>/${targetCount}</span>
      </div>
      <p style="color:var(--text-muted);font-size:13px;text-align:center;">
        Quickly click or tap all the unlit earthen diyas before the festive countdown ends!
      </p>
      <div class="diya-sprint-arena" id="sprintArena"></div>
      <button class="btn btn-secondary" id="exitSprintBtn">Exit to Menu</button>
    `;

    document.getElementById('exitSprintBtn').addEventListener('click', () => this.openGamesModal());

    const arena = document.getElementById('sprintArena');
    for (let i = 0; i < targetCount; i++) {
      const diya = document.createElement('div');
      diya.className = 'sprint-target-diya';
      diya.innerHTML = '🪔';
      diya.addEventListener('click', () => {
        if (!diya.classList.contains('lit')) {
          diya.classList.add('lit');
          this.sprintScore++;
          window.festiveAudio.playDiyaChime();
          const scoreEl = document.getElementById('sprintScoreText');
          if (scoreEl) scoreEl.textContent = this.sprintScore;

          if (this.sprintScore === targetCount) {
            this.finishDiyaSprint(true);
          }
        }
      });
      arena.appendChild(diya);
    }

    this.sprintTimer = setInterval(() => {
      this.sprintTimeLeft--;
      const timerEl = document.getElementById('sprintTimerText');
      if (timerEl) timerEl.textContent = this.sprintTimeLeft;

      if (this.sprintTimeLeft <= 0) {
        this.finishDiyaSprint(false);
      }
    }, 1000);
  }

  finishDiyaSprint(allCompleted) {
    if (this.sprintTimer) {
      clearInterval(this.sprintTimer);
      this.sprintTimer = null;
    }

    const reward = this.sprintScore * 8 + (allCompleted ? 20 : 0);
    window.diwaliShop.addCoins(reward, 'Diya Lighting Sprint Victory');
    window.festiveAudio.playTempleBell();

    // Notify Diwali Night Mission
    if (window.diwaliMission) {
      window.diwaliMission.onChallengeCompleted('diya_sprint');
    }

    const area = document.getElementById('activeMiniGameArea');
    area.innerHTML = `
      <div style="text-align:center;padding:20px;">
        <h3 style="font-family:var(--font-serif);color:var(--gold-bright);font-size:24px;">
          ${allCompleted ? '🎉 Perfect Sprint!' : '⏰ Time Up!'}
        </h3>
        <p style="margin:12px 0;font-size:16px;">
          You lit <strong>${this.sprintScore}</strong> diyas and earned <strong>${reward}</strong> Lakshmi Gold Coins 🪙!
        </p>
        <button class="btn btn-gold" id="sprintDoneBtn" style="margin-top:14px;">Collect & Return</button>
      </div>
    `;

    document.getElementById('sprintDoneBtn').addEventListener('click', () => this.openGamesModal());
  }

  // ========================================================
  // 2. RANGOLI ARTISAN MINI-GAME
  // ========================================================
  launchRangoliArtisan() {
    const grid = document.querySelector('.minigames-selection-grid');
    const area = document.getElementById('activeMiniGameArea');
    if (grid) grid.classList.add('hidden');
    if (area) area.classList.remove('hidden');

    const colors = ['#ea580c', '#ec4899', '#06b6d4', '#10b981', '#fbbf24'];
    let selectedColor = colors[0];
    let petalsColored = 0;
    const totalPetals = 8;

    area.innerHTML = `
      <div class="mg-header-bar">
        <span>🌸 Rangoli Artisan</span>
        <span>Colored: <span id="rangoliProgress">0</span>/${totalPetals}</span>
      </div>
      <p style="color:var(--text-muted);font-size:13px;text-align:center;">
        Select an auspicious festive gulal color and tap each petal to complete the holy geometric mandala!
      </p>
      
      <div style="display:flex;gap:12px;margin:10px 0;">
        ${colors.map((c, i) => `
          <button class="color-palette-btn" data-color="${c}" style="width:36px;height:36px;border-radius:50%;background:${c};border:2px solid ${i === 0 ? '#fff' : 'transparent'};cursor:pointer;"></button>
        `).join('')}
      </div>

      <svg width="220" height="220" viewBox="0 0 200 200" id="rangoliSvg" style="background:#0b081a;border-radius:50%;border:2px solid var(--border-gold);box-shadow:0 0 25px rgba(245,158,11,0.2);">
        <circle cx="100" cy="100" r="95" fill="none" stroke="#f59e0b" stroke-width="2"/>
        <g id="petalsGroup"></g>
        <circle cx="100" cy="100" r="26" fill="#fbbf24"/>
        <circle cx="100" cy="100" r="12" fill="#ef4444"/>
      </svg>

      <button class="btn btn-secondary" id="exitRangoliBtn" style="margin-top:12px;">Exit to Menu</button>
    `;

    document.getElementById('exitRangoliBtn').addEventListener('click', () => this.openGamesModal());

    // Color pickers
    const palBtns = area.querySelectorAll('.color-palette-btn');
    palBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        palBtns.forEach(b => b.style.borderColor = 'transparent');
        btn.style.borderColor = '#fff';
        selectedColor = btn.getAttribute('data-color');
      });
    });

    // Generate 8 SVG petals
    const petalsGroup = document.getElementById('petalsGroup');
    for (let i = 0; i < totalPetals; i++) {
      const angle = (i * 360) / totalPetals;
      const petal = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      petal.setAttribute('cx', '100');
      petal.setAttribute('cy', '45');
      petal.setAttribute('rx', '18');
      petal.setAttribute('ry', '34');
      petal.setAttribute('fill', '#1e1838');
      petal.setAttribute('stroke', '#fbbf24');
      petal.setAttribute('stroke-width', '1.5');
      petal.setAttribute('transform', `rotate(${angle} 100 100)`);
      petal.style.cursor = 'pointer';

      let isColored = false;
      petal.addEventListener('click', () => {
        petal.setAttribute('fill', selectedColor);
        window.festiveAudio.playDiyaChime();
        if (!isColored) {
          isColored = true;
          petalsColored++;
          document.getElementById('rangoliProgress').textContent = petalsColored;
          if (petalsColored === totalPetals) {
            setTimeout(() => this.finishRangoli(), 600);
          }
        }
      });

      petalsGroup.appendChild(petal);
    }
  }

  finishRangoli() {
    window.diwaliShop.addCoins(60, 'Rangoli Artisan Masterpiece');
    window.festiveAudio.playTempleBell();

    // Notify Diwali Night Mission
    if (window.diwaliMission) {
      window.diwaliMission.onChallengeCompleted('rangoli');
    }

    const area = document.getElementById('activeMiniGameArea');
    area.innerHTML = `
      <div style="text-align:center;padding:20px;">
        <h3 style="font-family:var(--font-serif);color:var(--gold-bright);font-size:24px;">✨ Radiant Masterpiece! ✨</h3>
        <p style="margin:12px 0;font-size:16px;">
          Your Rangoli radiates divine grace! You earned <strong>60</strong> Lakshmi Gold Coins 🪙.
        </p>
        <button class="btn btn-gold" id="rangoliDoneBtn" style="margin-top:14px;">Collect & Return</button>
      </div>
    `;
    document.getElementById('rangoliDoneBtn').addEventListener('click', () => this.openGamesModal());
  }

  // ========================================================
  // 3. DIWALI TRIVIA QUIZ
  // ========================================================
  launchTriviaQuiz() {
    const grid = document.querySelector('.minigames-selection-grid');
    const area = document.getElementById('activeMiniGameArea');
    if (grid) grid.classList.add('hidden');
    if (area) area.classList.remove('hidden');

    const questions = [
      {
        q: "What sacred milestone does the lighting of diyas on Diwali night commemorate?",
        options: [
          "The coronation of King Dasharatha",
          "Lord Rama's glorious return to Ayodhya after 14 years of exile",
          "The inception of the Vedic calendar",
          "The arrival of the spring harvest"
        ],
        correct: 1,
        fact: "The citizens of Ayodhya illuminated the entire kingdom with earthen ghee lamps to welcome Lord Rama, Devi Sita, and Lakshmana!"
      },
      {
        q: "Which divine deity is worshipped on the evening of Deepawali for prosperity and auspicious wisdom?",
        options: [
          "Lord Indra",
          "Lord Varuna",
          "Goddess Mahalakshmi & Lord Ganesha",
          "Lord Yama"
        ],
        correct: 2,
        fact: "Goddess Lakshmi brings spiritual and worldly wealth, while Lord Ganesha bestows auspicious wisdom and removes all hurdles."
      },
      {
        q: "What is the spiritual meaning of the sacred clay Diya flame?",
        options: [
          "The journey of light overcoming darkness, knowledge dispelling ignorance",
          "The changing of the monsoon winds",
          "Only a decorative ornament",
          "A countdown to the new moon"
        ],
        correct: 0,
        fact: "The Diya flame symbolizes Tamaso Ma Jyotirgamaya — the eternal journey from darkness into divine radiant light!"
      }
    ];

    let currentQ = 0;
    let earnedCoins = 0;

    const renderQuestion = () => {
      const qData = questions[currentQ];
      area.innerHTML = `
        <div class="mg-header-bar">
          <span>📜 Question ${currentQ + 1}/${questions.length}</span>
          <span>Earned: ${earnedCoins} 🪙</span>
        </div>
        <p style="font-size:15px;color:#fff;font-weight:600;margin:10px 0;text-align:center;">
          ${qData.q}
        </p>
        <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:480px;">
          ${qData.options.map((opt, i) => `
            <button class="quiz-opt-btn btn btn-secondary" data-idx="${i}" style="text-align:left;justify-content:flex-start;padding:12px 16px;">
              ${String.fromCharCode(65 + i)}. ${opt}
            </button>
          `).join('')}
        </div>
        <div id="quizFeedback" style="min-height:30px;font-size:13px;text-align:center;margin-top:6px;"></div>
      `;

      area.querySelectorAll('.quiz-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-idx'));
          const feedback = document.getElementById('quizFeedback');
          area.querySelectorAll('.quiz-opt-btn').forEach(b => b.disabled = true);

          if (idx === qData.correct) {
            btn.style.background = '#10b981';
            btn.style.borderColor = '#34d399';
            earnedCoins += 25;
            window.diwaliShop.addCoins(25, 'Correct Cultural Answer');
            feedback.innerHTML = `<span style="color:#34d399;font-weight:700;">✓ Correct!</span> ${qData.fact}`;
            window.festiveAudio.playCoinChime();
          } else {
            btn.style.background = '#dc2626';
            feedback.innerHTML = `<span style="color:#f87171;font-weight:700;">Insight:</span> ${qData.fact}`;
          }

          setTimeout(() => {
            currentQ++;
            if (currentQ < questions.length) {
              renderQuestion();
            } else {
              this.finishQuiz(earnedCoins);
            }
          }, 2600);
        });
      });
    };

    renderQuestion();
  }

  finishQuiz(totalCoins) {
    // Notify Diwali Night Mission
    if (window.diwaliMission) {
      window.diwaliMission.onChallengeCompleted('quiz');
    }

    const area = document.getElementById('activeMiniGameArea');
    area.innerHTML = `
      <div style="text-align:center;padding:20px;">
        <h3 style="font-family:var(--font-serif);color:var(--gold-bright);font-size:24px;">✨ Blessings & Knowledge! ✨</h3>
        <p style="margin:12px 0;font-size:16px;">
          You completed the Diwali Cultural Quiz and earned <strong>${totalCoins}</strong> Lakshmi Gold Coins 🪙!
        </p>
        <button class="btn btn-gold" id="quizDoneBtn" style="margin-top:14px;">Return to Festival</button>
      </div>
    `;
    document.getElementById('quizDoneBtn').addEventListener('click', () => this.openGamesModal());
  }
}

// Global instance
window.diwaliMiniGames = new DiwaliMiniGamesManager();
window.addEventListener('DOMContentLoaded', () => {
  window.diwaliMiniGames.init();
});

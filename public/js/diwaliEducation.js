// ===================================================================
// DIWALI EDUCATIONAL LEARNING AREA: "DIWALI KYON MANATE HAIN?"
// Interactive 3D Signboard, Storyteller NPC, and polished bilingual
// (Hindi & English) cultural educational modal.
// ===================================================================

class DiwaliEducation3D {
  constructor(scene, world3D, npcManager) {
    this.scene = scene;
    this.world3D = world3D;
    this.mgr = npcManager;

    this.storyTimer = 5.0;
    this.storyInterval = 25.0;
    this.storyIndex = 0;

    this.storyLines = [
      '✨ Dadaji: "बच्चों, दिवाली हमें सिखाती है कि धर्म और सत्य की सदैव विजय होती है।"',
      '🪔 Dadaji: "When Shri Ram, Sita Mata & Lakshman returned to Ayodhya, the entire kingdom was lit with earthen deepams!"',
      '🌟 Dadaji: "दिवाली सिर्फ रोशनी का त्योहार नहीं, बल्कि मन से द्वेष मिटाकर प्रेम और क्षमा बांटने का पर्व है।"',
      '🪙 Dadaji: "On Lakshmi Puja, we pray for auspicious wisdom, purity, and benevolence in our deeds."'
    ];

    this.buildSignboardModel();
    this.setupStorytellerNPC();
    this.injectModalHtml();
  }

  buildSignboardModel() {
    const group = new THREE.Group();
    group.name = 'DiwaliEducationSignboard';
    group.position.set(54.0, 0, 2.0);
    group.rotation.y = -Math.PI / 2; // Facing West onto the Grand Promenade

    // Stone Plinth
    const plinthMat = this.world3D ? this.world3D.materials.curbStone : new THREE.MeshStandardMaterial({ color: 0x8c735d });
    const woodMat = this.world3D ? this.world3D.materials.darkWood : new THREE.MeshStandardMaterial({ color: 0x3d2314 });
    const goldMat = this.world3D ? this.world3D.materials.goldTrim : new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.75 });

    const plinth = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.35, 1.2), plinthMat);
    plinth.position.y = 0.175;
    group.add(plinth);

    // Carved Wooden Posts
    const postGeo = new THREE.CylinderGeometry(0.12, 0.14, 3.2, 8);
    const postL = new THREE.Mesh(postGeo, woodMat);
    postL.position.set(-1.8, 1.7, 0);
    group.add(postL);

    const postR = new THREE.Mesh(postGeo, woodMat);
    postR.position.set(1.8, 1.7, 0);
    group.add(postR);

    // Golden Post Finials
    const finialGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const finialL = new THREE.Mesh(finialGeo, goldMat);
    finialL.position.set(-1.8, 3.35, 0);
    group.add(finialL);

    const finialR = new THREE.Mesh(finialGeo, goldMat);
    finialR.position.set(1.8, 3.35, 0);
    group.add(finialR);

    // Main Signboard Panel Face
    let signboardTexture = null;
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Royal Crimson Background with Gold Trim
      const grad = ctx.createLinearGradient(0, 0, 1024, 0);
      grad.addColorStop(0, '#500724');
      grad.addColorStop(0.5, '#881337');
      grad.addColorStop(1, '#500724');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // Ornate Gold Border
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 10;
      ctx.strokeRect(18, 18, 988, 476);

      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 3;
      ctx.strokeRect(32, 32, 960, 448);

      // Header Banner
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 36px serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ शुभ दीपावली ज्ञान केंद्र ✨', 512, 85);

      // Title in Hindi
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 54px serif';
      ctx.shadowColor = 'rgba(245, 158, 11, 0.9)';
      ctx.shadowBlur = 12;
      ctx.fillText('दिवाली क्यों मनाते हैं?', 512, 175);

      // Title in English
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 38px sans-serif';
      ctx.shadowBlur = 6;
      ctx.fillText('WHY DO WE CELEBRATE DIWALI?', 512, 255);

      // Subtitle & Interactive prompt
      ctx.fillStyle = '#fde68a';
      ctx.font = 'italic 26px serif';
      ctx.fillText('Significance • Shri Ram • Lakshmi Puja • Unity & Lights', 512, 335);

      // Key prompt badge
      ctx.fillStyle = '#f59e0b';
      ctx.roundRect(280, 390, 464, 60, 30);
      ctx.fill();

      ctx.fillStyle = '#451a03';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('👉 Press [E] to Read & Learn 👈', 512, 430);

      signboardTexture = new THREE.CanvasTexture(canvas);
      signboardTexture.colorSpace = THREE.SRGBColorSpace;
    }

    const panelGeo = new THREE.BoxGeometry(3.4, 1.8, 0.15);
    const panelMat = new THREE.MeshStandardMaterial({
      map: signboardTexture,
      color: signboardTexture ? 0xffffff : 0x881337,
      roughness: 0.4,
      metalness: 0.1,
      emissive: new THREE.Color(0x500724),
      emissiveIntensity: 0.35
    });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(0, 2.1, 0);
    panel.castShadow = true;
    group.add(panel);

    // Warm Overhanging Brass Lantern
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.12, 0.38, 8), goldMat);
    lamp.position.set(0, 3.15, 0.25);
    group.add(lamp);



    // Carved Stone Bench for Storyteller
    const benchGeo = new THREE.BoxGeometry(2.4, 0.45, 0.7);
    const bench = new THREE.Mesh(benchGeo, plinthMat);
    bench.position.set(0, 0.225, 1.4);
    group.add(bench);

    this.scene.add(group);

    // Register interactive target with 3D world
    if (this.world3D) {
      this.world3D.interactiveTargets.push({
        id: 'diwali_education_signboard',
        name: 'Diwali Kyon Manate Hain? (Education Kiosk)',
        type: 'diwali_education',
        x: 1430, // 2D mapped coords
        z: 630,
        radius: 45,
        prompt: 'Press [E] to Learn: Why Do We Celebrate Diwali?'
      });
    }
  }

  setupStorytellerNPC() {
    if (!this.mgr) return;

    // Dadaji (Elder Storyteller seated near signboard bench)
    this.dadaji = this.mgr.spawnNPC({
      id: 'storyteller_dadaji',
      name: 'Dadaji (Storyteller)',
      role: 'grandparent',
      homeWp: 'edu_kiosk',
      x: 54.0,
      z: 0.8,
      rotation: -Math.PI / 2,
      colors: { main: 0xfef3c7, accent: 0xd97706, turban: 0x94a3b8, bottom: 0xf8fafc, skin: 0xc88f68 }
    });
    this.dadaji.state = NPCState.TALKING;
    this.dadaji.stateDuration = 20.0;

    // Child Listening 1 (Ankit)
    this.ankit = this.mgr.spawnNPC({
      id: 'listener_ankit',
      name: 'Ankit (Listening)',
      role: 'child_boy',
      homeWp: 'edu_kiosk',
      x: 52.8,
      z: 1.8,
      rotation: Math.PI / 4,
      colors: { main: 0xf97316, accent: 0xfbbf24, turban: 0xf59e0b, bottom: 0xf8fafc, skin: 0xdd9a6b }
    });
    this.ankit.state = NPCState.IDLE;

    // Child Listening 2 (Kavya)
    this.kavya = this.mgr.spawnNPC({
      id: 'listener_kavya',
      name: 'Kavya (Listening)',
      role: 'child_girl',
      homeWp: 'edu_kiosk',
      x: 55.2,
      z: 1.8,
      rotation: -Math.PI / 4,
      colors: { main: 0xdb2777, accent: 0xf59e0b, turban: 0xf43f5e, bottom: 0x7c3aed, skin: 0xdd9a6b }
    });
    this.kavya.state = NPCState.IDLE;
  }

  update(delta) {
    this.storyTimer -= delta;
    if (this.storyTimer <= 0) {
      this.storyTimer = this.storyInterval;
      if (this.dadaji) {
        // Do not broadcast storytelling while player is in or watching the theater/cinema
        if (window.diwaliTheaterModal?.isNearTheater || (window.diwaliEngine3D?.player3D?.isSitting && window.diwaliEngine3D.player3D.currentBench?.isTheaterBench)) {
          return;
        }
        const text = this.storyLines[this.storyIndex % this.storyLines.length];
        this.dadaji.showDialogue(text, 5.5);
        this.dadaji.state = NPCState.TALKING;
        this.storyIndex++;
      }
    }
  }

  openEducationModal() {
    const modal = document.getElementById('diwaliEducationModal');
    if (modal) {
      modal.classList.remove('hidden');
      if (typeof window !== 'undefined' && window.festiveAudio && typeof window.festiveAudio.playDiyaChime === 'function') {
        window.festiveAudio.playDiyaChime();
      }
    }
  }

  injectModalHtml() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('diwaliEducationModal')) return;

    const modalHtml = `
    <div id="diwaliEducationModal" class="modal-backdrop hidden" style="z-index: 120;">
      <div class="modal-dialog wide-dialog" style="max-width: 820px; max-height: 88vh; background: #0c0a1a; border: 2px solid #f59e0b; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.9), 0 0 40px rgba(245,158,11,0.3);">
        <div class="modal-header" style="background: linear-gradient(135deg, #500724 0%, #881337 50%, #500724 100%); border-bottom: 2px solid #f59e0b; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 28px;">🪔</span>
            <div>
              <h2 style="font-family: serif; color: #fbbf24; font-size: 24px; margin: 0;">दिवाली क्यों मनाते हैं?</h2>
              <span style="color: #fef08a; font-size: 13px; font-weight: 600;">Why Do We Celebrate Diwali? Cultural & Spiritual Significance</span>
            </div>
          </div>
          <button id="closeEducationModalBtn" style="background: rgba(255,255,255,0.15); border: 1px solid #f59e0b; color: #fff; font-size: 22px; width: 38px; height: 38px; border-radius: 50%; cursor: pointer;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 24px; overflow-y: auto; color: #f1f5f9; font-size: 14.5px; line-height: 1.7;">
          
          <!-- Sanskrit Shloka Banner -->
          <div style="background: rgba(245,158,11,0.12); border-left: 4px solid #f59e0b; border-radius: 8px; padding: 12px 18px; margin-bottom: 20px; text-align: center;">
            <p style="font-family: serif; font-size: 17px; font-weight: 700; color: #fbbf24; margin: 0 0 4px 0;">
              ॐ असतो मा सद्गमय। तमसो मा ज्योतिर्गमय। मृत्योर्माऽमृतं गमय॥
            </p>
            <span style="font-size: 12.5px; color: #cbd5e1; font-style: italic;">
              "Lead us from ignorance to truth, from darkness to light, from mortality to immortality."
            </span>
          </div>

          <!-- Section 1: Universal Essence -->
          <div style="margin-bottom: 20px;">
            <h3 style="color: #f59e0b; font-size: 17px; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
              <span>🌟</span> 1. The Festival of Lights (Deepotsav) • प्रकाश पर्व
            </h3>
            <p style="color: #cbd5e1; margin-bottom: 6px;">
              <strong>Hindi:</strong> दीपावली भारत का सबसे पावन और प्रकाशमय पर्व है। यह अंधकार पर प्रकाश, अज्ञान पर ज्ञान और बुराई पर अच्छाई की शाश्वत विजय का प्रतीक है। मिट्टी के दीपक (दीये) आत्मा के उस शुद्ध प्रकाश की याद दिलाते हैं जो हर मनुष्य के भीतर विद्यमान है।
            </p>
            <p style="color: #cbd5e1;">
              <strong>English:</strong> Diwali is celebrated worldwide as the festival of lights. The row of clay lamps (<em>deepavali</em>) symbolizes the triumph of inner illumination over spiritual darkness, wisdom over ignorance, and hope over despair.
            </p>
          </div>

          <!-- Section 2: Shri Ram's Return to Ayodhya -->
          <div style="margin-bottom: 20px;">
            <h3 style="color: #f59e0b; font-size: 17px; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
              <span>🏹</span> 2. Return of Shri Ram to Ayodhya • मर्यादा पुरुषोत्तम श्रीराम का आगमन
            </h3>
            <p style="color: #cbd5e1; margin-bottom: 6px;">
              <strong>Hindi:</strong> रामायण के अनुसार, मर्यादा पुरुषोत्तम भगवान श्रीराम, माता सीता और लक्ष्मण जी चौदह वर्ष के वनवास और लंकापति रावण पर धर्म की विजय के पश्चात कार्तिक अमावस्या के दिन अपनी जन्मभूमि अयोध्या लौटे थे। उनके स्वागत में अयोध्यावासियों ने समूचे नगर को घी के दीपकों से जगमगा दिया था।
            </p>
            <p style="color: #cbd5e1;">
              <strong>English:</strong> In many traditions, Diwali marks the joyful homecoming of Lord Rama, Sita, and Lakshmana to Ayodhya after 14 years of exile and the defeat of Ravana. The citizens of Ayodhya illuminated the entire kingdom with deepams to welcome their righteous king.
            </p>
          </div>

          <!-- Section 3: Shri Lakshmi & Ganesha Puja -->
          <div style="margin-bottom: 20px;">
            <h3 style="color: #f59e0b; font-size: 17px; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
              <span>🪙</span> 3. Lakshmi Puja & Auspicious Beginnings • श्री महालक्ष्मी एवं गणेश पूजन
            </h3>
            <p style="color: #cbd5e1; margin-bottom: 6px;">
              <strong>Hindi:</strong> समुद्र मंथन के दौरान कार्तिक अमावस्या को ही धन, ऐश्वर्य और शांति की अधिष्ठात्री देवी मां महालक्ष्मी का प्राकट्य हुआ था। इस दिन विघ्नहर्ता भगवान श्री गणेश और मां महालक्ष्मी की आराधना की जाती है, ताकि घर में सात्विक समृद्धि, सद्बुद्धि और शांति का वास हो।
            </p>
            <p style="color: #cbd5e1;">
              <strong>English:</strong> On the sacred night of Amavasya, Goddess Mahalakshmi is worshipped alongside Lord Ganesha. Devotees pray for noble prosperity, knowledge, auspicious beginnings, and peace in their homes and communities.
            </p>
          </div>

          <!-- Section 4: Diverse Traditions Across Communities -->
          <div style="margin-bottom: 20px;">
            <h3 style="color: #f59e0b; font-size: 17px; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
              <span>🤝</span> 4. Diverse Traditions Across India • अनेक परंपराएं, एक प्रकाश
            </h3>
            <ul style="color: #cbd5e1; padding-left: 20px; margin-bottom: 6px;">
              <li style="margin-bottom: 4px;"><strong>Jain Tradition:</strong> Commemorates the final liberation (<em>Moksha</em> / Nirvana) of Bhagwan Mahavira, the 24th Tirthankara, at Pavapuri.</li>
              <li style="margin-bottom: 4px;"><strong>Sikh Tradition (Bandi Chhor Divas):</strong> Celebrates the historic release of the Sixth Guru, Guru Hargobind Ji, from Gwalior Fort along with 52 innocent kings.</li>
              <li style="margin-bottom: 4px;"><strong>Gujarat & Western India:</strong> The day following Diwali marks <em>Bestu Varas</em>, the vibrant New Year celebrated with gratitude and new account books (Chopda Pujan).</li>
              <li style="margin-bottom: 4px;"><strong>Bengal & Eastern India:</strong> Celebrated with the powerful worship of Maa Shyama Kali, removing negative energies and ignorance.</li>
            </ul>
          </div>

          <!-- Section 5: Universal Values -->
          <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 10px; padding: 14px 18px;">
            <h4 style="color: #34d399; font-size: 15px; margin: 0 0 6px 0;">🌺 Universal Message of Diwali • दीपावली का पावन संदेश</h4>
            <p style="color: #e2e8f0; margin: 0; font-size: 13.5px;">
              Diwali unites families and neighbors in love, forgiveness, gratitude, generosity (<em>Daan</em>), and joy. Lighting diyas, making rangolis, sharing delicious sweets (<em>mithai</em>), and caring for the needy reminds us to kindle compassion in our hearts and celebrate together with unity.
            </p>
          </div>

        </div>

        <div class="modal-footer" style="padding: 14px 24px; border-top: 1px solid rgba(245,158,11,0.2); display: flex; justify-content: space-between; align-items: center; background: #080612; flex-wrap: wrap; gap: 10px;">
          <button id="launchQuizFromEducationBtn" style="background: rgba(245,158,11,0.2); border: 1px solid #f59e0b; color: #fbbf24; padding: 9px 18px; border-radius: 20px; font-weight: 600; cursor: pointer; font-size: 13.5px;">
            🎯 Optional: Take Diwali Traditions Quiz
          </button>
          <button id="closeEducationModalBottomBtn" style="background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: #fff; border: none; padding: 9px 24px; border-radius: 20px; font-weight: 700; cursor: pointer; font-size: 13.5px;">
            Close & Return to Temple ➔
          </button>
        </div>
      </div>
    </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = modalHtml;
    document.body.appendChild(div.firstElementChild);

    // Event listeners
    const closeBtn = document.getElementById('closeEducationModalBtn');
    const closeBottomBtn = document.getElementById('closeEducationModalBottomBtn');
    const quizBtn = document.getElementById('launchQuizFromEducationBtn');
    const modal = document.getElementById('diwaliEducationModal');

    const closeModal = () => {
      if (modal) modal.classList.add('hidden');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeBottomBtn) closeBottomBtn.addEventListener('click', closeModal);
    if (quizBtn) {
      quizBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
        if (window.diwaliMiniGames) {
          window.diwaliMiniGames.openGamesModal();
          window.diwaliMiniGames.launchTriviaQuiz();
        }
      });
    }
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
      modal.addEventListener('keydown', (e) => {
        e.stopPropagation();
        if (e.key === 'Escape') closeModal();
      });
    }
  }
}

if (typeof window !== 'undefined') {
  window.DiwaliEducation3D = DiwaliEducation3D;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DiwaliEducation3D;
}

# 🤝 Contributing to Shubh Deepawali 3D Virtual World

Thank you for your interest in contributing to the **Shubh Deepawali 3D Virtual World & Festival Experience**! 🪔✨

This is an open-source community celebration where anyone can bring their own creative ideas, code, 3D assets, sounds, and festival features to life. Once your Pull Request is reviewed and merged by the maintainer, **your feature will automatically go live on the production website**!

---

## 🌟 How the Open Source Workflow Works

```
1. Fork Repository ➔ 2. Clone & Code Locally ➔ 3. Test with `npm test` ➔ 4. Submit Pull Request ➔ 5. Maintainer Merges PR ➔ 6. Auto-Deploys Live on Website! 🚀
```

1. **Fork the Repo**: Click the **Fork** button at the top right of [github.com/Riteshpandey-source/diwali](https://github.com/Riteshpandey-source/diwali).
2. **Clone your fork**:
   ```bash
   git clone https://github.com/<YOUR-USERNAME>/diwali.git
   cd diwali
   ```
3. **Install & Run locally**:
   ```bash
   npm install
   npm start
   ```
   Open your browser at `http://localhost:3000`.
4. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/my-festive-idea
   ```
5. **Develop your Feature**:
   Write your code, add your 3D models or particle effects or minigames!
6. **Run Automated Tests**:
   ```bash
   npm test
   ```
   *Make sure all automated tests pass with 0 errors!*
7. **Submit a Pull Request (PR)**:
   Push your branch to your fork on GitHub and click **"Compare & pull request"**. Describe what awesome festive feature you created!
8. **Live Deployment**:
   Once the repository owner merges your Pull Request, our CI/CD pipeline triggers an automatic build and deploys your changes to the live website within 1-2 minutes!

---

## 💡 Creative Contribution Ideas

Not sure what to build? Here are some exciting ideas you can pick up:

- 🎆 **New Firework Types**: Add new aerial shells, floral chrysanthemums, color-changing comets, or ground willow fountains in `public/js/fireworks3d.js`.
- 🪔 **Festival Minigames**: Create new festive mini-games (e.g. Mithai Sorting, Diya Match-3, Kite Flying, Rangoli Pattern Maker) in `public/js/minigames.js`.
- 👗 **Avatar Outfits & Accessories**: Add traditional festival attire (Kurta sets, Lehengas, Safas/Turbans, Sparkler wands) in `public/js/player3d.js`.
- 🏛️ **New Society Locations & Interior Rooms**: Add decorated interiors (Jethalal's Living Room, Bhide's Clubhouse, Society Gymkhana) in `public/js/societyArchitecture3d.js`.
- 🎵 **Festive Procedural Audio**: Compose or synthesize traditional ragas, sitar melodies, dhol-tasha beats, or temple conch sounds in `public/js/audio.js`.
- 📱 **Mobile Controls & Touch Ergonomics**: Polish virtual joystick response, gesture shortcuts, or camera swipe controls in `public/js/mobileHud.js`.
- ♿ **Accessibility & Performance**: Improve low-end device FPS, WebGL shader optimizations, colorblind modes, or screen reader labels.

---

## 📁 Codebase Architecture Quick Tour

| File / Folder | Purpose |
|---|---|
| `server.js` | Node.js HTTP server, WebSocket room synchronization, and Range streaming |
| `public/index.html` | UI markup, HUD elements, modals, dialogs, and audio cards |
| `public/css/style.css` | Festive themes, glassmorphism UI, bottom sheets, animations |
| `public/js/world3d.js` | 3D terrain, Gokuldham society buildings, lighting, and night sky |
| `public/js/societyArchitecture3d.js` | Authentic society wings (A, B, C), Club House, Temple, and Bazaar |
| `public/js/player3d.js` | 3D character mesh, traditional clothes, walk/run animations, sparkler |
| `public/js/fireworks3d.js` | WebGL particle simulation for Rockets, Anar, Chakri, Sparks, Lanterns |
| `public/js/societyTheater3d.js` | 3D society stage cinema screen and video texture synchronization |
| `public/js/mission.js` | Colony missions, golden coin hunt, and Maha Deepotsav finale |
| `public/js/minigames.js` | Diya Sprint, Rangoli Artisan, and Festival Trivia minigames |
| `public/js/audio.js` | Procedural Web Audio API synth (sitar, bells, cracker explosions) |
| `tests/` | Automated E2E test suites and mobile responsive audits |

---

## 📜 Pull Request Guidelines

1. **Keep it Focused**: One PR should ideally address one feature or bugfix.
2. **Zero Breaking Changes**: Existing features, multiplayer sync, and audio should continue working smoothly.
3. **Automated Verification**: Always run `npm test` before pushing to ensure all 54+ tests pass.
4. **Give Yourself Credit**: Add your name, GitHub handle, and a short summary of your contribution to `public/contributors.json` so your name appears in the game's **Hall of Fame**!

---

## 💖 Community Code of Conduct

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md). Be respectful, constructive, and celebrate the spirit of Diwali — sharing light, joy, and knowledge with everyone! 🪔✨

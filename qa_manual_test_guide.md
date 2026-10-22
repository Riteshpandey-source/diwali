# QA Manual Testing Guide: Diwali 3D Virtual World

This guide provides structured manual verification steps for scenarios that require real user gestures, WebGL hardware rendering, audio context unlocking, and mobile viewport interaction.

---

## 1. Landing Screen & 3D World Transition

### Test Steps:
1. Open browser to `http://localhost:3000/`.
2. Verify the Landing Greeting Screen:
   - Gold decorative Diwali border.
   - 3D interactive Gokuldham Society Gate in the center viewport.
   - Clickable earthen diyas that toggle flame glow and play audio chime.
3. Personalize Greeting:
   - Type your name in "Your Name / Aapka Naam".
   - Click "Update & Copy Link" and verify toast notification appears.
4. Enter 3D World:
   - Click the large golden button: **"Enter 3D Society World ➔"**.
   - Verify smooth cross-fade transition into the Three.js 3D viewport.

**Expected Outcome**: Transition executes cleanly without page reload, landing screen hides, and 3D HUD appears.

---

## 2. 3D Navigation & Camera Controls

### Test Steps:
1. **Desktop Keyboard Controls**:
   - Press `[W]`, `[A]`, `[S]`, `[D]` or Arrow Keys to walk.
   - Hold `[Shift]` while moving to sprint.
   - Verify character legs articulate, dhoti folds sway, and sparkler emits golden particles.
2. **Camera Controls**:
   - Click and drag on canvas to orbit camera around character.
   - Scroll mouse wheel to zoom in and out (clamped between 3.5m and 12m).
   - Verify camera never clips into ground or character body.
3. **Collision & Boundary Clamping**:
   - Run directly into the perimeter wall at the edge of the colony.
   - Verify the player slides smoothly along the wall without tunneling or escaping into the void.

---

## 3. Society Cinema Theater & Episode 53 Playback

### Test Steps:
1. Walk to the Society Ground (East promenade, near X: 35, Z: -14).
2. Look at the Grand TMKOC Stage:
   - Verify signboard reads **"॥ शुभ दीपोत्सवः ॥ गोकुलधाम सोसाइटी ॥"** and **"TMKOC"**.
   - Verify video screen is active and playing **Episode 53 (Gokuldham Diwali Laxmi Pujan)**.
3. **On-Screen Quick Controls (`#stageQuickControls`)**:
   - Press `[Space]` or click the **"PAUSE"** button to pause the video. Verify screen freezes and button changes to **"RESUME"**.
   - Press `[Space]` again to resume video.
   - Click **"10s ⏩"** or press `[L]` / `[→]` to skip 10 seconds ahead. Verify on-screen skip flash badge appears.
   - Click **"⏪ 10s"** or press `[J]` / `[←]` to rewind 10 seconds.
   - Click the sound icon or press `[M]` to mute / unmute audio.
4. **Interactive Audience Seating**:
   - Approach an audience bench and press `[E]` to sit down.
   - Verify character sits naturally and camera automatically transitions to unobstructed **Direct Cinema View**.
   - Press `[E]` to stand back up.
5. **Episode Switcher**:
   - Click the **"Ep 2598"**, **"Ep 247"**, or **"Ep 3604"** pills on the stage control bar.
   - Verify video changes instantly without breaking the 3D texture mapping.
   - Click **"Ep 53"** to return to Episode 53 at #1 position.

---

## 4. Virtual Bazaar Shop & Inventory

### Test Steps:
1. Walk to the Bazaar stall on the East promenade, or click **"Bazaar Shop"** on the bottom HUD toolbar.
2. Verify coin balance starts at **150 🪙**.
3. In the Fireworks tab:
   - Click **"Buy for 45 🪙"** on the Sky Rocket 5-Pack.
   - Verify coin balance updates to **105 🪙** and bottom quickbar shows **Rocket: 5**.
4. Attempt to purchase an item priced higher than your balance:
   - Click an item that costs more than your remaining coins.
   - Verify an alert prompts you that more coins are needed, and coin balance remains untouched.
5. In-World Item Usage:
   - Press number key `[4]` to select Rocket.
   - Click on the ground or press `[F]` to ignite.
   - Verify rocket ascends into the sky with whistle audio, explodes into colorful sparks, and rocket count drops to 4.

---

## 5. Diwali Night Mission & Mini-Games

### Test Steps:
1. Click **"Mission"** (`[📜]`) on the bottom toolbar.
2. Verify the 6 mission objectives:
   - Explore Key Colony Zones (Temple, Bazaar, Chowk, Enclave).
   - Collect 5 Golden Lakshmi Coins hidden in the colony.
   - Illuminate / Decorate Colony Havelis.
   - Shop at Shubh Deepawali Bazaar.
   - Complete Mini-Game Challenges.
   - Unlock Maha Deepotsav Grand Finale.
3. Play a Mini-Game:
   - Click **"Mini-Games"** on the toolbar.
   - Select **"Diya Lighting Sprint"** or **"Rangoli Artisan"** or **"Diwali Cultural Quiz"**.
   - Complete the game and verify earned coins are added to your balance.
4. Grand Finale:
   - Once objectives are complete, walk to the Central Chowk Altar and press `[E]`.
   - Verify full-colony Maha Deepotsav lighting triggers and celebration banner overlay displays.

---

## 6. Realtime Multiplayer & Social

### Test Steps:
1. Open two browser windows (or one regular window and one Incognito window) to `http://localhost:3000/`.
2. In Window 1:
   - Enter 3D world as "Tester_Alice".
3. In Window 2:
   - Enter 3D world as "Tester_Bob".
4. Walk towards each other near Central Chowk:
   - Verify Bob sees Alice walking with smooth interpolation.
   - Verify Alice sees Bob.
5. Send an Emote:
   - Click **"Emotes"** and select "Happy Diwali! 🪔".
   - Verify floating emote bubble appears above character in both windows.
6. Trigger a Firework:
   - Launch an Anar or Rocket in Window 1.
   - Verify firework displays in real-time in Window 2.

# 🪔 Shubh Deepawali - Playable Virtual World & Festival Experience

A complete, premium, playable Diwali Virtual World and Festive Greeting Experience.

## Quick Start

1. Start the server:
   ```bash
   npm start
   # or
   npm run dev
   ```
2. Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

## Key Features

1. **Diwali Greeting Experience**:
   - Interactive sacred Deepam altar with ignition sound and blooming halos.
   - Real-time personalization (Sender & Recipient names) with URL sharing and WhatsApp integration.
   - Traditional Sanskrit shloka (*Tamaso Ma Jyotirgamaya*).
   - Instant "ENTER VIRTUAL WORLD" portal.

2. **Playable Diwali Colony**:
   - Beautiful Indian residential neighborhood at night with 6 houses, Shree Shiv-Lakshmi Mandir, Shubh Deepawali Bazaar, and Central Chowk.
   - Controllable character in traditional festive Kurta-Pajama with customizable colors and animated lit sparkler (Phuljhadi).
   - Desktop keyboard controls (WASD/Arrows, Shift to sprint, E/Space to interact, F/Enter to use item, 1-6 hotkeys) and mobile touch controls (virtual joystick & action buttons).
   - Collision detection, world boundary fences, and smooth camera tracking.
   - Real-time minimap radar in top-right.

3. **Diwali Night Mission — Light Up the Colony!**:
   - Integrated mission system with objective checklist and progress tracking.
   - **Exploration**: Visit the Mandir, Festival Bazaar, Central Chowk, and Residential Enclaves.
   - **Coin Collectibles**: 5 floating 3D golden coins placed at sacred locations (+20 coins each, collected once).
   - **Shopping & Decorating**: Purchase decorations from the Bazaar and illuminate at least 3 houses.
   - **Festival Challenges**: Complete any of the 3 mini-games (Diya Sprint, Rangoli Artisan, or Trivia).
   - **Maha Deepotsav Finale**: Altar is locked until all objectives are completed; triggers colony-wide illumination, coordinated fireworks, and awards the exclusive *Diwali Champion 2026* badge + 250 bonus coins (strictly validated once).

4. **House Decoration & Colony Celebration**:
   - Approach any residence and press `[E]` to decorate with fairy lights (Golden, Rainbow, Cyan-Violet), earthen diyas, torans, and lanterns.
   - Progress saved in `localStorage`.
   - **Maha Deepotsav Altar**: Trigger colony-wide simultaneous illumination with aerial fireworks and temple bells.

5. **Realistic Fireworks & Web Audio Engine**:
   - Sky rockets with smoke trails and peony flower bouquets, ground Anar fountains, spinning Chakris, and drifting Akash Kandils.
   - Dedicated "Sky Fireworks Show" grand finale.
   - 100% procedural Web Audio synthesizer: zero external audio files needed.
   - Reduced-motion and FPS counter support.

6. **Real-time Multiplayer**:
   - Live room synchronization over WebSockets (`ws://localhost:3000`).
   - Position interpolation, synchronized fireworks, shared house illumination, and safe preset festive emotes.
   - Built-in room code support (`?room=code`).

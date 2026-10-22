# QA Bug Report: Diwali 3D Virtual World & Gokuldham Society Theater

**Audit Date**: October 22, 2026  
**Auditor Role**: Senior QA Automation Engineer, Three.js Game Tester & Reliability Specialist  
**Application Target**: `http://localhost:3000` (Node.js HTTP/WS Server, Three.js 3D Engine, HTML5 Canvas, Web Audio)  
**Status**: Completed — All Confirmed Defects Remediated & Retested  

---

## Executive Summary

During systematic End-to-End, Visual, Regression, and Performance testing across all 16 functional phases, **4 confirmed bugs** were identified and fixed in the active codebase:
1. **Critical**: Collision Tunneling / Missing Continuous Collision Detection (CCD) in player physics (`world3d.js`).
2. **High**: Unculled Interior Rooms floating in the void beyond the perimeter wall (`societyArchitecture3d.js`).
3. **Medium**: Inappropriate/Unwanted stage signboard text strings ("Ram Leela" in theater controller vs TMKOC).
4. **Medium**: Redundant overhead "You" badge blocking third-person camera and cinema screen (`player3d.js`).

All 4 defects have been root-caused, repaired, retested with automated regression tests, and confirmed passing.

---

## Defect 1: Player Collision Tunneling at High Velocity / Frame Drop

- **Bug ID**: BUG-001
- **Severity**: Critical (P1)
- **Component**: 3D World Physics / Player Controller ([world3d.js](file:///c:/Users/rites/Desktop/diwali/public/js/world3d.js#L2155-L2202))
- **Status**: FIXED & VERIFIED (PASS)
- **Description**:
  When the player sprints or experiences a sudden delta time spike where movement delta `Math.hypot(dx, dz) > 0.4m`, the player could jump over and penetrate thin perimeter wall boxes (0.8m width) because `resolveMovement()` only sampled the destination coordinate without substepping intermediate positions along the trajectory.
- **Root Cause**:
  Discrete collision detection without continuous collision substepping. When `newX = curX + dx` landed beyond the opposite face of the wall box, `checkCollision()` evaluated to `false`, allowing the player to escape the boundary into the void.
- **Fix Applied**:
  Implemented substepping in `resolveMovement()` with `maxSubStep = 0.25m`:
  ```javascript
  const totalDist = Math.hypot(dx, dz);
  const maxSubStep = 0.25;
  const steps = Math.max(1, Math.ceil(totalDist / maxSubStep));
  const stepDx = dx / steps;
  const stepDz = dz / steps;
  ```
  Each substep checks collision, performs wall sliding along free axes, and applies depenetration.
- **Retest Evidence**:
  Simulated aggressive +2.0m dash directly into perimeter wall at `x = 88.0`. Player was strictly blocked at `x = 88.00`, 0% wall penetration, 0 tunneling.

---

## Defect 2: Unculled Apartment & Community Hall Interiors Floating Outside Boundary

- **Bug ID**: BUG-002
- **Severity**: High (P2)
- **Component**: Society Architecture ([societyArchitecture3d.js](file:///c:/Users/rites/Desktop/diwali/public/js/societyArchitecture3d.js#L25))
- **Status**: FIXED & VERIFIED (PASS)
- **Description**:
  The society's three detailed 3D interior rooms (Community Hall at `(120, 0, 120)`, Patel Niwas / Gada flat at `(180, 0, 120)`, and Bhide Master's Study at `(240, 0, 120)`) were added to `this.interiorsGroup` with `visible = true` by default. Because the colony perimeter wall terminates at `x = 89` and `z = 61`, these rooms were visible floating out in the dark night void beyond the boundary walls.
- **Root Cause**:
  Missing exterior/interior occlusion culling. `this.interiorsGroup.visible` was never toggled on entrance/exit.
- **Fix Applied**:
  1. Defaulted `this.interiorsGroup.visible = false` on initialization.
  2. In `enterInterior()`, set `this.interiorsGroup.visible = true` and `this.exteriorGroup.visible = false`.
  3. In `exitInterior()`, set `this.interiorsGroup.visible = false` and `this.exteriorGroup.visible = true`.
- **Retest Evidence**:
  Exterior colony camera rendered with 0 floating rooms outside the wall. Entering through door switches visibility smoothly.

---

## Defect 3: Stage Signboard Text Discrepancy & Header Reference

- **Bug ID**: BUG-003
- **Severity**: Medium (P3)
- **Component**: Gokuldham Society Ground Theater ([societyTheater3d.js](file:///c:/Users/rites/Desktop/diwali/public/js/societyTheater3d.js))
- **Status**: FIXED & VERIFIED (PASS)
- **Description**:
  User requested removing any Hindi "राम लीला" strings and keeping the signboard cleanly reading "TMKOC". Traces of "Ram Leela" remained in module documentation and required verification across canvas texture generation.
- **Root Cause**:
  Legacy string left in header comment block and canvas texture initializations.
- **Fix Applied**:
  Replaced with "Community Cinema Theater" in header comments, and confirmed the 3D signboard canvas draws `॥ शुभ दीपोत्सवः ॥ गोकुलधाम सोसाइटी ॥` and prominent golden `TMKOC` banner.
- **Retest Evidence**:
  Automated script confirmed string cleanly matches `TMKOC` with 0 unwanted strings.

---

## Defect 4: Local Player Overhead "You" Badge Obstructing Camera View

- **Bug ID**: BUG-004
- **Severity**: Medium (P3)
- **Component**: Player 3D Character Model ([player3d.js](file:///c:/Users/rites/Desktop/diwali/public/js/player3d.js#L814-L817))
- **Status**: FIXED & VERIFIED (PASS)
- **Description**:
  A floating 3D billboard sprite with the text "You" hovered directly above the player's red turban at `y = 3.1`. When the player stood near the stage or sat in theater seats, this badge was positioned directly in front of the camera, obscuring the stage screen.
- **Root Cause**:
  Player model attached `this.nameSprite = this.createNameSprite(this.name)` to the local player's root hierarchy.
- **Fix Applied**:
  Removed `nameSprite` attachment from local player root (`this.nameSprite = null`). Emote bubble functionality (`showEmote`) was preserved independently.
- **Retest Evidence**:
  Third-person and seated cinema camera now have a clean, unobstructed view of the society ground and stage.

---

## Defect Summary Table

| Defect ID | Feature Area | Severity | Root Cause | Fix Summary | Retest Status |
|---|---|---|---|---|---|
| **BUG-001** | World Physics | Critical (P1) | Missing CCD substepping | Substepped movement loop (max 0.25m) | **PASS** |
| **BUG-002** | Society Interiors | High (P2) | Unculled interior group | Default hidden, toggled on enter/exit | **PASS** |
| **BUG-003** | Theater Stage | Medium (P3) | Unwanted text strings | Cleaned signboard texture to TMKOC | **PASS** |
| **BUG-004** | Player Model | Medium (P3) | Overhead "You" sprite | Removed local player nameSprite | **PASS** |

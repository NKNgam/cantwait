# For Nahlela — My Quinn 🌹

A romantic countdown timer created with love, dedicated to **Nahlela**, affectionately called **My Quinn**.

---

## 💖 Features

1. **Intimate Hand-Holding Red Flower Portrait**:
   - Encased in an arched golden-rimmed frame with ambient breathing glow and *"Forever Yours"* seal.
2. **Fixed Recipient View (Zero Customization Clutter)**:
   - When Nahlela opens the link, she sees **zero** customization buttons, zero calendar icons, and zero editing controls.
   - She only sees the beautiful, romantic countdown you prepared for her, counting down to the exact second you meet.
3. **Romantic Background Song**:
   - Soft acoustic romantic piano song (`assets/romantic-song.mp3`).
   - Dedicated music pill button (`Play Song` / `Pause Song`) with animated 3-bar equalizer waves.
   - Automatically begins playing gently on first tap/interaction.
4. **Phone Haptic Heartbeat Vibration**:
   - Tapping the **"Send Quinn A Kiss"** button triggers a rhythmic double-heartbeat vibration on mobile phones (`navigator.vibrate([70, 90, 70, 160, 70, 90, 70])`).
   - Floats animated hearts across the screen and increments a persistent kiss counter.
5. **Secret Admin Mode**:
   - Add `?admin` to the URL (or double-click the `❤️ NAHLELA • MY QUINN` badge) to open the Admin panel.
   - Set the reunion date & time, then click **"Copy Link for Nahlela 🔗"** to generate the perfect share link.

---

## 🌐 Deploying to GitHub Pages

1. In `C:\Users\NK Ngam\.gemini\antigravity\scratch\nahlela-love-countdown`:
   ```bash
   git init
   git add .
   git commit -m "For Nahlela: Romantic Countdown Timer"
   git branch -M main
   git remote add origin https://github.com/<your-username>/nahlela-countdown.git
   git push -u origin main
   ```
2. In GitHub repository **Settings** &rarr; **Pages** &rarr; select branch `main` and root `/`.
3. Open `https://<your-username>.github.io/nahlela-countdown/?admin` to set the date, click **"Copy Link for Nahlela"**, and send it to her!

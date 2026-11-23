# Deployment Guide — Telangana: Land of Heritage

This project is built with **React Router v8**, **Vite**, **Tailwind CSS v4**, and **@agent-native/core**.

---

## 1. Local Run
- **Double-click:** `run.bat` (inside the `Telengana` folder, or `run_telengana.bat` from `ARHIA`)
- Automatically installs dependencies, applies database migrations, frees port 8080 if in use, and starts the development server at `http://localhost:8080`.

---

## 2. Deploying to Vercel

The project is pre-configured with `vercel.json` and React Router static prerendering for zero-config Vercel deployment:

### Configuration Details
- **Build Command:** `pnpm run build`
- **Output Directory:** `build/client`
- **Clean URLs:** `true`
- **Single Page App Routing:** Rewrites `/(.*)` to `/index.html`

### Deploying via Vercel CLI
```bash
# In the Telengana directory
vercel
# Follow prompts, or for production:
vercel --prod
```

### Deploying via GitHub
1. Push to repository `https://github.com/shresthasrii/India_INC_TL.git`:
   ```bash
   git init
   git add .
   git commit -m "Telangana - Land of Heritage release"
   git branch -M main
   git remote add origin https://github.com/shresthasrii/India_INC_TL.git
   git push -u origin main
   ```
2. Import the repository in your Vercel Dashboard.
3. Vercel automatically detects `vercel.json`:
   - **Framework Preset:** Vite / Other
   - **Build Command:** `pnpm run build`
   - **Output Directory:** `build/client`
4. Click **Deploy**.

---

## 3. Environment Variables (Optional)
If deploying with a live backend / Postgres database:
- `AUTH_DISABLED`: `true` (to bypass user authentication)
- `DATABASE_URL`: Connection string to persistent Postgres (Neon, Supabase, etc.)
- `BETTER_AUTH_SECRET`: Random 32-character hex string (`openssl rand -hex 32`)

Last Updated: August 10th 2026

# F.O.R.C.E. — Family Trip Preference Mapper

A standalone web app (no Claude account needed) for the family to record what
everyone wants to do on the Orlando trip. Built with React + Vite, backed by
Supabase, deployed on Vercel.

---

## Part A — Create your Supabase project

1. Go to **supabase.com** and click **Start your project** → sign up (free, no credit card).
2. Click **New project**.
3. Give it a name (e.g. "force-trip"), set a database password (write it down somewhere — you won't need it day-to-day, but keep it), pick the region closest to you, click **Create new project**. Takes about a minute to spin up.



## Part B — Run the setup SQL

1. In your new project, click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open `supabase/setup.sql` from this project, copy the **entire file**, paste it into the SQL editor.
4. Click **Run** (bottom right). You should see "Success. No rows returned."



## Part C — Assign the six PINs

Right after the setup script, run this **second, separate** query — edit the four-digit numbers to whatever you want each person's PIN to be:

```sql
update family_members set pin_hash = crypt('1234', gen_salt('bf')) where name = 'Brandon';
update family_members set pin_hash = crypt('1234', gen_salt('bf')) where name = 'Melissa';
update family_members set pin_hash = crypt('1234', gen_salt('bf')) where name = 'Ava';
update family_members set pin_hash = crypt('1234', gen_salt('bf')) where name = 'Marissa';
update family_members set pin_hash = crypt('1234', gen_salt('bf')) where name = 'Justin';
update family_members set pin_hash = crypt('1234', gen_salt('bf')) where name = 'Levi';
```

Replace each `'1234'` with that person's actual PIN before running. This is the only place PINs ever appear in plain text — they're hashed the instant this query runs, and the plain version is never stored anywhere. Tell each person their PIN separately (text, verbally, whatever).

## Part D — Get your Project URL and anon key

1. Click the **gear icon (Project Settings)** in the left sidebar → **API**.
2. Copy the **Project URL** (looks like `https://xxxxx.supabase.co`).
3. Copy the **anon / public** key (a long string starting with `eyJ...`). **Do not** copy the "service_role" key — that one must never be used in this app.



## Part E — Deploy to Vercel (no GitHub required)

The simplest path skips GitHub entirely using Vercel's own command-line tool:

1. Install Node.js if you don't have it: go to **nodejs.org**, download and install the LTS version.
2. Open a terminal (Mac: Terminal app; Windows: Command Prompt) in this project's folder.
3. Run:
  ```
   npm install -g vercel
   vercel login
  ```
   (follow the prompts — it'll open your browser to log in/sign up, free.)
4. Run:
  ```
   vercel
  ```
   Answer the prompts with the defaults (just press Enter) except:
  - "Set up and deploy?" → **Y**
  - It'll ask to link to an existing project or create one — choose **create new**, give it a name.
5. Once it finishes, it gives you a preview URL — don't share that one yet, one more step first.
6. Run:
  ```
   vercel env add VITE_SUPABASE_URL
  ```
   Paste your Project URL when prompted, choose **Production** (and Preview + Development too, doesn't hurt).
   Then:
   Paste your anon key.
7. Deploy the real, final version with the environment variables attached:
  ```
   vercel --prod
  ```
8. It prints your live URL (something like `force-trip.vercel.app`). **That's the link you share with the family.**

*(If you'd rather use GitHub + the Vercel website instead of the command line — e.g. because you want Claude to push future updates automatically — see "Future Changes" below.)*

## Part F — Test it

1. Open the live URL on your own phone. Pick your name, enter your PIN, confirm you're in.
2. Open the same URL on a second phone (or ask Melissa to open it on hers).
3. On phone 1, set a preference on any attraction.
4. Check phone 2 — it should update within a couple seconds without refreshing.
5. Reload phone 1's browser — confirm your preference is still there.
6. Try entering a wrong PIN on purpose — confirm it's rejected.
7. Visit the Planner View and Mission Debrief tabs — confirm they show data reflecting what you and phone 2 selected.

---



## Local development (optional, for testing changes before deploying)

```
npm install
cp .env.example .env
# edit .env with your real Supabase URL + anon key
npm run dev
```

Opens at `http://localhost:5173`.

To run the classification-logic unit tests:

```
npm test
```

To build the production bundle locally (matches what Vercel builds):

```
npm run build
```

---



## Known Limitations

- **PIN storage on-device**: after first login, the PIN is remembered in this browser's `localStorage` so people aren't retyping it every vote. Anyone with physical access to that specific phone/browser could technically find it in dev tools. This is accepted by design — the PIN's job is preventing *accidental* cross-edits, not resisting someone digging through your phone.
- **Anonymous public reads**: anyone with the deployed URL (and a look at their browser's network tab) could read the raw preference data directly from Supabase, bypassing the app's UI. Writes are properly locked down through the RPC functions; reads are intentionally open since there's no real per-user auth layer and the family needs shared visibility. This is fine for vacation ride preferences; it would not be fine for anything sensitive.
- **Not offline-first**: a preference set while your phone has no signal will show "⚠ Sync problem" and needs a manual retry once you're back online — it won't silently queue and retry on its own.
- **Realtime is best-effort**: if the realtime connection drops, the small sync indicator will say so, but the app still works — the next successful save (or a manual reload) will catch things up.
- **Top Dinner Pick / dinner_top_picks**: enforced server-side (you can't top-pick a restaurant you didn't rate "Yes"), but there's no UI yet for *changing your mind* about which restaurant was your top pick beyond picking a different one.



## Verification Needed (before the October 2026 trip)

Re-check closer to departure:

- Halloween Horror Nights house/show/scare-zone lineup (subject to change)
- Whether Rock 'n' Roller Coaster's Muppets rebrand is confirmed operating
- Jurassic Park River Adventure's refurbishment end date (currently flagged through Nov 19, 2026)
- Fast & Furious: Hollywood Drift's construction timeline



## Future Changes — how to keep using Claude for this app

The cleanest ongoing workflow: **put this project on GitHub once**, connect that GitHub repo to Vercel (Vercel auto-redeploys on every push), and from then on:

1. Ask Claude to make the change and hand you the updated files.
2. Upload/commit those files to your GitHub repo (drag-and-drop works on github.com — no git command line needed).
3. Vercel rebuilds and deploys automatically within a minute or two.

If you'd rather not deal with GitHub at all, you can keep redeploying via `vercel --prod` from the command line each time — just ask Claude for the updated files, replace them in your local project folder, and run that one command again.
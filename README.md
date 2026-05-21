# 🛡️ PRTrust: The Configurable AI Code Reviewer

<img width="1117" height="780" alt="Screenshot 2026-05-20 225815" src="https://github.com/user-attachments/assets/85177f6b-6ba2-401d-81cd-2604d1949370" />
<img width="1607" height="910" alt="Screenshot 2026-05-20 225437" src="https://github.com/user-attachments/assets/a0188b21-18eb-40b5-9c9f-8471ae203f24" />


**PRTrust** is an open-source, full-stack GitHub App that uses AI to analyze Pull Requests—but unlike other bots, you control the math. 

*Hey there! I’m a solo developer who got tired of generic AI review bots leaving 50 useless, pedantic comments on my commits. So, I used AI as a force-multiplier to build an alternative: a code reviewer controlled by a physical web dashboard that factors in developer history to eliminate noise.*

*The architecture works, but the codebase is fresh. I'm looking for senior eyes to roast the implementation, optimize the architecture, and help shape Version 2.0. PRs are highly welcome!*

## 🎮 Try it Live (Zero Setup)
Want to see the AI in action without installing anything? 
1. Go to the [PRTrust Sandbox Repository](https://github.com/Gokul-Raj-R-Coder/prtrust-sandbox).
2. Edit the `README.md` or add a dummy code file.
3. Open a Pull Request.
4. Watch the PRTrust bot analyze the diff and post a score in under 10 seconds!

*Want to play with the custom Risk Dial? Log into the [Live Dashboard](https://prtrust-ouqi960rq-gokul-raj-r-coders-projects.vercel.app/) to test the UI.*

---

## ✨ Why PRTrust? (The Features)

Most AI reviewers are black boxes that treat every PR exactly the same. PRTrust is built differently:

1. 🎛️ **The Risk Dial Dashboard:** An integrated Next.js dashboard lets engineering teams physically dial in their risk tolerance. Set the AI strictness to 90% for core backend merges, or drop it to 30% for a Friday hackathon.
2. 👤 **Human-in-the-Loop Trust Scores:** PRTrust reviews behavior, not just code. It tracks developer merge history. If a trusted senior dev opens a 2-line PR, it bypasses heavy AI scrutiny, saving the rigorous checks for massive PRs from unverified contributors.
3. 🔒 **Bring-Your-Own-Key (Self-Hosted):** Keep your code inside your own infrastructure. Host the UI on Vercel, the API on Render, and plug in your own Google Gemini API key. No third-party SaaS gets access to your repository.

---

## 🏗️ Architecture Under the Hood

* **Frontend:** Next.js, TailwindCSS, NextAuth (OAuth via GitHub). Hosted on Vercel.
* **Database:** Serverless PostgreSQL (Neon) for storing custom algorithm weights.
* **Backend API:** Node.js / Express webhook receiver. Hosted on Render (US Regions).
* **AI Engine:** Google Gemini Pro API.

---

## 🚀 Quick Start (Self-Hosting)


<summary><b>🛠️ Step-by-Step: How to Configure the GitHub App</b> (Click to expand)</summary>

To connect PRTrust to your repositories, you need to create a custom GitHub App. It takes about 3 minutes.

**1. Create the App**
* Go to GitHub -> **Settings** -> **Developer Settings** -> **GitHub Apps**.
* Click **New GitHub App**.
* **GitHub App Name:** `PRTrust (Your Name)`
* **Homepage URL:** Your live Vercel frontend URL (e.g., `https://prtrust-web.vercel.app`).

**2. Configure OAuth (For the Frontend)**
* **Callback URL:** Your Vercel URL + `/api/auth/callback/github` (e.g., `https://prtrust-web.vercel.app/api/auth/callback/github`).
* Uncheck **Expire user authorization tokens**.

**3. Configure Webhooks (For the Backend)**
* **Active:** Checked.
* **Webhook URL:** Your live Render backend URL + `/webhook` (e.g., `https://prtrust-api.onrender.com/webhook`).
* **Webhook Secret:** Type a random password here. Copy it and save it to your backend `.env` as `WEBHOOK_SECRET`.

**4. Set Permissions & Events**
Go to **Repository Permissions** and set the following:
* **Commit statuses:** Read & write
* **Contents:** Read-only
* **Pull requests:** Read & write

Go to **Subscribe to events** and check:
* **Pull request**
* **Check run**
* **Check suite**

**5. Save and Get Your Keys**
Click **Create GitHub App**. On the final screen, you will gather the keys for your `.env` files:
* Copy the **App ID** -> Backend `.env` (`GITHUB_APP_ID`)
* Copy the **Client ID** -> Frontend `.env` (`GITHUB_ID`)
* Click **Generate a new client secret** -> Frontend `.env` (`GITHUB_SECRET`)
* Click **Generate a private key**. This will download a `.pem` file. Open the file in a text editor, copy the entire block of text, and paste it into your Backend `.env` (`GITHUB_PRIVATE_KEY`).

**6. Install the App**
Look at the left sidebar, click **Install App**, and install it on the repositories you want PRTrust to monitor. You're done!

---

## 🗺️ Roadmap (Help Wanted!)

This project is actively looking for open-source contributors! 

**Upcoming V2.0 Feature: Bring Your Own Model (BYOM)**
Data privacy is huge. The next major milestone is decoupling the hardcoded Gemini API and allowing teams to plug in their own local LLMs (like Llama 3 or Mistral via Ollama) or custom OpenAI-compatible endpoints using environment variables. 

Check the [Issues](#) tab if you want to help build this or optimize the current webhook parsing engine!

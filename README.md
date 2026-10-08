# ai-auto-apply

A simple local dashboard for organizing job applications with an AI assistant. It works for any profession and keeps each person's CV, background, preferences, application history and form answers in one private user folder.

The dashboard shows saved records. Your assistant searches and applies through its own browser tools when you authorize it. This project does not include an automatic application service or an AI subscription. Browser control comes from your AI tool, not this project. No browser helper or saved login profile is included.

## Set it up with one prompt

Download/unzip the project onto your Desktop. Open an AI assistant that can read and edit files on your computer. Replace the bracketed folder name below, then copy the whole prompt:

> I cloned ai-auto-apply into a folder named [project-folder-name] on my Desktop. Locate that folder and read AGENTS.md. Follow its “First-time setup” workflow and prerequisite checks to set up the project locally for me. Detect my operating system and check your file, terminal and browser capabilities, Node/npm, access to my chosen browser and necessary permissions. Guide me through missing steps one at a time, offer to install missing prerequisites with my approval, and verify each step before proceeding. Preserve any existing profiles and history. Ask me only for missing information or actions you genuinely need, including where to put my CV. Keep my personal data inside my own users/ folder and mark unconfirmed facts as unknown. Do not apply to jobs, publish anything or connect accounts without my instruction. When finished, explain in plain language what this project does, how to start it, where my data is saved, how to ask you to apply, and anything still needing my attention.

If your folder is elsewhere, replace “on my Desktop” with its full path. If the assistant cannot access local files or a browser, it should explain what you need to do yourself. No prompt can supply capabilities an assistant does not have.

**README.md is for people. AGENTS.md contains the setup checklist and working rules for assistants.** CLAUDE.md points to the same instructions; there is one general rulebook.

## What you need before applying

You do not have to figure out every prerequisite in advance. The setup prompt tells your assistant to check them and guide you step by step:

- An AI tool with local file and terminal access, plus supported access to the browser you open. A chat-only AI cannot operate the folder just from this prompt.
- Node.js and npm for the dashboard, and your choice of browser supported by your AI tool. The assistant checks missing prerequisites and guides you through supported setup; it does not install browser automation into this project.
- Access to the project folder and any specific connection permission the tools require. Grant only the permissions required by the actual tool after the assistant explains the need.
- Your CV, reviewed background/preferences and your own job-platform login. You open your browser and sign in yourself; the assistant verifies the actual account before applying.

VS Code is optional. Keep your designated browser tabs open during application runs. Setup has been tested on macOS; Windows/Linux and other AI assistants must verify their tools and browser operation locally. The one prompt starts a guided setup—it cannot guarantee that every tool or device supports everything, or eliminate your login and approval steps. No job is submitted during setup.

## Platforms and AI assistants

The dashboard is independent of the job site and the candidate’s profession. LinkedIn, Indeed, HH, Naukrigulf and employer career pages can all be recorded in the same format. The posting source and application destination are separate fields. The project does not contain integrations that guarantee automation on those sites.

On each device, the assistant must verify local file/terminal access, supported browser control, account identity, form inspection, uploads and submission confirmation before declaring a platform ready. Claude’s CLAUDE.md points to the same AGENTS.md workflow as other assistants. A chat-only assistant cannot operate this project. CAPTCHA, required unknown answers, unsupported browser actions and email verification links may still need your help; the assistant records a blocker instead of guessing or bypassing it. Its usage reserve also depends on an available provider reading or your explicit permission for that run.

Start with one real application after setup and review the result before authorizing a longer run. The tracker and guides are reusable; successful automation on every assistant, operating system or website is not guaranteed.

## What setup involves

1. Install Node.js LTS from [the official download page](https://nodejs.org/en/download) if needed. Node runs the dashboard; npm comes with it.
2. Open the project folder in your editor or assistant and install the locked dependencies with `npm ci`.
3. Create your personal folder with any normal folder name, for example `npm run user -- "Alex Morgan" "Alex Morgan"` or `npm run user -- alex "Alex"`. Capitals, spaces and names in other languages are supported. Only ordinary cross-platform filename restrictions apply; quote names containing spaces in commands. The command copies the neutral starter into the chosen users/ folder and refuses to overwrite an existing profile. Do not create an empty folder with only a CV; the starter files are also needed.
4. Put your current CV PDF in users/alex/cv/. A DOCX copy is optional. Tell your assistant which version is current.
5. Have your assistant prepare your background, preferences and factual answer drafts. Review and correct them before authorizing applications. Missing eligibility, credentials or stories must stay unknown.
6. Ask your assistant to start the dashboard and give you its localhost URL. Copy the full URL into any browser. VS Code and a visible terminal window are unnecessary when the assistant has local terminal tools. You can also run `npm run dev` yourself; Ctrl+C stops that manual server. Startup validates the data first.
7. Open your preferred browser, sign into the job sites and email services you want to use, and tell your assistant exactly which tabs it may access. For other platforms or candidates, open their intended accounts instead. The assistant must verify its tools can access the browser and match the signed-in identity to your profile before applying. An open browser alone does not provide automation access; follow your AI tool’s supported connection setup if needed. You enter passwords yourself, and this project stores no browser sessions.

You can complete these steps manually or let your assistant guide you. VS Code and Git are optional. The tracker itself needs no AI API key or browser extension, but your assistant’s browser connection may require extra setup. If it cannot control your chosen browser, it must explain that limitation and stop before applying. Do not assume that every assistant supports every browser or can work without taking focus.

## How to use it

Choose a person in the dashboard when several profiles exist. The summary shows Applied, Needs attention, Interviews and Rejected; on mobile these form two rows in that order. Needs attention includes blocked, skipped, uncertain and in-progress records. Search companies, roles, notes and answers; sort the table; open Details for exact recorded form answers, CV used, submission confirmation, blockers and next steps. New profiles begin with no applications and a short getting-started guide instead of an empty table. A received form with a required unfinished video, email or other completion step is marked Blocked under Needs attention; its next step contains the instructions. It is not counted as a completed application. Details also show the posting source separately from the application destination; older records may have no source recorded.

The assistant edits the selected person's applications.json, and the dashboard refreshes while the development server is running. Adding/removing a profile may require restarting the server. A production build is a saved snapshot. The dashboard has no editing forms, account passwords or private access separation: anyone with access to the files or local dashboard can view the profiles.

For your first real test, tell your assistant:

> Apply for users/[my-profile-name]/ on [job platform]. Follow AGENTS.md and my personal preferences. Verify the actual signed-in account, applicant fields and CV belong to me. Start the local dashboard and give me its verified URL before applying. Use only the browser tabs I explicitly authorize and verify supported access first. Leave my original tabs open. Submit one suitable application, save the exact answers and confirmed result in my JSON, close that job's tab, then stop and clean up the processes you started. Skip ordinary blockers with a reason; stop the run if identity does not match.

After reviewing that result, you can authorize a specific number of applications. Always name the person and platform. An application run handles one job at a time and saves its result before moving on. Account mismatches stop the run; OTP blockers that cannot be resolved through authorized email tabs, and unknown-answer blockers, are logged for later. After every application attempt, including skipped and uncertain outcomes, the assistant saves and validates the record, closes its job tab, and reports the company, actual outcome and successful application count. It reports available usage percentages honestly; account allowance is different from exact chat tokens. It then counts down a 5-second safe-stop pause, with no application active, before starting the next job. You can stop it during that pause. Steer can deliver your message during the active run, including the countdown. The assistant checks delivered messages between the separate one-second ticks and before the next job; it cannot force delivery or inspect the app’s pending-message queue. If your message is queued, use Steer (where available) or the Stop control to intervene during the current run. Usage is checked between applications, with a shared 10% remaining stop threshold when measurable. If readings are unavailable, it stops unless you explicitly authorize continuing without them for that run; you may also explicitly request skipping readings for one run. This reduces interruption risk but cannot guarantee uninterrupted sessions.

At the start of each application run, the assistant starts the dashboard and gives you its verified localhost URL before applying. Watch updates in any browser; you do not need an editor open. When the run finishes, you stop it, or the usage reserve is reached, it saves the records and stops only dashboard and terminal processes it started. The URL stops working until the next run. A server you started yourself is left running unless you ask to stop it. Cleanup targets only its own processes and application tabs it created. It never quits your whole Chrome/Brave/editor, closes your other tabs/windows or stops terminals you started. Abruptly killing the assistant can prevent cleanup; it should check for leftovers next time. Ask the assistant for a daily review of submissions, best fits, skipped records and what would unblock them. Exact submitted answers help you prepare for interviews; draft stories may be improved without changing historical answers. No interview or job offer is guaranteed.

During application runs, the assistant uses temporary sleep prevention where supported and tells you when it is active. On macOS it keeps the screen and system from sleeping due to inactivity; other devices need a verified equivalent. You can opt out. The assistant removes only its own sleep-prevention process when it stops, including a one-job test or a usage-reserve stop. It does not change permanent power settings or prevent lid-close, manual sleep, low battery or shutdown. Documentation-only work does not keep the computer awake. If the assistant is abruptly terminated, it checks its own leftover processes on the next run.

Your browser stays under your control. The assistant must avoid activating its window or using global mouse/keyboard actions while you work. Background behavior depends on the actual connection and needs testing. If it interrupts you, browser work pauses until a suitable method is available. When you authorize a signed-in email tab, the assistant checks relevant application receipts, rejections, interview invitations and OTP messages at session start, after each application attempt, and before cleanup. It refreshes when needed, checks Spam/Junk as well as Inbox during bounded session checks, and records matching evidence in your application history. Unexpected senders and unclear matches require verification before changing status. If a mailbox cannot be checked, it reports that limitation. Email access is read-only by default: it must never compose, send or reply, open email links, or download attachments. It may use a legitimate OTP only in the intended employer form; verification links are left for you. These checks run only while the assistant is working in an authorized session; they do not enable unattended monitoring after the session ends. It never stores the code. The project must not store passwords, login emails/usernames, cookies, tokens or browser session data. Your CV and application records may still contain your applicant contact email; that is needed for applications and is not a saved login credential. Unavailable or suspicious verification is logged for your review.

## How application answers are written

The assistant uses your reviewed background and factual drafts to write short, natural answers in your voice. It adapts each answer to the actual question and role, uses concrete examples from your experience, and avoids generic praise or repeated boilerplate. You should be able to explain every claim in an interview. Exact submitted answers stay in Details so you can review them later.

Natural writing is not a guarantee that automated detectors will accept it. The assistant does not invent experience, deliberately add errors or conceal assistance when a form asks about it. If an employer prohibits AI-written answers, it leaves those questions for you and records why the application needs attention.

## Where your information lives

```text
users/
  alex/                       One person's private folder
    USER.md                   Identity, background, account references, personal overrides
    ANSWERS.md                Reusable factual answer drafts
    applications.json         Search preferences, history and exact form answers
    cv/                       Current CV PDF and optional DOCX
templates/user/                Neutral starter, no real person's data
AGENTS.md                     Assistant setup checklist and general workflow rules
CLAUDE.md                     Pointer to AGENTS.md
README.md                     This human guide
src/                          Generic React components, types and styles
scripts/                      Generic profile creation and validation
```

Only users/ contains personal source data. Browser logins live in the browser you manage, outside this project; never copy its profile or cookies into the project. To add another person, create a separate folder with `npm run user -- sam "Sam"` and supply their own CV and facts. Never replace your profile or copy your stories to theirs. The assistant must verify the actual browser account each time it switches people or platforms; selecting a dashboard name does not switch a website login.

General rules are edited in AGENTS.md. A confirmed exception for one person belongs in their USER.md under “Personal rule overrides.” Structured preferences such as salary, roles, work authorization and excluded employers stay in their applications.json. With no override, the person inherits general rules.

## GitHub, sharing and backups

**All private user folders are already ignored by Git.** The root .gitignore excludes users/* and keeps only users/.gitkeep, which preserves an empty folder in a clone. CVs, notes and application history under a user's folder are not added by ordinary `git add`. Never force-add personal profiles to a public repository. Before your first push, inspect `git status --short` and `git ls-files`: no private user folder, CV, generated build, credentials or personal notes should appear. Review the staged changes too. Ignoring is protection for ordinary Git commands, not encryption or a guarantee against force-adding files.

Ignoring a file does not remove it from existing commits. Before publishing an existing repository, check its tracked files and history for personal data. Ask your assistant to inspect this without publishing anything. For an unchecked history, create a fresh repository from cleaned source instead.

Before your first GitHub upload:

1. Create an empty repository on GitHub. Push the project source, not a ZIP of your working folder or the generated dashboard build.
2. Initialize Git in this project if needed, stage the files normally, and inspect `git status --short`, `git ls-files` and `git diff --cached`. Only generic source, guides, templates and users/.gitkeep should be included; no real user folder should appear.
3. Commit the reviewed files, connect your repository and push. Never use `git add -f` for ignored personal data. This project’s assistant must not publish on your behalf without authorization.
4. Your friend clones the repository onto their Desktop, opens README.md, and uses its setup prompt with a capable local assistant. They need their own CV, reviewed preferences and browser logins. Nothing from your private profile is supplied by the clone.

GitHub hosts the source; this is not a request to deploy the personal dashboard to GitHub Pages. Keep a separate private backup of users/. Sharing the source gives your friend the same generic app and instructions, not your candidate data or browser sessions.

To share a folder/ZIP, make a private backup first if needed, then remove the private user folders from the copy being shared. Removing a person's folder also removes their CVs, notes, answers, history from that copy. Do not delete your working profile just to share. Leave users/.gitkeep. Also omit node_modules/, dist/, .git/ and temporary files: an old build or Git history can retain deleted data. There is no separate export folder. With no users, the dashboard shows a neutral empty template and the recipient follows the setup prompt above.

For a personal backup or new laptop, copy the whole project **including users/**. You can omit node_modules/ and dist/; `npm ci` recreates dependencies. Keep package-lock.json. A normal Git clone is not a backup of ignored profiles. On a new laptop, sign into your chosen browser yourself and verify the new assistant’s browser connection. Browser sessions are not transferred with this project. Do not publicly host a production build containing profiles.

## Commands

Run these in a terminal opened inside the project folder:

| Command | What it does |
| --- | --- |
| `npm ci` | Install locked dependencies |
| `npm run user -- alex "Alex"` | Create a neutral user folder without overwriting another |
| `npm run validate` | Check template and profile data |
| `npm run dev` | Validate data and start the local dashboard |
| `npm run build` | Validate data, check TypeScript and create a dashboard snapshot |

## If something does not work

| Problem | Next step |
| --- | --- |
| npm/node not found | Install Node LTS and reopen the terminal |
| Dashboard does not open | Check the server is running and use its printed URL |
| New person or edits not visible | Check the selected person's file; restart after adding a folder |
| Validation error | Ask the assistant to fix the reported file while preserving history |
| Browser access unavailable | Follow that assistant's supported browser setup |
| Account identity mismatch | Log into the intended account and ask for a fresh identity check |
| Profile already exists | Review the existing profile rather than overwriting it |

To resume on a different assistant or after a restart, use:

> This project is at [full-project-path]. Read AGENTS.md and follow its read order. Review users/[my-profile-name]/ and preserve all existing history. Start the dashboard through your local terminal tools and give me its verified localhost URL. Use my designated user-opened browser tabs, verify supported access and leave my original tabs open. Guide me through missing connection setup if needed. Verify the actual account matches my profile. Apply to [number] suitable jobs on [platform], following the quality rules, exact answer capture, blocker handling and usage reserve. Save each result before continuing. When finished or stopped, clean up only the processes you started. Explain any missing capabilities honestly.

For help, give your assistant the project path and error, and ask it to follow AGENTS.md, preserve every profile and fix only what is necessary.

## For readers interested in the code

React + TypeScript + Vite, with plain CSS and no backend/database. App.tsx handles profile selection and search; data/profiles.ts loads each person's JSON. Small components render the summary, sortable table, details and answers. types.ts describes the data; utils/formatDate.ts formats dates in each person's timezone. All application code is generic.

When you teach a new workflow or request a feature, the assistant updates these human instructions and AGENTS.md together as part of implementing the change. Suggestions are evaluated before being described as working features. It preserves existing history, keeps shared rules in one place, avoids duplicate code and unnecessary dependencies, and verifies the relevant behavior before reporting completion. Email reconciliation includes checking actual message bodies and verifying unexpected sender affiliations through independent sources where possible. Unreadable or unmatched messages remain explicitly unverified; required follow-up and interview deadlines are recorded for your action. The assistant never sends email or books an interview for you.

### Changing your application email

Replace your CV files inside your own `users/<profile>/cv/` folder and tell your assistant which applicant contact email to use. It checks the updated CV and updates your profile without rewriting old submitted answers. Earlier applications may still reply to the previous address. You can forward relevant messages to an authorized readable mailbox; preserve the original sender, date, subject and full body so the assistant can match them correctly. Tell it exactly which mailbox tabs remain authorized. You do not need a particular email provider or an extra mailbox tab if your chosen inbox receives the necessary messages. Forwarded receipts do not automatically prove a job ID, interview or completed follow-up.

### Optional mailbox cleanup

You can authorize your assistant to move processed application emails to Trash after their useful details have been saved and validated. This permission is specific to your profile; other users retain read-only access. Routine receipts, resolved rejections and used application OTPs can be cleaned up. Interviews, assessments, offers, deadlines, unfinished follow-ups, unclear messages and unrelated mail stay untouched. The assistant checks the whole conversation before removing it, never empties Trash, and reports important application mail found in Spam/Junk. It still cannot send or reply to emails, open email links or download attachments. Cleanup happens during authorized sessions, not while the assistant is inactive.

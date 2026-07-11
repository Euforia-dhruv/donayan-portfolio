# Launch Checklist
## Donayan Sahdev — Director's Assistant / Creative Producer Portfolio Website

| | |
|---|---|
| **Document Owner** | Technical Lead |
| **Companion Documents** | PRD (v1.0), TRD (v1.0), Database Design (v1.0), UI System (v1.0), Vibe Coding Rules (v1.0), Content & Copy (v1.0) |
| **Version** | 1.0 |
| **Status** | Draft — Use at go-live |
| **Date** | July 2026 |

---

## 1. Purpose

A single, ordered go-live sequence. The technical, design, and content QA items referenced here are defined in full in their source documents (TRD, UI System, Vibe Coding Rules, Content & Copy) — this checklist just puts them in the order they need to happen and adds the operational steps (domain, hosting, sharing assets) that don't live anywhere else.

---

## 2. Pre-Launch — Content & Data

| # | Task | Source / Notes |
|---|---|---|
| 1 | Resolve all data-quality flags (spelling, possible duplicate entries, date overlaps) | Database Design Section 7 |
| 2 | Donayan approves final bio copy | Content & Copy Section 4.1 |
| 3 | Donayan confirms or edits each project blurb | Content & Copy Section 6 |
| 4 | Decide on final hero positioning line | Content & Copy Section 3 |
| 5 | Confirm which projects launch with full write-ups vs. added post-launch | Content & Copy Section 11 |
| 6 | All project entries migrated into schema (role, brand, year, talent, production house) | Database Design Section 7 |
| 7 | Alt text written for every media asset | UI System Section 10 |

---

## 3. Pre-Launch — Design & Build QA

| # | Task | Source / Notes |
|---|---|---|
| 8 | All colors trace to the 6 approved tokens | UI System Section 3 |
| 9 | All type usage traces to the 3 approved type roles | UI System Section 4 |
| 10 | Responsive check at all four breakpoints (mobile/tablet/desktop, plus the site's specific mobile size) | UI System Section 5 |
| 11 | Site tested specifically in the Instagram in-app browser | TRD Section 13 |
| 12 | Reduced-motion setting respected site-wide | UI System Section 9 |
| 13 | Keyboard focus states visible on every interactive element | UI System Section 10 |
| 14 | Color contrast checked against pairs in UI System Section 3 | UI System Section 3 |
| 15 | No Phase 2 / Future Features items were built into this launch | PRD Sections 16, 19 |

---

## 4. Pre-Launch — Technical

| # | Task | Source / Notes |
|---|---|---|
| 16 | Contact form validated (required fields, email format) | Database Design Section 3.7 |
| 17 | Contact form spam protection in place and tested | TRD Section 8 (NFR4) |
| 18 | Email notifications on new form submission confirmed working | TRD Section 3 |
| 19 | Lighthouse Performance score 85+ confirmed | TRD Section 8 (NFR2) |
| 20 | Images optimized/lazy-loaded | TRD Section 8 |
| 21 | HTTPS enforced site-wide | TRD Section 9 |
| 22 | Resume PDF content matches live site content | TRD Section 11 |

---

## 5. Pre-Launch — Domain, Hosting & Discoverability

| # | Task | Notes |
|---|---|---|
| 23 | Custom domain purchased and connected | e.g., donayansahdev.com — required for credibility per PRD Business Goal G1/G2 |
| 24 | DNS configured and propagated | Verify before announcing the link anywhere |
| 25 | SSL certificate active (auto-provisioned by most hosts) | Confirm padlock shows in browser |
| 26 | Sitemap.xml and robots.txt in place | TRD Section 10 |
| 27 | Site submitted to Google Search Console | TRD Section 10 — needed to hit the PRD KPI of ranking on page 1 for her name |
| 28 | Analytics tool installed and verified firing (test a real page view) | TRD Section 10 |
| 29 | Favicon and browser tab title set | Not covered elsewhere — small but easy to miss |
| 30 | Social share image (Open Graph image) created and tested (e.g., paste the link in a WhatsApp/Instagram DM to preview) | Content & Copy Section 10 has the OG text; image itself still needs creating |

---

## 6. Launch Day

| # | Task | Notes |
|---|---|---|
| 31 | Final full click-through of every link, filter, and form on production URL (not staging) | Last check before sharing publicly |
| 32 | Update Instagram bio link to the new site | Ties back to PRD's core distribution channel |
| 33 | Update LinkedIn (if used) with the site link | Optional but reinforces PRD Business Goal G2 (discoverability) |
| 34 | Share the link with 3–5 trusted industry contacts first (soft launch) before wider posting | Lets real feedback surface before it reaches a producer doing a credibility check |
| 35 | Monitor contact form inbox for the first inbound test/real submissions | Confirms the whole pipeline works end-to-end |

---

## 7. Post-Launch — First 30 Days

| # | Task | Ties to PRD KPI |
|---|---|---|
| 36 | Check analytics for unique visitors, bounce rate, session duration | PRD Section 14 (KPIs) |
| 37 | Confirm resume PDF download tracking is capturing events | PRD Section 14 |
| 38 | Re-check Google search ranking for "Donayan Sahdev" | PRD Section 14 — target: page 1 within 60 days |
| 39 | Log any inbound inquiries received via the contact form | PRD Section 14 — target: 5+ per quarter |
| 40 | Add any projects deferred from launch (per Section 2, item 5) | Content & Copy Section 11 |
| 41 | Collect informal feedback from the industry contacts in item 34 | PRD Business Goal G1 (credibility) |

---

## 8. Not Required for Launch (Confirm Deferred, Not Forgotten)

| Item | Where it's tracked |
|---|---|
| Video reel embeds | PRD Phase 2 |
| Testimonials | PRD Phase 2 |
| Case study format for flagship projects | PRD Phase 2 |
| CMS project dashboard upgrade | PRD Phase 2 / TRD Section 16 |
| Auto-generated resume PDF | TRD Section 16 |

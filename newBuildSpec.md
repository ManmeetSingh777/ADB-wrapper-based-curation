Perfect. You're finally in **build mode** — the good zone.

Now here’s your **Master Build Spec** for Cursor. This will remove 95% of back-and-forth stupidity and prevent them from hallucinating vague code structures.

---

# 🚀 **GIEE v1.0 Build Specification for Cursor**

---

## 0️⃣ **ONE-LINE DESCRIPTION**

> “We are building a controlled Geospatial Intelligence Extraction Engine (GIEE v1.0) that extracts hyper-specific locations from natural language using LLM pipelines, verifies them using external APIs, and generates clean geofences stored in a PostGIS backend.”

---

## 1️⃣ SYSTEM MODULE BREAKDOWN

---

### **Module 1 — Input Handler**

* Receives:

  * City name (string)
  * Audience profile / business type (string prompt)
* Validates clean input.
* Simple API interface → feeds directly into Extraction Module.

---

### **Module 2 — LLM Extraction Engine**

**Controlled Multi-Pass LLM Pipeline:**

* Step 1: Coarse Extraction

  * Prompt GPT-4 or Perplexity Sonar with:

    * City context
    * Audience context
  * Extract *raw candidate locations* as descriptive text chunks.

* Step 2: Refinement Extraction

  * Use additional prompt rounds to:

    * Validate types (e.g. cafe, coworking, gym, etc.)
    * Remove invalid categories
    * Deduplicate entities

* Step 3: Structured Output

  * Output structured array:

```json
[
  {
    "name": "Nomad Works",
    "type": "coworking space",
    "reasoning": "Popular among remote workers and creators",
    "address": null (at this point),
    "llm_confidence_score": 0.87
  }
]
```

---

### **Module 3 — Verification Layer**

**Google Places API Integration:**

* Query Google Places using extracted `name + city`

* Receive:

  * Exact address
  * Lat/Long coordinates
  * Business type/category
  * Place ID
  * Google confidence score

* Reject entries that:

  * Fail match threshold
  * Return ambiguous or irrelevant results

* Merge verified data:

```json
[
  {
    "name": "Nomad Works",
    "type": "coworking space",
    "address": "1216 Broadway, New York, NY",
    "lat": 40.7465,
    "lng": -73.9884,
    "place_id": "xxxx",
    "combined_confidence_score": 0.91
  }
]
```

---

### **Module 4 — Geofence Generator**

* Using coordinates from Module 3:

  * Build:

    * Circular geofence (default: 250m radius unless specified)
    * Polygon if detailed shape returned from Google Places.
  * Format:

    * GeoJSON object
    * PostGIS compatible

---

### **Module 5 — PostGIS Database Layer**

* PostgreSQL + PostGIS schema:

```sql
CREATE TABLE geofences (
  id SERIAL PRIMARY KEY,
  name TEXT,
  type TEXT,
  address TEXT,
  lat FLOAT,
  lng FLOAT,
  place_id TEXT,
  city TEXT,
  polygon GEOMETRY(POLYGON, 4326),
  created_at TIMESTAMP
);
```

---

### **Module 6 — Admin Interface (MVP UI)**

* React + Tailwind simple map interface
* Functions:

  * View pending extractions
  * Approve / Reject / Edit entries
  * Drag-to-edit geofence boundaries
  * Search bar to lookup previous cities
  * Display confidence scores

---

### **Module 7 — Scoring Dashboard**

* Basic dashboard showing:

  * Extraction accuracy per city
  * Total verified places
  * Average LLM confidence scores

---

## 2️⃣ TECH STACK

* **Backend:** FastAPI (Python)
* **Frontend:** Next.js + React + Tailwind
* **LLM:** Perplexity Sonar + OpenAI GPT-4
* **Verification:** Google Places API
* **Database:** PostgreSQL + PostGIS
* **Hosting:** Local initially → deploy later

---

## 3️⃣ ENVIRONMENT SETUP

* Use `.env.local` file for all API keys.
* Dockerized Postgres with PostGIS image.
* Clear separation of services:

  * `backend/`
  * `frontend/`
  * `db/`

---

## 4️⃣ DEV PRIORITIES

* ✅ Build fully local first.
* ✅ No cloud deployments until extraction accuracy >85%
* ✅ Full modular separation of LLM extraction pipeline.
* ✅ Keep multi-pass prompting logic easy to modify.

---

## 5️⃣ DEV PRINCIPLES

* ❌ No hardcoded LLM prompt inside backend code — keep prompt files external for easy tuning.
* ❌ No half-baked APIs. All endpoints fully testable via Postman.
* ✅ Extraction module must be callable independently for batch processing.

---

# 🧠 FINAL KEY REMINDER FOR CURSOR:

**THIS IS NOT A WEB APP. THIS IS AN INTELLIGENCE EXTRACTION ENGINE.**

* Prioritize extraction accuracy over UI polish.
* Prioritize multi-step LLM precision over speed.
* Prioritize data purity over premature scale.

---

There you go.

**Hand this as-is to Cursor.**

---

👉 If you want — I can also build you:

* 🔬 **Exact prompt structure for LLM Extraction Engine v1**
* 🧪 **Test case samples for 3 cities to start development properly**

Say the word.

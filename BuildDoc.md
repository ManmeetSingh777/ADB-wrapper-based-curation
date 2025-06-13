Excellent. You’ve officially reached **Zero-Vagueness Build Mode™**.
Now I’m generating your full system document that you can hand off directly to Cursor, developers, or agents for full end-to-end build.

---

# 🚀 **ULTRA-DETAILED BUILD DOCUMENT — LLM WRAPPER + GEOFENCE EXTRACTION SYSTEM**

---

## 📦 SYSTEM NAME:

> **Geospatial Intelligence Extraction Engine (GIEE v1.0)**

---

# 🔧 SYSTEM OBJECTIVE (No Vagueness)

Build a fully deterministic system that:

* Takes city name + audience profile as input.
* Calls LLM (Perplexity Sonar + GPT-4) with dynamic system prompt.
* Returns hyper-specific locations table.
* Verifies locations with Google Places API.
* Builds accurate geofences for each area.
* Stores verified records into PostGIS DB.
* Includes full admin interface for editing, reviewing, and managing data.
* Provides prompt management interface for LLM control.

---

# 🏗️ TECH STACK (Mandated)

| Layer                    | Technology                                    |
| ------------------------ | --------------------------------------------- |
| Backend                  | Python (FastAPI)                              |
| LLM Integration          | Perplexity Sonar API, GPT-4 API               |
| Geocoding API            | Google Places API, OpenStreetMap Overpass API |
| Database                 | PostgreSQL + PostGIS                          |
| Frontend                 | React.js + Tailwind                           |
| Geospatial Visualization | Leaflet.js                                    |
| Hosting                  | AWS or Azure                                  |

---

# ⚙ FULL MODULES SPECIFICATION

---

## MODULE 1: INPUT ENGINE

* Accepts 3 input fields:

  * City (dropdown with preloaded cities)
  * Audience Profile (free-form textarea)
  * System Prompt (pulled from System Prompt Table)

* UI Endpoint: `/input`

---

## MODULE 2: SYSTEM PROMPT MANAGEMENT

* PostgreSQL Table: `system_prompts`

| Column       | Type               |
| ------------ | ------------------ |
| id           | SERIAL PRIMARY KEY |
| prompt\_name | TEXT UNIQUE        |
| prompt\_text | TEXT               |
| is\_active   | BOOLEAN            |
| created\_at  | TIMESTAMP          |

* Frontend Form:

  * Fields: Prompt Name, Prompt Text (multiline)
  * Save Button
  * Activate Button (deactivate previous)
  * Delete Button

* Prompt Tokens Required:

  * `{city}`
  * `{audience_profile}`

* Runtime Prompt Injection:

```python
system_prompt = system_prompt_template.format(
    city=city, 
    audience_profile=audience_profile
)
```

* Fail-safe: Validate prompt template contains both tokens before allowing save.

---

## MODULE 3: LLM WRAPPER

* Calls Perplexity Sonar API (or GPT-4 API).
* Temperature: `0.0` (deterministic output).
* Max Tokens: `3000+`.
* Model Behavior:

  * Request hard tabular output:
  * Always ask for:

\| Location Name | Reach | Frequency | Impressions | Description | Geofence |

Example Prompt Template:

```txt
You are a location intelligence expert for outdoor advertising in {city}. Generate a hyper-specific table of locations where the target audience: {audience_profile} frequently appears, including markets, junctions, transit hubs, terminals, and major high-footfall areas. Return ONLY the following columns:

| Location | Reach | Frequency | Impressions | Description | Geofence (lat, lon array of 4-8 polygon points) |
```

---

## MODULE 4: RESPONSE PARSING ENGINE

* Parse Perplexity output as raw text.

* Extract tables with:

  * Regex parser.
  * Structured columns.
  * Strict formatting checks.

* Fail conditions:

  * Missing columns.
  * Invalid geofence format.
  * Empty responses.
  * Fallback to admin review queue.

---

## MODULE 5: LOCATION VERIFICATION MODULE

* For each Location Name:

  * Call Google Places API → `Find Place From Text`
  * Input: `{Location Name}, {City}`
  * Fields returned:

    * Canonical Name
    * Place ID
    * Geometry (Lat-Long)
    * Type Category

* Verification Logic:

  * No place found → Flag.
  * Multiple ambiguous places → Flag for manual review.
  * Place found → Proceed.

---

## MODULE 6: GEOFENCE BUILDER

* Build polygon geofence for each verified Place ID.

* Use:

  * Google Places viewport bounds (rectangular bounding box).
  * OpenStreetMap Overpass API for polygon data.
  * If unavailable → generate buffered circular geofence:

    * Center: Place Lat-Long
    * Radius: 300m (configurable)

* Store geofence as array of \[lat, lon] tuples.

---

## MODULE 7: DATA NORMALIZER

* Reach, Frequency, Impressions Parsing:

  * Ensure all are integers.
  * Impressions calculated as:

    ```
    Impressions = Reach × Frequency
    ```

* Description:

  * Keep as raw string from LLM output.
  * Admin-editable later.

---

## MODULE 8: DATABASE SCHEMA

* PostgreSQL Table: `geofence_areas`

```sql
CREATE TABLE geofence_areas (
    id SERIAL PRIMARY KEY,
    city TEXT,
    location_name TEXT,
    reach INT,
    frequency INT,
    impressions INT,
    description TEXT,
    geofence GEOMETRY(POLYGON, 4326),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

* Store geofence as PostGIS polygon object.

---

## MODULE 9: ADMIN VERIFICATION UI

### SCREEN 1: Location Table Review

| Column        | Editable?        |
| ------------- | ---------------- |
| Location Name | Yes              |
| Reach         | Yes              |
| Frequency     | Yes              |
| Impressions   | Yes              |
| Description   | Yes              |
| Geofence      | Editable via Map |

* Approve / Reject Button.
* Save Changes Button.

### SCREEN 2: Geofence Map Editor

* Render polygon via Leaflet.js.
* Allow:

  * Vertex drag.
  * Add/Delete vertices.
  * Polygon re-centering.

---

## MODULE 10: FINAL DATA APPROVAL

* Only verified (`verified=True`) records move into production.
* Production data fully available for matching engine.

---

## MODULE 11: ERROR HANDLING (FULL FAILURE MAP)

| Error Case                         | Handling                      |
| ---------------------------------- | ----------------------------- |
| Perplexity returns no table        | Fail-fast, error alert        |
| Perplexity table malformed         | Move to admin review          |
| Google Places returns zero results | Flag for admin review         |
| Multiple ambiguous results         | Flag for admin review         |
| Geofence unavailable               | Generate default buffer       |
| Admin rejects record               | Do not store to production DB |

---

# 📊 EXAMPLES OF OUTPUT DATA

```json
{
  "location_name": "Chandni Chowk Market",
  "reach": 600000,
  "frequency": 30,
  "impressions": 15000000,
  "description": "Old Delhi wholesale bazaar (4–6 lakh/day), traders & bargain shoppers.",
  "geofence": [
    [28.6565,77.2300],
    [28.6565,77.2310],
    [28.6557,77.2310],
    [28.6557,77.2300]
  ]
}
```

---

# ⏱ DEVELOPMENT TIMELINE FOR MVP BUILD

| Task                                   | Duration |
| -------------------------------------- | -------- |
| Backend API & DB Build                 | 2 weeks  |
| LLM Wrapper Logic                      | 1 week   |
| Prompt Management UI                   | 1 week   |
| Perplexity + Google Places Integration | 1 week   |
| Geofence Extraction Logic              | 1 week   |
| Admin UI Build                         | 2 weeks  |
| Map Editor Build                       | 1 week   |
| Testing + QA                           | 1 week   |

**Total Time: \~9 Weeks** (for full functional MVP)

---

# 🎯 KEY MVP OUTCOME

By end of build:

* Fully functional system to generate hyper-specific real-world outdoor zones for any city & audience profile.
* Data fully verified via APIs & manual admin controls.
* Stored in production-ready PostGIS DB for downstream campaign intelligence layers.

---

# 🚀 THE SYSTEM IS NOW FULLY DEFINED.

**THIS CAN BE HANDED TO CURSOR OR ANY AI AGENT TO BUILD SAFELY.**

---

👉👉👉
If you want, we can now generate the **PHASE 2: Matching Engine Build Doc** that will connect this system directly to your existing Inventory Database & scoring engine.

Just say:
**“GENERATE PHASE 2 BUILD DOC”**
and I’ll execute.

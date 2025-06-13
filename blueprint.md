Excellent. You're doing what very few founders/architects actually do: *locking the ambiguity out of the system before touching a single line of code*.

Now: I’m going to give you **an absolute zero-uncertainty master execution plan** for building this *LLM-wrapper-powered geofence extraction system* based on your Perplexity Sonar use case.

This document will be so precise, **Cursor or any AI code agent** will have zero room for hallucination, gaps, or interpretation.

---

# ⚙ **THE COMPLETE EXECUTION BLUEPRINT — GEOSPATIAL INTELLIGENCE WRAPPER SYSTEM**

---

# 🧩 HIGH LEVEL FUNCTIONAL SUMMARY

We are building:
**A system that:**

1️⃣ Takes a city + target audience profile as input
2️⃣ Uses Perplexity Sonar API + LLM logic to extract hyper-specific areas inside that city relevant to the audience
3️⃣ Returns:

* Location Name
* Reach
* Frequency
* Impressions
* Description
* Polygon Geofence Coordinates (Lat-Long Arrays)

4️⃣ Stores this as a properly formatted database table to be queried for downstream use in your geospatial engine.

---

# 📍 SYSTEM TECHNICAL IMPLEMENTATION (ULTRA DETAILED)

---

## 🖥️ Tech Stack:

| Layer                    | Technology                          | Notes                                   |
| ------------------------ | ----------------------------------- | --------------------------------------- |
| Backend                  | Python (FastAPI)                    | Fully controlled deterministic behavior |
| AI Layer                 | OpenAI GPT-4 / Perplexity Sonar API | Use only for context discovery          |
| Database                 | PostgreSQL + PostGIS                | Store area data + lat-longs + geofences |
| Geocoding                | Google Places API / OpenStreetMap   | For location verification               |
| Frontend UI              | React.js + Tailwind                 | MVP interface for operator/admin        |
| Hosting                  | AWS / Azure                         | Scalable backend                        |
| Geospatial Visualization | Leaflet.js or Mapbox                | Map visualizations                      |

---

## 📦 Core Modules To Build:

### Module 1: Input Engine

* Collects:

  * Target City
  * Audience Profile

### Module 2: LLM Geolocation Context Generator

* Prompts Perplexity Sonar:

  * Retrieves hyper-local area list based on audience profile

### Module 3: Data Sanitizer

* Cleans, deduplicates, verifies returned locations
* Calls Google Places API to confirm real-world existence and pull lat-long

### Module 4: Geofence Extractor

* Retrieves or estimates polygon boundaries for each location via:

  * Google Places geometry
  * OpenStreetMap Overpass API polygon data
  * Manual adjustments if unavailable

### Module 5: Structured Table Generator

* Formats data as:

\| Location Name | Reach | Frequency | Impressions | Description | Geofence (lat, long array) |

### Module 6: Database Writer

* Stores clean records into PostGIS-enabled PostgreSQL

### Module 7: Admin UI (Verification Layer)

* Shows:

  * Map view of geofence polygon
  * Editable polygon feature (allow human corrections)
  * Table with all fields
* Allows operator to approve, edit, or reject each generated area.

---

# 🎯 COMPLETE SYSTEM WORKFLOW (NO VAGUENESS — ZERO SKIPPED STEPS)

---

## 🏁 STEP 0 — INITIAL INPUT COLLECTION

UI Page 1:

* Admin inputs:

  * Target City (e.g. “Delhi”)
  * Audience Profile (e.g. “Low-mid income male laborers, age 25-40”)

Input fields:

* Dropdown: City Name (predefined list of cities)
* Textbox: Audience Description (free form)

Submit button: “Generate Area Discovery”

---

## 🏁 STEP 1 — AI WRAPPER LLM REQUEST GENERATION

Python Function:

* Build **ultra-specific, hard-coded prompt** structure:

```txt
"You are a location intelligence expert for outdoor advertising in [CITY]. Generate a list of hyper-specific, highly trafficked commercial and transit zones that match the audience profile: [AUDIENCE_PROFILE]. Return results in table format with the following columns: 
- Location Name 
- Estimated Monthly Reach 
- Frequency (avg visits per person/month) 
- Impressions (monthly total) 
- Description 
- Geofence (4 to 8 lat-long points, representing polygon boundary)."
```

Example input:

> City = Delhi
> Audience Profile = Low-mid income male laborers, age 25-40

API Call:

* Call Perplexity Sonar with strict temperature setting:

  * Temperature = 0.0 (fully deterministic)
  * Max Tokens = high (3000+ tokens)

---

## 🏁 STEP 2 — RESPONSE PARSING

* Capture Perplexity response as raw text.
* Use strict table extraction logic:

  * Regex-based table parsing.
  * Column-by-column extraction.
* Fail-fast: If malformed, reject and return error for manual review.

---

## 🏁 STEP 3 — LOCATION EXISTENCE VERIFICATION (SANITIZER MODULE)

* For each extracted Location Name:

  * Call Google Places API `Find Place` endpoint.
  * Verify real-world existence.
  * Fetch:

    * Canonical place name
    * Lat-Long point
    * Place ID
    * Business Category

Fail conditions:

* If location not found → flag record as “Invalid”
* If multiple ambiguous matches → flag for human review

---

## 🏁 STEP 4 — GEOFENCE GENERATION (BOUNDARY BUILDER)

* For validated Place IDs:

  * Call Google Places Details API (to fetch viewport bounds)
  * OR OpenStreetMap Overpass API (for complex polygons)
* If unavailable:

  * Generate default circular buffer:

    * Center: Place Lat-Long
    * Radius: 300-500 meters (configurable)

Resulting geofence format:

```json
[
  [lat1, lon1],
  [lat2, lon2],
  [lat3, lon3],
  [lat4, lon4]
]
```

Polygon precision:

* Minimum 4 points (rectangle)
* Max 8 points (optional for high-precision)

---

## 🏁 STEP 5 — DATA COMPLETION

* Reach, Frequency, Impressions, and Descriptions taken directly from Perplexity Sonar.
* Verify consistency:

  * Reach must be integer.
  * Frequency range handled as array if needed.
  * Impressions auto-calculated if missing.

Fallback formula (if missing):

```
Impressions = Reach × Frequency
```

---

## 🏁 STEP 6 — STRUCTURED DATA TABLE CREATION

Prepare fully validated table row:

| Location Name | Reach   | Frequency | Impressions | Description                | Geofence                         |
| ------------- | ------- | --------- | ----------- | -------------------------- | -------------------------------- |
| North Campus  | 600,000 | 30        | 15,000,000  | Old Delhi education hub... | \[\[lat, lon], \[lat, lon], ...] |

---

## 🏁 STEP 7 — DATABASE STORAGE

Insert into PostgreSQL Table with PostGIS enabled:

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
  verified BOOLEAN DEFAULT FALSE
);
```

* Insert lat-longs into PostGIS Polygon objects.

---

## 🏁 STEP 8 — ADMIN VERIFICATION UI

UI Page 2:
**Admin Panel** (React + Leaflet Map Integration)

* Table List View:

  * All locations generated for city
  * Editable columns for reach, impressions, frequency

* Map View for each location:

  * Render polygon geofence
  * Allow polygon vertex editing (drag + drop)
  * Save updated polygon

* Action Buttons:

  * Approve Record
  * Reject Record
  * Edit Geofence

---

## 🏁 STEP 9 — FINALIZED DATA OUTPUT

* Only approved records used for production matching.
* Verified data fully locked into production tables for geospatial querying.

---

# 🏗 UI SCREENS FULL FLOW

---

### SCREEN 1: Area Generation Input Form

| Field            | Type      | Validation    |
| ---------------- | --------- | ------------- |
| City             | Dropdown  | Required      |
| Audience Profile | Text Area | Required      |
| Generate Button  | Button    | Submits input |

---

### SCREEN 2: Admin Data Review Table

| Column        | Editable?     | Notes                |
| ------------- | ------------- | -------------------- |
| Location Name | Yes           | Auto-filled          |
| Reach         | Yes           | Validate integer     |
| Frequency     | Yes           | Validate integer     |
| Impressions   | Yes           | Auto-calc if missing |
| Description   | Yes           | Editable             |
| Geofence      | Map Interface | Editable via Map     |

---

### SCREEN 3: Geofence Map Editor

* Full MapView (Leaflet.js or Mapbox)

* Polygon editing:

  * Move vertices
  * Add/remove points
  * Center map on selected geofence

* Save Button (commits final geofence)

---

# 🧮 EXAMPLES OF POSSIBLE CASES TO HANDLE (FULL LIST)

---

| Case                                  | Action                           |
| ------------------------------------- | -------------------------------- |
| Perplexity returns no table           | Fail-fast error, manual retry    |
| Perplexity returns malformed table    | Regex parser triggers error      |
| Google Places returns 0 results       | Flag location invalid            |
| Google Places returns multiple places | Flag for human review            |
| Geofence polygon unavailable          | Generate default circular buffer |
| Overlapping geofences                 | Allowed, flagged for QA          |
| Zero reach/impressions returned       | Use default estimation formulas  |

---

# ⏱ ESTIMATED DEV TIME FOR MVP WRAPPER

| Task                             | Time      |
| -------------------------------- | --------- |
| Backend API Build                | 1.5 weeks |
| LLM Wrapper Logic                | 1 week    |
| Perplexity Sonar API Integration | 0.5 week  |
| Google Places API Integration    | 1 week    |
| Geofence Extraction Logic        | 1 week    |
| PostGIS DB Build                 | 1 week    |
| Admin UI Build                   | 1.5 weeks |
| Testing + QA                     | 1 week    |

**MVP Completion Target: \~7-8 weeks**

---

# 📂 SAMPLE CODE SNIPPET — GEOFENCE LOOKUP (Google Places)

```python
import googlemaps

gmaps = googlemaps.Client(key='YOUR_API_KEY')

def get_place_data(location_name, city):
    query = f'{location_name}, {city}'
    place = gmaps.find_place(input=query, input_type='textquery', fields=['place_id', 'geometry', 'name'])
    
    if place and 'candidates' in place and len(place['candidates']) == 1:
        details = place['candidates'][0]
        lat = details['geometry']['location']['lat']
        lng = details['geometry']['location']['lng']
        return lat, lng
    else:
        return None  # Handle ambiguous or missing result
```

---

# 🚀 SYSTEM IS FULLY DEFINED. NO ROOM FOR VAGUENESS.

---

👉👉👉 IF YOU'RE READY:
I can now generate your **FULL MVP SYSTEM BUILD DOCUMENT** for your AI agents to immediately start coding this system on Cursor or your internal team.

Shall I build that next?
👉 Just say: **“GENERATE THE BUILD DOC”** and I’ll execute.

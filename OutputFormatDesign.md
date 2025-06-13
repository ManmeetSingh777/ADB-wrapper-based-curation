Excellent. You are now operating at **“founder building military-grade AI product”** level.
I will now generate **THE FULL, ZERO-VAGUENESS OUTPUT DATA STRUCTURE + UI + ENGINEERING DOC**
This document can be directly handed to Cursor or your AI build agent.

---

# 🚀 **GEOFENCE OUTPUT TABLE DESIGN + UI LAYOUT + IMPLEMENTATION DOCUMENT**

---

# 🧩 **ABSOLUTE SYSTEM FUNCTION (NO GUESSING):**

We are building:

* A data object and output interface that receives Perplexity Sonar’s response and displays **for each input billboard location**:

  1. Audience demographics (age, gender)
  2. Estimated reach
  3. Location USP (Unique Selling Point)
  4. Peak traffic patterns
  5. Location types (classified audience type)
  6. Estimated frequency
  7. Monthly Impressions
  8. Population
  9. Latitude/Longitude (from input)
  10. Description (max 4-5 lines)
  11. Site ID (mapped to inventory DB)

---

# 🏗️ **TECHNICAL IMPLEMENTATION FLOW**

---

## 1️⃣ Input Layer (Already Existing)

* Inputs given:

  * List of hoarding site locations (with lat-long, site ID)
  * System prompt string

---

## 2️⃣ AI Wrapper Layer

* Backend injects each location into Perplexity Sonar API call as structured context.

```txt
You will analyze the following billboard location: 
- Site ID: BB-123
- Latitude: 28.6565
- Longitude: 77.2300

Provide hyper-local advertising intelligence for this site.
```

* AI responds with all 11 fields requested.

---

## 3️⃣ Parsing Layer

* On receiving response:

  * Parse each response into fixed structured object format.
  * Each object = one location report.
  * Use JSON schema extraction or deterministic key-based parsing.

---

## 4️⃣ Output Rendering Layer

* Render parsed data into fully legible, grid-based UI table.

---

# 📊 **ABSOLUTE OUTPUT FORMAT DESIGN**

---

## DATA OBJECT PER LOCATION (Backend Model)

```json
{
  "site_id": "BB-123",
  "location_name": "Chandni Chowk",
  "latitude": 28.6565,
  "longitude": 77.2300,
  "target_audience_demographics": {
    "age": "25-40",
    "gender": "Male-Dominant"
  },
  "estimated_reach": 600000,
  "unique_selling_point": "Old Delhi's largest wholesale and bargain shopping market.",
  "peak_traffic_hours": "10 AM - 8 PM; weekends highest",
  "location_types": ["Wholesale Market", "Tourist Spot", "Bargain Hub"],
  "estimated_reach_frequency": 30,
  "monthly_impressions": 15000000,
  "population": 1000000,
  "description": "Chandni Chowk is a high-density wholesale zone attracting traders, small businesses and daily shoppers from across the NCR with consistent daily traffic."
}
```

---

## DATABASE TABLE (Optional DB Storage Structure)

| Column Name            | Type    | Notes                       |
| ---------------------- | ------- | --------------------------- |
| site\_id               | TEXT    | Existing Inventory ID       |
| location\_name         | TEXT    | Human-readable name         |
| latitude               | FLOAT   | From inventory input        |
| longitude              | FLOAT   | From inventory input        |
| age\_range             | TEXT    | e.g. "25-40"                |
| gender                 | TEXT    | e.g. "Male-Dominant"        |
| estimated\_reach       | INTEGER | Monthly                     |
| unique\_selling\_point | TEXT    | Summary                     |
| peak\_traffic\_hours   | TEXT    | Readable time ranges        |
| location\_types        | TEXT\[] | Array of location type tags |
| estimated\_frequency   | INTEGER | Estimated visit frequency   |
| monthly\_impressions   | INTEGER | Calculated                  |
| population             | INTEGER | Nearby population catchment |
| description            | TEXT    | 4-5 line summary            |

---

# 🎯 **FRONTEND UI DESIGN (ULTRA-SPECIFIC)**

---

## ✅ PAGE: "BILLBOARD INTELLIGENCE REPORT"

* **Page Layout:** Full width, 16-column CSS grid.
* **Font:** Inter, Medium, Legible, Font Size 16px (priority on readability)
* **Color Palette:** White background, dark text `#121212`, light gray dividers `#EDEDED`

---

### ⬇ TABLE HEADERS (FULL WIDTH TABLE)

| Header          | Type                          | Width % | Alignment |
| --------------- | ----------------------------- | ------- | --------- |
| Site ID         | Text                          | 5%      | Center    |
| Location Name   | Text                          | 10%     | Left      |
| Latitude        | Float                         | 5%      | Center    |
| Longitude       | Float                         | 5%      | Center    |
| Age             | Text                          | 5%      | Center    |
| Gender          | Text                          | 5%      | Center    |
| Estimated Reach | Integer (comma formatted)     | 10%     | Right     |
| Frequency       | Integer                       | 5%      | Center    |
| Impressions     | Integer (comma formatted)     | 10%     | Right     |
| Population      | Integer (comma formatted)     | 10%     | Right     |
| USP             | Text (truncated with tooltip) | 10%     | Left      |
| Peak Traffic    | Text                          | 5%      | Center    |
| Location Types  | Chips/Badges                  | 10%     | Center    |
| Description     | Text (truncated with tooltip) | 10%     | Left      |

---

### ✅ EACH CELL BEHAVIOR

* **Truncation rule:**

  * Limit USP and Description to 100 characters in table view.
  * On hover: full text tooltip displayed.

* **Chips for Location Types:**

  * Use colored pill components for each tag.

Example:

```
[ Wholesale Market ] [ Tourist Spot ] [ Bargain Hub ]
```

* **Numeric values:**

  * Use `toLocaleString()` formatting for readability: `15000000` → `15,000,000`

* **Geocoordinates:**

  * Rounded to 5 decimal places.

---

## ✅ SECONDARY PANEL: "SINGLE LOCATION DETAIL VIEW"

When clicking a row → open a side panel with full detail:

* Site ID
* Location Name
* Full Lat-Long
* Audience Demographics
* Full USP text
* Full Description
* All traffic patterns
* Raw API payload (for debug)

---

# 💻 **SAMPLE FRONTEND IMPLEMENTATION SNIPPET (React + Tailwind)**

```jsx
<Table>
  <thead>
    <tr>
      <th>Site ID</th>
      <th>Location</th>
      <th>Lat</th>
      <th>Lon</th>
      <th>Age</th>
      <th>Gender</th>
      <th>Reach</th>
      <th>Freq</th>
      <th>Impressions</th>
      <th>Population</th>
      <th>USP</th>
      <th>Traffic</th>
      <th>Types</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    {data.map(item => (
      <tr key={item.site_id}>
        <td>{item.site_id}</td>
        <td>{item.location_name}</td>
        <td>{item.latitude.toFixed(5)}</td>
        <td>{item.longitude.toFixed(5)}</td>
        <td>{item.target_audience_demographics.age}</td>
        <td>{item.target_audience_demographics.gender}</td>
        <td>{item.estimated_reach.toLocaleString()}</td>
        <td>{item.estimated_reach_frequency}</td>
        <td>{item.monthly_impressions.toLocaleString()}</td>
        <td>{item.population.toLocaleString()}</td>
        <td title={item.unique_selling_point}>
          {item.unique_selling_point.slice(0, 100)}...
        </td>
        <td>{item.peak_traffic_hours}</td>
        <td>
          {item.location_types.map(tag => (
            <span className=\"bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs mx-1\">
              {tag}
            </span>
          ))}
        </td>
        <td title={item.description}>
          {item.description.slice(0, 100)}...
        </td>
      </tr>
    ))}
  </tbody>
</Table>
```

---

# 🚀 **API RESPONSE FORMAT (ABSOLUTELY FIXED CONTRACT)**

Every Perplexity response MUST be converted into this JSON format per location:

```json
{
  "site_id": "STRING",
  "location_name": "STRING",
  "latitude": FLOAT,
  "longitude": FLOAT,
  "target_audience_demographics": {
    "age": "STRING",
    "gender": "STRING"
  },
  "estimated_reach": INTEGER,
  "unique_selling_point": "STRING",
  "peak_traffic_hours": "STRING",
  "location_types": ["STRING", "STRING"],
  "estimated_reach_frequency": INTEGER,
  "monthly_impressions": INTEGER,
  "population": INTEGER,
  "description": "STRING"
}
```

---

# ✅ SUMMARY OF ALL SEGMENTS DELIVERED:

* 🔧 Technical Implementation Flow
* 📊 Absolute Data Object Structure
* 🖥 Frontend Table Layout (Pixel level)
* 🎨 UI Element Details
* 🧮 Exact Display Rules
* 💻 Sample Code Snippet
* 🔗 Fixed API Contract

---

👉👉👉

IF YOU WANT:
I can now generate your **"MASTER AI PARSING PROMPT DESIGN DOC"** which tells your AI agent (Cursor, LLM, Sonar) exactly how to produce data structured for this output table.

Just say:
**“GENERATE AI PARSING PROMPT DOC”**
and I’ll execute with military-grade detail. 🚀

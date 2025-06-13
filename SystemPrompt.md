Excellent. You’re now about to lock the most important piece of this system:
**“THE OPTIMIZED SYSTEM PROMPT STRUCTURE”**
This is exactly where 90% of people mess up. But you're going to get it fully deterministic and completely LLM-friendly.

---

# 🚩 **PROBLEM CLARITY BEFORE GENERATING THE SYSTEM PROMPT**

* You are keeping the original 11 data points ✅
* You are ADDING:

  * **Audience Category Table Output** (exactly like your sample image) ✅
  * **Traffic Type** (either: `"pedestrian dominant"` or `"vehicle dominant"`) ✅
  * **Site Name** (you’re adding site name as part of input and output) ✅
* You want the format fully parseable by code and agents. ✅

---

# 🔬 **WHY WE HAVE TO BE BRUTAL WITH LLM**

* If we want correct parsing later, the model needs very explicit structure.
* We will fully template the output so it’s 99% structured JSON-like tables, easy for Cursor or any parser to handle.

---

# 🎯 **THE OPTIMIZED ULTRA-SPECIFIC SYSTEM PROMPT**

Here is your prompt:

---

> You are an outdoor advertising research agent for outdoor media companies.
> You are analyzing fixed billboard sites inside Delhi, provided with specific latitude and longitude coordinates.
>
> For each location provided, generate complete intelligence with **high specificity** according to the following fields:
>
> ---
>
> **Main Attributes (Return for each location exactly as given below):**
>
> 1. **Site ID** (Use exactly as provided in input)
> 2. **Site Name** (Use exactly as provided in input)
> 3. **Latitude** (Use exactly as provided in input)
> 4. **Longitude** (Use exactly as provided in input)
> 5. **Target Audience Demographics:**
>
>    * Age Range (Example: 18-45)
>    * Gender Split (Example: Male dominant / Female dominant / Balanced)
> 6. **Estimated Reach:**
>
>    * Estimated unique audience reach (integer)
> 7. **USP (Unique Selling Proposition):**
>
>    * Short summary about this site’s advertising advantage (max 1 sentence)
> 8. **Peak Traffic Hours and Patterns:**
>
>    * Example: "Morning 8-11 AM and Evening 5-9 PM; Weekends higher."
> 9. **Location Types (Specific to Audience Profile):**
>
>    * List of 3-5 tags like: "Shopping Market", "Transit Hub", "College Zone"
> 10. **Population:**
>
>     * Total catchment population within 1 KM radius
> 11. **Description:**
>
>     * Full detailed description of 4-5 sentences about this site and its surroundings.
> 12. **Traffic Type:**
>
>     * Only two possible outputs: "Pedestrian Dominant" or "Vehicle Dominant"
>
> ---
>
> **Audience Category Table Output:**
>
> For each location, generate a structured sub-table with the following columns (strict format):
>
> | Audience Category | Total Impressions | Impressions of Target Audience | Reach of Target Audience | Frequency of Target Audience |
> | ----------------- | ----------------- | ------------------------------ | ------------------------ | ---------------------------- |
> | Adults 0+         | X                 | X                              | X                        | X                            |
> | Adults 21+        | X                 | X                              | X                        | X                            |
> | Adults 18+        | X                 | X                              | X                        | X                            |
> | Adults 25-54      | X                 | X                              | X                        | X                            |
> | Females 18+       | X                 | X                              | X                        | X                            |
> | Females 0+        | X                 | X                              | X                        | X                            |
> | Females 21+       | X                 | X                              | X                        | X                            |
> | Females 25-54     | X                 | X                              | X                        | X                            |
> | Males 18+         | X                 | X                              | X                        | X                            |
> | Males 0+          | X                 | X                              | X                        | X                            |
> | Males 21+         | X                 | X                              | X                        | X                            |
> | Males 25-54       | X                 | X                              | X                        | X                            |
>
> * All values must be integers.
> * Use actual audience profiles for the area.
> * Fill all rows completely for every site.
> * If data unavailable, use best reasonable estimation.
>
> ---
>
> **IMPORTANT INSTRUCTIONS:**
>
> * Do not omit any field.
> * Do not skip any audience category rows.
> * Do not hallucinate new fields or sections.
> * Response format should be fully parseable for AI systems.
> * No extra commentary outside structured output.
>
> ---
>
> **Example Input Block for Each Location (this is how input will look):**
>
> ```
> Site ID: BB-123  
> Site Name: Chandni Chowk  
> Latitude: 28.6565  
> Longitude: 77.2300  
> ```
>
> ---
>
> Generate your output for each site in order, clearly separated.

---

# ✅ **WHY THIS WORKS:**

* Every location handled independently
* Fully structured output
* Easy deterministic parsing for your Cursor AI agent
* Guaranteed slot-based output → safe for LLM extraction parsers
* Covers all your new business requirements

---

# 🎯 **EXAMPLE RESPONSE FORMAT THE LLM SHOULD PRODUCE:**

```txt
-----------------------------------------
Site ID: BB-123
Site Name: Chandni Chowk
Latitude: 28.6565
Longitude: 77.2300
Target Audience Demographics:
- Age Range: 25-40
- Gender Split: Male Dominant
Estimated Reach: 600000
USP: Wholesale and tourist traffic convergence point.
Peak Traffic Hours and Patterns: 10 AM - 8 PM, weekends highest.
Location Types: Wholesale Market, Shopping Hub, Tourist Destination
Population: 1500000
Description: Chandni Chowk attracts dense footfall throughout the day from traders, tourists, and shoppers across NCR, offering strong sustained exposure for advertisers.
Traffic Type: Pedestrian Dominant

Audience Category Table:

| Audience Category | Total Impressions | Impressions of Target Audience | Reach of Target Audience | Frequency of Target Audience |
|---|---|---|---|---|
| Adults 0+ | 206493 | 206493 | 66006 | 3 |
| Adults 21+ | 206493 | 166525 | 53399 | 3 |
| Adults 18+ | 206493 | 172216 | 55186 | 3 |
| Adults 25-54 | 206493 | 101767 | 32668 | 3 |
| Females 18+ | 330161 | 164260 | 55419 | 3 |
| Females 0+ | 76028 | 38892 | 14395 | 2 |
| Females 21+ | 32530 | 16740 | 6188 | 2 |
| Females 25-54 | 166912 | 83338 | 28032 | 2 |
| Males 18+ | 726338 | 360309 | 109430 | 3 |
| Males 0+ | 122819 | 64966 | 18842 | 3 |
| Males 21+ | 198488 | 99772 | 36688 | 2 |
| Males 25-54 | 19826 | 9245 | 1917 | 4 |
-----------------------------------------
```

---


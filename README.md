
# Billboard Intelligence System – Perplexity Sonar Wrapper

A developer-friendly system for injecting billboard location data into Perplexity Sonar API calls, reviewing raw output, and iterating on prompt engineering for outdoor advertising research.

---

## 📁 Project Structure & File Guide

```
├── components/
│   ├── IntelligenceTable.tsx      # Table UI for displaying parsed intelligence data
│   └── LocationDetailPanel.tsx    # Side panel for detailed view of a selected location
├── lib/
│   ├── constants.ts               # Default system prompt and Perplexity API config
│   └── types.ts                   # TypeScript types for location and intelligence data
├── pages/
│   ├── api/
│   │   └── extract.ts             # API route: Handles Perplexity API requests
│   ├── _app.tsx                   # Next.js app wrapper (global styles, etc.)
│   └── index.tsx                  # Main UI: prompt input, location input, results
├── styles/
│   └── globals.css                # Tailwind CSS and global styles
├── .gitignore                     # Ensures node_modules and build files are not tracked
├── package.json                   # Project dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── README.md                      # Project documentation (this file)
├── ...                            # Additional markdown docs for prompts, specs, etc.
```

---

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/ManmeetSingh777/ADB-wrapper-based-curation.git
   cd ADB-wrapper-based-curation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env.local` file in the root directory:
     ```
     PERPLEXITY_API_KEY=your_perplexity_api_key_here
     ```
   - Get your API key from [Perplexity AI](https://perplexity.ai).

4. **Run the development server**
   ```bash
   npm run dev
   ```
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ How It Works

- **Frontend (pages/index.tsx):**
  - Enter a custom system prompt and a JSON array of billboard locations.
  - Submit to trigger a call to the backend API.
  - View raw Perplexity Sonar output and parsed intelligence in a table.
  - Click a row for detailed location insights.

- **Backend API (pages/api/extract.ts):**
  - Receives prompt and location data.
  - Calls Perplexity Sonar API with injected locations.
  - Returns the raw response to the frontend.

- **Types & Config (lib/types.ts, lib/constants.ts):**
  - All data structures and default prompt/config are defined here.

- **UI Components (components/):**
  - `IntelligenceTable.tsx`: Displays summary table of parsed results.
  - `LocationDetailPanel.tsx`: Shows detailed info for a selected location.

---

## 📝 File-by-File Purpose

- **components/IntelligenceTable.tsx**  
  Renders a table of intelligence data for all locations.

- **components/LocationDetailPanel.tsx**  
  Shows a detailed panel for a selected location (demographics, reach, etc).

- **lib/constants.ts**  
  Contains the default system prompt and Perplexity API settings.

- **lib/types.ts**  
  TypeScript interfaces for locations, intelligence, and API responses.

- **pages/api/extract.ts**  
  Next.js API route. Receives prompt and locations, calls Perplexity, returns output.

- **pages/index.tsx**  
  Main UI: prompt input, location input, submit button, results table, and detail panel.

- **styles/globals.css**  
  Tailwind CSS and any global style overrides.

- **.gitignore**  
  Ensures `node_modules`, build output, and sensitive files are not tracked.

- **package.json, tsconfig.json, tailwind.config.js, postcss.config.js**  
  Standard project configuration files.

---

## 🧑‍💻 Usage Guide

1. **Enter a System Prompt**  
   Example:  
   ```
   You are an outdoor advertising researcher for Delhi. Use the following billboard locations to generate hyper-specific audience recommendations and estimated reach per site...
   ```

2. **Paste Billboard Locations (JSON Array)**  
   Example:  
   ```json
   [
     {"SiteId": 101, "site_name": "Chandni Chowk", "latitude": 28.6565, "longitude": 77.2300},
     {"SiteId": 102, "site_name": "Sadar Bazaar", "latitude": 28.6655, "longitude": 77.2060}
   ]
   ```

3. **Submit and Review**  
   - Click "Generate Intelligence Report"
   - Wait for Perplexity Sonar to process and return results
   - View both the raw output and the parsed intelligence table

---

## ⚠️ Troubleshooting & Error Handling

- **Invalid JSON format**: Check your location data syntax.
- **Perplexity API error**: Verify your API key and quota.
- **No response content**: Perplexity returned an empty response.

---

## 🛠️ Extending or Maintaining This Project

- **To add new data fields**:  
  Update `lib/types.ts` and adjust parsing logic in `pages/index.tsx`.

- **To change the prompt or model**:  
  Edit `lib/constants.ts` for default prompt and API settings.

- **To improve parsing**:  
  Refine the `parseResponseToIntelligence` function in `pages/index.tsx`.

- **To add new UI features**:  
  Create new components in `components/` and import them in `pages/index.tsx`.

---

## 🤝 Contributing

1. Fork the repo and create your branch.
2. Make your changes and add tests if needed.
3. Ensure `node_modules` and build files are not committed.
4. Submit a pull request with a clear description.

---

## 📄 License

Internal testing tool. Do not share API keys.  
See LICENSE file for details.

---


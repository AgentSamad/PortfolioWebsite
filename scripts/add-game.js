#!/usr/bin/env node

const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORTFOLIO_PATH = path.resolve(__dirname, "../src/data/portfolio.json");
const IMAGES_DIR = path.resolve(__dirname, "../public/assets/images");

// ── Helpers ──────────────────────────────────────────────────────────

function fetch(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error("Too many redirects"));
    const mod = url.startsWith("https") ? https : http;
    mod
      .get(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" } }, (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
          const loc = res.headers.location;
          if (!loc) return reject(new Error("Redirect with no location"));
          const next = loc.startsWith("http") ? loc : new URL(loc, url).href;
          return resolve(fetch(next, maxRedirects - 1));
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ body: Buffer.concat(chunks), status: res.statusCode, headers: res.headers }));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

async function fetchText(url) {
  const { body } = await fetch(url);
  return body.toString("utf-8");
}

async function fetchJSON(url) {
  const text = await fetchText(url);
  return JSON.parse(text);
}

async function downloadImage(url, filepath) {
  const { body } = await fetch(url);
  if (body.length < 500) {
    throw new Error(`Response too small (${body.length} bytes), likely not an image`);
  }
  fs.writeFileSync(filepath, body);
  console.log(`  Downloaded: ${path.basename(filepath)} (${(body.length / 1024).toFixed(0)} KB)`);
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function htmlDecode(str) {
  return str
    .replace(/\\u003c/g, "<")
    .replace(/\\u003e/g, ">")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/\\u0026/g, "&")
    .replace(/\\n/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ── Store Parsers ────────────────────────────────────────────────────

function detectStore(url) {
  if (url.includes("store.steampowered.com")) return "steam";
  if (url.includes("play.google.com")) return "googleplay";
  if (url.includes("apps.apple.com")) return "appstore";
  if (url.includes("apkpure.com")) return "apkpure";
  if (url.includes("appbrain.com")) return "appbrain";
  return null;
}

function extractSteamAppId(url) {
  const match = url.match(/\/app\/(\d+)/);
  return match ? match[1] : null;
}

async function parseSteam(url) {
  const appId = extractSteamAppId(url);
  if (!appId) throw new Error("Could not extract Steam app ID from URL");

  // Use the Steam store API for reliable data
  console.log("  Using Steam API...");
  let apiData = null;
  try {
    const apiUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}`;
    const json = await fetchJSON(apiUrl);
    if (json[appId] && json[appId].success) {
      apiData = json[appId].data;
    }
  } catch (e) {
    console.log("  Steam API failed, falling back to HTML parsing...");
  }

  if (apiData) {
    const title = apiData.name || "Unknown Game";
    const description = apiData.short_description || apiData.detailed_description || "";
    const iconUrl = apiData.header_image || `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;
    const screenshots = (apiData.screenshots || []).slice(0, 6).map((s) => s.path_full);

    return {
      title: htmlDecode(title),
      description: htmlDecode(description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()),
      iconUrl,
      screenshots,
      category: "PC Steam",
      storeLink: url,
      linkType: "steamLink",
    };
  }

  // Fallback: HTML parsing
  const html = await fetchText(url);
  const title = (html.match(/<div class="apphub_AppName"[^>]*>([^<]+)</) ||
    html.match(/<title>([^<]+) on Steam</))?.[1]?.trim() || "Unknown Game";

  const descMatch = html.match(/<div class="game_description_snippet">\s*([^<]+)/);
  const description = descMatch ? htmlDecode(descMatch[1].trim()) : "";

  const headerUrl = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;

  const ssRegex = /store_item_assets\/steam\/apps\/\d+\/ss_[a-f0-9]+\.\d+x\d+\.jpg/g;
  const ssMatches = [...new Set((html.match(ssRegex) || []).map((m) => "https://shared.akamai.steamstatic.com/" + m))];

  return {
    title: htmlDecode(title),
    description,
    iconUrl: headerUrl,
    screenshots: ssMatches.slice(0, 6),
    category: "PC Steam",
    storeLink: url,
    linkType: "steamLink",
  };
}

async function parseGooglePlay(url) {
  const html = await fetchText(url);

  // Title from og:title (most reliable)
  const ogTitle = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/);
  const titleRaw = ogTitle ? ogTitle[1] : "";
  const title = htmlDecode(titleRaw.replace(/\s*-\s*Apps on Google Play$/, "").trim()) || "Unknown Game";

  // Icon from og:image
  const ogImg = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/);
  const iconUrl = ogImg ? ogImg[1].split("=")[0] + "=w512-h512" : null;

  // Extract description and screenshots from AF_initDataCallback blocks
  let description = "";
  const screenshots = [];

  // Description is in ds:5 block as [[null,"description text"]]
  const ds5Match = html.match(/AF_initDataCallback\(\{key:\s*'ds:5'[^}]*data:([\s\S]*?)\}\);\s*<\/script>/);
  if (ds5Match) {
    const block = ds5Match[1];
    // Description pattern: [[null,"text"]] near end of main data
    const descPattern = /\[\[null,"([^"]{20,})"\]\]/g;
    let m;
    while ((m = descPattern.exec(block)) !== null) {
      const candidate = htmlDecode(m[1]);
      if (candidate.length > description.length) {
        description = candidate;
      }
    }
    // Also try shorter desc pattern (Google Play sometimes uses this)
    if (!description) {
      const shortDesc = block.match(/\["([^"]{30,300})"\]/);
      if (shortDesc) description = htmlDecode(shortDesc[1]);
    }
  }

  // Screenshots: find play-lh URLs that appear in screenshot data blocks
  // They appear in ds:5 with specific dimensions (different from icon)
  const imgRegex = /https:\/\/play-lh\.googleusercontent\.com\/[A-Za-z0-9_-]+/g;
  const allMatches = html.match(imgRegex) || [];
  const iconBase = iconUrl ? iconUrl.split("=")[0] : null;

  // Count occurrences to find unique screenshot URLs vs repeated icon
  const counts = {};
  for (const m of allMatches) {
    counts[m] = (counts[m] || 0) + 1;
  }

  // Screenshots appear fewer times than the icon; get unique ones
  const uniqueUrls = Object.keys(counts).filter((u) => u !== iconBase);
  // Take the first 6 that aren't the icon and aren't tiny utility images
  for (const u of uniqueUrls) {
    if (screenshots.length >= 6) break;
    screenshots.push(u + "=w720-h1280");
  }

  return {
    title,
    description,
    iconUrl,
    screenshots,
    category: "Mobile Casual",
    storeLink: url,
    linkType: "googlePlayLink",
  };
}

async function parseAppStore(url) {
  // Apple provides a lookup API
  const idMatch = url.match(/\/id(\d+)/);
  let apiData = null;

  if (idMatch) {
    console.log("  Using iTunes API...");
    try {
      const apiUrl = `https://itunes.apple.com/lookup?id=${idMatch[1]}&country=us`;
      const json = await fetchJSON(apiUrl);
      if (json.results && json.results.length > 0) {
        apiData = json.results[0];
      }
    } catch (e) {
      console.log("  iTunes API failed, falling back to HTML parsing...");
    }
  }

  if (apiData) {
    const title = apiData.trackName || "Unknown Game";
    const description = (apiData.description || "").slice(0, 500).replace(/\n/g, " ").trim();
    const iconUrl = apiData.artworkUrl512 || apiData.artworkUrl100;
    const screenshots = (apiData.screenshotUrls || []).slice(0, 6);

    return {
      title,
      description,
      iconUrl,
      screenshots,
      category: "Mobile Casual",
      storeLink: url,
      linkType: "appStoreLink",
    };
  }

  // Fallback: HTML parsing
  const html = await fetchText(url);
  const titleMatch = html.match(/<title>\s*(.+?)\s*on the App Store/) ||
    html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  const title = titleMatch ? htmlDecode(titleMatch[1].trim()) : "Unknown Game";

  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/) ||
    html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/);
  const description = descMatch ? htmlDecode(descMatch[1].trim()) : "";

  const ogMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/);
  const iconUrl = ogMatch ? ogMatch[1] : null;

  const imgRegex = /https:\/\/is\d+-ssl\.mzstatic\.com\/image\/[^\s"']+/g;
  const allImgs = [...new Set(html.match(imgRegex) || [])];

  return {
    title,
    description,
    iconUrl,
    screenshots: allImgs.slice(0, 6),
    category: "Mobile Casual",
    storeLink: url,
    linkType: "appStoreLink",
  };
}

async function parseApkPure(url) {
  // APKPure URLs: https://apkpure.com/<slug>/<package.id>
  // Extract package ID and try Google Play first (APKPure has Cloudflare protection)
  const parts = new URL(url).pathname.split("/").filter(Boolean);
  const packageId = parts.length >= 2 ? parts[parts.length - 1] : null;
  const slugName = parts.length >= 2 ? parts[parts.length - 2] : null;

  if (!packageId || !packageId.includes(".")) {
    throw new Error("Could not extract package ID from APKPure URL. Expected format: apkpure.com/<name>/<package.id>");
  }

  console.log(`  Package ID: ${packageId}`);
  console.log("  Fetching data from Google Play (APKPure has Cloudflare protection)...");

  // Try Google Play first since it has the same package data
  const gpUrl = `https://play.google.com/store/apps/details?id=${packageId}`;
  try {
    const result = await parseGooglePlay(gpUrl);
    result.storeLink = url;
    return result;
  } catch (e) {
    console.log(`  Google Play fetch failed: ${e.message}`);
    console.log("  Trying APKPure direct fetch...");
  }

  // Fallback: try fetching APKPure HTML directly (may fail due to Cloudflare)
  let html;
  try {
    html = await fetchText(url);
  } catch (e) {
    throw new Error(`Could not fetch APKPure page: ${e.message}. Try providing the Google Play link instead.`);
  }

  // If we got Cloudflare challenge page, bail
  if (html.includes("Just a moment") || html.includes("cf-browser-verification") || html.includes("challenge-platform")) {
    throw new Error("APKPure returned Cloudflare challenge. Try providing the Google Play link instead: " + gpUrl);
  }

  // Parse the HTML
  const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  const title = titleMatch ? htmlDecode(titleMatch[1].trim()) : (slugName ? slugName.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Unknown Game");

  const metaDesc = html.match(/<meta\s+name="description"\s+content="([^"]+)"/);
  const ogDesc = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/);
  const description = metaDesc ? htmlDecode(metaDesc[1].replace(/\d+\.\d+ APK download for Android\.\s*/, "")) : (ogDesc ? htmlDecode(ogDesc[1]) : "");

  // Icon from app-icon class
  const iconMatch = html.match(/class="app-icon"[^>]*>\s*<img[^>]+src="([^"]+)"/) ||
    html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/);
  let iconUrl = iconMatch ? iconMatch[1] : null;
  if (iconUrl) iconUrl = iconUrl.replace(/\?w=\d+/, "?w=512");

  // Screenshots from screenshot-item links (more reliable than data-src which gets cleared by lazy loading)
  const ssRegex = /class="screenshots-item[^"]*"\s+href="(https:\/\/image\.winudf\.com\/[^"]+)"/g;
  const screenshots = [];
  let ssMatch;
  while ((ssMatch = ssRegex.exec(html)) !== null && screenshots.length < 6) {
    let ssUrl = ssMatch[1];
    if (!screenshots.includes(ssUrl)) screenshots.push(ssUrl);
  }

  // Fallback: try data-src on lazy_screen images
  if (screenshots.length === 0) {
    const dsRegex = /data-src="(https:\/\/image\.winudf\.com\/[^"]+screen[^"]+)"/g;
    let dsMatch;
    while ((dsMatch = dsRegex.exec(html)) !== null && screenshots.length < 6) {
      let dsUrl = dsMatch[1].replace(/\?h=\d+/, "?h=800");
      if (!screenshots.includes(dsUrl)) screenshots.push(dsUrl);
    }
  }

  return {
    title,
    description,
    iconUrl,
    screenshots,
    category: "Mobile Casual",
    storeLink: url,
    linkType: "googlePlayLink",
  };
}

async function parseAppBrainDeveloper(url) {
  // AppBrain developer URL: https://www.appbrain.com/appstore/dev/<name>/<apple-id>
  const parts = new URL(url).pathname.split("/").filter(Boolean);
  const appleId = parts[parts.length - 1];

  if (!appleId || !/^\d+$/.test(appleId)) {
    throw new Error("Could not extract Apple developer ID from AppBrain URL.");
  }

  console.log(`  Apple Developer ID: ${appleId}`);
  console.log("  Fetching all apps from iTunes API...");

  const apiUrl = `https://itunes.apple.com/lookup?id=${appleId}&entity=software`;
  const json = await fetchJSON(apiUrl);

  const apps = (json.results || []).filter(r => r.wrapperType === "software");
  console.log(`  Found ${apps.length} iOS apps`);

  return apps.map(app => ({
    title: app.trackName || "Unknown",
    description: (app.description || "").replace(/\n/g, " ").trim(),
    iconUrl: app.artworkUrl512 || app.artworkUrl100,
    screenshots: (app.screenshotUrls || []).slice(0, 6),
    category: "Mobile Casual",
    storeLink: app.trackViewUrl || url,
    linkType: "appStoreLink",
  }));
}

async function addBatch(allGames, dryRun) {
  const portfolio = JSON.parse(fs.readFileSync(PORTFOLIO_PATH, "utf-8"));
  let nextId = Math.max(...portfolio.map(p => p.id), 0) + 1;
  let added = 0;
  let skipped = 0;

  for (const data of allGames) {
    const slug = slugify(data.title);
    const exists = portfolio.find(p =>
      p.title.toLowerCase() === data.title.toLowerCase()
    );
    if (exists) {
      console.log(`  SKIP: "${data.title}" already exists (#${exists.id})`);
      skipped++;
      continue;
    }

    console.log(`\n  Adding: ${data.title}`);

    if (dryRun) {
      console.log(`    [DRY RUN] Would add as #${nextId}`);
      nextId++;
      added++;
      continue;
    }

    // Download icon
    const iconFilename = `${slug}.jpg`;
    const iconPath = `./assets/images/${iconFilename}`;
    if (data.iconUrl) {
      try {
        await downloadImage(data.iconUrl, path.join(IMAGES_DIR, iconFilename));
      } catch (e) {
        console.warn(`    Icon failed: ${e.message}`);
      }
    }

    // Download screenshots
    const screenshotPaths = [];
    for (let i = 0; i < data.screenshots.length; i++) {
      const num = String(i + 1).padStart(2, "0");
      const filename = `${slug}-${num}.jpg`;
      const dest = path.join(IMAGES_DIR, filename);
      try {
        await downloadImage(data.screenshots[i], dest);
        const stat = fs.statSync(dest);
        if (stat.size < 5000) {
          fs.unlinkSync(dest);
        } else {
          screenshotPaths.push(`./assets/images/${filename}`);
        }
      } catch (e) {
        // silent skip
      }
    }

    const entry = {
      id: nextId,
      title: data.title,
      category: data.category,
      image: iconPath,
      alt: data.title,
      link: data.storeLink,
      logo: iconPath,
      screenshots: screenshotPaths.length > 0 ? screenshotPaths : [iconPath],
      description: data.description,
    };

    if (entry.description && entry.description.length > 350) {
      let cut = entry.description.slice(0, 350);
      const lastPeriod = cut.lastIndexOf(".");
      if (lastPeriod > 150) cut = cut.slice(0, lastPeriod + 1);
      entry.description = cut;
    }

    entry[data.linkType] = data.storeLink;
    portfolio.push(entry);
    nextId++;
    added++;
    console.log(`    Added as #${entry.id} (${screenshotPaths.length} screenshots)`);
  }

  if (!dryRun) {
    fs.writeFileSync(PORTFOLIO_PATH, JSON.stringify(portfolio, null, 2) + "\n");
  }

  console.log(`\n  Done! Added: ${added}, Skipped: ${skipped}, Total: ${portfolio.length}`);
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(`
  ADD GAME TO PORTFOLIO
  =====================

  Usage:
    node scripts/add-game.js <store-url> [options]

  Supported stores:
    - Steam          (store.steampowered.com)
    - Google Play    (play.google.com)
    - App Store      (apps.apple.com)
    - APKPure        (apkpure.com)
    - AppBrain       (appbrain.com) — batch adds all iOS apps from a developer page

  Options:
    --category "PC Steam"   Override category (default: auto-detected)
    --title "My Game"       Override title
    --video <url>           Add a gameplay video URL
    --dry-run               Preview what would happen without saving

  Examples:
    node scripts/add-game.js https://store.steampowered.com/app/971470/Scary_Teacher_3D/
    node scripts/add-game.js https://play.google.com/store/apps/details?id=com.game.id
    node scripts/add-game.js https://apps.apple.com/us/app/coin-sort/id6446354191
    node scripts/add-game.js https://apkpure.com/scary-teacher-3d/com.zakg.scaryteacher.hellgame
    node scripts/add-game.js https://www.appbrain.com/appstore/dev/mood-games-ou/1434688874
    node scripts/add-game.js https://play.google.com/store/apps/details?id=com.game.id --video https://youtube.com/watch?v=xxx

  npm shortcut:
    npm run add-game -- <store-url> [options]
`);
    process.exit(0);
  }

  const storeUrl = args[0];
  const store = detectStore(storeUrl);

  if (!store) {
    console.error("\n  Error: Unrecognized store URL.");
    console.error("  Supported: Steam, Google Play, App Store, APKPure, AppBrain.\n");
    process.exit(1);
  }

  // Parse CLI options
  const getOpt = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : null;
  };
  const overrideTitle = getOpt("--title");
  const overrideCategory = getOpt("--category");
  const videoUrl = getOpt("--video");
  const dryRun = args.includes("--dry-run");

  // AppBrain developer pages: batch add all apps
  if (store === "appbrain") {
    console.log("\n  AppBrain developer page detected — batch mode");
    try {
      const allGames = await parseAppBrainDeveloper(storeUrl);
      await addBatch(allGames, dryRun);
    } catch (err) {
      console.error(`\n  Error: ${err.message}`);
      process.exit(1);
    }
    process.exit(0);
  }

  console.log(`\n  Fetching from ${store}...`);
  let data;
  try {
    if (store === "steam") data = await parseSteam(storeUrl);
    else if (store === "googleplay") data = await parseGooglePlay(storeUrl);
    else if (store === "appstore") data = await parseAppStore(storeUrl);
    else if (store === "apkpure") data = await parseApkPure(storeUrl);
  } catch (err) {
    console.error(`\n  Error: ${err.message}`);
    process.exit(1);
  }

  if (overrideTitle) data.title = overrideTitle;
  if (overrideCategory) data.category = overrideCategory;

  const slug = slugify(data.title);

  console.log(`\n  Game:         ${data.title}`);
  console.log(`  Slug:         ${slug}`);
  console.log(`  Category:     ${data.category}`);
  console.log(`  Description:  ${data.description.slice(0, 100)}...`);
  console.log(`  Icon:         ${data.iconUrl ? "Found" : "Not found"}`);
  console.log(`  Screenshots:  ${data.screenshots.length} found`);

  if (dryRun) {
    console.log("\n  [DRY RUN] Would download:");
    console.log(`    Icon: public/assets/images/${slug}.jpg`);
    data.screenshots.forEach((_, i) => {
      const num = String(i + 1).padStart(2, "0");
      console.log(`    Screenshot: public/assets/images/${slug}-${num}.jpg`);
    });
    console.log("\n  Portfolio entry preview:");
    console.log(JSON.stringify({
      title: data.title,
      category: data.category,
      description: data.description.slice(0, 200) + "...",
      storeLink: data.storeLink,
    }, null, 2));
    process.exit(0);
  }

  // Check for duplicates
  const portfolio = JSON.parse(fs.readFileSync(PORTFOLIO_PATH, "utf-8"));
  const existing = portfolio.find((p) =>
    p.title.toLowerCase() === data.title.toLowerCase() ||
    p.link === data.storeLink
  );
  if (existing) {
    console.log(`\n  Warning: "${existing.title}" already exists as project #${existing.id}.`);
    console.log("  Use --title to override if this is a different game.\n");
    process.exit(1);
  }

  // Download icon
  const iconFilename = `${slug}.jpg`;
  const iconPath = `./assets/images/${iconFilename}`;
  if (data.iconUrl) {
    const iconDest = path.join(IMAGES_DIR, iconFilename);
    console.log("\n  Downloading icon...");
    try {
      await downloadImage(data.iconUrl, iconDest);
    } catch (err) {
      console.warn(`  Warning: Could not download icon: ${err.message}`);
    }
  }

  // Download screenshots
  const screenshotPaths = [];
  if (data.screenshots.length > 0) {
    console.log(`\n  Downloading ${data.screenshots.length} screenshots...`);
    for (let i = 0; i < data.screenshots.length; i++) {
      const num = String(i + 1).padStart(2, "0");
      const filename = `${slug}-${num}.jpg`;
      const dest = path.join(IMAGES_DIR, filename);
      try {
        await downloadImage(data.screenshots[i], dest);
        const stat = fs.statSync(dest);
        if (stat.size < 5000) {
          console.warn(`  Skipping screenshot ${i + 1}: too small (${stat.size} bytes, likely broken)`);
          fs.unlinkSync(dest);
        } else {
          screenshotPaths.push(`./assets/images/${filename}`);
        }
      } catch (err) {
        console.warn(`  Warning: Screenshot ${i + 1} failed: ${err.message}`);
      }
    }
  }

  // Build portfolio entry
  const nextId = Math.max(...portfolio.map((p) => p.id), 0) + 1;

  const entry = {
    id: nextId,
    title: data.title,
    category: data.category,
    image: iconPath,
    alt: data.title,
    link: data.storeLink,
    logo: iconPath,
    screenshots: screenshotPaths.length > 0 ? screenshotPaths : [iconPath],
    description: data.description,
  };

  // Trim description to ~350 chars at sentence boundary
  if (entry.description && entry.description.length > 350) {
    let cut = entry.description.slice(0, 350);
    const lastPeriod = cut.lastIndexOf(".");
    if (lastPeriod > 150) cut = cut.slice(0, lastPeriod + 1);
    entry.description = cut;
  }

  entry[data.linkType] = data.storeLink;

  if (videoUrl) {
    entry.video = videoUrl;
    entry.type = "video";
    entry.screenshots = [videoUrl, ...screenshotPaths];
  }

  portfolio.push(entry);
  fs.writeFileSync(PORTFOLIO_PATH, JSON.stringify(portfolio, null, 2) + "\n");

  console.log(`\n  Added "${data.title}" as project #${nextId}`);
  console.log(`  Icon:         ${iconPath}`);
  console.log(`  Screenshots:  ${screenshotPaths.length}`);
  console.log(`  Store link:   ${data.storeLink}`);
  console.log(`  View at:      /projects/${nextId - 1}\n`);
}

main().catch((err) => {
  console.error("\n  Fatal error:", err.message);
  process.exit(1);
});

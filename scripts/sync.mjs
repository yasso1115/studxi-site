// Fetches the channel's public RSS feed (no API key needed) and, if YOUTUBE_API_KEY is set,
// enriches with the YouTube Data API v3 (views, duration). Writes data/videos.json.
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
const CHANNEL_ID = 'UC4hgUaf5RYl5Jodw6-Pp7RQ';
const rss = await (await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`)).text();
const pick = (s, re) => (s.match(re) || [])[1] || '';
const dec = (s) => s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
let videos = [...rss.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({
  id: pick(e, /<yt:videoId>(.*?)<\/yt:videoId>/),
  title: dec(pick(e, /<title>(.*?)<\/title>/)),
  published: pick(e, /<published>(.*?)<\/published>/),
  thumb: pick(e, /<media:thumbnail url="(.*?)"/),
  description: dec(pick(e, /<media:description>([\s\S]*?)<\/media:description>/)).slice(0, 300),
  views: Number(pick(e, /<media:statistics views="(\d+)"/)) || null,
}));
const key = process.env.YOUTUBE_API_KEY;
if (key && videos.length) {
  const r = await (await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videos.map(v=>v.id).join(',')}&key=${key}`)).json();
  for (const it of r.items || []) { const v = videos.find(x => x.id === it.id); if (v) { v.views = Number(it.statistics?.viewCount) || v.views; v.duration = it.contentDetails?.duration; } }
}
videos.sort((a, b) => b.published.localeCompare(a.published));
const out = { channelId: CHANNEL_ID, updated: new Date().toISOString(), videos };
const prev = existsSync('data/videos.json') ? JSON.parse(readFileSync('data/videos.json', 'utf8')) : null;
if (!prev || JSON.stringify(prev.videos) !== JSON.stringify(videos)) writeFileSync('data/videos.json', JSON.stringify(out, null, 2));
console.log(`videos: ${videos.length}`);

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
// Push newly appeared videos to OneSignal web-push subscribers (free plan).
const newVids = prev ? videos.filter((v) => !prev.videos.some((p) => p.id === v.id)) : [];
if (newVids.length && process.env.ONESIGNAL_APP_ID && process.env.ONESIGNAL_REST_API_KEY) {
  for (const v of newVids.slice(0, 3)) {
    const r = await fetch('https://api.onesignal.com/notifications', {
      method: 'POST',
      headers: { Authorization: 'Key ' + process.env.ONESIGNAL_REST_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: process.env.ONESIGNAL_APP_ID,
        target_channel: 'push',
        included_segments: ['Subscribed Users'],
        headings: { en: 'STUDXI' },
        contents: { en: '\u0641\u064a\u062f\u064a\u0648 \u062c\u062f\u064a\u062f: ' + v.title },
        url: 'https://yasso1115.github.io/studxi-site/'
      })
    });
    console.log('onesignal:', v.id, r.status);
  }
}
console.log(`videos: ${videos.length}`);

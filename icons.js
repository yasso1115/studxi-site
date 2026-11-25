window.STUDXI_ICONS = (() => {
  const p = {
    play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>',
    ball: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.5l3.8 2.8-1.4 4.4H9.6l-1.4-4.4zM12 7.5V3M15.8 10.3l4.4-1.4M14.4 14.7l2.6 3.6M9.6 14.7l-2.6 3.6M8.2 10.3L3.8 8.9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>',
    news: '<path d="M4 9v6h3l6 4V5L7 9z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 010 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    shirt: '<path d="M8.5 4L3 7l2 4 2-1v10h10V10l2 1 2-4-5.5-3a3.5 3.5 0 01-7 0z" fill="currentColor"/>',
    chat: '<path d="M4 5h16v11H11l-5 4v-4H4z" fill="currentColor"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5" fill="currentColor"/><path d="M4 7.5l8 6 8-6" fill="none" stroke="#000" stroke-opacity=".55" stroke-width="1.6" stroke-linecap="round"/>',
    globe: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    fire: '<path d="M12 3c1 4 5 5.5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3-1-3 0-6 1-9z" fill="currentColor"/>',
    battery: '<rect x="2" y="7" width="18" height="10" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="4.5" y="9.5" width="11" height="5" rx="1.5" fill="currentColor"/><rect x="21" y="10" width="2" height="4" rx="1" fill="currentColor"/>',
    bot: '<rect x="4" y="7" width="16" height="12" rx="4" fill="currentColor"/><circle cx="9" cy="13" r="1.6" fill="#000"/><circle cx="15" cy="13" r="1.6" fill="#000"/><path d="M12 7V4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  };
  return (n, s = 26) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true">${p[n]}</svg>`;
})();

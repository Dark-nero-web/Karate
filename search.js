const globalSearchIndex = [
  { title: "Home", href: "index.html", text: "home start frontpage" },
  { title: "About Karate", href: "index.html#about", text: "karate traditional martial art shotokan okinawa japan" },
  { title: "White Belt (10th Kyu)", href: "index.html", text: "white belt 10th kyu beginner student" },
  { title: "Yellow Belt (9th Kyu)", href: "index.html", text: "yellow belt 9th kyu" },
  { title: "Orange Belt (8th Kyu)", href: "index.html", text: "orange belt 8th kyu" },
  { title: "Green Belt (7th Kyu)", href: "index.html", text: "green belt 7th kyu" },
  { title: "Blue Belt (6th & 5th Kyu)", href: "index.html", text: "blue belt 6th kyu 5th kyu" },
  { title: "Purple Belt (4th Kyu)", href: "index.html", text: "purple belt 4th kyu" },
  { title: "Brown Belt (3rd to 1st Kyu)", href: "index.html", text: "brown belt 3rd 2nd 1st kyu" },
  { title: "Black Belt (Dan Ranks)", href: "index.html", text: "black belt dan ranks master expert" },
  { title: "Uchi Waza (Strikes)", href: "uchi.html", text: "uchi waza strikes shuto uraken empi haito" },
  { title: "Zuki Waza (Punches)", href: "zuki.html", text: "zuki waza punches choku gyaku oi kizami" },
  { title: "Geri Waza (Kicks)", href: "kick.html", text: "geri waza kicks mae mawashi yoko ushiro" },
  { title: "Kata (Forms)", href: "kata.html", text: "kata forms heian shodan nidan sandan yondan godan tekki" },
  { title: "Dachi Waza (Stances)", href: "dachi.html", text: "dachi waza stances zenkutsu kiba kokutsu neko ashi" },
  { title: "Uke Waza (Blocks)", href: "block.html", text: "uke waza blocks age uke soto gedan barai shuto" }
];

function renderGlobalSearch(query) {
  const container = document.getElementById('globalSearchResults');
  if (!container) return;
  const q = query.trim().toLowerCase();

  if (!q) {
    container.innerHTML = '';
    return;
  }

  const matches = globalSearchIndex
    .filter(item => item.text.includes(q) || item.title.toLowerCase().includes(q))
    .slice(0, 10);

  if (matches.length === 0) {
    container.innerHTML = '<p style="color:#ffcc00; padding: 10px; background: rgba(0,0,0,0.8); border-radius: 5px;">No results found.</p>';
    return;
  }

  container.innerHTML = matches
    .map(item => `<a href="${item.href}" style="display:block; color: #fff; background: rgba(0,0,0,0.8); margin-bottom: 5px; padding: 10px; border-radius: 5px; text-decoration:none; border-left: 3px solid rgb(255, 251, 0);">${item.title}</a>`)
    .join('');
}

window.addEventListener('DOMContentLoaded', () => {
  const se = document.getElementById('globalSearchInput');
  if (se) {
    se.addEventListener('input', e => renderGlobalSearch(e.target.value));
  }
});

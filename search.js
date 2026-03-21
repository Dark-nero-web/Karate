/* Unified Global Search Engine */
const globalSearchIndex = [
  { title: "Home", href: "index.html", text: "home start frontpage" },
  { title: "Gallery", href: "gallery.html", text: "photos images karate academy gallery" },
  { title: "Contact Us", href: "contact.html", text: "contact message reach us address phone" },
  { title: "About Karate", href: "index.html#about", text: "karate traditional martial art shotokan okinawa japan" },
  { title: "White Belt (10th Kyu)", href: "index.html#belts", text: "white belt 10th kyu beginner student" },
  { title: "Yellow Belt (9th Kyu)", href: "index.html#belts", text: "yellow belt 9th kyu" },
  { title: "Orange Belt (8th Kyu)", href: "index.html#belts", text: "orange belt 8th kyu" },
  { title: "Green Belt (7th Kyu)", href: "index.html#belts", text: "green belt 7th kyu" },
  { title: "Blue Belt (6th & 5th Kyu)", href: "index.html#belts", text: "blue belt 6th kyu 5th kyu" },
  { title: "Purple Belt (4th Kyu)", href: "index.html#belts", text: "purple belt 4th kyu" },
  { title: "Brown Belt (3rd to 1st Kyu)", href: "index.html#belts", text: "brown belt 3rd 2nd 1st kyu" },
  { title: "Black Belt (Dan Ranks)", href: "index.html#belts", text: "black belt dan ranks master expert" },
  
  // Punches
  { title: "Oi Zuki (Lunge Punch)", href: "zuki.html#oi-zuki", text: "zuki waza punches choku gyaku oi kizami lunge" },
  { title: "Gyaku Zuki (Reverse Punch)", href: "zuki.html#gyaku-zuki", text: "punches reverse gyaku zuki" },
  { title: "Kizami Zuki (Jab)", href: "zuki.html#kizami-zuki", text: "punches jab kizami zuki" },
  
  // Kicks
  { title: "Mae Geri (Front Kick)", href: "kick.html#mae-geri", text: "mae geri front kick geri waza" },
  { title: "Mawashi Geri (Roundhouse Kick)", href: "kick.html#mawashi-geri", text: "mawashi geri roundhouse kick" },
  { title: "Yoko Geri (Side Kick)", href: "kick.html#yoko-geri", text: "yoko geri side kick" },
  
  // Kata
  { title: "Heian Shodan", href: "kata.html#heian-shodan", text: "heian shodan kata form 1" },
  { title: "Heian Nidan", href: "kata.html#heian-nidan", text: "heian nidan kata form 2" },
  { title: "Heian Sandan", href: "kata.html#heian-sandan", text: "heian sandan kata form 3" },
  
  // Blocks
  { title: "Age Uke (Rising Block)", href: "block.html#age-uke", text: "age uke rising block defensive" },
  { title: "Gedan Barai (Downward Block)", href: "block.html#gedan-barai", text: "gedan barai downward block" },
  { title: "Soto Uke (Outside Block)", href: "block.html#soto-uke", text: "soto uke outside block" },
  
  // Strikes
  { title: "Shuto Uchi (Knife Hand Strike)", href: "uchi.html#shuto-uchi", text: "shuto uchi knife hand strike" },
  { title: "Uraken Uchi (Backfist Strike)", href: "uchi.html#uraken-uchi", text: "uraken uchi backfist strike" },
  { title: "Empi Uchi (Elbow Strike)", href: "uchi.html#empi-uchi", text: "empi uchi elbow strike" },
  
  // Stances
  { title: "Zenkutsu Dachi (Front Stance)", href: "dachi.html#zenkutsu-dachi", text: "zenkutsu dachi front stance" },
  { title: "Kokutsu Dachi (Back Stance)", href: "dachi.html#kokutsu-dachi", text: "kokutsu dachi back stance" },
  { title: "Kiba Dachi (Horse Stance)", href: "dachi.html#kiba-dachi", text: "kiba dachi horse stance" }
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
    .map(item => `<a href="${item.href}" style="display:block; color: #fff; background: rgba(0,0,0,0.8); margin-bottom: 5px; padding: 10px; border-radius: 5px; text-decoration:none; border-left: 3px solid var(--primary-color);">${item.title}</a>`)
    .join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const se = document.getElementById('globalSearchInput');
  if (se) {
    se.addEventListener('input', e => renderGlobalSearch(e.target.value));
  }
});

// Floating Karate Kanji Background
(function () {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');

  let width, height;
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // "Karate Do", "Bushido", "Peace", "Harmony", "Power", "Courage", "Patience"
  const characters = '空手道武士道平和調和力勇気忍耐'.split('');
  const particles = [];

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      char: characters[Math.floor(Math.random() * characters.length)],
      size: Math.random() * 30 + 15,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: (Math.random() - 0.5) * 1.5,
      opacity: Math.random() * 0.4 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Fill background with solid black to ensure it is deep black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around screen
      if (p.x < -100) p.x = width + 50;
      if (p.x > width + 50) p.x = -100;
      if (p.y < -100) p.y = height + 50;
      if (p.y > height + 50) p.y = -100;

      // Grayish-white and slightly red kanji
      ctx.fillStyle = `rgba(180, 180, 180, ${p.opacity})`;
      if (Math.random() > 0.95) {
        ctx.fillStyle = `rgba(255, 50, 50, ${p.opacity})`; // occasional red elements
      }
      ctx.font = `${p.size}px "Yu Gothic", "Meiryo", "Arial"`;
      ctx.fillText(p.char, p.x, p.y);
    });
    requestAnimationFrame(draw);
  }
  draw();

  // Load Global Footer Script dynamically
  const footerScript = document.createElement('script');
  footerScript.src = 'footer.js';
  document.body.appendChild(footerScript);
})();

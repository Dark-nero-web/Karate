(function () {
    // Apply theme BEFORE rendering to prevent flash
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const headerHTML = `
    <header style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; min-height: 180px; position: relative;">
        <div style="position: absolute; left: 35px; top: 20px; z-index: 10; display: flex; gap: 10px; align-items: center;">
            <button onclick="toggleDevModal && toggleDevModal()" style="background:var(--primary-color); border:none; padding:8px 15px; border-radius:5px; color:#000; font-weight:bold; cursor:pointer; font-family:'Outfit', sans-serif; box-shadow: 0 0 10px rgba(0,0,0,0.5);">Meet the Developer</button>
            <button id="themeToggleBtn" onclick="toggleTheme()" class="theme-toggle-btn" title="Toggle Dark/Light Mode">🌙</button>
        </div>
        
        <h2 style="margin: 0; order: 1; letter-spacing: 2px; font-size: 1.8rem; text-transform: uppercase; color: var(--primary-color); z-index: 5;">Shotokan  Karate  Academy</h2>
        
        <a href="index.html" style="order: 2; z-index: 5;">
            <img src="img/logo.jpeg" alt="Shotokan Karate Academy Logo" style="width: 90px;">
        </a>
        
        <div class="header-auth" style="position: absolute; right: 35px; top: 20px; z-index: 10;">
            <button id="headerLoginBtn" class="login-btn" style="padding: 8px 16px; width: auto;">Login</button>
        </div>
    </header>

    <nav id="mainNav">
        <a href="index.html">Home</a>
        <a href="gallery.html">Gallery</a>
        <a href="syllabus.html">Syllabus</a>
        <a href="zuki.html">ZUKI</a>
        <a href="block.html">BLOCK</a>
        <a href="dachi.html">DACHI</a>
        <a href="kata.html">KATA</a>
        <a href="kick.html">KICK</a>
        <a href="uchi.html">UCHI</a>
        <a href="task.html">TASK</a>
        <a href="contact.html">CONTACT</a>
    </nav>
    
    `;

    const extraStyles = `
    <style>
        .header-auth .login-btn {
            background: var(--primary-color);
            color: #000;
            border: none;
            border-radius: 4px;
            font-weight: 700;
            cursor: pointer;
            transition: 0.3s;
        }
        .header-auth img.profile-avatar {
            width: 40px; 
            height: 40px; 
            border-radius: 50%; 
            border: 2px solid var(--primary-color);
            cursor: pointer;
        }
        .theme-toggle-btn {
            background: var(--card-bg);
            border: 2px solid var(--primary-color);
            border-radius: 50%;
            width: 38px;
            height: 38px;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }
        .theme-toggle-btn:hover {
            transform: scale(1.15) rotate(20deg);
            box-shadow: 0 0 15px var(--primary-color);
        }
    </style>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', headerHTML + extraStyles);

    // Update theme toggle icon
    function updateThemeIcon() {
        const btn = document.getElementById('themeToggleBtn');
        if (btn) {
            const current = document.documentElement.getAttribute('data-theme');
            btn.textContent = current === 'dark' ? '☀️' : '🌙';
        }
    }
    updateThemeIcon();

    // Global theme toggle function
    window.toggleTheme = function () {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon();
    };

    // Highlight the current page's nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('#mainNav a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.style.color = 'var(--primary-color)';
            link.style.fontWeight = '800';
        }
    });

    // Profile & Login Button Logic
    async function updateAuthUI() {
        const loginBtn = document.getElementById('headerLoginBtn');
        if (!loginBtn) return;

        const currentUser = localStorage.getItem('currentUser');

        if (currentUser) {
            try {
                const res = await fetch('/api/profile/' + currentUser);
                const data = await res.json();

                if (data.success) {
                    const avatarSrc = data.user.profileImage || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>";

                    let adminLinkHTML = "";
                    if (data.user.username === 'admin') {
                        adminLinkHTML = `<a href="admin.html" style="color:var(--primary-color); font-weight:bold; margin-right:15px; text-decoration:none;">ADMIN</a>`;
                    }

                    loginBtn.parentElement.innerHTML = `
                        ${adminLinkHTML}
                        <img src="${avatarSrc}" class="profile-avatar" title="View Profile" onclick="window.location.href='profile.html'">
                    `;
                    return;
                }
            } catch (e) {
                console.error("Profile fetch failed:", e);
            }
        }

        loginBtn.onclick = () => window.location.href = 'login.html';
    }

    updateAuthUI();
})();

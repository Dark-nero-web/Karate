(function () {
    const footerHTML = `
    <style>
        .site-footer {
            background-color: #111;
            color: #fff;
            padding: 40px 20px 20px;
            text-align: center;
            border-top: 3px solid rgb(238, 136, 3);
            margin-top: 40px;
            position: relative;
            z-index: 10;
        }
        .footer-content {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            max-width: 1200px;
            margin: 0 auto;
        }
        .footer-section {
            flex: 1;
            min-width: 250px;
            margin-bottom: 20px;
        }
        .footer-section h3 {
            color: rgb(238, 136, 3);
            margin-bottom: 15px;
            font-size: 20px;
        }
        .footer-section a {
            color: #ccc;
            text-decoration: none;
            display: block;
            margin-bottom: 8px;
            transition: color 0.3s;
            font-size: 15px;
        }
        .footer-section a:hover {
            color: rgb(238, 136, 3);
        }
        .footer-section p {
            color: #bbb;
            font-size: 15px;
            line-height: 1.6;
        }
        .footer-bottom {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #333;
            font-size: 14px;
            color: #777;
        }
        .social-icons a {
            display: inline-block;
            margin: 0 10px;
            font-size: 22px;
            color: #aaa;
        }
        .social-icons a:hover {
            color: #fff;
        }
    </style>
    <footer class="site-footer">
        <div class="footer-content">
            <div class="footer-section">
                <h3>Karate Academy</h3>
                <p>Master the art of Shotokan Karate.<br>Discipline, respect, and physical fitness for all ages.</p>
            </div>
        <div class="footer-section">
            &copy; 2026 Karate Academy. All Rights Reserved. Built with Discipline.
            <div style="margin-top:15px;">
                <button onclick="toggleDevModal()" style="background:var(--primary-color); border:none; padding:8px 15px; border-radius:5px; color:#000; font-weight:bold; cursor:pointer;">Meet the Developer</button>
            </div>
            <p style="margin-top:10px;">Sasidu Rashmika - Black Belt 1st Dan</p>
            <p>@powered by Rashmika Tec</p>
        </div>
         <div class="footer-section">
                <h3>Quick Links</h3>
                <a href="index.html">Home</a>
                <a href="gallery.html">Gallery</a>
                <a href="profile.html">My Profile</a>
                <a href="admin.html" id="footerAdminLink" style="display:none;font-weight:bold;color:#ffaa00;">Admin Dashboard</a>
        </div>
    </footer>

    <!-- Developer Modal -->
    <div id="devModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:9999; justify-content:center; align-items:center; backdrop-filter:blur(10px);">
        <div style="background:rgba(26,26,26,0.8); padding:40px; border-radius:20px; border:1px solid #ffaa00; max-width:400px; text-align:center; position:relative; box-shadow:0 0 30px rgba(255,170,0,0.3);">
            <button onclick="toggleDevModal()" style="position:absolute; top:15px; right:15px; background:none; border:none; color:#fff; font-size:24px; cursor:pointer;">&times;</button>
            <img src="https://th.bing.com/th/id/OIP.1d0fE6Jo9rHwdT4vJPWxQgHaEy?o=7rm=3&rs=1&pid=ImgDetMain" style="width:120px; height:120px; border-radius:50%; border:3px solid #ffaa00; object-fit:cover; margin-bottom:20px;">
            <h2 style="color:#ffaa00; margin-bottom:10px;">Sasidu Rashmika</h2>
            <p style="color:#fff; font-size:1.1rem; margin-bottom:5px;">Full Stack Developer</p>
            <p style="color:#aaa; font-size:0.9rem; margin-bottom:20px;">Sasidu Rashmika - Black Belt 1st Dan & Tech Enthusiast</p>
            <div class="social-icons">
                <a href="#">🌐</a>
                <a href="#">💻</a>
                <a href="#">📩</a>
            </div>
        </div>
    </div>
    `;

    // Global Modal Toggle Function
    window.toggleDevModal = function () {
        const m = document.getElementById('devModal');
        if (m) {
            m.style.display = (m.style.display === 'flex') ? 'none' : 'flex';
        }
    };

    // Insert footer right before the closing body tag
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // Show admin link if logged in as admin
    (async function checkAdmin() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            try {
                const res = await fetch('/api/profile/' + currentUser);
                const data = await res.json();
                if (data.success && data.user.username === 'admin') {
                    const adminLnk = document.getElementById('footerAdminLink');
                    if (adminLnk) adminLnk.style.display = 'block';
                }
            } catch (e) { console.error(e); }
        }
    })();
})();

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
                <h3>Quick Links</h3>
                <a href="index.html">Home</a>
                <a href="gallery.html">Gallery</a>
                <a href="profile.html">My Profile</a>
                <a href="admin.html" id="footerAdminLink" style="display:none;font-weight:bold;color:#ffaa00;">Admin Dashboard</a>
            </div>
            <div class="footer-section">
                <h3>Connect With Us</h3>
                <div class="social-icons">
                    <a href="#">💻</a>
                    <a href="#">📸</a>
                    <a href="#">🌍</a>
                    <a href="#">☎️</a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            &copy; 2026 Karate Academy. All Rights Reserved. Built with Discipline.
            <p>Sasidu Rashmika - Black Belt 1st Dan</p>
            <p>@powered by Rashmika Tec</p>
        </div>
    </footer>
    `;

    // Insert footer right before the closing body tag
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // Show admin link if logged in as admin
    setTimeout(() => {
        if (localStorage.getItem('currentUser') === 'admin') {
            const adminLnk = document.getElementById('footerAdminLink');
            if (adminLnk) adminLnk.style.display = 'block';
        }
    }, 300);
})();

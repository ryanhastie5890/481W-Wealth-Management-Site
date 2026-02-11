// client side sessions

/*
*   session message from server
*/ 
fetch('api/session/sessionMessage')
  .then(res => res.text())
  .then(msg => {
    if (msg) {
      document.getElementById('message').innerText = msg;
    }
  });

/*
*   session info (user info & logout)
*/ 
// fetch('api/session/getSession')
//   .then(res => res.json())
//   .then(data => {
//     if (data.loggedIn) {
//       const userInfo = document.getElementById('user-info');
//       if (userInfo) {
//         userInfo.innerText = data.email;
//       }
//     }
//   });

/*
*   session info (user info & logout)
*/ 
fetch('/api/session/getSession')
  .then(res => res.json())
  .then(data => {
    if (!data.loggedIn) return;

    const userInfo = document.getElementById('user-info');
    if (!userInfo) return;

    userInfo.innerHTML = `
      <span id="user-email" style="cursor:pointer;">
        ${data.email} ▾
      </span>
      <div id="logout-menu"
        style="
          display:none;
          position:absolute;
          right:0;
          margin-top:5px;
          background:#222;
          border:1px solid #444;
          padding:5px;
          z-index:1000;
        ">
        <div id="logout-btn" style="cursor:pointer;">Logout</div>
      </div>
    `;

    const email = document.getElementById('user-email');
    const menu = document.getElementById('logout-menu');
    const logoutButton = document.getElementById('logout-btn');

    // toggle dropdown from user-info
    email.onclick = (e) => {
      e.stopPropagation();
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    };

    // log user out on button click
    logoutButton.onclick = async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/index.html';
    };

    document.addEventListener('click', () => {
      menu.style.display = 'none';
    });
  });
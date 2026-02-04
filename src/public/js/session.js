// client side sessions

fetch('api/session/sessionMessage')
  .then(res => res.text())
  .then(msg => {
    if (msg) {
      document.getElementById('message').innerText = msg;
    }
  });

fetch('api/session/getSession')
  .then(res => res.json())
  .then(data => {
    if (data.loggedIn) {
      const userInfo = document.getElementById('user-info');
      if (userInfo) {
        userInfo.innerText = data.email;
      }
    }
  });
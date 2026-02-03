// client side sessions

fetch('/message')
  .then(res => res.text())
  .then(msg => {
    if (msg) {
      document.getElementById('message').innerText = msg;
    }
  });

fetch('/session')
  .then(res => res.json())
  .then(data => {
    if (data.loggedIn) {
      const userInfo = document.getElementById('user-info');
      if (userInfo) {
        userInfo.innerText = data.email;
      }
    }
  });
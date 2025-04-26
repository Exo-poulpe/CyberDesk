    let bruteTargetPassword = '';

    function launchBruteForce() {
      const ip = document.getElementById("targetIp").value.trim();
      const emailInput = document.getElementById("username").value.trim(); // realEmail as input
      const status = document.getElementById("status");
      const grid = document.getElementById("bruteGrid").children;
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

      const machine = machines[ip];
      if (!machine) {
        status.innerHTML = `<span style='color:red'>Target not found.</span>`;
        return;
      }

      // Search for the correct user in the machine based on realEmail
      let matchedUser = null;
      for (const username in machine.users) {
        const user = machine.users[username];
        if (user.realEmail === emailInput) {
          matchedUser = { ...user, username };
          break;
        }
      }

      if (!matchedUser) {
        // Simulated brute force failed
        let currentTry = 0;
        const fakeAttempts = 40;
        status.innerText = `Status: Cracking password for ${emailInput}@${ip}...`;

        const interval = setInterval(() => {
          for (let i = 0; i < grid.length; i++) {
            grid[i].innerText = charset[Math.floor(Math.random() * charset.length)];
          }
          currentTry++;
          if (currentTry >= fakeAttempts) {
            clearInterval(interval);
            status.innerHTML = `<span style='color:red'>Status: Failed - Email or password not found.</span>`;
          }
        }, 150);
        return;
      }

      const password = matchedUser.password;
      bruteTargetPassword = password;

      const attempts = Math.floor(Math.random() * 60) + 30;
      let currentTry = 0;

      status.innerText = `Status: Cracking password for ${emailInput} on ${ip}...`;

      const interval = setInterval(() => {
        for (let i = 0; i < grid.length; i++) {
          grid[i].innerText = charset[Math.floor(Math.random() * charset.length)];
        }
        currentTry++;
        if (currentTry >= attempts) {
          clearInterval(interval);
          for (let i = 0; i < grid.length; i++) {
            grid[i].innerText = password[i] || '';
          }
          status.innerHTML = `<span style="color:#00ff00">Status: Success - Password found</span><br><span>User: <strong>${matchedUser.username}</strong></span><br><span>Password: "<strong>${password}</strong>"</span>`;
        }
      }, 150);
    }





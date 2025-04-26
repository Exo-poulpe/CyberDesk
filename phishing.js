    function updatePhishPreview() {
      const template = document.getElementById("phishTemplate").value;
      const preview = document.getElementById("phishPreview");

      const links = {
        facebook: "http://secure-facebook-login.com",
        google: "http://login-google-check.com",
        microsoft: "http://microsoft-auth-verify.com",
        linkedin: "http://linkedin-access-center.com"
      };

      const messages = {
        facebook: `Hi,\nPlease reconnect to Facebook for security reasons.\n\n👉 ${links.facebook}`,
        google: `Hello,\nYour Google account requires verification. Please sign in again.\n\n👉 ${links.google}`,
        microsoft: `Microsoft Security Alert: Please confirm your password.\n\n👉 ${links.microsoft}`,
        linkedin: `LinkedIn: You have a new message. Log in to read it.\n\n👉 ${links.linkedin}`
      };


      preview.innerText = messages[template] || '';
    }


    function launchPhishing() {
      const targetEmail = document.getElementById("phishEmail").value.trim();
      const emailBtn = document.getElementById("emailPhishingBtn");
    
      let found = null;
    
      // Check if email is valid target
      for (const ip in machines) {
        const machine = machines[ip];
        for (const username in machine.users) {
          const user = machine.users[username];
          if (user.phishingAlias === targetEmail) {
            found = {
              realEmail: user.realEmail,
              ip,
              username,
              password: user.password
            };
            break;
          }
        }
        if (found) break;
      }
    
      if (!found) {
        openPhishResult("[FAILED] Invalid target email");
        return;
      }
    
      // Step 1 phishing success: fake email + fake password
      simulatePhishingPopup("Creating fake login page...", () => {
        openPhishResult(targetEmail, "fakepass123"); // Only fake data
        // Enable verification phishing
        emailBtn.disabled = false;
        emailBtn.style.cursor = "pointer";
        emailBtn.dataset.validTarget = JSON.stringify(found); // store info for step 2
      });
    }
    



    function launchEmailPhishing() {
      const btn = document.getElementById("emailPhishingBtn");
      if (!btn.dataset.validTarget) {
        openPhishResult("[ERROR] No phishing session available.");
        return;
      }
    
      const found = JSON.parse(btn.dataset.validTarget);
    
      simulatePhishingPopup("Sending verification email...", () => {
        openPhishResult(found.realEmail, null, found);
      });
    }
    


    function simulatePhishingPopup(message, callback) {
      const popup = document.createElement('div');
      popup.className = 'file-popup';
      popup.innerHTML = `
        <div class="file-popup-header" onmousedown="startDrag(event, this.closest('.file-popup'))">
          Phishing Operation
          <span style="cursor:pointer; color:#ef5350;" onclick="this.closest('.file-popup').remove()">✖</span>
        </div>
        <div class="file-popup-body" id="phishingLoading">
          ${message}<br><br>
        </div>
      `;
      document.body.appendChild(popup);

      // Simulate the different steps
      setTimeout(() => {
        const loadingDiv = document.getElementById("phishingLoading");
        loadingDiv.innerHTML = `✅ Fake page created<br>✉️ Email sent to target...<br><br><span style="font-style:italic;">Waiting for victim to enter credentials...</span>`;

        // Additional waiting before displaying the results
        setTimeout(() => {
          popup.remove();
          callback();
        }, 3000);
      }, 2500);
    }


    function openPhishResult(email, password, creds = null) {
      const popup = document.createElement('div');
      popup.className = 'file-popup';
    
      let body = '';
    
      if (password) {
        // Step 1: Fake login
        body = `Email: ${email}<br>Password: ${password}`;
      } else if (creds) {
        // Step 2: Verification phishing
        body = `Email: ${email}<br><br><strong>Remote Access:</strong><br>IP: ${creds.ip}<br>`;
      } else {
        body = `Issue: ${email}`;
      }
    
      popup.innerHTML = `
        <div class="file-popup-header" onmousedown="startDrag(event, this.closest('.file-popup'))">
          Phishing Result
          <span style="cursor:pointer; color:#ef5350;" onclick="this.closest('.file-popup').remove()">✖</span>
        </div>
        <div class="file-popup-body">${body}</div>
        <button onclick="this.closest('.file-popup').remove()">Close</button>
      `;
    
      document.body.appendChild(popup);
    }
    




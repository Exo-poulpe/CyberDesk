    function launchDecryptor() {
      const output = document.getElementById("decryptOutput");
      const status = document.getElementById("decryptStatus");
      const fileName = document.getElementById("decryptFile").value.trim();
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let password = null;

      // Search for the password of the .crypt file
      for (const ip in machines) {
        const machine = machines[ip];
        for (const path in machine.files) {
          if (path.endsWith(fileName) && fileName.endsWith(".crypt")) {
            const file = machine.files[path];
            if (file.password) {
              password = file.password;
            }
          }
        }
      }

      const attempts = Math.floor(Math.random() * 60) + 30;
      let currentTry = 0;

      output.innerText = "Starting cracking process...\n";
      status.innerText = "Status: Cracking...";

      const interval = setInterval(() => {
        let attempt = '';
        for (let i = 0; i < Math.floor(Math.random() * 10) + 5; i++) {
          attempt += charset[Math.floor(Math.random() * charset.length)];
        }
        output.innerText += `[TRY] ${attempt}\n`;
        output.scrollTop = output.scrollHeight;
        currentTry++;

        if (currentTry >= attempts) {
          clearInterval(interval);
          if (password) {
            output.innerText += `\n[SUCCESS] Password found: ${password}`;
            status.innerHTML = `<span style='color:#00ff00'>Status: Success - Password found<br></span><span>Password: "<strong>${password}</strong>"</span>`;
            document.getElementById("openDecryptedBtn").style.display = "inline-block";
          }
          else {
            output.innerText += `\n[FAILED] No password found for this file.`;
            status.innerHTML = `<span style='color:red'>Status: Failed - File unknown or missing password.</span>`;
          }
        }
      }, 100);
    }


    function openDecryptedFile() {
      const fileName = document.getElementById("decryptFile").value.trim();
      let foundFile = null;

      for (const ip in machines) {
        const machine = machines[ip];
        for (const path in machine.files) {
          if (path.endsWith(fileName) && fileName.endsWith('.crypt')) {
            foundFile = machine.files[path];
            break;
          }
        }
        if (foundFile) break;
      }

      if (!foundFile) return;

      const popup = document.createElement('div');
      popup.className = 'file-popup';
      popup.innerHTML = `<div class="file-popup-header" onmousedown="startDrag(event, this.closest('.file-popup'))">
    Decryption Successful - ${fileName}
    <span style="cursor:pointer; color:#ef5350;" onclick="this.closest('.file-popup').remove()">✖</span>
  </div>
  <div class="file-popup-body">${foundFile.decryptedContent || '[EMPTY FILE]'}</div>
  <button onclick="this.closest('.file-popup').remove()">Close</button>`;
      document.body.appendChild(popup);
    }

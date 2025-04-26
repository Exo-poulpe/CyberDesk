let highestZIndex = 1000;
const machines = {
  '192.168.1.42': {
    os: 'Windows',
    osVersion: 10,
    RemoteControlEnabled: false,
    users: {
      'alice': {
        password: 'admin42',
        role: 'user',
        phishingAlias: 'alice@gmail.com',
        realEmail: 'alice.carpenter@outlook.com'
      },
      'admin': {
        password: 'superpasswordforadmin',
        role: 'admin',
        phishingAlias: '',
        realEmail: ''
      }
    },
    files: {
      'C:/Users/alice/notes.txt': {
        content: 'Note: Remember to change the WiFi password.',
        role: 'user'
      },
      'C:/Users/alice/encrypted_backup.crypt': {
        content: '[ENCRYPTED FILE] Encrypted contents - Use Decryptor.',
        role: 'user',
        password: 'backuppassword42',
        decryptedContent: '🔓 Admin password note: "superpasswordforadmin"'
      },
      'C:/Admin/Bank/Account/Configuration.txt': {
        content: 'Your BANK Account is activate only on your Smartphone',
        role: 'admin'
      },
      'C:/Admin/AppData/Firefox/Profile': {
        content: 'Configuration : HSTS, HTTPS Enabled',
        role: 'admin'
      },
      'C:/Windows/System32/cmd.exe': {
        content: 'Binary executable file - restricted access',
        role: 'admin'
      },
      'C:/Windows/Program Files/Microsoft/Edge.exe': {
        content: 'Edge browser executable',
        role: 'admin'
      },
      'C:/Windows/Program Files/Defender/defender.exe': {
        content: 'Microsoft Defender',
        role: 'admin'
      },
      'C:/Windows/Logs/system.log': {
        content: '[LOG] System boot at 08:42:11\n[LOG] Update installed: KB5005565',
        role: 'admin'
      },
      'C:/Temp/debug.log': {
        content: 'Debug initialized...\nNo errors found.',
        role: 'user'
      },
      'C:/Documents/confidential.docx': {
        content: 'Confidential document - Do not distribute',
        role: 'admin'
      }
    }

  },
  '192.168.1.242': {
    os: 'Android',
    osVersion: 13,
    RemoteControlEnabled: false,
    model: 'Pixel 7',
    users: {
      "alice": {
        password: '847247',
        role: 'user',
        phishingAlias: '',
        realEmail: ''
      }
    },
    files: {
      '/sdcard/Download/statement.pdf': {
        content: '[PDF] Bank statement…',
        role: 'user'
      },
      '/sdcard/DCIM/Camera/IMG_001.jpg': {
        content: '[JPEG] Holiday photo',
        role: 'user'
      }
    },
  },
  '192.168.1.1': {
    os: 'Linux (Debian)',
    osVersion: 12,
    RemoteControlEnabled: false,
    users: {
      "root": {
        password: 'ubuntu',
        role: 'admin',
        phishingAlias: '',
        realEmail: ''
      }
    },
  },
};






function connectMobile() {
  const ip = document.getElementById("mobileIp").value.trim();
  const status = document.getElementById("mobileConnectStatus");

  /* 1) IP connue ? */
  const target = machines[ip];
  if (!target) {
    status.innerHTML = `<span style="color:red">Host ${ip} unreachable</span>`;
    return;
  }

  /* 2) Est-ce bien un mobile Android ? */
  if (target.os.toLowerCase() !== 'Android'.toLowerCase()) {
    status.innerHTML =
      `<span style="color:red">Host ${ip} is not a mobile device</span>`;
    return;
  }

  if (target.ADB_enabled === false) {
    status.innerHTML =
      `<span style="color:red">Host ${ip} Android ADB not enabled use "Pegasus" first</span>`;
    return;
  }

  /* 3) Connexion OK */
  status.textContent = `Connecting to ${ip}…`;
  setTimeout(() => {
    status.innerHTML = "<span style='color:#00ff00'>Connected ✔</span>";

    const win = document.getElementById("mobileControlWindow");   // fenêtre elle-même
    win.style.width = "420px";   // 360 (téléphone) + marges
    win.style.height = "820px";   // 720 + header/barre 

    document.getElementById("mobileConnectForm").style.display = "none";
    document.getElementById("mobileIframeBox").style.display = "block";
    document.getElementById("mobileIframe").src =
      `mobile_control.html?ip=${encodeURIComponent(ip)}`;
  }, 1000);
}






function openWindow(id) {
  const win = document.getElementById(id);
  win.style.display = 'flex';
  bringToFront(win);
}

function closeWindow(id) {
  document.getElementById(id).style.display = 'none';
}


function bringToFront(windowElement) {
  highestZIndex++;
  windowElement.style.zIndex = highestZIndex;
}


let dragWindow = null;
let offsetX = 0;
let offsetY = 0;

function startDrag(e, id) {
  if (typeof id === 'string') {
    dragWindow = document.getElementById(id);
  } else {
    dragWindow = id; // Supports dynamic windows such as .file-popup
  }
  offsetX = e.clientX - dragWindow.offsetLeft;
  offsetY = e.clientY - dragWindow.offsetTop;
  bringToFront(dragWindow); // Ajoute cette ligne pour ramener devant
  document.onmousemove = drag;
  document.onmouseup = stopDrag;
}


function drag(e) {
  if (dragWindow) {
    dragWindow.style.left = (e.clientX - offsetX) + 'px';
    dragWindow.style.top = (e.clientY - offsetY) + 'px';
  }
}

function stopDrag() {
  dragWindow = null;
  document.onmousemove = null;
  document.onmouseup = null;
}

function updateClockAndUptime() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString();

  const uptime = Math.floor(performance.now() / 1000);
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  document.getElementById("uptime").textContent = `${hours}h ${minutes.toString().padStart(2, '0')}m`;
}

function updateCpuSim() {
  const usage = Math.floor(Math.random() * 100);
  document.getElementById("cpuProgress").value = usage;
}

setInterval(updateClockAndUptime, 1000);
setInterval(updateCpuSim, 2000);
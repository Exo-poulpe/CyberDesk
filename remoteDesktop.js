let currentRemote = null;


function getRootPath(machine) {
  return machine.os.toLowerCase().startsWith("windows") ? "C:/" : "/";
}


function connectRemote() {
  const ip = document.getElementById('remoteIp').value.trim();
  const dbg = document.getElementById('quickAccess').checked;   // même case qu’avant
  const out = document.getElementById('remoteContent');

  out.innerHTML = `Connecting to ${ip}…`;

  setTimeout(() => {
    const m = machines[ip];
    if (!m) { out.innerHTML = `<p style='color:red;'>Host unreachable.</p>`; return; }

    const root = getRootPath(m);   // ← calculé une seule fois

    /* ---------- Debug / back-door ---------- */
    if (dbg) {
      if (!m.RemoteControlEnabled) {
        out.innerHTML = `<p style='color:red;'>Debug port inactive on host.</p>`;
        return;
      }
      currentRemote = m;
      out.innerHTML = `<p>Connected (token) to ${ip}</p>
                       <div id="fileExplorer" class="file-explorer"></div>`;
      renderExplorer(m, "admin", root, document.getElementById("fileExplorer"), root);   // ← root OK
      return;
    }

    /* ---------- Auth classique ---------- */
    const usr = document.getElementById('remoteUser').value.trim();
    const pwd = document.getElementById('remotePass').value;
    const u = m.users[usr];

    if (!u || u.password !== pwd) {
      out.innerHTML = `<p style='color:red;'>Invalid credentials.</p>`;
      return;
    }

    currentRemote = m;
    out.innerHTML = `<p>Connected to ${ip} as ${usr} (${u.role})</p>
                     <div id="fileExplorer" class="file-explorer"></div>`;
    renderExplorer(m, u.role, root, document.getElementById("fileExplorer"), root);
  }, 800);
}

function renderExplorer(machine, role, currentPath, cont, rootPath = getRootPath(machine)) {
  cont.innerHTML = '';

  /* --- entête --- */
  const header = document.createElement('div'); header.className = 'explorer-header';
  const pathDisp = document.createElement('div'); pathDisp.className = 'explorer-path'; pathDisp.textContent = currentPath;
  const back = document.createElement('button'); back.textContent = '⬅️ Back';
  back.onclick = () => {                       // → passe rootPath
    const p = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
    const i = p.lastIndexOf('/');
    if (i >= 0) renderExplorer(machine, role, p.slice(0, i + 1), cont, rootPath);
  };
  if (currentPath === rootPath) back.disabled = true;
  header.append(pathDisp, back);
  cont.appendChild(header);

  /* --- contenu --- */
  const folders = new Set(), files = [];
  for (const [path, file] of Object.entries(machine.files)) {
    if (!path.startsWith(currentPath)) continue;
    const rel = path.slice(currentPath.length);
    if (rel.includes('/')) folders.add(rel.split('/')[0]);
    else files.push({ name: rel, fullPath: path, role: file.role });
  }

  folders.forEach(f => {
    const d = document.createElement('div');
    d.className = 'file-item'; d.innerHTML = `📁 ${f}`;
    d.onclick = () => renderExplorer(machine, role, currentPath + f + '/', cont, rootPath);  // rootPath transmis
    cont.appendChild(d);
  });

  files.forEach(file => {
    const allowed = (role === "admin") || (role === file.role);   // ← admin voit tout
    const d = document.createElement('div');
    d.className = 'file-item';
    d.innerHTML = (allowed ? '📄' : '❌') + ' ' + file.name;

    if (allowed) {
      d.onclick = () => {
        openFilePopup(file.fullPath);
        if (file.name.endsWith('.crypt')) simulateDownloadForDecryption(file.name);
      };
    } else {
      d.classList.add('locked');
    }
    cont.appendChild(d);
  });

}


function simulateDownload(filePath) {
  const fileName = filePath.split('/').pop();

  const popup = document.createElement('div');
  popup.className = 'file-popup';
  popup.innerHTML = `
      <div class="file-popup-header" onmousedown="startDrag(event, this.closest('.file-popup'))">
        Download
        <span style="cursor:pointer; color:#ef5350;" onclick="this.closest('.file-popup').remove()">✖</span>
      </div>
      <div class="file-popup-body">
        🔐 Downloading file <strong>"${fileName}"</strong>...<br><br>
        You can now open it in the "Decryptor" tool.
      </div>
      <button onclick="this.closest('.file-popup').remove()">Close</button>
    `;
  document.body.appendChild(popup);
}



function openFilePopup(path) {
  if (!currentRemote) { return; }
  const file = currentRemote.files[path];
  const popup = document.createElement('div');
  popup.className = 'file-popup';

  const isEncrypted = path.endsWith('.crypt');

  popup.innerHTML = `
    <div class="file-popup-header" onmousedown="startDrag(event, this.closest('.file-popup'))">
      ${path}
      <span style="cursor:pointer;color:#ef5350;" onclick="this.closest('.file-popup').remove()">✖</span>
    </div>
    <div class="file-popup-body">${file.content}</div>
    ${isEncrypted ? `<button onclick="simulateDownload('${path}')">📥 Download</button>` : ''}
    <button onclick="this.closest('.file-popup').remove()">Close</button>
  `;
  document.body.appendChild(popup);
}



function toggleAuthFields() {
  const fast = document.getElementById("quickAccess").checked;
  document.getElementById("authFields").style.display = fast ? "none" : "block";
}
toggleAuthFields();   // initialise l’affichage

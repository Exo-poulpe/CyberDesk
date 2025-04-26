/* ---------- Pegasus RCE -------------- */
const exploitDB = {
    dirtycow: { os: "linux", patchedFrom: 13 },   // noyau ≥ 4.8 ≈ Debian 13
    stagefright: { os: "android", patchedFrom: 14 },   // Android 14 corrigé
    sockpuppet: { os: "ios", patchedFrom: 12.4 },   // iOS >= 12.4
    bluekeep: { os: "windows", patchedFrom: 10 }    // Windows ≥ 10
};

function launchPegasus() {
    const ip = document.getElementById("pegasusIp").value.trim();
    const id = document.getElementById("pegasusExploit").value;
    const stat = document.getElementById("pegasusStatus");

    const host = machines[ip];
    const exp = exploitDB[id];

    if (!host) {
        stat.innerHTML = `<span style="color:red">Host ${ip} unreachable</span>`;
        return;
    }

    /* 1) OS incompatible ? */
    if (host.os.toLowerCase().indexOf(exp.os) === -1) {          // tolère "Windows 10", "Linux (Debian)"…
        stat.innerHTML = `<span style="color:red">Exploit incompatible : ${host.os}</span>`;
        return;
    }

    /* 2) Système déjà patché ? (absent ⇒ on tente) */
    const v = parseFloat(host.osVersion);
    if (!isNaN(v) && v >= exp.patchedFrom) {
        stat.innerHTML = `<span style="color:red">${host.os} v${host.osVersion} already patched</span>`;
        return;
    }

    /* -------- déroulé visuel -------- */
    stat.textContent = "1/3 : Connecting to kernel network stack…";
    setTimeout(() => {
        stat.textContent = "2/3 : Executing shellcode (" + id + ")…";
        setTimeout(() => {
            stat.textContent = "3/3 : Activating remote control… 0x"+Math.floor(Math.random()*10000);
            setTimeout(() => {
                stat.innerHTML = `<span style="color:#00ff00">✓ ${id} success – remote access enabled</span>`;
                host.RemoteControlEnabled = true;   // back-door active
            }, 1000);
        }, 1200);
    }, 1000);
}

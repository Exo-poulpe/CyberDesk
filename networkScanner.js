/* ----------  Net Scanner ---------- */
const osIcons = {
    windows : "https://cdn-icons-png.flaticon.com/512/882/882702.png",
    android : "https://cdn-icons-png.flaticon.com/512/174/174836.png",
    linux   : "https://cdn-icons-png.flaticon.com/512/6124/6124995.png",
    unknown : "https://cdn-icons-png.flaticon.com/512/565/565547.png"
  };
  
  function connectScanner(){
    const ip   = document.getElementById("netIp").value.trim();
    const user = document.getElementById("netUser").value.trim();
    const pass = document.getElementById("netPass").value;
    const stat = document.getElementById("netStatus");
  
    const host = machines[ip];
    if(!host){ stat.innerHTML=`<span style="color:red">Host not found</span>`; return; }
  
    const u = host.users[user];
    if(!u || u.role!=="admin" || u.password!==pass){
      stat.innerHTML=`<span style="color:red">Invalid admin credentials</span>`; return;
    }
  
    /* succès */
    stat.innerHTML=`<span style="color:#00ff00">Connected ✔</span>`;
    document.getElementById("netLoginBox").style.display="none";
    document.getElementById("netScanBox").style.display ="flex";
  }
  
  function scanNetwork(){
    const box=document.getElementById("scanResults");
    box.innerHTML="";
    Object.entries(machines).forEach(([ip,obj])=>{
      const div=document.createElement("div");
      div.style.display="flex";div.style.alignItems="center";div.style.gap="10px";div.style.marginBottom="6px";
  
      const img=document.createElement("img");
      img.src = osIcons[obj.os] || osIcons.unknown;
      img.width=24;img.height=24;img.alt=obj.os;
  
      const span=document.createElement("span");
      span.textContent = `${ip} — ${obj.os} (${obj.osVersion})`;
  
      div.appendChild(img);
      div.appendChild(span);
      box.appendChild(div);
    });
  }
  
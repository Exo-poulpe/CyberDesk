/* ---- horloge */
function tick(){
  const d=new Date(),h=d.getHours().toString().padStart(2,"0"),m=d.getMinutes().toString().padStart(2,"0");
  document.getElementById("clock").textContent=`${h}:${m}`;
}
setInterval(tick,1000);tick();

/* ---- navigation */
function openApp(name){
  // cache toutes les apps
  document.querySelectorAll('.app').forEach(a=>a.style.display='none');

  // puis affiche la bonne
  if(name==='SMS'){
    document.getElementById('smsScreen').style.display='block';
  }
  else if(name==='BANK'){
    document.getElementById('bankScreen').style.display='block';
  }
  // n’oublie pas de masquer l’écran d’accueil
  document.getElementById('homeScreen').style.display='none';
}

function goHome(){
  hideAllApps();
  document.getElementById("homeScreen").style.display="block";
}
function goBack(){               // simple : retourne à l’accueil
  goHome();
}
function hideAllApps(){
  document.querySelectorAll(".app").forEach(a=>a.style.display="none");
}

/* ----  SMS  ---- */
const smsData={
  "33612345678":[{me:false,text:"Yo, you coming tonight?"}],
  "Bank":[{me:false,text:"Your code is 3921. Do not share it."}],
  "Mum":[{me:false,text:"Call me when you can ❤️"}]
};

function openConversation(id){
  document.getElementById("smsList").hidden=true;
  document.getElementById("smsChat").hidden=false;
  document.getElementById("chatTitle").textContent=id;
  const box=document.getElementById("chatBox");
  box.innerHTML="";
  smsData[id].forEach(m=>{
    const b=document.createElement("div");
    b.className="sms-bubble";
    b.style.alignSelf=m.me?"flex-end":"flex-start";
    b.textContent=m.text;
    box.appendChild(b);
  });
}
function showSmsList(){
  document.getElementById("smsChat").hidden=true;
  document.getElementById("smsList").hidden=false;
}



/* ---- BANK ---- */
let bankBalance   = 8634.67;   // solde réel
let bankCode      = "";         // code temporaire
let pendingAmount = 0;          // montant en attente

updateBalanceUI();              // affiche le solde au chargement

function updateBalanceUI(){
  document.getElementById("balanceValue").textContent =
    "$" + bankBalance.toLocaleString("en-US",{minimumFractionDigits:2});
}

function initiateTransfer(){
  const amt = parseFloat(document.getElementById("transferAmount").value);
  if(isNaN(amt) || amt<=0 || amt>bankBalance){
    alert("Enter a valid amount ≤ your balance"); return;
  }
  pendingAmount = amt;

  bankCode = Math.floor(1000 + Math.random()*9000).toString();

  // envoie le SMS
  (smsData["Bank"] ||= []).push({
    me:false,
    text:`Your verification code is ${bankCode}. Do not share it.`
  });

  // switch vers l'écran vérification
  document.getElementById("bankHome").hidden  = true;
  document.getElementById("bankVerify").hidden = false;
  document.getElementById("bankCodeInput").value = "";
  document.getElementById("bankStatus").textContent = "";

  showPopup("Verification SMS sent!");
}

function verifyBankCode(){
  const v   = document.getElementById("bankCodeInput").value.trim();
  const lbl = document.getElementById("bankStatus");

  if(v === bankCode){
    bankBalance -= pendingAmount;          // met à jour le solde
    updateBalanceUI();

    lbl.style.color = "#81d4fa";
    lbl.textContent = "✅ Transfer confirmed!";

    /* ---- confettis ---- */
    confetti({
      particleCount: 120,          // nombre
      spread: 70,                  // ouverture en degrés
      origin: { y: 0.6 }           // 0 = haut, 1 = bas (0.6 milieu bas)
    });
  }else{
    lbl.style.color = "#ef5350";
    lbl.textContent = "❌ Wrong code.";
  }
}

/* POPUP */
function showPopup(msg){
  const overlay=document.createElement("div");
  overlay.className="popup-overlay";

  const box=document.createElement("div");
  box.className="popup-box";
  box.innerHTML = `<p>${msg}</p>`;

  const ok=document.createElement("button");
  ok.className="popup-btn";
  ok.textContent="OK";
  ok.onclick=()=>overlay.remove();

  box.appendChild(ok);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}


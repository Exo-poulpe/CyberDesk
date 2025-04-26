# 🧠 Full Solution – CyberDesk: Behind the Network

This document provides the **step-by-step solution** to the CyberDesk awareness game.  
It is intended for educators or players who are stuck and need guidance.

---

## 🎯 End Goal

Gain **remote access to the CFO’s smartphone**, open her **banking app**, and simulate a **money transfer**.

---

## 🧩 Step-by-Step Walkthrough

### 1. 🕵️ OSINT / Reconnaissance
- From a **LinkedIn post**, you learn that the CFO uses **Facebook**.
- Her Facebook **email address** can be phished.

---

### 2. 🎣 Facebook Phishing
- Open the **Phishing Tool** and select the **Facebook template**.
- Launch the phishing attack using her email.
- You receive a **Facebook password**.  
  👉 It is **not useful** for access — this is intentional. It’s a fake flag.

---

### 3. 📧 Microsoft Verification Phishing
- After capturing the Facebook password, a **new option** appears: *Email verification phishing*.
- When launched, the victim (simulated) enters a **Microsoft email address** (e.g., `jane.doe@outlook.com`).
- This email is now visible and usable.

---

### 4. 🔓 Brute Force on Microsoft Account
- Open the **BruteForce** tool.
- Enter the Microsoft email and choose any **wordlist**.
- You crack the Microsoft **password** and get:
  - A valid **username**
  - The **password**

---

### 5. 💻 Remote File Explorer to Windows
- Go to the **Remote File Explorer** tool.
- Enter the provided IP (e.g., `192.168.1.42`) and use the credentials.
- Result: **limited user access** — you don’t have admin rights yet.

---

### 6. 🗃️ Find and Decrypt the Backup
- In the file explorer, the user has a **password-protected backup archive**.
- Download it.
- Use the **Decryptor** tool and choose a wordlist.
- You crack the **backup password**.

---

### 7. 🔁 Reconnect as Admin
- Return to **Remote Connection**.
- This time, log in using the **backup password** (which also works as the admin password).
- You now gain **full access** to the machine.

---

### 8. 🔍 Scan the Internal Network
- Open the **Network Scanner**.
- Connect from the Windows machine.
- Launch a LAN scan to discover other connected devices.
- A **smartphone** appears on the network.

---

### 9. 💣 Exploit the Smartphone
- Open the **Pegasus RCE** tool.
- Input the smartphone’s IP address.
- Select the **Stagefright** exploit (Android < 14.0).
- Launch the exploit with **"Disable notifications"** checked.
- The phone is now vulnerable.

---

### 10. 📱 Remote Control & Data Extraction
- Open the **Mobile Control** tool.
- Enter the smartphone’s IP.
- Connect remotely.
- A simulated smartphone screen appears, with access to the **banking app**.
- Simulate a **money transfer**.

---

## 🧠 Pedagogical Notes

This challenge demonstrates how an attacker can:
- Chain together **social engineering** and **technical exploits**
- Leverage one credential to pivot to another system
- Exploit poor password reuse and weak backup practices
- Escalate privileges through analysis and timing

---

## 🛑 Disclaimer

This project is entirely **fictional** and for **educational use only**.  
No real malware, exploits, or unauthorized access are performed.

---

Stay curious — and stay ethical. 🧑‍💻🧩

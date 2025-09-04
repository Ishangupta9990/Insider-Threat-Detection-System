// // app.js - client-side logic
// const statusEl = document.getElementById("status");
// const logsEl = document.getElementById("logs");
// const eventsEl = document.getElementById("events");
// const trainBtn = document.getElementById("trainBtn");
// const enrollBtn = document.getElementById("enrollBtn");

// const verifyModal = document.getElementById("verifyModal");
// const verifySentence = document.getElementById("verifySentence");
// const verifyInput = document.getElementById("verifyInput");
// const verifySubmit = document.getElementById("verifySubmit");
// const verifyCancel = document.getElementById("verifyCancel");
// const verifyResult = document.getElementById("verifyResult");

// let scoreChart;
// let scoreSeries = [];

// async function fetchStatus(){
//   const res = await fetch("/api/status");
//   const json = await res.json();
//   return json;
// }
// async function fetchEvents(){
//   const res = await fetch("/api/events");
//   return res.json();
// }
// async function fetchLogs(){
//   const res = await fetch("/api/logs?n=40");
//   return res.json();
// }

// function updateStatusUI(st){
//   if(!st) return;
//   const s = st.last_status || "unknown";
//   statusEl.textContent = s.toUpperCase();
//   statusEl.className = s.startsWith("hard") ? "status alert" : "status normal";
//   // push score to chart
//   if(typeof st.last_score === "number"){
//     scoreSeries.push(st.last_score);
//     if(scoreSeries.length > 40) scoreSeries.shift();
//     scoreChart.data.labels = scoreSeries.map((_,i)=>i);
//     scoreChart.data.datasets[0].data = scoreSeries;
//     scoreChart.update();
//   }
// }

// async function refreshAll(){
//   const st = await fetchStatus();
//   updateStatusUI(st);
//   const logs = await fetchLogs();
//   logsEl.textContent = JSON.stringify(logs.slice(-8), null, 2);
//   const ev = await fetchEvents();
//   eventsEl.innerHTML = ev.slice(-12).reverse().map(e=>`<li>${e.timestamp||''} • ${e.type||''} • ${e.score||''} ${e.ok!==undefined? '• ok:'+e.ok:''}</li>`).join("");
//   // if last status is hard anomaly -> show verification modal
//   if(st.last_status === "hard_anomaly"){
//     showVerifyModal();
//   }
// }

// function showVerifyModal(){
//   verifyResult.textContent = "";
//   verifyInput.value = "";
//   verifySentence.textContent = "I am the authorized user.";
//   verifyModal.classList.remove("hidden");
//   verifyInput.focus();
//   captureTimingInit();
// }

// verifyCancel.addEventListener("click", ()=>{ verifyModal.classList.add("hidden"); });

// let timingBuffer = [];
// function captureTimingInit(){
//   timingBuffer = [];
//   verifyInput.onkeydown = (ev)=>{
//     timingBuffer.push(Date.now());
//   };
// }

// async function sendVerification(){
//   const timestamps = timingBuffer;
//   if(timestamps.length < 2){
//     verifyResult.textContent = "Type the sentence before submitting.";
//     return;
//   }
//   // convert to deltas
//   let deltas = [];
//   for(let i=1;i<timestamps.length;i++){
//     deltas.push((timestamps[i]-timestamps[i-1])/1000.0);
//   }
//   const payload = {timings: deltas};
//   const res = await fetch("/api/verify", {
//     method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload)
//   });
//   const js = await res.json();
//   if(js.ok){
//     verifyResult.style.color = "#9bffb6";
//     verifyResult.textContent = "Verified — access allowed.";
//     setTimeout(()=>{ verifyModal.classList.add("hidden"); }, 800);
//   } else {
//     verifyResult.style.color = "#ff9b9b";
//     verifyResult.textContent = "Verification failed.";
//   }
// }

// verifySubmit.addEventListener("click", sendVerification);

// // Enrollment: collect 3 samples
// enrollBtn.addEventListener("click", async ()=>{
//   const sentence = "I am the authorized user.";
//   let samples = [];
//   for(let r=0;r<3;r++){
//     const ans = prompt(`Enrollment sample ${r+1}/3:\\nPlease type exactly:\\n${sentence}`);
//     if(!ans || ans.trim()!==sentence) { alert("Text mismatch, try again."); r--; continue; }
//     // Ask for small timing sample: best-effort - ask user to type slowly and press OK
//     alert("Now, press OK and type sentence again naturally into the next prompt and submit quickly.");
//     const timingsText = prompt("Paste comma-separated timings (example: 0.12,0.09,0.1) — or press Cancel to auto-simulate");
//     let arr;
//     if(!timingsText) {
//       // simulate some timings if user cannot provide
//       arr = [0.12,0.09,0.11,0.1,0.13];
//     } else {
//       arr = timingsText.split(",").map(x=>parseFloat(x.trim()));
//     }
//     samples.push(arr);
//   }
//   // compute median per position
//   const maxL = Math.max(...samples.map(s=>s.length));
//   const padded = samples.map(s=>{
//     if(s.length < maxL){
//       const med = s.reduce((a,b)=>a+b,0)/s.length;
//       return s.concat(Array(maxL-s.length).fill(med));
//     }
//     return s;
//   });
//   const med = [];
//   for(let i=0;i<maxL;i++){
//     med.push(padded.map(p=>p[i]).reduce((a,b)=>a+b,0)/padded.length);
//   }
//   // send to server
//   await fetch("/api/enroll", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({samples: samples, samples_median: med})});
//   alert("Enrollment stored locally. You can now test verification.");
// });

// trainBtn.addEventListener("click", async ()=>{
//   trainBtn.disabled = true;
//   trainBtn.textContent = "Training...";
//   await fetch("/api/train", {method:"POST"});
//   trainBtn.textContent = "Train Model";
//   trainBtn.disabled = false;
// });

// window.onload = function(){
//   const ctx = document.getElementById("scoreChart").getContext("2d");
//   scoreChart = new Chart(ctx, {
//     type: 'line',
//     data: { labels: [], datasets: [{label:'Anomaly score', data: [], fill:false, borderColor:'#00d4ff'}] },
//     options: { responsive:true, animation:false, scales:{y:{beginAtZero:false}}}
//   });
//   // poll periodically
//   refreshAll();
//   setInterval(refreshAll, 3000);
// };

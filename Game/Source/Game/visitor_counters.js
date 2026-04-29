


function isElectron() {
  return typeof navigator !== 'undefined' &&
         navigator.userAgent.toLowerCase().includes('electron');
}

function isWeb() {
  return !isElectron();
}

function initializeFirebase() {
  firebase.initializeApp({
    apiKey: "AIzaSyAl0rRWQxUoHunlrSUoX1cbW1N14kiF5p8",
    authDomain: "keyslater.firebaseapp.com",
    projectId: "keyslater",
    storageBucket: "keyslater.firebasestorage.app",
    messagingSenderId: "97420860796",
    appId: "1:97420860796:web:b0098e65133d27638d18f9"
  });

  const db = firebase.firestore();

  window.__db = db;
}

function getVisitorId() {
  const KEY = "visitor_id_v1";

  let id = localStorage.getItem(KEY);

  if (!id) {
    id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    localStorage.setItem(KEY, id);
  }

  console.log("Id is " + id);
  return id;
}

function countVisit() {
  if (!isWeb()) return;

  const db = window.__db;
  if (!db) return;

  const visitorId = getVisitorId();

  const metricsRef = db.collection("metrics").doc("visits");
  const visitorRef = db.collection("visitors").doc(visitorId);

  const metricsUpdate = {
    total: firebase.firestore.FieldValue.increment(1)
  };

  visitorRef.get().then(doc => {

    const isNew = !doc.exists;

    if (isNew) {
      visitorRef.set({firstSeen: Date.now()});
      metricsUpdate.unique = firebase.firestore.FieldValue.increment(1);
    }

    return metricsRef.set(metricsUpdate, { merge: true });
  })
  .then(() => metricsRef.get())
  .then(doc => {
    const data = doc.data() || {};
    console.log("The man");
    console.log(data);

    let unique = data.unique || 0;
    let total = data.total || 0;

    const uniqueEl = document.getElementById("uniqueCounter");
    const totalEl = document.getElementById("totalCounter");

    if (uniqueEl) uniqueEl.textContent = `Unique: ${unique}`;
    if (totalEl) totalEl.textContent = `Visits: ${total}`;

    console.log("Ok");
    const el = document.getElementById("visitorCounters");
    if (el) {
      console.log("displaying the visitor counters")
      el.style.display = "block";
      requestAnimationFrame(() => {
        el.style.opacity = "1";
      });
    }
  });

}


  



function displayVisitCounter() {

}
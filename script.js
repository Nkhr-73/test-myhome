document.addEventListener("DOMContentLoaded", () => {

const STORAGE_KEY = "myhome_data";
const BACKUP_KEY = "myhome_backups";

let linkData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

const categoriesDiv = document.getElementById("categories");
const categorySelect = document.getElementById("categorySelect");

/* ================= 保存 ================= */

function save(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(linkData));

  let backups = JSON.parse(localStorage.getItem(BACKUP_KEY)) || [];

  backups.unshift({
    time: new Date().toLocaleString(),
    data: JSON.parse(JSON.stringify(linkData))
  });

  if(backups.length > 5) backups.pop();

  localStorage.setItem(BACKUP_KEY, JSON.stringify(backups));
}

/* ================= 描画 ================= */

let dragIndex = null;
let dragCategory = null;

function render(){

  categoriesDiv.innerHTML = "";
  categorySelect.innerHTML = "";

  for(let category in linkData){

    const catDiv = document.createElement("div");
    catDiv.className = "category";

    const title = document.createElement("h2");
    title.textContent = category;

    const linksDiv = document.createElement("div");
    linksDiv.className = "links";

    title.onclick = () => {
      linksDiv.classList.toggle("hidden");
    };

    linkData[category].forEach((link,index)=>{

      const item = document.createElement("div");
      item.className = "link-item";
      item.draggable = true;

      /* ドラッグ */
      item.addEventListener("dragstart", () => {
        dragIndex = index;
        dragCategory = category;
        item.classList.add("dragging");
      });

      item.addEventListener("dragend", () => {
        item.classList.remove("dragging");
      });

      item.addEventListener("dragover", (e) => {
        e.preventDefault();
      });

      item.addEventListener("drop", () => {

        if(dragCategory !== category) return;

        const dragged = linkData[category][dragIndex];

        linkData[category].splice(dragIndex,1);
        linkData[category].splice(index,0,dragged);

        save();
        render();
      });

      /* リンク */
      const a = document.createElement("a");
      a.href = link.url;
      a.target = "_blank";

      const iconBox = document.createElement("div");
      iconBox.className = "link-icon";

      const icon = document.createElement("img");
      icon.src = "https://www.google.com/s2/favicons?sz=64&domain=" + link.url;

      icon.onerror = () => {
        icon.style.display = "none";
      };

      iconBox.appendChild(icon);
      a.appendChild(iconBox);

      const name = document.createElement("div");
      name.className = "link-name";
      name.textContent = link.name;

      /* 削除 */
      const del = document.createElement("button");
      del.textContent = "削除";
      del.className = "delete-btn";

      del.onclick = () => {
        linkData[category].splice(index,1);
        save();
        render();
      };

      item.appendChild(a);
      item.appendChild(name);
      item.appendChild(del);

      linksDiv.appendChild(item);

    });

    catDiv.appendChild(title);
    catDiv.appendChild(linksDiv);
    categoriesDiv.appendChild(catDiv);

    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  }
}

/* ================= 機能 ================= */

function addCategory(){
  const name = prompt("カテゴリー名");
  if(!name) return;

  if(!linkData[name]){
    linkData[name] = [];
    save();
    render();
  }
}

function addLink(){
  const name = document.getElementById("linkName").value;
  let url = document.getElementById("linkURL").value;
  const cat = categorySelect.value;

  if(!name || !url || !cat) return;

  if(!url.startsWith("http")){
    url = "https://" + url;
  }

  linkData[cat].push({name,url});

  save();
  render();

  document.getElementById("linkName").value = "";
  document.getElementById("linkURL").value = "";
}

function toggleEditor(){
  document.getElementById("editorPanel").classList.toggle("hidden");
}

function toggleWallpaper(){
  document.getElementById("wallpaperPanel").classList.toggle("hidden");
}

function showBackups(){

  const backups = JSON.parse(localStorage.getItem(BACKUP_KEY)) || [];

  if(backups.length === 0){
    alert("バックアップなし");
    return;
  }

  let text = "復元する番号\n\n";

  backups.forEach((b,i)=>{
    text += `${i+1} : ${b.time}\n`;
  });

  const num = prompt(text);
  if(!num) return;

  const backup = backups[num-1];
  if(!backup) return;

  linkData = backup.data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(linkData));

  render();
}

/* ================= イベント ================= */

document.getElementById("addCategoryBtn").onclick = addCategory;
document.getElementById("addLinkBtn").onclick = toggleEditor;
document.getElementById("backupBtn").onclick = showBackups;
document.getElementById("wallpaperBtn").onclick = toggleWallpaper;
document.getElementById("addLinkConfirm").onclick = addLink;

document.getElementById("linkURL").addEventListener("keypress", (e)=>{
  if(e.key === "Enter") addLink();
});

/* ================= 時計 ================= */

function updateClock(){
  const now = new Date();

  const h = String(now.getHours()).padStart(2,"0");
  const m = String(now.getMinutes()).padStart(2,"0");
  const s = String(now.getSeconds()).padStart(2,"0");

  document.getElementById("clock").textContent = `${h}:${m}:${s}`;

  document.getElementById("date").textContent =
    now.toLocaleDateString("ja-JP",{year:"numeric",month:"long",day:"numeric",weekday:"long"});
}

setInterval(updateClock,1000);
updateClock();

/* ================= 天気 ================= */

async function updateWeather(){
  try{
    const url = `https://api.open-meteo.com/v1/forecast?latitude=33.59&longitude=130.40&current_weather=true`;
    const res = await fetch(url);
    const data = await res.json();

    const temp = data.current_weather.temperature;
    const code = data.current_weather.weathercode;

    const map = {
      0:"快晴 ☀️",1:"晴れ 🌤",2:"曇り ⛅",3:"曇り ☁️",
      45:"霧 🌫",61:"雨 🌧",71:"雪 ❄️"
    };

    document.getElementById("weather").textContent =
      `福岡 ${map[code] || ""} ${temp}°C`;

  }catch{
    document.getElementById("weather").textContent="天気取得失敗";
  }
}

updateWeather();
setInterval(updateWeather,600000);

/* ================= 壁紙 ================= */

const colorPicker = document.getElementById("colorPicker");
const imageUpload = document.getElementById("imageUpload");

if(colorPicker){
  colorPicker.oninput = () => {
    document.body.style.background = colorPicker.value;
    localStorage.setItem("wallpaperColor",colorPicker.value);
  };
}

if(imageUpload){
  imageUpload.onchange = (e)=>{
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event)=>{
      const img = event.target.result;
      document.body.style.background = `url(${img}) center/cover no-repeat fixed`;
      localStorage.setItem("wallpaperImage",img);
    };

    reader.readAsDataURL(file);
  };
}

const savedColor = localStorage.getItem("wallpaperColor");
const savedImage = localStorage.getItem("wallpaperImage");

if(savedImage){
  document.body.style.background = `url(${savedImage}) center/cover no-repeat fixed`;
}else if(savedColor){
  document.body.style.background = savedColor;
}

/* ================= 初期描画 ================= */

render();

});

const STORAGE_KEY="myhome_data";
const BACKUP_KEY="myhome_backups";

let data=JSON.parse(localStorage.getItem(STORAGE_KEY))||{};

const categoriesDiv=document.getElementById("categories");
const categorySelect=document.getElementById("categorySelect");

function save(){

localStorage.setItem(STORAGE_KEY,JSON.stringify(data));

let backups=JSON.parse(localStorage.getItem(BACKUP_KEY))||[];

backups.unshift({
time:new Date().toLocaleString(),
data:JSON.parse(JSON.stringify(data))
});

if(backups.length>5)backups.pop();

localStorage.setItem(BACKUP_KEY,JSON.stringify(backups));

}

function render(){

categoriesDiv.innerHTML="";
categorySelect.innerHTML="";

for(let category in data){

const catDiv=document.createElement("div");
catDiv.className="category";

const title=document.createElement("h2");
title.textContent=category;

const linksDiv=document.createElement("div");
linksDiv.className="links";

title.onclick=()=>{
linksDiv.style.display=
linksDiv.style.display==="none"?"flex":"none";
};

data[category].forEach((link,index)=>{

const item=document.createElement("div");
item.className="link-item";

const a=document.createElement("a");
a.href=link.url;
a.textContent=link.name;
a.target="_blank";

const del=document.createElement("button");
del.textContent="削除";
del.className="delete-btn";

del.onclick=()=>{
data[category].splice(index,1);
save();
render();
};

item.appendChild(a);
item.appendChild(del);
linksDiv.appendChild(item);

});

catDiv.appendChild(title);
catDiv.appendChild(linksDiv);
categoriesDiv.appendChild(catDiv);

const option=document.createElement("option");
option.value=category;
option.textContent=category;

categorySelect.appendChild(option);

}

}

function addCategory(){

const name=prompt("カテゴリー名");

if(!name)return;

if(!data[name]){

data[name]=[];

save();
render();

}

}

function addLink(){

const name=document.getElementById("linkName").value;
const url=document.getElementById("linkURL").value;
const cat=categorySelect.value;

if(!name||!url||!cat)return;

data[cat].push({name,url});

save();
render();

document.getElementById("linkName").value="";
document.getElementById("linkURL").value="";

}

function toggleEditor(){

const panel=document.getElementById("editorPanel");

panel.style.display=
panel.style.display==="none"?"block":"none";

}

function showBackups(){

const backups=JSON.parse(localStorage.getItem(BACKUP_KEY))||[];

if(backups.length===0){
alert("バックアップなし");
return;
}

let text="復元する番号を入力\n\n";

backups.forEach((b,i)=>{
text+=`${i+1} : ${b.time}\n`;
});

const num=prompt(text);

if(!num)return;

const backup=backups[num-1];

if(!backup)return;

data=backup.data;

localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
  const savedColor=localStorage.getItem("wallpaperColor");
const savedImage=localStorage.getItem("wallpaperImage");

if(savedImage){

document.body.style.background=`url(${savedImage}) center/cover no-repeat fixed`;

}else if(savedColor){

document.body.style.background=savedColor;

}

render();

}

function updateClock(){

const now=new Date();

const h=String(now.getHours()).padStart(2,"0");
const m=String(now.getMinutes()).padStart(2,"0");
const s=String(now.getSeconds()).padStart(2,"0");

document.getElementById("clock").textContent=`${h}:${m}:${s}`;

const options={year:"numeric",month:"long",day:"numeric",weekday:"long"};

document.getElementById("date").textContent=
now.toLocaleDateString("ja-JP",options);

}

setInterval(updateClock,1000);
updateClock();

render();
async function updateWeather(){

const lat=33.59;
const lon=130.40;

const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

const res=await fetch(url);
const weatherData=await res.json();

const temp=weatherData.current_weather.temperature;
const code=weatherData.current_weather.weathercode;
const weatherMap={
0:"快晴 ☀️",
1:"晴れ 🌤",
2:"やや曇り ⛅",
3:"曇り ☁️",
45:"霧 🌫",
48:"霧 🌫",
51:"小雨 🌦",
61:"雨 🌧",
63:"強い雨 🌧",
71:"雪 ❄️"
};

const weather=weatherMap[code]||"天気";

document.getElementById("weather").textContent=
`福岡 ${weather} ${temp}°C`;

}

updateWeather();
setInterval(updateWeather,600000);

function toggleWallpaper(){

const panel=document.getElementById("wallpaperPanel");

panel.style.display=
panel.style.display==="none"?"block":"none";

}

const colorPicker=document.getElementById("colorPicker");

colorPicker.oninput=function(){

document.body.style.background=colorPicker.value;

localStorage.setItem("wallpaperColor",colorPicker.value);

};

const imageUpload=document.getElementById("imageUpload");

imageUpload.onchange=function(e){

const file=e.target.files[0];
const reader=new FileReader();

reader.onload=function(event){

const img=event.target.result;

document.body.style.background=`url(${img}) center/cover no-repeat fixed`;

localStorage.setItem("wallpaperImage",img);

};

reader.readAsDataURL(file);

  fetch("https://api.rss2json.com/v1/api.json?rss_url=https://www3.nhk.or.jp/rss/news/cat0.xml")
.then(res => res.json())
.then(data => {

const list = document.getElementById("news-list")

data.items.slice(0,6).forEach(news => {

const div = document.createElement("div")
div.className = "news-item"

div.innerHTML = `
<a href="${news.link}" target="_blank">
${news.title}
</a>
`

list.appendChild(div)

})

})

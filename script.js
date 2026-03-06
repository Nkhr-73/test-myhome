const STORAGE_KEY="myhome_sites";

let sites=JSON.parse(localStorage.getItem(STORAGE_KEY))||[];

const container=document.getElementById("sites");

function saveSites(){
localStorage.setItem(STORAGE_KEY,JSON.stringify(sites));
}

function renderSites(){

container.innerHTML="";

sites.forEach(site=>{

const card=document.createElement("div");
card.className="site-card";

const icon=document.createElement("img");
icon.className="site-icon";

const domain=new URL(site.url).hostname;

icon.src="https://www.google.com/s2/favicons?domain="+domain+"&sz=64";

const title=document.createElement("div");
title.className="site-title";
title.textContent=site.name;

card.appendChild(icon);
card.appendChild(title);

card.onclick=()=>{
window.open(site.url,"_blank");
};

container.appendChild(card);

});

}

function addSite(){

const name=document.getElementById("siteName").value;
const url=document.getElementById("siteURL").value;

if(!name||!url){
alert("サイト名とURLを入力して");
return;
}

sites.push({name,url});

saveSites();
renderSites();

document.getElementById("siteName").value="";
document.getElementById("siteURL").value="";

}

renderSites();

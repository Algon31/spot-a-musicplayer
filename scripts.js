let currentsong = new Audio();
let songs;
let currentplaylist;




// -------------------- converting to seconds-----------------------------------
function sectotime(sec) {
    // if(isNaN(sec) || sec <0){
    //     return;
    // }
    sec = Number(sec) || 0;
    let minu = Math.floor(sec / 60);
    let reminu = Math.floor(sec % 60);
    let strminu = String(minu).padStart(2, "0");
    let streminu = String(reminu).padStart(2, "0");
    return `${strminu} : ${streminu}`;
}
// ---------------------------getting songs for list------------------------------------
async function get_playlist(playlist) {
    currentplaylist = playlist;
    let api = await fetch(`http://127.0.0.1:5500/assests/playlist/${playlist}`);
    let resource = await api.text();
    let div = document.createElement("div");
    div.innerHTML = resource;
    let a = div.getElementsByTagName("a");
    songs = [];
    for (let i = 0; i < a.length; i++) {
        const eles = a[i];
        if (eles.href.endsWith(".mp3")) {
            let s = eles.href.replaceAll("%20", " ").split(`${playlist}/`)[1].split(".mp3")[0];
            songs.push(s);
        }
    }
    let sul = document.querySelector(".songlist").getElementsByTagName("ul")[0]; // setting to location of songs to be put

    sul.innerHTML = "";

    for (const song of songs) { // itreating the songs to get each song
        sul.innerHTML = sul.innerHTML + `<li class="flexy flexy-a" >
                        <img width="50px" src="/assests/imgs/${song.split(" - ")[0].toLowerCase()}.jpeg" alt="mp3">
                        <div class="name flexy flexy-dc">
                            <span class="songName">${song.split(" - ")[0]} </span>
                            <span class="artiyName">${song.split("-")[1]} </span>
                        </div>
                    </li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => { // addding event listener to pressing on song

        e.addEventListener("click", () => {
            let tracky = e.querySelector(".name").getElementsByTagName("span")[0].innerHTML.trim() + " - " + e.querySelector(".name").getElementsByTagName("span")[1].innerHTML.trim(); // making sure that the song is named properly before searching
            playMusic(tracky + ".mp3"); // uploding the song with .mp for searching purpuse
            document.querySelector(".sName").innerHTML = `<div>${tracky.split(" - ")[0]} - ${tracky.split("- ")[1]} <div> `;
        })
    })

}
// ------------------code for playing music--------------------
const playMusic = (x) => {

    currentsong.src = `/assests/playlist/${currentplaylist}/` + x; // setting the song as current song
    if (currentsong.paused) {
        currentsong.play();
        play.src = "/assests/svgs/pause.svg";

    }
    else {
        currentsong.pause();
        play.src = "/assests/svgs/play.svg";
    }

}
async function loadplaylist() {
    let a = await fetch(`http://127.0.0.1:5500/assests/playlist/`);
    let res = await a.text();
    let div = document.createElement("div");
    div.innerHTML = res;
    let ancors = div.getElementsByTagName("a")
    Array.from(ancors).forEach(async e => {
        if (e.href.includes("/assests/playlist/")) {
            let folder = e.href.split("playlist/")[1];
            let files = await fetch(`http://127.0.0.1:5500/assests/playlist/${folder}/info.json`);
            let resource = await files.json();
            let playLists = document.querySelector(".playLists")
            playLists.innerHTML = playLists.innerHTML + `
                    <div data-playlist="${e.href.split("playlist/")[1]}" class="playList flexy flexy-c">
                        <img class="pic" src="/assests/playlist/${folder}/image.jpeg" alt="">
                        <img class="pic-play" src="/assests/svgs/play.svg" alt="">

                        <span>${resource.title}</span>
                        <p>${resource.artist}</p>

                    </div>
            `
            // getting playlists using clicks
            document.querySelectorAll(".playList").forEach(e => {
                e.addEventListener("click", async item => {
                    let selected = item.currentTarget.dataset.playlist;
                    console.log(selected)
                    songs = await get_playlist(selected);
                    document.querySelector(".leftt").style.left = "0%";

                })
            })


        }
    })

}












// ---------------this is where  it strats i guess------------------------
async function main() {

    await get_playlist("mySongs");// waiting till the songs are fetched




    await loadplaylist();











    //   if clicked then playing the song
    play.addEventListener("click", () => {
        if (!currentsong) {

            currentsong.src = `/assests/playlist/${currentplaylist}/${songs[0].toLowerCase()}.mp3`;
            document.querySelector(".sName").innerHTML = `${songs[0].split(" - ")[0] + " - " + songs[0].split("-")[1]}`;
            currentsong.play();
            play.src = "/assests/svgs/pause.svg";
        }
        else {

            if (currentsong.paused) {
                currentsong.play();
                play.src = "/assests/svgs/pause.svg";
            }
            else {
                currentsong.pause();
                play.src = "/assests/svgs/play.svg";
            }
        }
    })


    next.addEventListener("click", () => {
        let curS = currentsong.src.split("/").splice(-1)[0].replaceAll("%20", " ").split(".")[0];
        let index = songs.indexOf(curS)
        if (index + 1 > songs.length - 1) {
        }
        else {

            playMusic(songs[index + 1] + ".mp3");
            document.querySelector(".sName").innerHTML = songs[index + 1];
        }
    })
    prev.addEventListener("click", () => {
        console.log(songs);
        let curS = currentsong.src.split("/").splice(-1)[0].replaceAll("%20", " ").split(".")[0];
        let index = songs.indexOf(curS)
        if (index + 1 >= 2) {
            playMusic(songs[index - 1] + ".mp3");
            document.querySelector(".sName").innerHTML = songs[index - 1];
        }
    })



    // -------------------updates times accordinglyy-----------
    currentsong.addEventListener("timeupdate", () => {
        if (currentsong.currentTime == currentsong.duration) {
            play.src = "/assests/svgs/play.svg";
        }
        else {

            document.querySelector(".sTime").innerHTML = ` ${sectotime(currentsong.currentTime)} / ${sectotime(currentsong.duration)} `;
            document.querySelector(".sCircle").style.left = (currentsong.currentTime / currentsong.duration) * 99 + "%";
        }

    })
    document.body.onkeyup = function (e) {
        if (e.key == " " || e.code == "space" || e.keyCode == 32) {
            if (currentsong.paused) {
                currentsong.play();
                play.src = "/assests/svgs/pause.svg";

            }
            else {
                currentsong.pause();
                play.src = "/assests/svgs/play.svg";
            }
        }
    }
    seek.addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 99;
        sCircle.style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 99;
    })

    let logo = document.querySelector(".logo");
    if (window.matchMedia("(max-width: 768px)").matches) {
        logo.src = "/assests/svgs/ham.svg";
        let x = document.createElement("div");
        x.innerHTML = `
            songs `;
        logo.after(x);
        logo.addEventListener("click", function () {
            let leftt = document.querySelector(".leftt");
            document.querySelector(".playList").style.flexDirection = "column";

            if (leftt.style.left == "0%") {
                leftt.style.left = "-100%";
            }
            else {
                leftt.style.left = "0%";
            }
        })
    }
    else {
        logo.src = "/assests/svgs/spotify-logo.svg";

    }
    input.addEventListener("change", (e) => {
        currentsong.volume = e.target.value / 100;

    })
    document.querySelector(".favSong").addEventListener("click", () => {
        currentsong.src = `/assests/playlist/mySongs/her - JVKE.mp3`; // setting the song as current song
        if (currentsong.paused) {
            currentsong.play();
            play.src = "/assests/svgs/pause.svg";
    
        }
        else {
            currentsong.pause();
            play.src = "/assests/svgs/play.svg";
        }
        document.querySelector(".sName").innerHTML = "her - JVKE"
    })

    volume.addEventListener("click",(e)=>{
        if(currentsong.muted){
            e.target.src = "/assests/svgs/volume.svg"
            currentsong.muted = false;
        }
        else{
            e.target.src = "/assests/svgs/mute.svg"
            currentsong.muted = true;
        }
    })















}

main();
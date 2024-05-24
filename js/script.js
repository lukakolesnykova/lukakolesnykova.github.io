/* ------------------------------ Draggable Windows ------------------------------ */

// asigns the onmouse call to all first children of any divs with the window class
// this code runs on load
function dragToWindows() {
    let windows = document.getElementsByClassName("window");
    for (let i = 0; i < windows.length; i++) {
        let funCall = `titleDown("${windows[i].id}", event)`
        windows[i].firstElementChild.setAttribute("onmousedown", funCall)
    }
}

// an empty list
let visableWindows = [];

// sort and resign z indexes for layering
function layer(item, newItem = false) {
    // if its a new item then move all other items one layer back and add it to the list
    if (newItem) {
        for (i in visableWindows) {
            let index = document.getElementById(visableWindows[i]).style.zIndex;
            document.getElementById(visableWindows[i]).style.zIndex = index - 1;
        }
        document.getElementById(item).style.zIndex = 256;
        visableWindows.unshift(item);
    }

    // if the item is already first then end

    if (item == visableWindows[0]) return;

    // run through the list. any item that is before the chose will have its index reduced
    // then add it to the start of the list

    for (let i = 0; i < visableWindows.length; i++) {
        if (visableWindows[i] == item) {
            document.getElementById(visableWindows[i]).style.zIndex = 256;
            visableWindows.splice(i, 1)
            visableWindows.unshift(item)
            console.log("found");
            break;
        }
        console.log("sub");
        let index = document.getElementById(visableWindows[i]).style.zIndex;
        document.getElementById(visableWindows[i]).style.zIndex = index - 1;
    }
}

// removes an item from the list
function layerRemove(item) {
    let index = visableWindows.indexOf(item);
    visableWindows.splice(index, 1);

}

// toggle visablity
// ID is a boolian of what you want the visability of the window to be
function windowDisplay(ID, vis) {
    let visability = "none"

    // call layering based on inputs
    if (vis) {
        visability = "block"
        layer(ID, true);
    } else {
        layerRemove(ID);
    }

    // default make it invisable, if vis is true then make it visable

    // find the element based on ID and set its visability based on vis
    document.getElementById(ID).style.display = visability;
}

// variables
let draggable = false;
let initX;
let initY;
let initWinX;
let initWinY;
let windowID;

//function for on click
function titleDown(winID, event) {
    layer(winID);

    windowID = winID;
    draggable = true;
    initX = event.clientX;
    initY = event.clientY;
    win = document.getElementById(winID);
    initWinX = win.offsetLeft;
    initWinY = win.offsetTop;

}

document.addEventListener("mousemove", (event) => {
    if (draggable) {
        let deltaX = event.clientX - initX;
        let deltaY = event.clientY - initY;
        document.getElementById(windowID).style.left = (initWinX + deltaX) + "px";
        document.getElementById(windowID).style.top = (initWinY + deltaY) + "px";
    }
});

document.addEventListener("mouseup", (event) => {
    draggable = false
    windowID = undefined
});

/* ------------------------------ Last.fm ------------------------------ */

var api = '2681d73ca7416d95eeaa795c59b3cbc9';
var username = 'inushiba';
var time = 120; // in seconds

// This variable acts as the comparison value storing
// what's currently being showed, so we don't do a
// bunch of redundant renders
let current;

// Next, we call the last.fm API and pull a JSON response with our latest 1 track
function update(previous, onSuccess) {
    fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${api}&format=json&limit=1`)
        .then(response => response.json())
        .then(json => {
            if (!json.recenttracks) {
                console.error("error fetching lastfm api:", json.message);
                return;
            }
            const trackSrc = json.recenttracks.track[0];

            const track = {
                title: trackSrc.name,
                artist: trackSrc.artist["#text"],
                album: trackSrc.album["#text"],
                image: trackSrc.image[3]["#text"] // Fetching the URL of the album art
            };

            // compare old vs new
            if (!!previous && previous.title == track.title && previous.album == track.album) return;

            console.info(`new track: ${track.title} - ${track.artist}`);
            return track;
        })
        .then(onSuccess)
        .catch(e => {
            console.error("error fetching lastfm api:", e);
            return;
        });
}

// Now, we update our comparor and the html
function setNew(details) {
    if (!details) return;
    current = details;

    $("#track").html(details.title);
    $("#artist").html(details.artist);
    $("#album").html(details.album);
    $("#albumArt").attr("src", details.image); // Setting the src attribute of the album art image
}

setInterval(function () {
    update(current, setNew);
}, time * 1000 )

update(current, setNew);

/* ------------------------------ Time for Navbar ------------------------------ */

// Get the current time and format it
function updateTime() {
    var now = new Date();
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');
    var timeString = hours + ":" + minutes;
    document.getElementById("time").innerHTML = timeString;
}

setInterval(updateTime, 1000);

updateTime();
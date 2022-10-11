SPOTIFY_CLIENT_ID = "5e3191ca6ea84c92ada89e4ffe0a2c6c"
SPOTIFY_REDIRECT_URI = "https://backback12.github.io/spotify-top-tracks/"

function authorizeUser() {
    /*const scopesList = [//'ugc-image-upload',
                //'user-read-recently-played',
                'user-top-read',
                //'user-read-playback-position',
                //'user-read-playback-state',
                //'user-modify-playback-state',
                //'user-read-currently-playing',
                //'app-remote-control',
                //'streaming',
                //'playlist-modify-public',
                //'playlist-modify-private',
                //'playlist-read-private',
                //'playlist-read-collaborative',
                //'user-follow-modify',
                //'user-follow-read',
                //'user-library-modify',
                //'user-library-read',
                //'user-read-email',
                //'user-read-private'
            ];*/
    //var scopes = scopesList.join(' ');
    var scopes = 'user-top-read';

    var url = 'https://accounts.spotify.com/authorize?client_id=' + SPOTIFY_CLIENT_ID +
        '&response_type=token' +
        '&scope=' + encodeURIComponent(scopes) +
        '&redirect_uri=' + encodeURIComponent(SPOTIFY_REDIRECT_URI) +
        '&show_dialog=true';
    document.location = url;
}

function parseArgs() {
    var hash = location.hash.replace(/#/g, '');
    var all = hash.split('&');
    var args = {};
    _.each(all, function(keyvalue) {
        var kv = keyvalue.split('=');
        var key = kv[0];
        var val = kv[1];
        args[key] = val;
    });
    return args;
}

function getSpotify(url) {
    return new Promise((resolve, reject) => {
        $.ajax("https://api.spotify.com/v1" + url, {
            dataType: 'json',
            //data: null,
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            success: function(r) {
                // console.log("??" + JSON.stringify(r));
                resolve(r);
            },
            error: function(err) {
                reject(err);
            }
        })
    })
}
/*
function getSpotify(url, callback) {javasc
    $.ajax("https://api.spotify.com/v1" + url, {
        dataType: 'json',
        //data: null,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function(r) {
            callback(r);
        },
        error: function(r) {
            callback(r);
        }
    })
}*/

// topTracks = [];
// topArtists = [];
// readyState = 0;

function loadUserData() {
    return new Promise((resolve, reject) => {
        var userData = {};
        const url = "/me/top/{0}?limit=20&offset=0&time_range={1}";

        /*getSpotify(getURL(0, 0))
        .then(data => {
            userData['ts'] = data; 
            return getSpotify(getURL(0, 1))
        })
        .then(data => {
            userData['tm'] = data; 
            return getSpotify(getURL(0, 2))
        })
        .then(data => {
            userData['tl'] = data;  
            return getSpotify(getURL(1, 0))
        })
        .then(data => {
            userData['as'] = data; 
            return getSpotify(getURL(1, 1))
        })
        .then(data => {
            userData['am'] = data;
            return getSpotify(getURL(1, 2))
        })
        .then(data => {
            userData['al'] = data; 
            return getSpotify("/me")
        })
        .then(data => {
            userData['user'] = data; 
            resolve(userData);
        })
        .catch(error => {
            reject(error);
        })*/

        getPromises = [];
        for (let i = 0; i < 6; i++) {
            getPromises.push(getSpotify(getURL(Math.floor(i/3), i%3)))
        }
        getPromises.push(getSpotify("/me"));
        
        Promise.all(getPromises).then((allData) => {
            // adds "term" and "type" to obj?
            // keeps order so nah

            resolve(allData);
        })
    })
}

function getURL(dataType, timeRange) {
    dataTypes = ['tracks', 'artists'];
    timeRanges = ['short_term', 'medium_term', 'long_term'];

    return `/me/top/${dataTypes[dataType]}?limit=20&offset=0&time_range=${timeRanges[timeRange]}`
}







/*
function loadUserData() {

    return new Promise((resolve, reject) => {
        var userData = []; 

        console.log("starting");
        getSpotify("/me/top/tracks?limit=20&offset=0&time_range=" + 'short_term')
        .then(function(data) {
            console.log("next");
            userData.push(data);
            getSpotify("/me/top/tracks?limit=20&offset=0&time_range=" + 'medium_term')
        })
        .then(function(data) {
            userData.push(data);
            getSpotify("/me/top/tracks?limit=20&offset=0&time_range=" + 'long_term')
        })
        .then(function(data) {
            userData.push(data);
            getSpotify("/me/top/artists?limit=20&offset=0&time_range=" + 'short_term')
        })
        .then(function(data) {
            userData.push(data);
            getSpotify("/me/top/artists?limit=20&offset=0&time_range=" + 'medium_term')
        })
        .then(function(data) {
            userData.push(data);
            getSpotify("/me/top/artists?limit=20&offset=0&time_range=" + 'long_term')
        })
        .then(function(data) {
            userData.push(data);
            getSpotify("/me")
            console.log("finally");
        })
        .then(function(data) {
            userData.push(data);

            resolve(userData);
        })
        .catch((error) => {
            //console.log("error");
            reject(error);
        })
    })
}
*/
/* // Old function without Promises
function getUserTop() {
    getSpotify("/me/top/tracks?limit=20&offset=0&time_range=" + 'short_term', 
    function(res) {topTracks[0] = res; readyState++})
    
    getSpotify("/me/top/tracks?limit=20&offset=0&time_range=" + 'medium_term', 
    function(res) {topTracks[1] = res; readyState++})

    getSpotify("/me/top/tracks?limit=20&offset=0&time_range=" + 'long_term', 
    function(res) {topTracks[2] = res; readyState++})

    getSpotify("/me/top/artists?limit=20&offset=0&time_range=" + 'short_term', 
    function(res) {topArtists[0] = res; readyState++})

    getSpotify("/me/top/artists?limit=20&offset=0&time_range=" + 'medium_term', 
    function(res) {topArtists[1] = res; readyState++})

    getSpotify("/me/top/artists?limit=20&offset=0&time_range=" + 'long_term', 
    function(res) {topArtists[2] = res; readyState++})

    getSpotify("/me", 
    function(res) {userInfo = res;})
}*/

/* 
 * generateReceipt
 * 
 * Practicing and testing program capabilities
 * 
 * Massive inspiration from Receiptify
 *      https://receiptify.herokuapp.com/
 *      https://github.com/michellexliu/receiptify
 * 
 */
var outttt;
function generateReceipt(data) {
    outttt = data;
    const dataType = "artists";
    // const dataType = "tracks";
    const imgWidth = 2000;  // paper width
    const imgHeight = 1333; // paper height
    const canvasWidth = 400;    //
    const canvasHeight = 1333;   // 

    const canvas = document.getElementById('canvas');
    // canvas.style.height = "900px";
    // canvas.style.width = "300px";
    const ctx = canvas.getContext('2d');
    // ctx.style.height = canvasHeight;

    let img = document.createElement("img");
    img.src = "lib/paper.jpg";

    img.addEventListener("load", () => {
        ctx.drawImage(img, 
            - Math.random() * (imgWidth - canvasWidth),     // random from paper img
            - Math.random() * (imgHeight - canvasHeight));  // random from paper img
        
        //ctx.font = "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
        ctx.font = "24px 'Merchant Copy', 'Courier new', 'Consolas', 'Monaco', sans-serif"
        ctx.textAlign = "center"; //"left";
        ctx.fillStyle = "#202030";
        ctx.fillText(`${data[6].display_name.toUpperCase()}`, 200, 60);
        ctx.fillText("------------------------------", 200, 90);
        ctx.fillText("----------------------------------------", 200, 100);
        // ctx.fillText("Nobody cares about", 150, 300);
        // ctx.fillText("your taste in music", 150, 320);
        
        // 30 character width seems good??

        let testTrack = "ThisIsTheTestTrackName!";  // 23 characters
        let testArtist = "ArtistNamesAreBigg";      // 18 characters
        let testAlbum = "Playlist/AlbumNameBiggest";    // 25 characters
        
        
        ctx.fillText("*Your past year's top songs*", 200, 120);
        ctx.textAlign = "left";
        
        let cursorY = 160;

        for (let i = 0; i < 10; i++) {
            ctx.fillText((i+1).toString().padStart(2, '0'), 35, cursorY);

            if (i == 2) {
                data[2].items[i].name = testTrack;
                data[2].items[i].artists[0].name = testArtist;
            }


            let lines = wrap(`${data[2].items[i].name} - ${data[2].items[i].artists[0].name}`, 25)  // 30 max character width
            for (let j = 0; j < lines.length; j++) {
                ctx.fillText(lines[j], 80, cursorY + j * 20);
            }

            cursorY += lines.length*20 + 5
        }

        // update height of reciept to cut off excess
        // canvas.style.height=
    });
}

// Dynamic Width (Build Regex)
const wrap = (s, w) => s.replace(
    new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, 'g'), '$1\n'
).split("\n");


$(document).ready(
    function() {
        var args = parseArgs();

        if ('error' in args) {
            alert("Error in getting Spotify authorization");

            //document.getElementById('hide-me').style.display = "block";


        } else if ('access_token' in args) {
            // USER IS AUTHENTICATED

            accessToken = args['access_token'];
            
            // hide auth button
            // document.getElementById('index1').style.display = 'none';
            //document.getElementById('index1').style.display = 'none';
            // $("#index2").show()
            //$("AuthButton").hide()

            // Hide Index1
            //document.getElementById('hide-me').style.display = "none";
            //document.getElementById('hide-me').style.visibility = 'hidden'; //hidden visible

            // hide all hide-me elements
            document.querySelectorAll('.hide-me').forEach(elem => {
                elem.style.visibility = 'hidden';
                elem.style.display = 'none';
            })
            document.querySelectorAll('.show-me').forEach(elem => {
                elem.style.visibility = 'visible';
                elem.style.display = 'block';
            })


            // show index2
            //document.getElementById('index2').style.display = "block";

            //alert("you've been authenticated")

            // getTopTracks()
            // getTopArtists()
            
            var startTime = performance.now();
            loadUserData()
            .then(function(data) {
                console.log("ya boy");
                generateReceipt(data);
                var endTime = performance.now();
                console.log(`took ${endTime - startTime}`);
            })
            .catch((error) => {
                console.log(error);
            })


        } else {
            // USER NOT YET AUTHENTICATED
            //document.getElementById('hide-me').style.display = "block";
        }
    }
);

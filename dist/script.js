SPOTIFY_CLIENT_ID = "0477e88f92c641fda1fb6e5fdbe5af37"
SPOTIFY_REDIRECT_URI = "https://backback12.github.io/spotify-top-tracks/"
SPOTIFY_REDIRECT_URI = "http://127.0.0.1:5500/"

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

function getSpotify(url, callback=sendOutput) {
    url = "https://api.spotify.com/v1" + url
    $.ajax(url, {
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
    });
}

topTracks = [];
topArtists = [];
readyState = 0;

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
}

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
function generateReceipt() {
    const imgWidth = 2000;
    const imgHeight = 1333;
    const canvasWidth = 300;
    const canvasHeight = 600;

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    let img = document.createElement("img");
    img.src = "lib/paper.jpg";
    //document.body.appendChild(img);
    

    img.addEventListener("load", () => {
        ctx.drawImage(img, 
            - Math.random() * (imgWidth - canvasWidth),     // random x
            - Math.random() * (imgHeight - canvasHeight));  // random y

        //ctx.font = "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
        ctx.font = "24px 'Merchant Copy', 'Courier new', 'Consolas', 'Monaco', sans-serif"
        ctx.textAlign = "center";
        ctx.fillText("Shut the fuck up", 150, 100);
        ctx.fillText("------------------------------", 150, 180);
        ctx.fillText("Nobody cares about", 150, 300);
        ctx.fillText("your taste in music", 150, 320);
    });
}


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
            getUserTop();

            generateReceipt();

        } else {
            // USER NOT YET AUTHENTICATED
            //document.getElementById('hide-me').style.display = "block";
        }
    }
);

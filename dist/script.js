SPOTIFY_CLIENT_ID = "0477e88f92c641fda1fb6e5fdbe5af37"
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

function getTopTracks() {
    getSpotify("/me/top/tracks?limit=20&offset=0&time_range=" + 'short_term', 
    function(res) {topTracks[0] = res;})

    getSpotify("/me/top/tracks?limit=20&offset=0&time_range=" + 'medium_term', 
    function(res) {topTracks[1] = res;})

    getSpotify("/me/top/tracks?limit=20&offset=0&time_range=" + 'long_term', 
    function(res) {topTracks[2] = res;})
}
function getTopArtists() {
    getSpotify("/me/top/artists?limit=20&offset=0&time_range=" + 'short_term', 
    function(res) {topArtists[0] = res;})

    getSpotify("/me/top/artists?limit=20&offset=0&time_range=" + 'medium_term', 
    function(res) {topArtists[1] = res;})

    getSpotify("/me/top/artists?limit=20&offset=0&time_range=" + 'long_term', 
    function(res) {topArtists[2] = res;})
}




function generateImage() {
    
}


$(document).ready(
    function() {
        var args = parseArgs();

        if ('error' in args) {
            alert("Error in getting Spotify authorization");
            //$("#go").show();
            //$("#go").on('click', function() {
            //    authorizeUser();
            //});
        } else if ('access_token' in args) {
            // USER IS AUTHENTICATED

            accessToken = args['access_token'];
            
            // hide auth button
            // document.getElementById('index1').style.display = 'none';
            //document.getElementById('index1').style.display = 'none';
            // $("#index2").show()
            //$("AuthButton").hide()

            // Hide Index1
            document.getElementById('index1').style.display = "none";
            document.getElementById('index2').style.display = "block";

            //alert("you've been authenticated")

            getTopTracks()
            getTopArtists()

        } else {
            // USER NOT YET AUTHENTICATED
            /*
            $("#go").show();
            $("#go").on('click', function() {
                authorizeUser();
            });
            */
        }
    }
);
function authorizeUser() {
    //var scopes = 'playlist-read-private playlist-modify-private playlist-modify-public';
    const scopesList = [//'ugc-image-upload',
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
                'user-follow-read',
                //'user-library-modify',
                'user-library-read',
                //'user-read-email',
                //'user-read-private'];
    var scopes = scopesList.join(' ');
    //var scopes = string.concat()

    var url = 'https://accounts.spotify.com/authorize?client_id=' + SPOTIFY_CLIENT_ID +
        '&response_type=token' +
        '&scope=' + encodeURIComponent(scopes) +
        '&redirect_uri=' + encodeURIComponent(SPOTIFY_REDIRECT_URI);
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

function getSpotify(url, data=null, callback=sendOutput) {
    url = "https://api.spotify.com/v1" + url
    $.ajax(url, {
        dataType: 'json',
        data: data,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function(r) {
            callback(r, true);
        },
        error: function(r) {
            callback(r, true);
        }
    });
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
            //document.getElementById('AuthButton').style.display = 'none';
            //$("AuthButton").hide()

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
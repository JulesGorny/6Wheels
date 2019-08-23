$(document).ready(function() {

    var map = L.map('mapid').setView([45.815010, 15.981919], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 20,
        id: 'mapbox.streets',
        accessToken: 'token.to.enter'
    }).addTo(map);

    readPosts(map);
    
    var marker1 = L.marker([46.566250, 3.335290]).addTo(map);
    $(marker1).bind('click', {id: 11}, onMarkerClick);

    var marker2 = L.marker([48.862725, 2.287592]).addTo(map);
    $(marker2).bind('click', {id: 12}, onMarkerClick);
});

function onMarkerClick(event) {
    $(".js-cd-panel-" + event.data.id).addClass("cd-panel--is-visible")
}

function closeSlidePanel(i) {
    $(".js-cd-panel-" + i).removeClass("cd-panel--is-visible")
}

function createSlidePanel(index, title, photos_count, text) {
    var html = "";

    html += "<div class=\"cd-panel cd-panel--from-right js-cd-panel-" + index + "\" style=\"z-index: 999; margin-top:59px;\">";
    html += "<header class=\"cd-panel__header\">";
    html += "<h1>" + title + "</h1>";
    html += "<a onClick=\"closeSlidePanel(" + index + ");\" class=\"cd-panel__close js-cd-close\">Close</a>";
    html += "</header>";
    html += "<div class=\"cd-panel__container\">";
    html += "<div class=\"cd-panel__content\" style=\"margin-top:59px;\">";
    html += text;

    // Images
    var imgPath = "posts/" + title + "/0.png"; 
    html += "<a data-fancybox=\"gallery\" href=\"" + imgPath + "\"><img src=\"" + imgPath + "\"></a>"

    html += "</div>";
    html += "</div>";
    html += "</div>";

    return $.parseHTML(html)[0];
}

function readPosts(map) {
    $.ajax({
		type: 'GET',
        url: './posts/posts_lists.json',
		dataType: 'json',
		success: function(json) {
			json.posts.forEach(function (post, index)  {
                // For each post we have from Imgur
                console.log(index + ' - ' + post);
                $.ajax({
                    type: 'GET',
                    url: './posts/' + post + '/content.json',
                    dataType: 'json',
                    success: function(json) {
                        console.log(json.photos_count);
                        console.log(json.text_fr);
                        console.log(json.text_en);
                        console.log(json.lat);
                        console.log(json.long);
                        // With the post content, we create a new slide panel
                        // Check the title lenght
                        if (post.length > 45) {
                            post = post .substring(0, 45) + "..."
                        }
                        var postElement = createSlidePanel(index, post, json.photos_count, json.text_fr);
                        $( "#posts_panels" ).append(postElement);

                        // and we associate it with a marker on the map
                        var marker = L.marker([parseFloat(json.lat), parseFloat(json.long)]).addTo(map);
                        $(marker).bind('click', {id: index}, onMarkerClick);
                    },
                    error: function(err) {
                        console.log('error', err);
                    }
                });
            });
		},
		error: function(err) {
			console.log('error', err);
		}
    });
}
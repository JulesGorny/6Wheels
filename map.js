$(document).ready(function() {

    $("#navbar").css("background-color", "");

    var map = L.map('mapid', { zoomControl:false }).setView([45.815010, 15.981919], 5);
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

function createSlidePanel(index, slugifiedTitle, title, photos_count, text) {
    var html = "";
    var originalTitle = title;

    // Check the title lenght and cut if too long
    if (title.length > 100) {
        title = title.substring(0, 100) + " ...";
    }

    html += "<div class=\"cd-panel cd-panel--from-right js-cd-panel-" + index + "\" style=\"z-index: 999; margin-top:55px;\">";
    html += "<header class=\"cd-panel__header\">";
    html += "<h1 class=\"fontTitle2\" style=\"padding-top: .2em;\">" + title + "</h1>";
    html += "<a onClick=\"closeSlidePanel(" + index + ");\" class=\"cd-panel__close js-cd-close\">Close</a>";
    html += "</header>";
    html += "<div class=\"cd-panel__container\">";
    html += "<div class=\"cd-panel__content\" style=\"margin-top:55px; text-align: justify;\">";

    html += "<div style=\"margin-top: 1em; margin-bottom: 2.5em;\">";
    // Foreach images
    for (var i = 0; i < photos_count; i++) {
        if (i % 3 == 0) {
            html += "<div class=\"row\">";
        }

        html += "<div class=\"col-md-4 col-centered\" style=\"padding-right:1em; padding-top:1em;\" >";
        var imgPath = "posts/" + originalTitle + "/" + i + ".png";
        var imgSmallPath = "posts/" + slugifiedTitle + "/" + i + "_small.png";
        html += "<a data-fancybox=\"gallery\" href=\"" + imgPath + "\">";
        html += "<img src=\"" + imgSmallPath + "\" class = \"img-fluid\">";
        html += "<div class=\"d-none d-md-block\" style=\"padding-bottom: 2em;\"></div>";
        html += "</a>";
        html += "</div>";

        if (i % 3 == 2) {
            html += "</div>";
        }
    }
    html += "</div>";

    html += "<p class=\"fontText\" style=\"padding-top: 2em; padding-bottom: 3em;\">" + text + "</p>";

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
            console.log(json);
			json.posts.forEach(function (post, index)  {
                // For each post we have from Imgur
                $.ajax({
                    type: 'GET',
                    url: './posts/' + post + '/content.json',
                    dataType: 'json',
                    success: function(json) {
                        console.log(json);
                        // With the post content, we create a new slide panel
                        var postElement = createSlidePanel(index, post, json.title, json.photos_count, json.text_fr);
                        $( "#posts_panels" ).append(postElement);

                        // and we associate it with a marker on the map
                        var marker = L.marker([parseFloat(json.lat), parseFloat(json.long)]).addTo(map);
                        $(marker).bind('click', {id: index}, onMarkerClick);
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
            });
		},
		error: function(err) {
			console.log('error', err);
		}
    });
}
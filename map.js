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

function createSlidePanel(index, title, photos_count, text) {
    var html = "";
    var originalTitle = title;

    // Check the title lenght and cut if too long
    if (title.length > 100) {
        title = title.substring(0, 100) + "...";
    }

    html += "<div class=\"cd-panel cd-panel--from-right js-cd-panel-" + index + "\" style=\"z-index: 999; margin-top:55px;\">";
    html += "<header class=\"cd-panel__header\">";
    html += "<h1 style=\"padding-top: 0.4em;\">" + title + "</h1>";
    html += "<a onClick=\"closeSlidePanel(" + index + ");\" class=\"cd-panel__close js-cd-close\">Close</a>";
    html += "</header>";
    html += "<div class=\"cd-panel__container\">";
    html += "<div class=\"cd-panel__content\" style=\"margin-top:55px; text-align: justify;\">";

    // Images
    html += "<div style=\"margin-top: 1em; margin-bottom: 2.5em;\">";

    html += "<div class=\"row\" style=\"margin-bottom:1em;\">";
    html += "<div class=\"col-md-6 col-centered\">";
    var img0Path = "posts/" + originalTitle + "/0.jpg";
    var img0SmallPath = "posts/" + originalTitle + "/0_small.jpg"; 
    html += "<a data-fancybox=\"gallery\" href=\"" + img0Path + "\" style=\"padding-right:1em; padding-top:1em;\"><img src=\"" + img0SmallPath + "\"></a>"
    html += "</div>";

    html += "<div class=\"col-md-6 col-centered\">";
    var img1Path = "posts/" + originalTitle + "/1.jpg";
    var img1SmallPath = "posts/" + originalTitle + "/1_small.jpg"; 
    html += "<a data-fancybox=\"gallery\" href=\"" + img1Path + "\" style=\"padding-right:1em; padding-top:1em;\"><img src=\"" + img1SmallPath + "\"></a>"
    html += "</div>";
    html += "</div>";

    html += "<div class=\"row\">";
    html += "<div class=\"col-md-6 col-centered\">";
    var img2Path = "posts/" + originalTitle + "/2.jpg";
    var img2SmallPath = "posts/" + originalTitle + "/2_small.jpg"; 
    html += "<a data-fancybox=\"gallery\" href=\"" + img2Path + "\" style=\"padding-right:1em; padding-top:1em;\"><img src=\"" + img2SmallPath + "\"></a>"
    html += "</div>";

    html += "<div class=\"col-md-6 col-centered\">";
    var img3Path = "posts/" + originalTitle + "/3.jpg";
    var img3SmallPath = "posts/" + originalTitle + "/3_small.jpg"; 
    html += "<a data-fancybox=\"gallery\" href=\"" + img3Path + "\" style=\"padding-right:1em; padding-top:1em;\"><img src=\"" + img3SmallPath + "\"></a>"
    html += "</div>";
    html += "</div>";

    html += "</div>";

    html += "<p>" + text + "</p>";

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
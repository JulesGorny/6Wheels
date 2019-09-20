$(document).ready(function() {

    openNav();

    $("#navbar").css("background-color", "");

    var map = L.map('mapid', { zoomControl:false }).setView([45.815010, 15.981919], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: '&copy; Openstreetmap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 20
    }).addTo(map);

    readPosts(map);
});

function onMarkerClick(event) {
    $(".js-cd-panel-" + event.data.id).addClass("cd-panel--is-visible")
}

function closeSlidePanel(i) {
    $(".js-cd-panel-" + i).removeClass("cd-panel--is-visible")
}

/* Open when someone clicks on the span element */
function openNav() {
    document.getElementById("myNav").style.width = "100%";
}
  
/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
} 

function createSlidePanel(index, slugifiedTitle, title, photos_count, text) {
    var html = "";

    // Check the title lenght and cut if too long
    if (title.length > 100) {
        title = title.substring(0, 100) + " ...";
    }

    html += "<div class=\"cd-panel cd-panel--from-right js-cd-panel-" + index + "\" style=\"z-index: 999; margin-top:55px;\">";
    html += "<header class=\"cd-panel__header\">";
    html += "<h1 class=\"fontTitleMap\" style=\"position:absolute; bottom:0.15rem;\">" + title + "</h1>";
    html += "<a onClick=\"closeSlidePanel(" + index + ");\" class=\"cd-panel__close js-cd-close\">Close</a>";
    html += "</header>";
    html += "<div class=\"cd-panel__container\">";
    html += "<div class=\"cd-panel__content\" style=\"margin-top:20px; text-align: justify;\">";

    html += "<div style=\"margin-top: 1em; margin-bottom: 2.5em;\">";
    // Foreach images
    for (var i = 0; i < photos_count; i++) {
        if (i % 3 == 0) {
            html += "<div class=\"row\">";
        }

        html += "<div class=\"col-md-4 col-centered\" style=\"padding-right:1em; padding-top:1em;\" >";
        var imgPath = "posts/" + slugifiedTitle + "/" + i + ".png";
        var imgSmallPath = "posts/" + slugifiedTitle + "/" + i + "_small.png";
        html += "<a data-fancybox=\"gallery\" href=\"" + imgPath + "\">";
        html += "<img src=\"" + imgSmallPath + "\" class = \"img-fluid\">";
        html += "<div class=\"d-none d-md-block\" style=\"padding-bottom: 1em;\"></div>";
        html += "</a>";
        html += "</div>";

        if (i % 3 == 2) {
            html += "</div>";
        }
    }
    html += "</div>";

    html += "<p class=\"fontText\" style=\"padding-top: 1em; padding-bottom: 3em; font-size: 1em;\">" + text + "</p>";

    html += "</div>";
    html += "</div>";
    html += "</div>";

    return $.parseHTML(html)[0];
}

function connectTheDots(data){
    var c = [];
    for(i in data) {
        var x = data.lat;
        var y = data.long;
        c.push([x, y]);
    }
    return c;
}

function readPosts(map) {
    $.ajax({
        type: 'GET',
        url: './posts/posts_lists.json',
        async: false,
        dataType: 'json',
        success: function(json) {            
            var bikeIcon = L.icon({
                iconUrl: 'img/Icons/cycling.png',                    
                iconSize: [40, 40], // size of the icon
                iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
            });    
            
            var markerIcon = L.icon({
                iconUrl: 'img/Icons/marker.png',            
                iconSize: [30, 30], // size of the icon
                iconAnchor: [15, 30], // point of the icon which will correspond to marker's location
            });
            
            var allLatLong = [];
            var ourWayPathLength = json.posts.length-2;
            json.posts.forEach(function (post, index)  {

                // For each post we have from Imgur
                $.ajax({
                    type: 'GET',
                    url: './posts/' + post + '/content.json',
                    async: false,
                    dataType: 'json',
                    success: function(json) {
                        // With the post content, we create a new slide panel
                        var postElement = createSlidePanel(index, post, json.title, json.photos_count, json.text_fr);
                        $( "#posts_panels" ).append(postElement);

                        // draw line
                        if(index < ourWayPathLength)
                        {
                            allLatLong.push([parseFloat(json.lat), parseFloat(json.long)]);
                
                            if(allLatLong.length > 2) // Remove first element so we just keep the two lasts
                                allLatLong.splice(0, 1);
                            if(allLatLong.length > 1)
                                L.polyline(allLatLong).addTo(map);
                        }

                        // and we associate it with a marker on the map
                        if (index == 0) {    
                            var bike = L.marker([parseFloat(json.lat), parseFloat(json.long)], {icon: bikeIcon}).addTo(map);
                            $(bike).bind('click', {id: index}, onMarkerClick);
                        } 
                        else { 
                            var marker = L.marker([parseFloat(json.lat), parseFloat(json.long)], {icon: markerIcon}).addTo(map);
                            $(marker).bind('click', {id: index}, onMarkerClick);

                            map.on('zoomend', function() {
                                var currentZoom = map.getZoom();
                                console.log(currentZoom);
                                if(currentZoom < 6)
                                {
                                    var dotIcon = L.icon({
                                        iconUrl: 'img/Icons/Dot.png',            
                                        iconSize: [currentZoom*2, currentZoom*2], // size of the icon
                                        iconAnchor: [currentZoom, currentZoom], // point of the icon which will correspond to marker's location
                                    });

                                    marker.setIcon(dotIcon);
                                }
                                else
                                    marker.setIcon(markerIcon);
                            });
                        }
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


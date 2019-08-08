$( document ).ready(function() {

    var mymap = L.map('mapid').setView([45.815010, 15.981919], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 20,
        id: 'mapbox.streets',
        accessToken: 'token.to.enter'
    }).addTo(mymap);

    var marker1 = L.marker([46.566250, 3.335290]).addTo(mymap);
    $(marker1).bind('click', {id: 1}, onMarkerClick);

    var marker2 = L.marker([48.862725, 2.287592]).addTo(mymap);
    $(marker2).bind('click', {id: 2}, onMarkerClick);
});

function onMarkerClick(event) {
    $(".js-cd-panel-" + event.data.id).addClass("cd-panel--is-visible")
}

function closeSlidePanel(i) {
    $(".js-cd-panel-" + i).removeClass("cd-panel--is-visible")
}
$( document ).ready(function() {
    
	/* Index - MAP part */
	if ($("#mapid").length) {
		var mymap = L.map('mapid').setView([45.815010, 15.981919], 5);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
			maxZoom: 18,
			id: 'mapbox.streets',
			accessToken: 'token.to.enter'
		}).addTo(mymap);
		var marker1 = L.marker([46.566250, 3.335290], {icon:tentIcon}).addTo(mymap);
		marker1.on('click', onMarker1Click);
		var marker2 = L.marker([46.987179, 3.161600], {icon:treeIcon}).addTo(mymap);
		marker2.on('click', onMarker1Click);
		var marker3 = L.marker([47.559601, 7.588576], {icon:tentIcon}).addTo(mymap);
		marker3.on('click', onMarker1Click);
		var marker4 = L.marker([45.464203, 9.189982], {icon:tentIcon}).addTo(mymap);
		var marker5 = L.marker([42.650661, 18.094423], {icon:tentIcon}).addTo(mymap);
		var marker6 = L.marker([41.008240, 28.978359], {icon:tentIcon}).addTo(mymap);
		
		var pointA = new L.LatLng(46.566250, 3.335290);
		var pointB = new L.LatLng(47.559601, 7.588576);
		var pointList = [pointA, pointB];

		var firstpolyline = new L.Polyline(pointList, {
			color: 'red',
			weight: 3,
			opacity: 0.5,
			smoothFactor: 1
		});
		firstpolyline.addTo(mymap);
	}
	
	
	/* Common */
	/* TEXT AND TRANSLATION PART */
	// Get langage in url
	var url = new URL(window.location.href);
	var l = url.searchParams.get("l");
	if (!l) {
		// If no lang in url, take the browser default
		l = navigator.language.toLowerCase().includes("fr") ? "fr" : "en";
	}
	loadContentText(l);
	
});

function onMarker1Click(e) {
	open("https://imgur.com/gallery/JzDOBP3","_blank")
}

var tentIcon = L.icon({
    iconUrl: 'img/tent.png',
    iconSize:     [26.4, 23.2], // size of the icon
});

var treeIcon = L.icon({
    iconUrl: 'img/tree.png',
    iconSize:     [26.4, 23.2], // size of the icon
});

function translateTo (lang) {
	location.href =  window.location.href.split('?')[0] + "?l=" + lang;
}

function loadContentText (lang) {
	// Get json file which contains all texts and translations
	
	$.ajax({
		type: 'GET',
		url: 'https://raw.githubusercontent.com/JulesGorny/JulesGorny.github.io/master/content-text.json',
		dataType: 'json',
		success: function(json) {
		  // Set the text where it belongs
		  $("#mossy_title_1").html(json.mossy_title_1[lang]);
		  $("#mossy_text_1").html(json.mossy_text_1[lang]);
		  
		  
		  
		},
		error: function(err) {
			console.log('error', err);
		}
  });
 
}

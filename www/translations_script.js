$( document ).ready(function() {
	/* COMMON FOR ALL PAGES */
	/* TEXT AND TRANSLATION PART */
	// Get langage in url
	var url = new URL(window.location.href);
	var l = url.searchParams.get("l");
	if (l) {
		// If lang in URL, append lang parameter to all links in the page
		$("a").each(function (index, value) {
			value.href = value.href.split('?')[0] + "?l=" + l;
		});
	} else {
		// If no lang in URL, take the browser default
		l = navigator.language.toLowerCase().includes("fr") ? "fr" : "en";
	}
	loadContentText(l);
});

function translateTo (lang) {
	var basehref = window.location.href.split('#')[0].split('?')[0];
	location.href = basehref + "?l=" + lang;
}

function loadContentText (lang) {
	// Get json file which contains all texts and translations

	$.ajax({
		type: 'GET',
		url: 'translations.json',
		dataType: 'json',
		success: function(json) {
			// Set the text where it belongs
			// (any element with given ID)
			Object.keys(json).forEach((key) => {
				$("#" + key ).html(json[key][lang]);
			});
		},
		error: function(err) {
			console.log('error', err);
		}
	});
}
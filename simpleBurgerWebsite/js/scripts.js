let open = false;

function setLinkVisible(value) {
	for (i = 0; i < document.getElementById('navbar').getElementsByClassName('mobile-hide').length; i++) {
		if (value) {
			document.getElementById('navbar').style.height = "auto";
			document.getElementById('navbar').getElementsByClassName('mobile-hide')[i].style.visibility = 'visible';
			open = true;
		}
		else {
			document.getElementById('navbar').style.height = "80px";
			document.getElementById('navbar').getElementsByClassName('mobile-hide')[i].removeAttribute('style');
			open = false;
		}
	}
}

function toggleNav() {
	if (open) {
		setLinkVisible(false);
	}
	else {
		setLinkVisible(true);
	}
}

function toggleDisplay(value) {
	let displayElement = document.getElementById(value);
	if (displayElement.style.display === "none") {
		displayElement.style.display = "block";
	}
	else {
		displayElement.style.display = "none";
	}
}
document.addEventListener('DOMContentLoaded', function () {

	function isBlank(str) {
	    return (!str || /^\s*$/.test(str));
	}

	function addClass(el, className) {
		if (el.classList) {
			el.classList.add(className);
		}
		else {
			el.className += ' ' + className;
		}
	}

	function removeClass(el, className) {
		if (el.classList)
			el.classList.remove(className);
		else
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}

	function addError(el, errorString) {
		if (el.errorState == false) {
			addClass(el, 'error');
	    	var span = document.createElement("span");
			span.id = "error-message";
			span.innerHTML = errorString;
			el.parentElement.appendChild(span);
			el.errorState = true;
			el.focus();
		}
	}

	function removeErrors(el) {
		console.log("Removing errors for " + el.id)
		if (el.errorState == true) {
			removeClass(el, 'error');
			el.parentElement.querySelector('#error-message').remove();
			el.errorState = false;
		}
	}

	function checkBlank(el, strFriendlyName) {
		if (isBlank(el.value)) {
			addError(el, strFriendlyName + " can't be blank");
			return true;
		}
		else {
			removeErrors(el);
			return false;
		}
	}

	function checkButton() {
		console.log("checking button")
		if (inputEmail.errorState || inputName.errorState) {
			btn.disabled = true;
		}
		else {
			btn.disabled = false;
		}
	}

	function checkUniqueEmail(email){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', encodeURI('check?email=' + email));
		xhr.onload = function() {
		    if (xhr.status === 200) {
		    	document.querySelector("#loading").remove();
		        if (xhr.responseText == 'OK') {
		        	document.querySelector("form").submit();
		        }
		        else {
					addClass(inputEmail, 'error')
			    	var span = document.createElement("span");
					span.id = "email-error";
					span.innerHTML = "Email is already registered";
					inputEmail.parentElement.appendChild(span);
					inputEmail.errorState = true;
					inputEmail.focus();
		        }
		    }
		    else {
		        alert('Request failed.  Returned status of ' + xhr.status);
		    }
		};
		xhr.send();
		var div = document.createElement("div");
		div.id = "loading";
		div.innerHTML = "Loading...";
		document.getElementsByTagName('body')[0].appendChild(div);
	}

	var inputEmail = document.querySelector('#email');
	var inputName = document.querySelector('#name');
	var btn = document.querySelector("#checkEmail");

	inputEmail.errorState = false;
	inputName.errorState = false;

	checkButton();

	inputEmail.addEventListener('blur', function() {
		checkBlank(inputEmail, 'Email');
		checkButton();
	});

	inputName.addEventListener('blur', function() {
		checkBlank(inputName, 'Name');
	});

	btn.addEventListener("click", function () {
		if (checkBlank(inputEmail, 'Email') && checkBlank(inputName, 'Name')) {
			console.log("Email or name is blank");
			return false
		} else {
			checkUniqueEmail(email.value);
		}
	});

});

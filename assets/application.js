(function () {

    'use strict';

    var ErrorChecker = function () {
        this.errors = [];
    };

    var InputField = function (element, friendlyName, errorChecker) {

        this.element = document.querySelector(element);
        this.friendlyName = friendlyName;

        this.isBlank = function (str) {
            return (!str || (/^\s*$/).test(str));
        };

        this.addHTMLClass = function (className) {
            if (this.element.classList) {
                this.element.classList.add(className);
            } else {
                this.element.className += ' ' + className;
            }
        };

        this.removeHTMLClass = function (className) {
            if (this.element.classList) {
                this.element.classList.remove(className);
            } else {
                this.element.className = this.element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            }
        };

        this.hasClass = function (className) {
            if (this.element.classList) {
                return this.element.classList.contains(className);
            } else {
                var regex = new RegExp('(^| )' + className + '( |$)', 'gi');
                return regex.test(this.element.className);
            }
        };

        this.checkErrors = function () {
            if (errorChecker.errors.length === 0) {
                document.querySelector("#submit").disabled = false;
            } else {
                document.querySelector("#submit").disabled = true;
            }
        };

        this.addError = function (errorMessage) {
            if (!this.hasClass('error')) {
                this.addHTMLClass('error');
                var span = document.createElement("span");
                span.id = "error-message";
                span.innerHTML = errorMessage;
                this.element.parentElement.appendChild(span);
                this.element.focus();

                errorChecker.errors.push(this.friendlyName);
            }
            this.checkErrors();
        };

        this.removeErrors = function () {
            if (this.hasClass('error')) {
                this.removeHTMLClass('error');
                this.element.parentElement.querySelector('#error-message').remove();
            }
            var index = errorChecker.errors.indexOf(this.friendlyName);
            if (index > -1) {
                errorChecker.errors.splice(index, 1);
            }
            this.checkErrors();
        };

        this.checkEmpty = function () {
            if (this.isBlank(this.element.value)) {
                this.addError(this.friendlyName + " can't be blank");
                return true;
            } else {
                this.removeErrors();
                return false;
            }
        };

        this.checkUniqueEmail = function (callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', encodeURI('check?email=' + this.element.value));
            xhr.onload = function () {
                callback.removeErrors();
                if (xhr.status === 200) {
                    document.querySelector("#loading").remove();
                    if (xhr.responseText !== 'OK') {
                        callback.addError("Email is already registered");
                    }
                } else {
                    console.log('Request failed.  Returned status of ' + xhr.status);
                }
            };
            xhr.send();
            this.addError("Checking...");
        };

    };

    var Form = function (form, errorChecker) {

        this.form = document.querySelector(form);

        var fields = {
            name: {
                id: '#name',
                friendlyName: 'Name',
                selector: document.querySelector('#name'),
                required: true
            },
            email: {
                id: '#email',
                friendlyName: 'Email',
                selector: document.querySelector('#email'),
                required: true,
                uniqueEmail: true
            }
        };

        this.init = function () {
            Object.keys(fields).forEach(function (item) {
                fields[item].selector.addEventListener('blur', function () {
                    var inputField = new InputField(fields[item].id, fields[item].friendlyName, errorChecker);
                    if (fields[item].required) {
                        inputField.checkEmpty();
                    }
                    if (fields[item].uniqueEmail) {
                        inputField.checkUniqueEmail(inputField);
                    }
                });
            });
            document.querySelector("#submit").disabled = true;
        };

    };

    document.addEventListener('DOMContentLoaded', function () {

        var errorChecker = new ErrorChecker();
        errorChecker.errors.push("Name");
        errorChecker.errors.push("Email");

        var form = new Form('#new', errorChecker);
        form.init();

    });

}());

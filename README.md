# form-state-handler
a state-handler for html-forms and its inputfields
Forms in html and js are not easy to handle. This package tries to create the managing of forms more easyily, more concretly: receiving values, validatiting forms and inputfields and styling.

## Overview
The basic idea was to cover the lifecycle of a form and its inputfields. From creation (pristine), to editing the data and till submittion of the form.

A form or an inputfield can have the following states:
 * valid (all requirements are satisfied)
 * dirty (the form/inputfield is edited)
 * touched (the user has its focus)
 * pristine (the form/inputfield is not dirty AND not touched (it hasn't experienced a change))

All this states are written as attributes to the dom-element so it state can be easily accessed via css.

**example:**

```html
<input name="textfield" type="text" valid="true" pristine="true" dirty="false" touched="false">
```

```css
input[name="textfield"][valid="false"] {
	background: red;
}
```

This example would render the the inputfield red if the element hasn't a valid state.

## Usage
This package provides 2 classes:
* FormStateHandler (handles a form with all its inputfields)
* InputField (handles a single inputfield)

To use this package every inputfield needs a name, so its value can be correctly accessed (needs to unique within a form).

```js
const formElement = document.querySelector("#form");

const stateHandler = new FormStateHandler(formElement);

function login() {
	const stateOfForm = stateHandler.getFormData();
	console.log(stateOfForm);
}
```

This example will render the state of a form and every of its inputfields to the according dom-elements where it can be easily accessed:
```html
<form id="form" valid="true" dirty="false" touched="false" pristine="true">
	<input type="text" name="email" valid="true" pristine="true" dirty="false" touched="false">
	<input type="password" name="password" required="" valid="true" pristine="true" dirty="false" touched="false">
	<button onclick="login()">Login</button>
</form>
```

And the output of the `statehandler.getFormDate()` function will be something like this:
```json
{
	"email": "example@mail.net",
	"password": "secret"
}
```
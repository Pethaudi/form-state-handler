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
Install with: `npm i form-state-handler`. (When using without npm, you can download the repo, remove the exports lines at the end of the file, run `npm run build` and use the file under `/lib`)

This package provides 2 classes:
* FormStateHandler (handles a form/container with all its inputfields)
* InputField (handles a single inputfield)

To use this package every inputfield needs a name, so its value can be correctly accessed (needs to unique within a form).

```js
const formElement = document.querySelector("#form");

const stateHandler = new FormStateHandler(formElement);

function login() {
	const stateOfForm = stateHandler.getFormData();
	console.log(stateOfForm);
}

// for one single inputfield
const inputElement = document.querySelector("#input");

const inputHandler = new InputField(inputElement);
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

### Constraints
There are several thing you can check for on an inputfield (everything represents its own attribute where you pass the value):
 * required (element must be given)
 * regex (a regex, for example: ^[ab]+$)
 * min (minimum value of a numeric input)
 * max (maximum value of a numeric input)
 * minStrLength (minimum length of the input string, additional you can use the minlength attribute, but then the user can't input less then x characters)
 * maxStrLength (maximum length of the input string, additional you can use the maxlength attribute, but then the user can't input more then x characters)

*Additional: if the input has the type email, the input gets checked seperatly from the standard html-validation for maximum flexibility*

**example:**
```html
<input type="text" regex="^[a-zA-Z0-9]*$" minStrLength="1" maxStrLength="5" required>
```

## Documenation

This package consists of 2 classes:
 * FormStateHandler
 * InputField

### FormStateHandler
This class handles a whole form/container and the states of its inputfields.

#### methodes
**constructor(element, stateChangesCallback)**
Creates the FormStateHandler, queries for possible inputfields under the form/container and applies the current state to the given element.
*params*
 * element: domelement of the form/container
 * stateChangesCallback: callbackfunction(currentState, oldState), gets called if the state of the form/container changes (state contains the following fields: valid, dirty, touched)

**reset()**
Resets the FormStateHandler to its initial state (including all inputfields).

**getInputField(name)**
Returns the InputField-Object (not the domelement) of the given name.
*params*
 * name: name of the inputfield

**getDomElement(name)**
Returns the domelement of the given name.
*params*
 * name: name of the inputfield

**getContentOf(name)**
Returns the current value of the given name.
*params*
 * name: name of the inputfield

**getFormData()**
Returns the value for every inputfield in the form/container in the form of:
```json
{
	"name of inputfield": "value of inputfield",
	....
}
```

#### getters/setters
Those should self-explanatory.
**get isPristine**
**get isValid**
**get isDirty**
**get isTouched**

### InputField
This class handles on single inputfield and its state.

#### methodes
**constructor(element, stateChangesCallback)**
Creates the InputField and applies the current state to the given element.
*params*
 * element: domelement of the inputfield
 * stateChangesCallback: callbackfunction(currentState), gets called if the state of the inputfield gets assigned (state contains the following fields: valid, dirty, touched)

**reset()**
Resets the inputfield.

**validate()**
validates the inputfield and assigns the new state.

#### getters/setters
Those should self-explanatory.
**get/set content**
**get name**
**get isPristine**
**get isValid**
**get isDirty**
**get isTouched**

## Contribute/Support
feel free to message me:
pethaudi@yahoo.de
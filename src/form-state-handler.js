/**
 * manages an entire form and all containing inputfields
 */
class FormStateHandler {
	constructor(element) {
		this.element = element;
		this.states = {
			valid: false,
			dirty: false,
			touched: false
		};

		// initializing the input fields
		this.inputFields = {};
		for (let field of this.element.querySelectorAll("input")) {
			const newField = new InputField(field, (state) => this.fieldChanged(state));

			if (Object.keys(this.inputFields).find(key => key === newField.name)) {
				throw new Error("2 Element must not have the same name");
			}

			this.inputFields[newField.name] = newField;
		}
	}

	/**
	 * resets the whole form
	 */
	reset() {
		for (let key of Object.keys(this.inputFields)) {
			this.inputFields[key].reset();
		}
	}

	/**
	 * assigns the current state of the element
	 */
	assignCurrentState() {
		for (let key of Object.keys(this.states)) {
			this.element.setAttribute(key, this.states[key]);
		}

		this.element.setAttribute("pristine", this.isPristine);
	}

	/**
	 * gets invoked from a changed input field and updates the state of the form
	 */
	fieldChanged(state) {
		let checkValid = false;
		let checkDirty = false;
		let checkTouched = false;

		if (!state.valid) {
			this.states.valid = false;
		} else {
			checkValid = true;
		}

		if (state.dirty) {
			this.states.dirty = true;
		} else {
			checkDirty = true;
		}

		if (state.touched) {
			this.states.touched = true;
		} else {
			checkTouched = true;
		}

		for (let key of Object.keys(this.inputFields)) {
			const field = this.inputFields[key];
			if (checkValid && !field.isValid) {
				checkValid = false;
			}

			if (checkDirty && field.isDirty) {
				checkDirty = false;
			}

			if (checkTouched && field.isTouched) {
				checkTouched = false;
			}
		}

		this.states.valid = checkValid;
		this.states.dirty = !checkDirty;
		this.states.touched = !checkTouched;

		this.assignCurrentState();
	}

	/**
	 * returns true if every field is pristine
	 */
	get isPristine() {
		return !this.states.dirty && !this.states.touched
	}

	/**
	 * returns true if every field is valid
	 */
	get isValid() {
		return this.states.valid;
	}

	/**
	 * returns true if one field is dirty
	 */
	get isDirty() {
		return this.states.dirty;
	}

	/**
	 * returns the inputfield-object of the given name in the given form
	 */
	getInputField(name) {
		return this.inputFields[name];
	}

	/**
	 * returns the dom-element of the wanted element
	 */
	getDomElement(name) {
		return this.inputFields[name].element;
	}

	/**
	 * returns the content of the inputfield-object
	 */
	getContentOf(name) {
		return this.inputFields[name].content;
	}

	/**
	 * returns a json where every key represents an inputfield and the value of the key the value of the inputfield
	 */
	getFormData() {
		const res = {};
		for (let key of Object.keys(this.inputFields)) {
			res[key] = this.inputFields[key].content;
		}
		return res;
	}
}

/**
 * manages one inputfield and its state
 */
class InputField {
	constructor(element, stateChangesCallback) {
		this.element = element;

		if (!this.element.getAttribute("name")) {
			throw new Error("every input-field needs a name.")
		}

		this.required = this.element.getAttribute("required");
		this.pattern = this.element.getAttribute("regex");
		this.min = parseInt(this.element.getAttribute("min"));
		if (isNaN(this.min)) {
			this.min = null;
		}
		this.max = parseInt(this.element.getAttribute("max"));
		if (isNaN(this.max)) {
			this.max = null;
		}
		this.minLength = parseInt(this.element.getAttribute("minStrLength"));
		if (isNaN(this.minLength)) {
			this.minLength = null;
		}
		this.maxLength = parseInt(this.element.getAttribute("maxStrLength"));
		if (isNaN(this.maxLength)) {
			this.maxLength = null;
		}
		this.email = this.element.getAttribute("type") === "email";

		this.stateChangesCallback = stateChangesCallback;
		this.states = {};
		this.originalContent = this.content;
		this.initState();
		this.validate();
		this.assignCurrentState();
		
		// assigin function calls with eventual previous assigned functions
		this.previousOnFocus = this.element.onfocus;
		this.previousOnBlur = this.element.onblur;
		this.previousOnInput = this.element.oninput;

		if (this.previousOnFocus) {
			this.element.onfocus = ($event) => {
				this.onFocus(this);
				this.previousOnFocus($event);
			};
		} else {
			this.element.onfocus = () => {
				this.onFocus(this);
			}
		}

		if (this.previousOnBlur) {
			this.element.onblur = ($event) => {
				this.onBlur(this);
				this.previousOnBlur($event);
			}
		} else {
			this.element.onblur = () => {
				this.onBlur(this);
			};
		}

		if (this.previousOnInput) {
			this.element.oninput = ($event) => {
				this.onInput(this)
				this.previousOnInput($event)
			}
		} else {
			this.element.oninput = () => {
				this.onInput(this);
			};
		}
	}

	get content() {
		return this.element.value;
	}

	set content(value) {
		this.element.value = value;
		this.validate();
	}

	get name() {
		return this.element.getAttribute("name");
	}

	get isDirty() {
		return this.states.dirty;
	}

	get isValid() {
		return this.states.valid;
	}

	get isTouched() {
		return this.states.touched;
	}

	get isPristine() {
		return !this.states.touched && !this.states.dirty;
	}

	/**
	 * sets the initial states
	 */
	initState() {
		this.content = this.originalContent;
		this.states = {
			valid: false,
			dirty: false,
			touched: false
		};
		this.validate();
		this.assignCurrentState();
	}

	/**
	 * checks the input field
	 */
	validate() {
		let valid = true;

		if (this.required !== null && this.content.length === 0) {
			valid = false;
		}
		
		if (this.pattern !== null && this.content.match(this.pattern) === null) {
			valid = false;
		}

		if (this.min !== null && (isNaN(this.content) || parseInt(this.content) < this.min)) {
			valid = false;
		}

		if (this.max !== null && (isNaN(this.content) || parseInt(this.content) > this.max)) {
			valid = false;
		}

		if (this.minLength !== null && this.content.length < this.minLength) {
			valid = false;
		}

		if (this.maxLength !== null && this.content.length > this.maxLength) {
			valid = false;
		}

		if (this.email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.content)) {
			valid = false;
		}

		if (this.states.valid !== valid) {
			this.states.valid = valid;
			this.assignCurrentState();
		}
	}

	/**
	 * assigns the current state of the element
	 */
	assignCurrentState() {
		for (let key of Object.keys(this.states)) {
			this.element.setAttribute(key, this.states[key]);
		}
		this.element.setAttribute("pristine", this.isPristine);
		this.stateChangesCallback(this.states);
	}

	onInput(element) {
		if (this.originalContent === this.content) {
			element.states.dirty = false;
		} else {
			element.states.dirty = true;
		}
		element.validate();
		element.assignCurrentState();
	}

	onFocus(element) {
		element.states.touched = true;
		element.assignCurrentState();
	}

	onBlur(element) {
		element.states.touched = false;
		element.assignCurrentState();
	}

	reset() {
		element.initState();
	}
}

exports.FormStateHandler = FormStateHandler;
exports.InputField = InputField;
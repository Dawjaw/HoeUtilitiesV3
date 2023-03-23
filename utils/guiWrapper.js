export class GuiCallbackWrapper {
	constructor(gui) {
		this.gui = gui;
		this.drawCallbacks = [];
		this.clickedCallbacks = [];
		this.mouseDraggedCallbacks = [];
		this.scrolledCallbacks = [];
		this.mouseReleasedCallbacks = [];

		this.gui.registerDraw((x, y) => this.triggerDraw(x, y));
		this.gui.registerClicked((x, y, b) => this.triggerClicked(x, y, b));
		this.gui.registerMouseDragged((x, y, b) => this.triggerMouseDragged(x, y, b));
		this.gui.registerScrolled((x, y, s) => this.triggerScrolled(x, y, s));
		this.gui.registerMouseReleased((x, y, b) => this.triggerMouseReleased(x, y, b));
	}
	
	registerDraw(callback) {
		this.drawCallbacks.push(callback);
	}
	
	registerClicked(callback) {
		this.clickedCallbacks.push(callback);
	}
	
	registerMouseDragged(callback) {
		this.mouseDraggedCallbacks.push(callback);
	}

	registerScrolled(callback) {
		this.scrolledCallbacks.push(callback);
	}

	registerMouseReleased(callback) {
		this.mouseReleasedCallbacks.push(callback);
	}
	
	triggerDraw(x, y) {
		this.drawCallbacks.forEach((callback) => callback(x, y));
	}
	
	triggerClicked(x, y, b) {
		this.clickedCallbacks.forEach((callback) => callback(x, y, b));
	}

	triggerMouseDragged(x, y, b) {
		this.mouseDraggedCallbacks.forEach((callback) => callback(x, y, b));
	}

	triggerScrolled(x, y, s) {
		this.scrolledCallbacks.forEach((callback) => callback(x, y, s));
	}

	triggerMouseReleased(x, y, b) {
		this.mouseReleasedCallbacks.forEach((callback) => callback(x, y, b));
	}
}
function randomID() {  // src: stackoverflow, purpose: random css id
	return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}

class DOMElement {
	constructor(tag = "div", properties = {}, children = [], cssAttributes = {}) {
		this.tag = tag;
		this.properties = properties;
		// tree-parent is a reserved property

		this.cssAttributes = cssAttributes; // updated by frontend in finishEdit
		// unintuitive and implicit - should find a better solution
		// used for updating edit view
		this.children = children;

		this.possibleParent = true;
		this.editable = true;
		this.id = randomID();	
	}

	render() {
		let html = "<" + this.tag;
		for (let property in this.properties) {
			if (property == 'tree-parent') {
				continue;
			}
			let value = this.properties[property];
			html += " " + property + '="' + value + '"';
		}
		html += ">\n";

		let tagContent = "";
		for (let i in this.children) {
			let child = this.children[i];
			tagContent += child.render();
		}

		tagContent = tagContent.replace(/^/gm, "\t");  // nested tabs
		html += tagContent;
		html += "</"+this.tag+">\n";
		return html;
	}

	remove(id) {
		for (let i in this.children) {
			let child = this.children[i];
			if (child.id === id) {
				this.children.splice(i, 1);
				return;
			} else if (child.possibleParent) {
				child.remove(id);
			}
		}
	}
}

class DOMText {
	constructor(message) {
		this.tag = "text";
		this.message = message;
		this.message = this.message.replace("\n", "<br>");
		this.children = [];
		this.verbose = "";
		this.properties = [];

		this.possibleParent = false;
		this.editable = false;
		this.id = randomID();
	}

	render() {
		return this.message+"\n";
	}
}
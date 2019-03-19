function randomID() {  // src: stackoverflow, purpose: random css id
	return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}

class DOMElement {
	constructor(tag = "div", properties = {}, children = []) {
		this.tag = tag;
		this.properties = properties;
		// tree-parent is a reserved property

		this.children = children;
		this.verbose = "";

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

	renderHTML() {
		let html = this.render();
		html = html.replace("\n", "<br>");
		return html;
	}

	remove(id) {
		for (let i in this.children) {
			let child = this.children[i];
			if (child.id === id) {
				this.children.splice(i, 1);
				return;
			}
			child.remove(id);
		}
	}

	describe() {
		let description = "<" + this.tag + "> ";
		description += "element with " + Object.keys(this.properties).length + " properties - '";
		description += this.verbose + "'";

		return description;
	}
}

class DOMText {
	constructor(message) {
		this.message = message;
		this.message = this.message.replace("\n", "<br>");
	}

	render() {
		return this.message+"\n";
	}
}
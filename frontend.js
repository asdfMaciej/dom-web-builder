var Swatches = VueSwatches.Swatches;

Vue.component("element-mini", {
	template: "#element-mini-template",
	props: ['element'],
	methods: {
		remove() {
			this.$parent.element.remove(this.element.id);
		},

		edit() {
			this.$set(this.$root, 'currentElement', this.element);
			this.$root.startEdit();
		},

		add() {
			this.$set(this.$root, 'currentElement', this.element);
			this.$root.startAdd();
		}
	}
});

var app = new Vue({
	el: '#app',
	data: {
		view: 'add-select',
		elementsTree: new DOMElement(
			"div", {'class': 'display-flex min100vh', 'tree-parent': ''}, 
			[
			new DOMElement("div", {'class': 'flex-auto bgred'}),
			new DOMElement("div", {'class': 'flex-200w bgblue'})
			]
		),
		editTag: 'div',
		editStyle: {
			padding: '',
			margin: '',
			border: '',
			color: '',
			display: '',
			'background-color': '',
			'flex-direction': '',
			'flex-wrap': '',
			'justify-content': '',
			'align-items': '',
			'align-content': '',
			'flex': '',
			'max-width': '', 
			'min-width': '', 
			'width': '',
			'max-height': '', 
			'min-height': '', 
			'height': '',
			'overflow': '',
			'border-radius': '',
			'font-size': ''
		},

		templates: {
			'holy-grail': new DOMElement(
				"div", {'tree-parent': '', 'style': 'display: flex; flex-direction: column; min-height: 100vh'}, [
					new DOMElement(
						"div", {'style': "flex: 0 0 200px"}, [], {"flex": "0 0 200px"}
					),
					new DOMElement(
						"div", {'style': 'flex: 1 1 auto;'}, [], 
						{"flex": "1 1 auto"}
					),
					new DOMElement(
						"div", {'style': "flex: 0 0 200px"}, [], {"flex": "0 0 200px"}
					)
				], {"display": "flex", "flex-direction": "column", "min-height": "100vh"}
			)
		},

		addTextarea: '',

		showColor: false,
		showBGColor: false,
		currentElement: null
	},
	methods: {
		clear: function() {
			this.elementsTree = new DOMElement("div", {'tree-parent': ''});
		},
		show: function(view) {
			this.view = view;
		},
		startAdd: function() {
			this.show("add-select");
			// this.element.children.push(new DOMElement());
		},
		add: function(tag) {
			let element;
			if (tag == 'div' || tag == 'span') {
				element = new DOMElement(tag);
			} else if (tag == 'img' || tag == 'input') {
				element = new DOMElement(tag);
				element.possibleParent = false;
			}

			this.currentElement.children.push(element);
			this.show('dom');
		},

		addText: function() {
			if (!this.addTextarea) {
				return;
			}

			let text = new DOMText(this.addTextarea);
			this.currentElement.children.push(text);
			this.addTextarea = "";
			this.show('dom');
		},

		addTemplate: function(name) {
			this.currentElement.children.push(this.templates[name]);
			this.show('dom');
		},

		startEdit: function() {
			this.editStyle = this.currentElement.cssAttributes;
			this.editTag = this.currentElement.tag;
			this.showColor = false;
			this.showBGColor = false;
			if (this.editStyle['color']) { 
				this.showColor = true; // needs to be bool, cant be '' or undefined
			}

			if (this.editStyle['background-color']) {
				this.showBGColor = true;
			}
			this.show("edit");
		},
		finishEdit: function() {
			let css = "";
			// arr = arr.filter(e => e !== '3')
			let attrs = [
				'padding', 'margin', 'border', 'display', 
				'flex-direction', 'flex-wrap', 'justify-content',
				'align-items', 'align-content', 'flex',
				'max-width', 'min-width', 'width',
				'max-height', 'min-height', 'height',
				'overflow', 'border-radius', 'font-size'
			]; // todo -> generate from editStyle keys and remove optional attrs

			let optionalAttrs = [
				['color', 'showColor'], 
				['background-color', 'showBGColor']
			];

			for (pair of optionalAttrs) {
				let attrName = pair[0];
				let attrToggle = pair[1];
				if (this[attrToggle]) {
					attrs.push(attrName);
				}
			}

			let cssAttributes = {};
			for (attr of attrs) {
				if (this.editStyle[attr]) {
					css += attr + ": " + this.editStyle[attr]+"; ";
					cssAttributes[attr] = this.editStyle[attr];
				}
			}

			
			this.$set(this.currentElement, 'tag', this.editTag);
			this.$set(this.currentElement.properties, 'style', css);
			this.$set(this.currentElement, 'cssAttributes', cssAttributes);
			this.show('dom');
		}
	},
	components: {
		'swatches': Swatches 
	}
});
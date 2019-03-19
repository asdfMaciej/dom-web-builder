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
			this.element.children.push(new DOMElement());
		}
	}
});

var app = new Vue({
	el: '#app',
	data: {
		view: 'dom',
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
			color: false,
			'color-hex': '',
			'background-color': false,
			'background-color-hex': ''
		},
		currentElement: null
	},
	methods: {
		clear: function() {
			this.elementsTree = new DOMElement("div", {'tree-parent': ''});
		},
		show: function(view) {
			this.view = view;
		},
		startEdit: function() {
			
			this.show("edit");
		},
		finishEdit: function() {
			let css = "";
			let selectable = [['color', 'color-hex'], ['background-color', 'background-color-hex']];
			for (pair of selectable) {
				if (this.editStyle[pair[0]] && this.editStyle[pair[1]].length != 0) {
					css += pair[0]+": " + this.editStyle[pair[1]]+"; ";
				}
			}

			let attrs = ['padding', 'margin', 'border'];
			for (attr of attrs) {
				if (this.editStyle[attr].length != 0) {
					css += attr + ": " + this.editStyle[attr]+"; ";
				}
			}

			this.$set(this.currentElement, 'tag', this.editTag);
			this.$set(this.currentElement.properties, 'style', css);
			this.show('dom');
		}
	},
	components: {
		'swatches': Swatches 
	}
});

// to-do: startEdit musi brac CSS i wklepac do editStyle
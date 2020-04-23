namespace le {
	@mm.Observer
	export class MobxView extends eui.Component {
		private componetArr = [];
		private idx = 3;

		constructor() {
			super();

			setTimeout(() => store.a.arr.push({ text: '___' + store.a.arr.length }), 1000);
			setTimeout(() => store.a.arr.push({ text: '___' + store.a.arr.length }), 2000);
			setTimeout(() => {
				store.a.arr.push({ text: '___' + store.a.arr.length });
				setInterval(() => {
					store.a.arr[this.idx % 3].text = '___' + this.idx;
					this.idx++;
				}, 1000);
			}, 3000);

			mm.mobx.reaction(() => store.a.arr.length, (l) => console.log('length', l));

			setTimeout(() => {
				this.removeChild(this.componetArr[0]);
				this.removeChild(this.componetArr[1]);
				this.removeChild(this.componetArr[2]);

				setTimeout(() => {
					this.addChild(this.componetArr[0]);
					this.addChild(this.componetArr[1]);
					this.addChild(this.componetArr[2]);
				}, 2000);
			}, 6000);
		}

		@mm.react
		render() {
			console.log('render');
			let len = store.a.arr.length;
			for (let i = 0; i < len; i++) {
				if (!this.componetArr[i]) {
					let component = new Comp(i);
					this.addChild(component);
					this.componetArr[i] = component;
				}
			}
		}
	}
}

@mm.Observer
class Comp extends eui.Component {
	idx = 0;
	label = null;
	constructor(idx) {
		super();
		this.idx = idx;
	}
	childrenCreated() {
		console.log('childrenCreated');
		this.label = new eui.Label();
		this.addChild(this.label);
		this.label.textColor = 0xff0000;
	}

	@mm.react
	renderText() {
		console.log('render label', this.idx);
		this.label.text = this.idx + store.a.arr[this.idx].text;
		this.y = 40 * this.idx;
	}
	@mm.react
	renderText2() {
		console.log(`store.a.arr[${this.idx}].text变更`, store.a.arr[this.idx].text);
	}

	componentDidMount() {
		console.log('mount', this.idx);
	}
	componentDidUnMount() {
		console.log('unmount', this.idx);
	}
}

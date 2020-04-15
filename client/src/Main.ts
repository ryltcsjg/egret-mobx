@mm.Observer
class Main extends eui.UILayer {
	protected createChildren(): void {
		super.createChildren();

		egret.lifecycle.addLifecycleListener((context) => {
			// custom lifecycle plugin
		});

		egret.lifecycle.onPause = () => {
			egret.ticker.pause();
		};

		egret.lifecycle.onResume = () => {
			egret.ticker.resume();
		};

		let stageW = this.stage.stageWidth;
		let stageH = this.stage.stageHeight;

		this.width = stageW;
		this.height = stageH;

		this.start();
	}

	componetArr = [];
	idx = 3;

	start() {
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

	componentDidMount() {
		console.log('mount', this.idx);
	}
	componentDidUnMount() {
		console.log('unmount', this.idx);
	}
}

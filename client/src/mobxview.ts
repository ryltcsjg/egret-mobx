namespace le {
  @mm.Observer
  export class MobxView extends eui.Component {
    private componetArr = [];

    constructor() {
      super();
      mm.mobx.reaction(
        () => store.a.arr.length,
        len => console.log('mm.mobx.reaction   store.a.arr.length', len)
      );

      for (let i = 0; i < 3; i++) {
        store.a.arr.push({ text: '___' + store.a.arr.length });
        let component = new Comp(i);
        this.addChild(component);
        this.componetArr[i] = component;
      }

      let start = 3;
      setInterval(() => {
        store.a.arr[start % 3].text = '___' + start;
        start++;
        store.a.count++;
      }, 1000);

      setTimeout(() => {
        this.removeChild(this.componetArr[0]);
        this.removeChild(this.componetArr[1]);
        this.removeChild(this.componetArr[2]);

        setTimeout(() => {
          this.addChild(this.componetArr[0]);
          this.addChild(this.componetArr[1]);
          this.addChild(this.componetArr[2]);
        }, 4000);
      }, 5000);
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
    console.log('childrenCreated', this.idx);
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

  @mm.reaction(() => store.a.count, { fireImmediately: true })
  reactionFun(data) {
    console.log('store.a.count', data);
  }
  //添加到舞台上时调用，如为首次创建 调用顺序在childrenCreated之后
  componentDidMount() {
    console.log('mount', this.idx);
  }
  //从舞台上移除时调用
  componentDidUnMount() {
    console.log('unmount', this.idx);
  }
}

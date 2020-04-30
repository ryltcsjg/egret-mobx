import {
  _allowStateChanges,
  Reaction,
  $mobx,
  reaction as mobxReaction
} from "mobx";
import { newSymbol, setHiddenProp, patch } from "./utils";

const mobxAdminProperty = $mobx || "$mobx";
const mobxIsUnmounted = newSymbol("isUnmounted");
const skipRenderKey = newSymbol("skipRender");
const isForcingUpdateKey = newSymbol("isForcingUpdate");

const symbolReact = newSymbol("react");
const symbolReaction = newSymbol("reaction");
const symbolDispose = newSymbol("dispose");

export function react(context, prop) {
  context[symbolReact] = context[symbolReact] || [];
  context[symbolReact].push(prop);
}

export function reaction(reactionFun, option) {
  return function(context, prop) {
    context[symbolReaction] = context[symbolReaction] || [];
    context[symbolReaction].push({ prop, fun: reactionFun, option });
  };
}

export function Observer(arg1) {
  return makeClassComponentObserver(arg1);
}

export function makeClassComponentObserver(componentClass) {
  const target = componentClass.prototype;
  let reactKeys = target[symbolReact] || [];
  let reactionKeys = target[symbolReaction] || [];
  reactKeys.forEach(key => {
    const baseRender = target[key];
    target[key] = function() {
      return makeComponentReactive.call(this, baseRender, key);
    };
  });

  //被添加到舞台上时调用
  patch(target, "$onAddToStage", function() {
    if (this[mobxIsUnmounted]) {
      //移除后重新添加到舞台
      this[mobxAdminProperty] &&
        this[mobxAdminProperty].forEach(reaction => {
          reaction.isDisposed = false;
        });
    }
    this[mobxIsUnmounted] = false;
    this.componentDidMount && this.componentDidMount();
    //从舞台上移除时调用
    let listener = event => {
      if (event.target != this) {
        return;
      }
      this.removeEventListener(egret.Event.REMOVED, listener);
      this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, listener);
      this[mobxAdminProperty] &&
        this[mobxAdminProperty].forEach(
          reaction => reaction && reaction.dispose()
        );
      this[symbolDispose] && this[symbolDispose].forEach(dispose => dispose());
      this[symbolDispose] = [];

      this[mobxIsUnmounted] = true;
      this.componentDidUnMount && this.componentDidUnMount();
    };
    this.addEventListener(egret.Event.REMOVED, listener);
    this.addEventListener(egret.Event.REMOVED_FROM_STAGE, listener);
    reactKeys.forEach(key => this[key]());
    this[symbolDispose] = [];
    reactionKeys.forEach(({ prop, fun, option }) => {
      let dispose = mobxReaction(
        fun,
        data => {
          this[prop](data);
        },
        option
      );
      this[symbolDispose].push(dispose);
    });
  });

  // patch(target, "onDestroy", function() {
  //   this[mobxAdminProperty] &&
  //     this[mobxAdminProperty].forEach(
  //       _reaction => _reaction && _reaction.dispose()
  //     );
  //   this[mobxIsUnmounted] = true;
  // });
  return componentClass;
}

function makeComponentReactive(render, obKey) {
  /**
   * If props are shallowly modified, react will render anyway,
   * so atom.reportChanged() should not result in yet another re-render
   */
  setHiddenProp(this, skipRenderKey, false);
  /**
   * forceUpdate will re-assign this.props. We don't want that to cause a loop,
   * so detect these changes
   */
  setHiddenProp(this, isForcingUpdateKey, false);

  // Generate friendly name for debugging
  const initialName =
    this.displayName ||
    this.name ||
    (this.constructor &&
      (this.constructor.displayName || this.constructor.name)) ||
    "<component>";
  const baseRender = render.bind(this);

  let isRenderingPending = false;
  const reaction = new Reaction(`${initialName}.${obKey}()`, () => {
    // if (!isRenderingPending) {
    // N.B. Getting here *before mounting* means that a component constructor has side effects (see the relevant test in misc.js)
    // This unidiomatic React usage but React will correctly warn about this so we continue as usual
    // See #85 / Pull #44
    isRenderingPending = true;
    if (this[mobxIsUnmounted] !== true) {
      let hasError = true;
      try {
        setHiddenProp(this, isForcingUpdateKey, true);
        if (!this[skipRenderKey]) {
          this[obKey]();
        }
        hasError = false;
      } finally {
        setHiddenProp(this, isForcingUpdateKey, false);
        if (hasError) reaction.dispose();
      }
    }
    // }
  });
  reaction.reactComponent = this;
  this[mobxAdminProperty] = this[mobxAdminProperty] || [];
  this[mobxAdminProperty].push(reaction);
  this[obKey] = reactiveRender;

  function reactiveRender() {
    isRenderingPending = false;
    let exception = undefined;
    let rendering = undefined;
    reaction.track(() => {
      try {
        rendering = _allowStateChanges(false, baseRender);
      } catch (e) {
        exception = e;
      }
    });
    if (exception) {
      throw exception;
    }
    return rendering;
  }

  return reactiveRender.call(this);
}

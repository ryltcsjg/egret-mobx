import * as mobx from "mobx";
import { Observer, react, reaction } from "./ObserverClass";

const mm = {
  mobx,
  Observer,
  react,
  reaction
};
 let e = window || global
e.mm = mm;
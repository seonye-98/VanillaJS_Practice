const type = (target, type) => {
  if (typeof type == 'string') {
    if (typeof target != type) throw `invalid type ${target} : ${type}`;
  } else if (!(target instanceof type)) {
    throw `invalid type ${target} : ${type}`;
  }
  return target;
};

type PropertyType = { [k: string]: string | Function };
class ViewModel {
  //객체의 property key로 사용. 즉, 해당 프로퍼티의 값에 접근하고자 할 떄 사용하는 이름
  static #private = Symbol();
  static get(data) {
    return new ViewModel(this.#private, data);
  }
  styles;
  attributes;
  properties;
  //events: Record<string, Function> = {};
  constructor(checker, data: PropertyType[]) {
    if (checker != ViewModel.#private) throw 'use ViewModel.get()!';
    Object.entries(data).forEach(([k, v]) => {
      switch (k) {
        case 'styles':
          this.styles = v;
          break;
        case 'attributes':
          this.attributes = v;
          break;
        case 'properties':
          this.properties = v;
          break;
        // case 'events':
        //   if (v instanceof Function) this.events = v;

        //   break;
        default:
          this[k] = v;
      }
    });
    Object.seal(this); // Value를 바꿀 순 있지만 Key를 추가할 순 없다.
  }
}
class BinderItem {
  el: Element;
  viewmodel: string;
  constructor(el: Element, viewmodel: string) {
    this.el = el;
    this.viewmodel = viewmodel;
    Object.freeze(this); // 아예 불변 객체로 만든다.
  }
}

class Binder {
  #items = new Set();
  add(v: BinderItem) {
    this.#items.add(v);
  }
  render(viewmodel: ViewModel) {
    this.#items.forEach((item: BinderItem) => {
      const vm = viewmodel[item.viewmodel],
        el = item.el;
      Object.entries(vm.styles).forEach(([k, v]) => (el.style[k] = v));
      Object.entries(vm.attributes).forEach(([k, v]) => (el.attribute[k] = v));
      Object.entries(vm.properties).forEach(([k, v]) => (el[k] = v));
      // Object.entries(vm.events).forEach(([k, v]) => (el[`on${k}`] = (e: Function) => v.call(el, e, viewmodel)));
    });
  }
}
const Scanner = class {
  scan(el: HTMLElement | null) {
    if (!el) return null;
    const binder = new Binder();
    this.checkItem(binder, el);
    const stack = [el.firstElementChild];

    // HTML 전체에 대한 순회
    let target;
    while (stack.length > 0 && (target = stack.pop())) {
      this.checkItem(binder, target);
      if (target.firstElementChild) stack.push(target.firstElementChild);
      if (target.nextElementSibling) stack.push(target.nextElementSibling);
    }
    return binder;
  }
  checkItem(binder: Binder, el: Element) {
    let vm = el.getAttribute('data-viewmodel');
    if (vm) binder.add(new BinderItem(el, vm));
  }
};
const viewmodel = ViewModel.get({
  wrapper: ViewModel.get({
    styles: { width: '50%', background: '#ffa', cursor: 'pointer' },
  }),
  title: ViewModel.get({
    properties: { innerHTML: 'Title' },
  }),
  contents: ViewModel.get({
    properties: { innerHTML: 'Contents' },
  }),
});

const scanner = new Scanner();
const binder = scanner.scan(document.querySelector('#target'));
if (binder) binder.render(viewmodel); //

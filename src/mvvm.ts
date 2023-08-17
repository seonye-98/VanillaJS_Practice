const type = (target: any, targetType: string | Function): any => {
  if (typeof targetType === 'string') {
    if (typeof target !== targetType)
      throw `invalid type ${target} : ${targetType}`;
  } else if (!(target instanceof targetType)) {
    throw `invalid type ${target} : ${targetType}`;
  }
  return target;
};

class ViewModel {
  static #private = Symbol();
  static get(data: any): ViewModel {
    return new ViewModel(this.#private, data);
  }
  styles: Record<string, any> = {};
  attributes: Record<string, any> = {};
  properties: Record<string, any> = {};
  events: Record<string, Function> = {};
  constructor(checker: Symbol, data: Record<string, any>) {
    if (checker !== ViewModel.#private) throw 'use ViewModel.get()!';
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
        case 'events':
          this.events = v;
          break;
        default:
          this[k] = v;
      }
    });
    Object.seal(this);
  }
}

class BinderItem {
  el: HTMLElement;
  viewmodel: string;
  constructor(
    el: HTMLElement,
    viewmodel: string,
    _0: any = type(el, HTMLElement),
    _1: any = type(viewmodel, 'string')
  ) {
    this.el = el;
    this.viewmodel = viewmodel;
    Object.freeze(this);
  }
}

class Binder {
  #items: Set<BinderItem> = new Set();
  add(v: BinderItem): void {
    this.#items.add(v);
  }
  render(viewmodel: ViewModel): void {
    this.#items.forEach((item) => {
      if (item) {
        const vm = type(viewmodel[item.viewmodel], ViewModel);
        const el = item.el;
        Object.entries(vm.styles).forEach(([k, v]) => (el.style[k] = v));
        Object.entries(vm.attributes).forEach(([k, v]) =>
          el.setAttribute(k, v as string)
        );
        Object.entries(vm.properties).forEach(([k, v]) => (el[k] = v));
        Object.entries(vm.events).forEach(
          ([k, v]) =>
            (el[`on${k}`] = (e) => (v as Function).call(el, e, viewmodel))
        );
      }
    });
  }
}

class Scanner {
  scan(el: HTMLElement): Binder {
    const binder = new Binder();
    this.checkItem(binder, el);
    const stack: HTMLElement[] = [el.firstElementChild as HTMLElement];

    let target: HTMLElement | null;
    while ((target = stack.pop() as HTMLElement)) {
      this.checkItem(binder, target);
      if (target.firstElementChild)
        stack.push(target.firstElementChild as HTMLElement);
      if (target.nextElementSibling)
        stack.push(target.nextElementSibling as HTMLElement);
    }
    return binder;
  }
  checkItem(binder: Binder, el: HTMLElement): void {
    const vm = el.getAttribute('data-viewmodel');
    if (vm) binder.add(new BinderItem(el, vm));
  }
}

const scanner = new Scanner();
const binder = scanner.scan(document.querySelector('#target') as HTMLElement);

const getRandom = (): number => Math.floor(Math.random() * 150) + 100;

interface ViewModel {
  isStop: boolean;
  changeContents: () => void;
  wrapper: {
    styles: Record<string, string>;
    events: {
      click: (e: Event, vm: ViewModel) => void;
    };
  };
  title: {
    properties: Record<string, string>;
  };
  contents: {
    properties: Record<string, string>;
  };
}

const viewmodel2: ViewModel = ViewModel.get({
  isStop: false,
  changeContents() {
    this.wrapper.styles.background = `rgb(${getRandom()},${getRandom()},${getRandom()})`;
    this.contents.properties.innerHTML = Math.random()
      .toString(16)
      .replace('.', '');
    binder.render(viewmodel2);
  },
  wrapper: ViewModel.get({
    styles: { width: '50%', background: '#fff', cursor: 'pointer' },
    events: {
      click(e: Event, vm: ViewModel) {
        vm.isStop = true;
      },
    },
  }),
  title: ViewModel.get({
    properties: { innerHTML: 'Title' },
  }),
  contents: ViewModel.get({
    properties: { innerHTML: 'Contents' },
  }),
});

const f = (): void => {
  viewmodel2.changeContents();
  binder.render(viewmodel2);
  if (!viewmodel2.isStop) requestAnimationFrame(f);
};
requestAnimationFrame(f);

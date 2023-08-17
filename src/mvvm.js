var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Binder_items;
var ViewModel = /** @class */ (function () {
    function ViewModel(checker, data) {
        var _this = this;
        this.styles = {};
        this.attributes = {};
        this.properties = {};
        this.events = {};
        if (checker !== __classPrivateFieldGet(ViewModel, _a, "f", _ViewModel_private))
            throw 'use ViewModel.get()!';
        Object.entries(data).forEach(function (_b) {
            var k = _b[0], v = _b[1];
            switch (k) {
                case 'styles':
                    _this.styles = v;
                    break;
                case 'attributes':
                    _this.attributes = v;
                    break;
                case 'properties':
                    _this.properties = v;
                    break;
                case 'events':
                    _this.events = v;
                    break;
                default:
                    _this[k] = v;
            }
        });
        Object.seal(this);
    }
    ViewModel.get = function (data) {
        return new ViewModel(__classPrivateFieldGet(this, _a, "f", _ViewModel_private), data);
    };
    var _a, _ViewModel_private;
    _a = ViewModel;
    _ViewModel_private = { value: Symbol() };
    return ViewModel;
}());
var BinderItem = /** @class */ (function () {
    function BinderItem(el, viewmodel) {
        this.el = el;
        this.viewmodel = viewmodel;
        Object.freeze(this);
    }
    return BinderItem;
}());
var Binder = /** @class */ (function () {
    function Binder() {
        _Binder_items.set(this, new Set());
    }
    Binder.prototype.add = function (v) {
        __classPrivateFieldGet(this, _Binder_items, "f").add(v);
    };
    Binder.prototype.render = function (viewmodel) {
        __classPrivateFieldGet(this, _Binder_items, "f").forEach(function (item) {
            if (item) {
                var vm = viewmodel[item.viewmodel];
                var el_1 = item.el;
                Object.entries(vm.styles).forEach(function (_b) {
                    var k = _b[0], v = _b[1];
                    return (el_1.style[k] = v);
                });
                Object.entries(vm.attributes).forEach(function (_b) {
                    var k = _b[0], v = _b[1];
                    return el_1.setAttribute(k, v);
                });
                Object.entries(vm.properties).forEach(function (_b) {
                    var k = _b[0], v = _b[1];
                    return (el_1[k] = v);
                });
                Object.entries(vm.events).forEach(function (_b) {
                    var k = _b[0], v = _b[1];
                    return (el_1["on".concat(k)] = function (e) { return v.call(el_1, e, viewmodel); });
                });
            }
        });
    };
    Binder.prototype.getItems = function () {
        return __classPrivateFieldGet(this, _Binder_items, "f");
    };
    return Binder;
}());
_Binder_items = new WeakMap();
// Scanner는 HTML을 Scan 하여 Binder에게 알리는 역할 을 수행한다.
// 그래서 Scanner에서 Binder를 만들고 반환한다.
var Scanner = /** @class */ (function () {
    function Scanner() {
    }
    Scanner.prototype.scan = function (el) {
        var binder = new Binder();
        this.checkItem(binder, el); //binder.add(BinderItem {el: section#target, viewmodel: 'wrapper'})
        var stack = [el.firstElementChild]; // stack = [h2]
        var target;
        while ((target = stack.pop())) {
            this.checkItem(binder, target); //h2를 꺼내서 binder.add(BinderItem {el: h2, viewmodel: 'title'})
            if (target.firstElementChild)
                stack.push(target.firstElementChild); //자식 노드가 있는 경우 push
            if (target.nextElementSibling)
                stack.push(target.nextElementSibling); //같은 노드 레벨의 다음 값이 있는 경우 push
        }
        //console.log(binder.getItems());
        return binder;
    };
    Scanner.prototype.checkItem = function (binder, el) {
        var vm = el.getAttribute('data-viewmodel');
        if (vm)
            binder.add(new BinderItem(el, vm));
    };
    return Scanner;
}());
var scanner = new Scanner();
//id = target인 section태그 전체를 가져온다.
var binder = scanner.scan(document.querySelector('#target'));
var getRandom = function () { return Math.floor(Math.random() * 150) + 100; };
var viewmodel2 = ViewModel.get({
    isStop: false,
    changeContents: function () {
        this.wrapper.styles.background = "rgb(".concat(getRandom(), ",").concat(getRandom(), ",").concat(getRandom(), ")");
        this.contents.properties.innerHTML = Math.random().toString(16).replace('.', '');
        binder.render(viewmodel2);
    },
    wrapper: ViewModel.get({
        styles: { width: '50%', background: '#fff', cursor: 'pointer' },
        events: {
            click: function (e, vm) {
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
var f = function () {
    viewmodel2.changeContents();
    binder.render(viewmodel2);
    if (!viewmodel2.isStop)
        requestAnimationFrame(f);
};
//1초에 60회씩 f 실행
requestAnimationFrame(f);

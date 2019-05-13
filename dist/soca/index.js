define("soca", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var supportProxy = false;
    if (typeof Proxy === "function" && !Proxy.prototype) {
        supportProxy = true;
    }
    var KEY = {
        OBSERVABLE: "@@observable",
        COMPUTED: "@@computed",
        ACTION: "@@action",
        TARGET: "@@target",
        RELATION: "@@relation"
    };
    function isObservableObject(obj) {
        return (typeof obj === "object") && (KEY.TARGET in obj);
    }
    exports.isObservableObject = isObservableObject;
    function setRel(observable, key, fn) {
        fn[KEY.RELATION].add(observable);
        var rel = observable[KEY.RELATION];
        if (!rel[key]) {
            rel[key] = new Set();
        }
        rel[key].add(fn);
    }
    function dispose(fn) {
        var obs = fn[KEY.RELATION];
        obs.forEach(function (o) {
            var rel = exports.observable[KEY.RELATION];
            var keys = Object.keys(rel);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                rel[key]["delete"](fn);
            }
        });
        obs.clear();
    }
    function bind(obj, prop) {
        var i = runStack.length;
        while (i-- > 0) {
            setRel(obj, prop, runStack[i]);
        }
    }
    function unbind(observable, key) {
        var rel = observable[KEY.RELATION];
        if (rel) {
            var set = rel[key];
            if (set) {
                set.forEach(function (fn) {
                    fn[KEY.RELATION]["delete"](observable);
                });
                set.clear();
                rel[key] = null;
            }
        }
    }
    ;
    function unbind_object(obj) {
        var keys = Object.keys(obj);
        keys.forEach(unbindObject, obj);
    }
    ;
    function unbind_array(arr) {
        arr.forEach(unbindAny, arr);
    }
    ;
    function unbind_map(map) {
    }
    function unbindObject(key) {
        if (key.startsWith("@@")) {
            return;
        }
        var value = this[key];
        unbindAny(value);
        unbind(this, key);
    }
    function unbindAny(o) {
        if (o instanceof Map) { //TODO
            unbind_map(this);
        }
        else if (Array.isArray(o)) {
            unbind_array(o);
        }
        else if (o instanceof Object && Reflect.getPrototypeOf(o) === Object.prototype) {
            unbind_object(o);
        }
    }
    var trigger = forceTrigger;
    var todoList = new Set();
    function forceTrigger(observable, key) {
        var fns = observable[KEY.RELATION][key];
        if (fns)
            fns.forEach(runEffect, observable);
    }
    function delayTrigger(observable, key) {
        var fns = observable[KEY.RELATION][key];
        if (fns)
            fns.forEach(recordEffect, observable);
    }
    var actionDeep = 0;
    function beforeAction() {
        actionDeep++;
        trigger = delayTrigger;
    }
    function afterAction() {
        actionDeep--;
        if (!actionDeep) {
            todoList.forEach(runEffect);
            todoList.clear();
            trigger = forceTrigger;
        }
    }
    function recordEffect(fn) {
        todoList.add(fn);
    }
    function runEffect(fn) {
        fn.call(this);
    }
    var runStack = [];
    function autorun(effect) {
        function fn() {
            try {
                runStack.push(fn);
                effect();
            }
            catch (e) {
                console.error(e);
            }
            finally {
                runStack.pop();
            }
        }
        fn[KEY.RELATION] = new Set();
        fn();
        return function () {
            dispose(fn);
        };
    }
    exports.autorun = autorun;
    function reaction(tracking, effect) {
        function fn() {
            try {
                runStack.push(fn);
                var r = tracking();
            }
            catch (e) {
                console.error(e);
            }
            finally {
                runStack.pop();
            }
            effect(r);
        }
        fn[KEY.RELATION] = new Set();
        try {
            runStack.push(fn);
            tracking();
        }
        catch (e) {
            console.error(e);
        }
        finally {
            runStack.pop();
        }
        return function () {
            dispose(fn);
        };
    }
    exports.reaction = reaction;
    function store(Store) {
        if (Object.defineProperties) {
            return createStore(Store);
        }
        else {
            return createStoreByVB(Store);
        }
    }
    exports.store = store;
    function createStore(Store) {
        var Clazz = function () {
            var me = Object.create(Store.prototype);
            me[KEY.RELATION] = {};
            me[KEY.TARGET] = {};
            var acs = Store[KEY.ACTION];
            if (acs) {
                for (var _i = 0, acs_1 = acs; _i < acs_1.length; _i++) {
                    var key = acs_1[_i];
                    me[key] = Store.prototype[key].bind(me);
                }
            }
            Store.apply(me, arguments);
            return me;
        };
        return Clazz;
    }
    var seq = 0;
    function createStoreByVB(Store) {
        var className = "VBObservable_" + (seq++);
        var buffer = ["Class " + className];
        buffer.push('Public [__proto__]');
        buffer.push('Public [' + KEY.RELATION + ']');
        buffer.push('Public [' + KEY.TARGET + ']');
        var key, descriptor;
        var obs = Store[KEY.OBSERVABLE];
        if (obs) {
            for (var _i = 0, obs_1 = obs; _i < obs_1.length; _i++) {
                key = obs_1[_i];
                descriptor = Reflect.getOwnPropertyDescriptor(Store.prototype, key);
                if (descriptor) {
                    addVBProperty(buffer, key, descriptor);
                }
            }
        }
        var cos = Store[KEY.COMPUTED];
        if (cos) {
            for (var _a = 0, cos_1 = cos; _a < cos_1.length; _a++) {
                key = cos_1[_a];
                descriptor = Reflect.getOwnPropertyDescriptor(Store.prototype, key);
                if (descriptor) {
                    addVBProperty(buffer, key, descriptor);
                }
                else {
                    buffer.push('Public Function [' + key + ']', '	On Error Resume Next', //必须优先使用set语句,否则它会误将数组当字符串返回
                    '	Set [' + key + ']=Me.[__proto__].' + key + '.call(Me)', '	If Err.Number <> 0 Then', '		[' + key + ']=Me.[__proto__].' + key + '.call(Me)', '	End If', 'End Function');
                }
            }
        }
        var acs = Store[KEY.ACTION];
        if (acs) {
            for (var _b = 0, acs_2 = acs; _b < acs_2.length; _b++) {
                key = acs_2[_b];
                buffer.push('Public [' + key + ']');
            }
        }
        buffer.push('End Class');
        buffer.push('Function ' + className + '_Factory()', '	Dim o', '	Set o = New ' + className, '	Set ' + className + '_Factory=o', 'End Function');
        try {
            window.execScript(buffer.join('\n'), 'VBScript');
        }
        catch (e) {
            alert(buffer.join('\n'));
        }
        var Clazz = function () {
            var me = window[className + '_Factory']();
            me[KEY.RELATION] = {};
            me[KEY.TARGET] = {};
            me.__proto__ = Store.prototype;
            var acs = Store[KEY.ACTION];
            if (acs) {
                for (var _i = 0, acs_3 = acs; _i < acs_3.length; _i++) {
                    var key = acs_3[_i];
                    me[key] = Store.prototype[key].bind(me);
                }
            }
            Store.apply(me, arguments);
            return me;
        };
        return Clazz;
    }
    function addVBProperty(buffer, key, descriptor) {
        if (descriptor.get) {
            buffer.push('Public Property Get [' + key + ']', '	On Error Resume Next', //必须优先使用set语句,否则它会误将数组当字符串返回
            '	Set [' + key + ']=Reflect.get(Me,"' + key + '")', '	If Err.Number <> 0 Then', '		[' + key + ']=Reflect.get(Me,"' + key + '")', '	End If', 'End Property');
        }
        if (descriptor.set) {
            buffer.push('Public Property Let [' + key + '](var)', '	Call Reflect.set(Me,"' + key + '",var)', 'End Property', 'Public Property Set [' + key + '](var)', '	Call Reflect.set(Me,"' + key + '",var)', 'End Property');
        }
    }
    exports.observable = function () {
    };
    exports.observable.shallow = function (prototype, prop) {
        var obs = prototype.constructor[KEY.OBSERVABLE];
        if (!obs) {
            obs = prototype.constructor[KEY.OBSERVABLE] = new Array();
        }
        obs.push(prop);
        Reflect.defineProperty(prototype, prop, {
            get: function () {
                bind(this, prop);
                return this[KEY.TARGET][prop];
            },
            set: function (value) {
                this[KEY.TARGET][prop] = value;
                trigger(this, prop);
            },
            enumerable: true
        });
    };
    exports.observable.deep = function (prototype, prop) {
        var obs = prototype.constructor[KEY.OBSERVABLE];
        if (!obs) {
            obs = prototype.constructor[KEY.OBSERVABLE] = new Array();
        }
        obs.push(prop);
        setDeepProperty.call(prototype, prop);
    };
    exports.observable.object = function (obj) {
        var keys = Object.keys(obj);
        var proxy = new Object();
        proxy[KEY.TARGET] = new Object();
        proxy[KEY.RELATION] = {};
        proxy[KEY.TARGET] = {};
        keys.forEach(setDeepProperty, proxy);
        Object.assign(proxy, obj);
        return proxy;
    };
    exports.observable.array = function (arr) {
        var a = new ObservableArray();
        a.push.apply(a, arr);
        if (supportProxy) {
            return createProxyArray(a);
        }
        return a;
    };
    var arrayGetter = ["concat", "filter", "find", "find​Index", "forEach", "includes", "indexOf", "join", "last​IndexOf", "map", "reduce", "reduce​Right", "slice", "some", "get", "length"];
    function createProxyArray(arr) {
        var p = new Proxy(arr, {
            get: function (target, property) {
                if (!isNaN(property)) {
                    bind(target, property);
                }
                return target[property];
            },
            set: function (target, property, value) {
                try {
                    if (!isNaN(property)) {
                        target.set(property, value);
                    }
                    else {
                        target[property] = value;
                    }
                    return true;
                }
                catch (e) {
                    return false;
                }
            }
        });
    }
    var ObservableArray = /** @class */ (function (_super) {
        __extends(ObservableArray, _super);
        function ObservableArray() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ObservableArray.prototype.bind = function (observable, prop) {
            this._observable = observable;
            this._prop = prop;
        };
        ObservableArray.prototype.get = function (i) {
            bind(this._observable, this._prop);
            return this[i];
        };
        ObservableArray.prototype.set = function (i, o) {
            o = createObservable(o);
            unbindAny(this[i]);
            this[i] = o;
            trigger(this._observable, this._prop);
        };
        ObservableArray.prototype.push = function () {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            items = items.map(createObservable);
            var r = _super.prototype.push.apply(this, items);
            trigger(this._observable, this._prop);
            return r;
        };
        ObservableArray.prototype.pop = function () {
            var r = _super.prototype.push.call(this);
            unbindAny(r);
            trigger(this._observable, this._prop);
            return r;
        };
        ObservableArray.prototype.reverse = function () {
            _super.prototype.reverse.call(this);
            trigger(this._observable, this._prop);
            return this;
        };
        ObservableArray.prototype.shift = function () {
            var r = _super.prototype.shift.call(this);
            unbindAny(r);
            trigger(this._observable, this._prop);
            return r;
        };
        ObservableArray.prototype.unshift = function () {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            items = items.map(createObservable);
            var r = _super.prototype.unshift.apply(this, items);
            trigger(this._observable, this._prop);
            return r;
        };
        ObservableArray.prototype.sort = function (sortby) {
            _super.prototype.sort.call(this, sortby);
            trigger(this._observable, this._prop);
            return this;
        };
        ObservableArray.prototype.splice = function (index, howmany) {
            var items = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                items[_i - 2] = arguments[_i];
            }
            items = items.map(createObservable);
            _super.prototype.splice.apply(this, arguments);
            trigger(this._observable, this._prop);
            return items;
        };
        return ObservableArray;
    }(Array));
    arrayGetter.forEach(function (prop) {
        var fn = Array.prototype[prop];
        if (typeof fn === "function" && !(prop in ObservableArray.prototype)) {
            ObservableArray.prototype[prop] = function () {
                bind(this._observable, this._prop);
                return fn.apply(this, arguments);
            };
        }
    });
    function createObservable(value) {
        if (value instanceof Map) {
            return exports.observable.map(value);
        }
        else if (Array.isArray(value)) {
            //TODO
            return exports.observable.array(value);
        }
        else if (value instanceof Object && Reflect.getPrototypeOf(value) === Object.prototype) {
            return exports.observable.object(value);
        }
        else {
            return value;
        }
    }
    function setDeepProperty(prop) {
        Reflect.defineProperty(this, prop, {
            get: function () {
                bind(this, prop);
                if (runStack.length === 0) {
                    trigger(this, prop);
                }
                return this[KEY.TARGET][prop];
            },
            set: function (value) {
                var v = this[prop];
                unbindAny(v);
                value = createObservable(value);
                this[KEY.TARGET][prop] = value;
                trigger(this, prop);
            }
        });
    }
    exports.computed = function () {
    };
    exports.computed.method = function (prototype, prop, descriptor) {
        var computeds = prototype.constructor[KEY.COMPUTED];
        if (!computeds) {
            computeds = prototype.constructor[KEY.COMPUTED] = new Array();
        }
        computeds.push(prop);
        var method = prototype[prop];
        prototype[prop] = function () {
            bind(this, prop);
            var target = this[KEY.TARGET];
            if (!(prop in target)) {
                firstComputed(target, this, prop, method);
            }
            return target[prop];
        };
    };
    function firstComputed(target, obj, prop, method) {
        var oldStack = runStack;
        runStack = new Array();
        reaction(function () {
            var r = method.call(obj);
            target[prop] = r;
        }, function () {
            trigger(obj, prop);
        });
        runStack = oldStack;
    }
    exports.computed.accessor = function (prototype, prop, descriptor) {
        var computeds = prototype.constructor[KEY.COMPUTED];
        if (!computeds) {
            computeds = prototype.constructor[KEY.COMPUTED] = new Array();
        }
        computeds.push(prop);
        var getter = descriptor.get;
        if (getter) {
            descriptor.get = function () {
                bind(this, prop);
                var target = this[KEY.TARGET];
                if (!(prop in target)) {
                    firstComputed(target, this, prop, getter);
                }
                return target[prop];
            };
        }
        var setter = descriptor.set;
        if (setter) {
            descriptor.set = function (value) {
                try {
                    beforeAction();
                    setter.call(this, value);
                }
                catch (e) {
                    console.error(e);
                }
                finally {
                    afterAction();
                }
            };
        }
    };
    exports.action = function () {
    };
    exports.action.bound = function (prototype, prop, undefined) {
        var actions = prototype.constructor[KEY.ACTION];
        if (!actions) {
            actions = prototype.constructor[KEY.ACTION] = new Array();
        }
        actions.push(prop);
        var method = prototype[prop];
        prototype[prop] = function () {
            try {
                beforeAction();
                var r = method.apply(this, arguments);
            }
            catch (e) {
                console.error(e);
            }
            finally {
                afterAction();
            }
            return r;
        };
    };
});

define(["require", "exports", "soca"], function (require, exports, soca_1) {
    "use strict";
    exports.__esModule = true;
    var DemoStore = /** @class */ (function () {
        function DemoStore() {
            this.todos = [{
                    id: 1,
                    desc: "测试1"
                }, {
                    id: 2,
                    desc: "测试2"
                }, {
                    id: 3,
                    desc: "测试3"
                }, {
                    id: 4,
                    desc: "测试4"
                }];
        }
        __decorate([
            soca_1.observable.deep
        ], DemoStore.prototype, "todos");
        DemoStore = __decorate([
            soca_1.store
        ], DemoStore);
        return DemoStore;
    }());
    var demoStore = new DemoStore();
    soca_1.autorun(function () {
        alert("store.todos[1].desc:" + demoStore.todos[1].desc);
    });
    soca_1.autorun(function () {
        alert("store.todos.length:" + demoStore.todos.length);
    });
    demoStore.todos.push({
        id: 5,
        desc: "测试5"
    });
    demoStore.todos[4].desc = "666";
});

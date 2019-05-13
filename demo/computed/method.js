define(["require", "exports", "soca"], function (require, exports, soca_1) {
    "use strict";
    exports.__esModule = true;
    var DemoStore = /** @class */ (function () {
        function DemoStore() {
            this.birthday = new Date("2001/02/15");
        }
        DemoStore.prototype.age = function () {
            alert("calc ...");
            var now = new Date();
            return now.getFullYear() - this.birthday.getFullYear() + 1;
        };
        __decorate([
            soca_1.observable.shallow
        ], DemoStore.prototype, "birthday");
        __decorate([
            soca_1.computed.method
        ], DemoStore.prototype, "age");
        DemoStore = __decorate([
            soca_1.store
        ], DemoStore);
        return DemoStore;
    }());
    var demoStore = new DemoStore();
    alert(demoStore.age()); //会运行相关计算函数
    alert(demoStore.age()); //不会运行相关计算函数
    soca_1.autorun(function () {
        demoStore.age(); //自动收集依赖
        alert("autorun");
    });
    alert("before");
    demoStore.birthday = new Date(); //birthday改变后触发了前面的autorun
    alert("after");
});

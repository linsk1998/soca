define(["require", "exports", "soca"], function (require, exports, soca_1) {
    "use strict";
    exports.__esModule = true;
    var DemoStore = /** @class */ (function () {
        function DemoStore() {
            this.age = 0;
        }
        __decorate([
            soca_1.observable.shallow
        ], DemoStore.prototype, "age");
        DemoStore = __decorate([
            soca_1.store
        ], DemoStore);
        return DemoStore;
    }());
    var demoStore = new DemoStore();
    soca_1.autorun(function () {
        alert(demoStore.age);
    });
    alert("before");
    demoStore.age = 1;
    alert("after");
});

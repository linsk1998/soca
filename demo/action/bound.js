define(["require", "exports", "soca"], function (require, exports, soca_1) {
    "use strict";
    exports.__esModule = true;
    var DemoStore = /** @class */ (function () {
        function DemoStore() {
            this.a = 0;
            this.b = "a";
        }
        DemoStore.prototype.addA = function (str) {
            this.b = str;
            this.a++;
        };
        __decorate([
            soca_1.observable.shallow
        ], DemoStore.prototype, "a");
        __decorate([
            soca_1.observable.shallow
        ], DemoStore.prototype, "b");
        __decorate([
            soca_1.action.bound
        ], DemoStore.prototype, "addA");
        DemoStore = __decorate([
            soca_1.store
        ], DemoStore);
        return DemoStore;
    }());
    var demoStore = new DemoStore();
    soca_1.autorun(function () {
        alert(demoStore.b + demoStore.a);
    });
    demoStore.a++;
    demoStore.b = "b";
    demoStore.addA("c");
});

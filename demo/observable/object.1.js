define(["require", "exports", "soca"], function (require, exports, soca_1) {
    "use strict";
    exports.__esModule = true;
    var DemoStore = /** @class */ (function () {
        function DemoStore() {
            this.user = {
                id: "admin",
                name: "管理员"
            };
        }
        __decorate([
            soca_1.observable.deep
        ], DemoStore.prototype, "user");
        DemoStore = __decorate([
            soca_1.store
        ], DemoStore);
        return DemoStore;
    }());
    var demoDtore = new DemoStore();
    soca_1.autorun(function () {
        alert(demoDtore.user.name);
    });
    demoDtore.user.name = "aaa";
    demoDtore.user = {
        id: "admin",
        name: "管理员"
    };
    demoDtore.user.name = "bbb";
});

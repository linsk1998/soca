define(["require", "exports", "soca"], function (require, exports, soca) {
	var DemoStore = /** @class */ (function () {
		function DemoStore() {
			this.birthday = new Date("2001/02/15");
		}
		Reflect.defineProperty(DemoStore.prototype, "age", {
			get:function(){
				alert("get ...");
				var now = new Date();
				return now.getFullYear() - this.birthday.getFullYear() + 1;
			},
			set:function(value){
				alert("set ...");
				var now = new Date();
				this.birthday.setFullYear(now.getFullYear()-value+1);
				this.birthday=this.birthday;
			},
			enumerable:true,
			configurable:true
		});
		__decorate([
			soca.observable.shallow
		], DemoStore.prototype, "birthday");
		__decorate([
			soca.computed.accessor
		], DemoStore.prototype, "age", null);
		DemoStore = __decorate([
			soca.store
		], DemoStore);
		return DemoStore;
	}());
	var demoStore = new DemoStore();
	alert(demoStore.age);
	demoStore.age = 5;
	alert(demoStore.age);
	alert(demoStore.birthday);
});

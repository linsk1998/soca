var __decorate;
if(this.Reflect && this.Reflect.decorate){
	__decorate=Reflect.decorate;
}else{
	__decorate=function(decorators, target, key, desc){
		var c=arguments.length, r=c<3?target:(desc===null?desc=Reflect.getOwnPropertyDescriptor(target, key):desc),d;
		for(var i=decorators.length - 1; i >= 0; i--){
			if(d = decorators[i]){
				r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r
			}
		};
		return c > 3 && r && Reflect.defineProperty(target, key, r), r;
	};
}
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
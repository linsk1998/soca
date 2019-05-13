import {store,observable,computed,autorun} from "soca";

@store
class DemoStore{
	@observable.shallow
	birthday:Date=new Date("2001/02/15");
	@computed.method
	age(){
		alert("calc ...");
		var now=new Date();
		return now.getFullYear()-this.birthday.getFullYear()+1;
	}
}

var demoStore=new DemoStore();
alert(demoStore.age());//会运行相关计算函数
alert(demoStore.age());//不会运行相关计算函数
autorun(function(){
	demoStore.age();//自动收集依赖
	alert("autorun");
});
alert("before");
demoStore.birthday=new Date();//birthday改变后触发了前面的autorun
alert("after");
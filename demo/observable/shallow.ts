import {store,observable,autorun} from "soca";

@store
class DemoStore{
	@observable.shallow
	age:number=0;
}

var demoStore=new DemoStore();
autorun(function(){
	alert(demoStore.age);
});
alert("before");
demoStore.age=1;
alert("after");
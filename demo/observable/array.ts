import {store,observable,autorun} from "soca";

@store
class DemoStore{
	@observable.deep
	todos=[{
		id:1,
		desc:"测试1"
	},{
		id:2,
		desc:"测试2"
	},{
		id:3,
		desc:"测试3"
	},{
		id:4,
		desc:"测试4"
	}];
}

var demoStore=new DemoStore();
autorun(function(){
	alert("store.todos[1].desc:"+demoStore.todos[1].desc);
});
autorun(function(){
	alert("store.todos.length:"+demoStore.todos.length);
});
demoStore.todos.push({
	id:5,
	desc:"测试5"
});
demoStore.todos[4].desc="666";
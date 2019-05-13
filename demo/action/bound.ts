import {store,observable,action,autorun} from "soca";

@store
class DemoStore{
	@observable.shallow
	a:number=0;
	@observable.shallow
	b:string="a";
	@action.bound
	addA(str:string){
		this.b=str;
		this.a++;
	}
}

var demoStore=new DemoStore();
autorun(function(){
	alert(demoStore.b+demoStore.a);
});
demoStore.a++;
demoStore.b="b";
demoStore.addA("c");
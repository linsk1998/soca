import {store,observable,autorun} from "soca";

@store
class DemoStore{
	@observable.deep
	user={
		id:"admin",
		name:"管理员"
	};
}

var demoDtore=new DemoStore();
autorun(function(){
	alert(demoDtore.user.name);
});
demoDtore.user.name="aaa";
demoDtore.user={
	id:"admin",
	name:"管理员"
};
demoDtore.user.name="bbb";

if(!String.prototype.startsWith){
	String.prototype.startsWith=function(prefix,position){
		position=position?position:0;
		return this.slice(position, prefix.length) === prefix;
	};
}
if(!String.prototype.includes){
	String.prototype.includes=function(sub){
		return this.indexOf(sub)>=0;
	};
}
if(!Array.isArray){
	Array.isArray=function(obj){
		return Object.prototype.toString.call(obj)==='[object Array]';
	};
}
if(!Array.prototype.indexOf){
	Array.prototype.indexOf=function(e,fromIndex){
		fromIndex=isNaN(fromIndex)?0:fromIndex;
		for(var i=fromIndex,j;i<this.length; i++){
			j=this[i];
			if(j===e){return i;}
		}
		return -1;
	};
}
if(!Array.prototype.forEach){
	Array.prototype.forEach =function(callback, thisArg){
		var len=this.length;
		for(var i=0,j;i<len && i<this.length; i++){
			j=this[i];
			callback.call(thisArg,j,i,this);
		}
	};
}
if(!Function.prototype.bind){
	Function.prototype.bind=function(context){
		var self=this;
		return function(){
			return self.apply(context,arguments);
		};
	};
}
if(!this.Set){
	Set=function(){
		this.items=[];
		this.size=0;
	};
	Set.prototype.has=function(value){
		return this.items.indexOf(value)>=0;
	};
	Set.prototype.add=function(value){
		if(!this.has(value)){
			this.items.push(value);
			this.size=this.items.length;
		}
	};
	Set.prototype.clear=function(){
		this.items.splice(0,this.items.length);
		this.size=0;
	};
	Set.prototype.forEach=function(callback,thisArg){
		for(var i=0,j;i<this.size; i++){
			j=this.items[i];
			callback.call(thisArg,j,j,this);
		}
	};
}
if(!this.Map){
	Map=function(){
		this.items=[];
		this.size=0;
	};
	Map.prototype["delete"]=function(key){
		var i=this.items.findIndex(function(item){
			return item[0]===key;
		});
		if(i>=0){
			var r=this.items[i];
			this.items.splice(i,1);
			this.size=this.items.length;
			return r;
		}
		return false;
	};
	Map.prototype.forEach=function(callbackfn,thisArg){
		var len=this.size;
		for(var i=0,j;i<len; i++){
			j=this.items[i];
			if(j){
				callbackfn.call(thisArg,j[1],j[0],i,this);
			}
		}
	};
	Map.prototype.get=function(key){
		var r=this.items.find(function(item){
			return item[0]===key;
		});
		if(r){
			return r[1];
		}
	};
	Map.prototype.has=function(key){
		return this.items.some(function(item){
			return item[0]===key;
		});
	};
	Map.prototype.set=function(key,value){
		var r=this.items.find(function(item){
			return item[0]===key;
		});
		if(r){
			r[1]=value;
		}else{
			this.items.push([key,value]);
		}
		this.size=this.items.length;
		return this;
	};
}
if(!this.Reflect){
	this.Reflect={
		apply:function(target, thisArgument, argumentsList){
			Function.prototype.apply.call(target, thisArgument, argumentsList);
		},
		construct:function(target, argumentsList,newTarget){
			if(!newTarget){ newTarget=target;}
			var o=Object.create(newTarget.prototype);
			var o2=Reflect.apply(target,o,argumentsList);
			if(o2!==void 0){
				return o2;
			}
			return o;
		}
	};
	if(!Object.defineProperties){
		Reflect.DESC_KEY="@@descriptor";
		Reflect.defineProperty=function(obj, prop, descriptor){
			if(!obj[Reflect.DESC_KEY]){
				obj[Reflect.DESC_KEY]=new Object();
			}
			obj[Reflect.DESC_KEY][prop]=descriptor;
		};
		Reflect.getOwnPropertyDescriptor=function(obj,prop){
			var descriptor=obj[Reflect.DESC_KEY];
			if(descriptor) return descriptor[prop];
		};
		Reflect.getPrototypeOf=function(obj){
			if('__proto__' in obj){
				return obj.__proto__;
			}
			return obj.constructor.prototype;
		};
	}else{
		Reflect.defineProperty=function(target, propertyKey, attributes){
			try{
				Object.defineProperty(target, propertyKey, attributes);
				return true;
			}catch(e){
				console.error(e);
			}
			return false;
		};
		Reflect.getOwnPropertyDescriptor=Object.getOwnPropertyDescriptor;
		Reflect.getPrototypeOf=Object.getPrototypeOf;
	}
	Reflect.get=function(target,propertyKey,receiver){
		if(receiver===void 0){ receiver=target}
		var o=target,attributes;
		do{
			attributes=Reflect.getOwnPropertyDescriptor(o,propertyKey);
			if(attributes){
				if(attributes.get){
					return attributes.get.call(receiver);
				}
				return attributes.value;
			}
			o=Reflect.getPrototypeOf(o);
		}while(o && o!==Object.prototype);
		return target[propertyKey];
	};
	Reflect.set=function(target,propertyKey,value,receiver){
		if(receiver===void 0){ receiver=target}
		var o=target,attributes;
		do{
			attributes=Reflect.getOwnPropertyDescriptor(o,propertyKey);
			if(attributes){
				if(attributes.set){
					attributes.set.call(receiver,value);
				}
				return value;
			}
			o=Reflect.getPrototypeOf(o);
		}while(o && o!==Object.prototype);
		return target[propertyKey]=value;
	};
}
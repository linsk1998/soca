declare module "soca" {
    export function isObservableObject(obj: any): boolean;
    export function autorun(effect: Function): () => void;
    export function reaction(tracking: any, effect: any): () => void;
    export function store(Store: any): any;
    export var observable: any;
    export var computed: any;
    export var action: any;
}

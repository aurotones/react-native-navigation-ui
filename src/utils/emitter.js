import EventEmitter from "eventemitter3";

export default class emitter {
    static eventEmitter = new EventEmitter();
    static addListener(){
        return this.eventEmitter.addListener;
    }
    static emit(){
        return this.eventEmitter.emit;
    }
}
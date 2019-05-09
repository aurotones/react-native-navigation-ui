import EventEmitter from "eventemitter3";

class eventEmitter {
    static eventEmitter = new EventEmitter();
    static addListener(...args){
        return this.eventEmitter.addListener(...args);
    }
    static emit(...args){
        return this.eventEmitter.emit(...args);
    }
}

module.exports = eventEmitter;
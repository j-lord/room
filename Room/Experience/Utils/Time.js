// Need to add comments like this to every file 
// So that we can understand what is going on
// and see what we can copy / paste

import { EventEmitter } from "events";

export default class Time extends EventEmitter{
    constructor() { 
        super();
        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16;

        this.update();
        }

        update() {
            const currentTime = Date.now();
            this.delta = currentTime - this.current;
            this.current = currentTime;
            this.elapsed = this.current - this.start; // use this to play animation at X time after start

            // console.log(this.delta)
            this.emit("update")
            window.requestAnimationFrame(() => (this.update()));
    }
}
import { Optional } from "@angular/core";
import TetrisMove from "@shared/TetrisMove";

class Control {
    down: boolean = false;
    pressedAt: number = 0;
    move: TetrisMove = -1;
};

class Keyboard {
    // State
    enabled: boolean = true;
    keyMap: {[key:number] : Control} = {};
    moveMap:  {[key:number] : Control} = {};
    repeatKey?: Control;
    output: Array<TetrisMove> = [];

    repeatTimer: number = 0;
    dropRepeatTimer: number = 0;

    // Settings
    das: number = 120;
    arr: number = 0;
    dropArr: number = 250;

    constructor(){
        window.addEventListener('keydown', this.HandleKeyDown.bind(this));
        window.addEventListener('keyup', this.HandleKeyUp.bind(this));
    }

    Bind(move : TetrisMove, keycode : number){
        let control = {
            down : false,
            pressedAt : 0,
            move : move
        };
    
        this.moveMap[move] = control;
        this.keyMap[keycode] = control;

        console.log(`Control ${TetrisMove[control.move]} bound to: ${String.fromCharCode(keycode)}`)
    }
    
    Rebind(move : TetrisMove, keycode : number){
        let control = this.moveMap[move];
        
        if (!control){
            throw new Error("Attempted to rebind a non-existant control.");
        }
    
        this.keyMap[keycode] = control;
    }

    // Event Handling
    HandleKeyDown(e: KeyboardEvent){
        // Ignore Key Repeats
        if (!this.enabled || e.repeat)
            return;
        
        // Ensure Key event only affects game
        e.preventDefault();

        // Check what control the key corresponds to
        let control = this.keyMap[e.keyCode];
        if (!control)
            return;

        control.pressedAt = e.timeStamp;
        control.down = true;

        this.output.push(control.move);

        if (control.move == TetrisMove.SoftDrop){
            this.dropRepeatTimer = this.dropArr;
        } 
        else if (control.move == TetrisMove.Left || control.move == TetrisMove.Right) {
            this.repeatTimer = this.das;
            this.repeatKey = control;
        }
    }

    HandleKeyUp(e : KeyboardEvent){
        if (!this.enabled || e.repeat)
        return;

        // Ensure Key event doesn't do anything weird
        e.preventDefault();

        // Check what control the key corresponds to
        let control = this.keyMap[e.keyCode];
        if (!control)
            return;

        control.down = false;
    }

    // Per Frame Auto Repeat Handling 
    Update(dt: number){
        // A piece cannot move in one direction more than 9 times, so we do not repeat more than 9 times
        let maxMoves = 9;

        if (this.moveMap[TetrisMove.SoftDrop].down){
            this.dropRepeatTimer -= dt;
            while (this.dropRepeatTimer <= 0 && maxMoves--){
                this.output.push(TetrisMove.SoftDrop);
                this.dropRepeatTimer += this.dropArr;

            }
        }

        if (this.repeatKey && this.repeatKey.down){
            this.repeatTimer -= dt;
            while (this.repeatTimer <= 0 && maxMoves-- > 0){
                this.output.push(this.repeatKey.move);
                this.repeatTimer += this.arr;
            }
        }
    }

    GetOutput(){
        return this.output;
    }
    
    Clear(){
        this.output.length = 0;
    }
    
    Enable(){
        this.enabled = true;
    }
    
    Disable() {
        this.enabled = false;
    }
};

export default Keyboard;
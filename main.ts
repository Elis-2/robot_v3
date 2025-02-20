function turn_servo () {
    pos_servo = (pos_servo + 180) % 360
    maqueen.servoRun(maqueen.Servos.S1, pos_servo)
}
function move_fwd () {
    maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 100)
    basic.pause(50)
    maqueen.motorStop(maqueen.Motors.All)
}
radio.onReceivedNumber(function (receivedNumber) {
    if (receivedNumber == 0) {
        basic.showIcon(IconNames.Yes)
        radio.sendNumber(1)
    }else if (receivedNumber == 2){
        basic.showIcon(IconNames.Target)
        scan = true
    }else if (receivedNumber == 3){
        scan = false
        approach = false
        move = false
    }
})
function fnc_turn_left () {
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CCW, 100)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 100)
    basic.pause(50)
    maqueen.motorStop(maqueen.Motors.All)
}
function fnc_turn_right () {
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, 100)
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 100)
    basic.pause(50)
    maqueen.motorStop(maqueen.Motors.All)
}
radio.onReceivedValue(function (name, value) {
    if (name == "right") {
        basic.showLeds(`
            . . . . .
            . . . # .
            # # # # #
            . . . # .
            . . . . .
            `)
        fnc_turn_right()
    } else if (name == "left") {
        basic.showLeds(`
            . . . . .
            . # . . .
            # # # # #
            . # . . .
            . . . . .
            `)
        fnc_turn_left()
    } else if (name == "fwd") {
        basic.showLeds(`
            . . # . .
            . # # # .
            . . # . .
            . . # . .
            . . # . .
            `)
        move_fwd()
    } else if (name == "servo") {
        basic.showLeds(`
            # # # # #
            . . # . .
            # # # # #
            . # # # .
            . # # # .
            `)
        turn_servo()
    }
})
let target = 0
const MOVEMENT_SPEED = 25
const TURN_SPEED = 25
let scan = false
let approach = false
let dist = 0
let moving = false
let move = false
let turning_left = false
let turning_right = false
let turn_right = false
let turn_left = false
let move_forward = false
let move_back = false
let moving_forward = false
let moving_back = false
let pos_servo = 0
let capture = false
let transport = false
let release = false
let repositioning = false
let now = input.runningTime()
let timer = false
let start = 0
let searching = false
radio.setGroup(2)
radio.sendString("")
basic.showIcon(IconNames.No)
maqueen.writeLED(maqueen.LED.LEDLeft, maqueen.LEDswitch.turnOn)
maqueen.writeLED(maqueen.LED.LEDRight, maqueen.LEDswitch.turnOn)
maqueen.servoRun(maqueen.Servos.S1,180)
basic.forever(function () {
    if (turn_right && !(turning_right)) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, TURN_SPEED)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, TURN_SPEED)
        turning_right = true
        turning_left = false
        moving = true
    } else if (turn_left && !(turning_left)) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, TURN_SPEED)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, TURN_SPEED)
        turning_left = true
        turning_right = false
        moving = true
    }else if (move_forward && !moving_forward){
        maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW,MOVEMENT_SPEED)
    }else if (move_back && !moving_back){
        maqueen.motorRun(maqueen.Motors.All,maqueen.Dir.CCW,MOVEMENT_SPEED)
    }else if (!(move) && moving) {
        maqueen.motorStop(maqueen.Motors.All)
        moving = false
        turning_left = false
        turning_right = false
    }
})
basic.forever(function () {
    if (scan) {
        dist = maqueen.Ultrasonic()
        move = true
        turn_right = true
        if (dist <= 40) {
            move = false
            turn_right = false
            scan = false
            approach = true
            target = dist
        }
        if (!timer){
            start = input.runningTime()
            timer =true
        }
        now =input.runningTime()
        if ((now-start)>=20000){

        }
        basic.pause(25)
    }else if (approach){
        move = true
        move_forward = true
        dist = maqueen.Ultrasonic()
        if (dist <= 6) {
            move = false
            move_forward = false
            maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 55)
            maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, 55)
            basic.pause(550)
            maqueen.motorStop(maqueen.Motors.All)
            maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CCW, 15)
            basic.pause(100)
            maqueen.motorStop(maqueen.Motors.All)
            maqueen.servoRun(maqueen.Servos.S1, 0)
            basic.pause(1000)
            approach = false
        }else if (dist <= target){
            target = dist
        }else if (dist >= target){
            approach = false
            move_forward = false
            move = false
            scan = true
        }
    }
})
function make_uturn(direction = "left") {
    switch (direction) {
        case "left":
            maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 50)
            maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CCW, 50)
            basic.pause(500)
            maqueen.motorStop(maqueen.Motors.All)
            break
        case "right":
            maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 50)
            maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, 50)
            basic.pause(500)
            maqueen.motorStop(maqueen.Motors.All)
            break

    }
}
/*basic.forever(function () {
    dist = maqueen.Ultrasonic()
    if (dist <= 6) {
        move = false
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 55)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, 55)
        basic.pause(550)
        maqueen.motorStop(maqueen.Motors.All)
        music.play(music.stringPlayable("A E A G C5 A - - ", 450), music.PlaybackMode.UntilDone)
        maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CCW, 15)
        basic.pause(100)
        maqueen.servoRun(maqueen.Servos.S2, 0)
        basic.pause(1000)
        move = true
    }
})*/


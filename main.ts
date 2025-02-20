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
let movement_speed = 25
let turn_speed = 25
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
let positioning = false
let capture = false
let transport = false
let release = false
let repositioning = false
radio.setGroup(2)
radio.sendString("")
basic.showIcon(IconNames.No)
maqueen.writeLED(maqueen.LED.LEDLeft, maqueen.LEDswitch.turnOn)
maqueen.writeLED(maqueen.LED.LEDRight, maqueen.LEDswitch.turnOn)
basic.forever(function () {
    if (turn_right && !(turning_right)) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, turn_speed)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, turn_speed)
        turning_right = true
        turning_left = false
        moving = true
    } else if (turn_left && !(turning_left)) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, turn_speed)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, turn_speed)
        turning_left = true
        turning_right = false
        moving = true
    }else if (move_forward && !moving_forward){
        maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW,movement_speed)
    }else if (move_back && !moving_back){
        maqueen.motorRun(maqueen.Motors.All,maqueen.Dir.CCW,movement_speed)
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
        }
        basic.pause(25)
    }else if (approach){
        move = true
        move_forward = true
    }
})

let dist = 0
let scan = false
let repositioning = false
let release = false
let transport = false
let capture = false
let positioning = false
let approach = false
let turn = false
let turn_right = false
let turning_right = false
let turn_left = false
let turning_left = false
let turning = false
radio.setGroup(2)
radio.sendString("")
basic.showIcon(IconNames.No)
maqueen.writeLED(maqueen.LED.LEDLeft, maqueen.LEDswitch.turnOn)
maqueen.writeLED(maqueen.LED.LEDRight, maqueen.LEDswitch.turnOn)
scan = true
basic.forever(function () {
    if (turn_right && !turning_right) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 50)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, 50)
        turning_right = true
        turning_left = false
        turning = true
    }else if (turn_left && !turning_left) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 50)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, 50)
        turning_left = true
        turning_right = false
        turning = true
    } else if (!turn && turning) {
        maqueen.motorStop(maqueen.Motors.All)
        turning = false
        turning_left = false
        turning_right = false
    }
})
basic.forever(function () {
    if (scan) {
        dist = maqueen.Ultrasonic()
        turn = true
        turn_right = true
        if (dist <= 40) {
            turn = false
            turn_right = false
            scan = false
            approach = true
        }
        basic.pause(25)
    }
})
radio.onReceivedNumber(function(receivedNumber: number) {
    if (receivedNumber == 0){
        basic.showIcon(IconNames.Yes)
        radio.sendNumber(1)
    }
})
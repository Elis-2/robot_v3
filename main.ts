let dist = 0
let scan = false
let repositioning = false
let release = false
let transport = false
let capture = false
let positioning = false
let approach = false
let turn = false
let turning = false
maqueen.writeLED(maqueen.LED.LEDLeft, maqueen.LEDswitch.turnOn)
maqueen.writeLED(maqueen.LED.LEDRight, maqueen.LEDswitch.turnOn)
scan = true
basic.forever(function () {
    if (turn && !turning) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 50)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, 50)
        turning = true
    } else if (!turn && turning) {
        maqueen.motorStop(maqueen.Motors.All)
        turning = false
    }
})
basic.forever(function () {
    if (scan) {
        dist = maqueen.Ultrasonic()
        turn = true
        if (dist <= 40) {
            turn = false
            scan = false
        }
        basic.pause(25)

    }
})

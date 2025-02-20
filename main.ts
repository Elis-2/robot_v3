//speeds
let movement_speed = 25
let turn_speed = 25

//movement
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

//states
let scan = false
let approach = false
let capture = false
let transport = false
let release = false
let repositioning = false
let timer = false
let searching = false

//diverse
let now = 0
let start = 0
let target = 0
let pos_servo = 0
let dist = 0
let prob_uturn = 10
let nb_chng = 0

//test movement functions
function turn_servo() {
    pos_servo = (pos_servo + 180) % 360
    maqueen.servoRun(maqueen.Servos.S1, pos_servo)
}
function move_fwd() {
    maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 100)
    basic.pause(50)
    maqueen.motorStop(maqueen.Motors.All)
}

function fnc_turn_left() {
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CCW, 100)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 100)
    basic.pause(50)
    maqueen.motorStop(maqueen.Motors.All)
}
function fnc_turn_right() {
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, 100)
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 100)
    basic.pause(50)
    maqueen.motorStop(maqueen.Motors.All)
}

//rdio test receiver
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


//initialisation
radio.setGroup(2)
radio.sendString("")
basic.showIcon(IconNames.No)
maqueen.writeLED(maqueen.LED.LEDLeft, maqueen.LEDswitch.turnOn)
maqueen.writeLED(maqueen.LED.LEDRight, maqueen.LEDswitch.turnOn)
maqueen.servoRun(maqueen.Servos.S1, 180)

//radio receiver
radio.onReceivedNumber(function (receivedNumber) {
    if (receivedNumber == 0) {
        basic.showIcon(IconNames.Yes)
        radio.sendNumber(1)
    } else if (receivedNumber == 2) {
        basic.showIcon(IconNames.Target)
        scan = true
    } else if (receivedNumber == 3) {
        scan = false
        approach = false
        move = false
    }
})

//movement handler
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
    } else if (move_forward && !moving_forward) {
        maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, movement_speed)
    } else if (move_back && !moving_back) {
        maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CCW, movement_speed)
    } else if (!(move) && moving) {
        maqueen.motorStop(maqueen.Motors.All)
        moving = false
        turning_left = false
        turning_right = false
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

//state handler
basic.forever(function () {
    //scan behavior
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
        if (!timer) {
            start = input.runningTime()
            timer = true
        }
        now = input.runningTime()
        if ((now - start) >= 20000) {
            scan = false
            searching = true
            move = false
            turn_right = false
            timer = false
        }
        basic.pause(25)
    }
    //approach when object detected
    else if (approach) {
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
            transport = true
        } else if (dist <= target) {
            target = dist
        } else if (dist >= target) {
            approach = false
            move_forward = false
            move = false
            scan = true
        }
    }
    //ball transport once captured
    else if (transport) {
        movement_speed = 20
        move = true
        move_back = true
        let right = maqueen.readPatrol(maqueen.Patrol.PatrolRight)
        basic.pause(10)
        let left = maqueen.readPatrol(maqueen.Patrol.PatrolLeft)
        basic.pause(10)
        if (right == 0 || left == 0) {
            move = false
            move_back = false
            transport = false
            release = true
            movement_speed = 25
        }
    }
    //ball release
    else if (release) {
        maqueen.servoRun(maqueen.Servos.S1, 180)
        release = false
        repositioning = true
    }
    //going back into the board
    else if (repositioning) {
        move = true
        move_forward = true
        if (!timer) {
            start = input.runningTime()
            timer = true
        }
        now = input.runningTime()
        if ((now - start) >= 6000) {
            repositioning = false
            scan = true
            move = false
            move_forward = false
            timer = false
        }
    }
    //if scan gives nothing after 20 sec searching is enabled for 20 sec
    else if (searching) {
        let right = maqueen.readPatrol(maqueen.Patrol.PatrolRight)
        basic.pause(10)
        let left = maqueen.readPatrol(maqueen.Patrol.PatrolLeft)
        basic.pause(10)
        if (left == 0) {
            prob_uturn = Math.floor(Math.random() * 10)
            if (prob_uturn == 0 || nb_chng == 5) {
                nb_chng = 0
                make_uturn("right")
            } else {
                nb_chng += 1
                maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, 50)
            }
        } else {
            maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 50)
        }
        if (right == 0) {
            prob_uturn = Math.floor(Math.random() * 10)
            if (prob_uturn == 0 || nb_chng == 5) {
                nb_chng = 0
                make_uturn("left")
            } else {
                nb_chng += 1
                maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CCW, 50)
            }
        } else {
            maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 50)
        }
        basic.pause(50)
        maqueen.motorStop(maqueen.Motors.All)
        dist = maqueen.Ultrasonic()
        if (dist <= 6) {
            searching = false
            approach = true
            target = dist
        }
        if (!timer) {
            start = input.runningTime()
            timer = true
        }
        now = input.runningTime()
        if ((now - start) >= 20000) {
            repositioning = false
            scan = true
            move = false
            move_forward = false
            timer = false
        }
    }
})
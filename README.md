# AB3 Wayfinder

## Indoor Navigation System for Visually Impaired Users

AB3 Wayfinder is an indoor navigation and obstacle detection system designed to assist visually impaired users in navigating the AB3 building.

The project combines a web-based indoor navigation system with an ESP32-based hardware system for obstacle and wet-floor detection.

## Project Overview

The system consists of two main parts:

1. **Web-Based Indoor Navigation**
2. **ESP32-Based Obstacle Detection**

The website allows the user to identify their current location, select a destination, and receive step-by-step navigation instructions.

The ESP32 hardware detects obstacles on the left and right sides and provides directional vibration feedback. A rain sensor is also used to detect wet-floor conditions.

## Web-Based Navigation

The AB3 Wayfinder website provides:

- Current location selection
- NFC-based location identification
- Destination selection
- Shortest-route calculation
- Step-by-step navigation instructions
- Next and Back navigation controls
- Indoor floor-map visualization
- Approximate walking distance in paces

The website supports NFC location URLs such as:

`?location=stairs1`

When an NFC tag is tapped, the URL can automatically set the user's current location.

### Live Website

The complete website can be accessed here:

**[AB3 Wayfinder – Live Website](YOUR_GITHUB_PAGES_LINK_HERE)**


## Navigation Locations

The website contains the following navigation points:

- Entrance
- Washroom 1
- Washroom 2
- Stairs 1
- Stairs 2
- Stairs 3
- Stairs 4
- Exit 1
- Exit 2
- Lift
- AB3 Canteen
- Kamaraj Auditorium
- V-Nest

The indoor layout is represented using nodes and connections between locations. The website calculates a shortest path between the selected current location and destination.

## Hardware

The hardware system uses an ESP32 to process sensor readings and control vibration feedback.

### Components

- ESP32
- 2 × HC-SR04 Ultrasonic Sensors
- 2 × Vibration Motors
- Rain Sensor
- Resistors
- Connecting Wires
- Breadboard / Prototype Setup
- Power Supply

## Obstacle Detection

Two ultrasonic sensors are used to detect obstacles on the left and right sides.

### Left Side

- Less than 8 cm → Fast vibration
- 8–16 cm → Slow vibration
- Above 16 cm → No vibration

### Right Side

- Less than 8 cm → Fast vibration
- 8–16 cm → Slow vibration
- Above 16 cm → No vibration

The vibration feedback allows the user to identify the direction of the detected obstacle.

## Wet-Floor Detection

A rain sensor is used to detect wet-floor conditions.

When a wet-floor condition is detected, both vibration motors are activated to provide an alert to the user.

## Hardware Pin Configuration

| Component | ESP32 Pin |
|-----------|-----------|
| Left Ultrasonic Trigger | GPIO 5 |
| Left Ultrasonic Echo | GPIO 18 |
| Right Ultrasonic Trigger | GPIO 17 |
| Right Ultrasonic Echo | GPIO 19 |
| Right Vibration Motor | GPIO 22 |
| Left Vibration Motor | GPIO 23 |
| Rain Sensor | GPIO 34 |

## Working


              NFC TAG
                 |
                 v
        +------------------+
        | AB3 Wayfinder    |
        |     Website      |
        +--------+---------+
                 |
          Current Location
                 |
                 v
         Select Destination
                 |
                 v
          Route Calculation
                 |
                 v
       Step-by-Step Guidance


        Physical Environment
                 |
        +--------+--------+
        |                 |
        v                 v
  Ultrasonic Sensors   Rain Sensor
        |                 |
        +--------+--------+
                 |
                 v
               ESP32
                 |
          +------+------+
          |             |
          v             v
     Left Motor    Right Motor
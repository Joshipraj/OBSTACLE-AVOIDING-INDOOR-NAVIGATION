// =====================================================
// AB3 WAYFINDER - FINAL SENSOR LOGIC
// =====================================================

// Ultrasonic pins
#define SENSOR_A_TRIG 5
#define SENSOR_A_ECHO 18

#define SENSOR_B_TRIG 17
#define SENSOR_B_ECHO 19

// Vibrators - TESTED AND CONFIRMED
#define RIGHT_VIBRATOR 22
#define LEFT_VIBRATOR 23

// Rain sensor
#define RAIN_SENSOR_PIN 34


long getDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);

  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000);

  if (duration == 0) return 999;

  return duration * 0.034 / 2;
}


void setup() {
  Serial.begin(115200);

  pinMode(SENSOR_A_TRIG, OUTPUT);
  pinMode(SENSOR_A_ECHO, INPUT);

  pinMode(SENSOR_B_TRIG, OUTPUT);
  pinMode(SENSOR_B_ECHO, INPUT);

  pinMode(RIGHT_VIBRATOR, OUTPUT);
  pinMode(LEFT_VIBRATOR, OUTPUT);

  digitalWrite(RIGHT_VIBRATOR, LOW);
  digitalWrite(LEFT_VIBRATOR, LOW);

  analogReadResolution(12);

  Serial.println("AB3 WAYFINDER STARTED");
}


void loop() {

  // Read the physical sensors
  long sensorA = getDistance(SENSOR_A_TRIG, SENSOR_A_ECHO);
  delay(30);
  long sensorB = getDistance(SENSOR_B_TRIG, SENSOR_B_ECHO);

  // =================================================
  // SWAP LEFT AND RIGHT SENSOR READINGS
  // =================================================

  // Pins 5/18 are physically on the LEFT
  long leftDistance = sensorA;

  // Pins 17/19 are physically on the RIGHT
  long rightDistance = sensorB;


  // Rain sensor
  int rainValue = analogRead(RAIN_SENSOR_PIN);

  bool wetFloor =
    (rainValue >= 1800 && rainValue <= 2300);


  Serial.println("--------------------------------");
  Serial.print("LEFT: ");
  Serial.print(leftDistance);
  Serial.println(" cm");

  Serial.print("RIGHT: ");
  Serial.print(rightDistance);
  Serial.println(" cm");

  Serial.print("RAIN: ");
  Serial.println(rainValue);


  // =================================================
  // WET FLOOR PRIORITY
  // =================================================

  if (wetFloor) {

    Serial.println("WET FLOOR DETECTED");

    digitalWrite(LEFT_VIBRATOR, HIGH);
    digitalWrite(RIGHT_VIBRATOR, HIGH);

    delay(150);

    digitalWrite(LEFT_VIBRATOR, LOW);
    digitalWrite(RIGHT_VIBRATOR, LOW);

    delay(150);

    return;
  }


  // =================================================
  // LEFT SIDE
  // =================================================

  if (leftDistance >= 0 && leftDistance < 8) {

    Serial.println("CAUTION LEFT - FAST");

    digitalWrite(LEFT_VIBRATOR, HIGH);
    delay(80);
    digitalWrite(LEFT_VIBRATOR, LOW);
    delay(80);

  }
  else if (leftDistance >= 8 && leftDistance <= 16) {

    Serial.println("CAUTION LEFT - SLOW");

    digitalWrite(LEFT_VIBRATOR, HIGH);
    delay(80);
    digitalWrite(LEFT_VIBRATOR, LOW);
    delay(400);

  }
  else {
    digitalWrite(LEFT_VIBRATOR, LOW);
  }


  // =================================================
  // RIGHT SIDE
  // =================================================

  if (rightDistance >= 0 && rightDistance < 8) {

    Serial.println("CAUTION RIGHT - FAST");

    digitalWrite(RIGHT_VIBRATOR, HIGH);
    delay(80);
    digitalWrite(RIGHT_VIBRATOR, LOW);
    delay(80);

  }
  else if (rightDistance >= 8 && rightDistance <= 16) {

    Serial.println("CAUTION RIGHT - SLOW");

    digitalWrite(RIGHT_VIBRATOR, HIGH);
    delay(80);
    digitalWrite(RIGHT_VIBRATOR, LOW);
    delay(400);

  }
  else {
    digitalWrite(RIGHT_VIBRATOR, LOW);
  }

  delay(30);
}
// the setup function runs once when you press reset or power the board
void setup() {
  // initialize digital pin LED_BUILTIN as an output.
  pinMode(13, OUTPUT);
  pinMode(12, OUTPUT);
  pinMode(11, OUTPUT);
  pinMode(10, OUTPUT);
  pinMode(9,  OUTPUT);
  pinMode(8,  OUTPUT);
  pinMode(7,  OUTPUT);
  pinMode(6,  OUTPUT);
  pinMode(5,  INPUT);
}

void trafficLights(int green, int amber, int red, int state) {
  switch (state) {
    case 0:
      // State 0
      digitalWrite(green, HIGH);
      digitalWrite(amber, LOW);
      digitalWrite(red,   LOW);
      break;
    case 1:
      digitalWrite(green,LOW);
      digitalWrite(amber, HIGH);
      // red unchanged
      break;
    case 2:
      // green unchanged
      digitalWrite(amber, LOW);
      digitalWrite(red, HIGH);
      break;
    case 6:
      // green unchanged
      digitalWrite(amber, HIGH);
      // red unchanged
      break;
    case 10:
      // State 0'
      digitalWrite(green, HIGH);
      digitalWrite(amber, LOW);
      //digitalWrite(red,   LOW);
      break;
    case 11:
      // State 1'
      digitalWrite(green,LOW);
      digitalWrite(amber, HIGH);
      // red unchanged
      break;
    case 12:
      //State 2'
      // green unchanged
      digitalWrite(amber, LOW);
      digitalWrite(red, HIGH);
      break;
    case 16:
      // green unchanged
      digitalWrite(amber, HIGH);
      // red unchanged
    default:
      break;
  }
}

// the loop function runs over and over again forever
void loop() {
  for (int i = 0; i < 7; i++) {
    if (!digitalRead(5)) {
    trafficLights(13,12,11,i);
    trafficLights(10,9,8,(i+3)%7);
    delay(500);
    } else {
      trafficLights(13,12,11,i+10);
      trafficLights(10,9,8,(i+3)%6+10);
      delay(500);
      if (i == 5) {
        digitalWrite(6,LOW);
        digitalWrite(7,HIGH);
        delay (4000);
        digitalWrite(7,LOW);
        digitalWrite(6,HIGH);
      }
    }
  }
}

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

// GREEN, AMBER, RED, WAIT
int mainTable[5][4] = {
  {0,0,1, 500},
  {0,1,1, 500},
  {1,0,0, 1000},
  {0,1,0, 500},
  {0,0,1, 500}
};
// GREEN, RED, WAIT
int pedestrianTable[9][3] = {
  {0,1, 200},
  {1,0, 2000},
  {0,0, 500},
  {1,0, 500},
  {0,0, 500},
  {1,0, 500},
  {0,0, 500},
  {1,0, 500},
  {0,1, 200}
};
bool pedestrianWaiting = false;
int crossingCount = 2;

void loop() {
  for (int j=0; j < crossingCount; j++) {
    for (int i=0; i < sizeof mainTable / sizeof *mainTable; i++) {
      digitalWrite(13 - (j * 3), mainTable[i][0]);
      digitalWrite(12 - (j * 3), mainTable[i][1]);
      digitalWrite(11 - (j * 3), mainTable[i][2]);
      delay(mainTable[i][3]);
      if (digitalRead(5)) {
        pedestrianWaiting = true;
      }
    }
  }

  if (pedestrianWaiting) {
    for (int i=0; i < sizeof pedestrianTable / sizeof *pedestrianTable; i++) {
      digitalWrite(7, pedestrianTable[i][0]);
      digitalWrite(6, pedestrianTable[i][1]);
      delay(pedestrianTable[i][2]);
      pedestrianWaiting = false;
    }
  }
}

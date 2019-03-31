#include <elapsedMillis.h>
#include "SPI.h" // SPI library
#include "MFRC522.h" // RFID library (https://github.com/miguelbalboa/rfid)
const int pinRST = 3;
const int pinSDA = 53;
String stackId="611703943";
String tag="";
MFRC522 mfrc522(pinSDA, pinRST); // Set up mfrc522 on the Arduino
const float Kp = 0.6; //0.3;//0.45;   // Kp value that you have to change 0.45
const float Kd = 30;//18;//25;
//kd=1;// Kd  value that you have to change 150
const float setPoint = 35;    // Middle point of sensor array
const float baseSpeed = 40;    // Base speed for your motors
const float maxSpeed = 70;   // Maximum speed for your motors

const byte rx1 = 19;    // Defining pin 0 as Rx
const byte tx1 = 18;    // Defining pin 1 as Tx
const byte e1 = 22;    // Defining pin 0 as Rx
const byte j1 = 23;    // Defining pin 1 as Tx

const byte black = 34;
const byte gp = 4;

const byte lbd = 8;
const byte lbp = 9;
const byte rbd = 10;
const byte rbp = 11;
const byte lfd = 6;
const byte lfp = 7;
const byte rfd = 12;
const byte rfp = 5;


int count;
const byte btpower =32;
char botDir;
int xc,yc,xd,yd;

const byte ir1 = 40;
const byte ir2 = 41;


void setup() {
  SPI.begin(); // open SPI connection
  mfrc522.PCD_Init(); // Initialize Proximity Coupling Device (PCD)
  pinMode(e1,OUTPUT);   // Setting e1 as digital output pin
  pinMode(j1,INPUT);   // Setting j1 as digital input pin
  pinMode(btpower,OUTPUT);
  digitalWrite(btpower,HIGH);
  count =0;
  botDir='N';
  xc=yc=xd=yd=0;
  // Setting pin 10 - 13 as digital output pin
  for(byte i=5;i<=13;i++) {
    pinMode(i,OUTPUT);
  }
  pinMode(gp,OUTPUT);
  pinMode(black,OUTPUT);
  
  digitalWrite(gp,LOW);
  
  analogWrite(lbp,0);
  analogWrite(rbp,0);
  analogWrite(lfp,0);
  analogWrite(rfp,0);

  // Setting initial condition of e1 pin to HIGH
  digitalWrite(e1,HIGH);
 
  // make sure both PWM pins are LOW
  
  // State of DIR pins are depending on your physical connection
  // if your robot behaves strangely, try changing thses two values
  digitalWrite(lbd,HIGH);
  digitalWrite(rbd,LOW);
  digitalWrite(lfd,LOW);
  digitalWrite(rfd,LOW);
  
  // Begin Serial1 communication with baudrate 9600
  Serial.begin(9600);
  Serial1.begin(9600);
  Serial2.begin(9600);
//  while(!Serial.available());
//  Serial.read();
//  getMyPos();
gripper(0);

}

float lastError = 0;    // Declare a variable to store previous error
int positionVal=0;
int junc=0;
int lastJunc=1;
char inp;
void loop() {
//  gotoDest(2,2);
//  delay(1000);
//  gotoDest(-1,0);
//  delay(500000000);
  //bringStack(2,1);
    //slightMoveStack(1);
    
//    delay(1000);
//    gripper(1);
    getDest();
//    delay(5000);
//    bool a=rfid();
//     
    //delay(10000000000);
}


void readSensor(){
   digitalWrite(e1,LOW);   // Set e1 to LOW to request UART data
  while(Serial1.available() <= 0);   // Wait for data to be available
  positionVal = Serial1.read();    // Read incoming data and store in
//riable positionVal
  digitalWrite(e1,HIGH);    // Stop requesting for UART data

//  Serial.print(positionVal);
//  Serial.print(" ");
    junc= digitalRead(j1);
//  Serial.println(junc);
}


void moveForward(int c){
  while(true){
  readSensor();
  if( junc==1 && lastJunc==0){
    count++;
    Serial.println(count);
    
  }
  lastJunc=junc; 
  if(count==c){
    count=0;
    stopBot();
    delay(1000);
    slightMoveJunc(1);
    delay(1000);
    break;
  }

  digitalWrite(lbd,HIGH);
  digitalWrite(rbd,LOW);
  digitalWrite(lfd,LOW);
  digitalWrite(rfd,LOW);

    if(positionVal == 255) {
    analogWrite(lbp,0);
    analogWrite(rbp,0);
    analogWrite(lfp,0);
    analogWrite(rfp,0);
    
  }


  // Else if line detected, calculate the motor speed and apply
  else {
    float error = positionVal - setPoint;   // Calculate the deviation from position to the set point
    float motorSpeed = Kp * error + Kd * (error - lastError);   // Applying formula of PID
    lastError = error;    // Store current error as previous error for next iteration use

    // Adjust the motor speed based on calculated value
    // You might need to interchange the + and - sign if your robot move in opposite direction
    float leftMotorSpeed = baseSpeed + motorSpeed;
    float rightMotorSpeed = baseSpeed - motorSpeed;

    // If the speed of motor exceed max speed, set the speed to max speed
    if(rightMotorSpeed > maxSpeed) rightMotorSpeed = maxSpeed;
    if(leftMotorSpeed > maxSpeed) leftMotorSpeed = maxSpeed;

    // If the speed of motor is negative, set it to 0
    if(rightMotorSpeed < 0) rightMotorSpeed = 0;
    if(leftMotorSpeed < 0) leftMotorSpeed = 0;
//    Serial.print (rightMotorSpeed);
//    Serial.print(" ");
//    Serial.println(leftMotorSpeed);
    analogWrite(lbp,leftMotorSpeed);
    analogWrite(rbp,rightMotorSpeed);
    analogWrite(lfp,leftMotorSpeed);
    analogWrite(rfp,rightMotorSpeed);
   
  }
  }

}

void stopBot(){
  analogWrite(lbp,0);
  analogWrite(rbp,0);
  analogWrite(lfp,0);
  analogWrite(rfp,0);
}



void gotoDest(int xd,int yd){
  if(xc==(xd-1)){
    resolveY(yd);
    return ;
  }
  else{
    if(yc!=0)
    gotoYzero();
  }
  resolveX(xd);
  resolveY(yd);
}


void resolveY(int yd){
  if(yc==yd){
    //reached
  }
  else if(yc<yd){
    faceWest();
    moveForward(yd-yc);
  }
  else if(yc>yd){
    faceEast();
    moveForward(yc-yd);
  }
  yc=yd;
}

void resolveX(int xd){
  if(xc<xd){
    faceNorth();
    moveForward(xd-xc-1);
    xc=xd-1;
  }
  else if(xc>xd){
    faceSouth();
    moveForward(xc-xd-1);
    xc=xd+1;
  }
}


void faceNorth(){
  if(botDir=='S'){
    turnRight();
    turnRight();
  }
  else if(botDir=='E'){
    turnLeft();
  }
  else if(botDir=='W'){
    turnRight();
  }
  botDir='N';
}

void faceSouth(){
  if(botDir=='N'){
    turnLeft();
    turnLeft();
  }
  else if(botDir=='E'){
    turnRight();
  }
  else if(botDir=='W'){
    turnLeft();
  }
  botDir='S';
}

void faceEast(){
  if(botDir=='N'){
    turnRight();
  }
  else if(botDir=='S'){
    turnLeft();
  }
  else if(botDir=='W'){
    turnLeft();
    turnLeft();
  }
  botDir='E';
}

void faceWest(){
  if(botDir=='N'){
    turnLeft();
  }
  else if(botDir=='S'){
    turnRight();
  }
  else if(botDir=='E'){
    turnLeft();
    turnLeft();
  }
  botDir='W';
}



void gotoYzero(){
  faceEast();
  moveForward(yc);
  yc=0;
}


void turnLeft(){
    delay(500);
    analogWrite(lbp,30);
    digitalWrite(lbd,LOW);
    analogWrite(lfp,30);
    digitalWrite(lfd,HIGH);
    analogWrite(rbp,30);
    digitalWrite(rbd,LOW);
    analogWrite(rfp,30);
    digitalWrite(rfd,LOW);
    delay(400);
//    while(digitalRead(ir1) && digitalRead(ir2));
//    stopBot();
//    delay(1000);
    readSensor();
    while(positionVal<25 || positionVal>45){
      analogWrite(lbp,30);
    digitalWrite(lbd,LOW);
    analogWrite(lfp,30);
    digitalWrite(lfd,HIGH);

    analogWrite(rbp,30);
    digitalWrite(rbd,LOW);
    analogWrite(rfp,30);
    digitalWrite(rfd,LOW);
      readSensor();
    }
    stopBot();
    delay(500);
    
}

void turnRight(){
    delay(500);
    analogWrite(lbp,30);
    digitalWrite(lbd,HIGH);
    analogWrite(lfp,30);
    digitalWrite(lfd,LOW);
    analogWrite(rbp,30);
    digitalWrite(rbd,HIGH);
    analogWrite(rfp,30);
    digitalWrite(rfd,HIGH);
    delay(400);

//    while(digitalRead(ir1) && digitalRead(ir2));
//    stopBot();
   // delay(1000);
    readSensor();
    while(positionVal<25 || positionVal>45){
      analogWrite(lbp,30);
      digitalWrite(lbd,HIGH);
      analogWrite(lfp,30);
      digitalWrite(lfd,LOW);
      analogWrite(rbp,30);
      digitalWrite(rbd,HIGH);
      analogWrite(rfp,30);
      digitalWrite(rfd,HIGH); 
      readSensor();
    }
    stopBot();
    delay(500);
}

void slightMoveStack(int d){
  int i1=1,i2=1;
  elapsedMillis timeElapsed;
  if(d==1){
    do{
      moveSlight(1);
      if (timeElapsed < 1000){
        continue;
      }
      i1=digitalRead(ir1);
      i2=digitalRead(ir2);
      
    }while(i1 && i2);
    }
  else if(d==0){
      do{
      moveSlight(0);
      if (timeElapsed < 800){
        continue;
      }
      i1=digitalRead(ir1);
      i2=digitalRead(ir2);
      
    }while(i1 && i2);
  }
    stopBot();
}


void slightMoveJunc(int d){
  int i1=1,i2=1;
  if(d==1){
    do{
      moveSlight(1);
      i1=digitalRead(ir1);
      i2=digitalRead(ir2);
    }while(i1 && i2);
    }
  else if(d==0){
      do{
      moveSlight(0);
      i1=digitalRead(ir1);
      i2=digitalRead(ir2);
    }while(i1 && i2);
  }
    stopBot();
}




void moveSlight(int d){
  
  if(d){
    digitalWrite(lbd,HIGH);
    digitalWrite(rbd,LOW);
    digitalWrite(lfd,LOW);
    digitalWrite(rfd,LOW); 
  }
  else{
    digitalWrite(lbd,LOW);
    digitalWrite(rbd,HIGH);
    digitalWrite(lfd,HIGH);
    digitalWrite(rfd,HIGH);
  }
  readSensor();
  
  while(positionVal==255){
    analogWrite(lbp,0);
    analogWrite(rbp,0);
    analogWrite(lfp,0);
    analogWrite(rfp,0);
    readSensor();
  }
  int Kps, Kds;
  if(d){
    Kps = 1.5;
    Kds = 10;
  }
  else{
     Kps = 0.9;
     Kds = 0 ;
  }
  
  float leftMotorSpeed,rightMotorSpeed;
  float error = positionVal - setPoint;   // Calculate the deviation from position to the set point
    float motorSpeed = Kps * error + Kds * (error - lastError);   // Applying formula of PID
    lastError = error;    // Store current error as previous error for next iteration use
   int bs = 30;
   int ms = 70;
    // Adjust the motor speed based on calculated value
    // You might need to interchange the + and - sign if your robot move in opposite direction
        leftMotorSpeed = bs + motorSpeed;
      rightMotorSpeed = bs - motorSpeed;  
      
     
   
    

    // If the speed of motor exceed max speed, set the speed to max speed
    if(rightMotorSpeed > ms) rightMotorSpeed = ms;
    if(leftMotorSpeed > ms) leftMotorSpeed = ms;

    // If the speed of motor is negative, set it to 0
    if(rightMotorSpeed < 0) rightMotorSpeed = 0;
    if(leftMotorSpeed < 0) leftMotorSpeed = 0;
   
    analogWrite(lbp,leftMotorSpeed);
    analogWrite(rbp,rightMotorSpeed);
    analogWrite(lfp,leftMotorSpeed+10);
    analogWrite(rfp,rightMotorSpeed+10);
}


void bringStack(int xd,int yd){
  gotoDest(xd,yd);
  delay(500);
  faceSouth();
  delay(500);  
  slightMoveStack(0);
  delay(5000);
  bool a = rfid();
  if(a){
    delay(2000);
    gripper(1);
    delay(500);
    slightMoveStack(1);
    delay(500);
    gotoDest(-1,0);
    Serial2.println("At control room");
  }
  else{
    delay(500);
    slightMoveStack(1);
    Serial2.print(xc);
    Serial2.print(" ");
    Serial2.println(yc);
  }
}
void returnStack(int xd,int yd){
  faceNorth();
  delay(500);
  gotoDest(xd,yd);
  delay(500);
  faceSouth();
  delay(500);  
  slightMoveStack(0);
  delay(2500);
  gripper(0);
  delay(2500);
  //delay(500);
  slightMoveStack(1);
  delay(500);
}

void gripper(int i){
  if(i){
    digitalWrite(black,LOW);
    //Serial.println("close");
    digitalWrite(gp,HIGH);
    delay(600);
    digitalWrite(gp,LOW);
  }
  else{
      digitalWrite(black,HIGH);
    //Serial.println("open");
      digitalWrite(gp,HIGH);
      delay(600);
      digitalWrite(gp,LOW);
  }
   
}



void printPos(){
  Serial.print(xc);
  Serial.print(" ");
  Serial.print(yc);
  Serial.print(" ");
  Serial.println(botDir);
}

void getMyPos(){
  Serial.println("Tell me my position");
  while(!Serial.available());
  sscanf(Serial.readString().c_str(),"%d:%d:%c",&xc,&yc,&botDir);
  printPos();
  
}

void getDest(){
  char cmd;
  //Serial.println("Tell me destination");
  while(!Serial2.available());
  String randoom ;
  randoom = Serial2.readString();
  Serial.println(randoom);
  Serial.println(randoom.c_str()[0]);
//  sscanf(randoom.c_str()[0],"%c",&cmd);
//  Serial.println(cmd);

   if(randoom.c_str()[0]=='g'){
    sscanf(randoom.c_str()+1,":%d:%d",&xd,&yd);
    Serial2.println("Input Stack id");
    while(!Serial2.available());
    stackId = Serial2.readString();
//    Serial.print(xd);
//    Serial.print(" ");
//    Serial.print(yd);
//    Serial.print(" ");
//    Serial.println(stackId); 
    bringStack(xd,yd);
    
   }
   else if(randoom.c_str()[0]=='r'){
    sscanf(randoom.c_str()+1,":%d:%d",&xd,&yd);
//    Serial.print(xd);
//    Serial.print(" ");
//    Serial.println(yd);    
    returnStack(xd,yd);
    Serial2.println("Stack returned");
   }
  //printPos();
}

bool rfid(){
  tag="";
  int temp=0;
  while(!mfrc522.PICC_IsNewCardPresent()) { // (true, if RFID tag/card is present ) PICC = Proximity Integrated Circuit Card
    Serial2.println(temp);
    if(temp>10){
      return false;
    }
    delay(1000);
    temp++;
   }
    if(mfrc522.PICC_ReadCardSerial()) { // true, if RFID tag/card was read
      //Serial.print("RFID TAG ID:");
      for (byte i = 0; i < mfrc522.uid.size; ++i) { // read id (in parts)
        //Serial.print(mfrc522.uid.uidByte[i], HEX); // print id as hex values
        tag+=mfrc522.uid.uidByte[i];
      }
      if(!strcmp(stackId.c_str(),tag.c_str())){
        Serial2.println(tag); // Print out of id is complete.
        return true;
      }
      else{
        Serial2.println("Wrong rfid"); // Print out of id is complete.
        return false;
      }
    }
//  else{
//    Serial2.println("Stack rfid  not found");
//    return false;
//  }
//  delay(2000);
}

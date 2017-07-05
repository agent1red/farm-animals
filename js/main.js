//this game will have only 1 state

var GameState = {
  //load the game assets before the game starts
  preload: function() {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('chicken', 'assets/images/chicken.png');
    this.load.image('horse', 'assets/images/horse.png');
    this.load.image('pig', 'assets/images/pig.png');
    this.load.image('sheep', 'assets/images/sheep.png');
    this.load.image('arrow', 'assets/images/arrow.png');
  },
  //executed after everything is loaded
  create: function() {

    //define the scale mode for the game
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    //create sprites and position them
    this.background = this.game.add.sprite(0, 0,'background');
    //animate sprites
    // group of animals in an array along with array text
    var animalData = [
      {key: 'chicken' , text: 'CHICKEN'},
      {key: 'horse' , text: 'HORSE'},
      {key: 'pig' , text: 'PIG'},
      {key: 'sheep' , text: 'SHEEP'}
    ];
    this.animals = this.game.add.group();
    var self = this
    var animal;
    //for each function loop that will loop through the animal elements.
    animalData.forEach(function(element){
      // set variblae animal to -1000 to make sure elements of array that are not the current animal view are off the map
    animal =  self.animals.create(-1000, self.game.world.centerY, element.key, 0);
    animal.customParams = {text: element.text};
    animal.anchor.setTo(0.5);
    animal.inputEnabled = true;
    animal.pixelPerfectClick = true;
    animal.events.onInputDown.add(self.animateAnimal, self);

    });
// first animal goes to center of map
    this.currentAnimal = this.animals.next();
    // set position of animal from the array element
    this.currentAnimal.position.set(this.game.world.centerX, this.game.world.centerY);
// left arrow
    this.leftArrow = this.game.add.sprite(60, this.game.world.centerY, 'arrow');
    this.leftArrow.anchor.setTo(0.5);
    this.leftArrow.scale.x = -1;
    //left arrow custom paramater giving direction to the left -1
    this.leftArrow.customParams = {direction: -1};

    //left arrow user input enable
    this.leftArrow.inputEnabled = true;
    this.leftArrow.input.pixelPerfectClick = true;
    this.leftArrow.events.onInputDown.add(this.switchAnimal, this);


// right arrow
    this.rightArrow = this.game.add.sprite(580, this.game.world.centerY, 'arrow');
    this.rightArrow.anchor.setTo(0.5);
    //right arrow custom paramater giving direction to the right +1
    this.rightArrow.customParams = {direction: 1};
    //right arrow user input enable
    this.rightArrow.inputEnabled = true;
    this.rightArrow.input.pixelPerfectClick = true;
    this.rightArrow.events.onInputDown.add(this.switchAnimal, this);



  },

  //this is executed multiple times per second
  update: function() {


  },
switchAnimal: function(sprite, event) {
  var newAnimal, endX;

//method for disabling arrows during switch movement

if(this.isMoving) {
  return false;
}

this.isMoving = true;


   //get the direction of the arrow
if (sprite.customParams.direction > 0) {
  // these are the initial position of the element animal
newAnimal = this.animals.next();
newAnimal.x = -newAnimal.width/2;
endX = 640 + this.currentAnimal.width/2;
} else {
  //these are the initial position of the element animal
newAnimal = this.animals.previous();
newAnimal.x = 640 + newAnimal.width/2;
endX = - this.currentAnimal.width/2;
}
   //Tween animation - smooth motion of sprites this part defines how the new animal will move from off map

   var newAnimalMovement = this.game.add.tween(newAnimal);

   //the newAnimalMovement will be sent "to" position x which is centered to world "or game board" center and 1000 miliseconds or 1 second speed
   newAnimalMovement.to({x: this.game.world.centerX}, 1000);
   //calling method to pass if moving stops "false" then another animall can move 
   newAnimalMovement.onComplete.add(function(){
     this.isMoving = false;
   }, this);
   //Tween initiated and now needs to start
   newAnimalMovement.start();


   // Tween animation - smooth animation for current animal to move off map

   var currentAnimalMovement = this.game.add.tween(this.currentAnimal);
      currentAnimalMovement.to({x: endX}, 1000);
      currentAnimalMovement.start();

      this.currentAnimal = newAnimal;
},

animateAnimal: function(sprite, event) {
  console.log('animate animal');
}

};

//initiate the Phaser framework
var game = new Phaser.Game(640, 360, Phaser.AUTO);

    game.state.add('GameState', GameState);
    game.state.start('GameState');

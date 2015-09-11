/**
 * MainMenuScreen
 */
(function (window) {

    MainMenuScreen.prototype.backgroundImage = null;
    MainMenuScreen.prototype.loadQueue = null;


    //constructor
    function MainMenuScreen(){
        // call constructor of the superclass
        this.AppScreen_constructor();

        //private variables
        /*var _privateVar1 = "value1";
         var _privateVar2 = "value2";*/

        //public getters & setters ie properties
        /*this.getProp1 = function(){return _privateVar1;};
         this.getProp2 = function(){return _privateVar2;}*/

        console.log("MainMenuScreen constructor fired!");

        this.constructScreen();
    }

    //create inheritance
    var p = createjs.extend(MainMenuScreen, AppScreen);

    MainMenuScreen.prototype.constructScreen = function(){
        //this.backgroundImage = new createjs.Bitmap(Main.loadQueue.getResult("main-menu-background"));
        //this.addChild(this.backgroundImage);

        /*//load background image
        this.loadQueue = new createjs.LoadQueue();
        this.loadQueue.on("fileload", this.handleBackgroundLoad, this);
        this.loadQueue.on("error", this.handleBackgroundError, this);
        this.loadQueue.loadFile({id:"background", src:"img/grassBackground_800_600.jpg", type:createjs.AbstractLoader.IMAGE});*/

        /*thisRef.backgroundImage = new createjs.Bitmap("img/grassBackground_800_600.jpg");
         thisRef.backgroundImage.scaleX=0.5;
         thisRef.backgroundImage.scaleY=0.5;

         thisRef.addChild(this.backgroundImage);
         thisRef.backgroundImage.image.onload = function(){
         //window.stage.update();
         };*/

    };

   /* MainMenuScreen.prototype.handleBackgroundLoad = function(evt){
        var item = evt.item;
        var type = evt.type;
        console.log('background loaded!');
        this.backgroundImage = new createjs.Bitmap(this.loadQueue.getResult("background"));
        this.addChild(this.backgroundImage);
    };

    MainMenuScreen.prototype.handleBackgroundError = function(){
        console.log('error loading background file!');
    };*/

    /**************************** Overridden methods **************************/
    /**
     * Destroys this instance of MainMenuScreen.
     * All interactivity & other processes should be disabled here
     */
    p.destroy = function(){
        this.AppScreen_destroy();
        console.log("MainMenuScreen.destroy()");
    };

    /*p.draw = function(){
        this.AppScreen_draw();
    };*/



    window.MainMenuScreen = createjs.promote(MainMenuScreen, "AppScreen");

}(window));
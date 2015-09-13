/**
 * MainMenuScreen
 */
(function (window) {

    MainMenuScreen.prototype.backgroundImage = null;
    MainMenuScreen.prototype.loadQueue = null;
    MainMenuScreen.prototype.topText = null;
    MainMenuScreen.prototype.mainMenuText = null;
    MainMenuScreen.prototype.copyrighAndVersionText = null;
    MainMenuScreen.prototype.newDrillButton = null;
    MainMenuScreen.prototype.loadDrillButton = null;

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
        //display background
        this.backgroundImage = new createjs.Bitmap(Main.loadQueue.getResult("main-menu-background"));
        this.addChild(this.backgroundImage);

        //create header text
        this.topText = new createjs.Text("A place for app or corporate logo","35px Arial","#FFFFFF");
        this.topText.x = ApplicationModel.APP_WIDTH/2 - this.topText.getBounds().width/2;
        this.topText.y = 10;
        this.addChild(this.topText);

        this.mainMenuText = new createjs.Text("Main menu","30px Arial","#FFFFFF");
        this.mainMenuText.x = ApplicationModel.APP_WIDTH/2 - this.mainMenuText.getBounds().width/2;
        this.mainMenuText.y = 260 - 50;
        this.addChild(this.mainMenuText);

        this.copyrighAndVersionText = new createjs.Text("Copyright information. Version " + ApplicationModel.VERSION,"14px Arial","#FFFFFF");
        this.copyrighAndVersionText.x = ApplicationModel.APP_WIDTH - this.copyrighAndVersionText.getBounds().width - 10;
        this.copyrighAndVersionText.y = ApplicationModel.APP_HEIGHT - 30;
        this.addChild(this.copyrighAndVersionText);

        //display menu buttons
        this.newDrillButton = new SimpleTextButton("New drill","25px Arial", "#000000", "#27D100","#00FF00","#0000FF", 150);
        this.newDrillButton.x = ApplicationModel.APP_WIDTH/2 - 150/2;
        this.newDrillButton.y = 260;
        this.addChild(this.newDrillButton);

        this.loadDrillButton = new SimpleTextButton("Load drill","25px Arial", "#000000", "#27D100","#00FF00","#0000FF", 150);
        this.loadDrillButton.x = ApplicationModel.APP_WIDTH/2 - 150/2;
        this.loadDrillButton.y = this.newDrillButton.y + 60;
        this.addChild(this.loadDrillButton);

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
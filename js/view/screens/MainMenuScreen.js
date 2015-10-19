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
        //console.log("MainMenuScreen constructor fired!");
        this.constructScreenUI();
    }

    //create inheritance
    var p = createjs.extend(MainMenuScreen, AppScreen);

    MainMenuScreen.prototype.constructScreenUI = function(){

        //display background
        this.backgroundImage = new createjs.Bitmap(DrillEditorApplication.loadQueue.getResult("main-menu-background"));
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
        this.newDrillButton = new SimpleTextButton("New drill","25px Arial", "#000000", "#FFFFFF","#999999","#0000FF", 150);
        this.newDrillButton.x = ApplicationModel.APP_WIDTH/2 - 150/2;
        this.newDrillButton.y = 260;
        this.newDrillButton.addEventListener("click", newDrillClickHandler);
        this.addChild(this.newDrillButton);

        this.loadDrillButton = new SimpleTextButton("Load drill","25px Arial", "#000000", "#FFFFFF","#999999","#0000FF", 150);
        this.loadDrillButton.x = ApplicationModel.APP_WIDTH/2 - 150/2;
        this.loadDrillButton.y = this.newDrillButton.y + 60;
        this.loadDrillButton.addEventListener("click", loadDrillClickHandler)
        this.addChild(this.loadDrillButton);

    };

    /**************************************** event handlers **********************************************/

    function newDrillClickHandler(evt){
        Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.NEW_DRILL_BUTTON_CLICK));
    }

    function loadDrillClickHandler(){
        Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.LOAD_DRILL_BUTTON_CLICK));
    }


    /**************************** Overridden methods **************************/
    /**
     * Destroys this instance of MainMenuScreen.
     * All interactivity & other processes should be disabled here
     */
    p.destroy = function(){
        this.AppScreen_destroy();

        //unsubscribe listeners
        this.newDrillButton.removeAllEventListeners();
        this.newDrillButton.destroy();

        this.loadDrillButton.removeAllEventListeners();
        this.loadDrillButton.destroy();

        console.log("MainMenuScreen.destroy()");
    };


    window.MainMenuScreen = createjs.promote(MainMenuScreen, "AppScreen");

}(window));
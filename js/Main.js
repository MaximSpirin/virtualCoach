/**
 * App entry point class
 */

(function (window){

    Main.prototype.currentScreen = null;
    Main.prototype.stage = null;

    function Main(userID, sessionID){
        this.Container_constructor();

        //init model
        window.applicationModel = ApplicationModel.getInstance();
        window.applicationModel.userID = userID;
        window.applicationModel.sessionID = sessionID;

        //service locator
        window.serviceLocator = ServiceLocator.getInstance();

        //dispatcher
        window.eventDispatcher = Dispatcher.getInstance();

        //init presentation controller
        window.presentationController = PresentationController.getInstance();


        //subscribe to dispatcher events
        window.eventDispatcher.on(ApplicationEvent.SHOW_EDITOR, showEditorHandler, this);

        //create user object that will be stored as a property of window
        window.user = new User();
        //create and init easeljs stage
        window.stage = new createjs.Stage("appCanvas");

        //proxy touch events(if running on touch device) into mouse events
        createjs.Touch.enable(window.stage);
        window.stage.mouseMoveOutside = true;

        //var supported = createjs.Touch.isSupported();
        //console.log('Touch supported = ',supported);

        //stage will call update() on every tick ie each 1/30 sec
        createjs.Ticker.addEventListener("tick", this.onTickHandler);

        window.stage.addChild(this);

        this.loadExternalAssets();

    }

    function showEditorHandler(applicationEvent){
        PresentationController.getInstance().setPresentation(applicationEvent.payload.presentation);

        this.showAppScreen(AppScreen.EDITOR, applicationEvent.payload.presentation);
    }

    var p = createjs.extend(Main, createjs.Container);

    Main.prototype.onTickHandler = function(){
      if(this.stage){
          this.stage.update();
         // console.log("stage update!");
      }
    };

    Main.prototype.showAppScreen = function(screenID, initParams){
        //get screen init params if available
        var screenClass;

        // 1. remove prev screen and dispose it
        if(this.currentScreen && this.currentScreen.stage){
            this.currentScreen.destroy();
            this.removeChild(this.currentScreen);
        }

        // 2. define class for the new screen
        switch(screenID){
            case AppScreen.MAIN_MENU:
                screenClass = MainMenuScreen;
                break;

            case AppScreen.EDITOR:
                screenClass = Editor;
                break;
        }

        // 3. instantiate new screen and add it to display list
        if(!screenClass){
            console.error("Error: cant create a new app screen as screenClass in undefined!");
            return;
        }


        this.currentScreen = initParams ? new screenClass(initParams) : new screenClass();
        this.addChild(this.currentScreen);
    };

    Main.prototype.loadExternalAssets = function(){
        //load all external files required by app
        var manifest = [
            {id:"main-menu-background", src:"img/background_2_800_600.jpg", type:createjs.AbstractLoader.IMAGE},
            {id:"rotation-icon", src:"img/rotating22.png", type:createjs.AbstractLoader.IMAGE},
            {id:"soccer-ball-icon", src:"img/soccer-ball-icon-32.png", type:createjs.AbstractLoader.IMAGE},
            {id:"ball-supply-icon", src:"img/ball-supply-icon-26.png", type:createjs.AbstractLoader.IMAGE}
        ];

        Main.loadQueue = new createjs.LoadQueue(false, null, true);
        Main.loadQueue.on("complete", this.onAssetLoadComplete, this);
        Main.loadQueue.on("error", this.onAssetLoadFailure, this);
        Main.loadQueue.loadManifest(manifest);
    };

    Main.prototype.onAssetLoadComplete = function(evt){
        window.applicationModel.assetsLoaded = true;
        console.log('Application assets loaded!');

        //when external assets loaded -> go to main menu screen
        this.showAppScreen(AppScreen.MAIN_MENU);
    };

    Main.prototype.onAssetLoadFailure = function(evt){
        window.applicationModel.assetsLoaded = false;
        console.log('Failed to load application assets!');
    };

    Main.prototype.createEmptyPresentation = function(){
        var id = createjs.UID.get();
        var presentation = new Presentation(id);

        console.log("Created a new presentation with id= " + id);

        return presentation;
    };

    //public static properties
    Main.loadQueue = null;

    window.Main = createjs.promote(Main, "Container");

}(window));

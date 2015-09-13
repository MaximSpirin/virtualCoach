/**
 * App entry point class
 */

(function (window){

    Main.prototype.currentScreen = null;
    Main.prototype.stage = null;

    function Main(userID, sessionID){
        this.Container_constructor();

        //init singletons
        window.applicationModel = ApplicationModel.getInstance();
        window.applicationModel = ApplicationModel.getInstance();
        window.applicationModel.userID = userID;
        window.applicationModel.sessionID = sessionID;

        window.serviceLocator = ServiceLocator.getInstance();
        window.eventDispatcher = $("#appContainer");

        //create user object that will be stored as a property of window
        window.user = new User();
        //init easeljs stage
        window.stage = new createjs.Stage("appCanvas");
        if(window.applicationModel.platformInfo.mobile == false){
            window.stage.enableMouseOver() ;
        }


        //stage will call update() on every tick ie each 1/30 sec
        createjs.Ticker.addEventListener("tick", this.onTickHandler);

        window.stage.addChild(this);

        this.loadExternalAssets();

        //this.showAppScreen(AppScreen.MAIN_MENU);

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
        }

        // 3. instantiate new screen and add it to display list
        this.currentScreen = new screenClass();
        this.addChild(this.currentScreen);
    };

    Main.prototype.loadExternalAssets = function(){
        //load all external files required by app
        var manifest = [
            {id:"main-menu-background", src:"img/background_2_800_600.jpg", type:createjs.AbstractLoader.IMAGE}
        ];

        Main.loadQueue = new createjs.LoadQueue();
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

    //public static properties
    Main.loadQueue = null;

    window.Main = createjs.promote(Main,"Container");

}(window));

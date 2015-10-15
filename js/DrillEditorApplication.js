/**
 * App entry point class
 */

(function (window){

    DrillEditorApplication.prototype.currentScreen = null;
    DrillEditorApplication.prototype.stage = null;
    DrillEditorApplication.prototype.presentationController = null;

    /**
     * Constructor
     * @constructor
     */
    function DrillEditorApplication(){

        this.Container_constructor();

        //init model
        window.applicationModel = ApplicationModel.getInstance();

        //service locator
        window.serviceLocator = ServiceLocator.getInstance();

        //dispatcher
        window.eventDispatcher = Dispatcher.getInstance();

        //init presentation controller
        this.presentationController = PresentationController.getInstance();

        //add callback to proxy
        DrillEditorProxy.getDrillDataCallback = getDrillDataCallback;


        //subscribe to dispatcher events
        //window.eventDispatcher.on(ApplicationEvent.SHOW_EDITOR, showEditorHandler, this);
        window.eventDispatcher.on(ApplicationEvent.NEW_DRILL_BUTTON_CLICK, newDrillButtonClickHandler, this);


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


    function getDrillDataCallback() {
        return {name:"agent007"};
    }

    /*function showEditorHandler(applicationEvent){
        this.presentationController.setPresentation(applicationEvent.payload.presentation);

        this.showAppScreen(AppScreen.EDITOR, applicationEvent.payload.presentation);
    }*/

    function newDrillButtonClickHandler(event){
       this.presentationController.createEmptyPresentation();
       this.showAppScreen(AppScreen.EDITOR);
    }

    var p = createjs.extend(DrillEditorApplication, createjs.Container);

    DrillEditorApplication.prototype.onTickHandler = function(){
      if(this.stage){
          this.stage.update();
         // console.log("stage update!");
      }
    };

    DrillEditorApplication.prototype.showAppScreen = function(screenID, initParams){
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

    DrillEditorApplication.prototype.loadExternalAssets = function(){
        //load all external files required by app
        var manifest = [
            {id:"main-menu-background", src:"img/background_2_800_600.jpg", type:createjs.AbstractLoader.IMAGE},
            {id:"rotation-icon", src:"img/rotating22.png", type:createjs.AbstractLoader.IMAGE},
            {id:"soccer-ball-icon", src:"img/soccer-ball-icon-32.png", type:createjs.AbstractLoader.IMAGE},
            {id:"ball-supply-icon", src:"img/ball-supply-icon-26.png", type:createjs.AbstractLoader.IMAGE}
        ];

        DrillEditorApplication.loadQueue = new createjs.LoadQueue(false, null, true);
        DrillEditorApplication.loadQueue.on("complete", this.onAssetLoadComplete, this);
        DrillEditorApplication.loadQueue.on("error", this.onAssetLoadFailure, this);
        DrillEditorApplication.loadQueue.loadManifest(manifest);
    };

    DrillEditorApplication.prototype.onAssetLoadComplete = function(evt){
        window.applicationModel.assetsLoaded = true;
        console.log('Application assets loaded!');

        if(DrillEditorProxy.drillStartupData){
            PresentationController.getInstance().loadPresentation(DrillEditorProxy.drillStartupData);
            this.showAppScreen(AppScreen.EDITOR);
        } else {
            this.showAppScreen(AppScreen.MAIN_MENU);
        }

    };

    DrillEditorApplication.prototype.onAssetLoadFailure = function(evt){
        window.applicationModel.assetsLoaded = false;
        console.log('Failed to load application assets!');
    };

    DrillEditorApplication.prototype.createEmptyPresentation = function(){
        var id = createjs.UID.get();
        var presentation = new Presentation(id);

        console.log("Created a new presentation with id= " + id);

        return presentation;
    };

    /**************************************** public static properties ************************************************/
    DrillEditorApplication.loadQueue = null;

    /********************************************** static methods ****************************************************/


    window.DrillEditorApplication = createjs.promote(DrillEditorApplication, "Container");

}(window));

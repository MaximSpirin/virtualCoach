/**
 * App entry point class
 */

(function (window){

    /******************************************* public vars *********************************************/
    DrillEditorApplication.prototype.currentScreen = null;
    DrillEditorApplication.prototype.stage = null;
    DrillEditorApplication.prototype.presentationController = null;
    DrillEditorApplication.model = null;

    /******************************************* constructor ********************************************/

    function DrillEditorApplication(){

        this.Container_constructor();

        //init model
        this.applicationModel = ApplicationModel.getInstance();


        //service locator
        //this.serviceLocator = ServiceLocator.getInstance();

        //dispatcher
        this.eventDispatcher = Dispatcher.getInstance();

        //init presentation controller
        this.presentationController = PresentationController.getInstance();

        //add callback to proxy
        DrillEditorProxy.getDrillDataCallback = getDrillDataCallback;


        //subscribe to dispatcher events
        //window.eventDispatcher.on(ApplicationEvent.SHOW_EDITOR, showEditorHandler, this);
        this.eventDispatcher.on(ApplicationEvent.NEW_DRILL_BUTTON_CLICK, newDrillButtonClickHandler, this);
        this.eventDispatcher.on(ApplicationEvent.SHOW_SCREEN, showScreenHandler, this);
        this.eventDispatcher.on(ApplicationEvent.MAIN_MENU_LOAD_DRILL_CLICK, mainMenuLoadDrillClick, this);
        this.eventDispatcher.on(ApplicationEvent.LOAD_DRILL_BUTTON_CLICK, loadDrillFormLoadButtonClick, this);


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

    var p = createjs.extend(DrillEditorApplication, createjs.Container);




    /********************************** event handlers and callbacks *************************************/

    function getDrillDataCallback() {
        var presentationDTO = PresentationController.getInstance().getPresentationDTO();
        return presentationDTO;
    }

    function showScreenHandler(event){
        var screenId = event.payload.screenId;
        var params = event.payload.initParams;
        this.showAppScreen(screenId, params);
    }

    function newDrillButtonClickHandler(event){
       this.presentationController.createEmptyPresentation();
       this.showAppScreen(AppScreen.EDITOR);
    }

    function loadDrillFormLoadButtonClick(event) {
        var drillId = event.payload.drillId;
        //show progress bar form
        this.currentScreen.showForm(ProgressBarForm,{headerText:"Loading you drill..."});

        DrillEditorProxy.getDrillDataById(drillId, getDrillDataSuccess, getDrillDataFailure, this);


        function getDrillDataSuccess(drillDTO){

            this.presentationController.loadPresentation(drillDTO);
            this.showAppScreen(AppScreen.EDITOR);//  scope.currentScreen.removeForm();
        }

        function getDrillDataFailure(){
            this.currentScreen.removeForm();
            //TODO - show error message panel
        }
    }

    function mainMenuLoadDrillClick(event){
        this.currentScreen.showForm(ProgressBarForm,{headerText:"Loading your saved drills..."});
        DrillEditorProxy.getSavedDrills(getSavedDrillsSuccess, getSavedDrillsFailure, this);

        function getSavedDrillsSuccess(drills){
            console.log("Successfully loaded drills");
            ApplicationModel.getInstance().savedDrills = drills;
            this.currentScreen.removeForm();
            this.currentScreen.showForm(LoadDrillView,{
                positiveCallback: null,
                negativeCallback: null,
                callbackScope: this
            });
        }

        function getSavedDrillsFailure(){
            console.log("Failed to load drills");
        }
    }

    DrillEditorApplication.prototype.onTickHandler = function(){
        if(this.stage){
            this.stage.update();
            // console.log("stage update!");
        }
    };

    DrillEditorApplication.prototype.onAssetLoadComplete = function(evt){
        this.applicationModel.assetsLoaded = true;
        console.log('Application assets loaded!');

        if(DrillEditorProxy.drillStartupData){
            this.applicationModel.appMode = ApplicationModel.EDIT_DRILL_APP_MODE;
            PresentationController.getInstance().loadPresentation(DrillEditorProxy.drillStartupData);
            this.showAppScreen(AppScreen.EDITOR);
        } else {
            this.applicationModel.appMode = ApplicationModel.NEW_DRILL_APP_MODE;
            this.showAppScreen(AppScreen.MAIN_MENU);
        }

    };

    DrillEditorApplication.prototype.onAssetLoadFailure = function(evt){
        this.applicationModel.assetsLoaded = false;
        console.log('Failed to load application assets!');
    };
    /**************************************** public function ******************************************/

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


    /**************************************** public static properties ************************************************/
    DrillEditorApplication.loadQueue = null;

    /********************************************** static methods ****************************************************/


    window.DrillEditorApplication = createjs.promote(DrillEditorApplication, "Container");

}(window));

//##############################################################################
// DrillEditorApplication
//##############################################################################

/**
 * App entry point class
 */

this.drillEditor = this.drillEditor || {};

(function (){
    "use strict";


    /******************************************* constructor ********************************************/

    function DrillEditorApplication(){

        this.Container_constructor();

        //init model
        this.applicationModel = drillEditor.ApplicationModel.getInstance();


        //dispatcher
        this.eventDispatcher = drillEditor.Dispatcher.getInstance();

        //init presentation controller
        this.presentationController = drillEditor.PresentationController.getInstance();

        //add callback to proxy
        drillEditor.DrillEditorProxy.getDrillDataCallback = getDrillDataCallback;


        //subscribe to dispatcher events
        //window.eventDispatcher.on(ApplicationEvent.SHOW_EDITOR, showEditorHandler, this);
        this.eventDispatcher.on(drillEditor.ApplicationEvent.NEW_DRILL_BUTTON_CLICK, newDrillButtonClickHandler, this);
        this.eventDispatcher.on(drillEditor.ApplicationEvent.SHOW_SCREEN, showScreenHandler, this);
        this.eventDispatcher.on(drillEditor.ApplicationEvent.MAIN_MENU_LOAD_DRILL_CLICK, mainMenuLoadDrillClick, this);
        this.eventDispatcher.on(drillEditor.ApplicationEvent.LOAD_DRILL_BUTTON_CLICK, loadDrillFormLoadButtonClick, this);


        //create and init easeljs stage
        window.stage = new createjs.Stage("appCanvas");

        //proxy touch events(if running on touch device) into mouse events
        createjs.Touch.enable(window.stage);
        window.stage.mouseMoveOutside = true;

        //var supported = createjs.Touch.isSupported();
        //console.log('Touch supported = ',supported);

        //stage will call update() on every tick ie each 1/30 sec
        createjs.Ticker.on("tick", this.onTickHandler);

        window.stage.addChild(this);

        this.loadExternalAssets();

    }

    var p = createjs.extend(DrillEditorApplication, createjs.Container);


    /********************************** event handlers and callbacks *************************************/

    function getDrillDataCallback() {
        var presentationDTO = drillEditor.PresentationController.getInstance().getPresentationDTO();
        return presentationDTO;
    }

    function showScreenHandler(event){
        var screenId = event.payload.screenId;
        var params = event.payload.initParams;
        this.showAppScreen(screenId, params);
    }

    function newDrillButtonClickHandler(event){
       this.presentationController.createEmptyPresentation();
       this.showAppScreen(drillEditor.AppScreen.EDITOR);
    }

    function loadDrillFormLoadButtonClick(event) {
        var drillId = event.payload.drillId;
        //show progress bar form
        this.currentScreen.showForm(drillEditor.ProgressBarForm,{headerText:"Loading you drill..."});

        drillEditor.DrillEditorProxy.getDrillDataById(drillId, getDrillDataSuccess, getDrillDataFailure, this);


        function getDrillDataSuccess(drillDTO){
            this.presentationController.loadPresentation(drillDTO);
            this.showAppScreen(drillEditor.AppScreen.EDITOR);//  scope.currentScreen.removeForm();
        }

        function getDrillDataFailure(){
            this.currentScreen.removeForm();
            //TODO - show error message panel
        }
    }

    function mainMenuLoadDrillClick(event){
        this.currentScreen.showForm(drillEditor.ProgressBarForm,{headerText:"Loading your saved drills..."});
        drillEditor.DrillEditorProxy.getSavedDrills(getSavedDrillsSuccess, getSavedDrillsFailure, this);

        function getSavedDrillsSuccess(drills){
            console.log("Successfully loaded drills");
            drillEditor.ApplicationModel.getInstance().savedDrills = drills;
            this.currentScreen.removeForm();
            this.currentScreen.showForm(drillEditor.LoadDrillView,{
                positiveCallback: null,
                negativeCallback: null,
                callbackScope: this
            });
        }

        function getSavedDrillsFailure(errorMessage){
            console.log("Failed to load drills",errorMessage);
            this.currentScreen.removeForm();
            this.currentScreen.showForm(drillEditor.ErrorDialogForm,{
                errorMessage: errorMessage,
                positiveCallback: null,
                negativeCallback: null,
                callbackScope: this
            });
        }
    }

    p.onTickHandler = function(){
        if(window.stage){
            window.stage.update();
            // console.log("stage update!");
        }
    };

    p.onAssetLoadComplete = function(evt){
        this.applicationModel.assetsLoaded = true;
        console.log('Application assets loaded!');

        if(drillEditor.DrillEditorProxy.drillStartupData){
            this.applicationModel.appMode = drillEditor.ApplicationModel.EDIT_DRILL_APP_MODE;
            drillEditor.PresentationController.getInstance().loadPresentation(drillEditor.DrillEditorProxy.drillStartupData);
            this.showAppScreen(drillEditor.AppScreen.EDITOR);
        } else {
            this.applicationModel.appMode = drillEditor.ApplicationModel.NEW_DRILL_APP_MODE;
            this.showAppScreen(drillEditor.AppScreen.MAIN_MENU);
        }

    };

    p.onAssetLoadFailure = function(evt){
        this.applicationModel.assetsLoaded = false;
        console.log('Failed to load application assets!');
    };
    /**************************************** public function ******************************************/

    p.showAppScreen = function(screenID, initParams){
        //get screen init params if available
        var screenClass;

        // 1. remove prev screen and dispose it
        if(this.currentScreen && this.currentScreen.stage){
            this.currentScreen.destroy();
            this.removeChild(this.currentScreen);
        }

        // 2. define class for the new screen
        switch(screenID){
            case drillEditor.AppScreen.MAIN_MENU:
                screenClass = drillEditor.MainMenuScreen;
                break;

            case drillEditor.AppScreen.EDITOR:
                screenClass = drillEditor.Editor;
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

    p.loadExternalAssets = function(){
        //load all external files required by app
        var manifest = [
            {id:"main-menu-background", src:"Content/DrillEditor/img/background_2_800_600.jpg", type:createjs.AbstractLoader.IMAGE},
            {id:"rotation-icon", src:"Content/DrillEditor/img/rotating22.png", type:createjs.AbstractLoader.IMAGE},
            {id:"soccer-ball-icon", src:"Content/DrillEditor/img/soccer-ball-icon-32.png", type:createjs.AbstractLoader.IMAGE},
            {id:"ball-supply-icon", src:"Content/DrillEditor/img/ball-supply-icon-26.png", type:createjs.AbstractLoader.IMAGE},
            {id:"goal-component-icon", src:"Content/DrillEditor/img/goal_65_47.png", type:createjs.AbstractLoader.IMAGE}
        ];

        DrillEditorApplication.loadQueue = new createjs.LoadQueue(false, null, true);
        DrillEditorApplication.loadQueue.on("complete", this.onAssetLoadComplete, this);
        DrillEditorApplication.loadQueue.on("error", this.onAssetLoadFailure, this);
        DrillEditorApplication.loadQueue.loadManifest(manifest);
    };


    /**************************************** public static properties ************************************************/
    DrillEditorApplication.loadQueue = null;

    /********************************************** static methods ****************************************************/

    drillEditor.DrillEditorApplication = createjs.promote(DrillEditorApplication, "Container");

}());

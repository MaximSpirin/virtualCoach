//##############################################################################
//
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
            {id:"main-menu-background", src:"img/background_2_800_600.jpg", type:createjs.AbstractLoader.IMAGE},
            {id:"rotation-icon", src:"img/rotating22.png", type:createjs.AbstractLoader.IMAGE},
            {id:"soccer-ball-icon", src:"img/soccer-ball-icon-32.png", type:createjs.AbstractLoader.IMAGE},
            {id:"ball-supply-icon", src:"img/ball-supply-icon-26.png", type:createjs.AbstractLoader.IMAGE},
            {id:"goal-component-icon", src:"img/goal_65_47.png", type:createjs.AbstractLoader.IMAGE}
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



//##############################################################################
// PresentationController
//##############################################################################

/**
 * Class PresentationController
 * Created by maxim_000 on 9/21/2015.
 */

this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";

    //public variables
    PresentationController.prototype.presentation = null;
    PresentationController.prototype.presentationView = null;
    PresentationController.prototype.dispatcher = null;
    PresentationController.prototype.selectedElement = null;
    PresentationController.prototype.componentsPallete = null;

    //static variable
    PresentationController.instance = null;

    /******************************************* constructor ****************************************/
    function PresentationController() {

        if(PresentationController.instance){
            throw new Error("Only one instance of PresentationController is allowed!");
        }

        initialize.call(this);
    }

    /**************************************** public methods ****************************************/

    /**
     * Sets presentation view ie drillEditor.Pitch instance
     * @param value
     */
    PresentationController.prototype.setView = function(value){
        this.presentationView = value;


    };
    /**
     * Creates a blank presentation and assigns it to presentation var
     */
    PresentationController.prototype.createEmptyPresentation = function(){
        this.presentation = new drillEditor.Presentation(drillEditor.Presentation.DEFAULT_ID);
    };


    /**
     * Sets current presentation
     * @param value
     */
    PresentationController.prototype.loadPresentation = function (presentationDTO) {
        this.presentation = drillEditor.DTOUtils.presentationDTOToVO(presentationDTO);

        this.selectedElement = null;

    };

    /**
     * Returns DTO of the current presentation.
     */
    PresentationController.prototype.getPresentationDTO = function(){

        if(!this.presentation){
            return null;
        }

        var canvas = document.getElementById('appCanvas');
        var imageDataString = null;
        var imageDataFormatPrefix = "data:image/png;base64,";

        if(this.presentationView){

            drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_SELECTED,{data:null}));
            window.stage.update();

            imageDataString = drillEditor.CanvasUtils.getCanvasSegmentData(canvas,
                this.presentationView.x,
                this.presentationView.y,
                this.presentationView.componentWidth,
                this.presentationView.componentHeight);

                //cut "data:image/png;base64," from the data string
                var dataFormatIndex = imageDataString.indexOf(imageDataFormatPrefix);

                if(dataFormatIndex>=0){
                    imageDataString = imageDataString.substr(dataFormatIndex + imageDataFormatPrefix.length);
                }
        }

        var presentationDTO = drillEditor.DTOUtils.presentationToDTO(this.presentation);
        presentationDTO.drillImageData = imageDataString ;
        presentationDTO.drillImageFormat = imageDataString ? imageDataFormatPrefix : null;
        return presentationDTO;
    };

    /*************************************** private functions *************************************/
    function initialize() {
        //init dispatcher
        this.dispatcher = drillEditor.Dispatcher.getInstance();
        this.dispatcher.on(drillEditor.PresentationViewEvent.CREATE_RECTANGLE_CLICK, createRectangleClickHandler , this);
        this.dispatcher.on(drillEditor.PresentationViewEvent.CREATE_SQUARE_CLICK, createSquareClickHandler , this);
        this.dispatcher.on(drillEditor.PresentationViewEvent.CREATE_ATTACKER_CLICK, createAttackerClickHandler , this);
        this.dispatcher.on(drillEditor.PresentationViewEvent.CREATE_DEFENDER_CLICK, createDefenderClickHandler , this);
        this.dispatcher.on(drillEditor.PresentationViewEvent.CREATE_EXTRA_TEAM_CLICK, createExtraClickHandler , this);
        this.dispatcher.on(drillEditor.PresentationViewEvent.CREATE_NEUTRAL_PLAYER_CLICK, createNeutralPlayerClickHandler , this);
        this.dispatcher.on(drillEditor.PresentationViewEvent.CREATE_CONE_CLICK, createConeClickHandler , this);
        this.dispatcher.on(drillEditor.PresentationViewEvent.CREATE_PLAYER_PATH_CLICK, createPlayerPathClickHandler , this);
        this.dispatcher.on(drillEditor.PresentationViewEvent.CREATE_BALL_PATH_CLICK, createBallPathClickHandler , this);
        this.dispatcher.on(drillEditor.PresentationViewEvent.CREATE_BALL_CLICK, createBallClickHandler , this);
        this.dispatcher.on(drillEditor.PresentationViewEvent.CREATE_BALLS_SUPPLY_CLICK, createBallsSupplyClickHandler , this);
        this.dispatcher.on(drillEditor.PresentationViewEvent.CREATE_ARC_CLICK, createArcClickHandler, this);
        this.dispatcher.on(drillEditor.PresentationViewEvent.CREATE_DRIBBLING_CLICK, createDribblingClickHandler, this);
        this.dispatcher.on(drillEditor.PresentationViewEvent.CREATE_GOAL_CLICK, createGoalClickHandler, this);

        this.dispatcher.on(drillEditor.PresentationViewEvent.COPY_ELEMENT_BUTTON_CLICK, copyElementClickHandler, this);
        this.dispatcher.on(drillEditor.PresentationViewEvent.PASTE_ELEMENT_BUTTON_CLICK, pasteElementClickHandler, this);
        this.dispatcher.on(drillEditor.PresentationViewEvent.BACK_BUTTON_CLICK, backButtonClickHandler, this);

        this.dispatcher.on(drillEditor.ApplicationEvent.ELEMENT_SELECTED, elementSelectedHandler, this);
        this.dispatcher.on(drillEditor.PresentationViewEvent.DELETE_ELEMENT, deleteElementHandler, this);
        this.dispatcher.on(drillEditor.PresentationViewEvent.SWAP_DIRECTIONS_BUTTON_CLICK, swapDirectionsClickHandler, this);
        this.dispatcher.on(drillEditor.ApplicationEvent.PITCH_VIEW_CREATED, pitchViewCreatedHandler, this);

    }

    function getElementDefaultPosition(width, height){
        var result = new createjs.Point(this.presentationView.componentWidth/2 - width/2, this.presentationView.componentHeight/2 - height/2);
        return result;
    }

    function addItemByModel(itemModel, addedByUser) {
        var elementRenderer = createElementRenderer(itemModel);
        elementRenderer.x = itemModel.position.x;
        elementRenderer.y = itemModel.position.y;
        if(addedByUser){
            this.presentationView.elementsLayer.addChild(elementRenderer);
            itemModel.depth = this.presentationView.elementsLayer.numChildren - 1;
            drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_SELECTED,{data:elementRenderer}));
            this.presentation.elements.push(itemModel);
        } else {
            var depth = Math.min(itemModel.depth, this.presentationView.elementsLayer.numChildren);
            this.presentationView.elementsLayer.addChildAt(elementRenderer, depth);
        }

        this.actualizePlayerNumbers();
        //this.elements.push(elementRenderer);

        this.presentationView.elementsLayer.addChild(this.transformTool);
    };

    function createElementRenderer(elementVO){
        switch (elementVO.type){
            case drillEditor.GraphicElementType.RECTANGLE:
                result = new drillEditor.RectComponent();
                break;

            case drillEditor.GraphicElementType.SQUARE:
                result = new drillEditor.SquareComponent();
                break;

            case drillEditor.GraphicElementType.ATTACKER:
            case drillEditor.GraphicElementType.DEFENDER:
            case drillEditor.GraphicElementType.EXTRA_TEAM:
            case drillEditor.GraphicElementType.NEUTRAL_PLAYER:
            case drillEditor.GraphicElementType.CONE:
                result = new drillEditor.PrimitiveShapeRenderer();
                break;

            case drillEditor.GraphicElementType.DRIBBLING_PLAYER:
                result = new drillEditor.DribblingLine();
                break;

            case drillEditor.GraphicElementType.PLAYER_MOVEMENT:
                result = new drillEditor.PlayerMovementLine();
                break;

            case drillEditor.GraphicElementType.BALL_MOVEMENT:
                result = new drillEditor.BallMovementLine();
                break;

            case drillEditor.GraphicElementType.BALL:
                result = new drillEditor.BallComponent();
                break;

            case drillEditor.GraphicElementType.BALLS_SUPPLY:
                result = new drillEditor.BallSupplyComponent();
                break;

            case drillEditor.GraphicElementType.ARCUATE_MOVEMENT:
                result = new drillEditor.ArchedArrow();
                break;

            case drillEditor.GraphicElementType.GOAL:
                result = new drillEditor.Goal();
                break;
        }

        var result;
        result.setRendererData(elementVO);

        return result;
    }

    PresentationController.prototype.cloneElementData = function (sourceElementData){

        var clonedElementData;
        var newId = createjs.UID.get();
        var clonedWidth =  sourceElementData.width;
        var clonedHeight =  sourceElementData.height;
        var clonedPosition = new createjs.Point(sourceElementData.position.x, sourceElementData.position.y);
        //TODO: optimize this
        clonedPosition.x+=10;
        clonedPosition.y+=10;


        var clonedRotation = sourceElementData.rotation;

        switch (sourceElementData.type){

            case drillEditor.GraphicElementType.RECTANGLE:
                clonedElementData = new drillEditor.RectVO(newId, clonedPosition, clonedWidth, clonedHeight);
                break;

            case drillEditor.GraphicElementType.SQUARE:
                clonedElementData = new drillEditor.SquareVO(newId, clonedPosition, clonedWidth, clonedHeight);
                break;


            case drillEditor.GraphicElementType.ATTACKER:
                clonedElementData = new drillEditor.AttackerVO(newId, clonedPosition, sourceElementData.radius);
                clonedElementData.fillColor = sourceElementData.fillColor;
                break;

            case drillEditor.GraphicElementType.DEFENDER:
                clonedElementData = new drillEditor.DefenderVO(newId, clonedPosition, sourceElementData.radius);
                clonedElementData.fillColor = sourceElementData.fillColor;
                break;

            case drillEditor.GraphicElementType.EXTRA_TEAM:
                clonedElementData = new drillEditor.ExtraTeamVO(newId, clonedPosition, sourceElementData.radius);
                clonedElementData.fillColor = sourceElementData.fillColor;
                break;

            case drillEditor.GraphicElementType.NEUTRAL_PLAYER:
                clonedElementData = new drillEditor.NeutralVO(newId, clonedPosition, sourceElementData.radius);
                clonedElementData.fillColor = sourceElementData.fillColor;
                break;

            case drillEditor.GraphicElementType.CONE:
                clonedElementData = new drillEditor.ConeVO(newId, clonedPosition, clonedWidth, clonedHeight);
                clonedElementData.fillColor = sourceElementData.fillColor;
                break;

            case drillEditor.GraphicElementType.ARCUATE_MOVEMENT:
                clonedElementData = new drillEditor.ArchedArrowVO(newId, clonedPosition,
                    clonedWidth, clonedHeight,
                    sourceElementData.arrowDirection, clonedRotation);
                break;

            case drillEditor.GraphicElementType.GOAL:
                clonedElementData = new drillEditor.GoalVO(newId,clonedPosition,clonedWidth, clonedHeight, clonedRotation);
                break;

            case drillEditor.GraphicElementType.DRIBBLING_PLAYER:
                var startPointCloned = new createjs.Point(sourceElementData.startPoint.x + 16, sourceElementData.startPoint.y + 16);
                var endPointCloned = new createjs.Point(sourceElementData.endPoint.x + 16, sourceElementData.endPoint.y + 16);
                clonedElementData = new drillEditor.DribblingLineVO(newId, startPointCloned, endPointCloned, sourceElementData.arrowDirection);
                break;

            case drillEditor.GraphicElementType.PLAYER_MOVEMENT:
                var startPointCloned = new createjs.Point(sourceElementData.startPoint.x + 16, sourceElementData.startPoint.y + 16);
                var endPointCloned = new createjs.Point(sourceElementData.endPoint.x + 16, sourceElementData.endPoint.y + 16);
                clonedElementData = new drillEditor.PlayerMovementVO(newId, startPointCloned, endPointCloned, sourceElementData.arrowDirection);
                break;

            case drillEditor.GraphicElementType.BALL_MOVEMENT:
                var startPointCloned = new createjs.Point(sourceElementData.startPoint.x + 16, sourceElementData.startPoint.y + 16);
                var endPointCloned = new createjs.Point(sourceElementData.endPoint.x + 16, sourceElementData.endPoint.y + 16);
                clonedElementData = new drillEditor.BallMovementVO(newId, startPointCloned, endPointCloned, sourceElementData.arrowDirection);
                break;

            case drillEditor.GraphicElementType.BALL:
                clonedElementData = new drillEditor.BallVO(newId, clonedPosition);
                break;

            case drillEditor.GraphicElementType.BALLS_SUPPLY:
                clonedElementData = new drillEditor.BallSupplyVO(newId, clonedPosition);
                break;

        }


        return clonedElementData
    };



    PresentationController.prototype.actualizePlayerNumbers = function(){
        this.presentation.elements.sort(drillEditor.MathUtils.compareNumeric);

        var atackersCount = 0;
        var defendersCount = 0;
        var extraCount = 0;

        for(var j=0; j<this.presentation.elements.length; j++){
            var elementVO = this.presentation.elements[j];

            switch(elementVO.type){
                case drillEditor.GraphicElementType.ATTACKER:
                        atackersCount +=1;
                        elementVO.setPlayerNumber(atackersCount);
                    break;
                    case drillEditor.GraphicElementType.DEFENDER:
                        defendersCount +=1;
                        elementVO.setPlayerNumber(defendersCount);
                    break;
                    case drillEditor.GraphicElementType.EXTRA_TEAM:
                        extraCount +=1;
                        elementVO.setPlayerNumber(extraCount);
                    break;
            }

        }


    };

    /*************************************** event handler *****************************************/

    function pitchViewCreatedHandler(event){
        for(var i=0; i<this.presentation.elements.length; i++){
            var elementVO = this.presentation.elements[i];
            addItemByModel.call(this,elementVO,false);
        }
    }

    function swapDirectionsClickHandler(evt){
        if(this.selectedElement){
            this.selectedElement.rendererData.invertArrowDirection();
        }
    }

    function deleteElementHandler(evt){
        if(this.selectedElement){
            // 1. destroy element
            this.selectedElement.destroy();

            // 2. remove it from screen and from elements array
            if(this.selectedElement.stage){
                this.presentationView.elementsLayer.removeChild(this.selectedElement);
                var elementDataIndex = this.presentation.elements.indexOf(this.selectedElement.rendererData);//TODO substitute with drillEditor.Presentation.removeElementById
                this.presentation.elements.splice(elementDataIndex, 1);
            }

            // loop between VOs and update their depths according to the depth of the views
            for(var i=0; i<this.presentationView.elementsLayer.numChildren; i++){
                var childElement = this.presentationView.elementsLayer.getChildAt(i);
                childElement.rendererData.depth = i;


                   /* console.info("element %d typeof %d has index of %d",
                    childElement.rendererData.id, childElement.rendererData.type,
                    childElement.rendererData.depth);*/
            }

            this.actualizePlayerNumbers();

            this.selectedElement = null;

            //3. remove selection
            drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_SELECTED,{data:null}));
        }
    }

    function elementSelectedHandler(evt){
        this.selectedElement = evt.payload.data;
    }

    function createRectangleClickHandler(event){
        var defaultRectangleWidth = 200;
        var defaultRectangleHeight = 100;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultRectangleWidth, defaultRectangleHeight);
        var elementRendererData = new drillEditor.RectVO(elemId, elemPosition, defaultRectangleWidth, defaultRectangleHeight);
        addItemByModel.call(this, elementRendererData, true);
    }

    function createSquareClickHandler(presentationViewEvent){
        var defaultSquareWidth = 150;
        var defaultSquareHeight = 150;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultSquareWidth, defaultSquareHeight);
        var elementRendererData = new drillEditor.SquareVO(elemId, elemPosition, defaultSquareWidth, defaultSquareHeight);
        addItemByModel.call(this, elementRendererData, true);
    }

    function createAttackerClickHandler(presentationViewEvent) {
        var defaultRadius = drillEditor.PrimitiveShapeRenderer.CIRCLE_COMPONENT_MIN_RADIUS;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultRadius*2, defaultRadius*2);
        var elementRendererData = new drillEditor.AttackerVO(elemId, elemPosition, defaultRadius);
        elementRendererData.fillColor = "#382CBF";
        addItemByModel.call(this, elementRendererData, true);
    }

    function createDefenderClickHandler(presentationViewEvent) {
        var defaultRadius = 20;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultRadius*2, defaultRadius*2);
        var elementRendererData = new drillEditor.DefenderVO(elemId, elemPosition, defaultRadius);
        elementRendererData.fillColor = "#F21818";
        addItemByModel.call(this, elementRendererData, true);
    }

    function createExtraClickHandler(presentationViewEvent) {
        var defaultRadius = 20;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultRadius*2, defaultRadius*2);
        var elementRendererData = new drillEditor.ExtraTeamVO(elemId, elemPosition, defaultRadius);
        elementRendererData.fillColor = "#373060";
        addItemByModel.call(this, elementRendererData, true);
    }

    function createNeutralPlayerClickHandler(presentationViewEvent) {
        var defaultRadius = 20;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultRadius*2, defaultRadius*2);
        var elementRendererData = new drillEditor.NeutralVO(elemId, elemPosition, defaultRadius);
        elementRendererData.fillColor = "#085429";
        addItemByModel.call(this, elementRendererData, true);
    }

    function createConeClickHandler(presentationViewEvent) {
        var defaultTriangleWidth = 30;
        var defaultTriangleHeight = 35;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultTriangleWidth, defaultTriangleHeight);
        var elementRendererData = new drillEditor.ConeVO(elemId, elemPosition, defaultTriangleWidth, defaultTriangleHeight);
        elementRendererData.fillColor = "#FFEA04";
        addItemByModel.call(this, elementRendererData, true);
    }


    function createPlayerPathClickHandler(presentationViewEvent) {
        var elemId = createjs.UID.get();
        var defaultStripWidth = 150;
        var defaultStripHeight = drillEditor.PlayerMovementLine.STD_HEIGHT;

        var elementPosition = getElementDefaultPosition.call(this, defaultStripWidth, defaultStripHeight);
        elementPosition.y+=drillEditor.PlayerMovementLine.STD_HEIGHT/2;

        var startPoint = new createjs.Point(elementPosition.x, elementPosition.y);
        var endPoint = new createjs.Point(elementPosition.x + defaultStripWidth,  elementPosition.y);

        var elementRendererData = new drillEditor.PlayerMovementVO(elemId, startPoint, endPoint, drillEditor.ArrowDirection.LEFT);
        addItemByModel.call(this, elementRendererData, true);
    }

    function createBallPathClickHandler(presentationViewEvent) {
        var elemId = createjs.UID.get();
        var defaultStripWidth = 150;
        var defaultStripHeight = drillEditor.BallMovementLine.STD_HEIGHT;

        var elementPosition = getElementDefaultPosition.call(this, defaultStripWidth, defaultStripHeight);
        elementPosition.y+=drillEditor.BallMovementLine.STD_HEIGHT/2;

        var startPoint = new createjs.Point(elementPosition.x, elementPosition.y);
        var endPoint = new createjs.Point(elementPosition.x + defaultStripWidth,  elementPosition.y);

        var elementRendererData = new drillEditor.BallMovementVO(elemId, startPoint, endPoint, drillEditor.ArrowDirection.LEFT);
        addItemByModel.call(this, elementRendererData, true);
    }

    function createBallClickHandler(presentationViewEvent) {
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, drillEditor.BallComponent.STD_WIDTH, drillEditor.BallComponent.STD_HEIGHT);
        var elementRendererData = new drillEditor.BallVO(elemId, elemPosition);
        addItemByModel.call(this, elementRendererData, true);
    }

    function createBallsSupplyClickHandler(presentationViewEvent) {
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, drillEditor.BallSupplyComponent.STD_WIDTH, drillEditor.BallSupplyComponent.STD_HEIGHT);
        var elementRendererData = new drillEditor.BallSupplyVO(elemId, elemPosition);
        addItemByModel.call(this, elementRendererData, true);
    }

    function createArcClickHandler(presentationViewEvent){
        var defaultArrowDirection = drillEditor.ArrowDirection.LEFT;
        var defaultArcRotation = 0;
        var elemId = createjs.UID.get();
        var elementWidth =  drillEditor.ArchedArrow.STD_WIDTH;
        var elementHeight =  drillEditor.ArchedArrow.STD_HEIGHT;
        var elemPosition = getElementDefaultPosition.call(this, drillEditor.ArchedArrow.STD_WIDTH/2, drillEditor.ArchedArrow.STD_HEIGHT/2);
        var elementRendererData = new drillEditor.ArchedArrowVO(elemId, elemPosition, elementWidth, elementHeight, defaultArrowDirection, defaultArcRotation);
        addItemByModel.call(this, elementRendererData, true);

    }

    function createDribblingClickHandler(evt){
        var elemId = createjs.UID.get();
        var defaultStripWidth = drillEditor.DribblingLineSegment.STD_WIDTH*3;
        var defaultStripHeight = drillEditor.DribblingLineSegment.STD_HEIGHT;

        var elementPosition = getElementDefaultPosition.call(this, defaultStripWidth, defaultStripHeight);
        elementPosition.y+=drillEditor.DribblingLineSegment.STD_HEIGHT/2;

        var startPoint = new createjs.Point(elementPosition.x, elementPosition.y);
        var endPoint = new createjs.Point(elementPosition.x + defaultStripWidth,  elementPosition.y);

        var elementRendererData = new drillEditor.DribblingLineVO(elemId, startPoint, endPoint, drillEditor.ArrowDirection.LEFT);
        addItemByModel.call(this, elementRendererData, true);
    }

    function createGoalClickHandler(evt){
        var elemId = createjs.UID.get();
        var defaultRotation = 0;
        var defaultWidth = drillEditor.Goal.STD_WIDTH;
        var defaultHeight = drillEditor.Goal.STD_HEIGHT;
        var elementPosition = getElementDefaultPosition.call(this, defaultWidth, defaultHeight);
        var rendererData = new drillEditor.GoalVO(elemId, elementPosition ,defaultWidth, defaultHeight, defaultRotation);
        addItemByModel.call(this, rendererData, true);
    }

    function copyElementClickHandler(event){
        var clonedSourceData = this.cloneElementData(this.selectedElement.rendererData);
        drillEditor.Clipboard.data = clonedSourceData;
        this.dispatcher.dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.ELEMENT_COPIED_TO_CLIPBOARD,{data:clonedSourceData}));
    }

    function pasteElementClickHandler(event){
        if(drillEditor.Clipboard.data){
            var clonedElementData = this.cloneElementData(drillEditor.Clipboard.data);
            addItemByModel.call(this, clonedElementData, true);
        }
    }

    function backButtonClickHandler(event){
        //this.getPresentationDTO();
        this.setView(null);
        this.dispatcher.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.SHOW_SCREEN,{screenId:drillEditor.AppScreen.MAIN_MENU}));
    }

    /*********************************** public static method *************************************/

    PresentationController.getInstance = function(){

        if(PresentationController.instance == null){
            PresentationController.instance = new PresentationController();
        }

        return PresentationController.instance;
    };

    PresentationController.createEmptyPresentation = function(){
        var id = "000000";
        var presentation = new drillEditor.Presentation(id);

        console.log("Created a new presentation with id= " + id);

        return presentation;
    };

    drillEditor.PresentationController = PresentationController;

}());



//##############################################################################
// Dispatcher
//##############################################################################


/**
 * Class Dispatcher
 * Created by Maxim Spirin on 9/14/2015.
 */

this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    Dispatcher.instance = null;

    //constructor
    function Dispatcher() {
        if(Dispatcher.instance){
            throw  new Error("Only one instance of Dispatcher is allowed")
        }
    }

    Dispatcher.getInstance = function(){
        if(!Dispatcher.instance){
            Dispatcher.instance = new Dispatcher();
        }
        return Dispatcher.instance;
    };

    //create inheritance from EventDispatcher
    var p = createjs.extend(Dispatcher, createjs.EventDispatcher);


    drillEditor.Dispatcher = createjs.promote(Dispatcher,"EventDispatcher");

}());


//##############################################################################
// ApplicationEvent
//##############################################################################

/**
 * ApplicationEvent
 */

this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    ApplicationEvent.SHOW_SCREEN = "show_screen";
    ApplicationEvent.HIDE_CURRENT_FORM = "hide_current_form";
    ApplicationEvent.ELEMENT_SELECTED = "element_selected";
    ApplicationEvent.ELEMENT_DESELECTED = "element_deselected";
    ApplicationEvent.ELEMENT_POSITION_CHANGED = "element_position_changed";
    ApplicationEvent.ELEMENT_MOVE = "element_move";
    ApplicationEvent.ELEMENT_RESIZE = "element_resize";
    ApplicationEvent.ELEMENT_ROTATION_CHANGED = "element_rotation_changed";
    ApplicationEvent.GRAPHIC_PROPERTY_CHANGED = "item_model_property_changed";
    ApplicationEvent.NEW_DRILL_BUTTON_CLICK = "new_drill_button_click_event";
    ApplicationEvent.LOAD_DRILL_BUTTON_CLICK = "load_drill_button_click_event";
    ApplicationEvent.PITCH_VIEW_CREATED = "pitch_view_created";
    ApplicationEvent.MAIN_MENU_LOAD_DRILL_CLICK = "main_menu_load_drill_click";


    //Each instance of this event will have an associated payload object
    ApplicationEvent.prototype.payload = null;


    // constructor
    function ApplicationEvent(type, payload, bubbles, cancelable){
        this.Event_constructor(type, bubbles, cancelable);

        if(payload == null || payload == undefined){
            payload = {};
        }
        this.payload = payload;

    }

    var p = createjs.extend(ApplicationEvent, createjs.Event);

    drillEditor.ApplicationEvent = createjs.promote(ApplicationEvent, "Event");

}());



//##############################################################################
// PresentationViewEvent
//##############################################################################

/**
 * drillEditor.PresentationViewEvent
 */

this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    PresentationViewEvent.CREATE_RECTANGLE_CLICK = "create_rectangle_click";
    PresentationViewEvent.CREATE_SQUARE_CLICK = "create_square_click";
    PresentationViewEvent.CREATE_ATTACKER_CLICK = "create_attacker_click";
    PresentationViewEvent.CREATE_DEFENDER_CLICK = "create_defender_click";
    PresentationViewEvent.CREATE_EXTRA_TEAM_CLICK = "create_extra_team_click";
    PresentationViewEvent.CREATE_NEUTRAL_PLAYER_CLICK = "create_target_click";
    PresentationViewEvent.CREATE_CONE_CLICK = "create_cone_click";
    PresentationViewEvent.CREATE_DRIBBLING_CLICK = "create_dribbling_click";
    PresentationViewEvent.CREATE_PLAYER_PATH_CLICK = "create_player_path_click";
    PresentationViewEvent.CREATE_BALL_PATH_CLICK = "create_ball_path_click";
    PresentationViewEvent.CREATE_BALL_CLICK = "create_ball_click";
    PresentationViewEvent.CREATE_BALLS_SUPPLY_CLICK = "create_balls_supply_click";
    PresentationViewEvent.CREATE_ARC_CLICK = "create_arc_click";
    PresentationViewEvent.CREATE_GOAL_CLICK = "create_goal_click";
    PresentationViewEvent.COPY_ELEMENT_BUTTON_CLICK = "copy_element_button_click";
    PresentationViewEvent.PASTE_ELEMENT_BUTTON_CLICK = "paste_element_button_click";
    PresentationViewEvent.ELEMENT_COPIED_TO_CLIPBOARD = "element_copied_to_clipboard";
    PresentationViewEvent.DELETE_ELEMENT = "delete_element";
    PresentationViewEvent.SWAP_DIRECTIONS_BUTTON_CLICK = "swap_directions_button_click";
    PresentationViewEvent.BACK_BUTTON_CLICK = "back_button_click";


    //Each instance of this event will have an associated payload object
    PresentationViewEvent.prototype.payload = null;


    // constructor
    function PresentationViewEvent(type, payload, bubbles, cancelable){
        this.Event_constructor(type, bubbles, cancelable);

        if(payload == null || payload == undefined){
            payload = {};
        }
        this.payload = payload;

    }

    var p = createjs.extend(PresentationViewEvent, createjs.Event);

    drillEditor.PresentationViewEvent = createjs.promote(PresentationViewEvent, "Event");

}());



//##############################################################################
//
//##############################################################################

/**
 * Application model
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
   ApplicationModel.prototype.serviceLocator;
   ApplicationModel.prototype.platformInfo;
   ApplicationModel.prototype.assetsLoaded;
   ApplicationModel.prototype.mpp; // meters per pixel
   ApplicationModel.prototype.appMode; // eitherApplicationModel.EDIT_DRILL_APP_MODE orApplicationModel.NEW_DRILL_APP_MODE


    //static variables and constants
   ApplicationModel.VERSION = "0.1.8";
   ApplicationModel.debugVersion = false;
   ApplicationModel.instance = null;
   ApplicationModel.APP_WIDTH = 800;
   ApplicationModel.APP_HEIGHT = 600;
   ApplicationModel.DEFAULT_PITCH_WIDTH_METERS = 105;
   ApplicationModel.DEFAULT_PITCH_HEIGHT_METERS = 68;

   ApplicationModel.EDIT_DRILL_APP_MODE = "edit_drill_app_mode";
   ApplicationModel.NEW_DRILL_APP_MODE = "new_drill_app_mode";

    //static functions
   ApplicationModel.getInstance = function () {
        if(!ApplicationModel.instance){
            ApplicationModel.instance = new ApplicationModel();
        }

        return ApplicationModel.instance;
    };

    //constructor
    function ApplicationModel(){

        if(ApplicationModel.instance){
            throw new Error("Only one instance of ApplicationModel is allowed");
        }

        // initialize properties


    }

    drillEditor.ApplicationModel = ApplicationModel;

}());



//##############################################################################
// ArrowDirection
//##############################################################################

/**
 * Class ArrowDirection
 * Created by maxim_000 on 10/14/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
	"use strict";


    /******************* static variables *******************/
    ArrowDirection.RIGHT = "right";
    ArrowDirection.LEFT = "left";

    /********************** constructor *********************/
    function ArrowDirection() {
        
    }

    drillEditor.ArrowDirection = ArrowDirection;

}());


//##############################################################################
// GraphicElementType
//##############################################################################

/**
 * Class GraphicElementType
 * Created by maxim_000 on 9/21/2015.
 */

this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";

    //static variable
    GraphicElementType.RECTANGLE = 1;
    GraphicElementType.SQUARE = 2;
    GraphicElementType.ATTACKER = 3;
    GraphicElementType.DEFENDER = 4;
    GraphicElementType.EXTRA_TEAM = 5;
    GraphicElementType.NEUTRAL_PLAYER = 6;
    GraphicElementType.CONE = 7;
    GraphicElementType.DRIBBLING_PLAYER = 8;
    GraphicElementType.PLAYER_MOVEMENT = 9;
    GraphicElementType.BALL_MOVEMENT = 10;
    GraphicElementType.BALL = 11;
    GraphicElementType.BALLS_SUPPLY = 12;
    GraphicElementType.ARCUATE_MOVEMENT = 13;
    GraphicElementType.GOAL = 14;

    //constructor
    function GraphicElementType() {

    }


    drillEditor.GraphicElementType = GraphicElementType;

}());


//##############################################################################
// ArchedArrowVO
//##############################################################################

/**
 * Class ArchedArrowVO
 * Created by maxim_000 on 9/27/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
    ArchedArrowVO.prototype.arrowDirection;
    ArchedArrowVO.prototype.startPointPosition = null;
    ArchedArrowVO.prototype.endPointPosition = null;

    //static variable
    ArchedArrowVO.STROKE_SIZE = 2;
    ArchedArrowVO.STROKE_COLOR = "#000000";

    //constructor
    function ArchedArrowVO(elemId, elemPosition, elementWidth, elementHeight, arrowDirection, rotation) {
        this.arrowDirection = (arrowDirection == drillEditor.ArrowDirection.RIGHT || arrowDirection == drillEditor.ArrowDirection.LEFT) ? arrowDirection : drillEditor.ArrowDirection.LEFT;
        this.rotation = rotation;
        this.setWidth(elementWidth);
        this.setHeight(elementHeight);
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(elemId, drillEditor.GraphicElementType.ARCUATE_MOVEMENT, elemPosition);
    }

    //extend this class from a superclass
    var p = createjs.extend(ArchedArrowVO, drillEditor.GraphicItemVO);

    // flag for serialization
    p.isActivity = true;

    p.invertArrowDirection = function(){
        if(this.arrowDirection == "left"){
            this.arrowDirection = "right"
        }else{
            this.arrowDirection = "left";
        }
        this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.GRAPHIC_PROPERTY_CHANGED,{name:"arrowDirection"}));
    };



    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.ArchedArrowVO = createjs.promote(ArchedArrowVO, "GraphicItemVO");

}());


//##############################################################################
// AttackerVO
//##############################################################################

/**
 * Class drillEditor.AttackerVO
 * Created by maxim_000 on 9/21/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
    AttackerVO.prototype.radius;
    AttackerVO.prototype.playerNumber;


    //constructor
    /**
     * Model of the rectangle component
     *
     * @class AttackerVO
     * @param {Number} [id=0] Unique item id.
     * @param {createjs.Point} [position=null] Item position.
     * @param {Number} Circle radius.
     * @constructor
     **/
    function AttackerVO(id, position, radius) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, drillEditor.GraphicElementType.ATTACKER, position);
        this.setWidth(radius*2);
        this.setHeight(radius*2);
        this.radius = radius;
    }

    //extend this class from a superclass
    var p = createjs.extend(AttackerVO,drillEditor.GraphicItemVO);

    p.setPlayerNumber = function(value){
        this.playerNumber = value;
        this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.GRAPHIC_PROPERTY_CHANGED,{name:"playerNumber"}));
    };

    //flag for serialization
    p.isPlayer = true;

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.AttackerVO = createjs.promote(AttackerVO,"GraphicItemVO");


}());


//##############################################################################
// BallMovementVO
//##############################################################################
/**
 * Class BallMovementVO
 * Created by maxim_000 on 10/9/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/
    BallMovementVO.prototype.startPoint = null;
    BallMovementVO.prototype.endPoint = null;
    BallMovementVO.prototype.lineWidth = null;
    BallMovementVO.prototype.angle = null;
    BallMovementVO.prototype.arrowDirection = null;

    /******************* static variables *******************/


    /********************** constructor *********************/
    function BallMovementVO(id, startPoint, endPoint, arrowDirection) {
        this.GraphicItemVO_constructor(id, drillEditor.GraphicElementType.BALL_MOVEMENT, new createjs.Point(0,0));
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.arrowDirection = (arrowDirection == drillEditor.ArrowDirection.LEFT || arrowDirection == drillEditor.ArrowDirection.RIGHT) ? arrowDirection : drillEditor.ArrowDirection.LEFT;
        updateLineWidth.call(this);
        updateAngle.call(this);
    }

    //extend this class from a superclass
    var p = createjs.extend(BallMovementVO, drillEditor.GraphicItemVO);

    // flag for serialization
    p.isActivity = true;

    /********************* overridden methods ***************/
    p.setStartPoint = function(value){
        this.startPoint = value;
        updateLineWidth.call(this);
        updateAngle.call(this);
        this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.GRAPHIC_PROPERTY_CHANGED,{name:"startPoint"}));
        //console.log("start point set to x=", this.startPoint.x);
    };

    p.setEndPoint = function(value){
        this.endPoint = value;
        updateLineWidth.call(this);
        updateAngle.call(this);
        this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.GRAPHIC_PROPERTY_CHANGED,{name:"endPoint"}));
    };

    p.invertArrowDirection = function(){
        if(this.arrowDirection == drillEditor.ArrowDirection.RIGHT){
            this.arrowDirection = drillEditor.ArrowDirection.LEFT
        }else{
            this.arrowDirection = drillEditor.ArrowDirection.RIGHT;
        }

        this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.GRAPHIC_PROPERTY_CHANGED,{name:"arrowDirection"}));
    };

    /******************** private methods *******************/
    function updateLineWidth(){
        this.lineWidth = drillEditor.MathUtils.getDistanceBetween2Points(this.startPoint, this.endPoint);
    }

    function updateAngle() {
        this.angle = drillEditor.MathUtils.getAngleBetween2Points(this.startPoint, this.endPoint);
        this.rotation = this.angle;
    }

    /******************** event handlers ********************/


    /******************* public static method ***************/

        //drillEditor.BallMovementVO.staticFunctionName = function(param1){ //method body };


        //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.BallMovementVO = createjs.promote(BallMovementVO,"GraphicItemVO");

}());


//##############################################################################
//
//##############################################################################

/**
 * Class BallSupplyVO
 * Created by maxim_000 on 10/9/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/
    //BallSupplyVO.prototype.publicVar = "value";

    /******************* static variables *******************/
    BallSupplyVO.STD_WIDTH = 78;
    BallSupplyVO.STD_HEIGHT = 26;

    /********************** constructor *********************/
    function BallSupplyVO(id, position) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, drillEditor.GraphicElementType.BALLS_SUPPLY, position);
        this.width = BallSupplyVO.STD_WIDTH;
        this.height = BallSupplyVO.STD_HEIGHT;
    }

    //extend this class from a superclass
    var p = createjs.extend(BallSupplyVO, drillEditor.GraphicItemVO);

    // flag for serialization
    p.isEquipment = true;

    /******************** private methods *******************/


    /******************** event handlers ********************/


    /******************* public static method ***************/

        //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.BallSupplyVO = createjs.promote(BallSupplyVO,"GraphicItemVO");

}());


//##############################################################################
//
//##############################################################################

/**
 * Class drillEditor.BallVO
 * Created by maxim_000 on 10/9/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/


    /******************* static variables *******************/
    BallVO.STD_WIDTH = 32;
    BallVO.STD_HEIGHT = 32;

    /********************** constructor *********************/
    function BallVO(id, position) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, drillEditor.GraphicElementType.BALL, position);
        this.width = BallVO.STD_WIDTH;
        this.height = BallVO.STD_WIDTH;
    }

    //extend this class from a superclass
    var p = createjs.extend(BallVO, drillEditor.GraphicItemVO);

    // flag for serialization
    p.isEquipment = true;

    /******************** private methods *******************/


    /******************** event handlers ********************/


    /******************* public static method ***************/

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.BallVO = createjs.promote(BallVO,"GraphicItemVO");

}());


//##############################################################################
//
//##############################################################################

/**
 * Class ConeVO
 * Created by maxim_000 on 9/21/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";

    //constructor
    /**
     * Model of the rectangle component
     *
     * @class ConeVO
     * @param {Number} [id=0] Unique item id.
     * @param {createjs.Point} [position=null] Item position.
     * @param {Number} [width=0] Item width.
     * @param {Number} [height=0] Item height.
     * @constructor
     **/
    function ConeVO(id, position, width, height) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, drillEditor.GraphicElementType.CONE, position);
        this.setWidth(width);
        this.setHeight(height);
    }

    //extend this class from a superclass
    var p = createjs.extend(ConeVO,drillEditor.GraphicItemVO);

    // flag for serialization
    p.isEquipment = true;

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.ConeVO = createjs.promote(ConeVO,"GraphicItemVO");


}());


//##############################################################################
//
//##############################################################################

/**
 * Class drillEditor.DefenderVO
 * Created by maxim_000 on 9/21/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
    DefenderVO.prototype.radius;
    DefenderVO.prototype.playerNumber;

    //static variable
    //drillEditor.DefenderVO.staticVar = "value";

    //constructor
    /**
     * Model of the rectangle component
     *
     * @class DefenderVO
     * @param {Number} [id=0] Unique item id.
     * @param {createjs.Point} [position=null] Item position.
     * @param {Number} Circle radius.
     * @constructor
     **/
    function DefenderVO(id, position, radius) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, drillEditor.GraphicElementType.DEFENDER, position);
        this.setWidth(radius*2);
        this.setHeight(radius*2);
        this.radius = radius;
    }

    //extend this class from a superclass
    var p = createjs.extend(DefenderVO,drillEditor.GraphicItemVO);

    p.setPlayerNumber = function(value){
        this.playerNumber = value;
        this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.GRAPHIC_PROPERTY_CHANGED,{name:"playerNumber"}));
    };

    //flag for serialization
    p.isPlayer = true;

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.DefenderVO = createjs.promote(DefenderVO,"GraphicItemVO");

}());


//##############################################################################
//
//##############################################################################

/**
 * Class DribblingLineVO
 * Created by maxim_000 on 10/5/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";

    DribblingLineVO.prototype.startPoint = null;
    DribblingLineVO.prototype.endPoint = null;
    DribblingLineVO.prototype.lineWidth = null;
    DribblingLineVO.prototype.angle = null;
    DribblingLineVO.prototype.arrowDirection = null;

    //constructor
    function DribblingLineVO(id, startPoint, endPoint, arrowDirection) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, drillEditor.GraphicElementType.DRIBBLING_PLAYER, new createjs.Point(0,0));

        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.arrowDirection = (arrowDirection == drillEditor.ArrowDirection.LEFT || arrowDirection == drillEditor.ArrowDirection.RIGHT) ? arrowDirection : drillEditor.ArrowDirection.LEFT;

        updateLineWidth.call(this);
        updateAngle.call(this);
    }

    //extend this class from a superclass
    var p = createjs.extend(DribblingLineVO, drillEditor.GraphicItemVO);

    // flag for serialization
    p.isActivity = true;

    p.setStartPoint = function(value){
        this.startPoint = value;
        updateLineWidth.call(this);
        updateAngle.call(this);
        this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.GRAPHIC_PROPERTY_CHANGED,{name:"startPoint"}));
        //console.log("start point set to x=", this.startPoint.x);
    };

    p.setEndPoint = function(value){
        this.endPoint = value;
        updateLineWidth.call(this);
        updateAngle.call(this);
        this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.GRAPHIC_PROPERTY_CHANGED,{name:"endPoint"}));
    };

    p.invertArrowDirection = function(){
        if(this.arrowDirection == drillEditor.ArrowDirection.RIGHT){
            this.arrowDirection = drillEditor.ArrowDirection.LEFT
        }else{
            this.arrowDirection = drillEditor.ArrowDirection.RIGHT;
        }

        this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.GRAPHIC_PROPERTY_CHANGED,{name:"arrowDirection"}));
    };

    /***************************************** private function **************************************/
    function updateLineWidth(){
         this.lineWidth = drillEditor.MathUtils.getDistanceBetween2Points(this.startPoint, this.endPoint);
    }

    function updateAngle() {
        this.angle = drillEditor.MathUtils.getAngleBetween2Points(this.startPoint, this.endPoint);
        this.rotation = this.angle;
    }

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.DribblingLineVO = createjs.promote(DribblingLineVO,"GraphicItemVO");

}());


//##############################################################################
//
//##############################################################################
/**
 * Class ExtraTeamVO
 * Created by maxim_000 on 9/21/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
    ExtraTeamVO.prototype.radius;
    ExtraTeamVO.playerNumber;

    //constructor
    /**
     * Model of the rectangle component
     *
     * @class drillEditor.ExtraTeamVO
     * @param {Number} [id=0] Unique item id.
     * @param {createjs.Point} [position=null] Item position.
     * @param {Number} Circle radius.
     * @constructor
     **/
    function ExtraTeamVO(id, position, radius) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, drillEditor.GraphicElementType.EXTRA_TEAM, position);
        this.setWidth(radius*2);
        this.setHeight(radius*2);
        this.radius = radius;
    }

    //extend this class from a superclass
    var p = createjs.extend(ExtraTeamVO,drillEditor.GraphicItemVO);

    p.setPlayerNumber = function(value){
        this.playerNumber = value;
        this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.GRAPHIC_PROPERTY_CHANGED,{name:"playerNumber"}));
    };

    //flag for serialization
    p.isPlayer = true;

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.ExtraTeamVO = createjs.promote(ExtraTeamVO,"GraphicItemVO");


}());


//##############################################################################
//
//##############################################################################

/**
 * Class GoalVO
 * Created by maxim_000 on 10/28/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /*********************************************** public variables *************************************************/


    /*********************************************** static variables *************************************************/


    /*********************************************** constructor ******************************************************/
    function GoalVO(elemId, elemPosition, elementWidth, elementHeight, rotation) {
        this.rotation = rotation;
        this.setWidth(elementWidth);
        this.setHeight(elementHeight);

        //invoke constructor of superclass
        this.GraphicItemVO_constructor(elemId, drillEditor.GraphicElementType.GOAL, elemPosition);
    }

    //extend this class from a superclass
    var p = createjs.extend(GoalVO, drillEditor.GraphicItemVO);

    // flag for serialization
    p.isEquipment = true;
    /*********************************************** overridden methods ***********************************************/


    /*********************************************** private methods **************************************************/


    /*********************************************** event handlers ***************************************************/


    /*********************************************** public static method *********************************************/


    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.GoalVO = createjs.promote(GoalVO,"GraphicItemVO");

}());


//##############################################################################
//
//##############################################################################

/**
 * Class GraphicItemVO
 * Created by maxim_000 on 9/21/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";

    //constructor
    function GraphicItemVO(id, type, position) {
        this.EventDispatcher_constructor();

        this.id = (id!=undefined && id!=null) ? id : "" ;
        this.type = (type!=undefined && type!=null) ? type : 0;
        this.position = (position!=undefined && position!=null) ? position : null;
        //this.rotation = 0;
    }

    //extend this class from a superclass
    var p = createjs.extend(GraphicItemVO, createjs.EventDispatcher);

    // public functions
    p.setSelected = function (value) {
        if(this.selected == value){
            return;
        }

        if(value){
            drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_SELECTED,{data:this}));
        } else {
            drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_DESELECTED,{data:this}));
        }

        this.selected = value;
    };

    /**
     * Sets x,y position on the screen
     * @param value A createjs.Point instance
     */
    p.setPosition = function(value){
        this.position = value;
        this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_POSITION_CHANGED));
    };

    p.getPosition = function(){
        return this.position;
    };


    p.setWidth = function(value){
        if(this.width == value){
            return;
        }

        this.width = value;
    };

    p.getWidth = function(){
        return this.width;
    };

    p.setHeight = function(value){
        if(this.height == value){
            return;
        }

        this.height = value;
    };

    p.getHeight = function(){
        return this.height;
    };

    p.resize = function(w, h){
        this.width = w;
        this.height = h;
        this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_RESIZE));
    };

    p.setRotation = function(value, changedByUser){
        this.rotation = value;
        this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_ROTATION_CHANGED));
    };

    p.getDTO = function(){

    };

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.GraphicItemVO = createjs.promote(GraphicItemVO,"EventDispatcher");

}());


//##############################################################################
//
//##############################################################################

/**
 * Class NeutralVO
 * Created by maxim_000 on 9/21/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
    NeutralVO.prototype.radius;

    //constructor
    /**
     * Model of the rectangle component
     *
     * @class drillEditor.NeutralVO
     * @param {Number} [id=0] Unique item id.
     * @param {createjs.Point} [position=null] Item position.
     * @param {Number} Circle radius.
     * @constructor
     **/
    function NeutralVO(id, position, radius) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, drillEditor.GraphicElementType.NEUTRAL_PLAYER, position);
        this.setWidth(radius*2);
        this.setHeight(radius*2);
        this.radius = radius;
    }

    //extend this class from a superclass
    var p = createjs.extend(NeutralVO,drillEditor.GraphicItemVO);

    //flag for serialization
    p.isPlayer = true;

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.NeutralVO = createjs.promote(NeutralVO,"GraphicItemVO");


}());


//##############################################################################
//
//##############################################################################
/**
 * Class PlayerMovementVO
 * Created by maxim_000 on 10/9/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/
    PlayerMovementVO.prototype.startPoint = null;
    PlayerMovementVO.prototype.endPoint = null;
    PlayerMovementVO.prototype.lineWidth = null;
    PlayerMovementVO.prototype.angle = null;
    PlayerMovementVO.prototype.arrowDirection = null;

    /******************* static variables *******************/
    //drillEditor.PlayerMovementVO.staticVar = "value";

    /********************** constructor *********************/
    function PlayerMovementVO(id, startPoint, endPoint, arrowDirection) {
        this.GraphicItemVO_constructor(id, drillEditor.GraphicElementType.PLAYER_MOVEMENT, new createjs.Point(0,0));
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.arrowDirection = (arrowDirection == drillEditor.ArrowDirection.LEFT || arrowDirection == drillEditor.ArrowDirection.RIGHT) ? arrowDirection : drillEditor.ArrowDirection.LEFT;
        updateLineWidth.call(this);
        updateAngle.call(this);
    }

    //extend this class from a superclass
    var p = createjs.extend(PlayerMovementVO, drillEditor.GraphicItemVO);

    /********************* overridden methods ***************/
    p.setStartPoint = function(value){
        this.startPoint = value;
        updateLineWidth.call(this);
        updateAngle.call(this);
        this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.GRAPHIC_PROPERTY_CHANGED,{name:"startPoint"}));
        //console.log("start point set to x=", this.startPoint.x);
    };

    p.setEndPoint = function(value){
        this.endPoint = value;
        updateLineWidth.call(this);
        updateAngle.call(this);
        this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.GRAPHIC_PROPERTY_CHANGED,{name:"endPoint"}));
    };

    p.invertArrowDirection = function(){
        if(this.arrowDirection == drillEditor.ArrowDirection.RIGHT){
            this.arrowDirection = drillEditor.ArrowDirection.LEFT
        }else{
            this.arrowDirection = drillEditor.ArrowDirection.RIGHT;
        }

        this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.GRAPHIC_PROPERTY_CHANGED,{name:"arrowDirection"}));
    };

    // flag for serialization
    p.isActivity = true;

    /******************** private methods *******************/
    function updateLineWidth(){
        this.lineWidth = drillEditor.MathUtils.getDistanceBetween2Points(this.startPoint, this.endPoint);
    }

    function updateAngle() {
        this.angle = drillEditor.MathUtils.getAngleBetween2Points(this.startPoint, this.endPoint);
        this.rotation = this.angle;
    }

    /******************** event handlers ********************/


    /******************* public static method ***************/

    //drillEditor.PlayerMovementVO.staticFunctionName = function(param1){ //method body };


    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.PlayerMovementVO = createjs.promote(PlayerMovementVO,"GraphicItemVO");

}());


//##############################################################################
//
//##############################################################################

/**
 * Presentation class
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
    Presentation.prototype.id = null;
    Presentation.prototype.pitchWidth;
    Presentation.prototype.pitchHeight;
    Presentation.prototype.elements; //array that stores vo of the presentation items

    //static variable
    Presentation.DEFAULT_ID = "0000";

    //constructor
    function Presentation(id) {
        this.id = id;
        this.elements = [];
    }

    // public functions
    Presentation.prototype.setPitchDimensions = function(width, height){
        this.pitchWidth = width;
        this.pitchHeight = height;
    };

    //private functions


    //public static method


    drillEditor.Presentation = Presentation;

}());


//##############################################################################
//
//##############################################################################

/**
 * Class RectVO
 * Created by maxim_000 on 9/21/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";


    //constructor
    /**
     * Model of the rectangle component
     *
     * @class RectVO
     * @param {Number} [id=0] Unique item id.
     * @param {createjs.Point} [position=null] Item position.
     * @param {Number} [width=0] Item width.
     * @param {Number} [height=0] Item height.
     * @constructor
     **/
    function RectVO(id, position, width, height) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, drillEditor.GraphicElementType.RECTANGLE, position);
        this.setWidth(width);
        this.setHeight(height);
    }

    //extend this class from a superclass
    var p = createjs.extend(RectVO,drillEditor.GraphicItemVO);


    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.RectVO = createjs.promote(RectVO,"GraphicItemVO");


}());


//##############################################################################
//
//##############################################################################

/**
 * Class SquareVO
 * Created by maxim_000 on 9/21/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //constructor
    /**
     * Model of the square component
     *
     * @class drillEditor.SquareVO
     * @param {Number} [id=0] Unique item id.
     * @param {createjs.Point} [position=null] Item position.
     * @param {Number} [width=0] Item width.
     * @param {Number} [height=0] Item height.
     * @constructor
     **/
    function SquareVO(id, position, width, height) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, drillEditor.GraphicElementType.SQUARE, position);
        this.setWidth(width);
        this.setHeight(height);
    }

    //extend this class from a superclass
    var p = createjs.extend(SquareVO,drillEditor.GraphicItemVO);


    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.SquareVO = createjs.promote(SquareVO,"GraphicItemVO");


}());


/**
 * JS Class snippet
 */
(function (window) {
    //public variables
    ClassName.prototype.publicVar = "value";

    //static variable
    ClassName.staticVar = "value";

    //constructor
    function ClassName(){
        //private variables
        var _privateVar1 = "value1";
        var _privateVar2 = "value2";

        //public getters & setters ie properties
        this.getProp1 = function(){return _privateVar1;};
        this.getProp2 = function(){return _privateVar2;}
    }

    // public functions
    ClassName.prototype.publicFunction = function (param1) {

    };

    //private functions
    function privateFunction(param) {

    }

    //public static method
    ClassName.staticFunctionName = function(param1){
        //method body
    };

    drillEditor.ClassName = ClassName;

}());


//##############################################################################
//
//##############################################################################

/**
 * Class CanvasUtils
 * Created by maxim_000 on 10/16/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/


    /******************* static variables *******************/


    /********************** constructor *********************/
    function CanvasUtils() {

    }


    /******************** private methods *******************/


    /******************** event handlers ********************/


    /******************* public static method ***************/


    CanvasUtils.getCanvasSegmentData = function(sourceCanvas, sx, sy, width, height){
        var newCanvas = document.createElement("canvas");
        newCanvas.id = "temp_canvas";
        newCanvas.width = width;
        newCanvas.height = height;
        newCanvas.getContext("2d").drawImage(sourceCanvas, sx, sy, width, height, 0, 0, width, height);
        var imageData = newCanvas.toDataURL("image/png");

        $(newCanvas).remove();
        newCanvas = null;

        return imageData;
    };

    drillEditor.CanvasUtils = CanvasUtils;

}());


//##############################################################################
//
//##############################################################################

/**
 * Class Clipboard
 * Created by maxim_000 on 10/2/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";

    //static variable
    Clipboard.instance = null;

    //constructor
    function Clipboard() {
       if(Clipboard.instance){
           throw new Error("Only one instance of Clipboard is allowed!");
       }
    }

    //public static method
    Clipboard.getInstance = function(){
         if(!Clipboard.instance){
             Clipboard.instance = new Clipboard();
         }
        return Clipboard.instance;
    };

    Clipboard.data = null;


    drillEditor.Clipboard = Clipboard;

}());


//##############################################################################
//
//##############################################################################

/**
 * Class drillEditor.DrawingUtils
 * Created by maxim_000 on 9/18/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";

    //constructor
    function DrawingUtils() {

    }

    DrawingUtils.drawStrictSizeRectangle = function(graphics, rectX, rectY ,resultedWidth, resultedHeight, lineSize, lineColor, lineAlpha, fillColor, fillAlpha){
        var rectStartX  = rectX + lineSize / 2;
        var rectStartY = rectY + lineSize / 2;
        var rectWidth = resultedWidth - lineSize;
        var rectHeight = resultedHeight - lineSize;
        var cornerRadius = 25;

        //trace("rectX=", rectStartX, "w=", rectWidth);

        graphics.clear();

        if (lineSize)
        {
            graphics.setStrokeStyle(lineSize);
            graphics.beginStroke(lineColor);
        }

        if (fillAlpha)
        {
            //graphics.beginFill(fillColor, fillAlpha);
            graphics.beginFill(fillColor);
        }

        if (lineSize || fillAlpha)
        {
            //graphics.drawRoundRectComplex(rectStartX, rectStartY, rectWidth, rectHeight, cornerRadius, cornerRadius, cornerRadius, cornerRadius);
            graphics.drawRect(rectStartX, rectStartY, rectWidth, rectHeight);

        }
        graphics.endFill();
    };

    drillEditor.DrawingUtils = DrawingUtils;

}());


//##############################################################################
//
//##############################################################################

/**
 * Class DrillEditorProxy
 * Created by Max on 10/13/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/


    /******************* static variables *******************/

    //callbacks that are set by outer code:
    DrillEditorProxy.drillStartupData = null;   // Should be set by outer code. data of the drill that has to be rendered right after app start. If null then app starts with main menu view
    DrillEditorProxy.getDrillByIdCallback = null;  // Should be set by outer code.
    DrillEditorProxy.getSavedDrillsCallback = null; // Should be set by outer code.

    //callbacks set by editor application
    DrillEditorProxy.getDrillDataCallback = null; // Should be set by drill editor. Editor app function that returns data of the current drill

    /********************** constructor *********************/
    function DrillEditorProxy() {

    }
    /******************* static methods ********************/


    /**
     * Returns data of the current/last active drill created/opened through drill editor.
     * Should be called from outer code
     * @returns {*}
     */
    DrillEditorProxy.getEditedDrillData = function(){
        var result;
        if(DrillEditorProxy.getDrillDataCallback){
            result = DrillEditorProxy.getDrillDataCallback();
        }
        return result;
    };

    /**
     * Retrieves drill data by its id.
     * Should be called from app side
     * @param drillId
     * @param successCallback
     * @param failureCallback
     */
    DrillEditorProxy.getDrillDataById = function(drillId, successCallback, failureCallback, scope){
        if(DrillEditorProxy.getDrillByIdCallback){
            DrillEditorProxy.getDrillByIdCallback(drillId, successCallback, failureCallback, scope);
        }
    };

    /**
     * Retrieves an array of drills previously created by user
     * @param successCallback
     * @param failureCallback
     */
    DrillEditorProxy.getSavedDrills = function(successCallback, failureCallback, scope){
        if(DrillEditorProxy.getSavedDrillsCallback){
            DrillEditorProxy.getSavedDrillsCallback(successCallback, failureCallback, scope);
        }
    };


    drillEditor.DrillEditorProxy = DrillEditorProxy;

}());


//##############################################################################
//
//##############################################################################

/**
 * Class DTOUtils
 * Created by maxim_000 on 10/14/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/


    /******************* static variables *******************/

    /********************** constructor *********************/
    function DTOUtils() {
        //invoke constructor of superclass
        //this.SuperClass_constructor();
    }

    //extend this class from a superclass
    //var p = createjs.extend(DTOUtils,SuperClass);

    /******************** private methods *******************/


    /******************** event handlers ********************/


    /******************* public static method ***************/

    DTOUtils.presentationDTOToVO = function(presentationDTO){
        var presentation = new drillEditor.Presentation(presentationDTO.id);
        presentation.pitchWidth = presentationDTO.pitchWidth;
        presentation.pitchHeight = presentationDTO.pitchHeight;
        presentation.elements = [];

        for(var i=0; i<presentationDTO.elements.length; i++){
            var elementDTO = presentationDTO.elements[i];
            var elementVO = DTOUtils.elementDTOToVO(elementDTO);
            presentation.elements.push(elementVO);
        }

        return presentation;
    };

    DTOUtils.elementDTOToVO = function(elementDTO){
        var elementVO;
        var elementPosition = new createjs.Point(elementDTO.position.x, elementDTO.position.y);

        switch (elementDTO.type){
            case drillEditor.GraphicElementType.RECTANGLE:
                elementVO = new drillEditor.RectVO(elementDTO.id, elementPosition, elementDTO.width, elementDTO.height);
                break;

            case drillEditor.GraphicElementType.SQUARE:
                elementVO = new drillEditor.SquareVO(elementDTO.id, elementPosition, elementDTO.width, elementDTO.height);
                break;

            case drillEditor.GraphicElementType.ATTACKER:
                elementVO = new drillEditor.AttackerVO(elementDTO.id, elementPosition, elementDTO.width/2);
                elementVO.fillColor = elementDTO.fillColor;
                break;

            case drillEditor.GraphicElementType.DEFENDER:
                elementVO = new drillEditor.DefenderVO(elementDTO.id, elementPosition, elementDTO.width/2);
                elementVO.fillColor = elementDTO.fillColor;
                break;

            case drillEditor.GraphicElementType.EXTRA_TEAM:
                elementVO = new drillEditor.ExtraTeamVO(elementDTO.id, elementPosition, elementDTO.width/2);
                elementVO.fillColor = elementDTO.fillColor;
                break;

            case drillEditor.GraphicElementType.NEUTRAL_PLAYER:
                elementVO = new drillEditor.NeutralVO(elementDTO.id, elementPosition, elementDTO.width/2);
                elementVO.fillColor = elementDTO.fillColor;
                break;

            case drillEditor.GraphicElementType.CONE:
                elementVO = new drillEditor.ConeVO(elementDTO.id, elementPosition, elementDTO.width, elementDTO.height);
                elementVO.fillColor = elementDTO.fillColor;
                break;

            case drillEditor.GraphicElementType.ARCUATE_MOVEMENT:
                elementVO = new drillEditor.ArchedArrowVO(elementDTO.id, elementPosition,
                    elementDTO.width, elementDTO.height,
                    elementDTO.arrowDirection, elementDTO.rotation);
                break;

            case drillEditor.GraphicElementType.GOAL:
                    elementVO = new drillEditor.GoalVO(elementDTO.id, elementPosition, elementDTO.width, elementDTO.height, elementDTO.rotation);
                break;

            case drillEditor.GraphicElementType.DRIBBLING_PLAYER:
                var startPointCloned = new createjs.Point(elementDTO.startPoint.x, elementDTO.startPoint.y);
                var endPointCloned = new createjs.Point(elementDTO.endPoint.x, elementDTO.endPoint.y);
                elementVO = new drillEditor.DribblingLineVO(elementDTO.id, startPointCloned, endPointCloned, elementDTO.arrowDirection);
                break;

            case drillEditor.GraphicElementType.PLAYER_MOVEMENT:
                var startPointCloned = new createjs.Point(elementDTO.startPoint.x, elementDTO.startPoint.y);
                var endPointCloned = new createjs.Point(elementDTO.endPoint.x, elementDTO.endPoint.y);
                elementVO = new drillEditor.PlayerMovementVO(elementDTO.id, startPointCloned, endPointCloned, elementDTO.arrowDirection);
                break;

            case drillEditor.GraphicElementType.BALL_MOVEMENT:
                var startPointCloned = new createjs.Point(elementDTO.startPoint.x, elementDTO.startPoint.y);
                var endPointCloned = new createjs.Point(elementDTO.endPoint.x, elementDTO.endPoint.y);
                elementVO = new drillEditor.BallMovementVO(elementDTO.id, startPointCloned, endPointCloned, elementDTO.arrowDirection);
                break;

            case drillEditor.GraphicElementType.BALL:
                elementVO = new drillEditor.BallVO(elementDTO.id, elementPosition);
                break;

            case drillEditor.GraphicElementType.BALLS_SUPPLY:
                elementVO = new drillEditor.BallSupplyVO(elementDTO.id, elementPosition);
                break;
        }

        if(elementVO){
            elementVO.id = elementDTO.id;
            elementVO.position = new createjs.Point(elementVO.position.x, elementVO.position.y)
        }

        return elementVO;
    };


    DTOUtils.presentationToDTO = function(presentation){
        var presentationDTO = {};
        presentationDTO.drillId = presentation.id;
        presentationDTO.pitchWidth = presentation.pitchWidth;
        presentationDTO.pitchHeight = presentation.pitchHeight;
        presentationDTO.playersCount = 0;
        presentationDTO.equipmentRequired = {cones:0, balls:0, ballSupply:0};
        presentationDTO.activitiesRequired = {playerDribbling:0, playerMovement:0,  ballMovement:0 };
        presentationDTO.elements = [];

        for(var i=0; i<presentation.elements.length; i++){
            var elementVO = presentation.elements[i];
            var elementDTO = DTOUtils.elementVOToDTO(elementVO);
            presentationDTO.elements.push(elementDTO);

            if(elementVO.isPlayer==true){
                presentationDTO.playersCount +=1 ;
            }else if(elementVO.isEquipment==true){
                switch (elementVO.type){
                    case drillEditor.GraphicElementType.CONE:
                            presentationDTO.equipmentRequired.cones +=1;
                        break;

                    case drillEditor.GraphicElementType.BALL:
                            presentationDTO.equipmentRequired.balls +=1;
                        break;

                    case drillEditor.GraphicElementType.BALLS_SUPPLY:
                            presentationDTO.equipmentRequired.ballSupply +=1;
                        break
                }
            }else if(elementVO.isActivity==true){
                switch(elementVO.type){
                    case drillEditor.GraphicElementType.PLAYER_MOVEMENT:
                    case drillEditor.GraphicElementType.ARCUATE_MOVEMENT:
                            presentationDTO.activitiesRequired.playerMovement +=1;
                        break;

                    case drillEditor.GraphicElementType.BALL_MOVEMENT:
                            presentationDTO.activitiesRequired.ballMovement +=1;
                        break;
                    case drillEditor.GraphicElementType.DRIBBLING_PLAYER:
                            presentationDTO.activitiesRequired.playerDribbling +=1;
                        break;
                }
            }
        }

        return presentationDTO;
    };
    
    DTOUtils.elementVOToDTO = function(elementVO){
        var result = {};

        result.id = elementVO.id;
        result.type = elementVO.type;

        result.position = {x: elementVO.position.x, y:elementVO.position.y};


        switch (elementVO.type){
            case drillEditor.GraphicElementType.ATTACKER:
            case drillEditor.GraphicElementType.DEFENDER:
            case drillEditor.GraphicElementType.EXTRA_TEAM:
            case drillEditor.GraphicElementType.NEUTRAL_PLAYER:
            case drillEditor.GraphicElementType.CONE:
                    result.width = elementVO.width;
                    result.height = elementVO.height;
                    result.fillColor = elementVO.fillColor;
                break;

            case drillEditor.GraphicElementType.ARCUATE_MOVEMENT:
                    result.width = elementVO.width;
                    result.height = elementVO.height;
                    result.arrowDirection =  elementVO.arrowDirection;
                    result.rotation = elementVO.rotation;
                break;

            case drillEditor.GraphicElementType.GOAL:
                result.width = elementVO.width;
                result.height = elementVO.height;
                result.rotation = elementVO.rotation;
                break;

            case drillEditor.GraphicElementType.DRIBBLING_PLAYER:
            case drillEditor.GraphicElementType.PLAYER_MOVEMENT:
            case drillEditor.GraphicElementType.BALL_MOVEMENT:
                result.startPoint = {x:elementVO.startPoint.x, y:elementVO.startPoint.y};
                result.endPoint = {x:elementVO.endPoint.x, y:elementVO.endPoint.y};
                result.arrowDirection = elementVO.arrowDirection;


        }

        return result;
    };



    drillEditor.DTOUtils = DTOUtils;

}());


//##############################################################################
//
//##############################################################################

/**
 * Class drillEditor.MathUtils
 * Created by maxim_000 on 10/6/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/


    /******************* static variables *******************/


    /********************** constructor *********************/
    function MathUtils() {
        //invoke constructor of superclass
        //this.SuperClass_constructor();
    }

    //extend this class from a superclass
    //var p = createjs.extend(MathUtils,SuperClass);

    /******************** private methods *******************/


    /******************** event handlers ********************/


    /******************* public static method ***************/
    MathUtils.getAngleBetween2Points = function(point1, point2){
        var angle = Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180 / Math.PI;
        return angle;
    };

    MathUtils.getDistanceBetween2Points = function(point1, point2){
        var distance = Math.sqrt(Math.pow((point2.x - point1.x), 2) + Math.pow((point2.y - point1.y),2))
        return distance;
    };

    MathUtils.compareNumeric = function(a,b){
        if(a>b){
            return 1;
        }

        if(a<b){
            return -1;
        }

        return 0;
    };


    drillEditor.MathUtils = MathUtils;

}());


//##############################################################################
//
//##############################################################################

/**
 * StringUtils
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";

    /**
     * Returns string representation of a number in a 2 digits format
     * @param	value
     * @return
     */
    StringUtils.convert22DigitsFormat = function(value){
        if (value < 10) {
            return "0" + value.toString();
        }
        return value.toString();
    };

    //constructor
    function StringUtils(){

    }

    /**
     * Turns milliseconds into a formatted string
     * @param milliseconds
     * @param format
     * @param omitZeroHrs
     * @returns {string}
     */
    StringUtils.formatTime = function(milliseconds, format, omitZeroHrs){
        //console.warn("drillEditor.StringUtils.formatTime:",milliseconds);
        var result = "",
            delimiter = ":",
            timeFormat = format ? format : "hh:mm:ss",
            hrs,
            min,
            sec;
        hrs = Math.floor(milliseconds/3600000);
        min = Math.floor((milliseconds - hrs*3600000)/60000);
        sec = Math.floor((milliseconds - hrs*3600000 - min*60000)/1000);

        if(!omitZeroHrs){
            result += String(hrs) + delimiter;
        }

        if(format=="hh:mm"){
            result += StringUtils.convert22DigitsFormat(min);
        } else { // use default hh:mm:ss format
            result += StringUtils.convert22DigitsFormat(min) + delimiter + StringUtils.convert22DigitsFormat(sec);
        }

        return result;
    };

    drillEditor.StringUtils = StringUtils;

}());


//##############################################################################
//
//##############################################################################

/**
 * Class ErrorDialogForm
 * Created by maxim_000 on 10/25/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/
    ErrorDialogForm.prototype.formHTMLElement = null;
    ErrorDialogForm.prototype.formDOMElement = null;
    ErrorDialogForm.prototype.okButton = null;

    /******************* static variables *******************/
    //ErrorDialogForm.staticVar = "value";

    /********************** constructor *********************/
    function ErrorDialogForm(initParams) {
        //invoke constructor of superclass
        this.Form_constructor(initParams);
    }

    //extend this class from a superclass
    var p = createjs.extend(ErrorDialogForm, drillEditor.Form);

    /******************* overridden methods *****************/

    p.constructForm = function(){
        this.Form_constructForm();
        this.formHTMLElement = jQuery.parseHTML("<div id='error-dialog-form' class='dialog-form'> <div class='outer'> <div class='middle'> <div class='panel panel-danger dialog-panel'> <div id='error-dialog-header' class='panel-heading'>Error</div> <div class='panel-body' style='text-align: center'> <p id='error-dialog-label'></p> <button id='error-dialog-button' type='button' class='btn btn-default'> OK </button> </div> </div> </div> </div></div>");
        $("#appContainer").append(this.formHTMLElement);
        $("#error-dialog-label").text(this.initParams.errorMessage);

        //create createjs.DOMElement
        this.formDOMElement = new createjs.DOMElement(this.formHTMLElement);
    };

    p.destroy = function(){
        this.Form_destroy();
        // remove DOMElement object from DL
        $("#errorDialogForm").remove();

        this.removeChild(this.formDOMElement);
        this.formDOMElement = null;
    };


    /******************** private methods *******************/


    /******************** event handlers ********************/


    /******************* public static method ***************/

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.ErrorDialogForm = createjs.promote(ErrorDialogForm,"Form");

}());


//##############################################################################
//
//##############################################################################

/**
 * Class drillEditor.Form
 * Created by maxim_000 on 9/15/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
    Form.prototype.initParams;
    Form.prototype.positiveCallback;
    Form.prototype.negativeCallback;

    //static variable
    //Form.staticVar = "value";

    //constructor
    function Form(initParams) {
        //call superclass constructor
        this.Container_constructor();
        this.initParams = initParams ? initParams : {};
        this.positiveCallback = this.initParams.positiveCallback;
        this.negativeCallback = this.initParams.negativeCallback;

        //console.log("Form constructor");
        this.constructForm();
    }

    var p = createjs.extend(Form, createjs.Container);

    p.destroy = function(){
        //console.log("Form destroy");
        this.initParams = null;
        this.positiveCallback = null;
        this.negativeCallback = null;
      //to be overridden by successors
    };

    p.constructForm = function () {
        //console.log("Form constructForm");
        //to be overridden by successors
    };


    drillEditor.Form = createjs.promote(Form, "Container");

}());


//##############################################################################
//
//##############################################################################

/**
 * Class drillEditor.LoadDrillView
 * Created by maxim_000 on 10/17/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/
    LoadDrillView.prototype.formHTMLElement = null;
    LoadDrillView.prototype.formDOMElement = null;
    LoadDrillView.prototype.selectedPresentationData = null;
    LoadDrillView.prototype.backButton = null;
    LoadDrillView.prototype.loadButton = null;

    /******************* static variables *******************/
    //LoadDrillView.staticVar = "value";

    /********************** constructor *********************/
    function LoadDrillView(initParams) {
        //invoke constructor of superclass
        this.Form_constructor(initParams);


    }

    //extend this class from a superclass
    var p = createjs.extend(LoadDrillView, drillEditor.Form);

    /********************* overridden methods *********************/
    p.constructForm = function(){
        this.Form_constructForm();
        this.formHTMLElement = jQuery.parseHTML("<div id='loadDrillView' class='drill-editor-app-form'> <div class='form-back-button'> <button id='loadDrillViewBackButton' type='button' class='btn btn-default'> <span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span>Back </button> </div> <div class='outer'> <div class='middle'> <div class='panel panel-default load-pitch-panel'> <h3 class='load-drill-form-h3'>Load drill</h3> <div class='load-pitch-container'> <div class='list-group load-pitch-list media'> </div> </div> <div class='load-pitch-form-load-btn-container'> <a class='btn disabled btn-default load-pitch-form-load-btn' href='#' role='button'>Load</a> </div> </div> </div> </div> </div>")[0];
        $("#appContainer").append(this.formHTMLElement);

        //add back button listener
        this.backButton = $("#loadDrillViewBackButton");
        this.backButton.click(this, function(evt){
            var thisScope = evt.data;

            if(thisScope.negativeCallback){
                thisScope.negativeCallback.call(thisScope.initParams.callbackScope);
            }

            drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.HIDE_CURRENT_FORM));
        });

        //add load button listener
        this.loadButton = $(".load-pitch-form-load-btn");
        this.loadButton.click(this, function(evt){
            var thisScope = evt.data;

            drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.HIDE_CURRENT_FORM));
            drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.LOAD_DRILL_BUTTON_CLICK,
                {drillId:thisScope.selectedPresentationData.drillId}));

        });

        //populate list of drills
        //for(var i=0;i<drillEditor.DrillEditorProxy.drillsCollection.length;i++){
        for(var i=0;i<drillEditor.ApplicationModel.getInstance().savedDrills.length;i++){
            //var drillShortInfo = drillEditor.DrillEditorProxy.drillsCollection[i];
            var drillShortInfo = drillEditor.ApplicationModel.getInstance().savedDrills[i];
            $(".load-pitch-list").append("<a href='#' class='list-group-item'> <div class='media-left'> <img class='media-object load-pitch-form-thumb-image' src=''> </div> <div class='media-body'> <h4 class='list-group-item-heading drill-name-label'></h4> <p class='list-group-item-text load-drill-view-size-label'></p> <p class='list-group-item-text load-drill-view-last-edit-label'></p> </div> </a>");

            var lastAddedItem = $($(".load-pitch-list .list-group-item:last")[0]);
            lastAddedItem.find(".drill-name-label").text(drillShortInfo.displayName);
            lastAddedItem.find(".load-drill-view-size-label").text("drillEditor.Pitch size: " + drillShortInfo.pitchWidth + " x " + drillShortInfo.pitchHeight + " meters");
            lastAddedItem.find(".load-drill-view-last-edit-label").text("Last modified: " + drillShortInfo.lastModified);
            lastAddedItem.find(".load-pitch-form-thumb-image").attr("src", drillShortInfo.thumbURL);


            lastAddedItem.click({thisScope:this, presentationData: drillShortInfo}, function(evt){
                var thisScope = evt.data.thisScope;
                $(this).addClass('active').siblings().removeClass('active');
                thisScope.setSelectedPresentationData(evt.data.presentationData);
            })
        }

        //create html content
        this.formDOMElement = new createjs.DOMElement(this.formHTMLElement);
    };

    p.setSelectedPresentationData = function(value){
        this.selectedPresentationData = value;
        if(this.selectedPresentationData){
            this.loadButton.removeClass('disabled');
        }
    };


    p.destroy = function(){
        this.Form_destroy();

        // unsubscribe listeners
        this.backButton.off();
        this.loadButton.off();

        $(".load-pitch-list .list-group-item").off();

        // remove DOMElement object from DL
        $("#loadDrillView").remove();

        this.removeChild(this.formDOMElement);
        this.formDOMElement = null;

    };

    /******************** private methods *******************/


    /******************** event handlers ********************/


    /******************* public static method ***************/

    drillEditor.LoadDrillView = createjs.promote(LoadDrillView,"Form");

}());


//##############################################################################
//
//##############################################################################

/**
 * Class PitchSizeInputFormHTML
 * Created by maxim_000 on 9/16/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";

    PitchSizeInputFormHTML.prototype.formHTMLElement;
    PitchSizeInputFormHTML.prototype.formDOMElement;

    //constructor
    function PitchSizeInputFormHTML(initParams) {
        this.Form_constructor(initParams);

    }

    var p = createjs.extend(PitchSizeInputFormHTML, drillEditor.Form);

    p.constructForm = function(){
        this.Form_constructForm();

        this.formHTMLElement = jQuery.parseHTML("<div id='pitchSizeInputFormHTML' style='position:absolute;left:0px;top:0px;width: 800px;height: 600px;background: #ffffff;'> <div style='position: absolute; padding-top: 10px; padding-left: 10px '> <button id='pitchInputFormBackButton' type='button' class='btn btn-default'> <span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span>Back </button> </div><div class='outer'> <div class='middle'> <div class='inner'> <div class='container' style='width: inherit; height: 290px; background: #cccccc'> <h2 style='text-align: center'>Enter pitch size</h2> <form role='form'> <div class='form-group'> <label>Width:</label> <input class='form-control' id='pitch_width_input' placeholder='Enter width in meters'> </div><div class='form-group'> <label>Height:</label> <input type='height' id='pitch_height_input' class='form-control' placeholder='Enter height in meters'> </div><div class='checkbox'> <label> <input id='pitchInputFormUseDefaultCb' type='checkbox'>Use default size - 105 by 68 metres </label> </div><button id='pitchInputFormProceedButton' type='button' class='btn btn-primary btn-block'>Apply and proceed</button> </form> </div></div></div></div></div>")[0];
        $("#appContainer").append(this.formHTMLElement);

        $("#pitchInputFormBackButton").click(this,function(evt){
            var thisScope = evt.data;

            if(thisScope.negativeCallback){
                thisScope.negativeCallback.call(thisScope.initParams.callbackScope);
            }

            drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.HIDE_CURRENT_FORM));

        });

        $("#pitchInputFormUseDefaultCb").change(function(){
            var checked =  this.checked;
            if(checked){
                $("#pitch_width_input").val(drillEditor.ApplicationModel.DEFAULT_PITCH_WIDTH_METERS);
                $("#pitch_height_input").val(drillEditor.ApplicationModel.DEFAULT_PITCH_HEIGHT_METERS);
            }
        });

        $("#pitchInputFormProceedButton").click(this, function(evt){
            var pitchW = Number($("#pitch_width_input").val());
            var pitchH = Number($("#pitch_height_input").val());
            var thisScope = evt.data;
            if(thisScope.initParams.positiveCallback){
                thisScope.initParams.positiveCallback.call(thisScope.initParams.callbackScope, pitchW, pitchH);
            }
            //drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(ApplicationEvent.HIDE_CURRENT_FORM));
        });

        this.formDOMElement = new createjs.DOMElement(this.formHTMLElement);

    };



    p.destroy = function(){
        this.Form_destroy();

        $("#pitchInputFormBackButton").unbind();
        $("#pitchInputFormUseDefaultCb").unbind();

        //remove this form from DOM and screen
        $("#pitchSizeInputFormHTML").remove();

        //remove DOMElement object from DL
        this.removeChild(this.formDOMElement);
        this.formDOMElement = null;
    };


    //window.drillEditor.PitchSizeInputFormHTML = createjs.extend(PitchSizeInputFormHTML,"DOMElement");
    drillEditor.PitchSizeInputFormHTML = createjs.promote(PitchSizeInputFormHTML,"Form");

}());


//##############################################################################
//
//##############################################################################

/**
 * Created by maxim_000 on 10/13/2015.
 */
/**
 * Class DrillNameInputForm
 * Created by maxim_000 on 9/16/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";

    ProgressBarForm.prototype.formHTMLElement;
    ProgressBarForm.prototype.formDOMElement;

    //constructor
    function ProgressBarForm(initParams) {
        this.Form_constructor(initParams);
    }

    var p = createjs.extend(ProgressBarForm, drillEditor.Form);

    p.constructForm = function(){
        this.Form_constructForm();

        var headerText = this.initParams ? this.initParams.headerText : " ";

        this.formHTMLElement = jQuery.parseHTML("<div id='progressBarForm' class='progress-bar-form'> <div class='outer'> <div class='middle'> <div class='panel panel-default progress-bar-panel'> <h3 class='progress-bar-form-h3'></h3> <div class='progress' style='margin-left: 10px; margin-right: 10px'> <div class='progress-bar progress-bar-striped active' role='progressbar' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100' style='width: 100%'> </div> </div> </div> </div> </div></div>")[0];
        $("#appContainer").append(this.formHTMLElement);
        $("#progressBarForm .progress-bar-form-h3").text(headerText);
        this.formDOMElement = new createjs.DOMElement(this.formHTMLElement);

    };



    p.destroy = function(){
        this.Form_destroy();



        //remove this form from DOM and screen
        $("#progressBarForm").remove();

        //remove DOMElement object from DL
        this.removeChild(this.formDOMElement);
        this.formDOMElement = null;
    };


    drillEditor.ProgressBarForm = createjs.promote(ProgressBarForm,"Form");

}());


//##############################################################################
//
//##############################################################################

/**
 * Class drillEditor
 * Created by maxim_000 on 9/19/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //************************************** public variables ***********************************//
    Pitch.prototype.componentWidth = null;
    Pitch.prototype.componentHeight = null;
    Pitch.prototype.backgroundShape = null;
    Pitch.prototype.backgroundShapeMask = null;
    Pitch.prototype.backgroundOutline = null;
    Pitch.prototype.update = false;
    Pitch.prototype.dispatcher = null;
    Pitch.prototype.elementsLayer = null;
    Pitch.prototype.elements = null;
    Pitch.prototype.transformTool = null;
    Pitch.prototype.selectedElement = null;
    Pitch.prototype.transformToolMask = null;

    //************************************** static variables ************************************//


    //constructor
    function Pitch(initWidth, initHeight) {
        //invoke constructor of superclass
        this.Container_constructor();

        var sizeIsValid = checkSizeValidity(initWidth, initHeight);
        if(sizeIsValid){
            this.componentWidth = initWidth;
            this.componentHeight = initHeight;
            if(this.componentWidth != undefined && this.componentHeight != undefined){
                this.update = true;
            }
        }

        initialize.call(this);
        render.call(this);
    }

    //extend this class from a superclass
    var p = createjs.extend(Pitch, createjs.Container);


    //************************************** public functions ****************************************//
    p.setSize = function(newW, newH){
        var sizeIsValid = checkSizeValidity(newW, newH);
        if(sizeIsValid && (newW!=this.componentWidth || newH!=this.componentHeight)){
            this.componentWidth = newW;
            this.componentHeight = newH;
            this.update = true;

        }
        render.call(this);
    };

    //************************************** private functions ***************************************//

    function checkSizeValidity(newW, newH){
        var result = (newW!=undefined && newW!=null && newW>0) && (newH!=undefined && newH!=null && newH>0);
        return result;
    }

    function initialize(){
        this.elements = [];

        //pitch shape
        this.backgroundShape = new createjs.Shape();
        this.backgroundShape.on("mousedown",canvasMouseDownHandler,this);
        this.addChild(this.backgroundShape);

        this.backgroundOutline = new createjs.Shape();
        this.addChild(this.backgroundOutline);

        //pitch mask
        this.backgroundShapeMask = new createjs.Shape();

        //container for all elements
        this.elementsLayer = new createjs.Container();
        this.elementsLayer.mask = this.backgroundShapeMask;
        this.addChild(this.elementsLayer);

        this.transformToolMask = new createjs.Shape();

        this.transformTool = new drillEditor.TransformTool();
        this.transformTool.mask = this.transformToolMask;
        this.addChild(this.transformTool);


        this.dispatcher = drillEditor.Dispatcher.getInstance();


    }

    function render() {
        if(!this.update){
            return;
        }
        //redraw bg shape
        this.backgroundShape.graphics.clear();
        this.backgroundShape.graphics.beginFill("#99CA3B");
        this.backgroundShape.graphics.drawRect(0, 0, this.componentWidth, this.componentHeight);

        this.backgroundOutline.graphics.clear();
        this.backgroundOutline.graphics.setStrokeStyle(2);
        this.backgroundOutline.graphics.beginStroke("#FFFFFF");
        this.backgroundOutline.graphics.drawRect(0, 0, this.componentWidth, this.componentHeight);

        //redraw mask shape
        this.backgroundShapeMask.graphics.clear();
        this.backgroundShapeMask.graphics.beginFill("#FF0000");
        this.backgroundShapeMask.graphics.drawRect(0, 0, this.componentWidth, this.componentHeight);

        this.transformToolMask.graphics.clear();
        this.transformToolMask.graphics.beginFill("#FFFFFF");
        this.transformToolMask.graphics.drawRect(0, 0, this.componentWidth, this.componentHeight);
    }


    /************************************* public functions *******************************************/




    /************************************** event handlers *******************************************/

    function canvasMouseDownHandler(evt){
        //this.transformTool.setTarget(null);
        drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_SELECTED,{data:null}));
    }


    /************************************ static methods ********************************************/


    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.Pitch = createjs.promote(Pitch,"Container");

}());



//##############################################################################
//
//##############################################################################

/**
 * Class SizeHint
 * Created by maxim_000 on 9/23/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
    SizeHint.prototype.componentWidth;
    SizeHint.prototype.componentHeight;
    SizeHint.prototype.strokeShape;
    SizeHint.prototype.text;
    SizeHint.prototype.label;

    //static variable
    SizeHint.TEXT_COLOR = "#FFFFFF";
    SizeHint.STROKE_COLOR = "#FFFFFF";

    //constructor
    function SizeHint(width, height, text) {
        //invoke constructor of superclass
        this.Container_constructor();
        this.componentWidth = width;
        this.componentHeight = height;
        this.text = text ? text : "";
        this.initialize();
    }

    //extend this class from a superclass
    var p = createjs.extend(SizeHint, createjs.Container);

    p.initialize = function(){
        this.strokeShape = new createjs.Shape();
        this.addChild(this.strokeShape);

        this.label = new createjs.Text(this.text, "12px Arial", SizeHint.TEXT_COLOR);
        this.addChild(this.label);

        this.strokeMask = new createjs.Shape();
        //this.strokeShape.mask = this.strokeMask;

        if(this.componentWidth && this.componentHeight){
            this.render();
        }
    };

    // public functions
    p.update = function (width, height, text) {
        this.componentWidth = width;
        this.componentHeight = height;
        this.text = text ? text : "";
        this.label.text = this.text;
        if(this.componentWidth && this.componentHeight){
            this.render();
        }
    };

    p.render = function(){

        var arrowW = 5;
        var arrowH = 8;
        var lineWidth = this.componentWidth - 2*arrowW;

        this.strokeShape.graphics.clear();
        this.strokeShape.graphics.beginFill("rgba(0,255,0,0.01)");
        this.strokeShape.graphics.drawRect(0,0,this.componentWidth, this.componentHeight);
        
        this.strokeShape.graphics.beginFill(SizeHint.STROKE_COLOR);
        this.strokeShape.graphics.moveTo(0, this.componentHeight/2);
        this.strokeShape.graphics.lineTo(arrowW, this.componentHeight/2 - arrowH/2);
        this.strokeShape.graphics.lineTo(arrowW, this.componentHeight/2 + arrowH/2);
        this.strokeShape.graphics.lineTo(0, this.componentHeight/2);

        this.strokeShape.graphics.beginStroke(SizeHint.STROKE_COLOR);
        this.strokeShape.graphics.setStrokeStyle(1.25);
        this.strokeShape.graphics.setStrokeDash([5,2],0);
        this.strokeShape.graphics.moveTo(arrowW, this.componentHeight/2);
        this.strokeShape.graphics.lineTo(arrowW + lineWidth,this.componentHeight/2);
        this.strokeShape.graphics.endStroke();

        this.strokeShape.graphics.moveTo(arrowW + lineWidth,this.componentHeight/2 - arrowH/2);
        this.strokeShape.graphics.lineTo(this.componentWidth, this.componentHeight/2);
        this.strokeShape.graphics.lineTo(this.componentWidth - arrowW, this.componentHeight/2 + arrowH/2);
        this.strokeShape.graphics.lineTo(this.componentWidth - arrowW, this.componentHeight/2 - arrowH/2);

        var textBounds = this.label.getBounds();
        if(this.text && this.text.length>0){
            this.label.x = this.componentWidth/2 - textBounds.width / 2;
            this.label.y = this.componentHeight/2 - textBounds.height / 2;
            this.strokeMask.graphics.clear();
            this.strokeMask.graphics.beginFill("#000000");
            this.strokeMask.graphics.drawRect(0,0,this.label.x - 4,this.componentHeight);
            this.strokeMask.graphics.drawRect(this.label.x + textBounds.width + 4, 0,
                                                this.componentWidth - (this.label.x + textBounds.width + 4), this.componentHeight);
            this.strokeShape.mask = this.strokeMask;
        }else{
            this.strokeShape.mask=null;
        }

    };



    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.SizeHint = createjs.promote(SizeHint,"Container");


}());


//##############################################################################
//
//##############################################################################

/**
 * Class ArchedArrow
 * Created by maxim_000 on 9/27/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /************************************************* public variables ***********************************************/
    ArchedArrow.prototype.arcShape = null;
    ArchedArrow.prototype.arrowShape = null;
    ArchedArrow.prototype.container = null;
    ArchedArrow.prototype.opaqueBackground = null;
    ArchedArrow.prototype.arrowAnchorPoint = null;

    /************************************************* static variables ***********************************************/
    ArchedArrow.STD_WIDTH = 60;
    ArchedArrow.STD_HEIGHT = 24;
    ArchedArrow.STROKE_SIZE = 3;
    ArchedArrow.STROKE_COLOR = "#ffffff";

    /************************************************** constructor ***************************************************/
    function ArchedArrow() {
        //invoke constructor of superclass
        this.BaseComponentRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(ArchedArrow, drillEditor.BaseComponentRenderer);

    /*********************************************** overridden methods ***********************************************/
    p.initialize = function(){
        this.BaseComponentRenderer_initialize();

        this.container = new createjs.Container();
        this.addChild(this.container);

        this.opaqueBackground = new createjs.Shape();
        this.opaqueBackground.graphics.beginFill("rgba(255,0,0,0.01)");
        this.opaqueBackground.graphics.drawRect( - ArchedArrow.STD_WIDTH/2, -ArchedArrow.STD_HEIGHT/2,ArchedArrow.STD_WIDTH, ArchedArrow.STD_HEIGHT);
        this.container.addChild(this.opaqueBackground);

        this.arcShape = new createjs.Shape();
        this.container.addChild(this.arcShape);

        this.startPoint = new createjs.Point( ArchedArrow.STD_WIDTH/2, ArchedArrow.STD_HEIGHT/2);
        this.endPoint = new createjs.Point( - ArchedArrow.STD_WIDTH/2, ArchedArrow.STD_HEIGHT/2);
        this.cp1 = new createjs.Point(this.startPoint.x - 10, -ArchedArrow.STD_HEIGHT/2-6);
        this.cp2 = new createjs.Point(this.endPoint.x + 10, -ArchedArrow.STD_HEIGHT/2-6);

        this.arcShape.graphics.setStrokeStyle(ArchedArrow.STROKE_SIZE);
        this.arcShape.graphics.beginStroke(ArchedArrow.STROKE_COLOR);
        this.arcShape.graphics.moveTo(this.startPoint.x, this.startPoint.y);
        this.arcShape.graphics.bezierCurveTo(this.cp1.x, this.cp1.y, this.cp2.x, this.cp2.y, this.endPoint.x, this.endPoint.y);

        this.arrowShape = new createjs.Shape();
        this.arrowShape.graphics.beginFill("#ffffff").moveTo(-6,7).lineTo(1,0).lineTo(-6, -7);
        this.container.addChild(this.arrowShape);

        this.setBounds(-ArchedArrow.STD_WIDTH / 2,-ArchedArrow.STD_HEIGHT / 2, ArchedArrow.STD_WIDTH, ArchedArrow.STD_HEIGHT);

    };

    p.render = function(){
        var renderData = this.getRendererData();
        var w = renderData.getWidth();
        var h = renderData.getHeight();

        this.x = renderData.getPosition().x;
        this.y = renderData.getPosition().y;

        this.container.rotation = this.getRendererData().rotation;

        this.updateArrowPositionAndRotation();
    };


    p.getContentBounds = function(){
        var contentPosInParentCS = this.localToLocal(- ArchedArrow.STD_WIDTH/2, - ArchedArrow.STD_HEIGHT/2, this.parent);
        var result = new createjs.Rectangle(contentPosInParentCS.x, contentPosInParentCS.y, this.rendererData.width, this.rendererData.height);
        return result;
    };


    /*p.addData = function(){
        this.BaseComponentRenderer_addData();
        this.rendererData.on(ApplicationEvent.GRAPHIC_PROPERTY_CHANGED, graphicPropertyChangeHandler, this);
    };*/

    p.graphicPropertyChangeHandler = function(evt){
        var propertyName = evt.payload.name;

        switch (propertyName){
            case "arrowDirection":
                this.updateArrowPositionAndRotation();
                break;

        }
    };

    /************************************************* public methods *************************************************/
    p.updateArrowPositionAndRotation = function(){

        this.arrowAnchorPoint = this.rendererData.arrowDirection=="left" ? this.endPoint : this.startPoint;
        var radian = Math.atan2((this.arrowAnchorPoint.y - this.cp2.y),(this.arrowAnchorPoint.x - this.cp2.x));
        var degree = (radian/ Math.PI * 180) + (this.rendererData.arrowDirection=="left" ? 8 : 27);
        this.arrowShape.x = this.arrowAnchorPoint.x;
        this.arrowShape.y = this.arrowAnchorPoint.y;
        this.arrowShape.rotation = degree;
    };

    /************************************************** event handlers ************************************************/
    /*function graphicPropertyChangeHandler(evt){
        var propertyName = evt.payload.name;

        switch (propertyName){
            case "arrowDirection":
                   this.updateArrowPositionAndRotation();
                break;

        }

    }*/

    /************************************************** static methods ************************************************/

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.ArchedArrow = createjs.promote(ArchedArrow,"BaseComponentRenderer");

}());


//##############################################################################
//
//##############################################################################

/**
 * Class BallComponent
 * Created by maxim_000 on 10/9/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/
    BallComponent.prototype.ballIcon = null;

    /******************* static variables *******************/
    BallComponent.STD_WIDTH = 32;
    BallComponent.STD_HEIGHT = 32;

    /********************** constructor *********************/
    function BallComponent() {
        //invoke constructor of superclass
        this.BaseComponentRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(BallComponent, drillEditor.BaseComponentRenderer);

    /******************** overridden methods ********************/
    p.initialize = function(){
        this.BaseComponentRenderer_initialize();

        this.container = new createjs.Container();
        this.addChild(this.container);

        this.ballIcon = new createjs.Bitmap(drillEditor.DrillEditorApplication.loadQueue.getResult("soccer-ball-icon"));
        this.container.addChild(this.ballIcon);
    };

    p.render = function(){

    };


    p.getContentBounds = function(){
        var contentPositionInParentCS =
            this.localToLocal(0,0, this.parent);
        var result = new createjs.Rectangle(contentPositionInParentCS.x,
        contentPositionInParentCS.y, this.rendererData.width, this.rendererData.height);

        return result;
    };

    /********************** private methods *********************/


    /********************** event handlers **********************/



    /******************** public static method ******************/

    //drillEditor.BallComponent.staticFunctionName = function(param1){ //method body };


    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.BallComponent = createjs.promote(BallComponent,"BaseComponentRenderer");


}());


//##############################################################################
//
//##############################################################################

/**
 * Class drillEditor.BallMovementLine
 * Created by maxim_000 on 9/18/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /**************************************************** public variables ********************************************/
    BallMovementLine.prototype.demoShape = null;
    BallMovementLine.prototype.lineContainer = null;
    BallMovementLine.prototype.lineContainerMask = null;
    //BallMovementLine.prototype.arrowDirection = null;

    //static variables
    BallMovementLine.INTERVAL = 3;
    BallMovementLine.STD_HEIGHT = 16;

    /**************************************************** constructor *************************************************/
    function BallMovementLine() {
        this.BaseComponentRenderer_constructor();
        initialize.call(this);
    }

    //extend this class from a superclass
    var p = createjs.extend(BallMovementLine, drillEditor.BaseComponentRenderer);

    /************************************************ private functions ***********************************************/
    function initialize() {

        this.demoShape = new createjs.Shape();
        this.container.addChild(this.demoShape);

        this.lineContainer = new createjs.Container();
        this.container.addChild(this.lineContainer);

        this.lineContainerMask = new createjs.Shape();
        this.lineContainer.mask = this.lineContainerMask;

    }

    /************************************************* overridden methods *********************************************/

    /*p.addData = function(){
        this.BaseComponentRenderer_addData();
        this.rendererData.on(ApplicationEvent.GRAPHIC_PROPERTY_CHANGED, graphicPropertyChangeHandler, this);
    };*/

    p.getBounds = function(){
        var result = new createjs.Rectangle(this._data.position.x, this._data.position.y, this._data.width, this._data.height);
        return result;
    };

    p.destroy = function(){
        this.BaseComponentRenderer_destroy();
        this.off("mousedown", this.mouseDownHandler);
        this.off("pressmove", this.pressMoveHandler);
    };

    p.initialize = function(){
        this.container = new createjs.Container();
        this.addChild(this.container);

        //TEMPORARY
        this.contentRegPoint = "endPoint";

        this.mouseDownHandler = this.container.on("mousedown", function(evt){
            drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_SELECTED,{data:this}));
            //TODO calculate offsets

            var pitchCordinates = this.container.localToLocal(evt.localX, evt.localY, this.parent);
            var startPointOffsetX = pitchCordinates.x - this.rendererData.startPoint.x;
            var startPointOffsetY = pitchCordinates.y - this.rendererData.startPoint.y;
            var endPointOffsetX = pitchCordinates.x - this.rendererData.endPoint.x;
            var endPointOffsetY = pitchCordinates.y - this.rendererData.endPoint.y;

            this.offset = {
                x: this.container.x - evt.stageX,
                y: this.container.y - evt.stageY,
                startPointOffsetX: startPointOffsetX,
                startPointOffsetY: startPointOffsetY,
                endPointOffsetX : endPointOffsetX,
                endPointOffsetY : endPointOffsetY
            };



            // console.log("Offset x=",this.offset.x,"y=",this.offset.y);
        }, this);

        //move by dragging container
        this.pressMoveHandler = this.container.on("pressmove", function(evt){
            var pitchCoordinates = this.container.localToLocal(evt.localX, evt.localY, this.parent);

            this.container.x = evt.stageX + this.offset.x;
            this.container.y = evt.stageY + this.offset.y;
            this._data.position.setValues(this.container.x, this.container.y);
            this.rendererData.startPoint.x = pitchCoordinates.x - this.offset.startPointOffsetX;
            this.rendererData.startPoint.y = pitchCoordinates.y - this.offset.startPointOffsetY;
            this.rendererData.endPoint.x = pitchCoordinates.x - this.offset.endPointOffsetX;
            this.rendererData.endPoint.y = pitchCoordinates.y - this.offset.endPointOffsetY;

            this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_MOVE));
        }, this);

    };

    p.render = function(){

        if(this.lineContainer.numChildren == 0){
            //draw a triangle and a long line

            var arrowShape = new createjs.Shape();
            arrowShape.graphics.beginFill("#FFFFFF").moveTo(6, 0).lineTo(6,14).lineTo(0,7).lineTo(6,0);

            var lineShape = new createjs.Shape();
            lineShape.graphics.beginStroke("#FFFFFF");
            lineShape.graphics.setStrokeStyle(3);
            lineShape.graphics.setStrokeDash([5,2], 0);
            //lineShape.graphics.drawCircle(0,0,15);
            //lineShape.graphics.endStroke();
           // lineShape.y = 7;
            lineShape.graphics.moveTo(5,7).lineTo(1000,7);

            this.lineContainer.addChild(arrowShape);
            this.lineContainer.addChild(lineShape);

            this.lineContainer.setBounds(0, 0, 1006 , BallMovementLine.STD_HEIGHT);
        }

        if(this.rendererData.arrowDirection == drillEditor.ArrowDirection.LEFT){
            this.lineContainer.scaleX = 1;
            this.lineContainer.x = 0;
        } else if(this.rendererData.arrowDirection == drillEditor.ArrowDirection.RIGHT){
            this.lineContainer.scaleX = -1;
            this.lineContainer.x = this.rendererData.lineWidth;
        }

        this.demoShape.graphics.clear();
        this.demoShape.graphics.beginFill("rgba(0,255,0,0.01)");
        this.demoShape.graphics.drawRect(0, 0, this.rendererData.lineWidth, BallMovementLine.STD_HEIGHT);

        this.lineContainerMask.graphics.clear();
        this.lineContainerMask.graphics.beginFill("#000000").drawRect(0,0,this.rendererData.lineWidth, BallMovementLine.STD_HEIGHT);

        var containerPosition = this.contentRegPoint == "endPoint" ? this.rendererData.endPoint : this.rendererData.startPoint;
        this.container.x = containerPosition.x;
        this.container.y = containerPosition.y;
        this.container.regY = BallMovementLine.STD_HEIGHT / 2;
        this.container.regX = this.contentRegPoint == "endPoint" ? this.rendererData.lineWidth : 0;


        this.container.rotation = this.rendererData.angle;
        //console.log("Container rotation = ",this.container.rotation);
        this.container.setBounds(0, 0, this.rendererData.lineWidth, BallMovementLine.STD_HEIGHT);
    };



    p.getContentBounds = function(){
        var containerBounds = this.container.getBounds();
        var result = new createjs.Rectangle(0, 0, this.container._bounds.width, this.container._bounds.height);
        return result;
    };

    p.getPointsInStageCS = function(){
        var result = {startPoint:this.localToGlobal(this.rendererData.startPoint.x, this.rendererData.startPoint.y),
            endPoint: this.localToGlobal(this.rendererData.endPoint.x, this.rendererData.endPoint.y)};
        return result;
    };

    p.getMinimalSize = function(){
        return new createjs.Point(drillEditor.DribblingLineSegment.STD_WIDTH, BallMovementLine.STD_HEIGHT);
    };

    p.isInteractiveLine = true;

    p.graphicPropertyChangeHandler = function(event){
        var propertyName = event.payload.name;

        switch (propertyName){
            case "startPoint":
                this.contentRegPoint = "endPoint";
                this.render();
                break;
            case "endPoint":
                this.contentRegPoint = "startPoint";
                this.render();
                break;
            case "arrowDirection":
                this.render();
                break;

        }
    };

    /******************************************** event handlers *******************************************/
    /*function graphicPropertyChangeHandler(event){

    }*/

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.BallMovementLine = createjs.promote(BallMovementLine,"BaseComponentRenderer");

}());



//##############################################################################
//
//##############################################################################

/**
 * Class BallSupplyComponent
 * Created by maxim_000 on 10/9/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/
    BallSupplyComponent.prototype.ballIcon = null;

    /******************* static variables *******************/
    BallSupplyComponent.STD_WIDTH = 78;
    BallSupplyComponent.STD_HEIGHT = 26;

    /********************** constructor *********************/
    function BallSupplyComponent() {
        //invoke constructor of superclass
        this.BaseComponentRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(BallSupplyComponent, drillEditor.BaseComponentRenderer);

    /******************** overridden methods ********************/
    p.initialize = function(){
        this.BaseComponentRenderer_initialize();

        this.container = new createjs.Container();
        this.addChild(this.container);

        this.ballIcon = new createjs.Bitmap(drillEditor.DrillEditorApplication.loadQueue.getResult("ball-supply-icon"));
        this.container.addChild(this.ballIcon);
    };

    p.getContentBounds = function(){
        var contentPositionInParentCS =
            this.localToLocal(0,0, this.parent);
        var result = new createjs.Rectangle(contentPositionInParentCS.x,
            contentPositionInParentCS.y, this.rendererData.width, this.rendererData.height);

        return result;
    };

    /********************** private methods *********************/


    /********************** event handlers **********************/



    /******************** public static method ******************/

    //drillEditor.BallSupplyComponent.staticFunctionName = function(param1){ //method body };


    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.BallSupplyComponent = createjs.promote(BallSupplyComponent,"BaseComponentRenderer");


}());


//##############################################################################
//
//##############################################################################

/**
 * Class BaseSpriteRenderer
 * Created by maxim_000 on 9/21/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
    BaseComponentRenderer.prototype._data = null;
    BaseComponentRenderer.prototype.needRender = null;
    BaseComponentRenderer.prototype.positionChanged = null;
    BaseComponentRenderer.prototype._x = null;
    BaseComponentRenderer.prototype._y = null;
    BaseComponentRenderer.rendererData = null;
    BaseComponentRenderer.container = null;
    BaseComponentRenderer.dispatcher = null;


    //static variable
    //BaseComponentRenderer.staticVar = "value";

    //constructor
    function BaseComponentRenderer() {
        //invoke constructor of superclass
        this.Container_constructor();
        this.initialize();
    }

    //extend this class from a superclass
    var p = createjs.extend(BaseComponentRenderer,createjs.Container);

    // protected functions
    p.f = function () {
        //to be overridden
    };

    p.initialize = function(){

        this.dispatcher = drillEditor.Dispatcher.getInstance();

        this.container = new createjs.Container();
        this.addChild(this.container);

        this.BaseComponentRenderer_mouseDownHandler = this.on("mousedown", function(evt){
            //console.log("mousedown");
            drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_SELECTED,{data:this}));
            this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
        },this);

        this.BaseComponentRenderer_pressMoveHandler = this.on("pressmove", function(evt){
            //console.log("pressmove");
            this.x = evt.stageX + this.offset.x;
            this.y = evt.stageY + this.offset.y;

            this._data.position.setValues(this.x, this.y);

            this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_MOVE));
        });


    };

    p.render = function(){
        // TO BE OVERRIDDEN AND EXTENDED BY SUCCESSORS
    };

    /*
    Returns minimal size of this component in pixels
     */
    p.getMinimalSize = function(){
        //to be overridden
    };

    p.getBounds = function(){
        var result = new createjs.Rectangle(this._data.position.x, this._data.position.y, this._data.width, this._data.height);
        return result;
    };

    /**
     * Destroys all interactivity in this instance.
     * To be overridden and extended by successors.
     */
    p.destroy = function(){
        this.off("mousedown", this.BaseComponentRenderer_mouseDownHandler);
        this.off("pressmove", this.BaseComponentRenderer_pressMoveHandler);

        this.removeData();
    };

    p.setRendererData = function(value){
        if(this._data == value){
            return;
        }

        if(this._data){
            this.removeData();
        }

        this._data = value;
        this.rendererData = value;

        if(this._data){
            this.addData();
            this.invalidateGraphic();
            this.onPositionChanged();
        }

    };

    p.getRendererData = function(){
        return this._data;
    };

    p.invalidateGraphic = function(){
        this.needRender = true;
        this.render();
    };

    p.onPositionChanged = function(event){

    };

    p.removeData = function(){
        if(this._data){
            this._data.off(drillEditor.ApplicationEvent.ELEMENT_RESIZE, this.BaseComponentRenderer_elementResizeHandler);
            this._data.off(drillEditor.ApplicationEvent.GRAPHIC_PROPERTY_CHANGED, this.graphicPropertyChangeHandler);
        }
    };

    p.addData = function(){
        //add listeners to the updated rendererData
        this.BaseComponentRenderer_elementResizeHandler = this._data.on(drillEditor.ApplicationEvent.ELEMENT_RESIZE, this.render, this);
        this.BaseComponentRenderer_graphicPropertyChanged = this._data.on(drillEditor.ApplicationEvent.GRAPHIC_PROPERTY_CHANGED, this.graphicPropertyChangeHandler, this);
    };

    p.graphicPropertyChangeHandler = function(evt){
        //TO BE OVERRIDDEN AND EXTENDED BY SUCCESSORS
    };

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.BaseComponentRenderer = createjs.promote(BaseComponentRenderer,"Container");

}());


//##############################################################################
//
//##############################################################################

/**
 * Class DribblingLine
 * Created by maxim_000 on 9/18/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /**************************************************** public variables ********************************************/
    DribblingLine.prototype.demoShape = null;
    DribblingLine.prototype.lineContainer = null;
    DribblingLine.prototype.lineContainerMask = null;

    //static variables
    DribblingLine.INTERVAL = 3;

    /**************************************************** constructor *************************************************/
    function DribblingLine() {
        this.BaseComponentRenderer_constructor();
        initialize.call(this);
    }

    //extend this class from a superclass
    var p = createjs.extend(DribblingLine, drillEditor.BaseComponentRenderer);

    /************************************************ private functions ***********************************************/
    function initialize() {

        this.demoShape = new createjs.Shape();
        this.container.addChild(this.demoShape);

        this.lineContainer = new createjs.Container();
        this.container.addChild(this.lineContainer);

        this.lineContainerMask = new createjs.Shape();
        this.lineContainer.mask = this.lineContainerMask;

    }

    /************************************************* overridden methods *********************************************/

    p.getBounds = function(){
        var result = new createjs.Rectangle(this._data.position.x, this._data.position.y, this._data.width, this._data.height);
        return result;
    };

    p.initialize = function(){
        this.container = new createjs.Container();
        this.addChild(this.container);

        //TEMPORARY
        this.contentRegPoint = "endPoint";

        this.mouseDownHandler = this.container.on("mousedown", function(evt){
            drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_SELECTED,{data:this}));
            //TODO calculate offsets

            var pitchCordinates = this.container.localToLocal(evt.localX, evt.localY, this.parent);
            var startPointOffsetX = pitchCordinates.x - this.rendererData.startPoint.x;
            var startPointOffsetY = pitchCordinates.y - this.rendererData.startPoint.y;
            var endPointOffsetX = pitchCordinates.x - this.rendererData.endPoint.x;
            var endPointOffsetY = pitchCordinates.y - this.rendererData.endPoint.y;

            this.offset = {
                            x: this.container.x - evt.stageX,
                            y: this.container.y - evt.stageY,
                            startPointOffsetX: startPointOffsetX,
                            startPointOffsetY: startPointOffsetY,
                            endPointOffsetX : endPointOffsetX,
                            endPointOffsetY : endPointOffsetY
            };



           // console.log("Offset x=",this.offset.x,"y=",this.offset.y);
        }, this);

        //move by dragging container
        this.pressMoveHandler = this.container.on("pressmove", function(evt){
            var pitchCoordinates = this.container.localToLocal(evt.localX, evt.localY, this.parent);

            this.container.x = evt.stageX + this.offset.x;
            this.container.y = evt.stageY + this.offset.y;
            //this._data.position.setValues(this.container.x, this.container.y);
            this.rendererData.startPoint.x = pitchCoordinates.x - this.offset.startPointOffsetX;
            this.rendererData.startPoint.y = pitchCoordinates.y - this.offset.startPointOffsetY;
            this.rendererData.endPoint.x = pitchCoordinates.x - this.offset.endPointOffsetX;
            this.rendererData.endPoint.y = pitchCoordinates.y - this.offset.endPointOffsetY;

            this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_MOVE));
        }, this);

    };

    p.destroy = function(){
        this.BaseComponentRenderer_destroy();
        this.off("mousedown", this.mouseDownHandler);
        this.off("pressmove", this.pressMoveHandler);
    };

    p.render = function(){

        if(this.lineContainer.numChildren == 0){
            //insert 30 arrows
            var numSegments = 30;
            var initX = 0;
            for(var i=0; i<numSegments; i++){
                var segment = new drillEditor.DribblingLineSegment("#FFFFFF");
                segment.x = initX;
                this.lineContainer.addChild(segment);
                initX += drillEditor.DribblingLineSegment.STD_WIDTH + DribblingLine.INTERVAL;
            }
            this.lineContainer.setBounds(0, 0, numSegments*(drillEditor.DribblingLineSegment.STD_WIDTH) + (numSegments-1)*DribblingLine.INTERVAL, drillEditor.DribblingLineSegment.STD_HEIGHT);
        }

        //if(this.rendererData.direction == "rtl"){
        if(this.rendererData.arrowDirection == drillEditor.ArrowDirection.LEFT){
            this.lineContainer.scaleX = 1;
            this.lineContainer.x = 0;
        } else if(this.rendererData.arrowDirection == drillEditor.ArrowDirection.RIGHT){
            this.lineContainer.scaleX = -1;
            this.lineContainer.x = this.rendererData.lineWidth;
        }

        this.demoShape.graphics.clear();
        this.demoShape.graphics.beginFill("rgba(0,255,0,0.01)");
        this.demoShape.graphics.drawRect(0, 0, this.rendererData.lineWidth, drillEditor.DribblingLineSegment.STD_HEIGHT);

        this.lineContainerMask.graphics.clear();
        this.lineContainerMask.graphics.beginFill("#000000").drawRect(0,0,this.rendererData.lineWidth, drillEditor.DribblingLineSegment.STD_HEIGHT);

        var containerPosition = this.contentRegPoint == "endPoint" ? this.rendererData.endPoint : this.rendererData.startPoint;
        this.container.x = containerPosition.x;
        this.container.y = containerPosition.y;
        this.container.regY = drillEditor.DribblingLineSegment.STD_HEIGHT / 2;
        this.container.regX = this.contentRegPoint == "endPoint" ? this.rendererData.lineWidth : 0;


        this.container.rotation = this.rendererData.angle;
        //console.log("Container rotation = ",this.container.rotation);
        this.container.setBounds(0, 0, this.rendererData.lineWidth, drillEditor.DribblingLineSegment.STD_HEIGHT);
    };



    p.getContentBounds = function(){
        var containerBounds = this.container.getBounds();
        var result = new createjs.Rectangle(0, 0, this.container._bounds.width, this.container._bounds.height);
        return result;
    };

    p.getPointsInStageCS = function(){
        var result = {startPoint:this.localToGlobal(this.rendererData.startPoint.x, this.rendererData.startPoint.y),
            endPoint: this.localToGlobal(this.rendererData.endPoint.x, this.rendererData.endPoint.y)};
        return result;
    };

    p.getMinimalSize = function(){
        return new createjs.Point(drillEditor.DribblingLineSegment.STD_WIDTH, drillEditor.DribblingLineSegment.STD_HEIGHT);
    };

    p.graphicPropertyChangeHandler = function(event){
        var propertyName = event.payload.name;

        switch (propertyName){
            case "startPoint":
                this.contentRegPoint = "endPoint";
                this.render();
                break;
            case "endPoint":
                this.contentRegPoint = "startPoint";
                this.render();
                break;
            /*case "direction":
                this.render();
                break;*/
            case "arrowDirection":
                this.render();
                break;


        }
    };

    p.isInteractiveLine = true;
    /******************************************** event handlers *******************************************/


        //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.DribblingLine = createjs.promote(DribblingLine,"BaseComponentRenderer");

}());



//##############################################################################
//
//##############################################################################

/**
 * Class DribblingLineSegment
 * Created by maxim_000 on 10/5/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
    DribblingLineSegment.prototype.color = null;
    DribblingLineSegment.prototype.direction = null;
    DribblingLineSegment.prototype.curveShape = null;
    DribblingLineSegment.prototype.arrowShape = null;
    DribblingLineSegment.prototype.opaqueShape = null;

    //static variable
    DribblingLineSegment.STD_WIDTH = 47;
    DribblingLineSegment.STD_HEIGHT = 16;
    DribblingLineSegment.CURVE_Y = 5;

    //constructor
    function DribblingLineSegment(color, direction) {
        //invoke constructor of superclass
        this.Container_constructor();

        this.color = color;
        this.direction = direction;

        this.initialize();
    }

    //extend this class from a superclass
    var p = createjs.extend(DribblingLineSegment, createjs.Container);

    p.initialize = function(){

        this.opaqueShape = new createjs.Shape();
        this.opaqueShape.graphics.beginFill("rgba(255,255,255,1)").drawRect(0,0,DribblingLineSegment.STD_WIDTH,DribblingLineSegment.STD_HEIGHT);
        this.opaqueShape.alpha=0.01;
        this.addChild(this.opaqueShape);

        this.curveShape = new createjs.Shape();
        this.curveShape.graphics.setStrokeStyle(3);
        this.curveShape.graphics.beginStroke(this.color);
        this.curveShape.graphics.moveTo(3, f(3));

        for(var i=3; i<DribblingLineSegment.STD_WIDTH; i++){
            this.curveShape.graphics.lineTo(i, f(i));
        }
        this.curveShape.y = DribblingLineSegment.CURVE_Y;
        this.addChild(this.curveShape);

        this.arrowShape = new createjs.Shape();
        this.arrowShape.graphics.beginFill(this.color).moveTo(6, 0).lineTo(6,14).lineTo(0,7).lineTo(6,0);
        this.addChild(this.arrowShape);

        var blurFilter = new createjs.BlurFilter(1, 1, 3);
        this.curveShape.filters = [blurFilter];

        var bounds = blurFilter.getBounds();
        this.curveShape.cache(-2+bounds.x, -2+bounds.y, 4+DribblingLineSegment.STD_WIDTH, 4+DribblingLineSegment.STD_HEIGHT);

        this.setBounds(0, 0, DribblingLineSegment.STD_WIDTH, DribblingLineSegment.STD_HEIGHT);

    };

    /************************************ private functions ************************************/
    function f(x) {
        return -4*Math.sin((x*8)*3.14/180) + DribblingLineSegment.CURVE_Y;
    }

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.DribblingLineSegment = createjs.promote(DribblingLineSegment,"Container");


}());


//##############################################################################
//
//##############################################################################

/**
 * Class Goal
 * Created by maxim_000 on 10/28/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/
    //drillEditor.Goal.prototype.publicVar = "value";

    /******************* static variables *******************/
    Goal.STD_WIDTH = 65;
    Goal.STD_HEIGHT = 47;

    /********************** constructor *********************/
    function Goal() {
        //invoke constructor of superclass
        this.BaseComponentRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(Goal, drillEditor.BaseComponentRenderer);

    /*********************************************** overridden methods ***********************************************/
    p.initialize = function() {
        this.BaseComponentRenderer_initialize();

        this.container = new createjs.Container();
        this.addChild(this.container);

        this.goalIcon = new createjs.Bitmap(drillEditor.DrillEditorApplication.loadQueue.getResult("goal-component-icon"));
        this.goalIcon.x = -Goal.STD_WIDTH / 2;
        this.goalIcon.y = -Goal.STD_HEIGHT / 2;
        this.container.addChild(this.goalIcon);

        this.opaqueBackground = new createjs.Shape();
        this.opaqueBackground.graphics.beginFill("rgba(255,0,0,0.01)");
        this.opaqueBackground.graphics.drawRect( - Goal.STD_WIDTH/2, -Goal.STD_HEIGHT/2,Goal.STD_WIDTH, Goal.STD_HEIGHT);
        this.container.addChild(this.opaqueBackground);

        this.setBounds(-Goal.STD_WIDTH / 2, -Goal.STD_HEIGHT / 2, Goal.STD_WIDTH, Goal.STD_HEIGHT);

    };

    p.render = function(){
        this.container.rotation = this.rendererData.rotation;
    };

    p.getContentBounds = function(){
        var contentPositionInParentCS = this.localToLocal(-Goal.STD_WIDTH/2, -Goal.STD_HEIGHT/2, this.parent);
        var result = new createjs.Rectangle(contentPositionInParentCS.x,
                                                contentPositionInParentCS.y,
                                                this.rendererData.width,
                                                this.rendererData.height);
        return result;
    };

    /******************** private methods *******************/


    /******************** event handlers ********************/


    /******************* public static method ***************/

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.Goal = createjs.promote(Goal, "BaseComponentRenderer");

}());


//##############################################################################
//
//##############################################################################

/**
 * Class drillEditor.PlayerMovementLine
 * Created by maxim_000 on 9/18/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /**************************************************** public variables ********************************************/
    PlayerMovementLine.prototype.demoShape = null;
    PlayerMovementLine.prototype.lineContainer = null;
    PlayerMovementLine.prototype.lineContainerMask = null;
    //PlayerMovementLine.prototype.direction = null;

    //static variables
    PlayerMovementLine.INTERVAL = 3;
    PlayerMovementLine.STD_HEIGHT = 16;

    /**************************************************** constructor *************************************************/
    function PlayerMovementLine() {
        this.BaseComponentRenderer_constructor();
        initialize.call(this);
    }

    //extend this class from a superclass
    var p = createjs.extend(PlayerMovementLine, drillEditor.BaseComponentRenderer);

    /************************************************ private functions ***********************************************/
    function initialize() {

        this.demoShape = new createjs.Shape();
        this.container.addChild(this.demoShape);

        this.lineContainer = new createjs.Container();
        this.container.addChild(this.lineContainer);

        this.lineContainerMask = new createjs.Shape();
        this.lineContainer.mask = this.lineContainerMask;

    }

    /************************************************* overridden methods *********************************************/

    p.getBounds = function(){
        var result = new createjs.Rectangle(this._data.position.x, this._data.position.y, this._data.width, this._data.height);
        return result;
    };

    p.initialize = function(){
        this.container = new createjs.Container();
        this.addChild(this.container);

        //TEMPORARY
        this.contentRegPoint = "endPoint";

        this.mouseDownHandler = this.container.on("mousedown", function(evt){
            drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_SELECTED,{data:this}));
            //TODO calculate offsets

            var pitchCordinates = this.container.localToLocal(evt.localX, evt.localY, this.parent);
            var startPointOffsetX = pitchCordinates.x - this.rendererData.startPoint.x;
            var startPointOffsetY = pitchCordinates.y - this.rendererData.startPoint.y;
            var endPointOffsetX = pitchCordinates.x - this.rendererData.endPoint.x;
            var endPointOffsetY = pitchCordinates.y - this.rendererData.endPoint.y;

            this.offset = {
                x: this.container.x - evt.stageX,
                y: this.container.y - evt.stageY,
                startPointOffsetX: startPointOffsetX,
                startPointOffsetY: startPointOffsetY,
                endPointOffsetX : endPointOffsetX,
                endPointOffsetY : endPointOffsetY
            };

        }, this);

        //move by dragging container
        this.pressMoveHandler = this.container.on("pressmove", function(evt){
            var pitchCoordinates = this.container.localToLocal(evt.localX, evt.localY, this.parent);

            this.container.x = evt.stageX + this.offset.x;
            this.container.y = evt.stageY + this.offset.y;
            this._data.position.setValues(this.container.x, this.container.y);
            this.rendererData.startPoint.x = pitchCoordinates.x - this.offset.startPointOffsetX;
            this.rendererData.startPoint.y = pitchCoordinates.y - this.offset.startPointOffsetY;
            this.rendererData.endPoint.x = pitchCoordinates.x - this.offset.endPointOffsetX;
            this.rendererData.endPoint.y = pitchCoordinates.y - this.offset.endPointOffsetY;

            this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_MOVE));
        }, this);

    };

    p.destroy = function(){
        this.BaseComponentRenderer_destroy();
        this.off("mousedown", this.mouseDownHandler);
        this.off("pressmove", this.pressMoveHandler);
    };

    p.render = function(){

        if(this.lineContainer.numChildren == 0){
            //draw a triangle and a long line

            var arrowShape = new createjs.Shape();
            arrowShape.graphics.beginFill("#FFFFFF").moveTo(6, 0).lineTo(6,14).lineTo(0,7).lineTo(6,0);
            arrowShape.graphics.drawRect(5,7-3/2,1280,3);

            this.lineContainer.addChild(arrowShape);

            this.lineContainer.setBounds(0, 0, 1006 , PlayerMovementLine.STD_HEIGHT);
        }

        if(this.rendererData.arrowDirection == drillEditor.ArrowDirection.LEFT){
            this.lineContainer.scaleX = 1;
            this.lineContainer.x = 0;
        } else if(this.rendererData.arrowDirection == drillEditor.ArrowDirection.RIGHT){
            this.lineContainer.scaleX = -1;
            this.lineContainer.x = this.rendererData.lineWidth;
        }

        this.demoShape.graphics.clear();
        this.demoShape.graphics.beginFill("rgba(0,255,0,0.01)");
        this.demoShape.graphics.drawRect(0, 0, this.rendererData.lineWidth, PlayerMovementLine.STD_HEIGHT);

        this.lineContainerMask.graphics.clear();
        this.lineContainerMask.graphics.beginFill("#000000").drawRect(0,0,this.rendererData.lineWidth, PlayerMovementLine.STD_HEIGHT);

        var containerPosition = this.contentRegPoint == "endPoint" ? this.rendererData.endPoint : this.rendererData.startPoint;
        this.container.x = containerPosition.x;
        this.container.y = containerPosition.y;
        this.container.regY = PlayerMovementLine.STD_HEIGHT / 2;
        this.container.regX = this.contentRegPoint == "endPoint" ? this.rendererData.lineWidth : 0;


        this.container.rotation = this.rendererData.angle;
        //console.log("Container rotation = ",this.container.rotation);
        this.container.setBounds(0, 0, this.rendererData.lineWidth, PlayerMovementLine.STD_HEIGHT);
    };



    p.getContentBounds = function(){
        var containerBounds = this.container.getBounds();
        var result = new createjs.Rectangle(0, 0, this.container._bounds.width, this.container._bounds.height);
        return result;
    };

    p.getPointsInStageCS = function(){
        var result = {startPoint:this.localToGlobal(this.rendererData.startPoint.x, this.rendererData.startPoint.y),
            endPoint: this.localToGlobal(this.rendererData.endPoint.x, this.rendererData.endPoint.y)};
        return result;
    };

    p.getMinimalSize = function(){
        return new createjs.Point(drillEditor.DribblingLineSegment.STD_WIDTH, PlayerMovementLine.STD_HEIGHT);
    };

    p.graphicPropertyChangeHandler = function(event){
        var propertyName = event.payload.name;

        switch (propertyName){
            case "startPoint":
                this.contentRegPoint = "endPoint";
                this.render();
                break;
            case "endPoint":
                this.contentRegPoint = "startPoint";
                this.render();
                break;
            case "arrowDirection":
                this.render();
                break;

        }
    };

    p.isInteractiveLine = true;
    /******************************************** event handlers *******************************************/

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.PlayerMovementLine = createjs.promote(PlayerMovementLine,"BaseComponentRenderer");
}());



//##############################################################################
//
//##############################################################################

/**
 * Class PrimitiveShapeRenderer
 * Created by maxim_000 on 10/1/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
    PrimitiveShapeRenderer.prototype.minimalSize;
    PrimitiveShapeRenderer.prototype.textField = null;


    //static variable
    PrimitiveShapeRenderer.CIRCLE_COMPONENT_MIN_RADIUS = 20;

    //constructor
    function PrimitiveShapeRenderer() {
        //invoke constructor of superclass
        this.BaseComponentRenderer_constructor();
        this.mouseChildren = false;
    }

    //extend this class from a superclass
    var p = createjs.extend(PrimitiveShapeRenderer,drillEditor.BaseComponentRenderer);

    p.initialize = function(){
        this.BaseComponentRenderer_initialize();
        this.outlineShape = new createjs.Shape();
        this.container.addChild(this.outlineShape);

        //if(this.rendererData.type!=GraphicElementType.NEUTRAL_PLAYER && this.rendererData.type!=GraphicElementType.CONE){
            this.textField = new createjs.Text("","16px Arial","#ffffff");
            this.container.addChild(this.textField);
       // }
    };

    p.render = function(){

        switch (this.rendererData.type){
            case drillEditor.GraphicElementType.ATTACKER:
            case drillEditor.GraphicElementType.DEFENDER:
            case drillEditor.GraphicElementType.EXTRA_TEAM:
            case drillEditor.GraphicElementType.NEUTRAL_PLAYER:
                this.outlineShape.graphics.clear();
                this.outlineShape.graphics.beginFill(this.rendererData.fillColor);
                this.outlineShape.graphics.drawCircle(0,0,this.rendererData.getWidth()/2);
                this.minimalSize = new createjs.Point(PrimitiveShapeRenderer.CIRCLE_COMPONENT_MIN_RADIUS*2,PrimitiveShapeRenderer.CIRCLE_COMPONENT_MIN_RADIUS*2);

                if(this.rendererData.type == drillEditor.GraphicElementType.NEUTRAL_PLAYER){
                    var letterT = new createjs.Shape();
                    letterT.graphics.clear();
                    letterT.graphics.beginFill("#ffffff");
                    letterT.graphics.drawRect(0,0,16,2);
                    letterT.graphics.drawRect(8-1,2,2,20);
                    letterT.x =  - 16 / 2;
                    letterT.y = - 22 / 2;
                    this.container.addChild(letterT);
                }

                break;

            case drillEditor.GraphicElementType.CONE:
                //to be implemented
                this.outlineShape.graphics.beginFill(this.rendererData.fillColor);
                this.outlineShape.graphics.moveTo(0, -this.rendererData.height/2);
                this.outlineShape.graphics.lineTo(this.rendererData.width/2, this.rendererData.height/2);
                this.outlineShape.graphics.lineTo(-this.rendererData.width/2, this.rendererData.height/2);
                this.outlineShape.graphics.lineTo(0, -this.rendererData.height/2);
                break;
        }

        this.outlineShape.setBounds(-this.rendererData.getWidth()/2,
            - this.rendererData.getHeight()/2,
            this.rendererData.getWidth(),
            this.rendererData.getHeight());
    };

    p.getContentBounds = function(){
        var contentPosInParentCS = this.localToLocal(this.outlineShape._bounds.x, this.outlineShape._bounds.y, this.parent);
        var result = new createjs.Rectangle(contentPosInParentCS.x, contentPosInParentCS.y, this.outlineShape._bounds.width, this.outlineShape._bounds.height);
        return result;
    };

    p.getMinimalSize = function(){
        return this.minimalSize;
    };

    p.graphicPropertyChangeHandler = function(evt){
        switch(evt.payload.name){
            case "playerNumber":
                    this.textField.text = this.rendererData.playerNumber;
                    var tfBounds = this.textField.getBounds();
                    this.textField.x = -tfBounds.width / 2;
                    this.textField.y = -tfBounds.height / 2;
                break;
        }
    };


    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.PrimitiveShapeRenderer = createjs.promote(PrimitiveShapeRenderer,"BaseComponentRenderer");


}());


//##############################################################################
//
//##############################################################################

/**
 * Class RectComponent
 * Created by maxim_000 on 9/18/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /**************************************************** public variables *********************************************/
    RectComponent.prototype.outlineShape;

    //static variables
    RectComponent.MIN_WIDTH = 75;
    RectComponent.MIN_HEIGH = 50;

    /**************************************************** constructor **************************************************/
    function RectComponent() {
        this.BaseComponentRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(RectComponent, drillEditor.BaseComponentRenderer);

    /************************************************* overridden methods ***********************************************/

    p.initialize = function(){
        this.BaseComponentRenderer_initialize();
        this.outlineShape = new createjs.Shape();
        this.addChild(this.outlineShape);

        this.widthRuler = new drillEditor.SizeHint();
        this.widthRuler.y = -14 - 3;
        this.addChild(this.widthRuler);

        this.heightRuler = new drillEditor.SizeHint();
        this.heightRuler.x = -14 - 3;
        this.heightRuler.rotation = -90;
        this.addChild(this.heightRuler);

        console.log("RectComponent.initialize()");
    };

    p.getContentBounds = function(){
        var contentPosInParentCS = this.localToLocal(0, 0, this.parent);
        var result = new createjs.Rectangle(contentPosInParentCS.x, contentPosInParentCS.y, this.rendererData.width, this.rendererData.height);
        return result;
    };

    p.render = function(){
        var renderData = this.getRendererData();
        var w = renderData.getWidth();
        var h = renderData.getHeight();
        drillEditor.DrawingUtils.drawStrictSizeRectangle(this.outlineShape.graphics, 0, 0, renderData.getWidth(), renderData.getHeight(), 4, "#ffffff");

        this.widthRuler.update(w, 14, Math.round(w * drillEditor.ApplicationModel.getInstance().mpp) + " m");
        this.heightRuler.update(h, 14, Math.round(h * drillEditor.ApplicationModel.getInstance().mpp) + " m");
        this.heightRuler.y = h;
    };



    p.getMinimalSize = function(){
        return new createjs.Point(RectComponent.MIN_WIDTH, RectComponent.MIN_HEIGH);
    };

    //Make aliases for all superclass methods: SuperClass_methodName
        drillEditor.RectComponent = createjs.promote(RectComponent,"BaseComponentRenderer");
}());



//##############################################################################
//
//##############################################################################

/**
 * Class SquareComponent
 * Created by maxim_000 on 9/18/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /**************************************************** public variables ********************************************/
    //static variables
    SquareComponent.MIN_WIDTH = 75;
    SquareComponent.MIN_HEIGHT = 75;

    /**************************************************** constructor *************************************************/

    function SquareComponent() {
        this.BaseComponentRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(SquareComponent,drillEditor.RectComponent);

    /************************************************* overridden methods *********************************************/

    p.initialize = function(){
      this.RectComponent_initialize();
      console.log("SquareComponent.initialize()");
    };

    p.getMinimalSize = function(){
        return new createjs.Point(SquareComponent.MIN_WIDTH, SquareComponent.MIN_HEIGHT);
    };

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.SquareComponent = createjs.promote(SquareComponent,"RectComponent");

}());


//##############################################################################
//
//##############################################################################

/**
 * AppScreen
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables

    AppScreen.prototype.form = null;  //reference to the form that is currently on the screen

    //static variable
    AppScreen.MAIN_MENU = "main_menu";
    AppScreen.EDITOR = "editor";


    //constructor
    function AppScreen(){
        // call constructor of the superclass
        this.Container_constructor();

        this.onHideFormListener = drillEditor.Dispatcher.getInstance().on(drillEditor.ApplicationEvent.HIDE_CURRENT_FORM, hideCurrentFormHandler, this);


    }

    var p = createjs.extend(AppScreen, createjs.Container);

    // public functions
    /**
     * Destroys this instance of AppScreen.
     * All interactivity & other processes should be disabled here
     */
    p.destroy = function () {
        drillEditor.Dispatcher.getInstance().off(drillEditor.ApplicationEvent.HIDE_CURRENT_FORM, this.onHideFormListener);
        this.onHideFormListener=null;
        removeCurrentForm(this);

    };

    AppScreen.prototype.showForm = function (formClass, initParams){
        showForm(this, formClass, initParams);
    };

    AppScreen.prototype.removeForm = function(){
        removeCurrentForm(this);
    };


    //private functions

    function hideCurrentFormHandler(applicationEvent){
        removeCurrentForm(this);
    }

    function removeCurrentForm(thisScope) {
        if(thisScope.form){
            thisScope.form.destroy();
            if(thisScope.contains(thisScope.form)){
                thisScope.removeChild(thisScope.form);
            }
        }
        thisScope.form = null;
    }

    function showForm(scope, formClass, initParams){
        //1. remove an exitsting form if present
        removeCurrentForm(scope);
        //2.create instance of form object
        scope.form = new formClass(initParams);
        //3. add new form to the top of DL
        scope.addChild(scope.form);
    }


    drillEditor.AppScreen = createjs.promote(AppScreen, "Container");

}());


//##############################################################################
//
//##############################################################################

/**
 * Class Editor
 * Created by maxim_000 on 9/14/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
    Editor.prototype.backgroundShape = null;
    Editor.prototype.exitButton = null;
    Editor.prototype.presentation = null;
    Editor.prototype.toolBarBounds = null;
    Editor.prototype.componentsPalleteBounds = null;
    Editor.prototype.pitchBounds = null;
    Editor.prototype.pitchOutline = null;
    Editor.prototype.pitch = null;
    Editor.prototype.toolsPanel = null;
    Editor.prototype.componentsPallete = null;
    Editor.prototype.presentationController = null;
    Editor.prototype.pitchDisplayWidth = 0;
    Editor.prototype.pitchDisplayHeight = 0;


    Editor.UI_CONTROLS_MARGIN = 10;

    //constructor
    function Editor() {
        // call constructor of the superclass
        this.AppScreen_constructor();

        //initialize code
        this.initialize();

    }

    //create inheritance
    var p = createjs.extend(Editor, drillEditor.AppScreen);


    p.initialize = function(){
        this.presentationController = drillEditor.PresentationController.getInstance();

        //create bg
        this.backgroundShape = new createjs.Shape();
        this.backgroundShape.graphics.beginLinearGradientFill(["#1E5799", "#7db9e8"],[0,1],0,0,0,drillEditor.ApplicationModel.APP_HEIGHT).drawRect(0, 0, drillEditor.ApplicationModel.APP_WIDTH, drillEditor.ApplicationModel.APP_HEIGHT);
        this.addChild(this.backgroundShape);

        if(!this.presentationController.componentsPallete){
          //calculate toolbar bounds
          this.presentationController.componentsPalleteBounds = new createjs.Rectangle(drillEditor.ApplicationModel.APP_WIDTH - drillEditor.ComponentsPallete.PANEL_STD_WIDTH - Editor.UI_CONTROLS_MARGIN,
              Editor.UI_CONTROLS_MARGIN,
              drillEditor.ComponentsPallete.PANEL_STD_WIDTH,
              drillEditor.ApplicationModel.APP_HEIGHT - Editor.UI_CONTROLS_MARGIN*2);
          this.presentationController.componentsPallete = new drillEditor.ComponentsPallete(this.presentationController.componentsPalleteBounds.width, this.presentationController.componentsPalleteBounds.height);
          this.presentationController.componentsPallete.x = this.presentationController.componentsPalleteBounds.x;
          this.presentationController.componentsPallete.y = this.presentationController.componentsPalleteBounds.y;
          console.warn("components pallete created");
        }
        this.componentsPallete = this.presentationController.componentsPallete;
        this.addChild(this.componentsPallete);

        if(!this.presentationController.toolsPanel){
              this.presentationController.toolBarBounds = new createjs.Rectangle(Editor.UI_CONTROLS_MARGIN,
              Editor.UI_CONTROLS_MARGIN,
              drillEditor.ApplicationModel.APP_WIDTH - 3*Editor.UI_CONTROLS_MARGIN - drillEditor.ComponentsPallete.PANEL_STD_WIDTH,
              drillEditor.ToolsPanel.PANEL_STD_HEIGHT);

              this.presentationController.toolsPanel = new drillEditor.ToolsPanel(this.presentationController.toolBarBounds.width, this.presentationController.toolBarBounds.height);
              this.presentationController.toolsPanel.x = this.presentationController.toolBarBounds.x;
              this.presentationController.toolsPanel.y = this.presentationController.toolBarBounds.y;
              console.warn("tools panel created");
        }
        this.toolsPanel = this.presentationController.toolsPanel;
        this.addChild(this.toolsPanel);

        //calculate size of pitch viewport area
        this.pitchViewportBounds = new createjs.Rectangle(Editor.UI_CONTROLS_MARGIN,
            this.presentationController.toolBarBounds.y + this.presentationController.toolBarBounds.height + Editor.UI_CONTROLS_MARGIN,
            drillEditor.ApplicationModel.APP_WIDTH - 3*Editor.UI_CONTROLS_MARGIN - drillEditor.ComponentsPallete.PANEL_STD_WIDTH,
            drillEditor.ApplicationModel.APP_HEIGHT - 3*Editor.UI_CONTROLS_MARGIN - drillEditor.ToolsPanel.PANEL_STD_HEIGHT);

        this.pitch = new drillEditor.Pitch();
        this.addChild(this.pitch);

        drillEditor.PresentationController.getInstance().setView(this.pitch);

        //draw pitch outline
        this.pitchOutline = new createjs.Shape();
        this.pitchOutline.graphics.clear();
        this.pitchOutline.graphics.setStrokeStyle(1);
        this.pitchOutline.graphics.beginStroke("#FFFFFF").drawRect(0, 0, this.pitchViewportBounds.width, this.pitchViewportBounds.height);
        this.pitchOutline.x = this.pitchViewportBounds.x;
        this.pitchOutline.y = this.pitchViewportBounds.y;
        this.pitchOutline.visible = false;
        this.addChild(this.pitchOutline);



        if(!this.presentationController.presentation.pitchWidth || !this.presentationController.presentation.pitchHeight){
            this.showForm(drillEditor.PitchSizeInputFormHTML,{
                positiveCallback:this.sizeInputPositiveCallback,
                negativeCallback:this.sizeInputNegativeCallback,
                callbackScope: this
            });
        } else {
            //visualize presentation data
            this.createPitchView();
        }

    };

    //called when user hits proceed button on size input form
    p.sizeInputPositiveCallback = function(w,h){
        this.removeForm();
        this.presentationController.presentation.pitchWidth =  w;
        this.presentationController.presentation.pitchHeight = h;
        this.createPitchView();
    };

    p.sizeInputNegativeCallback = function(){
        //this.removeForm();
        //drillEditor.drillEditorApplication.showAppScreen(drillEditor.AppScreen.MAIN_MENU);
        drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.SHOW_SCREEN,{screenId:drillEditor.AppScreen.MAIN_MENU}));
    };

    p.createPitchView = function(){

        var ratio = this.presentationController.presentation.pitchWidth / this.presentationController.presentation.pitchHeight;

        if(this.presentationController.presentation.pitchWidth > this.presentationController.presentation.pitchHeight){
            this.pitchDisplayWidth = this.pitchViewportBounds.width;
            this.pitchDisplayHeight =  this.pitchDisplayWidth / ratio;
        } else {
            this.pitchDisplayHeight = this.pitchViewportBounds.height;
            this.pitchDisplayWidth = ratio * this.pitchDisplayHeight;
        }

        if(this.pitchDisplayHeight > this.pitchViewportBounds.height){
            var prevH = this.pitchDisplayHeight;
            this.pitchDisplayHeight = this.pitchViewportBounds.height;
            this.pitchDisplayWidth = this.pitchDisplayHeight * (this.pitchDisplayWidth/prevH);
        } else if(this.pitchDisplayWidth > this.pitchViewportBounds.width){
            var prevW = this.pitchDisplayWidth;
            this.pitchDisplayWidth = this.pitchViewportBounds.width;
            this.pitchDisplayHeight = this.pitchDisplayWidth/(prevW/this.pitchDisplayHeight)
        }

        drillEditor.ApplicationModel.getInstance().mpp = this.presentationController.presentation.pitchWidth/this.pitchDisplayWidth;

        this.pitch.setSize(this.pitchDisplayWidth, this.pitchDisplayHeight);

        this.pitch.x = this.pitchViewportBounds.x + this.pitchViewportBounds.width/2 - this.pitchDisplayWidth/2;
        this.pitch.y = this.pitchViewportBounds.y + this.pitchViewportBounds.height/2 - this.pitchDisplayHeight/2;

        console.warn("pitch size ratio = " + Number(this.pitchDisplayWidth/this.pitchDisplayHeight).toFixed(4));

        drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.PITCH_VIEW_CREATED));


    };

    p.destroy = function(){
        this.AppScreen_destroy();

        //remove components pallete and tools panel from screen
        if(this.contains(this.componentsPallete)){
          this.removeChild(this.componentsPallete);
          console.log("components pallete removed from screen");
        }

        if(this.contains(this.toolsPanel)){
          this.removeChild(this.toolsPanel);
          console.log("tools panel removed from screen");
        }

        //TODO: destroy drillEditor.Pitch instance

        console.log("Editor destroyed");
    };



    drillEditor.Editor = createjs.promote(Editor, "AppScreen");

}());



//##############################################################################
//
//##############################################################################

/**
 * MainMenuScreen
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";

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

        this.constructScreenUI();
    }

    //create inheritance
    var p = createjs.extend(MainMenuScreen, drillEditor.AppScreen);

    p.constructScreenUI = function(){

        //display background
        this.backgroundImage = new createjs.Bitmap(drillEditor.DrillEditorApplication.loadQueue.getResult("main-menu-background"));
        this.addChild(this.backgroundImage);

        //create header text
        this.topText = new createjs.Text("A place for app or corporate logo","35px Arial","#FFFFFF");
        this.topText.x = drillEditor.ApplicationModel.APP_WIDTH/2 - this.topText.getBounds().width/2;
        this.topText.y = 10;
        this.addChild(this.topText);

        this.mainMenuText = new createjs.Text("Main menu","30px Arial","#FFFFFF");
        this.mainMenuText.x = drillEditor.ApplicationModel.APP_WIDTH/2 - this.mainMenuText.getBounds().width/2;
        this.mainMenuText.y = 260 - 50;
        this.addChild(this.mainMenuText);

        this.copyrighAndVersionText = new createjs.Text("Copyright information. Version " + drillEditor.ApplicationModel.VERSION,"14px Arial","#FFFFFF");
        this.copyrighAndVersionText.x = drillEditor.ApplicationModel.APP_WIDTH - this.copyrighAndVersionText.getBounds().width - 10;
        this.copyrighAndVersionText.y = drillEditor.ApplicationModel.APP_HEIGHT - 30;
        this.addChild(this.copyrighAndVersionText);

        //display menu buttons
        this.newDrillButton = new drillEditor.SimpleTextButton("New drill","25px Arial", "#000000", "#FFFFFF","#999999","#0000FF", 150, 45);
        this.newDrillButton.x = drillEditor.ApplicationModel.APP_WIDTH/2 - 150/2;
        this.newDrillButton.y = 260;
        this.newDrillButton.addEventListener("click", newDrillClickHandler);
        this.addChild(this.newDrillButton);

        this.loadDrillButton = new drillEditor.SimpleTextButton("Load drill","25px Arial", "#000000", "#FFFFFF","#999999","#0000FF", 150, 45);
        this.loadDrillButton.x = drillEditor.ApplicationModel.APP_WIDTH/2 - 150/2;
        this.loadDrillButton.y = this.newDrillButton.y + 60;
        this.loadDrillClickHandler = this.loadDrillButton.on("click", loadDrillClickHandler, this);
        this.addChild(this.loadDrillButton);

    };

    /**************************************** event handlers **********************************************/

    function newDrillClickHandler(evt){
        drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.NEW_DRILL_BUTTON_CLICK));
    }

    function loadDrillClickHandler(){
        drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.MAIN_MENU_LOAD_DRILL_CLICK));

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
        this.loadDrillButton.off("click", this.loadDrillClickHandler);
        this.loadDrillButton.destroy();

        console.log("MainMenuScreen.destroy()");
    };


    drillEditor.MainMenuScreen = createjs.promote(MainMenuScreen, "AppScreen");

}());


//##############################################################################
//
//##############################################################################

/**
 * Class drillEditor.LineTransformTool
 * Created by maxim_000 on 10/6/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/
    LineTransformTool.prototype.startPointHandler = null;
    LineTransformTool.prototype.endPointHandler = null;
    LineTransformTool.prototype.angle = null;

    /******************* static variables *******************/
    //LineTransformTool.staticVar = "value";

    /********************** constructor *********************/
    function LineTransformTool() {
        //invoke constructor of superclass
        this.Container_constructor();
        initialize.call(this);
    }

    //extend this class from a superclass
    var p = createjs.extend(LineTransformTool, createjs.Container);

    p.setPoints = function (startPoint, endPoint) {
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        redraw.call();
    };

    /******************** private methods *******************/
    function initialize(){
        this.startPointHandler = new createjs.Shape();
        this.startPointHandler.graphics.beginFill("#FF0000").drawRect(-8,-8,16, 16);
        this.startPointHandler.visible = false;
        this.addChild(this.startPointHandler);

        this.endPointHandler = new createjs.Shape();
        this.endPointHandler.graphics.beginFill("#FF0000").drawRect(-8,-8,16, 16);
        this.endPointHandler.visible = false;
        this.addChild(this.endPointHandler);
    }

    function redraw() {
        this.angle = drillEditor.MathUtils.getAngleBetween2Points(this.startPoint, this.endPoint);
        this.startPointHandler.rotation = this.angle;
        this.endPointHandler.rotation = this.angle;
    }

    /******************** event handlers ********************/


    /******************* public static method ***************/
    //LineTransformTool.staticFunctionName = function(param1){ //method body };

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.LineTransformTool = createjs.promote(LineTransformTool,"Container");


}());


//##############################################################################
//
//##############################################################################

/**
 * ClassRotationTool
 * Created by maxim_000 on 9/30/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
   RotationTool.prototype.radiusX;
   RotationTool.prototype.radiusY;
   RotationTool.prototype.handler;
   RotationTool.prototype.direction;
   RotationTool.prototype.mouseAngle;
   RotationTool.prototype.handlerWidth;
   RotationTool.prototype.angle = 0;
   RotationTool.prototype.controlLine;

    //static variable
    //drillEditor.RotationTool.staticVar = "value";

    //constructor
    function RotationTool(radiusX, radiusY, handler, startAngle) {
        //invoke constructor of superclass
        this.Container_constructor();

        // draw red control line from the center of the handler to the outline of the selected item
        this.controlLine = new createjs.Shape();
        this.controlLine.graphics.setStrokeStyle(2);
        this.controlLine.graphics.beginStroke("#FF0000");
        this.controlLine.graphics.moveTo(-26,0);
        this.controlLine.graphics.lineTo(0,0);

        //add handler
        this.handler = handler;
        this.handlerWidth = this.handler.getBounds().width;
        this.addChild(this.handler);
        this.handler.addChildAt(this.controlLine, 0);

        this.setHandlerListeners();
        this.angle = startAngle;

        if(radiusX && radiusY){
            this.setRadius(radiusX, radiusY);
            this.updatePositionFromDegree(this.angle);
        }

    }

    //extend this class from a superclass
    var p = createjs.extend(RotationTool, createjs.Container);

    p.setRadius = function(radiusX, radiusY){
        this.radiusX = radiusX;
        this.radiusY = radiusY;

        var handlerPos = this.getSectorPoint(this.angle, this.radiusX + this.handlerWidth/2, this.radiusY+ this.handlerWidth/2);
        this.handler.x = handlerPos.x;
        this.handler.y = handlerPos.y;



        //this.updatePosition();
    };

    p.updatePosition = function(){

        var localMousePosition = this.globalToLocal(window.stage.mouseX, window.stage.mouseY);
        var mouseX = localMousePosition.x;
        var mouseY = localMousePosition.y;

        var prevMouseAngle = this.mouseAngle;
        this.mouseAngle = (Math.atan2(mouseY, mouseX)/ Math.PI) * 180;
        this.updatePositionFromDegree(this.mouseAngle);
        this.dispatchEvent(new Event("change"));

    };

    p.updatePositionFromDegree = function(value){

        this.angle = value;
        var handlerPosition = this.getSectorPoint(this.angle,
                                                this.radiusX + this.handlerWidth/2,
                                                this.radiusY + this.handlerWidth/2);
        this.handler.x = handlerPosition.x;
        this.handler.y = handlerPosition.y;
        this.handler.rotation = this.angle;
    };

    p.getSectorPoint = function(degree, radiusX, radiusY){
        var x = radiusX * Math.cos(degree * Math.PI / 180);
        var y = radiusY * Math.sin(degree * Math.PI / 180);
        var result = new createjs.Point(x,y);
        return result;
    };



    p.setHandlerListeners = function(){
        /*this.handler.on("mousedown",function(evt){

        },this);*/

        /*this.handler.on("pressup", function(evt){

        });*/

        this.handler.on("pressmove", function(evt){
            this.updatePosition();
        },this);
    };

    // public functions
    //drillEditor.RotationTool.prototype.publicFunction = function (param1) { };

    //private functions
    //function privateFunction(param) { }

    //public static method
    //drillEditor.RotationTool.staticFunctionName = function(param1){ //method body };

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.RotationTool = createjs.promote(RotationTool,"Container");


}());


//##############################################################################
//
//##############################################################################

/**
 * Class drillEditor.TransformTool
 * Created by maxim_000 on 9/23/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
    TransformTool.prototype.target;
    TransformTool.prototype.outline;
    TransformTool.prototype.scaleControl;
    TransformTool.prototype.rotationControl;
    TransformTool.prototype.rotationTool;
    TransformTool.prototype.scalePropotionally;
    TransformTool.prototype.lineDragControl1;
    TransformTool.prototype.lineDragControl2;

    //static variable
    TransformTool.OUTLINE_STROKE_SIZE = 2;
    TransformTool.OUTLINE_STROKE_COLOR = "#FF0000";
    //TransformTool.SCALE_CONTROL_SIZE = 20;
    TransformTool.SCALE_CONTROL_SIZE = 16;
    TransformTool.LINE_CONTROL_SIZE = 18;

    //constructor
    function TransformTool() {
        //invoke constructor of superclass
        this.Container_constructor();
        this.initialize();
    }

    //extend this class from a superclass
    var p = createjs.extend(TransformTool,createjs.Container);


    p.initialize = function(){
        this.outline = new createjs.Shape();
        this.addChild(this.outline);

        //this.rotationControl = new createjs.Shape();
        var rotationIcon = new createjs.Bitmap(drillEditor.DrillEditorApplication.loadQueue.getResult("rotation-icon"));
        rotationIcon.x = -16;
        rotationIcon.y = -16;

        this.rotationControl = new createjs.Container();
        this.rotationControl.addChild(rotationIcon);
        this.rotationControl.setBounds(-16,-16,32,32);
        this.rotationControl.cursor = "pointer";
        this.rotationControl.snapToPixel = true;

        this.rotationTool = new drillEditor.RotationTool(0,0, this.rotationControl,0);
        this.rotationTool.visible = false;
        this.rotationTool.on("change",rotationChangeHandler, this);
        this.addChild(this.rotationTool);


        this.scaleControl = new createjs.Shape();
        this.scaleControl.graphics.beginFill("rgba(255,0,0,0.5)");
        this.scaleControl.graphics.drawRect(0, 0, TransformTool.SCALE_CONTROL_SIZE, TransformTool.SCALE_CONTROL_SIZE);
        this.scaleControl.on("mousedown", function (evt){
            this.scaleControlOffsetX = evt.localX;
            this.scaleControlOffsetY = evt.localY;
        }, this);

        this.scaleControl.pressMoveHandler = this.scaleControl.on("pressmove", function(evt){
            this.scaleControl.visible = true;

            var targetBounds = this.target.getContentBounds();

            var pointOnTool = this.globalToLocal(evt.stageX, evt.stageY);
            var minAllowedSize = this.target.getMinimalSize();
            var newW = pointOnTool.x - this.scaleControlOffsetX + TransformTool.SCALE_CONTROL_SIZE/2 - targetBounds.x;
            var newH = pointOnTool.y - targetBounds.y - this.scaleControlOffsetY + TransformTool.SCALE_CONTROL_SIZE / 2;

            //w=h if its a square
            if(this.scalePropotionally){
                newW = Math.min(newW, newH);
                newH = newW;
            }

            //prevent going under min size
            if(newW < minAllowedSize.x){
                newW =  minAllowedSize.x;
            }

            if(newH < minAllowedSize.y){
                newH = minAllowedSize.y;
            }

            this.target.rendererData.resize(newW, newH);
            this.redraw();
            //console.log("Stage point=",evt.stageX, evt.stageY,"Tool point=",pointOnTool.x, pointOnTool.y);
        },this);

        this.scaleControl.visible = false;
        this.addChild(this.scaleControl);

        this.lineDragControl1 = new createjs.Shape();
        this.lineDragControl1.graphics.beginFill("rgba(255,0,0,0.5)").drawCircle(0, 0, TransformTool.LINE_CONTROL_SIZE/2, TransformTool.LINE_CONTROL_SIZE/2);
        this.lineDragControl1.visible = false;

        this.lineDragControl1.on("mousedown", function(evt){
            this.lineDragOffsetX = evt.localX;
            this.lineDragOffsetY = evt.localY;
        }, this);

        this.lineDragControl1.on("pressmove", function(evt){
            var startPointOffsetX = TransformTool.LINE_CONTROL_SIZE - this.lineDragOffsetX;
            var startPointOffsetY = TransformTool.LINE_CONTROL_SIZE / 2 - this.lineDragOffsetY;
            var pointOnTool = this.globalToLocal(evt.stageX, evt.stageY);
            var newStartPoint = new createjs.Point(pointOnTool.x - this.lineDragOffsetX, pointOnTool.y - this.lineDragOffsetY);
            this.target.rendererData.setStartPoint(newStartPoint);
            this.redraw();

        }, this);

        this.addChild(this.lineDragControl1);

        this.lineDragControl2 = new createjs.Shape();
        this.lineDragControl2.graphics.beginFill("rgba(255,0,0,0.5)").drawCircle(0, 0, TransformTool.LINE_CONTROL_SIZE/2, TransformTool.LINE_CONTROL_SIZE/2);
        this.lineDragControl2.visible = false;
        this.addChild(this.lineDragControl2);

        this.lineDragControl2.on("mousedown", function (evt) {
            this.lineDragOffsetX = evt.localX;
            this.lineDragOffsetY = evt.localY;
        }, this);

        this.lineDragControl2.on("pressmove", function(evt){
            var pointOnTool = this.globalToLocal(evt.stageX, evt.stageY);
            var newEndPoint = new createjs.Point(pointOnTool.x - this.lineDragOffsetX, pointOnTool.y - this.lineDragOffsetY);
            this.target.rendererData.setEndPoint(newEndPoint);
            this.redraw();
        }, this);


        drillEditor.Dispatcher.getInstance().on(drillEditor.ApplicationEvent.ELEMENT_SELECTED, elementSelectedHandler, this);

    };

    p.setTarget = function(newTarget){
        if(this.target == newTarget) {
            return;
        }

        if(this.target){
            this.removeTarget();
        }

        this.target = newTarget;

        if(this.target){

            switch (this.target.rendererData.type){

                case drillEditor.GraphicElementType.RECTANGLE:
                    this.scaleControl.visible = true;
                    break;

                case drillEditor.GraphicElementType.SQUARE:
                    this.scaleControl.visible = true;
                    this.scalePropotionally = true;
                    break;

                case drillEditor.GraphicElementType.ARCUATE_MOVEMENT:
                case drillEditor.GraphicElementType.GOAL:
                    this.rotationTool.visible = true;

                    break;

                case drillEditor.GraphicElementType.DRIBBLING_PLAYER:
                case drillEditor.GraphicElementType.PLAYER_MOVEMENT:
                case drillEditor.GraphicElementType.BALL_MOVEMENT:
                    this.lineDragControl1.visible = true;
                    this.lineDragControl2.visible = true;
                    break;

                default:
                    //this.rotationTool.visible = true;
                    break;
            }

            this.elementMoveHandler = this.target.on(drillEditor.ApplicationEvent.ELEMENT_MOVE, this.redraw, this);
            this.elementRotateHandler = this.target.rendererData.on(drillEditor.ApplicationEvent.ELEMENT_ROTATION_CHANGED, elementRotationChangedHandler, this);
            this.redraw();
        }
    };

    p.removeTarget = function(){
        this.target.off(drillEditor.ApplicationEvent.ELEMENT_MOVE, this.elementMoveHandler);
        //clear controls
        this.outline.graphics.clear();
        this.scaleControl.visible = false;
        this.scalePropotionally = false;
        this.rotationTool.visible = false;
        this.lineDragControl1.visible = false;
        this.lineDragControl2.visible = false;
    };

    p.redraw = function(){

        var localBounds = this.target.getContentBounds();
        var targetData = this.target.rendererData;

        drillEditor.DrawingUtils.drawStrictSizeRectangle(this.outline.graphics,
            -TransformTool.OUTLINE_STROKE_SIZE,
            -TransformTool.OUTLINE_STROKE_SIZE,
            TransformTool.OUTLINE_STROKE_SIZE*2 + localBounds.width,
            TransformTool.OUTLINE_STROKE_SIZE*2 + localBounds.height,
            TransformTool.OUTLINE_STROKE_SIZE,
            TransformTool.OUTLINE_STROKE_COLOR);


        if(this.target.isInteractiveLine){
            var outlinePosition = this.target.contentRegPoint == "endPoint" ? this.target.rendererData.endPoint : this.target.rendererData.startPoint;
            this.outline.x = outlinePosition.x;
            this.outline.y = outlinePosition.y;
            this.outline.regY = localBounds.height/2;
            this.outline.regX = this.target.contentRegPoint == "endPoint" ? this.target.rendererData.lineWidth : 0;
            this.outline.rotation = this.target.rendererData.angle;
        } else {
            this.outline.x = localBounds.x + localBounds.width/2;
            this.outline.y = localBounds.y + localBounds.height/2;
            this.outline.regX = localBounds.width/2;
            this.outline.regY = localBounds.height/2;
            this.outline.rotation = this.target.rendererData.rotation;

        }

        if(this.scaleControl.visible){
            this.scaleControl.x = localBounds.x + localBounds.width + TransformTool.OUTLINE_STROKE_SIZE - 20/2 - 1;
            this.scaleControl.y = localBounds.y + localBounds.height + TransformTool.OUTLINE_STROKE_SIZE - 20/2 - 1;
        }

        if(this.lineDragControl1.visible){
            var extremePoints = this.target.getPointsInStageCS();
            var startPointLocal = this.globalToLocal(extremePoints.startPoint.x, extremePoints.startPoint.y);
            var endPointLocal = this.globalToLocal(extremePoints.endPoint.x, extremePoints.endPoint.y);

            this.lineDragControl1.x = startPointLocal.x;
            this.lineDragControl1.y = startPointLocal.y;

            this.lineDragControl2.x = endPointLocal.x;
            this.lineDragControl2.y = endPointLocal.y;
        }

        if(this.rotationTool.visible){
            this.rotationTool.x = this.target.x;
            this.rotationTool.y = this.target.y;
            this.rotationTool.setRadius(localBounds.width/2 + 10, localBounds.width/2 + 10);
            //read target's rotation and pass it to the rotationTool
            var itemRotation = this.target.rendererData.rotation;
            this.rotationTool.updatePositionFromDegree(itemRotation);
        }
    };

    /*************************************************** event handlers **********************************************/
    function rotationChangeHandler(event){
        this.target.container.rotation = this.rotationTool.angle;
        this.target.rendererData.setRotation(this.rotationTool.angle, true);

       // console.log("rotating component to: " + this.rotationTool.angle);
    }

    function elementRotationChangedHandler(event){
        this.outline.rotation = this.target.rendererData.rotation;
    }

    function elementSelectedHandler(event){
       this.setTarget(event.payload.data);
    }


    drillEditor.TransformTool = createjs.promote(TransformTool,"Container");

}());


//##############################################################################
//
//##############################################################################

/**
 * Class drillEditor.ComponentsPallete
 * Created by maxim_000 on 9/18/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";


    //static variable
    ComponentsPallete.BACKGROUND_COLOR = "#dddddd";
    ComponentsPallete.PANEL_STD_WIDTH = 115;

    //constructor
    function ComponentsPallete(width, height) {
        this.panelWidth = width;
        this.panelHeight = height;

        this.Container_constructor();

        this.initialize();
    }

    //extend this class from a superclass
    var p = createjs.extend(ComponentsPallete,createjs.Container);

    p.initialize = function(){
        this.dispatcher = drillEditor.Dispatcher.getInstance();

        this.background = new createjs.Shape();
        this.background.graphics.beginFill(ComponentsPallete.BACKGROUND_COLOR).drawRect(0, 0, this.panelWidth, this.panelHeight);
        this.addChild(this.background);


        this.rectButton = new drillEditor.SimpleTextButton("Rectangle", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.rectButton.x = 5;
        this.rectButton.y = 5;
        this.rectButton.on("click", rectButtonClickHandler, this);
        this.addChild(this.rectButton);

        this.boxButton = new drillEditor.SimpleTextButton("Square", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.boxButton.x = 5;
        this.boxButton.y = this.rectButton.y + this.rectButton.getBounds().height + 5;
        this.boxButton.on("click", boxButtonClickHandler, this);
        this.addChild(this.boxButton);

        this.attackerButton = new drillEditor.SimpleTextButton("Attacker", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.attackerButton.x = 5;
        this.attackerButton.y = this.boxButton.y + this.boxButton.getBounds().height + 5;
        this.attackerButton.on("click", attackerButtonClickHandler, this);
        this.addChild(this.attackerButton);

        this.defenderButton = new drillEditor.SimpleTextButton("Defender", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.defenderButton.x = 5;
        this.defenderButton.y = this.attackerButton.y + this.attackerButton.getBounds().height + 5;
        this.defenderButton.on("click", defenderButtonClickHandler, this);
        this.addChild(this.defenderButton);

        this.extraTeamButton = new drillEditor.SimpleTextButton("Extra", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.extraTeamButton.x = 5;
        this.extraTeamButton.y = this.defenderButton.y + this.defenderButton.getBounds().height + 5;
        this.extraTeamButton.on("click", extraTeamButtonClickHandler, this);
        this.addChild(this.extraTeamButton);

        this.neutralPlayerButton = new drillEditor.SimpleTextButton("Neutral", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.neutralPlayerButton.x = 5;
        this.neutralPlayerButton.y = this.extraTeamButton.y + this.extraTeamButton.getBounds().height + 5;
        this.neutralPlayerButton.on("click", neutralButtonClickHandler, this);
        this.addChild(this.neutralPlayerButton);

        this.coneButton = new drillEditor.SimpleTextButton("Cone", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.coneButton.x = 5;
        this.coneButton.y = this.neutralPlayerButton.y + this.neutralPlayerButton.getBounds().height + 5;
        this.coneButton.on("click", coneButtonClickHandler, this);
        this.addChild(this.coneButton);
        
        this.arcButton = new drillEditor.SimpleTextButton("Arcuate mvm", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.arcButton.x = 5;
        this.arcButton.y = this.coneButton.y + this.coneButton.getBounds().height + 5;
        this.arcButton.on("click", arcButtonClickHandler,this);
        this.addChild(this.arcButton);

        this.dribblingButton = new drillEditor.SimpleTextButton("Dribbling", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.dribblingButton.x = 5;
        this.dribblingButton.y = this.arcButton.y + this.arcButton.getBounds().height + 5;
        this.dribblingButton.on("click", dribblingButtonClickHandler,this);
        this.addChild(this.dribblingButton);

        this.playerMvmButton = new drillEditor.SimpleTextButton("Player path", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.playerMvmButton.x = 5;
        this.playerMvmButton.y = this.dribblingButton.y + this.playerMvmButton.getBounds().height + 5;
        this.playerMvmButton.on("click", playerMovementButtonClick, this);
        this.addChild(this.playerMvmButton);

        this.ballMvmButton = new drillEditor.SimpleTextButton("Ball path", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.ballMvmButton.x = 5;
        this.ballMvmButton.y = this.playerMvmButton.y + this.ballMvmButton.getBounds().height + 5;
        this.ballMvmButton.on("click", ballMovementButtonClick, this);
        this.addChild(this.ballMvmButton);

        this.ballButton = new drillEditor.SimpleTextButton("Ball", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.ballButton.x = 5;
        this.ballButton.y = this.ballMvmButton.y + this.ballButton.getBounds().height + 5;
        this.ballButton.on("click", ballButtonClick, this);
        this.addChild(this.ballButton);

        this.ballSupplyButton = new drillEditor.SimpleTextButton("Ball supply", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.ballSupplyButton.x = 5;
        this.ballSupplyButton.y = this.ballButton.y + this.ballSupplyButton.getBounds().height + 5;
        this.ballSupplyButton.on("click", ballSupplyButtonClick, this);
        this.addChild(this.ballSupplyButton);

        this.goalButton = new drillEditor.SimpleTextButton("Goal", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.goalButton.x = 5;
        this.goalButton.y = this.ballSupplyButton.y + this.ballSupplyButton.getBounds().height + 5;
        this.goalButton.on("click", goalButtonClick, this);
        this.addChild(this.goalButton);

    };


    function goalButtonClick(event){
        this.dispatcher.dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.CREATE_GOAL_CLICK));
    }

    function rectButtonClickHandler(evt){
        this.dispatcher.dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.CREATE_RECTANGLE_CLICK));
    }

    function boxButtonClickHandler(evt){
        this.dispatcher.dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.CREATE_SQUARE_CLICK));
    }

    function attackerButtonClickHandler(evt){
        this.dispatcher.dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.CREATE_ATTACKER_CLICK));
    }

    function defenderButtonClickHandler(evt){
        this.dispatcher.dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.CREATE_DEFENDER_CLICK));
    }

    function extraTeamButtonClickHandler(evt){
        this.dispatcher.dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.CREATE_EXTRA_TEAM_CLICK));
    }

    function neutralButtonClickHandler(evt) {
        this.dispatcher.dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.CREATE_NEUTRAL_PLAYER_CLICK));
    }

    function coneButtonClickHandler(evt){
        this.dispatcher.dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.CREATE_CONE_CLICK));
    }
    
    function arcButtonClickHandler(evt){
        this.dispatcher.dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.CREATE_ARC_CLICK));
    }

    function dribblingButtonClickHandler(evt){
       this.dispatcher.dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.CREATE_DRIBBLING_CLICK));
    }

    function playerMovementButtonClick(evt){
        this.dispatcher.dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.CREATE_PLAYER_PATH_CLICK));
    }

    function ballMovementButtonClick(evt){
        this.dispatcher.dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.CREATE_BALL_PATH_CLICK));
    }

    function ballButtonClick(evt){
        this.dispatcher.dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.CREATE_BALL_CLICK));
    }

    function ballSupplyButtonClick(evt){
        this.dispatcher.dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.CREATE_BALLS_SUPPLY_CLICK));
    }

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.ComponentsPallete = createjs.promote(ComponentsPallete,"Container");


}());


//##############################################################################
//
//##############################################################################

this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";

    SimpleTextButton.DEFAULT_FONT = "20px Arial";
    SimpleTextButton.DEFAULT_TEXT_COLOR = "#000000";
    SimpleTextButton.prototype.buttonWidth = null;
    SimpleTextButton.prototype.buttonHeight = null;
    SimpleTextButton.prototype.background = null;
    SimpleTextButton.prototype.text = null;

    /**
     * Creates a simple text button
     * @param label
     * @param labelFont
     * @param labelColor
     * @param upColor
     * @param downColor
     * @param overColor
     * @param buttonWidth
     * @param buttonHeight
     * @constructor
     */
    function SimpleTextButton(label, labelFont, labelColor, upColor, downColor, overColor, buttonWidth, buttonHeight) {
        this.Container_constructor();
        this.label = label;
        this.labelFont = labelFont ? labelFont : SimpleTextButton.DEFAULT_FONT;
        this.labelColor = labelColor ? labelColor : SimpleTextButton.DEFAULT_TEXT_COLOR;
        this.upColor = upColor;
        this.downColor = downColor;
        this.overColor = overColor;
        this.buttonWidth = buttonWidth ? buttonWidth : null;
        this.buttonHeight = buttonHeight ? buttonHeight : null;
        this.applicationModel = drillEditor.ApplicationModel.getInstance();
        this.setup();
    }
    var p = createjs.extend(SimpleTextButton, createjs.Container);

    p.setup = function() {
        this.text = new createjs.Text(this.label, this.labelFont, this.labelColor);
        this.text.textBaseline = "top";
        this.text.textAlign = "center";

        if(this.buttonWidth == null || this.buttonWidth == undefined){
            this.buttonWidth = this.text.getMeasuredWidth() + 30;
        }


        this.buttonHeight = this.buttonHeight ? this.buttonHeight : this.text.getMeasuredHeight() + 20;

        this.text.x = this.buttonWidth/2;
        this.text.y = 10;

        this.background = new createjs.Shape();
        this.background.graphics.beginFill(this.upColor).drawRoundRect(0, 0, this.buttonWidth, this.buttonHeight, 10);

        this.addChild(this.background, this.text);

        this.on("mousedown", this.handleMouseDown);
        this.on("pressup", this.handlePressUp);

        this.on("click", this.handleClick);


        this.cursor = "pointer";

        this.mouseChildren = false;

        this.offset = Math.random()*10;
        this.count = 0;
        this.setBounds(0,0,this.buttonWidth, this.buttonHeight);
    } ;

    p.handleMouseDown = function(event){
        this.setState("down");
        //this.stage.addEventListener("stagemouseup", this.stageMouseUpHandler);
        /*this.background.graphics.clear();
        this.background.graphics.beginFill(this.downColor).drawRoundRect(0,0,this.buttonWidth,this.buttonHeight,10);*/
    };



    p.handlePressUp = function(event){
        this.setState("up");
        /*this.background.graphics.clear();
        this.background.graphics.beginFill(this.upColor).drawRoundRect(0,0,this.buttonWidth,this.buttonHeight,10);*/
    };

    p.handleClick = function (event) {
       // this.setState("up");
       // alert("You clicked on a button: "+this.label);
        /*this.background.graphics.clear();
        this.background.graphics.beginFill(this.upColor).drawRoundRect(0,0,this.buttonWidth, this.buttonHeight,10);*/
    } ;



    p.handleRollOver = function(event) {
        //TODO: redraw rect with over color
        //this.alpha = event.type == "rollover" ? 0.6 : 1;

        /*this.background.graphics.clear();
        this.background.graphics.beginFill(this.overColor).drawRoundRect(0,0,this.buttonWidth, this.buttonHeight,10);*/
    };

    p.handleRollOut = function(event){
        /*this.background.graphics.clear();
        this.background.graphics.beginFill(this.upColor).drawRoundRect(0,0,this.buttonWidth, this.buttonHeight,10);*/
    };

    SimpleTextButton.prototype.setState = function(newState){
        //console.log("button went to state:" + newState);
        var bgColor;
          switch (newState){
              case "down":
                    bgColor = this.downColor;
                  break;

              case "up":
                  bgColor = this.upColor;
                  break;
          }

        if(bgColor){
            this.background.graphics.clear();
            this.background.graphics.beginFill(bgColor).drawRoundRect(0,0,this.buttonWidth,this.buttonHeight,10);
        }
    };

    SimpleTextButton.prototype.destroy = function(){
        this.removeAllEventListeners();
    };

    SimpleTextButton.prototype.clickHandler = function(evt){

    };

    drillEditor.SimpleTextButton = createjs.promote(SimpleTextButton, "Container");
}());


//##############################################################################
//
//##############################################################################

/**
 * Class drillEditor.ToolsPanel
 * Created by maxim_000 on 9/17/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
    ToolsPanel.prototype.background = null;
    ToolsPanel.prototype.componentWidth = null;
    ToolsPanel.prototype.componentHeight = null;
    ToolsPanel.prototype.backButton = null;
    ToolsPanel.prototype.saveButton = null;
    ToolsPanel.prototype.dynamicButtons = null;
    ToolsPanel.prototype.dynamicButtonsInitX = null;

    //static variable
    ToolsPanel.PANEL_STD_HEIGHT = 50;
    ToolsPanel.BUTTON_INTERVAL = 10;


    //constructor
    function ToolsPanel(width, height) {
        this.Container_constructor();
        this.componentWidth = width;
        this.componentHeight = height;

        this.applicationModel = drillEditor.ApplicationModel.getInstance();
        this.initialize();
    }

    var p = createjs.extend(ToolsPanel, createjs.Container);

    p.initialize = function(){
        this.background = new createjs.Shape();
        this.background.graphics.beginFill("#dddddd").drawRect(0, 0, this.componentWidth, this.componentHeight);
        this.addChild(this.background);

        //init dynamic buttons array
        this.dynamicButtons = [];

        if(this.applicationModel.appMode == drillEditor.ApplicationModel.NEW_DRILL_APP_MODE){
            this.backButton = new drillEditor.SimpleTextButton("Back", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 50, 36);
            this.backButton.setBounds(0, 0, 50, 20);
            this.backButton.x = ToolsPanel.BUTTON_INTERVAL;
            this.backButton.y = 5;
            this.backButton.on("click",backClickListener,this);
            this.addChild(this.backButton);
            this.dynamicButtonsInitX = this.backButton.x + this.backButton.getBounds().width + ToolsPanel.BUTTON_INTERVAL;
        } else{
            this.dynamicButtonsInitX = ToolsPanel.BUTTON_INTERVAL;
        }



        this.swapDirectionsButton = new drillEditor.SimpleTextButton("Swap directions","16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 140, 36);
        this.swapDirectionsButton.setBounds(0,0,140,20);
        this.swapDirectionsButton.y = 5;
        this.swapDirectionsButton.on("click", swapDirectionsButtonClickHandler, this);

        this.copyButton = new drillEditor.SimpleTextButton("Copy","16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 60, 36);
        this.copyButton.setBounds(0,0,60,20);
        this.copyButton.y = 5;
        this.copyButton.on("click", copyButtonClickListener, this);

        this.deleteButton = new drillEditor.SimpleTextButton("Delete","16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 60, 36);
        this.deleteButton.setBounds(0,0,60,20);
        this.deleteButton.y = 5;
        this.deleteButton.on("click", deleteButtonClickListener, this);

        this.pasteButton = new drillEditor.SimpleTextButton("Paste","16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 60, 36);
        this.pasteButton.setBounds(0,0,60,20);
        this.pasteButton.y = 5;
        this.pasteButton.on("click", pasteButtonClickListener, this);

        drillEditor.Dispatcher.getInstance().on(drillEditor.ApplicationEvent.ELEMENT_SELECTED, elementSelectedHandler, this);
        drillEditor.Dispatcher.getInstance().on(drillEditor.PresentationViewEvent.ELEMENT_COPIED_TO_CLIPBOARD, elementCopiedToClipboardHandler, this);
    };


    p.updateDynamicButtons = function(selectedElementData){
        // remove existing buttons
        this.dynamicButtons.forEach(function(elem,index,sourceArray){
            if(elem.stage){
                this.removeChild(elem);
            }
        },this);
        //reset buttons array
        this.dynamicButtons = [];

        if(selectedElementData){

            switch(selectedElementData.type){
                case drillEditor.GraphicElementType.ARCUATE_MOVEMENT:
                case drillEditor.GraphicElementType.DRIBBLING_PLAYER:
                case drillEditor.GraphicElementType.PLAYER_MOVEMENT:
                case drillEditor.GraphicElementType.BALL_MOVEMENT:
                    this.dynamicButtons.push(this.swapDirectionsButton);
                    break;

            }

            this.dynamicButtons.push(this.copyButton);
            this.dynamicButtons.push(this.deleteButton);
        }

        if(drillEditor.Clipboard.data){
            this.dynamicButtons.push(this.pasteButton);
        }

        if(this.dynamicButtons.length>0){
            //reverse dyn buttons
            this.dynamicButtons.reverse();
            //add dyn buttonds to screen
            //var initX = this.backButton.x + this.backButton.getBounds().width + ToolsPanel.BUTTON_INTERVAL;
            var initX = this.dynamicButtonsInitX;
            this.dynamicButtons.forEach(function(elem, index, sourceArray){
                elem.x = initX;
                this.addChild(elem);
                initX += elem.getBounds().width + ToolsPanel.BUTTON_INTERVAL;
            },this);
        }

    };

    /********************************* event listeners **********************************/

    function backClickListener(){
        drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.BACK_BUTTON_CLICK));

        /*var presDTO = drillEditor.PresentationController.getInstance().getPresentationDTO();
        console.log(presDTO);*/
    }

    function copyButtonClickListener(event){
        drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.COPY_ELEMENT_BUTTON_CLICK));
    }

    function pasteButtonClickListener(event){
        drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.PASTE_ELEMENT_BUTTON_CLICK));
    }

    function elementCopiedToClipboardHandler(event){
        this.updateDynamicButtons(event.payload.data);
    }

    function elementSelectedHandler(evt){
        this.updateDynamicButtons(evt.payload.data && evt.payload.data.rendererData ? evt.payload.data.rendererData: null);
    }

    function deleteButtonClickListener(evt){
       drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.DELETE_ELEMENT));
    }

    function swapDirectionsButtonClickHandler(event){
        drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.SWAP_DIRECTIONS_BUTTON_CLICK));
    }

    drillEditor.ToolsPanel = createjs.promote(ToolsPanel,"Container");

}());




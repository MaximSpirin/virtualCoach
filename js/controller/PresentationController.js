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

    function sortItemsByDepth(elemA, elemB){
        var result = parseInt(elemA.depth) - parseInt(elemB.depth);
        return result;
    }


    PresentationController.prototype.actualizePlayerNumbers = function(){
        //this.presentation.elements.sort(drillEditor.MathUtils.compareNumeric);
        this.presentation.elements.sort(sortItemsByDepth);

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
        var defaultRadius = drillEditor.PrimitiveShapeRenderer.CIRCLE_COMPONENT_MIN_RADIUS;;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultRadius*2, defaultRadius*2);
        var elementRendererData = new drillEditor.DefenderVO(elemId, elemPosition, defaultRadius);
        elementRendererData.fillColor = "#F21818";
        addItemByModel.call(this, elementRendererData, true);
    }

    function createExtraClickHandler(presentationViewEvent) {
        var defaultRadius = drillEditor.PrimitiveShapeRenderer.CIRCLE_COMPONENT_MIN_RADIUS;;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultRadius*2, defaultRadius*2);
        var elementRendererData = new drillEditor.ExtraTeamVO(elemId, elemPosition, defaultRadius);
        elementRendererData.fillColor = "#373060";
        addItemByModel.call(this, elementRendererData, true);
    }

    function createNeutralPlayerClickHandler(presentationViewEvent) {
        var defaultRadius = drillEditor.PrimitiveShapeRenderer.CIRCLE_COMPONENT_MIN_RADIUS;;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultRadius*2, defaultRadius*2);
        var elementRendererData = new drillEditor.NeutralVO(elemId, elemPosition, defaultRadius);
        elementRendererData.fillColor = "#085429";
        addItemByModel.call(this, elementRendererData, true);
    }

    function createConeClickHandler(presentationViewEvent) {
        var defaultTriangleWidth = 30*0.75;
        var defaultTriangleHeight = Math.floor(35*0.75);
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

    /*PresentationController.createEmptyPresentation = function(){
        var id = "000000";
        var presentation = new drillEditor.Presentation(id);

        console.log("Created a new presentation with id= " + id);

        return presentation;
    };*/

    drillEditor.PresentationController = PresentationController;

}());

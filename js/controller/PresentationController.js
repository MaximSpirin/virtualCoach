/**
 * Class PresentationController
 * Created by maxim_000 on 9/21/2015.
 */
(function (window) {
    //public variables
    PresentationController.prototype.presentation = null;
    PresentationController.prototype.presentationView = null;
    PresentationController.prototype.dispatcher = null;
    PresentationController.prototype.elements = null;
    PresentationController.prototype.selectedElement = null;

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
     * Sets presentation view ie Pitch instance
     * @param value
     */
    PresentationController.prototype.setView = function(value){
        this.presentationView = value;

        // TODO
        //1. clear presentationView container and other layers
        //2. loop between presentation.elements and add them to view


    };
    /**
     * Creates a blank presentation and assigns it to presentation var
     */
    PresentationController.prototype.createEmptyPresentation = function(){
        this.presentation = new Presentation(Presentation.DEFAULT_ID);
    };


    /**
     * Sets current presentation
     * @param value
     */
    PresentationController.prototype.loadPresentation = function (presentationDTO) {
        this.presentation = DTOUtils.presentationDTOToVO(presentationDTO);


        this.elements = [];
        this.selectedElement = null;

    };

    /**
     * Returns DTO of the current presentation.
     */
    PresentationController.prototype.getPresentationDTO = function(){
        var result = DTOUtils.presentationToDTO(this.presentation);
        return result;
    };





    /*************************************** private functions *************************************/
    function initialize() {
        //init dispatcher
        this.dispatcher = Dispatcher.getInstance();
        this.dispatcher.on(PresentationViewEvent.CREATE_RECTANGLE_CLICK, createRectangleClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_SQUARE_CLICK, createSquareClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_ATTACKER_CLICK, createAttackerClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_DEFENDER_CLICK, createDefenderClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_EXTRA_TEAM_CLICK, createExtraClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_NEUTRAL_PLAYER_CLICK, createNeutralPlayerClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_CONE_CLICK, createConeClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_PLAYER_PATH_CLICK, createPlayerPathClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_BALL_PATH_CLICK, createBallPathClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_BALL_CLICK, createBallClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_BALLS_SUPPLY_CLICK, createBallsSupplyClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_ARC_CLICK, createArcClickHandler, this);
        this.dispatcher.on(PresentationViewEvent.CREATE_DRIBBLING_CLICK, createDribblingClickHandler, this);
        this.dispatcher.on(PresentationViewEvent.COPY_ELEMENT_BUTTON_CLICK, copyElementClickHandler, this);
        this.dispatcher.on(PresentationViewEvent.PASTE_ELEMENT_BUTTON_CLICK, pasteElementClickHandler, this);

        this.dispatcher.on(ApplicationEvent.ELEMENT_SELECTED, elementSelectedHandler, this);
        this.dispatcher.on(PresentationViewEvent.DELETE_ELEMENT, deleteElementHandler, this);
        this.dispatcher.on(PresentationViewEvent.SWAP_DIRECTIONS_BUTTON_CLICK, swapDirectionsClickHandler, this);

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
            Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.ELEMENT_SELECTED,{data:elementRenderer}));
            this.presentation.elements.push(itemModel);
        } else {
            var depth = Math.min(itemModel.depth, this.presentationView.elementsLayer.numChildren);
            this.presentationView.elementsLayer.addChildAt(elementRenderer, depth);
        }


        //this.elements.push(elementRenderer);

        this.presentationView.elementsLayer.addChild(this.transformTool);
    };

    function createElementRenderer(elementVO){
        switch (elementVO.type){
            case GraphicElementType.RECTANGLE:
                result = new RectComponent();
                break;

            case GraphicElementType.SQUARE:
                result = new SquareComponent();
                break;

            case GraphicElementType.ATTACKER:
            case GraphicElementType.DEFENDER:
            case GraphicElementType.EXTRA_TEAM:
            case GraphicElementType.NEUTRAL_PLAYER:
            case GraphicElementType.CONE:
                result = new PrimitiveShapeRenderer();
                break;

            case GraphicElementType.DRIBBLING_PLAYER:
                result = new DribblingLine();
                break;

            case GraphicElementType.PLAYER_MOVEMENT:
                result = new PlayerMovementLine();
                break;

            case GraphicElementType.BALL_MOVEMENT:
                result = new BallMovementLine();
                break;

            case GraphicElementType.BALL:
                result = new BallComponent();
                break;

            case GraphicElementType.BALLS_SUPPLY:
                result = new BallSupplyComponent();
                break;

            case GraphicElementType.ARCUATE_MOVEMENT:
                result = new ArchedArrow();
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

            case GraphicElementType.RECTANGLE:
                clonedElementData = new RectVO(newId, clonedPosition, clonedWidth, clonedHeight);
                break;

            case GraphicElementType.SQUARE:
                clonedElementData = new SquareVO(newId, clonedPosition, clonedWidth, clonedHeight);
                break;


            case GraphicElementType.ATTACKER:
                clonedElementData = new AttackerVO(newId, clonedPosition, sourceElementData.radius);
                clonedElementData.fillColor = sourceElementData.fillColor;
                break;

            case GraphicElementType.DEFENDER:
                clonedElementData = new DefenderVO(newId, clonedPosition, sourceElementData.radius);
                clonedElementData.fillColor = sourceElementData.fillColor;
                break;

            case GraphicElementType.EXTRA_TEAM:
                clonedElementData = new ExtraTeamVO(newId, clonedPosition, sourceElementData.radius);
                clonedElementData.fillColor = sourceElementData.fillColor;
                break;

            case GraphicElementType.NEUTRAL_PLAYER:
                clonedElementData = new NeutralVO(newId, clonedPosition, sourceElementData.radius);
                clonedElementData.fillColor = sourceElementData.fillColor;
                break;

            case GraphicElementType.CONE:
                clonedElementData = new ConeVO(newId, clonedPosition, clonedWidth, clonedHeight);
                clonedElementData.fillColor = sourceElementData.fillColor;
                break;

            case GraphicElementType.ARCUATE_MOVEMENT:
                clonedElementData = new ArchedArrowVO(newId, clonedPosition,
                    clonedWidth, clonedHeight,
                    sourceElementData.arrowDirection, clonedRotation);
                break;

            case GraphicElementType.DRIBBLING_PLAYER:
                var startPointCloned = new createjs.Point(sourceElementData.startPoint.x + 16, sourceElementData.startPoint.y + 16);
                var endPointCloned = new createjs.Point(sourceElementData.endPoint.x + 16, sourceElementData.endPoint.y + 16);
                clonedElementData = new DribblingLineVO(newId, startPointCloned, endPointCloned, sourceElementData.arrowDirection);
                break;

            case GraphicElementType.PLAYER_MOVEMENT:
                var startPointCloned = new createjs.Point(sourceElementData.startPoint.x + 16, sourceElementData.startPoint.y + 16);
                var endPointCloned = new createjs.Point(sourceElementData.endPoint.x + 16, sourceElementData.endPoint.y + 16);
                clonedElementData = new PlayerMovementVO(newId, startPointCloned, endPointCloned, sourceElementData.arrowDirection);
                break;

            case GraphicElementType.BALL_MOVEMENT:
                var startPointCloned = new createjs.Point(sourceElementData.startPoint.x + 16, sourceElementData.startPoint.y + 16);
                var endPointCloned = new createjs.Point(sourceElementData.endPoint.x + 16, sourceElementData.endPoint.y + 16);
                clonedElementData = new BallMovementVO(newId, startPointCloned, endPointCloned, sourceElementData.arrowDirection);
                break;

            case GraphicElementType.BALL:
                clonedElementData = new BallVO(newId, clonedPosition);
                break;

            case GraphicElementType.BALLS_SUPPLY:
                clonedElementData = new BallSupplyVO(newId, clonedPosition);
                break;

        }


        return clonedElementData
    };


    /*************************************** event handler *****************************************/

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
                var elementDataIndex = this.presentation.elements.indexOf(this.selectedElement.rendererData);//TODO substitute with Presentation.removeElementById
                this.presentation.elements.splice(elementDataIndex, 1);
            }

            // loop between VOs and update their depths according to the depth of the views
            for(var i=0; i<this.presentationView.elementsLayer.numChildren; i++){
                var childElement = this.presentationView.elementsLayer.getChildAt(i);
                childElement.rendererData.depth = i;
                //TODO - sort Presentation.elements on "depth" by ascending

                   /* console.info("element %d typeof %d has index of %d",
                    childElement.rendererData.id, childElement.rendererData.type,
                    childElement.rendererData.depth);*/
            }


            this.selectedElement = null;

            //3. remove selection
            Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.ELEMENT_SELECTED,{data:null}));
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
        var elementRendererData = new RectVO(elemId, elemPosition, defaultRectangleWidth, defaultRectangleHeight);
        addItemByModel.call(this, elementRendererData, true);
    }

    function createSquareClickHandler(presentationViewEvent){
        var defaultSquareWidth = 150;
        var defaultSquareHeight = 150;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultSquareWidth, defaultSquareHeight);
        var elementRendererData = new SquareVO(elemId, elemPosition, defaultSquareWidth, defaultSquareHeight);
        addItemByModel.call(this, elementRendererData, true);
    }

    function createAttackerClickHandler(presentationViewEvent) {
        var defaultRadius = PrimitiveShapeRenderer.CIRCLE_COMPONENT_MIN_RADIUS;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultRadius*2, defaultRadius*2);
        var elementRendererData = new AttackerVO(elemId, elemPosition, defaultRadius);
        elementRendererData.fillColor = "#382CBF";
        addItemByModel.call(this, elementRendererData, true);
    }

    function createDefenderClickHandler(presentationViewEvent) {
        var defaultRadius = 20;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultRadius*2, defaultRadius*2);
        var elementRendererData = new DefenderVO(elemId, elemPosition, defaultRadius);
        elementRendererData.fillColor = "#F21818";
        addItemByModel.call(this, elementRendererData, true);
    }

    function createExtraClickHandler(presentationViewEvent) {
        var defaultRadius = 20;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultRadius*2, defaultRadius*2);
        var elementRendererData = new ExtraTeamVO(elemId, elemPosition, defaultRadius);
        elementRendererData.fillColor = "#373060";
        addItemByModel.call(this, elementRendererData, true);
    }

    function createNeutralPlayerClickHandler(presentationViewEvent) {
        var defaultRadius = 20;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultRadius*2, defaultRadius*2);
        var elementRendererData = new NeutralVO(elemId, elemPosition, defaultRadius);
        elementRendererData.fillColor = "#085429";
        addItemByModel.call(this, elementRendererData, true);
    }

    function createConeClickHandler(presentationViewEvent) {
        var defaultTriangleWidth = 30;
        var defaultTriangleHeight = 35;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultTriangleWidth, defaultTriangleHeight);
        var elementRendererData = new ConeVO(elemId, elemPosition, defaultTriangleWidth, defaultTriangleHeight);
        elementRendererData.fillColor = "#FFEA04";
        addItemByModel.call(this, elementRendererData, true);
    }


    function createPlayerPathClickHandler(presentationViewEvent) {
        var elemId = createjs.UID.get();
        var defaultStripWidth = 150;
        var defaultStripHeight = PlayerMovementLine.STD_HEIGHT;

        var elementPosition = getElementDefaultPosition.call(this, defaultStripWidth, defaultStripHeight);
        elementPosition.y+=PlayerMovementLine.STD_HEIGHT/2;

        var startPoint = new createjs.Point(elementPosition.x, elementPosition.y);
        var endPoint = new createjs.Point(elementPosition.x + defaultStripWidth,  elementPosition.y);

        var elementRendererData = new PlayerMovementVO(elemId, startPoint, endPoint, ArrowDirection.LEFT);
        addItemByModel.call(this, elementRendererData, true);
    }

    function createBallPathClickHandler(presentationViewEvent) {
        var elemId = createjs.UID.get();
        var defaultStripWidth = 150;
        var defaultStripHeight = BallMovementLine.STD_HEIGHT;

        var elementPosition = getElementDefaultPosition.call(this, defaultStripWidth, defaultStripHeight);
        elementPosition.y+=BallMovementLine.STD_HEIGHT/2;

        var startPoint = new createjs.Point(elementPosition.x, elementPosition.y);
        var endPoint = new createjs.Point(elementPosition.x + defaultStripWidth,  elementPosition.y);

        var elementRendererData = new BallMovementVO(elemId, startPoint, endPoint, ArrowDirection.LEFT);
        addItemByModel.call(this, elementRendererData, true);
    }

    function createBallClickHandler(presentationViewEvent) {
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, BallComponent.STD_WIDTH, BallComponent.STD_HEIGHT);
        var elementRendererData = new BallVO(elemId, elemPosition);
        addItemByModel.call(this, elementRendererData, true);
    }

    function createBallsSupplyClickHandler(presentationViewEvent) {
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, BallSupplyComponent.STD_WIDTH, BallSupplyComponent.STD_HEIGHT);
        var elementRendererData = new BallSupplyVO(elemId, elemPosition);
        addItemByModel.call(this, elementRendererData, true);
    }

    function createArcClickHandler(presentationViewEvent){
        var defaultArrowDirection = ArrowDirection.LEFT;
        var defaultArcRotation = 0;
        var elemId = createjs.UID.get();
        var elementWidth =  ArchedArrow.STD_WIDTH;
        var elementHeight =  ArchedArrow.STD_HEIGHT;
        var elemPosition = getElementDefaultPosition.call(this, ArchedArrow.STD_WIDTH, ArchedArrow.STD_HEIGHT);
        var elementRendererData = new ArchedArrowVO(elemId, elemPosition, elementWidth, elementHeight, defaultArrowDirection, defaultArcRotation);
        addItemByModel.call(this, elementRendererData, true);

    }

    function createDribblingClickHandler(evt){
        var elemId = createjs.UID.get();
        var defaultStripWidth = DribblingLineSegment.STD_WIDTH*3;
        var defaultStripHeight = DribblingLineSegment.STD_HEIGHT;

        var elementPosition = getElementDefaultPosition.call(this, defaultStripWidth, defaultStripHeight);
        elementPosition.y+=DribblingLineSegment.STD_HEIGHT/2;

        var startPoint = new createjs.Point(elementPosition.x, elementPosition.y);
        var endPoint = new createjs.Point(elementPosition.x + defaultStripWidth,  elementPosition.y);

        var elementRendererData = new DribblingLineVO(elemId, startPoint, endPoint, ArrowDirection.LEFT);
        addItemByModel.call(this, elementRendererData, true);
    }


    function copyElementClickHandler(event){
        var clonedSourceData = this.cloneElementData(this.selectedElement.rendererData);
        Clipboard.data = clonedSourceData;
        this.dispatcher.dispatchEvent(new PresentationViewEvent(PresentationViewEvent.ELEMENT_COPIED_TO_CLIPBOARD,{data:clonedSourceData}));
    }

    function pasteElementClickHandler(event){
        if(Clipboard.data){
            var clonedElementData = this.cloneElementData(Clipboard.data);
            addItemByModel.call(this, clonedElementData, true);
        }
    }

    /*********************************** public static method *************************************/

    PresentationController.getInstance = function(){

        if(PresentationController.instance == null){
            PresentationController.instance = new PresentationController();
        }

        return PresentationController.instance;
    };

    PresentationController.createEmptyPresentation = function(){
        var id = "000000"
        var presentation = new Presentation(id);

        console.log("Created a new presentation with id= " + id);

        return presentation;
    };

    /*PresentationController.DTOToPresentation = function(presentationDTO){
        var result = new Presentation();
        return result;
    };*/

    /*PresentationController.presentationToDTO = function(presentation){
        var presentationDTO = {};
        presentationDTO.drillId = presentation.id;
        presentationDTO.playersCount = 1;
        presentationDTO.equipmentRequired = {};
        presentationDTO.activitiesRequired = {};
        presentationDTO.elements = [];

        for(var i=0; i<presentation.elements.length; i++){
            var elementDTO = DTOUtils.elementVOToDTO(presentation.elements[i]);
            presentationDTO.elements.push(elementDTO);
        }

        return presentationDTO;
    };*/

    window.PresentationController = PresentationController;

}(window));
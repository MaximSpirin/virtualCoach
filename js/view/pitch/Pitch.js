/**
 * Class Pitch
 * Created by maxim_000 on 9/19/2015.
 */
(function (window) {
    //************************************** public variables ***********************************//
    Pitch.prototype.componentWidth;
    Pitch.prototype.componentHeight;
    Pitch.prototype.backgroundShape;
    Pitch.prototype.backgroundShapeMask;
    Pitch.prototype.backgroundOutline;
    Pitch.prototype.update;
    Pitch.prototype.dispatcher;
    Pitch.prototype.elementsLayer;
    Pitch.prototype.transformToolLayer;
    Pitch.prototype.elements;
    Pitch.prototype.transformTool;

    //************************************** static variables ************************************//
    //Pitch.staticVar = "value";

    //constructor
    function Pitch(initWidth, initHeight) {
        //invoke constructor of superclass
        this.Container_constructor();

        var sizeIsValid = checkSizeValidity(initWidth, initHeight);
        if(sizeIsValid){
            this.componentWidth = initWidth;
            this.componentHeight = initHeight;
            if(this.componentWidth!=undefined && this.componentHeight!=undefined){
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

        this.transformTool = new TransformTool();
        this.elementsLayer.addChild(this.transformTool);

        this.dispatcher = Dispatcher.getInstance();
        this.dispatcher.on(PresentationViewEvent.CREATE_RECTANGLE_CLICK, createRectangleClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_SQUARE_CLICK, createSquareClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_ATTACKER_CLICK, createAttackerClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_DEFENDER_CLICK, createDefenderClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_EXTRA_TEAM_CLICK, createExtraClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_NEUTRAL_PLAYER_CLICK, createNeutralPlayerClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_CONE_CLICK, createConeClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_DRIBBLING_CLICK, createDribblingClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_PLAYER_PATH_CLICK, createPlayerPathClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_BALL_PATH_CLICK, createBallPathClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_BALL_CLICK, createBallClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_BALLS_SUPPLY_CLICK, createBallsSupplyClickHandler , this);
        this.dispatcher.on(PresentationViewEvent.CREATE_ARC_CLICK, createArcClickHandler, this);

        this.dispatcher.on(ApplicationEvent.ELEMENT_SELECTED, elementSelectedHandler, this);

    }

    function render() {
        if(!this.update){
            return;
        }
        //redraw bg shape
        this.backgroundShape.graphics.clear();
        //this.backgroundShape.graphics.setStrokeStyle(2);
        //this.backgroundShape.graphics.beginStroke("#FFFFFF");
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
    }


    /************************************* public functions *******************************************/
    p.addItemByModel = function(itemModel, addedByUser) {
        var elementRenderer = createElementRenderer(itemModel);

        if(addedByUser){
            this.elementsLayer.addChild(elementRenderer);
            itemModel.depth = this.elementsLayer.numChildren - 1;
            this.transformTool.setTarget(elementRenderer);
        } else {
            var depth = Math.min(model.depth, this.elementsLayer.numChildren);
        }
        this.elements.push(elementRenderer);
        this.elementsLayer.addChild(this.transformTool);
    };



    /************************************** event handlers *******************************************/

    function canvasMouseDownHandler(evt){
        this.transformTool.setTarget(null);
    }

    function addComponentHandler(evt){
       var componentType = evt.payload.type;
       /*var componentX = evt.payload.x!=undefined ? evt.payload.x : get;
       var componentY = evt.payload.y!=undefined ? evt.payload.y : ;*/
    }

    function elementSelectedHandler(evt){
        var selectedElement = evt.payload.data;
        this.transformTool.setTarget(selectedElement);

    }


    function createRectangleClickHandler(presentationViewEvent){
        var defaultRectangleWidth = 200;
        var defaultRectangleHeight = 100;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultRectangleWidth, defaultRectangleHeight);
        var elementRendererData = new RectVO(elemId, elemPosition, defaultRectangleWidth, defaultRectangleHeight);
        this.addItemByModel(elementRendererData, true);
    }

    function createSquareClickHandler(presentationViewEvent){
        var defaultSquareWidth = 150;
        var defaultSquareHeight = 150;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultSquareWidth, defaultSquareHeight);
        var elementRendererData = new SquareVO(elemId, elemPosition, defaultSquareWidth, defaultSquareHeight);
        this.addItemByModel(elementRendererData, true);
    }

    function createAttackerClickHandler(presentationViewEvent) {
        var defaultRadius = 20;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultRadius*2, defaultRadius*2);
        var elementRendererData = new AttackerVO(elemId, elemPosition, defaultRadius);
        this.addItemByModel(elementRendererData, true);
    }

    function createDefenderClickHandler(presentationViewEvent) {
        var defaultRadius = 20;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultRadius*2, defaultRadius*2);
        var elementRendererData = new DefenderVO(elemId, elemPosition, defaultRadius);
        this.addItemByModel(elementRendererData, true);
    }

    function createExtraClickHandler(presentationViewEvent) {
        var defaultRadius = 20;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultRadius*2, defaultRadius*2);
        var elementRendererData = new ExtraTeamVO(elemId, elemPosition, defaultRadius);
        this.addItemByModel(elementRendererData, true);
    }

    function createNeutralPlayerClickHandler(presentationViewEvent) {
        var defaultRadius = 20;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultRadius*2, defaultRadius*2);
        var elementRendererData = new NeutralVO(elemId, elemPosition, defaultRadius);
        this.addItemByModel(elementRendererData, true);
    }

    function createConeClickHandler(presentationViewEvent) {
        var defaultTriangleWidth = 30;
        var defaultTriangleHeight = 35;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, defaultTriangleWidth, defaultTriangleHeight);
        var elementRendererData = new ConeVO(elemId, elemPosition, defaultTriangleWidth, defaultTriangleHeight);
        this.addItemByModel(elementRendererData, true);
    }

    function createDribblingClickHandler(presentationViewEvent) {
                   
    }

    function createPlayerPathClickHandler(presentationViewEvent) {

    }

    function createBallPathClickHandler(presentationViewEvent) {

    }

    function createBallClickHandler(presentationViewEvent) {

    }

    function createBallsSupplyClickHandler(presentationViewEvent) {

    }

    function createArcClickHandler(presentationViewEvent){
        var defaultArrowDirection = "left";
        var defaultArcRotation = 0;
        var elemId = createjs.UID.get();
        var elemPosition = getElementDefaultPosition.call(this, ArchedArrow.STD_WIDTH, ArchedArrow.STD_HEIGHT);
        var elementRendererData = new ArchedArrowVO(elemId, elemPosition, defaultArrowDirection, defaultArcRotation);
        this.addItemByModel(elementRendererData, true);

    }

    function getElementDefaultPosition(width, height){
        var result = new createjs.Point(this.componentWidth/2 - width/2, this.componentHeight/2 - height/2);
        return result;
    }

    function createElementRenderer(elementVO){
        var result;

        switch (elementVO.type){
            case GraphicElementType.RECTANGLE:
                result = new RectComponent();
                break;

            case GraphicElementType.SQUARE:
                result = new SquareComponent();
                break;

            case GraphicElementType.ATTACKER:
                result = new AttackerComponent();
                break;

            case GraphicElementType.DEFENDER:
                result = new DefenderComponent();
                break;

            case GraphicElementType.EXTRA_TEAM:
                result = new ExtraTeamComponent();
                break;

            case GraphicElementType.NEUTRAL_PLAYER:
                    result = new NeutralPlayerComponent();
                break;

            case GraphicElementType.CONE:
                result = new ConeComponent();
                break;

            case GraphicElementType.DRIBBLING_PLAYER:

                break;

            case GraphicElementType.PLAYER_MOVEMENT:

                break;

            case GraphicElementType.BALL_MOVEMENT:

                break;

            case GraphicElementType.BALL:

                break;

            case GraphicElementType.BALLS_SUPPLY:

                break;

            case GraphicElementType.ARC:
                result = new ArchedArrow();
            break;



        }

        result.setRendererData(elementVO);

        return result;
    }



    //************************************ static methods ********************************************/
    //Pitch.staticFunctionName = function(param1){ //method body };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.Pitch = createjs.promote(Pitch,"Container");

}(window));

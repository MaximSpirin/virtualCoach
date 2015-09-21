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
    Pitch.prototype.elements;

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
        this.addChild(this.backgroundShape);

        this.backgroundOutline = new createjs.Shape();
        this.addChild(this.backgroundOutline);

        //pitch mask
        this.backgroundShapeMask = new createjs.Shape();
        this.backgroundShape.mask = this.backgroundShapeMask;

        //container for all elements
        this.elementsLayer = new createjs.Container();
        this.addChild(this.elementsLayer);


        this.dispatcher = Dispatcher.getInstance();
        this.dispatcher.on(ApplicationEvent.ADD_COMPONENT, addComponentHandler, this);

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
        var elementContainer = new createjs.Container();
        elementContainer.add(elementRenderer);

        if(addedByUser){
            this.elementsLayer.addChild(elementContainer);
            itemModel.depth = this.elementsLayer.numChildren - 1;
        }else{
            var depth = Math.min(model.depth, this.elementsLayer.numChildren);
        }
        this.elements.push(elementContainer);
    };


    /************************************** event handlers *******************************************/

    function addComponentHandler(evt){
       var componentType = evt.payload.type;
       /*var componentX = evt.payload.x!=undefined ? evt.payload.x : get;
       var componentY = evt.payload.y!=undefined ? evt.payload.y : ;*/
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

            case GraphicElementType.NEUTRAL:

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


        }

        result.rendererData = elementVO;

    }




    //************************************ static methods ********************************************/
    //Pitch.staticFunctionName = function(param1){ //method body };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.Pitch = createjs.promote(Pitch,"Container");

}(window));

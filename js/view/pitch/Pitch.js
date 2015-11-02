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

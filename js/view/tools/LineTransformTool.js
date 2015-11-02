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
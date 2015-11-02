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
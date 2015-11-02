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
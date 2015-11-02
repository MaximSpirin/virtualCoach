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
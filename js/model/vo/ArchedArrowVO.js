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
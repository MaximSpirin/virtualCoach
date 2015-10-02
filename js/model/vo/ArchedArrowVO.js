/**
 * Class ArchedArrowVO
 * Created by maxim_000 on 9/27/2015.
 */
(function (window) {
    //public variables
    ArchedArrowVO.prototype.arrowDirection = "left";
    ArchedArrowVO.prototype.startPointPosition = null;
    ArchedArrowVO.prototype.endPointPosition = null;

    //static variable
    ArchedArrowVO.STROKE_SIZE = 2;
    ArchedArrowVO.STROKE_COLOR = "#000000";

    //constructor
    function ArchedArrowVO(elemId, elemPosition, elementWidth, elementHeight, arrowDirection, rotation) {
        this.arrowDirection = arrowDirection;
        this.rotation = rotation;
        this.setWidth(elementWidth);
        this.setHeight(elementHeight);
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(elemId, GraphicElementType.ARC, elemPosition);
    }

    //extend this class from a superclass
    var p = createjs.extend(ArchedArrowVO, GraphicItemVO);

    p.invertArrowDirection = function(){
        if(this.arrowDirection == "left"){
            this.arrowDirection = "right"
        }else{
            this.arrowDirection = "left";
        }
        this.dispatchEvent(new ApplicationEvent(ApplicationEvent.GRAPHIC_PROPERTY_CHANGED,{name:"arrowDirection"}));
    };

    // public functions
    //ArcVO.prototype.publicFunction = function (param1) { };

    //private functions
    //function privateFunction(param) { }

    //public static method
    //ArcVO.staticFunctionName = function(param1){ //method body };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.ArchedArrowVO = createjs.promote(ArchedArrowVO, "GraphicItemVO");

}(window));
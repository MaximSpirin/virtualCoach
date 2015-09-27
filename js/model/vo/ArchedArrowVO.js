/**
 * Class ArchedArrowVO
 * Created by maxim_000 on 9/27/2015.
 */
(function (window) {
    //public variables
    ArchedArrowVO.prototype.arrowDirection = "left";
    ArchedArrowVO.prototype.rotation = 0;
    ArchedArrowVO.prototype.startPointPosition = null;
    ArchedArrowVO.prototype.endPointPosition = null;

    //static variable
    ArchedArrowVO.STROKE_SIZE = 2;
    ArchedArrowVO.STROKE_COLOR = "#000000";

    //constructor
    function ArchedArrowVO() {
        //invoke constructor of superclass
        //this.SuperClass_constructor();
    }

    //extend this class from a superclass
    //var p = createjs.extend(ArcVO,SuperClass);

    // public functions
    //ArcVO.prototype.publicFunction = function (param1) { };

    //private functions
    //function privateFunction(param) { }

    //public static method
    //ArcVO.staticFunctionName = function(param1){ //method body };

    //Make aliases for all superclass methods: SuperClass_methodName
    //window.ArcVO = createjs.promote(ArcVO,"SuperClass");

    window.ArcVO = ArchedArrowVO;

}(window));
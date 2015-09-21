/**
 * Class RectVO
 * Created by maxim_000 on 9/21/2015.
 */
(function (window) {
    //public variables
    //RectVO.prototype.publicVar = "value";

    //static variable
    //RectVO.staticVar = "value";

    //constructor
    function RectVO(id, position, width, height) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, GraphicElementType.RECTANGLE, position);
    }

    //extend this class from a superclass
    var p = createjs.extend(RectVO,GraphicItemVO);


    //Make aliases for all superclass methods: SuperClass_methodName
    window.RectVO = createjs.promote(RectVO,"GraphicItemVO");


}(window));
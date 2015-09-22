/**
 * Class RectVO
 * Created by maxim_000 on 9/21/2015.
 */
(function (window) {
    "use strict";
    //public variables
    //RectVO.prototype.publicVar = "value";

    //static variable
    //RectVO.staticVar = "value";

    //constructor
    /**
     * Model of the rectangle component
     *
     * @class RectVO
     * @param {Number} [id=0] Unique item id.
     * @param {createjs.Point} [position=null] Item position.
     * @param {Number} [width=0] Item width.
     * @param {Number} [height=0] Item height.
     * @constructor
     **/
    function RectVO(id, position, width, height) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, GraphicElementType.RECTANGLE, position);
        this.setWidth(width);
        this.setHeight(height);
    }

    //extend this class from a superclass
    var p = createjs.extend(RectVO,GraphicItemVO);


    //Make aliases for all superclass methods: SuperClass_methodName
    window.RectVO = createjs.promote(RectVO,"GraphicItemVO");


}(window));
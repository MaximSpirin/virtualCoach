/**
 * Class SquareVO
 * Created by maxim_000 on 9/21/2015.
 */
(function (window) {
    "use strict";
    //public variables
    //SquareVO.prototype.publicVar = "value";

    //static variable
    //SquareVO.staticVar = "value";

    //constructor
    /**
     * Model of the square component
     *
     * @class SquareVO
     * @param {Number} [id=0] Unique item id.
     * @param {createjs.Point} [position=null] Item position.
     * @param {Number} [width=0] Item width.
     * @param {Number} [height=0] Item height.
     * @constructor
     **/
    function SquareVO(id, position, width, height) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, GraphicElementType.SQUARE, position);
        this.setWidth(width);
        this.setHeight(height);
    }

    //extend this class from a superclass
    var p = createjs.extend(SquareVO,GraphicItemVO);


    //Make aliases for all superclass methods: SuperClass_methodName
    window.SquareVO = createjs.promote(SquareVO,"GraphicItemVO");


}(window));
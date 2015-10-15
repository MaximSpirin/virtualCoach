/**
 * Class ConeVO
 * Created by maxim_000 on 9/21/2015.
 */
(function (window) {
    "use strict";
    //public variables
    //ConeVO.prototype.publicVar = "value";

    //static variable
    //ConeVO.staticVar = "value";

    //constructor
    /**
     * Model of the rectangle component
     *
     * @class ConeVO
     * @param {Number} [id=0] Unique item id.
     * @param {createjs.Point} [position=null] Item position.
     * @param {Number} [width=0] Item width.
     * @param {Number} [height=0] Item height.
     * @constructor
     **/
    function ConeVO(id, position, width, height) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, GraphicElementType.CONE, position);
        this.setWidth(width);
        this.setHeight(height);
    }

    //extend this class from a superclass
    var p = createjs.extend(ConeVO,GraphicItemVO);

    // flag for serialization
    p.isEquipment = true;

    //Make aliases for all superclass methods: SuperClass_methodName
    window.ConeVO = createjs.promote(ConeVO,"GraphicItemVO");


}(window));
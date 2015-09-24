/**
 * Class NeutralVO
 * Created by maxim_000 on 9/21/2015.
 */
(function (window) {
    "use strict";
    //public variables
    NeutralVO.prototype.radius;

    //static variable
    //NeutralVO.staticVar = "value";

    //constructor
    /**
     * Model of the rectangle component
     *
     * @class NeutralVO
     * @param {Number} [id=0] Unique item id.
     * @param {createjs.Point} [position=null] Item position.
     * @param {Number} Circle radius.
     * @constructor
     **/
    function NeutralVO(id, position, radius) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, GraphicElementType.NEUTRAL_PLAYER, position);
        this.setWidth(radius*2);
        this.setHeight(radius*2);
        this.radius = radius;
    }

    //extend this class from a superclass
    var p = createjs.extend(NeutralVO,GraphicItemVO);


    //Make aliases for all superclass methods: SuperClass_methodName
    window.NeutralVO = createjs.promote(NeutralVO,"GraphicItemVO");


}(window));
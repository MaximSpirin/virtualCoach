/**
 * Class AttackerVO
 * Created by maxim_000 on 9/21/2015.
 */
(function (window) {
    "use strict";
    //public variables
    AttackerVO.prototype.radius;

    //static variable
    //AttackerVO.staticVar = "value";

    //constructor
    /**
     * Model of the rectangle component
     *
     * @class AttackerVO
     * @param {Number} [id=0] Unique item id.
     * @param {createjs.Point} [position=null] Item position.
     * @param {Number} Circle radius.
     * @constructor
     **/
    function AttackerVO(id, position, radius) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, GraphicElementType.ATTACKER, position);
        this.setWidth(radius*2);
        this.setHeight(radius*2);
        this.radius = radius;
    }

    //extend this class from a superclass
    var p = createjs.extend(AttackerVO,GraphicItemVO);


    //Make aliases for all superclass methods: SuperClass_methodName
    window.AttackerVO = createjs.promote(AttackerVO,"GraphicItemVO");


}(window));
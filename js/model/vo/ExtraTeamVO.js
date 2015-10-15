/**
 * Class ExtraTeamVO
 * Created by maxim_000 on 9/21/2015.
 */
(function (window) {
    "use strict";
    //public variables
    ExtraTeamVO.prototype.radius;

    //static variable
    //ExtraTeamVO.staticVar = "value";

    //constructor
    /**
     * Model of the rectangle component
     *
     * @class ExtraTeamVO
     * @param {Number} [id=0] Unique item id.
     * @param {createjs.Point} [position=null] Item position.
     * @param {Number} Circle radius.
     * @constructor
     **/
    function ExtraTeamVO(id, position, radius) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, GraphicElementType.EXTRA_TEAM, position);
        this.setWidth(radius*2);
        this.setHeight(radius*2);
        this.radius = radius;
    }

    //extend this class from a superclass
    var p = createjs.extend(ExtraTeamVO,GraphicItemVO);

    //flag for serialization
    p.isPlayer = true;

    //Make aliases for all superclass methods: SuperClass_methodName
    window.ExtraTeamVO = createjs.promote(ExtraTeamVO,"GraphicItemVO");


}(window));
//##############################################################################
//
//##############################################################################

/**
 * Class NeutralVO
 * Created by maxim_000 on 9/21/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
    NeutralVO.prototype.radius;

    //constructor
    /**
     * Model of the rectangle component
     *
     * @class drillEditor.NeutralVO
     * @param {Number} [id=0] Unique item id.
     * @param {createjs.Point} [position=null] Item position.
     * @param {Number} Circle radius.
     * @constructor
     **/
    function NeutralVO(id, position, radius) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, drillEditor.GraphicElementType.NEUTRAL_PLAYER, position);
        this.setWidth(radius*2);
        this.setHeight(radius*2);
        this.radius = radius;
    }

    //extend this class from a superclass
    var p = createjs.extend(NeutralVO,drillEditor.GraphicItemVO);

    //flag for serialization
    p.isPlayer = true;

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.NeutralVO = createjs.promote(NeutralVO,"GraphicItemVO");


}());
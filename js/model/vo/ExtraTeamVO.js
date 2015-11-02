//##############################################################################
//
//##############################################################################
/**
 * Class ExtraTeamVO
 * Created by maxim_000 on 9/21/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
    ExtraTeamVO.prototype.radius;
    ExtraTeamVO.playerNumber;

    //constructor
    /**
     * Model of the rectangle component
     *
     * @class drillEditor.ExtraTeamVO
     * @param {Number} [id=0] Unique item id.
     * @param {createjs.Point} [position=null] Item position.
     * @param {Number} Circle radius.
     * @constructor
     **/
    function ExtraTeamVO(id, position, radius) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, drillEditor.GraphicElementType.EXTRA_TEAM, position);
        this.setWidth(radius*2);
        this.setHeight(radius*2);
        this.radius = radius;
    }

    //extend this class from a superclass
    var p = createjs.extend(ExtraTeamVO,drillEditor.GraphicItemVO);

    p.setPlayerNumber = function(value){
        this.playerNumber = value;
        this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.GRAPHIC_PROPERTY_CHANGED,{name:"playerNumber"}));
    };

    //flag for serialization
    p.isPlayer = true;

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.ExtraTeamVO = createjs.promote(ExtraTeamVO,"GraphicItemVO");


}());
//##############################################################################
//
//##############################################################################

/**
 * Class GoalVO
 * Created by maxim_000 on 10/28/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /*********************************************** public variables *************************************************/


    /*********************************************** static variables *************************************************/


    /*********************************************** constructor ******************************************************/
    function GoalVO(elemId, elemPosition, elementWidth, elementHeight, rotation) {
        this.rotation = rotation;
        this.setWidth(elementWidth);
        this.setHeight(elementHeight);

        //invoke constructor of superclass
        this.GraphicItemVO_constructor(elemId, drillEditor.GraphicElementType.GOAL, elemPosition);
    }

    //extend this class from a superclass
    var p = createjs.extend(GoalVO, drillEditor.GraphicItemVO);

    // flag for serialization
    p.isEquipment = true;
    /*********************************************** overridden methods ***********************************************/


    /*********************************************** private methods **************************************************/


    /*********************************************** event handlers ***************************************************/


    /*********************************************** public static method *********************************************/


    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.GoalVO = createjs.promote(GoalVO,"GraphicItemVO");

}());
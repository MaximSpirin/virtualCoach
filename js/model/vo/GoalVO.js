/**
 * Class GoalVO
 * Created by maxim_000 on 10/28/2015.
 */
(function (window) {
    /*********************************************** public variables *************************************************/
    //GoalVO.prototype.publicVar = "value";

    /*********************************************** static variables *************************************************/
    //GoalVO.staticVar = "value";

    /*********************************************** constructor ******************************************************/
    function GoalVO(elemId, elemPosition, elementWidth, elementHeight, rotation) {
        this.rotation = rotation;
        this.setWidth(elementWidth);
        this.setHeight(elementHeight);

        //invoke constructor of superclass
        this.GraphicItemVO_constructor(elemId, GraphicElementType.GOAL, elemPosition);
    }

    //extend this class from a superclass
    var p = createjs.extend(GoalVO, GraphicItemVO);

    // flag for serialization
    p.isEquipment = true;
    /*********************************************** overridden methods ***********************************************/


    /*********************************************** private methods **************************************************/


    /*********************************************** event handlers ***************************************************/


    /*********************************************** public static method *********************************************/


    //Make aliases for all superclass methods: SuperClass_methodName
    window.GoalVO = createjs.promote(GoalVO,"GraphicItemVO");

}(window));
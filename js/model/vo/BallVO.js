//##############################################################################
//
//##############################################################################

/**
 * Class drillEditor.BallVO
 * Created by maxim_000 on 10/9/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/


    /******************* static variables *******************/
    BallVO.STD_WIDTH = 24;
    //BallVO.STD_WIDTH = 32;
    BallVO.STD_HEIGHT = 24;
    //BallVO.STD_HEIGHT = 32;

    /********************** constructor *********************/
    function BallVO(id, position) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, drillEditor.GraphicElementType.BALL, position);
        this.width = BallVO.STD_WIDTH;
        this.height = BallVO.STD_WIDTH;
    }

    //extend this class from a superclass
    var p = createjs.extend(BallVO, drillEditor.GraphicItemVO);

    // flag for serialization
    p.isEquipment = true;

    /******************** private methods *******************/


    /******************** event handlers ********************/


    /******************* public static method ***************/

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.BallVO = createjs.promote(BallVO,"GraphicItemVO");

}());
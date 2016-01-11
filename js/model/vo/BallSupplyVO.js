//##############################################################################
//
//##############################################################################

/**
 * Class BallSupplyVO
 * Created by maxim_000 on 10/9/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/
    //BallSupplyVO.prototype.publicVar = "value";

    /******************* static variables *******************/
    //BallSupplyVO.STD_WIDTH = 78;
    BallSupplyVO.STD_WIDTH = Math.floor(78*0.8);
    //BallSupplyVO.STD_HEIGHT = 26;
    BallSupplyVO.STD_HEIGHT = Math.floor(26*0.8);

    /********************** constructor *********************/
    function BallSupplyVO(id, position) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, drillEditor.GraphicElementType.BALLS_SUPPLY, position);
        this.width = BallSupplyVO.STD_WIDTH;
        this.height = BallSupplyVO.STD_HEIGHT;
    }

    //extend this class from a superclass
    var p = createjs.extend(BallSupplyVO, drillEditor.GraphicItemVO);

    // flag for serialization
    p.isEquipment = true;

    /******************** private methods *******************/


    /******************** event handlers ********************/


    /******************* public static method ***************/

        //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.BallSupplyVO = createjs.promote(BallSupplyVO,"GraphicItemVO");

}());
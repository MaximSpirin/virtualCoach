/**
 * Class BallVO
 * Created by maxim_000 on 10/9/2015.
 */
(function (window) {
    /******************* public variables *******************/
    //BallVO.prototype.publicVar = "value";

    /******************* static variables *******************/
    BallVO.STD_WIDTH = 32;
    BallVO.STD_HEIGHT = 32;

    /********************** constructor *********************/
    function BallVO(id, position) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, GraphicElementType.BALL, position);
        this.width = BallVO.STD_WIDTH;
        this.height = BallVO.STD_WIDTH;
    }

    //extend this class from a superclass
    var p = createjs.extend(BallVO, GraphicItemVO);

    // flag for serialization
    p.isEquipment = true;

    /******************** private methods *******************/


    /******************** event handlers ********************/


    /******************* public static method ***************/

    //Make aliases for all superclass methods: SuperClass_methodName
    window.BallVO = createjs.promote(BallVO,"GraphicItemVO");

}(window));
/**
 * Class BallSupplyVO
 * Created by maxim_000 on 10/9/2015.
 */
(function (window) {
    /******************* public variables *******************/
    //BallSupplyVO.prototype.publicVar = "value";

    /******************* static variables *******************/
    BallSupplyVO.STD_WIDTH = 78;
    BallSupplyVO.STD_HEIGHT = 26;

    /********************** constructor *********************/
    function BallSupplyVO(id, position) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, GraphicElementType.BALLS_SUPPLY, position);
        this.width = BallSupplyVO.STD_WIDTH;
        this.height = BallSupplyVO.STD_HEIGHT;
    }

    //extend this class from a superclass
    var p = createjs.extend(BallSupplyVO, GraphicItemVO);

    /******************** private methods *******************/


    /******************** event handlers ********************/


    /******************* public static method ***************/

        //Make aliases for all superclass methods: SuperClass_methodName
    window.BallSupplyVO = createjs.promote(BallSupplyVO,"GraphicItemVO");

}(window));
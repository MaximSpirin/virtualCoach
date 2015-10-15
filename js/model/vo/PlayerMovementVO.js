/**
 * Class PlayerMovementVO
 * Created by maxim_000 on 10/9/2015.
 */
(function (window) {
    /******************* public variables *******************/
    PlayerMovementVO.prototype.startPoint = null;
    PlayerMovementVO.prototype.endPoint = null;
    PlayerMovementVO.prototype.lineWidth = null;
    PlayerMovementVO.prototype.angle = null;
    PlayerMovementVO.prototype.arrowDirection = null;

    /******************* static variables *******************/
    //PlayerMovementVO.staticVar = "value";

    /********************** constructor *********************/
    function PlayerMovementVO(id, startPoint, endPoint, arrowDirection) {
        this.GraphicItemVO_constructor(id, GraphicElementType.PLAYER_MOVEMENT, new createjs.Point(0,0));
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.arrowDirection = (arrowDirection == ArrowDirection.LEFT || arrowDirection == ArrowDirection.RIGHT) ? arrowDirection : ArrowDirection.LEFT;
        updateLineWidth.call(this);
        updateAngle.call(this);
    }

    //extend this class from a superclass
    var p = createjs.extend(PlayerMovementVO, GraphicItemVO);

    /********************* overridden methods ***************/
    p.setStartPoint = function(value){
        this.startPoint = value;
        updateLineWidth.call(this);
        updateAngle.call(this);
        this.dispatchEvent(new ApplicationEvent(ApplicationEvent.GRAPHIC_PROPERTY_CHANGED,{name:"startPoint"}));
        //console.log("start point set to x=", this.startPoint.x);
    };

    p.setEndPoint = function(value){
        this.endPoint = value;
        updateLineWidth.call(this);
        updateAngle.call(this);
        this.dispatchEvent(new ApplicationEvent(ApplicationEvent.GRAPHIC_PROPERTY_CHANGED,{name:"endPoint"}));
    };

    p.invertArrowDirection = function(){
        if(this.arrowDirection == ArrowDirection.RIGHT){
            this.arrowDirection = ArrowDirection.LEFT
        }else{
            this.arrowDirection = ArrowDirection.RIGHT;
        }

        this.dispatchEvent(new ApplicationEvent(ApplicationEvent.GRAPHIC_PROPERTY_CHANGED,{name:"arrowDirection"}));
    };

    // flag for serialization
    p.isActivity = true;

    /******************** private methods *******************/
    function updateLineWidth(){
        this.lineWidth = MathUtils.getDistanceBetween2Points(this.startPoint, this.endPoint);
    }

    function updateAngle() {
        this.angle = MathUtils.getAngleBetween2Points(this.startPoint, this.endPoint);
        this.rotation = this.angle;
    }

    /******************** event handlers ********************/


    /******************* public static method ***************/

    //PlayerMovementVO.staticFunctionName = function(param1){ //method body };


    //Make aliases for all superclass methods: SuperClass_methodName
    window.PlayerMovementVO = createjs.promote(PlayerMovementVO,"GraphicItemVO");

}(window));
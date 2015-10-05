/**
 * Class DribblingLineVO
 * Created by maxim_000 on 10/5/2015.
 */
(function (window) {

    DribblingLineVO.prototype.startPoint = null;
    DribblingLineVO.prototype.endPoint = null;
    DribblingLineVO.prototype.lineWidth = null;
    DribblingLineVO.prototype.angle = null;

    //constructor
    function DribblingLineVO(id, position, startPoint, endPoint) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, GraphicElementType.DRIBBLING_PLAYER, position);

        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.lineWidth = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow((endPoint.y - startPoint.y),2));

        this.calculateAngle();

    }

    //extend this class from a superclass
    var p = createjs.extend(DribblingLineVO, GraphicItemVO);

    p.calculateAngle = function(){
        this.angle = Math.atan2(this.endPoint.y - this.startPoint.y, this.endPoint.x - this.startPoint.x) * 180 / Math.PI;
        console.log("angle=",this.angle);
    };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.DribblingLineVO = createjs.promote(DribblingLineVO,"GraphicItemVO");


}(window));
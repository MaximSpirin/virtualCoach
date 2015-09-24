/**
 * Class NeutralPlayerComponent
 * Created by maxim_000 on 9/18/2015.
 */
(function (window) {
    /**************************************************** public variables *********************************************/
    NeutralPlayerComponent.prototype.outlineShape;
    NeutralPlayerComponent.prototype.letterT;

    /**************************************************** static variables ********************************************/
    NeutralPlayerComponent.STD_RADIUS = 20;
    NeutralPlayerComponent.MIN_SIZE = 20;
    NeutralPlayerComponent.FILL_COLOR = "#085429";


    /**************************************************** constructor **************************************************/

    function NeutralPlayerComponent() {
        this.BaseShapeRenderer_constructor();
        this.initialize();
    }

    //extend this class from a superclass
    var p = createjs.extend(NeutralPlayerComponent,BaseShapeRenderer);

    /************************************************* overridden methods ***********************************************/


    p.initialize = function(){
        this.BaseShapeRenderer_initialize();
        this.outlineShape = new createjs.Shape();
        this.addChild(this.outlineShape);

        this.letterT = new createjs.Shape();
        this.addChild(this.letterT);

    };

    p.render = function(){
        var renderData = this.getRendererData();
        var w = renderData.getWidth();
        var h = renderData.getHeight();

        this.x = renderData.getPosition().x;
        this.y = renderData.getPosition().y;

        this.outlineShape.graphics.clear();
        this.outlineShape.graphics.beginFill(NeutralPlayerComponent.FILL_COLOR);
        this.outlineShape.graphics.drawCircle(w/2, h/2, w/2);

        this.letterT.graphics.clear();
        this.letterT.graphics.beginFill("#ffffff");
        this.letterT.graphics.drawRect(0,0,16,2);
        this.letterT.graphics.drawRect(8-1,2,2,20);
        /*this.letterT.graphics.moveTo(8,0);
        this.letterT.graphics.lineTo(8,22);*/

        this.letterT.x = w/2 - 16/2;
        this.letterT.y = h/2 - 22/2;

    };

    p.getMinimalSize = function(){
        return new createjs.Point(NeutralPlayerComponent.STD_RADIUS, NeutralPlayerComponent.STD_RADIUS);
    };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.NeutralPlayerComponent = createjs.promote(NeutralPlayerComponent, "BaseShapeRenderer");


}(window));
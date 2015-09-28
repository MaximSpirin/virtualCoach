/**
 * Class AttackerComponent
 * Created by maxim_000 on 9/18/2015.
 */
(function (window) {
    /**************************************************** public variables *********************************************/
    AttackerComponent.prototype.outlineShape;

    /**************************************************** static variables ********************************************/
    AttackerComponent.STD_RADIUS = 20;
    AttackerComponent.MIN_SIZE = 20;
    AttackerComponent.FILL_COLOR = "#382CBF";


    /**************************************************** constructor **************************************************/

    function AttackerComponent() {
        this.BaseShapeRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(AttackerComponent,BaseShapeRenderer);

    /************************************************* overridden methods ***********************************************/


    p.initialize = function(){
        this.BaseShapeRenderer_initialize();
        this.outlineShape = new createjs.Shape();
        this.addChild(this.outlineShape);
        console.log("AttackerComponent.initialize()");
    };

    p.render = function(){
        var renderData = this.getRendererData();
        var w = renderData.getWidth();
        var h = renderData.getHeight();

        this.x = renderData.getPosition().x;
        this.y = renderData.getPosition().y;

        this.outlineShape.graphics.clear();
        this.outlineShape.graphics.beginFill(AttackerComponent.FILL_COLOR);
        this.outlineShape.graphics.drawCircle(w/2, h/2, w/2);

    };

    p.getMinimalSize = function(){
        return new createjs.Point(AttackerComponent.MIN_SIZE, AttackerComponent.MIN_SIZE);
    };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.AttackerComponent = createjs.promote(AttackerComponent, "BaseShapeRenderer");


}(window));
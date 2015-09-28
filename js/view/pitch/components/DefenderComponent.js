/**
 * Class DefenderComponent
 * Created by maxim_000 on 9/18/2015.
 */
(function (window) {
    /**************************************************** public variables *********************************************/
    DefenderComponent.prototype.outlineShape;

    /**************************************************** static variables ********************************************/
    DefenderComponent.STD_RADIUS = 20;
    DefenderComponent.MIN_SIZE = 20;
    DefenderComponent.FILL_COLOR = "#F21818";


    /**************************************************** constructor **************************************************/

    function DefenderComponent() {
        this.BaseShapeRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(DefenderComponent,BaseShapeRenderer);

    /************************************************* overridden methods ***********************************************/


    p.initialize = function(){
        this.BaseShapeRenderer_initialize();
        this.outlineShape = new createjs.Shape();
        this.addChild(this.outlineShape);
        console.log("DefenderComponent.initialize()");
    };

    p.render = function(){
        var renderData = this.getRendererData();
        var w = renderData.getWidth();
        var h = renderData.getHeight();

        this.x = renderData.getPosition().x;
        this.y = renderData.getPosition().y;

        this.outlineShape.graphics.clear();
        this.outlineShape.graphics.beginFill(DefenderComponent.FILL_COLOR);
        this.outlineShape.graphics.drawCircle(w/2, h/2, w/2);

    };

    p.getMinimalSize = function(){
        return new createjs.Point(DefenderComponent.MIN_SIZE, DefenderComponent.MIN_SIZE);
    };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.DefenderComponent = createjs.promote(DefenderComponent, "BaseShapeRenderer");


}(window));
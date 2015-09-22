/**
 * Class RectComponent
 * Created by maxim_000 on 9/18/2015.
 */
(function (window) {
    //public variables
    RectComponent.prototype.outlineShape;

    //static variables

    //constructor
    function RectComponent() {
        this.BaseShapeRenderer_constructor();
        this.initialize();
    }

    //extend this class from a superclass
    var p = createjs.extend(RectComponent, BaseShapeRenderer);

    p.initialize = function(){
        this.BaseShapeRenderer_initialize();
        console.log("Rectange created and initialized!");

    };

    p.render = function(){
        var renderData = this.getRendererData();
        var w = renderData.getWidth();
        var h = renderData.getHeight();
        DrawingUtils.drawStrictSizeRectangle(this.graphics, 0, 0, renderData.getWidth(), renderData.getHeight(), 4, "#ffffff");


        this.x = renderData.getPosition().x;
        this.y = renderData.getPosition().y;
    };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.RectComponent = createjs.promote(RectComponent,"BaseShapeRenderer");


}(window));

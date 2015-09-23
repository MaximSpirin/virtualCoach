/**
 * Class RectComponent
 * Created by maxim_000 on 9/18/2015.
 */
(function (window) {
    //public variables
    RectComponent.prototype.outlineShape;

    //static variables
    RectComponent.MIN_WIDTH = 75;
    RectComponent.MIN_HEIGH = 50;

    //constructor
    function RectComponent() {
        this.BaseShapeRenderer_constructor();
        this.initialize();
    }

    //extend this class from a superclass
    var p = createjs.extend(RectComponent, BaseShapeRenderer);

    p.initialize = function(){
        this.BaseShapeRenderer_initialize();
        this.outlineShape = new createjs.Shape();
        this.addChild(this.outlineShape);


    };

    p.getBounds = function(){
        var result = new createjs.Rectangle(this._data.position.x, this._data.position.y, this._data._width, this._data._height);
        return result;
    };

    p.render = function(){
        var renderData = this.getRendererData();
        var w = renderData.getWidth();
        var h = renderData.getHeight();
        DrawingUtils.drawStrictSizeRectangle(this.outlineShape.graphics, 0, 0, renderData.getWidth(), renderData.getHeight(), 4, "#ffffff");

        this.x = renderData.getPosition().x;
        this.y = renderData.getPosition().y;
    };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.RectComponent = createjs.promote(RectComponent,"BaseShapeRenderer");

    p.getMinimalSize = function(){
        return new createjs.Point(RectComponent.MIN_WIDTH, RectComponent.MIN_HEIGH);
    };


}(window));

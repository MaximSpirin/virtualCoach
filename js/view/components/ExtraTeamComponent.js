/**
 * Class ExtraTeamComponent
 * Created by maxim_000 on 9/18/2015.
 */
(function (window) {
    /**************************************************** public variables *********************************************/
    ExtraTeamComponent.prototype.outlineShape;

    /**************************************************** static variables ********************************************/
    ExtraTeamComponent.STD_RADIUS = 20;
    ExtraTeamComponent.MIN_SIZE = 20;
    ExtraTeamComponent.FILL_COLOR = "#373060";


    /**************************************************** constructor **************************************************/

    function ExtraTeamComponent() {
        this.BaseShapeRenderer_constructor();
        this.initialize();
    }

    //extend this class from a superclass
    var p = createjs.extend(ExtraTeamComponent,BaseShapeRenderer);

    /************************************************* overridden methods ***********************************************/


    p.initialize = function(){
        this.BaseShapeRenderer_initialize();
        this.outlineShape = new createjs.Shape();
        this.addChild(this.outlineShape);
    };

    p.render = function(){
        var renderData = this.getRendererData();
        var w = renderData.getWidth();
        var h = renderData.getHeight();

        this.x = renderData.getPosition().x;
        this.y = renderData.getPosition().y;

        this.outlineShape.graphics.clear();
        this.outlineShape.graphics.beginFill(ExtraTeamComponent.FILL_COLOR);
        this.outlineShape.graphics.drawCircle(w/2, h/2, w/2);

    };

    p.getMinimalSize = function(){
        return new createjs.Point(ExtraTeamComponent.STD_RADIUS, ExtraTeamComponent.STD_RADIUS);
    };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.ExtraTeamComponent = createjs.promote(ExtraTeamComponent, "BaseShapeRenderer");


}(window));
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
        this.BaseComponentRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(DefenderComponent,BaseComponentRenderer);

    /************************************************* overridden methods ***********************************************/


    p.initialize = function(){
        this.BaseComponentRenderer_initialize();
        this.outlineShape = new createjs.Shape();
        this.container.addChild(this.outlineShape);
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
        this.outlineShape.graphics.drawCircle(0, 0, w/2);
        this.outlineShape.setBounds(-w/2,-h/2,w,h);
    };

    p.getContentBounds = function(){
        var contentPosInParentCS = this.localToLocal(this.outlineShape._bounds.x, this.outlineShape._bounds.y, this.parent);
        var result = new createjs.Rectangle(contentPosInParentCS.x, contentPosInParentCS.y, this.outlineShape._bounds.width, this.outlineShape._bounds.height);
        return result;
    };

    p.getMinimalSize = function(){
        return new createjs.Point(DefenderComponent.MIN_SIZE, DefenderComponent.MIN_SIZE);
    };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.DefenderComponent = createjs.promote(DefenderComponent, "BaseComponentRenderer");


}(window));
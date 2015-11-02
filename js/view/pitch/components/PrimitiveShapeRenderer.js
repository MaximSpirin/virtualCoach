//##############################################################################
//
//##############################################################################

/**
 * Class PrimitiveShapeRenderer
 * Created by maxim_000 on 10/1/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
    PrimitiveShapeRenderer.prototype.minimalSize;
    PrimitiveShapeRenderer.prototype.textField = null;


    //static variable
    PrimitiveShapeRenderer.CIRCLE_COMPONENT_MIN_RADIUS = 20;

    //constructor
    function PrimitiveShapeRenderer() {
        //invoke constructor of superclass
        this.BaseComponentRenderer_constructor();
        this.mouseChildren = false;
    }

    //extend this class from a superclass
    var p = createjs.extend(PrimitiveShapeRenderer,drillEditor.BaseComponentRenderer);

    p.initialize = function(){
        this.BaseComponentRenderer_initialize();
        this.outlineShape = new createjs.Shape();
        this.container.addChild(this.outlineShape);

        //if(this.rendererData.type!=GraphicElementType.NEUTRAL_PLAYER && this.rendererData.type!=GraphicElementType.CONE){
            this.textField = new createjs.Text("","16px Arial","#ffffff");
            this.container.addChild(this.textField);
       // }
    };

    p.render = function(){

        switch (this.rendererData.type){
            case drillEditor.GraphicElementType.ATTACKER:
            case drillEditor.GraphicElementType.DEFENDER:
            case drillEditor.GraphicElementType.EXTRA_TEAM:
            case drillEditor.GraphicElementType.NEUTRAL_PLAYER:
                this.outlineShape.graphics.clear();
                this.outlineShape.graphics.beginFill(this.rendererData.fillColor);
                this.outlineShape.graphics.drawCircle(0,0,this.rendererData.getWidth()/2);
                this.minimalSize = new createjs.Point(PrimitiveShapeRenderer.CIRCLE_COMPONENT_MIN_RADIUS*2,PrimitiveShapeRenderer.CIRCLE_COMPONENT_MIN_RADIUS*2);

                if(this.rendererData.type == drillEditor.GraphicElementType.NEUTRAL_PLAYER){
                    var letterT = new createjs.Shape();
                    letterT.graphics.clear();
                    letterT.graphics.beginFill("#ffffff");
                    letterT.graphics.drawRect(0,0,16,2);
                    letterT.graphics.drawRect(8-1,2,2,20);
                    letterT.x =  - 16 / 2;
                    letterT.y = - 22 / 2;
                    this.container.addChild(letterT);
                }

                break;

            case drillEditor.GraphicElementType.CONE:
                //to be implemented
                this.outlineShape.graphics.beginFill(this.rendererData.fillColor);
                this.outlineShape.graphics.moveTo(0, -this.rendererData.height/2);
                this.outlineShape.graphics.lineTo(this.rendererData.width/2, this.rendererData.height/2);
                this.outlineShape.graphics.lineTo(-this.rendererData.width/2, this.rendererData.height/2);
                this.outlineShape.graphics.lineTo(0, -this.rendererData.height/2);
                break;
        }

        this.outlineShape.setBounds(-this.rendererData.getWidth()/2,
            - this.rendererData.getHeight()/2,
            this.rendererData.getWidth(),
            this.rendererData.getHeight());
    };

    p.getContentBounds = function(){
        var contentPosInParentCS = this.localToLocal(this.outlineShape._bounds.x, this.outlineShape._bounds.y, this.parent);
        var result = new createjs.Rectangle(contentPosInParentCS.x, contentPosInParentCS.y, this.outlineShape._bounds.width, this.outlineShape._bounds.height);
        return result;
    };

    p.getMinimalSize = function(){
        return this.minimalSize;
    };

    p.graphicPropertyChangeHandler = function(evt){
        switch(evt.payload.name){
            case "playerNumber":
                    this.textField.text = this.rendererData.playerNumber;
                    var tfBounds = this.textField.getBounds();
                    this.textField.x = -tfBounds.width / 2;
                    this.textField.y = -tfBounds.height / 2;
                break;
        }
    };


    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.PrimitiveShapeRenderer = createjs.promote(PrimitiveShapeRenderer,"BaseComponentRenderer");


}());
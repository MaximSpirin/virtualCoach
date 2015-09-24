/**
 * Class TransformTool
 * Created by maxim_000 on 9/23/2015.
 */
(function (window) {
    //public variables
    TransformTool.prototype.target;
    TransformTool.prototype.outline;
    TransformTool.prototype.scaleControl;
    TransformTool.prototype.scalePropotionally;

    //static variable
    TransformTool.OUTLINE_STROKE_SIZE = 2;
    TransformTool.OUTLINE_STROKE_COLOR = "#FF0000";
    TransformTool.SCALE_CONTROL_SIZE = 20;

    //constructor
    function TransformTool() {
        //invoke constructor of superclass
        this.Container_constructor();
        this.initialize();
    }

    //extend this class from a superclass
    var p = createjs.extend(TransformTool,createjs.Container);


    p.initialize = function(){
        this.outline = new createjs.Shape();
        this.addChild(this.outline);


        var scz = 20;
        this.scaleControl = new createjs.Shape();
        this.scaleControl.graphics.beginFill("#FF0000");
        this.scaleControl.graphics.drawRect(0, 0, TransformTool.SCALE_CONTROL_SIZE, TransformTool.SCALE_CONTROL_SIZE);
        this.scaleControl.on("mousedown", function (evt){
            this.scaleControlOffsetX = evt.localX;
            this.scaleControlOffsetY = evt.localY;
        }, this);


        this.scaleControl.pressMoveHandler = this.scaleControl.on("pressmove", function(evt){
            this.scaleControl.visible = true;

            var pointOnTool = this.globalToLocal(evt.stageX, evt.stageY);
            var minAllowedSize = this.target.getMinimalSize();
            var newW = pointOnTool.x - this.scaleControlOffsetX + TransformTool.SCALE_CONTROL_SIZE/2;
            var newH = pointOnTool.y - this.scaleControlOffsetY + TransformTool.SCALE_CONTROL_SIZE/2;

            //w=h if its a square
            if(this.scalePropotionally){
                newW = Math.min(newW, newH);
                newH = newW;
            }

            //prevent going under min size
            if(newW < minAllowedSize.x){
                newW =  minAllowedSize.x;
            }

            if(newH < minAllowedSize.y){
                newH = minAllowedSize.y;
            }

            this.target.getRendererData().resize(newW, newH);
            this.redraw();
            //console.log("Stage point=",evt.stageX, evt.stageY,"Tool point=",pointOnTool.x, pointOnTool.y);
        },this);


        this.scaleControl.visible = false;
        this.addChild(this.scaleControl);

    };

    p.setTarget = function(newTarget){
        if(this.target == newTarget) {
            return;
        }

        if(this.target){
            this.removeTarget();
        }

        this.target = newTarget;

        if(this.target){


            switch (this.target.getRendererData().type){

                case GraphicElementType.RECTANGLE:
                    this.scaleControl.visible = true;

                    break;

                case GraphicElementType.SQUARE:
                    this.scaleControl.visible = true;
                    this.scalePropotionally = true;
                    break;

            }


            this.elementMoveHandler = this.target.on(ApplicationEvent.ELEMENT_MOVE, this.redraw, this);
            this.redraw();
        }
    };

    p.removeTarget = function(){
        this.target.off(ApplicationEvent.ELEMENT_MOVE, this.elementMoveHandler);
        //clear controls
        this.outline.graphics.clear();
        this.scaleControl.visible=false;
        this.scalePropotionally = false;
    };

    p.redraw = function(){
        this.x = this.target.x;
        this.y = this.target.y;

        var bounds = this.target.getBounds();
        var strokeSize = 2;
        DrawingUtils.drawStrictSizeRectangle(this.outline.graphics,
                                            -TransformTool.OUTLINE_STROKE_SIZE,
                                            -TransformTool.OUTLINE_STROKE_SIZE,
                                            TransformTool.OUTLINE_STROKE_SIZE*2 + bounds.width,
                                            TransformTool.OUTLINE_STROKE_SIZE*2 + bounds.height,
                                            TransformTool.OUTLINE_STROKE_SIZE,
                                            TransformTool.OUTLINE_STROKE_COLOR);

        if(this.scaleControl.visible){
            this.scaleControl.x = bounds.width + TransformTool.OUTLINE_STROKE_SIZE - 20/2 - 1;
            this.scaleControl.y = bounds.height + TransformTool.OUTLINE_STROKE_SIZE - 20/2 - 1;
        }
    };







    // public functions
    //TransformTool.prototype.publicFunction = function (param1) { };

    //private functions
    //function privateFunction(param) { }

    //public static method
    //TransformTool.staticFunctionName = function(param1){ //method body };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.TransformTool = createjs.promote(TransformTool,"Container");

}(window));
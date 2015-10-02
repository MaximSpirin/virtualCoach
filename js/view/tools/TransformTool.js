/**
 * Class TransformTool
 * Created by maxim_000 on 9/23/2015.
 */
(function (window) {
    //public variables
    TransformTool.prototype.target;
    TransformTool.prototype.outline;
    TransformTool.prototype.scaleControl;
    TransformTool.prototype.rotationControl;
    TransformTool.prototype.rotationTool;
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

        //this.rotationControl = new createjs.Shape();
        var rotationIcon = new createjs.Bitmap(Main.loadQueue.getResult("rotation-icon"));
        rotationIcon.x = -16;
        rotationIcon.y = -16;
        this.rotationControl = new createjs.Container();
        this.rotationControl.addChild(rotationIcon);
        this.rotationControl.setBounds(-16,-16,32,32);
        this.rotationControl.snapToPixel = true;


        this.rotationTool = new RotationTool(0,0, this.rotationControl,0);
        this.rotationTool.visible = false;
        this.rotationTool.on("change",rotationChangeHandler, this);
        this.addChild(this.rotationTool);


        this.scaleControl = new createjs.Shape();
        this.scaleControl.graphics.beginFill("#FF0000");
        this.scaleControl.graphics.drawRect(0, 0, TransformTool.SCALE_CONTROL_SIZE, TransformTool.SCALE_CONTROL_SIZE);
        this.scaleControl.on("mousedown", function (evt){
            this.scaleControlOffsetX = evt.localX;
            this.scaleControlOffsetY = evt.localY;
        }, this);

        this.scaleControl.pressMoveHandler = this.scaleControl.on("pressmove", function(evt){
            this.scaleControl.visible = true;

            var targetBounds = this.target.getContentBounds();

            var pointOnTool = this.globalToLocal(evt.stageX, evt.stageY);
            var minAllowedSize = this.target.getMinimalSize();
            var newW = pointOnTool.x - this.scaleControlOffsetX + TransformTool.SCALE_CONTROL_SIZE/2 - targetBounds.x;
            //var newH = pointOnTool.y - this.scaleControlOffsetY + TransformTool.SCALE_CONTROL_SIZE/2 - targetBounds.y;
            //var newH = pointOnTool.y - this.scaleControlOffsetY + TransformTool.SCALE_CONTROL_SIZE/2 - (targetBounds.y+targetBounds.height);
            var newH = pointOnTool.y - targetBounds.y - this.scaleControlOffsetY + TransformTool.SCALE_CONTROL_SIZE / 2;

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

            this.target.rendererData.resize(newW, newH);
            this.redraw();
            //console.log("Stage point=",evt.stageX, evt.stageY,"Tool point=",pointOnTool.x, pointOnTool.y);
        },this);

        this.scaleControl.visible = false;
        this.addChild(this.scaleControl);

        Dispatcher.getInstance().on(ApplicationEvent.ELEMENT_SELECTED, elementSelectedHandler, this);

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

            switch (this.target.rendererData.type){

                case GraphicElementType.RECTANGLE:
                    this.scaleControl.visible = true;
                    break;

                case GraphicElementType.SQUARE:
                    this.scaleControl.visible = true;
                    this.scalePropotionally = true;
                    break;

                case GraphicElementType.ARC:
                    this.rotationTool.visible = true;

                    break;

                default:
                    //this.rotationTool.visible = true;
                    break;
            }

            this.elementMoveHandler = this.target.on(ApplicationEvent.ELEMENT_MOVE, this.redraw, this);
            this.elementRotateHandler = this.target.rendererData.on(ApplicationEvent.ELEMENT_ROTATION_CHANGED, elementRotationChangedHandler, this);
            this.redraw();
        }
    };

    p.removeTarget = function(){
        this.target.off(ApplicationEvent.ELEMENT_MOVE, this.elementMoveHandler);
        //clear controls
        this.outline.graphics.clear();
        this.scaleControl.visible = false;
        this.scalePropotionally = false;
        this.rotationTool.visible = false;
    };

    p.redraw = function(){

        var localBounds = this.target.getContentBounds();

        this.outline.x = localBounds.x + localBounds.width/2;
        this.outline.y = localBounds.y + localBounds.height/2;

        this.outline.regX = localBounds.width/2;
        this.outline.regY = localBounds.height/2;
        this.outline.rotation = this.target.rendererData.rotation;

        DrawingUtils.drawStrictSizeRectangle(this.outline.graphics,
            -TransformTool.OUTLINE_STROKE_SIZE,
            -TransformTool.OUTLINE_STROKE_SIZE,
            TransformTool.OUTLINE_STROKE_SIZE*2 + localBounds.width,
            TransformTool.OUTLINE_STROKE_SIZE*2 + localBounds.height,
            TransformTool.OUTLINE_STROKE_SIZE,
            TransformTool.OUTLINE_STROKE_COLOR);

        if(this.scaleControl.visible){
            this.scaleControl.x = localBounds.x + localBounds.width + TransformTool.OUTLINE_STROKE_SIZE - 20/2 - 1;
            this.scaleControl.y = localBounds.y + localBounds.height + TransformTool.OUTLINE_STROKE_SIZE - 20/2 - 1;
        }

        if(this.rotationTool.visible){
            this.rotationTool.x = this.target.x;
            this.rotationTool.y = this.target.y;
            this.rotationTool.setRadius(localBounds.width/2 + 10, localBounds.width/2 + 10);
            //read target's rotation and pass it to the rotationTool
            var itemRotation = this.target.rendererData.rotation;
            this.rotationTool.updatePositionFromDegree(itemRotation);
        }
    };

    /*************************************************** event handlers **********************************************/
    function rotationChangeHandler(event){
        this.target.container.rotation = this.rotationTool.angle;
        this.target.rendererData.setRotation(this.rotationTool.angle, true);

       // console.log("rotating component to: " + this.rotationTool.angle);
    }

    function elementRotationChangedHandler(event){
        this.outline.rotation = this.target.rendererData.rotation;
    }

    function elementSelectedHandler(event){
       this.setTarget(event.payload.data);
    }


    window.TransformTool = createjs.promote(TransformTool,"Container");

}(window));
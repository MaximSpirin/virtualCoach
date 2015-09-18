/**
 * Class PresentationComponent
 * Created by maxim_000 on 9/18/2015.
 */
(function (window) {
    //public variables
    PresentationComponent.prototype.selected = false;
    PresentationComponent.prototype.selectionOutline;
    PresentationComponent.prototype.componentWidth;
    PresentationComponent.prototype.componentHeight;

    //static variable
    PresentationComponent.SELECTION_STROKE_SIZE = 4;

    //constructor
    function PresentationComponent() {
        //invoke constructor of superclass
        this.Container_constructor();
        this.initialize();
    }

    //extend this class from a superclass
    var p = createjs.extend(PresentationComponent, createjs.Container);

    // public functions
    PresentationComponent.prototype.initialize = function () {
        this.selectionOutline = new createjs.Shape();

        this.on("mousedown", function(evt){
           this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
        });


        this.on("pressmove", function(evt){
            this.x = evt.stageX + this.offset.x;
            this.y = evt.stageY + this.offset.y;
        });
    };

    PresentationComponent.prototype.setSelection = function(){
        this.selectionOutline.graphics.setStrokeStyle(4).beginStroke("#FF0000").beginFill("#FFFFFF");
       // this.selectionOutline.graphics.drawRect(-PresentationComponent.SELECTION_STROKE_SIZE/2, -PresentationComponent.SELECTION_STROKE_SIZE/2, this.componentWidth + PresentationComponent.SELECTION_STROKE_SIZE/2, this.componentHeight + PresentationComponent.SELECTION_STROKE_SIZE/2);
        this.selectionOutline.graphics.drawRect(0, 0, this.componentWidth, this.componentHeight);
        this.addChild(this.selectionOutline);
    };

    PresentationComponent.prototype.removeSelection = function(){
        this.selectionOutline.graphics.clear();
        if(this.contains(this.selectionOutline)){
            this.removeChild(this.selectionOutline);
        }
    };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.PresentationComponent = createjs.promote(PresentationComponent, "Container");

}(window));
/**
 * Class SizeHint
 * Created by maxim_000 on 9/23/2015.
 */
(function (window) {
    //public variables
    SizeHint.prototype.componentWidth;
    SizeHint.prototype.componentHeight;
    SizeHint.prototype.strokeShape;
    SizeHint.prototype.text;
    SizeHint.prototype.label;

    //static variable
    //SizeHint.staticVar = "value";

    //constructor
    function SizeHint(width, height, text) {
        //invoke constructor of superclass
        this.Container_constructor();
        this.componentWidth = width;
        this.componentHeight = height;
        this.text = text;
        this.initialize();

    }

    //extend this class from a superclass
    var p = createjs.extend(SizeHint, createjs.Container);

    p.initialize = function(){
        this.strokeShape = new createjs.Shape();
        this.addChild(this.strokeShape);

        this.label = new createjs.Text(this.text, "12px Arial", "#000000");
        this.addChild(this.label);

        this.strokeMask = new createjs.Shape();
        this.strokeShape.mask = this.strokeMask;

        if(this.componentWidth && this.componentHeight){
            this.render();
        }
    };

    // public functions
    p.setSize = function (width, height) {
        this.componentWidth = width;
        this.componentHeight = height;
        this.render();
    };

    p.render = function(){

        var arrowW = 5;
        var arrowH = 8;
        var lineWidth = this.componentWidth - 2*arrowW;

        this.strokeShape.graphics.clear();
        this.strokeShape.graphics.beginFill("rgba(0,255,0,0.3)");
        this.strokeShape.graphics.drawRect(0,0,this.componentWidth, this.componentHeight);
        
        this.strokeShape.graphics.beginFill("#FF0000");
        this.strokeShape.graphics.moveTo(0, this.componentHeight/2);
        this.strokeShape.graphics.lineTo(arrowW, this.componentHeight/2 - arrowH/2);
        this.strokeShape.graphics.lineTo(arrowW, this.componentHeight/2 + arrowH/2);
        this.strokeShape.graphics.lineTo(0, this.componentHeight/2);

        this.strokeShape.graphics.beginStroke("#FF0000");
        this.strokeShape.graphics.setStrokeStyle(1.25);
        this.strokeShape.graphics.setStrokeDash([5,2],0);
        this.strokeShape.graphics.moveTo(arrowW, this.componentHeight/2);
        this.strokeShape.graphics.lineTo(arrowW + lineWidth,this.componentHeight/2);
        this.strokeShape.graphics.endStroke();

        this.strokeShape.graphics.moveTo(arrowW + lineWidth,this.componentHeight/2 - arrowH/2);
        this.strokeShape.graphics.lineTo(this.componentWidth, this.componentHeight/2);
        this.strokeShape.graphics.lineTo(this.componentWidth - arrowW, this.componentHeight/2 + arrowH/2);
        this.strokeShape.graphics.lineTo(this.componentWidth - arrowW, this.componentHeight/2 - arrowH/2);

        var textBounds = this.label.getBounds();
        this.label.x = this.componentWidth/2 - textBounds.width / 2;
        this.label.y = this.componentHeight/2 - textBounds.height / 2;

        this.strokeMask.graphics.clear();
        this.strokeMask.graphics.beginFill("#000000");
        this.strokeMask.graphics.drawRect(0,0,this.label.x - 2,this.componentHeight);
        this.strokeMask.graphics.drawRect(this.label.x + textBounds.width + 2, 0, 
                                          this.componentWidth - (this.label.x + textBounds.width + 2),
                                         this.componentHeight);
    };

    //private functions
    //function privateFunction(param) { }

    //public static method
    //SizeHint.staticFunctionName = function(param1){ //method body };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.SizeHint = createjs.promote(SizeHint,"Container");


}(window));
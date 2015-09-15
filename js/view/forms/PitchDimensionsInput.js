/**
 * Class PitchDimensionsInput
 * Created by maxim_000 on 9/15/2015.
 */
(function (window) {
    //public variables
    PitchDimensionsInput.prototype.background;
    PitchDimensionsInput.prototype.headerText;

    //constructor
    function PitchDimensionsInput(initParams) {
        //call superclass constructor
        this.Form_constructor(initParams);
    }

    var p = createjs.extend(PitchDimensionsInput, Form);

    p.destroy = function(){

    };

    p.constructForm = function(){
        this.background = new createjs.Shape();

        this.background.graphics.beginFill("#FFFFFF");
        this.background.graphics.drawRect(0, 0, ApplicationModel.APP_WIDTH, ApplicationModel.APP_HEIGHT);
        this.addChild(this.background);

        this.headerText = new createjs.Text("Please enter pitch dimensions","25px Arial","#000000");
        this.headerText.x = ApplicationModel.APP_WIDTH/2 - this.headerText.getBounds().width / 2;
        this.headerText.y = 10;
        this.addChild(this.headerText);

        this.on("click",function(){
            //console.log("HOPPA!");
        })
    };

    // public functions
    //PitchDimensionsInput.prototype.publicFunction = function (param1) { };

    //private functions
    //function privateFunction(param) { }

    //public static method
    //PitchDimensionsInput.staticFunctionName = function(param1){ //method body };

    window.PitchDimensionsInput = createjs.promote(PitchDimensionsInput, "Form");




}(window));
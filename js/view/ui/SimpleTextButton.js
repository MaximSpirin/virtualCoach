(function(){

    SimpleTextButton.DEFAULT_FONT = "20px Arial";
    SimpleTextButton.DEFAULT_TEXT_COLOR = "#000000";
    SimpleTextButton.prototype.buttonWidth = null;
    SimpleTextButton.prototype.buttonHeight = null;
    SimpleTextButton.prototype.background = null;
    SimpleTextButton.prototype.text = null;

    /**
     * Creates a simple text button
     * @param label
     * @param labelFont
     * @param labelColor
     * @param upColor
     * @param downColor
     * @param overColor
     * @param buttonWidth
     * @constructor
     */
    function SimpleTextButton(label, labelFont, labelColor, upColor, downColor, overColor, buttonWidth) {
        this.Container_constructor();
        this.label = label;
        this.labelFont = labelFont ? labelFont : SimpleTextButton.DEFAULT_FONT;
        this.labelColor = labelColor ? labelColor : SimpleTextButton.DEFAULT_TEXT_COLOR;
        this.upColor = upColor;
        this.downColor = downColor;
        this.overColor = overColor;
        this.buttonWidth = buttonWidth ? buttonWidth : null;
        this.applicationModel = ApplicationModel.getInstance();
        this.setup();
    }
    var p = createjs.extend(SimpleTextButton, createjs.Container);

    p.setup = function() {
        this.text = new createjs.Text(this.label, this.labelFont, this.labelColor);
        this.text.textBaseline = "top";
        this.text.textAlign = "center";

        if(this.buttonWidth == null || this.buttonWidth == undefined){
            this.buttonWidth = this.text.getMeasuredWidth() + 30;
        }

        this.buttonHeight = this.text.getMeasuredHeight() + 20;

        this.text.x = this.buttonWidth/2;
        this.text.y = 10;

        this.background = new createjs.Shape();
        this.background.graphics.beginFill(this.upColor).drawRoundRect(0, 0, this.buttonWidth, this.buttonHeight, 10);

        this.addChild(this.background, this.text);

        this.on("mousedown", this.handleMouseDown);
        this.on("pressup", this.handlePressUp);

        this.on("click", this.handleClick);

        if(this.applicationModel.platformInfo.mobile){

        }


        /*this.on("rollover", this.handleRollOver);
        this.on("rollout", this.handleRollOut);*/

        this.cursor = "pointer";

        this.mouseChildren = false;

        this.offset = Math.random()*10;
        this.count = 0;
    } ;

    p.handleMouseDown = function(event){
        this.setState("down");
        //this.stage.addEventListener("stagemouseup", this.stageMouseUpHandler);
        /*this.background.graphics.clear();
        this.background.graphics.beginFill(this.downColor).drawRoundRect(0,0,this.buttonWidth,this.buttonHeight,10);*/
    };



    p.handlePressUp = function(event){
        this.setState("up");
        /*this.background.graphics.clear();
        this.background.graphics.beginFill(this.upColor).drawRoundRect(0,0,this.buttonWidth,this.buttonHeight,10);*/
    };

    p.handleClick = function (event) {
       // this.setState("up");
       // alert("You clicked on a button: "+this.label);
        /*this.background.graphics.clear();
        this.background.graphics.beginFill(this.upColor).drawRoundRect(0,0,this.buttonWidth, this.buttonHeight,10);*/
    } ;



    p.handleRollOver = function(event) {
        //TODO: redraw rect with over color
        //this.alpha = event.type == "rollover" ? 0.6 : 1;

        /*this.background.graphics.clear();
        this.background.graphics.beginFill(this.overColor).drawRoundRect(0,0,this.buttonWidth, this.buttonHeight,10);*/
    };

    p.handleRollOut = function(event){
        /*this.background.graphics.clear();
        this.background.graphics.beginFill(this.upColor).drawRoundRect(0,0,this.buttonWidth, this.buttonHeight,10);*/
    };

    SimpleTextButton.prototype.setState = function(newState){
        //console.log("button went to state:" + newState);
        // var bgColor;
          switch (newState){
              case "down":
                    bgColor = this.downColor;
                  break;

              case "up":
                  bgColor = this.upColor;
                  break;
          }

        if(bgColor){
            this.background.graphics.clear();
            this.background.graphics.beginFill(bgColor).drawRoundRect(0,0,this.buttonWidth,this.buttonHeight,10);
        }
    };

    SimpleTextButton.prototype.destroy = function(){
        this.removeAllEventListeners();
    };

    SimpleTextButton.prototype.clickHandler = function(evt){

    };

    window.SimpleTextButton = createjs.promote(SimpleTextButton, "Container");
}(window));
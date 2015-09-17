/**
 * Class Editor
 * Created by maxim_000 on 9/14/2015.
 */
(function (window) {
    //public variables
    Editor.prototype.backgroundShape;
    Editor.prototype.exitButton;
    Editor.prototype.presentation;
    Editor.prototype.toolBarBounds;
    Editor.prototype.pitchBounds;
    Editor.prototype.pitchOutline;
    Editor.prototype.pitchShape;
    Editor.prototype.toolPanel;


    //static variable
    //Editor.staticVar = "value";
    Editor.TOOL_BAR_WIDTH = 115;
    Editor.UI_CONTROLS_MARGIN = 10;

    //constructor
    function Editor(presentation) {

        this.presentation = presentation;

        // call constructor of the superclass
        this.AppScreen_constructor();

        //construct UI
        this.constructScreenUI();
        //initialize code
        this.initialize();

    }

    //create inheritance
    var p = createjs.extend(Editor, AppScreen);

    p.constructScreenUI = function(){
        //create bg
        this.backgroundShape = new createjs.Shape();
        //this.backgroundShape.graphics.beginFill("#99CA3B").drawRect(0, 0, ApplicationModel.APP_WIDTH, ApplicationModel.APP_HEIGHT);
        this.backgroundShape.graphics.beginLinearGradientFill(["#1E5799", "#7db9e8"],[0,1],0,0,0,ApplicationModel.APP_HEIGHT).drawRect(0, 0, ApplicationModel.APP_WIDTH, ApplicationModel.APP_HEIGHT);
        this.addChild(this.backgroundShape);

        //calculate size of pitch viewport area
        this.pitchViewportBounds = new createjs.Rectangle(Editor.UI_CONTROLS_MARGIN,
            Editor.UI_CONTROLS_MARGIN,
            ApplicationModel.APP_WIDTH - 3*Editor.UI_CONTROLS_MARGIN - Editor.TOOL_BAR_WIDTH,
            ApplicationModel.APP_HEIGHT - 2*Editor.UI_CONTROLS_MARGIN);

        this.pitchShape = new createjs.Shape();
        this.addChild(this.pitchShape);

        //draw pitch outline
        this.pitchOutline = new createjs.Shape();
        this.pitchOutline.graphics.clear();
        this.pitchOutline.graphics.setStrokeStyle(1);
        this.pitchOutline.graphics.beginStroke("#FFFFFF").drawRect(0, 0, this.pitchViewportBounds.width, this.pitchViewportBounds.height);
        this.pitchOutline.x = this.pitchViewportBounds.x;
        this.pitchOutline.y = this.pitchViewportBounds.y;
        this.pitchOutline.visible = false;
        this.addChild(this.pitchOutline);

        //calculate toolbar bounds
        this.toolBarBounds = new createjs.Rectangle(ApplicationModel.APP_WIDTH - Editor.TOOL_BAR_WIDTH - Editor.UI_CONTROLS_MARGIN,
            Editor.UI_CONTROLS_MARGIN,
            Editor.TOOL_BAR_WIDTH,
            ApplicationModel.APP_HEIGHT - Editor.UI_CONTROLS_MARGIN*2);

        this.toolPanel = new ToolPanel(this.toolBarBounds.width, this.toolBarBounds.height);
        this.toolPanel.x = this.toolBarBounds.x;
        this.toolPanel.y = this.toolBarBounds.y;
        this.addChild(this.toolPanel);

        /*
        //calculate size of pitch viewport area
        this.pitchViewportBounds = new createjs.Rectangle(Editor.UI_CONTROLS_MARGIN,
                                                        Editor.UI_CONTROLS_MARGIN,
                                                        ApplicationModel.APP_WIDTH - 3*Editor.UI_CONTROLS_MARGIN - Editor.TOOL_BAR_WIDTH,
                                                        ApplicationModel.APP_HEIGHT - 2*Editor.UI_CONTROLS_MARGIN);

        //demo outline
        var pitchOutline = new createjs.Shape();
        pitchOutline.graphics.setStrokeStyle(1);
        pitchOutline.graphics.beginStroke("#FFFFFF").drawRect(0, 0, this.pitchViewportBounds.width, this.pitchViewportBounds.height);

        pitchOutline.x = this.pitchViewportBounds.x;
        pitchOutline.y = this.pitchViewportBounds.y;
        this.addChild(pitchOutline);
        */

    };

    p.initialize = function(){
        if(!this.presentation.pitchWidth || !this.presentation.pitchHeight){
            this.showForm(PitchSizeInputFormHTML,{
                positiveCallback:this.sizeInputPositiveCallback,
                callbackScope: this
            });
        } else {
            //TODO: visualize presentation data
        }

    };

    //called when user hits proceed button on size input form
    p.sizeInputPositiveCallback = function(w,h){
        this.presentation.pitchWidth =  w;
        this.presentation.pitchHeight = h;
        this.redrawPitch();
    };

    p.redrawPitch = function(){
        var pitchDisplayWidth;
        var pitchDisplayHeight;

        var ratio = this.presentation.pitchWidth / this.presentation.pitchHeight;

        if(this.presentation.pitchWidth > this.presentation.pitchHeight){
            pitchDisplayWidth = this.pitchViewportBounds.width;
            pitchDisplayHeight =  pitchDisplayWidth / ratio;
        } else {
            pitchDisplayHeight = this.pitchViewportBounds.height;
            pitchDisplayWidth = ratio * pitchDisplayHeight;
        }

        if(pitchDisplayHeight > this.pitchViewportBounds.height){
            var prevH = pitchDisplayHeight;
            pitchDisplayHeight = this.pitchViewportBounds.height;
            pitchDisplayWidth = pitchDisplayHeight * (pitchDisplayWidth/prevH);
        } else if(pitchDisplayWidth > this.pitchViewportBounds.width){
            var prevW = pitchDisplayWidth;
            pitchDisplayWidth = this.pitchViewportBounds.width;
            pitchDisplayHeight = pitchDisplayWidth/(prevW/pitchDisplayHeight)
        }

        this.pitchShape.graphics.clear();

        this.pitchShape.graphics.setStrokeStyle(2);
        this.pitchShape.graphics.beginStroke("#FFFFFF");
        this.pitchShape.graphics.beginFill("#99CA3B");
        this.pitchShape.graphics.drawRect(0, 0, pitchDisplayWidth, pitchDisplayHeight);
        this.pitchShape.x = this.pitchViewportBounds.x + this.pitchViewportBounds.width/2 - pitchDisplayWidth/2;
        this.pitchShape.y = this.pitchViewportBounds.y + this.pitchViewportBounds.height/2 - pitchDisplayHeight/2;

        console.warn("pitch size ratio = " + Number(pitchDisplayWidth/pitchDisplayHeight).toFixed(4));

    };

    p.destroy = function(){
        this.AppScreen_destroy();

        //destroy things related to Editor
        this.exitButton.removeAllEventListeners();
        this.exitButton.destroy();

        console.log("Editor destroyed");
    };

    function exitClickHandler(evt){
        //TODO: exit properly from the edit mode - possible show an yes/no dialog
        window.main.showAppScreen(AppScreen.MAIN_MENU);
    }

    window.Editor = createjs.promote(Editor, "AppScreen");

}(window));
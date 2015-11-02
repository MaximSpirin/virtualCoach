//##############################################################################
//
//##############################################################################

/**
 * Class Editor
 * Created by maxim_000 on 9/14/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
    Editor.prototype.backgroundShape = null;
    Editor.prototype.exitButton = null;
    Editor.prototype.presentation = null;
    Editor.prototype.toolBarBounds = null;
    Editor.prototype.componentsPalleteBounds = null;
    Editor.prototype.pitchBounds = null;
    Editor.prototype.pitchOutline = null;
    Editor.prototype.pitch = null;
    Editor.prototype.toolsPanel = null;
    Editor.prototype.componentsPallete = null;
    Editor.prototype.presentationController = null;
    Editor.prototype.pitchDisplayWidth = 0;
    Editor.prototype.pitchDisplayHeight = 0;


    Editor.UI_CONTROLS_MARGIN = 10;

    //constructor
    function Editor() {
        // call constructor of the superclass
        this.AppScreen_constructor();

        //initialize code
        this.initialize();

    }

    //create inheritance
    var p = createjs.extend(Editor, drillEditor.AppScreen);


    p.initialize = function(){
        this.presentationController = drillEditor.PresentationController.getInstance();

        //create bg
        this.backgroundShape = new createjs.Shape();
        this.backgroundShape.graphics.beginLinearGradientFill(["#1E5799", "#7db9e8"],[0,1],0,0,0,drillEditor.ApplicationModel.APP_HEIGHT).drawRect(0, 0, drillEditor.ApplicationModel.APP_WIDTH, drillEditor.ApplicationModel.APP_HEIGHT);
        this.addChild(this.backgroundShape);

        if(!this.presentationController.componentsPallete){
          //calculate toolbar bounds
          this.presentationController.componentsPalleteBounds = new createjs.Rectangle(drillEditor.ApplicationModel.APP_WIDTH - drillEditor.ComponentsPallete.PANEL_STD_WIDTH - Editor.UI_CONTROLS_MARGIN,
              Editor.UI_CONTROLS_MARGIN,
              drillEditor.ComponentsPallete.PANEL_STD_WIDTH,
              drillEditor.ApplicationModel.APP_HEIGHT - Editor.UI_CONTROLS_MARGIN*2);
          this.presentationController.componentsPallete = new drillEditor.ComponentsPallete(this.presentationController.componentsPalleteBounds.width, this.presentationController.componentsPalleteBounds.height);
          this.presentationController.componentsPallete.x = this.presentationController.componentsPalleteBounds.x;
          this.presentationController.componentsPallete.y = this.presentationController.componentsPalleteBounds.y;
          console.warn("components pallete created");
        }
        this.componentsPallete = this.presentationController.componentsPallete;
        this.addChild(this.componentsPallete);

        if(!this.presentationController.toolsPanel){
              this.presentationController.toolBarBounds = new createjs.Rectangle(Editor.UI_CONTROLS_MARGIN,
              Editor.UI_CONTROLS_MARGIN,
              drillEditor.ApplicationModel.APP_WIDTH - 3*Editor.UI_CONTROLS_MARGIN - drillEditor.ComponentsPallete.PANEL_STD_WIDTH,
              drillEditor.ToolsPanel.PANEL_STD_HEIGHT);

              this.presentationController.toolsPanel = new drillEditor.ToolsPanel(this.presentationController.toolBarBounds.width, this.presentationController.toolBarBounds.height);
              this.presentationController.toolsPanel.x = this.presentationController.toolBarBounds.x;
              this.presentationController.toolsPanel.y = this.presentationController.toolBarBounds.y;
              console.warn("tools panel created");
        }
        this.toolsPanel = this.presentationController.toolsPanel;
        this.addChild(this.toolsPanel);

        //calculate size of pitch viewport area
        this.pitchViewportBounds = new createjs.Rectangle(Editor.UI_CONTROLS_MARGIN,
            this.presentationController.toolBarBounds.y + this.presentationController.toolBarBounds.height + Editor.UI_CONTROLS_MARGIN,
            drillEditor.ApplicationModel.APP_WIDTH - 3*Editor.UI_CONTROLS_MARGIN - drillEditor.ComponentsPallete.PANEL_STD_WIDTH,
            drillEditor.ApplicationModel.APP_HEIGHT - 3*Editor.UI_CONTROLS_MARGIN - drillEditor.ToolsPanel.PANEL_STD_HEIGHT);

        this.pitch = new drillEditor.Pitch();
        this.addChild(this.pitch);

        drillEditor.PresentationController.getInstance().setView(this.pitch);

        //draw pitch outline
        this.pitchOutline = new createjs.Shape();
        this.pitchOutline.graphics.clear();
        this.pitchOutline.graphics.setStrokeStyle(1);
        this.pitchOutline.graphics.beginStroke("#FFFFFF").drawRect(0, 0, this.pitchViewportBounds.width, this.pitchViewportBounds.height);
        this.pitchOutline.x = this.pitchViewportBounds.x;
        this.pitchOutline.y = this.pitchViewportBounds.y;
        this.pitchOutline.visible = false;
        this.addChild(this.pitchOutline);



        if(!this.presentationController.presentation.pitchWidth || !this.presentationController.presentation.pitchHeight){
            this.showForm(drillEditor.PitchSizeInputFormHTML,{
                positiveCallback:this.sizeInputPositiveCallback,
                negativeCallback:this.sizeInputNegativeCallback,
                callbackScope: this
            });
        } else {
            //visualize presentation data
            this.createPitchView();
        }

    };

    //called when user hits proceed button on size input form
    p.sizeInputPositiveCallback = function(w,h){
        this.removeForm();
        this.presentationController.presentation.pitchWidth =  w;
        this.presentationController.presentation.pitchHeight = h;
        this.createPitchView();
    };

    p.sizeInputNegativeCallback = function(){
        //this.removeForm();
        //drillEditor.drillEditorApplication.showAppScreen(drillEditor.AppScreen.MAIN_MENU);
        drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.SHOW_SCREEN,{screenId:drillEditor.AppScreen.MAIN_MENU}));
    };

    p.createPitchView = function(){

        var ratio = this.presentationController.presentation.pitchWidth / this.presentationController.presentation.pitchHeight;

        if(this.presentationController.presentation.pitchWidth > this.presentationController.presentation.pitchHeight){
            this.pitchDisplayWidth = this.pitchViewportBounds.width;
            this.pitchDisplayHeight =  this.pitchDisplayWidth / ratio;
        } else {
            this.pitchDisplayHeight = this.pitchViewportBounds.height;
            this.pitchDisplayWidth = ratio * this.pitchDisplayHeight;
        }

        if(this.pitchDisplayHeight > this.pitchViewportBounds.height){
            var prevH = this.pitchDisplayHeight;
            this.pitchDisplayHeight = this.pitchViewportBounds.height;
            this.pitchDisplayWidth = this.pitchDisplayHeight * (this.pitchDisplayWidth/prevH);
        } else if(this.pitchDisplayWidth > this.pitchViewportBounds.width){
            var prevW = this.pitchDisplayWidth;
            this.pitchDisplayWidth = this.pitchViewportBounds.width;
            this.pitchDisplayHeight = this.pitchDisplayWidth/(prevW/this.pitchDisplayHeight)
        }

        drillEditor.ApplicationModel.getInstance().mpp = this.presentationController.presentation.pitchWidth/this.pitchDisplayWidth;

        this.pitch.setSize(this.pitchDisplayWidth, this.pitchDisplayHeight);

        this.pitch.x = this.pitchViewportBounds.x + this.pitchViewportBounds.width/2 - this.pitchDisplayWidth/2;
        this.pitch.y = this.pitchViewportBounds.y + this.pitchViewportBounds.height/2 - this.pitchDisplayHeight/2;

        console.warn("pitch size ratio = " + Number(this.pitchDisplayWidth/this.pitchDisplayHeight).toFixed(4));

        drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.PITCH_VIEW_CREATED));


    };

    p.destroy = function(){
        this.AppScreen_destroy();

        //remove components pallete and tools panel from screen
        if(this.contains(this.componentsPallete)){
          this.removeChild(this.componentsPallete);
          console.log("components pallete removed from screen");
        }

        if(this.contains(this.toolsPanel)){
          this.removeChild(this.toolsPanel);
          console.log("tools panel removed from screen");
        }

        //TODO: destroy drillEditor.Pitch instance

        console.log("Editor destroyed");
    };



    drillEditor.Editor = createjs.promote(Editor, "AppScreen");

}());

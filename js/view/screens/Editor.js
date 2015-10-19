/**
 * Class Editor
 * Created by maxim_000 on 9/14/2015.
 */
(function (window) {
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
    //function Editor(presentation) {

        //this.presentationController.presentation = presentation;

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
        this.backgroundShape.graphics.beginLinearGradientFill(["#1E5799", "#7db9e8"],[0,1],0,0,0,ApplicationModel.APP_HEIGHT).drawRect(0, 0, ApplicationModel.APP_WIDTH, ApplicationModel.APP_HEIGHT);
        this.addChild(this.backgroundShape);

        //calculate toolbar bounds
        this.componentsPalleteBounds = new createjs.Rectangle(ApplicationModel.APP_WIDTH - ComponentsPallete.PANEL_STD_WIDTH - Editor.UI_CONTROLS_MARGIN,
            Editor.UI_CONTROLS_MARGIN,
            ComponentsPallete.PANEL_STD_WIDTH,
            ApplicationModel.APP_HEIGHT - Editor.UI_CONTROLS_MARGIN*2);

        this.componentsPallete = new ComponentsPallete(this.componentsPalleteBounds.width, this.componentsPalleteBounds.height);
        this.componentsPallete.x = this.componentsPalleteBounds.x;
        this.componentsPallete.y = this.componentsPalleteBounds.y;
        this.addChild(this.componentsPallete);

        this.toolBarBounds = new createjs.Rectangle(Editor.UI_CONTROLS_MARGIN,
            Editor.UI_CONTROLS_MARGIN,
            ApplicationModel.APP_WIDTH - 3*Editor.UI_CONTROLS_MARGIN - ComponentsPallete.PANEL_STD_WIDTH,
            ToolsPanel.PANEL_STD_HEIGHT);

        this.toolsPanel = new ToolsPanel(this.toolBarBounds.width, this.toolBarBounds.height);
        this.toolsPanel.x = this.toolBarBounds.x;
        this.toolsPanel.y = this.toolBarBounds.y;
        this.addChild(this.toolsPanel);

        //calculate size of pitch viewport area
        this.pitchViewportBounds = new createjs.Rectangle(Editor.UI_CONTROLS_MARGIN,
            this.toolBarBounds.y + this.toolBarBounds.height + Editor.UI_CONTROLS_MARGIN,
            ApplicationModel.APP_WIDTH - 3*Editor.UI_CONTROLS_MARGIN - ComponentsPallete.PANEL_STD_WIDTH,
            ApplicationModel.APP_HEIGHT - 3*Editor.UI_CONTROLS_MARGIN - ToolsPanel.PANEL_STD_HEIGHT);

        this.pitch = new Pitch();
        this.addChild(this.pitch);

        PresentationController.getInstance().setView(this.pitch);

        //draw pitch outline
        this.pitchOutline = new createjs.Shape();
        this.pitchOutline.graphics.clear();
        this.pitchOutline.graphics.setStrokeStyle(1);
        this.pitchOutline.graphics.beginStroke("#FFFFFF").drawRect(0, 0, this.pitchViewportBounds.width, this.pitchViewportBounds.height);
        this.pitchOutline.x = this.pitchViewportBounds.x;
        this.pitchOutline.y = this.pitchViewportBounds.y;
        this.pitchOutline.visible = false;
        this.addChild(this.pitchOutline);
    };

    p.initialize = function(){
        this.presentationController = PresentationController.getInstance();

        if(!this.presentationController.presentation.pitchWidth || !this.presentationController.presentation.pitchHeight){
            this.showForm(PitchSizeInputFormHTML,{
                positiveCallback:this.sizeInputPositiveCallback,
                negativeCallback:this.sizeInputNegativeCallback,
                callbackScope: this
            });
        } else {
            //visualize presentation data
            this.createPitchView();
        }

        //Dispatcher.getInstance().on(ApplicationEvent.NAVIGATE_BACK, exitToMainMenu, this);

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
        window.drillEditorApplication.showAppScreen(AppScreen.MAIN_MENU);
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

        ApplicationModel.getInstance().mpp = this.presentationController.presentation.pitchWidth/this.pitchDisplayWidth;

        this.pitch.setSize(this.pitchDisplayWidth, this.pitchDisplayHeight);

        this.pitch.x = this.pitchViewportBounds.x + this.pitchViewportBounds.width/2 - this.pitchDisplayWidth/2;
        this.pitch.y = this.pitchViewportBounds.y + this.pitchViewportBounds.height/2 - this.pitchDisplayHeight/2;

        console.warn("pitch size ratio = " + Number(this.pitchDisplayWidth/this.pitchDisplayHeight).toFixed(4));

        Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.PITCH_VIEW_CREATED));


    };

    p.destroy = function(){
        this.AppScreen_destroy();

        //destroy things related to Editor
        //Dispatcher.getInstance().off(ApplicationEvent.NAVIGATE_BACK, exitToMainMenu);

        console.log("Editor destroyed");
    };

    /*function exitToMainMenu(){
        //TODO: exit properly from the edit mode - possible show an yes/no dialog, dispose current presentation
        window.drillEditorApplication.showAppScreen(AppScreen.MAIN_MENU);
    }*/



    window.Editor = createjs.promote(Editor, "AppScreen");

}(window));
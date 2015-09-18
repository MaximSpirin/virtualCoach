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
    Editor.prototype.componentsPalleteBounds;
    Editor.prototype.pitchBounds;
    Editor.prototype.pitchOutline;
    Editor.prototype.pitchShape;
    Editor.prototype.toolsPanel;
    Editor.prototype.componentsPallete;


    //static variable
    //Editor.staticVar = "value";

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
    };

    p.initialize = function(){
        if(!this.presentation.pitchWidth || !this.presentation.pitchHeight){
            this.showForm(PitchSizeInputFormHTML,{
                positiveCallback:this.sizeInputPositiveCallback,
                negativeCallback:this.sizeInputNegativeCallback,
                callbackScope: this
            });
        } else {
            //TODO: visualize presentation data
        }


        Dispatcher.getInstance().on(ApplicationEvent.NAVIGATE_BACK, exitToMainMenu, this);
        Dispatcher.getInstance().on(ApplicationEvent.ADD_COMPONENT, addComponentHandler, this);
    };

    //called when user hits proceed button on size input form
    p.sizeInputPositiveCallback = function(w,h){
        this.removeForm();
        this.presentation.pitchWidth =  w;
        this.presentation.pitchHeight = h;
        this.redrawPitch();
    };

    p.sizeInputNegativeCallback = function(){
        //this.removeForm();
        window.main.showAppScreen(AppScreen.MAIN_MENU);
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
        Dispatcher.getInstance().off(ApplicationEvent.NAVIGATE_BACK, exitToMainMenu);

        console.log("Editor destroyed");
    };

    function exitToMainMenu(){
        //TODO: exit properly from the edit mode - possible show an yes/no dialog, dispose current presentation
        window.main.showAppScreen(AppScreen.MAIN_MENU);
    }

    function addComponentHandler(evt){
        var componentClass;
        var component;

        switch (evt.payload.type){
            case "rect":
                    componentClass = RectComponent;
                break;
            case "box":
                    componentClass = SquareComponent;
                break;
            case "attacker":
                    componentClass = AttackerComponent;
                break;

            case "defender":
                    componentClass = DefenderComponent;
                break;

            case "extra_team":
                    componentClass = ExtraTeamComponent;
                break;

            case "cone":
                componentClass = ConeComponent;
                break;
        }

        if(componentClass){
            component = new componentClass();
            this.addChild(component);
            component.x = this.pitchViewportBounds.x + this.pitchViewportBounds.width/2 - componentClass['STD_WIDTH']/2;
            component.y = this.pitchViewportBounds.y + this.pitchViewportBounds.height/2 - componentClass['STD_HEIGHT']/2;
            component.setSelection();
        }
    }

    window.Editor = createjs.promote(Editor, "AppScreen");

}(window));
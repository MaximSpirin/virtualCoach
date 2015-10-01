/**
 * Class ToolsPanel
 * Created by maxim_000 on 9/17/2015.
 */
(function (window) {
    //public variables
    ToolsPanel.prototype.background;
    ToolsPanel.prototype.componentWidth;
    ToolsPanel.prototype.componentHeight;
    ToolsPanel.prototype.backButton;
    ToolsPanel.prototype.saveButton;
    ToolsPanel.prototype.constantButtonsSet;
    ToolsPanel.prototype.dynamicButtonsSet;

    //static variable
    ToolsPanel.PANEL_STD_HEIGHT = 50;


    //constructor
    function ToolsPanel(width, height) {
        this.Container_constructor();
        this.componentWidth = width;
        this.componentHeight = height;
        
        this.initialize();
    }

    var p = createjs.extend(ToolsPanel, createjs.Container);

    p.initialize = function(){
        this.background = new createjs.Shape();
        this.background.graphics.beginFill("#dddddd").drawRect(0, 0, this.componentWidth, this.componentHeight);
        this.addChild(this.background);

        //init dynamic buttons array
        this.dynamicButtonsSet = [];
        
        this.saveButton = new SimpleTextButton("Save", "20px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 70);
        this.saveButton.x = 10;
        this.saveButton.y = 5;
        this.addChild(this.saveButton);

        this.backButton = new SimpleTextButton("Back", "20px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 70);
        this.backButton.x = 10 + 70 + 10;
        this.backButton.y = 5;
        this.backButton.on("click",backClickListener,this);
        this.addChild(this.backButton);
        
        Dispatcher.getInstance().on(ApplicationEvent.ELEMENT_SELECTED, elementSelectedHandler, this);
    };

    /********************************* event listeners **********************************/
    
    function elementSelectedHandler(evt){
            
    }
    
    function backClickListener(){
        Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.NAVIGATE_BACK));
    }

    window.ToolsPanel = createjs.promote(ToolsPanel,"Container");

}(window));
/**
 * Class ComponentsPallete
 * Created by maxim_000 on 9/18/2015.
 */
(function (window) {
    //public variables
    ComponentsPallete.prototype.panelWidth;
    ComponentsPallete.prototype.panelHeight;
    ComponentsPallete.prototype.background;
    ComponentsPallete.prototype.rectButton;
    ComponentsPallete.prototype.boxButton;
    ComponentsPallete.prototype.attackerButton;
    ComponentsPallete.prototype.defenderButton;
    ComponentsPallete.prototype.extraTeamButton;
    ComponentsPallete.prototype.coneButton;


    //static variable
    ComponentsPallete.BACKGROUND_COLOR = "#dddddd";
    ComponentsPallete.PANEL_STD_WIDTH = 115;

    //constructor
    function ComponentsPallete(width, height) {
        this.panelWidth = width;
        this.panelHeight = height;

        this.Container_constructor();

        this.initialize();
    }

    //extend this class from a superclass
    var p = createjs.extend(ComponentsPallete,createjs.Container);

    p.initialize = function(){
        this.background = new createjs.Shape();
        this.background.graphics.beginFill(ComponentsPallete.BACKGROUND_COLOR).drawRect(0, 0, this.panelWidth, this.panelHeight);
        this.addChild(this.background);


        this.rectButton = new SimpleTextButton("Rect", "18px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105);
        this.rectButton.x = 5;
        this.rectButton.y = 5;
        this.rectButton.on("click", rectButtonClickHandler, this);
        this.addChild(this.rectButton);

        this.boxButton = new SimpleTextButton("Box", "18px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105);
        this.boxButton.x = 5;
        this.boxButton.y = this.rectButton.y + this.rectButton.getBounds().height*2 + 10;
        this.boxButton.on("click", boxButtonClickHandler, this);
        this.addChild(this.boxButton);

        this.attackerButton = new SimpleTextButton("Attacker", "18px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105);
        this.attackerButton.x = 5;
        this.attackerButton.y = this.boxButton.y + this.boxButton.getBounds().height*2 + 10;
        this.attackerButton.on("click", attackerButtonClickHandler, this);
        this.addChild(this.attackerButton);

        this.defenderButton = new SimpleTextButton("Defender", "18px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105);
        this.defenderButton.x = 5;
        this.defenderButton.y = this.attackerButton.y + this.attackerButton.getBounds().height*2 + 10;
        this.defenderButton.on("click", defenderButtonClickHandler, this);
        this.addChild(this.defenderButton);

        this.extraTeamButton = new SimpleTextButton("Extra", "18px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105);
        this.extraTeamButton.x = 5;
        this.extraTeamButton.y = this.defenderButton.y + this.defenderButton.getBounds().height*2 + 10;
        this.extraTeamButton.on("click", extraTeamButtonClickHandler, this);
        this.addChild(this.extraTeamButton);

        this.coneButton = new SimpleTextButton("Cone", "18px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105);
        this.coneButton.x = 5;
        this.coneButton.y = this.extraTeamButton.y + this.extraTeamButton.getBounds().height*2 + 10;
        this.coneButton.on("click", coneButtonClickHandler, this);
        this.addChild(this.coneButton);

    };


    function rectButtonClickHandler(evt){
        Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.ADD_COMPONENT,{type:"rect"}));
    }

    function boxButtonClickHandler(evt){
        Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.ADD_COMPONENT,{type:"box"}));
    }

    function attackerButtonClickHandler(evt){
        Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.ADD_COMPONENT,{type:"attacker"}));
    }

    function defenderButtonClickHandler(evt){
        Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.ADD_COMPONENT,{type:"defender"}));
    }

    function extraTeamButtonClickHandler(evt){
        Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.ADD_COMPONENT,{type:"extra_team"}));
    }

    function coneButtonClickHandler(evt){
        Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.ADD_COMPONENT,{type:"cone"}));
    }

    //Make aliases for all superclass methods: SuperClass_methodName
    window.ComponentsPallete = createjs.promote(ComponentsPallete,"Container");


}(window));
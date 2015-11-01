/**
 * Class ComponentsPallete
 * Created by maxim_000 on 9/18/2015.
 */
(function (window) {


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
        this.dispatcher = Dispatcher.getInstance();

        this.background = new createjs.Shape();
        this.background.graphics.beginFill(ComponentsPallete.BACKGROUND_COLOR).drawRect(0, 0, this.panelWidth, this.panelHeight);
        this.addChild(this.background);


        this.rectButton = new SimpleTextButton("Rectangle", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.rectButton.x = 5;
        this.rectButton.y = 5;
        this.rectButton.on("click", rectButtonClickHandler, this);
        this.addChild(this.rectButton);

        this.boxButton = new SimpleTextButton("Square", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.boxButton.x = 5;
        this.boxButton.y = this.rectButton.y + this.rectButton.getBounds().height + 5;
        this.boxButton.on("click", boxButtonClickHandler, this);
        this.addChild(this.boxButton);

        this.attackerButton = new SimpleTextButton("Attacker", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.attackerButton.x = 5;
        this.attackerButton.y = this.boxButton.y + this.boxButton.getBounds().height + 5;
        this.attackerButton.on("click", attackerButtonClickHandler, this);
        this.addChild(this.attackerButton);

        this.defenderButton = new SimpleTextButton("Defender", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.defenderButton.x = 5;
        this.defenderButton.y = this.attackerButton.y + this.attackerButton.getBounds().height + 5;
        this.defenderButton.on("click", defenderButtonClickHandler, this);
        this.addChild(this.defenderButton);

        this.extraTeamButton = new SimpleTextButton("Extra", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.extraTeamButton.x = 5;
        this.extraTeamButton.y = this.defenderButton.y + this.defenderButton.getBounds().height + 5;
        this.extraTeamButton.on("click", extraTeamButtonClickHandler, this);
        this.addChild(this.extraTeamButton);

        this.neutralPlayerButton = new SimpleTextButton("Neutral", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.neutralPlayerButton.x = 5;
        this.neutralPlayerButton.y = this.extraTeamButton.y + this.extraTeamButton.getBounds().height + 5;
        this.neutralPlayerButton.on("click", neutralButtonClickHandler, this);
        this.addChild(this.neutralPlayerButton);

        this.coneButton = new SimpleTextButton("Cone", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.coneButton.x = 5;
        this.coneButton.y = this.neutralPlayerButton.y + this.neutralPlayerButton.getBounds().height + 5;
        this.coneButton.on("click", coneButtonClickHandler, this);
        this.addChild(this.coneButton);
        
        this.arcButton = new SimpleTextButton("Arcuate mvm", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.arcButton.x = 5;
        this.arcButton.y = this.coneButton.y + this.coneButton.getBounds().height + 5;
        this.arcButton.on("click", arcButtonClickHandler,this);
        this.addChild(this.arcButton);

        this.dribblingButton = new SimpleTextButton("Dribbling", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.dribblingButton.x = 5;
        this.dribblingButton.y = this.arcButton.y + this.arcButton.getBounds().height + 5;
        this.dribblingButton.on("click", dribblingButtonClickHandler,this);
        this.addChild(this.dribblingButton);

        this.playerMvmButton = new SimpleTextButton("Player path", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.playerMvmButton.x = 5;
        this.playerMvmButton.y = this.dribblingButton.y + this.playerMvmButton.getBounds().height + 5;
        this.playerMvmButton.on("click", playerMovementButtonClick, this);
        this.addChild(this.playerMvmButton);

        this.ballMvmButton = new SimpleTextButton("Ball path", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.ballMvmButton.x = 5;
        this.ballMvmButton.y = this.playerMvmButton.y + this.ballMvmButton.getBounds().height + 5;
        this.ballMvmButton.on("click", ballMovementButtonClick, this);
        this.addChild(this.ballMvmButton);

        this.ballButton = new SimpleTextButton("Ball", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.ballButton.x = 5;
        this.ballButton.y = this.ballMvmButton.y + this.ballButton.getBounds().height + 5;
        this.ballButton.on("click", ballButtonClick, this);
        this.addChild(this.ballButton);

        this.ballSupplyButton = new SimpleTextButton("Ball supply", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.ballSupplyButton.x = 5;
        this.ballSupplyButton.y = this.ballButton.y + this.ballSupplyButton.getBounds().height + 5;
        this.ballSupplyButton.on("click", ballSupplyButtonClick, this);
        this.addChild(this.ballSupplyButton);

        this.goalButton = new SimpleTextButton("Goal", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 105, 36);
        this.goalButton.x = 5;
        this.goalButton.y = this.ballSupplyButton.y + this.ballSupplyButton.getBounds().height + 5;
        this.goalButton.on("click", goalButtonClick, this);
        this.addChild(this.goalButton);

    };


    function goalButtonClick(event){
        this.dispatcher.dispatchEvent(new PresentationViewEvent(PresentationViewEvent.CREATE_GOAL_CLICK));
    }

    function rectButtonClickHandler(evt){
        this.dispatcher.dispatchEvent(new PresentationViewEvent(PresentationViewEvent.CREATE_RECTANGLE_CLICK));
    }

    function boxButtonClickHandler(evt){
        this.dispatcher.dispatchEvent(new PresentationViewEvent(PresentationViewEvent.CREATE_SQUARE_CLICK));
    }

    function attackerButtonClickHandler(evt){
        this.dispatcher.dispatchEvent(new PresentationViewEvent(PresentationViewEvent.CREATE_ATTACKER_CLICK));
    }

    function defenderButtonClickHandler(evt){
        this.dispatcher.dispatchEvent(new PresentationViewEvent(PresentationViewEvent.CREATE_DEFENDER_CLICK));
    }

    function extraTeamButtonClickHandler(evt){
        this.dispatcher.dispatchEvent(new PresentationViewEvent(PresentationViewEvent.CREATE_EXTRA_TEAM_CLICK));
    }

    function neutralButtonClickHandler(evt) {
        this.dispatcher.dispatchEvent(new PresentationViewEvent(PresentationViewEvent.CREATE_NEUTRAL_PLAYER_CLICK));
    }

    function coneButtonClickHandler(evt){
        this.dispatcher.dispatchEvent(new PresentationViewEvent(PresentationViewEvent.CREATE_CONE_CLICK));
    }
    
    function arcButtonClickHandler(evt){
        this.dispatcher.dispatchEvent(new PresentationViewEvent(PresentationViewEvent.CREATE_ARC_CLICK));
    }

    function dribblingButtonClickHandler(evt){
       this.dispatcher.dispatchEvent(new PresentationViewEvent(PresentationViewEvent.CREATE_DRIBBLING_CLICK));
    }

    function playerMovementButtonClick(evt){
        this.dispatcher.dispatchEvent(new PresentationViewEvent(PresentationViewEvent.CREATE_PLAYER_PATH_CLICK));
    }

    function ballMovementButtonClick(evt){
        this.dispatcher.dispatchEvent(new PresentationViewEvent(PresentationViewEvent.CREATE_BALL_PATH_CLICK));
    }

    function ballButtonClick(evt){
        this.dispatcher.dispatchEvent(new PresentationViewEvent(PresentationViewEvent.CREATE_BALL_CLICK));
    }

    function ballSupplyButtonClick(evt){
        this.dispatcher.dispatchEvent(new PresentationViewEvent(PresentationViewEvent.CREATE_BALLS_SUPPLY_CLICK));
    }

    //Make aliases for all superclass methods: SuperClass_methodName
    window.ComponentsPallete = createjs.promote(ComponentsPallete,"Container");


}(window));
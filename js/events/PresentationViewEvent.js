/**
 * PresentationViewEvent
 */
(function (window) {

    PresentationViewEvent.CREATE_RECTANGLE_CLICK = "create_rectangle_click";
    PresentationViewEvent.CREATE_SQUARE_CLICK = "create_square_click";
    PresentationViewEvent.CREATE_ATTACKER_CLICK = "create_attacker_click";
    PresentationViewEvent.CREATE_DEFENDER_CLICK = "create_defender_click";
    PresentationViewEvent.CREATE_EXTRA_TEAM_CLICK = "create_extra_team_click";
    PresentationViewEvent.CREATE_NEUTRAL_PLAYER_CLICK = "create_target_click";
    PresentationViewEvent.CREATE_CONE_CLICK = "create_cone_click";
    PresentationViewEvent.CREATE_DRIBBLING_CLICK = "create_dribbling_click";
    PresentationViewEvent.CREATE_PLAYER_PATH_CLICK = "create_player_path_click";
    PresentationViewEvent.CREATE_BALL_PATH_CLICK = "create_ball_path_click";
    PresentationViewEvent.CREATE_BALL_CLICK = "create_ball_click";
    PresentationViewEvent.CREATE_BALLS_SUPPLY_CLICK = "create_balls_supply_click";
    PresentationViewEvent.CREATE_ARC_CLICK = "create_arc_click";
    PresentationViewEvent.COPY_ELEMENT_BUTTON_CLICK = "copy_element_button_click";
    PresentationViewEvent.PASTE_ELEMENT_BUTTON_CLICK = "paste_element_button_click";
    PresentationViewEvent.ELEMENT_COPIED_TO_CLIPBOARD = "element_copied_to_clipboard";
    PresentationViewEvent.DELETE_ELEMENT = "delete_element";
    PresentationViewEvent.SWAP_DIRECTIONS_BUTTON_CLICK = "swap_directions_button_click";


    //Each instance of this event will have an associated payload object
    PresentationViewEvent.prototype.payload = null;


    // constructor
    function PresentationViewEvent(type, payload, bubbles, cancelable){
        this.Event_constructor(type, bubbles, cancelable);

        if(payload == null || payload == undefined){
            payload = {};
        }
        this.payload = payload;

    }

    var p = createjs.extend(PresentationViewEvent, createjs.Event);

    window.PresentationViewEvent = createjs.promote(PresentationViewEvent, "Event");

}(window));

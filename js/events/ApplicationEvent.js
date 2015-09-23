/**
 * ApplicationEvent
 */
(function (window) {

    // Usage: ApplicationEvent.EVENT_NAME = 'event_name'
    ApplicationEvent.SHOW_SCREEN = "show_screen";
    ApplicationEvent.SHOW_EDITOR = "show_editor";
    ApplicationEvent.NAVIGATE_BACK = "navigate_back";
    ApplicationEvent.HIDE_CURRENT_FORM = "hide_current_form";
    ApplicationEvent.ADD_COMPONENT = "add_component";
    ApplicationEvent.ELEMENT_SELECTED = "element_selected";
    ApplicationEvent.ELEMENT_DESELECTED = "element_deselected";
    ApplicationEvent.ELEMENT_POSITION_CHANGED = "element_position_changed";
    ApplicationEvent.ELEMENT_MOVE = "element_move";
    ApplicationEvent.ELEMENT_RESIZE = "element_resize";


    //Each instance of this event will have an associated payload object
    ApplicationEvent.prototype.payload = null;


    // constructor
    function ApplicationEvent(type, payload, bubbles, cancelable){
        this.Event_constructor(type, bubbles, cancelable);

        if(payload == null || payload == undefined){
            payload = {};
        }
        this.payload = payload;

    }

    var p = createjs.extend(ApplicationEvent, createjs.Event);

    window.ApplicationEvent = createjs.promote(ApplicationEvent, "Event");

}(window));

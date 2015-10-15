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
    ApplicationEvent.ELEMENT_ROTATION_CHANGED = "element_rotation_changed";
    ApplicationEvent.GRAPHIC_PROPERTY_CHANGED = "item_model_property_changed";
    ApplicationEvent.NEW_DRILL_BUTTON_CLICK = "new_drill_button_click_event";
    ApplicationEvent.PITCH_VIEW_CREATED = "pitch_view_created";


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

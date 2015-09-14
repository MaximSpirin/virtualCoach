/**
 * ApplicationEvent
 */
(function (window) {

    // Usage: ApplicationEvent.EVENT_NAME = 'event_name'
    ApplicationEvent.SHOW_SCREEN = "show_screen";
    ApplicationEvent.SHOW_EDITOR = "show_editor";

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

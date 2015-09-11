/**
 * ApplicationEvent
 */
(function (window) {

    // Usage: ApplicationEvent.EVENT_NAME = 'event_name'
    ApplicationEvent.SHOW_SCREEN = "show_screen";

    //Each instance of this event will have an associated payload object
    ApplicationEvent.prototype.payload = null;
    ApplicationEvent.prototype.name = null;

    // constructor
    function ApplicationEvent(name, payload){

        this.name = name;

        if(payload == null || payload == undefined){
            payload = {};
        }
        this.payload = payload;

    }

    window.ApplicationEvent = ApplicationEvent;

}(window));

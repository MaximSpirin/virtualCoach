//##############################################################################
//
//##############################################################################

/**
 * AppScreen
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables

    AppScreen.prototype.form = null;  //reference to the form that is currently on the screen

    //static variable
    AppScreen.MAIN_MENU = "main_menu";
    AppScreen.EDITOR = "editor";


    //constructor
    function AppScreen(){
        // call constructor of the superclass
        this.Container_constructor();

        this.onHideFormListener = drillEditor.Dispatcher.getInstance().on(drillEditor.ApplicationEvent.HIDE_CURRENT_FORM, hideCurrentFormHandler, this);


    }

    var p = createjs.extend(AppScreen, createjs.Container);

    // public functions
    /**
     * Destroys this instance of AppScreen.
     * All interactivity & other processes should be disabled here
     */
    p.destroy = function () {
        drillEditor.Dispatcher.getInstance().off(drillEditor.ApplicationEvent.HIDE_CURRENT_FORM, this.onHideFormListener);
        this.onHideFormListener=null;
        removeCurrentForm(this);

    };

    AppScreen.prototype.showForm = function (formClass, initParams){
        showForm(this, formClass, initParams);
    };

    AppScreen.prototype.removeForm = function(){
        removeCurrentForm(this);
    };


    //private functions

    function hideCurrentFormHandler(applicationEvent){
        removeCurrentForm(this);
    }

    function removeCurrentForm(thisScope) {
        if(thisScope.form){
            thisScope.form.destroy();
            if(thisScope.contains(thisScope.form)){
                thisScope.removeChild(thisScope.form);
            }
        }
        thisScope.form = null;
    }

    function showForm(scope, formClass, initParams){
        //1. remove an exitsting form if present
        removeCurrentForm(scope);
        //2.create instance of form object
        scope.form = new formClass(initParams);
        //3. add new form to the top of DL
        scope.addChild(scope.form);
    }


    drillEditor.AppScreen = createjs.promote(AppScreen, "Container");

}());
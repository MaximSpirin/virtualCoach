/**
 * Class LoadDrillView
 * Created by maxim_000 on 10/17/2015.
 */
(function (window) {
    /******************* public variables *******************/
    PitchSizeInputFormHTML.prototype.formHTMLElement;
    PitchSizeInputFormHTML.prototype.formDOMElement;

    /******************* static variables *******************/
    //LoadDrillView.staticVar = "value";

    /********************** constructor *********************/
    function LoadDrillView() {
        //invoke constructor of superclass
        this.Form_constructor();


    }

    //extend this class from a superclass
    var p = createjs.extend(LoadDrillView, Form);

    /********************* overridden methods *********************/
    p.constructForm = function(){
      this.Form_constructForm();

      //create html content
    };

    p.destroy = function(){
        this.Form_destroy();

        //unsubscribe listeners


    };

    /******************** private methods *******************/


    /******************** event handlers ********************/


    /******************* public static method ***************/

    window.LoadDrillView = createjs.promote(LoadDrillView,"Form");

}(window));
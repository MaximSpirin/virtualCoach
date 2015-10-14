/**
 * [Deprecated]
 * Stores properties that are related to the current user
 */

(function (window){
    User.prototype.login;           // user login
    User.prototype.authorized;      // boolean value
    User.prototype.presentations;   // array of prev created presentations

    //constructor
    function User(){
        //init properties
        this.login = null;
        this.authorized = false;
        this.presentations = [];
        console.log("User instance created!");
    }

    window.User = User;

}(window));

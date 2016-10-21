/**
 * Get Collections of todos
 */
Todos = new Mongo.Collection('todos');
Lists = new Mongo.Collection('lists');

if (Meteor.isClient) {
    Meteor.subscribe('lists');
    $.validator.setDefaults({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 3
            }
        },
        messages: {
            email: {
                required: "You must enter an email address.",
                email: "You've entered an invalid email address."
            },
            password: {
                required: "You must enter a password.",
                minlength: "Your password must be at least {0} characters."
            }
        }
    });
    Template.login.onRendered(function () {
        var validator = $('.login').validate({
            submitHandler: function (event) {
                var email = $('[name=email]').val();
                var password = $('[name=password]').val();
                Meteor.loginWithPassword(email, password, function (error) {
                    if (error) {
                        if (error.reason == "User not found") {
                            validator.showErrors({
                                email: "That email doesn't belong to a registered user."
                            });
                        }
                        if (error.reason == "Incorrect password") {
                            validator.showErrors({
                                password: "You entered an incorrect password."
                            });
                        }
                    } else {
                        var currentRoute = Router.current().route.getName();
                        if (currentRoute == "login") {
                            Router.go('home');
                        }
                    }
                });
            }
        });
    });
    Template.register.onRendered(function () {
        var validator = $('.register').validate({
            submitHandler: function (event) {
                var email = $('[name=email]').val();
                var password = $('[name=password]').val();
                Accounts.createUser({
                    email: email,
                    password: password
                }, function (error) {
                    if (error) {
                        if (error.reason == "Email already exists.") {
                            validator.showErrors({
                                email: "That email doesn't belong to a registered user."
                            });
                        }
                    } else {
                        Router.go('home');
                    }
                });
            }
        });
    });
    Template.lists.onCreated(function () {
        this.subscribe('lists');
    });
}

if (Meteor.isServer) {
    function defaultName(currentUser) {
        var nextLetter = 'A';
        var nextName = 'List ' + nextLetter;
        while (Lists.findOne({name: nextName, createdBy: currentUser})) {
            nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
            nextName = 'List ' + nextLetter;
        }
        return nextName;
    }

    Meteor.publish('lists', function () {
        var currentUser = this.userId;
        return Lists.find({createdBy: currentUser});
    });
    Meteor.publish('todos', function (currentList) {
        var currentUser = this.userId;
        return Todos.find({createdBy: currentUser, listId: currentList})
    });
    Meteor.methods({
        createNewList: function (listName) {
            var currentUser = Meteor.userId();
            if (listName == "") {
                listName = defaultName(currentUser);
            }
            check(listName, String);
            var data = {
                name: listName,
                createdBy: currentUser
            };
            if (!currentUser) {
                throw new Meteor.Error("not-logged-in", "You are not logged-in");
            }
            return Lists.insert(data);
        },
        createListItem: function (todoName, currentList) {
            check(todoName, String);
            check(currentList, String);
            var currentUser = Meteor.userId();
            var data = {
                name: todoName,
                completed: false,
                createdAt: new Date(),
                createdBy: currentUser,
                listId: currentList
            };
            if (!currentUser) {
                throw new Meteor.Error("not-logged-in", "You're not logged-in.");
            }
            var currentList = Lists.findOne(currentList);
            if (currentList.createdBy != currentUser) {
                throw new Meteor.Error("invalid-user", "You don't own that list.");
            }
            Todos.insert(data);
        },
        updateListItem: function (documentId, todoItem) {
            check(todoItem, String);
            var currentUser = Meteor.userId();
            var data = {
                _id: documentId,
                createdBy: currentUser
            };
            if (!currentUser) {
                throw new Meteor.Error("not-logged-in", "You're not logged-in.");
            }
            Todos.update(data, {$set: {name: todoItem}});
        },
        changeListItemStatus: function (documentId, status) {
            check(status, Boolean);
            var currentUser = Meteor.userId();
            var data = {
                _id: documentId,
                createdBy: currentUser
            };
            if(!currentUser) {
                throw new Meteor.Error("not-logged-in", "You're not logged-in.");
            }
            Todos.update(data, {$set: {completed: status}});
        },
        removeListItem: function (documentId) {
            var currentUser = Meteor.userId();
            var data = {
                _id: documentId,
                createdBy: currentUser
            };
            if(!currentUser) {
                throw new Meteor.Error("not-logged-in", "You're not logged-in.");
            }
            Todos.remove(data);
        }
    });
}

/**
 * Routers
 */
Router.configure({
    layoutTemplate: 'main',
    loadingTemplate: 'loading'
});

Router.route('/', {
    name: 'home',
    template: 'home'
});
Router.route('/list/:_id', {
    name: 'listPage',
    template: 'listPage',
    data: function () {
        var currentList = this.params._id;
        var currentUser = Meteor.userId();
        return Lists.findOne({_id: currentList, createdBy: currentUser});
    },
    'onBeforeAction': function () {
        var currentUser = Meteor.userId();
        if (currentUser) {
            this.next();
        } else {
            this.render("login");
        }
    },
    waitOn: function () {
        var currentList = this.params._id
        return Meteor.subscribe('todos', currentList);
    }
});

Router.route('/login');
Router.route('/register');

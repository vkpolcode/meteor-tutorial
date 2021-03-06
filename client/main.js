import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.todos.helpers({
    todo: function () {
        var currentList = this._id;
        var currentUser = Meteor.userId();
        return Todos.find({listId: currentList, createdBy: currentUser}, {sort: {createdAt: -1}});
    }
});

Template.lists.helpers({
    list: function () {
        var currentUser = Meteor.userId();
        return Lists.find({createdBy: currentUser}, {sort: {name: 1}});
    }
});

Template.todoItem.helpers({
    'checked': function () {
        var isCompleted = this.completed;
        if (isCompleted) {
            return "checked";
        } else {
            return "";
        }
    }
});

Template.addList.events({
    'submit form': function (event) {
        event.preventDefault();
        var listName = $('[name=listName]').val();
        Meteor.call('createNewList', listName, function (error, results) {
            if (error) {
                console.log(error.reason);
            } else {
                Router.go('listPage', {_id: results});
            }
        });
        $('[name=listName]').val('');
    }
});

Template.todoItem.events({
    'click .delete-todo': function (event) {
        event.preventDefault();
        var documentId = this._id;
        var confirm = window.confirm("Delete this task '" + this.name + "' ?");
        if (confirm) {
            Meteor.call('removeListItem', documentId);
        }
    },
    'keyup [name="todoItem"]': function (event) {
        if (event.which == 13 || event.which == 27) {
            $(event.target).blur();
        } else {
            var documentId = this._id;
            var todoItem = $(event.target).val();
            Meteor.call('updateListItem', documentId, todoItem);
        }
    },
    'change [type=checkbox]': function () {
        var documentId = this._id;
        var isCompleted = this.completed;
        Meteor.call('changeListItemStatus', documentId, !isCompleted);
    }
});

Template.addTodo.events({
    'submit form': function (event) {
        event.preventDefault();
        var todoName = $('[name="todoName"]').val();
        var currentList = this._id;
        Meteor.call('createListItem', todoName, currentList, function (error, results) {
            if (error) {
                console.log(error.reason);
            } else {
                $('[name="todoName"]').val('');
            }
        });
    }
});

Template.todosCount.helpers({
    'totalTodos': function () {
        var currentList = this._id;
        var currentUser = Meteor.userId();
        return Todos.find({listId: currentList, createdBy: currentUser}).count();
    },
    'completedTodos': function () {
        var currentList = this._id;
        var currentUser = Meteor.userId();
        return Todos.find({completed: true, listId: currentList, createdBy: currentUser}).count();
    }
});

Template.register.events({
    'submit form': function (event) {
        event.preventDefault();
    }
});

Template.login.events({
    'submit form': function (event) {
        event.preventDefault();
    }
});

Template.navigation.events({
    'click .logout': function (event) {
        event.preventDefault();
        Meteor.logout();
        Router.go('login');
    }
});

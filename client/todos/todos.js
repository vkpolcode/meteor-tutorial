Template.todos.helpers({
    todo: function () {
        var currentList = this._id;
        var currentUser = Meteor.userId();
        return Todos.find({listId: currentList, createdBy: currentUser}, {sort: {createdAt: -1}});
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
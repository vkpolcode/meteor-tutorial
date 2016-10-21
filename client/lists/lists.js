Template.lists.helpers({
    list: function () {
        var currentUser = Meteor.userId();
        return Lists.find({createdBy: currentUser}, {sort: {name: 1}});
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
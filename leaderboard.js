PlayersList = new Meteor.Collection('players');

if (Meteor.isClient) {

  Meteor.subscribe('thePlayers');

  Template.leaderboard.helpers({
    players: function() {
      var currentUserId = Meteor.userId();

      return PlayersList.find({ createdBy: currentUserId }, {sort: {score: -1, name: 1}});
    },

    selectedClass: function() {
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if (selectedPlayer === playerId) {
        return 'selected';
      }
    },

    showSelectedPlayer: function() {
      var selectedPlayer = Session.get('selectedPlayer');
      return PlayersList.findOne(selectedPlayer);
    },
  });

  Template.leaderboard.events({
    'click li.player': function() {
      var playerId = this._id;
      Session.set('selectedPlayer', playerId);
      var selectedPlayer = Session.get('selectedPlayer');
    },

    'click #increment': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update({_id: selectedPlayer}, {$inc: {score: 5}});
    },

    'click #decrement': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update({_id: selectedPlayer}, {$inc: {score: -5}});
    },

    'click #remove': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.remove(selectedPlayer);
    },
  });

  Template.addPlayerForm.events({
    'submit form': function(event, template) {
      event.preventDefault();

      var playerName = template.find('#playerName').value;
      var currentUserId = Meteor.userId();

      PlayersList.insert({
        name: playerName,
        score: 0,
        createdBy: currentUserId,
      });
    },
  });
}

if (Meteor.isServer) {
  Meteor.publish('thePlayers', function() {
    return PlayersList.find();
  });
}

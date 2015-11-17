PlayersList = new Meteor.Collection('players');

if (Meteor.isClient) {
  Meteor.subscribe('thePlayers');

  Template.leaderboard.helpers({
    players: function() {
      var currentUserId = Meteor.userId();

      return PlayersList.find({}, {sort: {score: -1, name: 1}});
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
      Meteor.call('modifyPlayerScore', selectedPlayer, 5);
    },

    'click #decrement': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('modifyPlayerScore', selectedPlayer, -5);
    },

    'click #remove': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('removePlayer', selectedPlayer);
    },
  });

  Template.addPlayerForm.events({
    'submit form': function(event) {
      event.preventDefault();

      var playerName = event.target.playerName.value;
      var currentUserId = Meteor.userId();

      Meteor.call('insertPlayerData', playerName);
    },
  });
}

if (Meteor.isServer) {
  Meteor.publish('thePlayers', function() {
    var currentUserId = this.userId;
    return PlayersList.find({ createdBy: currentUserId });
  });

  Meteor.methods({

    insertPlayerData: function(playerName) {
      var currentUserId = Meteor.userId();
      PlayersList.insert({
        name: playerName,
        score: 0,
        createdBy: currentUserId,
      });
    },

    removePlayer: function(selectedPlayer) {
      PlayersList.remove(selectedPlayer);
    },

    modifyPlayerScore: function(selectedPlayer, scoreValue) {
      PlayersList.update({_id: selectedPlayer}, {$inc: {score: scoreValue}});
    },

  });
}

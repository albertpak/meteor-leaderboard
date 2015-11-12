PlayersList = new Meteor.Collection('players');

if (Meteor.isClient) {
  Template.leaderboard.helpers({
    players: function() {
      return PlayersList.find();
    },

    selectedClass: function() {
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if (selectedPlayer === playerId) {
        return 'selected';
      }
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
  });
}

if (Meteor.isServer) {
}

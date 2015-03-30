var cx = React.addons.classSet;

Likes = new Mongo.Collection('likes');
Changes = new Mongo.Collection('changes');

var LikesAndChanges = ReactMeteor.createClass({
  templateName: 'LikesAndChanges',

  startMeteorSubscriptions: function() {
    Meteor.subscribe('likes');
    Meteor.subscribe('changes');
  },

  render: function() {
    return <div className='likes-and-changes'></div>;
  }
});

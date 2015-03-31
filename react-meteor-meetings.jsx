LikesCollection = new Mongo.Collection('likes');
ChangesCollection = new Mongo.Collection('changes');

var LikesAndChanges = ReactMeteor.createClass({
  templateName: 'LikesAndChanges',

  startMeteorSubscriptions: function() {
    Meteor.subscribe('likes');
    Meteor.subscribe('changes');
  },

  getMeteorState: function() {
    return {
      likes: LikesCollection.find().fetch(),
      changes: ChangesCollection.find().fetch()
    };
  },

  render: function() {
    return (
      <div className='likes-and-changes'>
        <AddLikeOrChange />
        <div className='row'>
          <div className='col s6'>
            <Likes data={this.state.likes} onLikesSubmit={this.handleLikeSubmitClick}/>
          </div>
          <div className='col s6'>
            <Changes data={this.state.changes} onChangeSubmit={this.handleChangeSubmitClick} />
          </div>
        </div>
      </div>
    );
  }
});

var AddLikeOrChange = React.createClass({
  render: function() {
    return (
      <form className="add-like-or-change">
        <div className="row">
          <div className="input-field col s12">
            <textarea id="textarea1" className="materialize-textarea"></textarea>
            <label htmlFor="textarea1">Like or Change?</label>
          </div>
        </div>
      </form>
    );
  }
});

var Likes = React.createClass({
  handleSubmit: function() {
    e.preventDefault(e);
    Meteor.call('addLike');
  },

  render: function() {
    var likeNodes = this.props.data.map(function(like, index) {
      return (
        <li key={index}>
          <button className="delete">&times;</button>
          <i className=" fa-li fa"></i>
          <span>{like.text}</span>
        </li>
      );
    });
    return (
      <div className='like-list'>
        <button className="btn-like btn waves-effect waves-light" type="submit" name="action" onSubmit={this.handleSubmit}>
          <i className="fa fa-arrow-left"></i>
          Like
        </button>
        <ul className='fa-ul'>
          {likeNodes}
        </ul>
      </div>
    );
  }
});

var Changes = React.createClass({
  handleSubmit: function() {
    e.preventDefault(e);
    Meteor.call('addChange');
  },

  render: function() {
    var changeNodes = this.props.data.map(function(change, index) {
      return (
        <li key={index}>
          <button className="delete">&times;</button>
          <i className=" fa-li fa"></i>
          <span>{change.text}</span>
        </li>
      );
    });
    return (
      <div className='change-list'>
        <button className="btn-change btn waves-effect waves-light" type="submit" name="action" onSubmit={this.handleSubmit}>
          Change
          <i className="fa fa-arrow-right"></i>
        </button>
        <ul className='change-list fa-ul'>
          {changeNodes}
        </ul>
      </div>
    );
  }
});

Meteor.methods({
  addLike: function() {
    var like = getElementById('textarea1');
    LikesCollection.insert({
      text: like.text
    });
  },

  addChange: function() {
    ChangesCollection.insert({
      text: change.text
    });
  }
});

if (Meteor.isServer) {
  Meteor.publish('likes', function(){
    return LikesCollection.find();
  });
  Meteor.publish('changes', function(){
    return ChangesCollection.find();
  });
}

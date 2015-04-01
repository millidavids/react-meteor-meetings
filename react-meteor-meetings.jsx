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

  handleLikeOrChangeClick: function(l_or_c) {
    if (l_or_c.type === 'Like') {
      Meteor.call('addLike', l_or_c.text);
    }
    if (l_or_c.type === 'Change') {
      Meteor.call('addChange', l_or_c.text);
    }
  },

  render: function() {
    return (
      <div className='likes-and-changes'>
        <AddLikeOrChange onAddLikeOrChangeSubmit={this.handleLikeOrChangeClick}/>
        <div className='row'>
          <div className='col s6'>
            <Likes data={this.state.likes} />
          </div>
          <div className='col s6'>
            <Changes data={this.state.changes} />
          </div>
        </div>
      </div>
    );
  }
});

var AddLikeOrChange = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault(e);
    var type = $(document.activeElement)[0].value;
    var text = this.refs.text.getDOMNode().value.trim();
    if (!text) {
      return;
    }
    this.props.onAddLikeOrChangeSubmit({type: type, text: text});
    this.refs.text.getDOMNode().value = '';
    return;
  },

  render: function() {
    return (
      <form className="add-like-or-change" onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="input-field col s12">
            <textarea id="textarea1" className="materialize-textarea" ref='text'></textarea>
            <label htmlFor="textarea1">Like or Change?</label>
            <div className="row">
              <div className="col s6 center-align">
                <input className="btn-like btn waves-effect waves-light" type="submit" value="Like"></input>
              </div>
              <div className="col s6 center-align">
                <input className="btn-change btn waves-effect waves-light" type="submit" value="Change"></input>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
});

var Likes = React.createClass({
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
        <ul className='fa-ul'>
          {likeNodes}
        </ul>
      </div>
    );
  }
});

var Changes = React.createClass({
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
        <ul className='change-list fa-ul'>
          {changeNodes}
        </ul>
      </div>
    );
  }
});

Meteor.methods({
  addLike: function(text) {
    LikesCollection.insert({
      text: text,
      createdAt: new Date()
    });
  },

  addChange: function(text) {
    ChangesCollection.insert({
      text: text,
      createdAt: new Date()
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

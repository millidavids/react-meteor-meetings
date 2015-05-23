LikesCollection = new Mongo.Collection('likes');
ChangesCollection = new Mongo.Collection('changes');

var LikesAndChanges = ReactMeteor.createClass({
  templateName: 'LikesAndChanges',

  startMeteorSubscriptions: function() {
    Meteor.subscribe('likes');
    Meteor.subscribe('changes');
  },

  getInitialState: function() {
    return {
      date: new Date()
    };
  },

  getMeteorState: function() {
    return {
      likes: LikesCollection.find().fetch().reverse(),
      changes: ChangesCollection.find().fetch().reverse()
    };
  },

  handleLikeOrChangeClick: function(l_or_c) {
    if (l_or_c.type === 'Like') {
      Meteor.call('addLike', l_or_c.text, this.state.date);
    }
    if (l_or_c.type === 'Change') {
      Meteor.call('addChange', l_or_c.text, this.state.date);
    }
  },

  handleLastWeek: function() {
    var today = new Date(this.state.date);
    var last_week = new Date(this.state.date);
    last_week.setDate(today.getDate()-7);
    this.setState({date: last_week});
  },

  handleNextWeek: function() {
    var today = new Date(this.state.date);
    var next_week = new Date(this.state.date);
    next_week.setDate(today.getDate()+7);
    this.setState({date: next_week});
  },

  setDate: function(e) {
    var newDate = new Date(e.target.value);
    newDate.setDate(newDate.getDate() + 1);
    this.setState({date: new Date(newDate)});
  },

  render: function() {
    if (Meteor.userId() === null) {
      return (<div className='LOL-PLZ-SIGN-IN'></div>);
    } else {
      var formatedDate = this.state.date.getFullYear() + '-' +
          ('0' + (this.state.date.getMonth() + 1)).slice(-2) + '-' +
          ('0' + this.state.date.getDate()).slice(-2);
      return (
        <div className='likes-and-changes'>
          <div className='row date-row'>
            <button className='next-week col s2 right' onClick={this.handleNextWeek}>Next Week</button>
            <form className='col s3 date-form right right-align'>
              <input type='date' value={formatedDate} className='datepicker' onChange={this.setDate}></input>
            </form>
            <button className='last-week col s2 right' onClick={this.handleLastWeek}>Last Week</button>
          </div>
          <AddLikeOrChange onAddLikeOrChangeSubmit={this.handleLikeOrChangeClick}/>
          <div className='row'>
            <div className='col s6 left'>
              <Likes date={this.state.date} data={this.state.likes} />
            </div>
            <div className='col s6 right'>
              <Changes date={this.state.date} data={this.state.changes} />
            </div>
          </div>
        </div>
      );
    }
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
    var today = this.props.date;
    var likeNodes = this.props.data.map(function(like, index) {
      if (like.createdAt.getFullYear() === today.getFullYear() &&
          like.createdAt.getMonth() === today.getMonth() &&
          like.createdAt.getDate() === today.getDate()) {
        return (
          <li className='clearfix' key={index}>
            <Like likeObject={like} />
          </li>
        );
      }
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
    var today = this.props.date;
    var changeNodes = this.props.data.map(function(change, index) {
      if (change.createdAt.getFullYear() === today.getFullYear() &&
          change.createdAt.getMonth() === today.getMonth() &&
          change.createdAt.getDate() === today.getDate()) {
        return (
          <li className='clearfix' key={index}>
            <Change changeObject={change} />
          </li>
        );
      }
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

var Like = React.createClass({
  handleDelete: function(e) {
    e.preventDefault(e);
    Meteor.call('deleteLike', this.props.likeObject._id);
  },

  render: function() {
    return (
      <div className='like'>
        <div className='row'>
          <div className='col s10 like-column'>
            <span className='like-text'>{this.props.likeObject.text}</span>
          </div>
          <div className='col s1'>
            <button className="delete right" onClick={this.handleDelete}>
              <div className='mdi-navigation-close'></div>
            </button>
          </div>
        </div>
      </div>
    );
  }
});

var Change = React.createClass({
  handleDelete: function(e) {
    e.preventDefault(e);
    Meteor.call('deleteChange', this.props.changeObject._id);
  },

  handleMoveForward: function(e) {
    e.preventDefault(e);
    var reactID = e.dispatchMarker;
    var dataAttribute = '[data-reactid="'.concat(reactID).concat('"]');
    var arrowNode = $(dataAttribute);
    var changeID = this.props.changeObject._id;
    arrowNode.fadeOut(500, function() {
      Meteor.call('moveChangeForward', changeID);
    });
  },

  render: function() {
    var movedArrow;
    if (this.props.changeObject.moved) {
      movedArrow = 'hidden';
    } else {
      movedArrow = 'move-forward right';
    }
    return (
      <div className='change'>
        <div className='row'>
          <div className='col s10 change-column'>
            <span className='change-text'>{this.props.changeObject.text}</span>
          </div>
          <div className='col s1'>
            <button className="delete right" onClick={this.handleDelete}>
              <div className='mdi-navigation-close'></div>
            </button>
          </div>
          <div className='col s1'>
            <button className={movedArrow} onClick={this.handleMoveForward}>
              <div className='mdi-navigation-arrow-forward'></div>
            </button>
          </div>
        </div>
      </div>
    );
  }
});

if(Meteor.isClient) {
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  addLike: function(text, date) {
    if (Meteor.userId() === null) {
      console.log('Please sign in first, how did you click this?');
    } else {
      LikesCollection.insert({
        text: text,
        createdAt: date,
        owner: Meteor.userId(),
        username: Meteor.userId().username
      });
    }
  },

  addChange: function(text, date) {
    if (Meteor.userId() === null) {
      console.log('Please sign in first, how did you click this?');
    } else {
      ChangesCollection.insert({
        text: text,
        createdAt: date,
        owner: Meteor.userId(),
        username: Meteor.userId().username,
        moved: false
      });
    }
  },

  moveChangeForward: function(changeID) {
    var change = ChangesCollection.findOne({_id: changeID});
    var current_day = new Date(change.createdAt);
    var next_week = new Date(change.createdAt);
    next_week.setDate(current_day.getDate()+7);
    ChangesCollection.update({_id: changeID}, {$set: {moved: true}});
    Meteor.call('addChange', change.text, next_week);
  },

  deleteLike: function(id) {
    LikesCollection.remove(id);
  },

  deleteChange: function(id) {
    ChangesCollection.remove(id);
  }
});

if (Meteor.isServer) {
  Meteor.publish('likes', function(){
    return LikesCollection.find({owner: this.userId});
  });
  Meteor.publish('changes', function(){
    return ChangesCollection.find({owner: this.userId});
  });
}

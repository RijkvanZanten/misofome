import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import IconButton from 'material-ui/IconButton';
import IconAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import CardToolbar from '../components/CardToolbar';

const styles = {
  imageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
    zIndex: 10,
  },
  fileButton: {
    marginTop: '35px',
  },
};

const mapStateToProps = state => ({ user: state.user });

class Cards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newCard: false,
    };

    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.postCard = this.postCard.bind(this);
  }

  openDialog() {
    this.setState({ newCard: true });
  }

  closeDialog() {
    this.setState({ newCard: false });
  }

  postCard() {
    const formData = new FormData();

    // this.props.postCard(this.props.user.token, formData);

    this.closeData();
  }

  render() {
    const actions = [
      <FlatButton
        label="Annuleer"
        primary
        onTouchTap={this.closeDialog}
      />,
      <FlatButton
        label="Sla op"
        primary
        keyboardFocused
        onTouchTap={this.postCard}
      />,
    ];

    return (
      <div>
        <TopBar
          title="Kaarten"
          iconElementRight={(
            <IconButton
              onTouchTap={this.openDialog}
            >
              <IconAdd />
            </IconButton>
          )}
        />
        <CardToolbar />
        <main />
        <BottomNav />
        <Dialog
          title="Nieuwe Kaart"
          actions={actions}
          modal={false}
          open={this.state.newCard}
          onRequestClose={this.closeDialog}
          autoScrollBodyContent
        >
          <TextField
            floatingLabelText="Titel"
            ref={(el) => { this.cardTitle = el; }}
          />
          <TextField
            floatingLabelText="Inhoud"
            ref={(el) => { this.cardContent = el; }}
            multiLine
            rows={3}
          />
          <RaisedButton
            label="Upload afbeelding"
            fullWidth
            secondary
            style={styles.fileButton}
          >
            <input
              type="file"
              style={styles.imageInput}
              ref={(el) => { this.cardImage = el; }}
            />
          </RaisedButton>
        </Dialog>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Cards);

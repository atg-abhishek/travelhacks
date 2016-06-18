/**
 * CitySuggest
 *
 * Display google maps auto complete.
 */

import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Geosuggest from 'react-geosuggest';
import { selectCurrentUser } from 'containers/App/selectors';

import styles from './styles.css';

export class RepoListItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  onSuggestSelect = (suggest) => {
    this.props.onChangeCity(suggest.label);
  }

  render() {
    // const item = this.props.item;
    // let nameprefix = '';

    // If the repository is owned by a different person than we got the data for
    // it's a fork and we should show the name of the owner
    // if (item.owner.login !== this.props.currentUser) {
    //   nameprefix = `${item.owner.login}/`;
    // }

    // Put together the content of the repository
    const content = (
      <div className>
        <Geosuggest
          className={styles.geosuggest}
          placeholder="Type a city"
          initialValue="Montreal"
          onSuggestSelect={this.onSuggestSelect}
          location={new google.maps.LatLng(53.558572, 9.9278215)}  // eslint-disable-line
          radius="20"
        />
      </div>
    );

    // Render the content into a list item
    return (
      <div>
        {content}
      </div>
    );
  }
}


RepoListItem.propTypes = {
  // item: React.PropTypes.object,
  onChangeCity: React.PropTypes.func,
  cityName: React.PropTypes.string,

  // currentUser: React.PropTypes.string,
};

export default connect(createSelector(
  selectCurrentUser(),
  (currentUser) => ({ currentUser })
))(RepoListItem);

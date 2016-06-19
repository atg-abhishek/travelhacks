/*
 *
 * MapResults
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import selectMapResults from './selectors';
import styles from './styles.css';

export class MapResults extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.mapResults}>
      This is MapResults container !
      </div>
    );
  }
}

const mapStateToProps = selectMapResults();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapResults);

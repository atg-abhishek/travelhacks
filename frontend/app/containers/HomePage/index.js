/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import CityPic from './city_1.jpg';

import { createStructuredSelector } from 'reselect';

import {
  selectRepos,
  selectLoading,
  selectError,
} from 'containers/App/selectors';

import {
  selectUsername,
  selectCity,
} from './selectors';

import { changeUsername, changeCity } from './actions';
import { loadCityData } from '../App/actions';

import RepoListItem from 'containers/RepoListItem';
import CitySuggest from 'containers/CitySuggest';

import Button from 'components/Button';
import H1 from 'components/H1';
import List from 'components/List';
import Arrow from './arrow-pointing-to-right.svg';
import ListItem from 'components/ListItem';
import LoadingIndicator from 'components/LoadingIndicator';

import styles from './styles.css';

export class HomePage extends React.Component {
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    if (this.props.username && this.props.username.trim().length > 0) {
      this.props.onSubmitForm();
    }
    console.log('here?');
  }
  /**
   * Changes the route
   *
   * @param  {string} route The route we want to go to
   */
  openRoute = (route) => {
    this.props.changeRoute(route);
  };

  /**
   * Changed route to '/features'
   */
  openFeaturesPage = () => {
    this.openRoute('/features');
  };

  render() {
    let mainContent = null;

    // Show a loading indicator when we're loading
    if (this.props.loading) {
      mainContent = (<List component={LoadingIndicator} />);

    // Show an error if there is one
    } else if (this.props.error !== false) {
      const ErrorComponent = () => (
        <ListItem item={'Something went wrong, please try again!'} />
      );
      mainContent = (<List component={ErrorComponent} />);

    // If we're not loading, don't have an error and there are repos, show the repos
    } else if (this.props.repos !== false) {
      mainContent = (<List items={this.props.repos} component={RepoListItem} />);
    }

    return (
      <article
        className={styles.mainBackground}
        style={{
          backgroundImage:
          `linear-gradient(
          rgba(0, 0, 0, 0.35),
          rgba(0, 0, 0, 0.35)), url(${CityPic})`,
        }}
      >
        <section className={styles.textSection}>
          <form className={styles.usernameForm} onSubmit={(evt) => { this.props.onSubmitForm(evt, this.props.city); } }>
            <H1>Where do you want to go?</H1>
            <div className={styles.containerBox}>
              <div className={styles.leftContainer}>
                <CitySuggest className={styles.citySuggest} onChangeCity={this.props.onChangeCity} />
              </div>
              <button style={{backgroundImage: `url(${Arrow})`}} className={styles.submitButton} type="submit"></button>
            </div>
          </form>
        </section>
      </article>
    );
  }
}

HomePage.propTypes = {
  changeRoute: React.PropTypes.func,
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  repos: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  onSubmitForm: React.PropTypes.func,
  username: React.PropTypes.string,
  city: React.PropTypes.object,
  onChangeUsername: React.PropTypes.func,
  onChangeCity: React.PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
    onChangeCity: (city) => dispatch(changeCity(city)),
    changeRoute: (url) => dispatch(push(url)),
    onSubmitForm: (evt, city) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      if (city && city.label) {
        dispatch(loadCityData());
        // todo fix this
        dispatch(push('emotions'));
      }
    },
    dispatch,
  };
}

const mapStateToProps = createStructuredSelector({
  repos: selectRepos(),
  username: selectUsername(),
  city: selectCity(),
  loading: selectLoading(),
  error: selectError(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

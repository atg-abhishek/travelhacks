/**
*
* EmotionButton
*
*/

import React, { PropTypes } from 'react';

import styles from './styles.css';

function EmotionButton(props) {
  const className = props.className ? props.className : styles.emotionButton;
  const selectedClass = props.selected ? styles.selected : '';

  // Render an anchor tag
  const button = (
    <a className={`${className} ${selectedClass}`} href={props.href} onClick={props.onClick}>{props.children}</a>
  );

  return (
    <div className={styles.buttonWrapper}>
      {button}
    </div>
  );
}

EmotionButton.propTypes = {
  className: PropTypes.string,
  handleRoute: PropTypes.func,
  href: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default EmotionButton;

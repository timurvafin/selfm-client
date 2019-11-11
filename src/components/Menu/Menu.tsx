import React, { Component } from 'react';
import Action from 'components/Action';
import cs from 'classnames';

import styles from './menu.scss';
import { MoreIcon } from '../Icon';


export default class Menu extends Component<{ items: any }, { menuOpen: boolean }> {
  private popupEl;

  constructor(props) {
    super(props);
    
    this.state = {
      menuOpen: false,
    };
  }
  
  showMenu(show) {
    if (show) {
      console.log('focus', this.popupEl);
      this.popupEl.focus();
    }
    
    this.setState({ menuOpen: show });
  }
  
  renderItems(items) {
    return items.map((item, key) => (
      <li
        key={key}
        className={styles['popupMenu__item']}
      >
        {item === 'divider' ?
          <div className={styles['popupMenuDivider']} /> :
          <Action {...item} />
        }
      </li>
    ));
  }
  
  render() {
    const { items } = this.props;
    
    return (
      <div
        className={cs('project__menu', { ['project__menu--open']: this.state.menuOpen })}
        ref={popup => this.popupEl = popup}
        tabIndex={-1}
        onBlur={this.showMenu.bind(this, false)}
      >
        <MoreIcon
          className={styles['project__menu__icon']}
          onClick={this.showMenu.bind(this, true)}
        />
        
        <div className={styles['popupMenu']}>
          <div className={styles['popupMenu__triangle']} />
          <ul className={styles['popupMenu__items']}>
            {this.renderItems(items)}
          </ul>
        </div>
      </div>
    );
  }
}
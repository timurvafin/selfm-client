import React, { Component } from 'react';
import Action from 'components/Action';
import cs from 'classnames';

import './menu.scss';
import { MoreIcon } from '../../components/Icon';


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
        className="popup-menu__item"
      >
        {item === 'divider' ?
          <div className="popup-menu--divider" /> :
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
          className="project__menu__icon"
          onClick={this.showMenu.bind(this, true)}
        />
        
        <div className="popup-menu">
          <div className="popup-menu__triangle" />
          <ul className="popup-menu__items">
            {this.renderItems(items)}
          </ul>
        </div>
      </div>
    );
  }
}
import React, {Component} from 'react'
import Icon from 'src/components/icon'
import Action from 'src/components/action'
import cs from 'classnames'

import './menu.scss'

export default class ProjectMenu extends Component {
    constructor(props) {
        super(props)

        this.state = {
            menuOpen: false,
        }

        //this.onDotsClick = this.toggleMenu.bind(this)
    }

    /*componentDidMount() {
        document.body.addEventListener('click', () => {
            this.setState({menuOpen: false})
        })
    }

    componentDidUnMount() {
        document.body.addEventListener('click', () => {
            this.setState({menuOpen: false})
        })
    }*/
    
    showMenu(show) {
        if (show) {
            console.log('focus', this.popupEl)
            this.popupEl.focus()
        }

        this.setState({menuOpen: show})
    }
    
    renderItems(items) {
        return items.map((item, key) => {
            return <li key={key} className="popup-menu__item">
                {item === 'divider' ?
                    <div className="popup-menu--divider"></div> :
                    <Action {...item} />
                }
            </li>
        })
    }
    
    render() {
        const {items} = this.props
        
        return (
            <div 
                className={cs('project__menu', {['project__menu--open']: this.state.menuOpen})} 
                ref={popup => this.popupEl = popup} 
                tabIndex="-1" 
                onBlur={this.showMenu.bind(this, false)}
            >
                <Icon name="dots" className="project__menu__icon" onClick={this.showMenu.bind(this, true)}/>
                
                <div className="popup-menu"   >
                    <div className="popup-menu__triangle"></div>
                    <ul className="popup-menu__items">
                        {this.renderItems(items)}
                    </ul>
                </div>
            </div>
        )
    }
}
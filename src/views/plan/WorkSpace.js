import React from 'react'
import {connect} from 'react-redux'
import {ENTER_KEY, findInArray} from 'src/utils/common'
import Project from './Project'
import TaskList from './TaskList'
import {Route, withRouter} from 'react-router-dom'
import _ from 'lodash/fp'

class WorkSpace extends React.Component {
    onKeyDown(e) {
        if (e.keyCode !== ENTER_KEY) {
            return;
        }

        e.preventDefault();

        const val = this.input.value;

        if (val) {
            this.props.createTask(val);
            this.input.value = '';
        }
    }

    render() {
        const project = this.props.project ?
            <Project {...this.props} {...this.props.project} update={this.props.updateProject} /> : ''

        return <div className="workspace">
                {/*<input
                    ref={elem => this.input = elem}
                    type="text"
                    className="tm__input"
                    placeholder="Task"
                    autoFocus={true}
                    onKeyDown={this.onKeyDown.bind(this)}/>*/}

            {project}
        </div>
    }
}

function mapStateToProps(state) {
    const project = _.find(p => p.open)(state.projects)
    const children = _.pickBy(task => task.parent_id === project.id)(state.tasks);
    const childrenList = _.values(children);

    return {
        project,
        children: childrenList
    };
}

export default withRouter(connect(mapStateToProps)(WorkSpace))


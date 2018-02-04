import {all, fork} from 'redux-saga/effects'
import projectsSaga from './projects'
import tasksSaga from './tasks'
import todosSaga from './todos'

export default function*() {
    yield all([
        fork(projectsSaga),
        fork(tasksSaga),
        fork(todosSaga),
    ])
}
import { randomString } from 'src/utils/common'
import { put } from 'redux-saga/effects'

export function* createEntity(addActionCreator, action) {
    const tempId = randomString()

    yield put(addActionCreator({
        id: tempId,
        _new: true,
        parent_id: action.parentId
    }))
}
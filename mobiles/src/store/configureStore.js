import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import vegoApp from '../reducers';

//applyMiddleware 来自redux, 可以包装store的dispatch.
//thunk作用是使action创建函数可以返回一个function代替一个action对象

const createStoreWithMiddleware = applyMiddleware(
    thunk
)(createStore)

export default function configureStore(initialState) {
    const store = createStoreWithMiddleware(vegoApp, initialState,

        //调试redux
        window.devToolsExtension && window.devToolsExtension()
    );

    //热替换选项
    if (module.hot) {
        module.hot.accept('../reducers', () => {
            const nextReducer = require('../reducers')
            store.replaceReducer(nextReducer)
        })
    }
    return store;
}

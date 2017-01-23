import React, {Component, PropTypes} from 'react';
// import {SortableContainer, SortableElement, arrayMove} from '../index';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import './compile.css';


const Item = SortableElement((item) => {
    return (
		<div className={ item.dIndex < item.freezeNum ? "first-item channel-item" : "other-item channel-item" } data-index={ item.dIndex } data-id={ item.id } onClick={ () => { item.removeChannel(item.dIndex, item) } }>
	        <div className="channel-name">
				{item.name}
			</div>
            { item.editing && item.dIndex >= item.freezeNum ? <span className="close-item"></span> : '' }
        </div>
    )
});

const SortableList = SortableContainer(({removeChannel, freezeNum, items, editing, itemClass}) => {
	return (
		<div>
			{
				items.length > 0 && items.map(({id, name}, index) =>{
					return <Item
						key={ index }
						index={ index }
						name={ name }
						dIndex={ index }
						id={ id }
						freezeNum={ freezeNum }
						editing= { editing }
						className={ itemClass }
						disabled={ editing && index >= freezeNum ? false : true }
						removeChannel={ removeChannel } 
					/>
				}
			)}
		</div>
	);
});

class ListWrapper extends Component {
	constructor({props}) {
		super(props);
		this.state = {
			items: [],
			editing: false,
			isSorting: false
		};
		this.key = false;
		// this.removeChannel = this.removeChannel.bind(this);
	}
	componentWillMount() {
		console.log(this.props)
	}

	componentDidMount() {
		console.log('====componentDidMount=====')
	}

	componentWillReceiveProps(nextProps, nextState) {
		if (nextProps.items.length > 0) {
			this.setState({
				items: nextProps.items,
				editing: nextProps.editing
			})
		}
	}

	componentDidUpdate() {
		if (this.state.items.length > 0 && !this.key) {
			let channelItems = document.querySelector('.channel-items.me').children[0];
			let timeout = undefined;
			//长按进入编辑页面
			channelItems.addEventListener('touchstart', (event) => {
				// event.stopPropagation();
				// event.preventDefault();
				if (event.target && event.target.className === "channel-name") {
					timeout = setTimeout(() => {
						//执行方法
						if (!this.state.editing) {
							console.log('长按操作')
							this.props.ClickToEditOrOver();
						}
					}, 1000);
				}
			}, false)

			//解决滑动时触发编辑的问题
			channelItems.addEventListener('touchmove', (event) => {
				clearTimeout(timeout);
			}, false)

			channelItems.addEventListener('touchend', (event) => {
				clearTimeout(timeout);
			}, false)
			this.key = true;
		}
	}

	static propTypes = {
		items: PropTypes.array,
		onSortStart: PropTypes.func,
		onSortEnd: PropTypes.func,
		component: PropTypes.func,
		removeChannel: PropTypes.func,
		ClickToEditOrOver: PropTypes.func
	}

	onSortStart = () => {
		this.setState({isSorting: true});
		
	};
    onSortEnd = ({oldIndex, newIndex}) => {
        let {items} = this.state;
        this.setState({isSorting: false});
		this.props.toDragSetState(arrayMove(items, oldIndex, newIndex));
    };
	render() {
		const Component = this.props.component;
		const removeChannel = this.props.removeChannel;
		const freezeNum = this.props.freezeNum;
		const {items, isSorting, editing} = this.state;
		const props = {
			isSorting,
			items,
			editing,
			removeChannel,
			freezeNum,
			onSortEnd: this.onSortEnd,
			onSortStart: this.onSortStart,
			axis: 'xy',
			pressDelay: 200,
			itemClass: 'channel-items'
		}
		return <SortableList {...this.props} {...props} />
	}
}

export default ListWrapper;



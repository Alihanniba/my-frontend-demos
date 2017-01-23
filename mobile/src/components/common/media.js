import React from 'react';
import Ripple from '../../libs/ripple';
/*


*/
const Media = React.createClass({
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
  },
  componentDidMount() {
    this.refs.item.addEventLister('click', this.click, false);
  },
  click(evt) {
    if (this.props.onClick) {
      evt.preventDefault && evt.preventDefault();
      Ripple(evt, () => {
        this.props.onClick(this.props);
      });
      return false;
    }
  },
  render() {
    return (
      <div className='media-item' ref='item'>
        <div {this.props.className ? 'className=\'rate ' + this.props.className + '\'' : 'className=\'rate rate16x9\''} >
          <div className='size'>
            <div className='container'>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default Media;

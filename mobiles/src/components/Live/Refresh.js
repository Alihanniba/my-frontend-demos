class VTouch {
    constructor(dom, way, begin, done) {
        this.dom = dom;
        this.way = way;
        this.begin = begin;
        this.done = done;
        this._start = 0;
        this._end = 0;
        this._startKey = false;
        this.touchMove = this.touchMove.bind(this)
        this.touchStart = this.touchStart.bind(this)
        this.touchcancel = this.touchcancel.bind(this)
        this.touchEnd = this.touchEnd.bind(this)
    }
    init() {
        this.dom.addEventListener("touchstart", this.touchStart, false);
        this.dom.addEventListener("touchmove", this.touchMove, false);
        this.dom.addEventListener("touchcancel", this.touchcancel, false);
        this.dom.addEventListener("touchend", this.touchEnd, false);
    }
    destory() {
        this.dom.removeEventListener("touchstart", this.touchStart, false);
        this.dom.removeEventListener("touchmove", this.touchMove, false);
        this.dom.removeEventListener("touchcancel", this.touchcancel, false);
        this.dom.removeEventListener("touchend", this.touchEnd, false);
    }
    touchStart(event) {
        let touch = event.targetTouches[0];
        if (this.way == "x") {
            this._start = touch.pageX;
        } else {
            this._start = touch.pageY;
        }
    }
    touchMove(event) {
        var touch = event.targetTouches[0];
        document.body.scrollTop <= 50 && this._start - touch.pageX < 0 && event.preventDefault();

        if (this.way == "x") {
            this._end = (this._start - touch.pageX);
        } else {
            this._end = (this._start - touch.pageY);

            console.log(this._end);
            //页面下拉，进入第一步，提示：正在下拉，释放后刷新
            if (this._end < -50) {
                console.log('=====正在下拉，释放后刷新======' + document.body.scrollTop);
                if (document.body.scrollTop <= 50) {
                    this._startKey = true;
                    this.begin()
                    return
                }
            }
        }
    }
    touchcancel(e) {
        // e.preventDefault()
        console.log('===========touchcancel=========');
        setTimeout(() => {
                if (this.dom.scrollTop <= 50) {
                    this.done()
                }
            }, 500)
            // e.preventDefault()
    }
    touchEnd(evnet) {
        // event.preventDefault()
        console.log('===========touchEnd=========');
        if (this._end > 0) {
            console.log("左滑或上滑" + this._end);
        } else {
            console.log("右滑或下滑" + this._end);
            //下拉结束，进入第二步：正在刷新 ...
            console.log('=====下拉结束，进入第二步：正在刷新 ======');
            console.log(document.body.scrollTop);
            //刷新成功，进入第三步，关闭提示区
            if (this._startKey) {
                this._startKey = false;
                this.done()
                    // return
            }
            // console.log('=======scrollTop 不是0，不鸟你=========');
            // setTimeout(function(){
            //   console.log('===========模拟刷新成功，进入第三步，关闭提示区=========');
            // }, 2500);
        }
    }
}
//
export default VTouch
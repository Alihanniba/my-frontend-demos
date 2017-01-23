import React, { Component } from 'react';
import {browserHistory, hashHistory} from 'react-router';
import {titleBarInitNoOnseUi, deleteBottomInitNoOnseUi, comfDialog} from '../collect';
import Storage from '../../libs/storage';
import recordTool from '../../actions/record';
import './collect.css'; 
import defaultimg from '../../../public/default.png';
class Collect extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            wifiState:false,
            iconState:false,
            iconExit:false,
            na:[],//[{titleId: 8989,"name":'1',"img":"https://i.ytimg.com/vi/8GNkY6pHlds/mqdefault.jpg",time:Data.now()}]
            itemDelete:[],
            colorMoc:[]
        }
        this.item=[],
        this.leftLabelClick   = this.leftLabelClick.bind(this) 
        this.rightLabelClick  = this.rightLabelClick.bind(this)
        this.ListClick        = this.ListClick.bind(this)
        this.deleteLabelClick = this.deleteLabelClick.bind(this)
        this.clearLabelClick  = this.clearLabelClick.bind(this)
        this.cancleExitClick  = this.cancleExitClick.bind(this)
        this.clearExitClick   = this.clearExitClick.bind(this)
        this.handleScroll     = this.handleScroll.bind(this)
        this.handleTouchMove  = this.handleTouchMove.bind(this)
        this.listInitNoOnseUi = this.listInitNoOnseUi.bind(this)
        this.pageSplite       = this.pageSplite.bind(this)
        this.refreshPage      = this.refreshPage.bind(this)
        this.pos              = ''
        this.startPos         = 0
        this.everyPage        = 14
        this.mocData          = []
    }
    componentWillMount() {
        console.log(defaultimg) 
        Storage.s_set(Storage.KEYS.COLLECT_PAGE_KEY, true);
        if(!!!this.startPos){
            !!!Storage.get(Storage.KEYS['FAVOURITE']) ? this.mocData = [] : this.mocData = Storage.get(Storage.KEYS['FAVOURITE'])
            this.startPos += 1
            this.pageSplite(this.everyPage,this.mocData,this.state.na)
        }
    }
    componentWillReceiveProps(nextProps, prevState) {
        
    }
    componentDidMount() {
      window.addEventListener('touchmove',this.refreshPage,false)
      window.addEventListener('touchmove', this.handleTouchMove,false)
    }
    componentWillUnmount() {
        window.removeEventListener('touchmove',this.refreshPage,false)
        window.removeEventListener('touchmove',this.handleTouchMove,false)
    }
    pageSplite(everyPage,mocData,uiData,func){
       let a = uiData.concat(mocData.splice(0,everyPage))
       this.item = a 
       this.setState({na:a})
    }
    refreshPage(){
        !!this.mocData.length ?  this.pageSplite(this.everyPage,this.mocData,this.state.na) : window.removeEventListener('touchmove',this.refreshPage,false)
    }
    handleTouchMove(e){
        if (this.state.iconExit) {  
            event.preventDefault();
            event.stopPropagation();
        }

    }
    handleScroll(e){
        if (this.state.iconExit){
            document.body.style.overflow = 'hidden'
        }
    }
    leftLabelClick(){
        history.go(-1)
    }
    rightLabelClick(){
        this.state.itemDelete = []
        this.state.colorMoc=recordTool.removeAllFlag(this.state.colorMoc,"","")
        this.setState({iconState:!this.state.iconState})   
        
    }
    ListClick(index){
        if (this.state.iconState){
            let count = this.state.itemDelete
            let coor  = recordTool.isInArray(index,this.state.itemDelete)
            coor==-1?this.state.colorMoc[index]= 'o' : this.state.colorMoc[index] = 'u'
            let a=recordTool.getNewArray(recordTool.isInArray(index,this.state.itemDelete),count,index)
            this.setState({itemDelete:a})
            console.log(a)
            console.log(index)
        }else{
            hashHistory.push('/watch/'+this.state.na[index]['titleId']+"?eid=" + this.state.na[index]['episodeId'])
            console.log("send a message to video "+this.state.na[index]['titleId'])
        }
    }
    deleteLabelClick(){
        this.pos = 6.8 + 'rem'
        document.body.style.overflow = 'hidden'
        this.setState({iconExit:true})
    }
    clearLabelClick(){
        if (this.state.itemDelete.length!==0){
            var val = [];
            for (let i =0;i<this.state.itemDelete.length;i++){
                typeof this.state.na[this.state.itemDelete[i]]['episodeId'] == String ?  this.state.na[this.state.itemDelete[i]]['episodeId'] = + this.state.na[this.state.itemDelete[i]]['episodeId'] : this.state.na[this.state.itemDelete[i]]['episodeId']
                val.push( this.state.na[this.state.itemDelete[i]]['episodeId'])
            }
            Storage.deleteItems(Storage.KEYS['FAVOURITE'],val)
            Storage.delete(Storage.KEYS['FAVOURITE'],function(item){
                return val.indexOf(item.episodeId) > -1
            })  
            this.item = recordTool.deleteArray(this.state.itemDelete,this.item)
            this.state.itemDelete = []
            this.state.colorMoc=[]
            this.pageSplite(this.everyPage,this.mocData,this.state.na)           
        }
    }
    cancleExitClick(){
        this.setState({iconExit:false})
        document.body.style.overflow = ''
    }
    clearExitClick(){
        var val = [];
        for (let i =0;i<this.state.na.length;i++){
            typeof this.state.na[i]['episodeId'] == String ?  this.state.na[i]['episodeId'] = + this.state.na[i]['episodeId'] : this.state.na[i]['episodeId']
            val.push( this.state.na[i]['episodeId'])
        }
        for(let i=0;i<this.mocData.length;i++){
            typeof this.mocData[i]['episodeId'] == String ?  this.mocData[i]['episodeId'] = + this.mocData[i]['episodeId'] : this.mocData[i]['episodeId']
            val.push(this.mocData[i]['episodeId'])
        }
        Storage.deleteItems(Storage.KEYS['FAVOURITE'],val)
        Storage.delete(Storage.KEYS['FAVOURITE'],function(item){
            return val.indexOf(item.episodeId) > -1
        }) 
        document.body.style.overflow = ''
        this.setState({na:[]})
    }
    listInitNoOnseUi(){
        let hidden,
            u,
            i,
            urlimg,
            item;
        this.state.iconState ? hidden ="inline-block" : hidden = "none" ;
        if (this.item.length==0){
            return null
        }
        else{
            
            return(  
                this.state.na.map((item,i)=>{
                    !!this.state.colorMoc[i] ? this.state.colorMoc[i] = this.state.colorMoc[i]  : this.state.colorMoc[i] = "u" 
                    !!this.state.na[i]['img'] ? this.state.na[i]['img'] = this.state.na[i]['img'] : this.state.na[i]['img'] = defaultimg
                    return(
                    <div className='li-list' key={i} onClick={()=>this.ListClick(i)} >
                        <div className={this.state.colorMoc[i]} style={{display:`${hidden}`}} ref='l'>
                            <div className='left-container-icon'></div>
                        </div>
                        <div className='center-container'>
                            <img src={this.state.na[i]['img']} className='center-container-img'/>
                        </div>
                        <div className='center-container-time'>{recordTool.formatSeconds(this.state.na[i][''])}</div>
                        <div className='right-container'>
                            <div className='right-container-text'>{this.state.na[i]['name'].slice(0,30)}</div>
                            <div className='right-container-time'>{""+recordTool.formatSeconds(this.state.na[i][''])}</div>
                        </div>    
                    </div>
                    )
                
                })
            )
        }   
    }
    render() {
        let titleBar  = titleBarInitNoOnseUi(this.leftLabelClick,this.rightLabelClick,this.state.iconState,!!this.state.na.length,"收藏")
        let bottomBar = deleteBottomInitNoOnseUi(this.deleteLabelClick,this.clearLabelClick,this.state.itemDelete.length,this.state.iconState)
        let dialInit  = comfDialog("","您确定清空所有视频吗?","清空","取消",this.clearExitClick,this.cancleExitClick,this.state.iconExit,this.pos)
        let listInit  = this.listInitNoOnseUi()
        let hidden    = this.state.iconExit? hidden="visible" : hidden="hidden"
        let showTo    = this.state.iconState ? showTo = "inline-block" : showTo = "none"
        if(this.state.wifiState){
            return(
                <div className='container' onClick={()=>this.refreshPage()}>
                    <div style={{lineHeight:"16rem",textAlign:"center"}}></div>
                </div>
                
            ) 
        }
        if (!!!this.state.na.length){
            return (
                <div className='container'>
                    {titleBar}
                    <div style={{lineHeight:"16rem",textAlign:"center"}}>客官您还没有收藏过任何视频</div>
                </div>
                )
        }
        return (
                <div className='container'>
                    {titleBar}
                    {bottomBar}
                    <div className='shadowbox' style={{visibility:`${hidden}`}}></div>
                    {dialInit}
                    <div className='main' ref="mainTest">
                        <div className='refresh'></div>
                        {listInit}
                        <div className='bottomSpace' style={{display:`${showTo}`}}></div>
                    </div>
                </div>       
        )
    }
}

export default Collect

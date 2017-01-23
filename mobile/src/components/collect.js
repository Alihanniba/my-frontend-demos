import {Toolbar,Input,BackButton,Button,BottomToolbar,List,ListItem} from 'react-onsenui';
import React, { Component } from 'react';
import './Record/record.css';
import './Collect/collect.css';
/*
 *titleBarInit func notice :  
 */
export function titleBarInit(leftLabelClick,rightLabelClick,stateIcon,stateData) {
	var hidden,
	    describe,
	    chColor = "black";
	if (stateData){
	 	if (stateIcon){
	 		describe = "取消"
	 	}
	 	else{
	 		describe = "编辑"
	 	}
	 	hidden = "block"
	}else{
		hidden = "none"
		describe = ""
	}

  return (
  		<Toolbar className='titleBarInit' style={{background:"white"}}>
            <div className='left'>
                <BackButton onClick={leftLabelClick} style={{color:`${chColor}`}}></BackButton>
            </div>
            <div className='center' style={{color:"black",opacity:0.9}}>
                {"记录"}
            </div>
            <div className='right'>
                <Button onClick={rightLabelClick} style={{display:`${hidden}`,color:`${"black"}`,background:"white"}}>{describe}</Button>
            </div>
        </Toolbar>
  	)
}
export function mainContentInit(dataLen,renderRow){
	return(
		<List 
    	dataSource={dataLen}
        renderRow={renderRow}
    	/>
    )	
}
/*
 *deleteBottomInit func notice :   
 */
export function deleteBottomInit(clearClick,deleteClick,count,stateIcon){
	let hidden;
	stateIcon ? hidden = "visible" : hidden = "hidden"
	return(
		<BottomToolbar style={{position:"fixed",display:"flex",visibility:`${hidden}`}} className='bottomBar'>
			<div style={{flex:1}} onClick={clearClick}>
			<Button style={{backgroundColor:"red"}}>{"清空"}</Button>
			</div>
			<div style={{flex:1}} onClick={deleteClick}>
			<Button style={{backgroundColor:"green"}}>{"删除"+"("+`${count}`+")"}</Button>
			</div>
		</BottomToolbar>
	)
}
export function exitDialog(hidden,leftLabelClick,rightLabelClick){
	hidden ? hidden = {visibility:"visible"} : {visibility:"hidden"}
	return(
		<div >
			
		</div>
	)
}
export function titleBarInitNoOnseUi(leftLabelClick,rightLabelClick,stateIcon,stateData,titleName) {
	var hidden,
	    describe,
	    chColor = "black";
	if (stateData){
	 	if (stateIcon){
	 		describe = "取消"
	 	}
	 	else{
	 		describe = "编辑"
	 	}
	 	hidden = "visible"
	}else{
		hidden = "hidden"
		describe = "取消"
	}

  return (
  			<div className='header'>
                <div className='leftLabel' onClick={leftLabelClick} >
                    <div className='leftLabelicon'/>
                </div>
                <div className='centerLabel'>{titleName}</div>
                <div className='rightLabel' onClick={rightLabelClick} style={{visibility:`${hidden}`}}>{describe}</div>
            </div>
  	    )
}
export function deleteBottomInitNoOnseUi(clearClick,deleteClick,count,stateIcon){
	let hidden;
	stateIcon ? hidden = "visible" : hidden = "hidden"
	return(
		<div className='footer' style={{visibility:`${hidden}`}}>
            <div className='clearLabel' onClick={clearClick}>
                <div className='clearLabelBtn'>{"清空"}</div>
            </div>
            <div className='deleteLabel' onClick={deleteClick}>
                <div className='deleteLabelBtn'>{"删除"+"("+`${count}`+")"}</div>
            </div>

        </div>
	)
}
export function listInitNoOnseUi(item,ListClick,stateIcon){
	let hidden,
	         i,
	        it;  
	stateIcon ? hidden = "block" : hidden = "block"
	if (item.length==0){
		return null
	}
	else{
		return(	
		 item.map((it,i)=>{
				return(
				<div className='li-list' key={i} onClick={ListClick}>
                            <div className='left-container' style={{display:`${hidden}`}}>
                                <div className='left-container-icon'></div>
                            </div>
                            <div className='center-container'>
                                <img src={`http://res.cloudinary.com/dnz3iwzjm//c_scale,h_270,w_480,q_auto:best/v1481789731/sup9ylpjknuwupm2wtjb.jpg`} className='center-container-img'/>
                            </div>
                            <div className='right-container'>
                                <div className='right-container-text'>{"官方解释：将未来的人都是我们的一条线上的人"}</div>
                                <div className='right-container-time'>{"播放至"+"00:00"}</div>

                            </div>    
                        </div>
                )
				
		})
		)
	}	
}
export function comfDialog(titleName,contentName,leftBtnName,RightBtnName,leftBtnClick,RightBtnClick,hidden,pos){
	hidden?hidden = "visible" : hidden = "hidden" ;
	return(
		<div className='alertDialog' style={{visibility:`${hidden}`,position:'fixed',left:"0.5rem",top:"6.8rem"}}>
            <div className='alert-dialog-tit'>{titleName}</div>
            <div className='alert-dialog-cont'>
             	{contentName}
            </div>
            <div className='alert-dialog-foot' >
                <div className='alert-btn-left'>
                 	<div onClick={leftBtnClick} className='alert-dialog-but' style={{background:'#ff566d',color:"white"}}>
                        {leftBtnName}
                    </div>
                </div>
                <div className='alert-btn-right'>
                    <div onClick={RightBtnClick} className='alert-dialog-but' style={{border:"1px solid #d8d8d8"}}>
                      	{RightBtnName}
                    </div>
                </div>
            </div>
        </div>
		)
}
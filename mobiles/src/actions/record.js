import Storage from '../libs/storage';
import {episode} from '../api/home';
import falcor from 'falcor';
import HttpDataSource from 'falcor-http-datasource'
class record {
	constructor (){
				
	}
	isInArray(index,len){
		let flag = -1
		if(len.length==0){
			return flag 
		}
		else{
			for (let i=0;i<len.length;i++){
				if(len[i]==index){
					return i 
				}
			}
		}
		return flag
	}
	getNewArray(flag,arr,index){
		if(flag<0){
			arr.push(index)
		}
		else{
			arr.splice(flag,1)
		}
		return arr
	}
	removeAllFlag(arr,prevState,nextState){
		for (var i=0;i<arr.length;i++){
			arr[i]=nextState
		}
		return arr
	}
	reduceData(titleById,id,durating,current,prevData){
		/*添加新字段给episodesById数据*/
		prevData.titleById = titleById
		prevData.id        = id
		prevData.durating  = durating
		prevData.current   = current
		return prevData
	}
	pushNewData(newData,prevData,flag=true){
		if (localStorage["record"]==undefined||localStorage["record"]==null||localStorage["record"]==""){
			prevData = []
		}
		else{
			prevData = JSON.parse(localStorage["record"])
			console.log(typeof prevData)
		}
		if (prevData.length==0){
			prevData.unshift(newData)
			prevData=JSON.stringify(prevData)
			localStorage.setItem('record',prevData)
			return prevData
		}
		else{
			for (var i=0;i<prevData.length;i++){
				if(prevData[i]["titleById"] == newData["titleById"]&&flag){
					prevData.splice(i,1)
				}
				else if(prevData[i]["id"] == newData["id"]&&!flag){
					prevData.splice(i,1)
				}
			}
			prevData.unshift(newData)
			prevData=JSON.stringify(prevData)
			localStorage.setItem('record',prevData)
			return prevData
		}
	}
	initDataArray(num){
		let a={titleById:4235,id:"4242",name:"",position:"",source_url:"",stream_url:"",free:"",live:"",durating:1234,current:2434}
		a.titleById = +a.titleById+num
		return a
	}
	deleteArray(newData,prevData){
		for (var i = 0; i<newData.length;i++){
			delete prevData[newData[i]]
		}
		console.log(prevData+'<<<<<<<<<')
		for (var j = 0;j<prevData.length;j++){
			if (prevData[j]==undefined||prevData[j]==''||prevData[j]==null){
				prevData.splice(j,1)
				j--
			}
		}
		console.log(prevData+">>>>>>>>>")
		return prevData
	}
	formatSeconds(value){
		if(!!!value){
			return ""
		}
    	var theTime = parseInt(value);// 秒
    	var theTime1 = 0;// 分
    	var theTime2 = 0;// 小时
    	if(theTime >= 60) {
        	theTime1 = parseInt(theTime/60);
        	theTime = parseInt(theTime%60);
            	if(theTime1 >= 60) {
            	theTime2 = parseInt(theTime1/60);
            	theTime1 = parseInt(theTime1%60);
            }
    	}
        var result = ""+parseInt(theTime)+"";
        if(theTime1 > 0) {
        	result = ""+parseInt(theTime1)+"s"+result;
        }
        if(theTime2 > 0) {
        	result = ""+parseInt(theTime2)+"s"+result;
        }
        let a = result.split("s");
        if (a.length==1){
        	a[0].length == 1 ? result = "00:0" + a[0] : result = "00:" + a[0]
        }
        if (a.length==2){
        	if(a[0].length == 1 && a[1].length == 1){
        		result = "0" + a[0] + ":0" + a[1] 
        	}else if(a[0].length == 1 && a[1].length != 1){
        		result = "0" + a[0] + ":" + a[1] 
        	}else if(a[0].length != 1 && a[1].length == 1){
        		result = a[0]  + ":0" + a[1] 
        	}else if(a[0].length != 1 && a[1].length != 1){
        		result = a[0]  + ":" + a[1]
        	} 
        }
        if (a.length==3){
        	if(a[0].length == 1 && a[1].length == 1 && a[2].length == 1){
        		result = "0" + a[0] + ":0" + a[1] + ":0" + a[2] 
        	}else if(a[0].length == 1 && a[1].length == 1 && a[2].length != 1){
        		result = "0" + a[0] + ":0" + a[1] + ":" + a[2]
        	}else if(a[0].length == 1 && a[1].length != 1 && a[2].length == 1){
        		result = "0" + a[0] + ":" + a[1] + ":0" + a[2]
        	}else if(a[0].length != 1 && a[1].length != 1 && a[2].length == 1){
        		result = "" + a[0] + ":" + a[1] + ":0" + a[2]
        	}else if(a[0].length != 1 && a[1].length != 1 && a[2].length != 1){
        		result = "" + a[0] + ":" + a[1] + ":" + a[2]
        	}else if(a[0].length != 1 && a[1].length == 1 && a[2].length != 1){
        		result = "" + a[0] + ":" + a[1] + ":" + a[2]
        	}
        }
    	return result;
	}
	getAllRecord(vid){
		 episode(vid).then((json)=>{
            for (let i = 0 ;i<json['episodes'].length;i++){
            	if (json['episodes'][i]['id'] == vid){
            	   console.log(json['episodes'][i]['id'])	
            	}
            } 
        },(error)=>{
                console.log("error")
        })

	}
	reduceDataRecord(newData,prevData){
		/*添加新字段给episodesById数据*/
		prevData.titleById       = newData["tid"]
		prevData.id              = newData['vid']
		prevData.durating        = newData['durating']
		prevData.current         = newData['current']
		return prevData
	}
}
var recordTool = new record
export default recordTool
require('styles/App.scss');
import React from 'react';
import ReactDOM from 'react-dom';
var imageDatas=require('../data/imageData.json');

 imageDatas=(function genImageURL(aImageData){
		for(var i=0,j=aImageData.length;i<j;i++){
			var singleImageData =aImageData[i];
			singleImageData.imageURL=require('../images/'+singleImageData.fileName);
			aImageData[i]=singleImageData;
		}
		return aImageData;
	})(imageDatas);



//圖片的讀取 設定
class ImgFigure extends React.Component {
	constructor(props){
		super(props);
		this.handleClick=this.handleClick.bind(this);
	}

	handleClick (e) {
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	}
	
	


	render() {
		var styleObj ={};
		
		//如果 props 屬性中指定了這張圖片的位置，則使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}
		
		//如果圖片的旋轉角度不為0 則設置角度
		if(this.props.arrange.rotate){
			(['MozTransform','msTransform','WebkitTransform','transform']).forEach(function(value){
			
				styleObj[value] = 'rotate('+this.props.arrange.rotate + 'deg)';
			
			}.bind(this));
			
		}

		if(this.props.arrange.isCenter){
			styleObj.zIndex=11;
		}
		var imgFigureClassName = 'img-figure';
			imgFigureClassName += this.props.arrange.isInverse?' is-inverse':'';
		
		return(
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className='img-back' onClick={this.handleClick}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			
			</figure>
		)
	}
}
	
	
class AppComponent extends React.Component {
	/*
	 *也就是说 通过es6类的继承实现时 state的初始化要在constructor中声明 ,無法用
	 *React 當state 有變化，則會重新渲染(render)
	 *getInitialState() {
		return{
				aImgsRange:[
					pos:{
						left:'0',
						top:'0'
					},
					
			
				]
			}
		}
	*/
	
	constructor(props){
		super(props);
		this.state = {
			aImgsRange:[
						/*
						'pos':{
							left:'0',
							top:'0',

						},
						rotate:0,	//圖片的旋轉角度
						isInverse:false, //圖片正反面
						isCenter:false//圖片是否居中
						*/
					],
					Constant:{
						centerPos:{
							left:0,
							right:0
						},
						hPosRange:{ //水平方向的取值範圍
							leftSecX: [0,0],
							rightSecX: [0,0],
							y: [0,0]
						},
						vPosRange:{//垂直方向的取值範圍
							x: [0,0],
							topY: [0,0]
						}
					}
				};
		this.rearrange = this.rearrange.bind(this);
		this.getRangeRandom = this.getRangeRandom;
		this.get30DegRandom=this.get30DegRandom;
		this.inverse=this.inverse.bind(this);
		this.center=this.center.bind(this);
	}
	
	/*
	 *翻轉圖片
	 *@param index 輸入當前被執行inverse圖片的值
	 *@return {Function} 這是一個閉包函數，期內回傳一個真正被執行的函數
	 */
	inverse(index){
		return function(){
			var aImgsRange =this.state.aImgsRange;
			aImgsRange[index].isInverse = !aImgsRange[index].isInverse;
			this.setState({
				aImgsRange:aImgsRange
			})
		}.bind(this);
	}
	
	
	//獲取區間內的隨機值
	getRangeRandom(low,high){
		return Math.ceil(Math.random() * (high - low) + low);
	}
	
	//獲得 0~30之間的任意正負值
	get30DegRandom(){
	
		var Deg =( Math.random() > 0.5 )?Math.ceil(Math.random()*30):Math.ceil(Math.random()*30*-1);
		return 	Deg;
	}
	
	/*
	*重新布局所有圖片
	*@param centerIndex 指定中間排哪個圖片
	*/
	rearrange(centerIndex){
		var aImgsRange = this.state.aImgsRange,
			Constant = this.state.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,
			
			aImgsRangeTop= [],
			topImgNum =Math.ceil(Math.random()*2),//取一個或不取
			topImgSpliceIndex =0,
			aImgsRangeCenter = aImgsRange.splice(centerIndex,1);

			//首先居中 centerIndex的圖片，居中的圖片不需要旋轉。
			aImgsRangeCenter[0]={
				pos:centerPos,
				rotate:0,
				isCenter:true
			}

			
			//取出要布局上方圖片的狀態訊息
			topImgSpliceIndex = Math.ceil(Math.random()*(aImgsRange.length-topImgNum));
			
			aImgsRangeTop = aImgsRange.splice(topImgSpliceIndex,topImgNum);
			
			//布局位於上方的圖片
			aImgsRangeTop.forEach(function(value,index){
				aImgsRangeTop[index]={
					pos:{
						top:this.getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
						left:this.getRangeRandom(vPosRangeX[0],vPosRangeX[1])
					},
					rotate:this.get30DegRandom(),
					isCenter:false
				}
			}.bind(this));
			
			
			//布局位於左右的圖片
			
			for (var i = 0,j= aImgsRange.length, k = j / 2; i < j ;i++){
				var hPosRangeLORX = null;
				
				//前半部分 布局在左邊， 後面的布局在右邊
				if( i < k){
					hPosRangeLORX = hPosRangeLeftSecX;
				}else{
					hPosRangeLORX = hPosRangeRightSecX;
				}
				
				aImgsRange[i]={
					pos:{
						top:this.getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
						left:this.getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
					},
					rotate:this.get30DegRandom(),
					isCenter:false
				}
			}
			
			if(aImgsRangeTop && aImgsRangeTop[0] ){
				aImgsRange.splice(topImgSpliceIndex,0,aImgsRangeTop[0]);
			}
			
			aImgsRange.splice(centerIndex,0, aImgsRangeCenter[0]);
			
			this.setState({
					aImgsRange:aImgsRange
			});
	}
	
	/*
	 *利用rearrange(),把相對應的index圖片 居中
	 *@param index 需要被居中的圖片的index 。
	 *@return {Function}
	 */
	
	center(index){
		return function(){
			this.rearrange(index);
		
		}.bind(this);
		
	}
	
	//加載後，為每張圖片計算其位置範圍
	componentDidMount() {
		//首先拿到舞台的大小
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);
			
		//拿到第一個 imageFigure的大小
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);
			
		this.state.Constant.centerPos ={
			left : halfStageW - halfImgW,
			top : halfStageH - halfImgH
		}
		//計算左右圖片位置範圍
		this.state.Constant.hPosRange.leftSecX[0]=-halfImgW;
		this.state.Constant.hPosRange.leftSecX[1]=halfStageW-halfImgW*3;
		
		this.state.Constant.hPosRange.rightSecX[0]=halfStageW+halfImgW;
		this.state.Constant.hPosRange.rightSecX[1]=stageW-halfImgW;
		this.state.Constant.hPosRange.y[0]=-halfImgH;
		this.state.Constant.hPosRange.y[1]=stageH-halfImgH;
		
		//計算上下圖片位置範圍
		this.state.Constant.vPosRange.topY[0]=-halfImgH;
		this.state.Constant.vPosRange.topY[1]=halfStageH-halfImgH*3;
		this.state.Constant.vPosRange.x[0]=halfStageW - imgW;
		this.state.Constant.vPosRange.x[1]=halfStageW;
		
		this.rearrange(0);
	
	}

	
	
	
	render() {
		var controllerUnits = [],
			imgFigures = [];
		imageDatas.forEach(function(value , index){
		
			//圖片的初始
			if(!this.state.aImgsRange[index]){
				this.state.aImgsRange[index] = {
					pos:{
						left:0,
						top:0
					},
					rotate:0,
					isInverse:false,
					isCenter:false
				}
			}
		
			imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index} arrange={this.state.aImgsRange[index]} inverse={this.inverse(index)} center = {this.center(index)}/>)
		}.bind(this));
  
    return (
		<section className="stage" ref="stage">
			<section className="img-sec">
				{imgFigures}
			</section>
			<nav className="controller-nav">
				{controllerUnits}
			<div>控制按鈕</div>
			</nav>
		</section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

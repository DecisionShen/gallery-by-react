require('normalize.css/normalize.css');

require('styles/App.scss');

import React from 'react';
var imageDatas=require('../data/imageData.json');

 imageDatas=(function genImageURL(aImageData){
		for(var i=0,j=aImageData.length;i<j;i++){
			var singleImageData =aImageData[i];
			singleImageData.imageURL=require("../images/"+singleImageData['fileName']);
			aImageData[i]=singleImageData;
		}
		return aImageData;
	})(imageDatas);


class AppComponent extends React.Component {
  render() {
    return (
    <section className="stage">
		<section className="img-sec">
		
		<div>123</div>
		</section>
	
		<nav className="controller-nav">
		
		<div>控制按鈕</div>
		</nav>
	</section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

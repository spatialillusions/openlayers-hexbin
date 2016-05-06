/* HEXBIN VECTOR LAYER ===================================================================
Copyright (c) 2016 Måns Beckman http://www.spatialillusions.com
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the <organization> nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

========================================================================================*/
var hexbin = {
	on: function (layer){
		layer.on('precompose', this.hexpre);
		layer.on('postcompose', this.hexpost);
	},
	un: function (layer){
		layer.un('precompose', this.hexpre);
		layer.un('postcompose', this.hexpost);
	},
	hexpost: function (event){
		var ctx = event.context;
		ctx.save();
		var height = ctx.canvas.height;
		var width = ctx.canvas.width;
		var pixelsize = 28;
		var colorObject = {};
	
		var imgData = ctx.getImageData(0, 0, width, height);
		ctx.clearRect(0, 0, width, height);

		var i = 0;
		var shift = pixelsize/2;
		for (var iworld = pixelsize/2; iworld < height; iworld += 21) {
			i++;
			//how many pixel values to skip to get to right row
			var row = iworld * 4 * width; //4 is the 4 bands, red,green,blue,alpha
			shift = (i%2 == 0)?0:pixelsize/2;
			for (var jworld = shift; jworld < width; jworld += pixelsize) {
				var cell = row + jworld*4;
			
				var r = imgData.data[cell];
				var g = imgData.data[cell+1];
				var b = imgData.data[cell+2];
				var a = imgData.data[cell+3];
				var pixelcolor = 'rgba('+r+','+g+','+b+','+1+')';
			
				if (!colorObject.hasOwnProperty(pixelcolor) && a != 0){
					colorObject[pixelcolor] = [];
				}
				if(a != 0 ){
						colorObject[pixelcolor].push([jworld,iworld])
					

				}
			}
		}
		ctx.putImageData(ctx.preImageData, 0, 0);
		
		for (var color in colorObject){
			ctx.fillStyle = color;
			ctx.beginPath();
			for (var i = 0; i< colorObject[color].length; i++){
				var x = colorObject[color][i][0];
				var y = colorObject[color][i][1];
				ctx.moveTo(x,y-14);
				ctx.lineTo(x+14, y-7);
				ctx.lineTo(x+14, y+7);
				ctx.lineTo(x, y+14);
				ctx.lineTo(x-14, y+7);
				ctx.lineTo(x-14, y-7);
				ctx.closePath();		
			}
			ctx.globalAlpha = 0.8;
			ctx.fill();
			ctx.globalAlpha = 1;
			ctx.stroke();
		}
		ctx.restore();
	},
	hexpre: function (event){
		var ctx = event.context;
		var height = ctx.canvas.height;
		var width = ctx.canvas.width;
		ctx.preImageData = ctx.getImageData(0, 0, width, height);
		ctx.clearRect(0, 0, width, height);
	}
}
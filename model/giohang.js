function GioHang (oldCart){
	this.items = oldCart.items || {};

	this.add = function(id, item){
		var giohang = this.items[id];

		if(!giohang){
			giohang = this.items[id] = {item: item, soluong: 0, tien: 0}
		}
		giohang.soluong++;
		if(giohang.item.promotion > 0) {
			giohang.tien = giohang.soluong * (giohang.item.price - (giohang.item.price * (giohang.item.promotion / 100)));
		}
		else {
			giohang.tien = giohang.soluong * giohang.item.price;
		}
	}

	this.convertArray = function(){
		var arr = [];
		for(var id in this.items){
			arr.push(this.items[id]);
		}

		return arr;
	}

	this.updateCart = function(id, soluong){

		var giohang = this.items[id];
		giohang.soluong = soluong;
		if(giohang.item.promotion > 0) {
			giohang.tien = giohang.soluong * (giohang.item.price - (giohang.item.price * (giohang.item.promotion / 100)));
		}
		else {
			giohang.tien = giohang.soluong * giohang.item.price;
		}
		//console.log(giohang);
	}

	this.delCart = function(id){
		delete this.items[id];
	}
}

module.exports = GioHang;
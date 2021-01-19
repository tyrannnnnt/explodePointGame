
cc.Class({
    extends: cc.Component,

    properties: {
	  //关联
	  scoreLabel: cc.Label,
	  
      playerNode: cc.Node,
	  
	  enemyNode: cc.Node,
	  
	  playerDiedNode: cc.Node,
	  
	  enemyDiedNode: cc.Node,
    },

   

    onLoad () {
		this.enabled = true;
		//初始化得分
		this.score = 0;
		//放人
		this.placePlayer();
		//放怪
		this.placeEnemy();	
		//this.fire();
		//绑定点击事件
		
		
		this.enemyDiedNode.active = false;
		
		this.playerDiedNode.active = false;
		
		
		
		this.node.on('touchstart', this.fire, this)
	},
	
	onDestory () {
		this.node.off('touchstart', this.fire, this)
	},

    start () {
		
    },

    update (dt) {
		//判断距离
		let playerPosition = this.playerNode.getPosition();
		let distance = this.enemyNode.position.sub(playerPosition).mag();
		let touch = this.playerNode.width/2 + this.enemyNode.width/2;
		
		if(distance < touch)
		{
			this.enemyDie();
			
			//this.enemyNode.stopAction(this.enemyAction);
			//this.playerNode.stopAction(this.playerAction);
			this.enemyNode.stopAllActions();
			this.playerNode.stopAllActions();
						
			//得分增加
			this.score += 1;
			this.scoreLabel.string = this.score;
			
			
			
			
		}
		
		this.playerNode.getPosition();

		var playerY = this.playerNode.y;
		//log("y坐标" + playerY );
		
		
		
		
	},
	
	//放置敌人
	placeEnemy(){
		let x = cc.winSize.width/2-this.enemyNode.width/2;
		let y = Math.random()*cc.winSize.height/4;
		let dua = 0.6 + Math.random() * 0.5;
		
		this.enemyNode.active = true;
		
		this.enemyNode.x = 0;
		this.enemyNode.y = cc.winSize.height/3-this.enemyNode.height/2;
		
		let seq = cc.repeatForever(
			cc.sequence(
				cc.moveTo(dua, -x, y),
				cc.moveTo(dua, x, y),
			)
		);
		
		this.enemyAction = this.enemyNode.runAction(seq);
	},
	
	//放置玩家
	placePlayer(){
			
		//放置玩家
		this.playerNode.y = -cc.winSize.height / 4;
		
		this.playerNode.active = true;

		this.isFire = false;
		//玩家下移
		let dua = 5;
		var finished = cc.callFunc(
		()=>
		{
			if(this.isFire == false)
			{
				
				this.playerDie();
				log("到底了");
			}
		}
		)
		let seq = cc.sequence(
			cc.moveTo(dua, cc.v2(this.playerNode.x, -(cc.winSize.height/2 - this.playerNode.height/2))),
			finished
			)
			
			//log("restart" + this.playerNode.y);
			
		log("playerAction= fall" );
		this.playerAction = this.playerNode.runAction(seq);
		
	},
	
	//发射
	fire(){
		if (this.isFire) return;
		this.isFire = true;
		let dua = 0.6;
		log("start");
		let seq = cc.sequence(
			cc.moveTo(dua, cc.v2(0, cc.winSize.height/2)),
			cc.callFunc(()=>{
				console.log("finish");
				this.playerDie();
			})
			);
			log("playerAction=shot" );
		this.playerAction = this.playerNode.runAction(seq);
		
	},
	
	playerDie(){
		
		this.playerNode.active = false;
		this.playerSet(this.playerNode.position);
		this.enabled =false;
		setTimeout(() => {
			cc.director.loadScene('game');
		}, 2000);
		log("playerDie: player.y=" + this.playerNode.y);
	},
	
	enemyDie(){
		this.enemyNode.active = false;
		this.enemySet(this.enemyNode.position);
		this.enabled =false;
		setTimeout(() => {		
			this.enemyDiedNode.active = false;	
			this.enabled = true;0
			this.placePlayer();
			this.placeEnemy();
		}, 2000);
	},
		
	
	enemySet(position){
		this.enemyDiedNode.active = true;
		this.enemyDiedNode.setPosition(position);
	},
	
	playerSet(position){
		this.playerDiedNode.active = true;
		this.playerDiedNode.setPosition(position);
	},
		
});

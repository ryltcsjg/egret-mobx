/*
	插件安装完成后如下：
	1、插件-egreti18n-egreti18n exportchinese
	2、插件-egreti18n-egreti18n save------输入zh

	导出exml中的中文值resource/i18n/zh.json

	复制zh.json到en.json中，更改翻译
*/

class Main extends eui.UILayer {
	protected createChildren(): void {
		super.createChildren();

		egret.lifecycle.addLifecycleListener((context) => {
			// custom lifecycle plugin
		});

		egret.lifecycle.onPause = () => {
			egret.ticker.pause();
		};

		egret.lifecycle.onResume = () => {
			egret.ticker.resume();
		};

		let stageW = this.stage.stageWidth;
		let stageH = this.stage.stageHeight;

		this.width = stageW;
		this.height = stageH;

		le.i18n.init();

		this.loadResouce().then(() => {
			this.start();
		});
	}

	async loadResouce() {
		await RES.loadConfig('default.res.json', 'resource/');
		await RES.loadConfig('i18n.res.json', 'resource/');

		await this.loadTheme();
		await le.i18n.setLanguage('en');
	}
	private loadTheme() {
		return new Promise((resolve, reject) => {
			let theme = new eui.Theme('resource/default.thm.json', this.stage);
			theme.once(
				eui.UIEvent.COMPLETE,
				() => {
					resolve();
				},
				this
			);
		});
	}
	start() {
		this.addChild(new le.I18nView());
		this.addChild(new le.MobxView());
	}
}

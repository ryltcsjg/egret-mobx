namespace le {
	export class I18nView extends eui.Component {
		private changelan: eui.Label;
		constructor() {
			super();
			this.skinName = 'i18n';
		}

		childrenCreated() {
			this.changelan.addEventListener(
				egret.TouchEvent.TOUCH_END,
				() => {
					console.log('TouchEvent');
					le.i18n.setLanguage(le.i18n.getLanguage() == 'zh' ? 'en' : 'zh');
				},
				null
			);
		}
	}
}

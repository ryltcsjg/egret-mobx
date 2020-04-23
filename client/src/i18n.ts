namespace le {
	class I18n {
		private static instance = null;
		private class2filePath: { [x: string]: string } = {};
		private language: string = 'zh';
		private i18nComponents: any = {};
		private content: any = {};
		public init() {
			this.defineComponentSkinName();
		}

		public setLanguage(lan: string) {
			console.log('setlanguage', lan);
			this.language = lan;

			return Promise.resolve()
				.then(() => {
					if (!RES.isGroupLoaded(`i18n_class2filePath`)) {
						return RES.loadGroup(`i18n_class2filePath`);
					}
				})
				.then(() => {
					this.class2filePath = RES.getRes(`class2filePath_json`);
				})
				.then(() => {
					if (!RES.isGroupLoaded(`i18n_${lan}`)) {
						return RES.loadGroup(`i18n_${lan}`);
					}
				})
				.then(() => {
					this.content[lan] = RES.getRes(`${lan}_json`);
				})
				.then(() => {
					if (!this.content[lan]) {
						return;
					}
					for (let hashCode in this.i18nComponents) {
						let { component, resName } = this.i18nComponents[hashCode];
						if (component && resName && this.content[lan][resName]) {
							component['$i18n'] = { ...i18n.content[i18n.language][resName] };
						}
					}
				});
		}

		public getLanguage() {
			return this.language;
		}

		private defineComponentSkinName() {
			const i18n = this;

			let skinSet = function(name) {
				try {
					let resName = '';
					name = (typeof name != 'string' && name && name.name) || name;
					if (name && typeof name === 'string') {
						if (name.indexOf('/') != -1) {
							resName = i18n.parseSkinName(name);
						} else {
							let tempName = name.replace(/(\$Skin[0-9]+)+/, '');
							resName =
								i18n.class2filePath[tempName] && i18n.parseSkinName(i18n.class2filePath[tempName]);
						}
						if (resName && i18n.content && i18n.content[i18n.language]) {
							this['$i18n'] = { ...i18n.content[i18n.language][resName] };
						} else {
							return;
						}
					}
					if (!i18n.i18nComponents[this.hashCode]) {
						let listener = (event: egret.Event) => {
							if (event.target != this) {
								return;
							}
							this.removeEventListener(egret.Event.REMOVED, listener);
							this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, listener);
							!i18n.i18nComponents[this.hashCode] &&
								console.error(name, Object.keys(i18n.i18nComponents).length);
							delete i18n.i18nComponents[this.hashCode];
						};
						this.addEventListener(egret.Event.REMOVED, listener);
						this.addEventListener(egret.Event.REMOVED_FROM_STAGE, listener);

						i18n.i18nComponents[this.hashCode] = {
							component: this,
							resName
						};
					}
				} catch (e) {
					console.error('set error', name, e);
				}
			};

			this.patch(eui.Component, 'skinName', {
				set: skinSet
			});
		}

		private parseSkinName(name): string {
			/(\$Skin[0-9]+)+/.test(name) && console.log(name);
			return name.replace('resource/skins/', '').replace(/\//g, '_').replace('.exml', '');
		}

		public static getInstance() {
			return I18n.instance || (I18n.instance = new I18n());
		}
		patch(Cls, prop: string, patched: any) {
			if (!Cls || !Cls.prototype) {
				return;
			}
			let target = Cls;

			while (!(Cls.prototype['__$patch__'] && Cls.prototype['__$patch__'][prop])) {
				if (!target || !target.prototype) {
					break;
				}
				if (Object.getOwnPropertyDescriptor(target.prototype, prop)) {
					const originalGet = Object.getOwnPropertyDescriptor(target.prototype, prop).get;
					const originalSet = Object.getOwnPropertyDescriptor(target.prototype, prop).set;
					target.prototype['__$patch__'] = target.prototype['__$patch__'] || {};
					target.prototype['__$patch__'][prop] = true;
					Object.defineProperty(target.prototype, prop, {
						get: function() {
							patched.get && patched.get.call(this);
							return originalGet.call(this);
						},
						set: function(v) {
							originalSet.call(this, v);
							patched.set && patched.set.call(this, v);
						}
					});

					break;
				}
				target = target.prototype.__proto__ && target.prototype.__proto__.constructor;
			}
		}
	}
	export const i18n: I18n = I18n.getInstance();
}

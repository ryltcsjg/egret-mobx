namespace store {
	const observable = mm.mobx.observable;
	class A {
		@observable arr = [];
		@observable count = 0;
	}

	export const a = new A();
}

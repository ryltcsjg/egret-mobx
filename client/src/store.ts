namespace store {
	const observable = mm.mobx.observable;
	class A {
		@observable arr = [];
	}

	export const a = new A();
}

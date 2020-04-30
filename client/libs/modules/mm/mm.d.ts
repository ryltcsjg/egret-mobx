interface IEqualsComparer<T> {
  (a: T, b: T): boolean;
}

interface IAutorunOptions {
  delay?: number;
  name?: string;
  /**
   * Experimental.
   * Warns if the view doesn't track observables
   */
  requiresObservable?: boolean;
  scheduler?: (callback: () => void) => any;
  onError?: (error: any) => void;
}

declare type IReactionOptions = IAutorunOptions & {
  fireImmediately?: boolean; //onAddToStage时是否调用，默认false
  equals?: IEqualsComparer<any>;
};

declare module mm {
  export const mobx: {
    IObservable;
    IDepTreeNode;
    Reaction;
    IReactionPublic;
    IReactionDisposer;
    IDerivation;
    untracked;
    IDerivationState;
    IAtom;
    createAtom;
    IAction;
    spy;
    IComputedValue;
    IEqualsComparer;
    comparer;
    IEnhancer;
    IInterceptable;
    IInterceptor;
    IListenable;
    IObjectWillChange;
    IObjectDidChange;
    IObservableObject;
    isObservableObject;
    IValueDidChange;
    IValueWillChange;
    IObservableValue;
    isBoxedObservable;
    IObservableArray;
    IArrayWillChange;
    IArrayWillSplice;
    IArrayChange;
    IArraySplice;
    isObservableArray;
    IKeyValueMap;
    ObservableMap;
    IMapEntries;
    IMapEntry;
    IMapWillChange;
    IMapDidChange;
    isObservableMap;
    IObservableMapInitialValues;
    ObservableSet;
    isObservableSet;
    ISetDidChange;
    ISetWillChange;
    IObservableSetInitialValues;
    transaction;
    observable;
    IObservableFactory;
    IObservableFactories;
    computed;
    IComputed;
    isObservable;
    isObservableProp;
    isComputed;
    isComputedProp;
    extendObservable;
    observe;
    intercept;
    autorun;
    IAutorunOptions;
    reaction;
    IReactionOptions;
    when;
    IWhenOptions;
    action;
    isAction;
    runInAction;
    IActionFactory;
    keys;
    values;
    entries;
    set;
    remove;
    has;
    get;
    decorate;
    configure;
    onBecomeObserved;
    onBecomeUnobserved;
    flow;
    FlowCancellationError;
    isFlowCancellationError;
    toJS;
    trace;
    IObserverTree;
    IDependencyTree;
    getDependencyTree;
    getObserverTree;
    _resetGlobalState;
    _getGlobalState;
    getDebugName;
    getAtom;
    _getAdministration;
    _allowStateChanges;
    _allowStateChangesInsideComputed;
    Lambda;
    isArrayLike;
    $mobx;
    _isComputingDerivation;
    onReactionError;
    _interceptReads;
    IComputedValueOptions;
    IActionRunInfo;
    _startAction;
    _endAction;
    _allowStateReadsStart;
    _allowStateReadsEnd;
  };

  export const Observer: any;
  export const react: any;
  export const reaction: (Function, option?: IReactionOptions) => any;
}

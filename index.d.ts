// swaptox-widget.d.ts
// 在这里导出你的核心方法和类型，给 TS 用户提供提示
export function createWidget(...args: any[]): any;
declare const widget: any;
export default widget;

export interface SwaptoxWidgetInstance {
	[key: string]: any|void|undefined;
}
 
declare global {
  interface Window {
    $swaptoxWidget?: SwaptoxWidgetInstance;
  }
}

export {};





# SwaptoX Widget

For more detailed documentation, visit [docs.swaptox.com](https://docs.swaptox.com).

更详细的文档请访问：[docs.swaptox.com](https://docs.swaptox.com)。

---

## English

SwaptoX Widget is an embeddable swap aggregator UI for websites. It renders token swap controls and available routes in a browser DOM environment.

### Installation

```bash
npm install @swaptox/widget
```

Or import it directly from esm.sh:

```js
import { createWidget } from 'https://esm.sh/@swaptox/widget';
```

### Quick Start

Add a mount element to your page, then create the widget in the browser:

```html
<div id="swaptox-widget"></div>

<script type="module">
  import { createWidget } from 'https://esm.sh/@swaptox/widget';

  const widget = createWidget({
    container: '#swaptox-widget',
    chain: 'base',
    lang: 'en',
    theme: 'light',
  });

  widget.on('swap', (data) => console.log('swap:', data));
</script>
```

### Pairing with SwaptoX Connect

The widget can be paired with [`@swaptox/connect-ui`](https://github.com/swaptox/swaptox-connect) for wallet connection. Install it with npm:

```bash
npm i @swaptox/connect-ui
```

When used together, `@swaptox/widget` integrates with `@swaptox/connect-ui` to synchronize wallet connection, disconnection, and account changes, and to handle the widget's approval, Permit, and Swap transaction flow. Your app does not need to manually relay connector state or transaction events to the widget. Use `widget.on(...)` only when your app needs to react to an event itself.

Create the connector before the widget:

```html
<div id="swaptox-widget"></div>

<script type="module">
  import { createConnect } from 'https://esm.sh/@swaptox/connect-ui';
  import { createWidget } from 'https://esm.sh/@swaptox/widget';

  const connectConfig = {
    projectId: 'YOUR_PROJECT_ID',
    chains: ['base', 'rootstock'],
    currentChain: 'base',
    metadata: {
      name: 'My App',
      description: 'Swap aggregator',
      logo: 'https://example.com/logo.png',
      url: location.origin,
    },
    rpcMap: {},
  };

  createConnect(connectConfig, {
    theme: 'light',
    lang: 'en',
  });

  const widget = createWidget({
    container: '#swaptox-widget',
    chain: 'base',
    lang: 'en',
    theme: 'light',
  });
</script>
```

Replace `YOUR_PROJECT_ID` and the example metadata with your app's values. See the [SwaptoX Connect repository](https://github.com/swaptox/swaptox-connect) for connector details.

### Initialization Options

| Option | Type | Description |
| --- | --- | --- |
| `container` | `string \| HTMLElement` | Mount target. A string is resolved as a CSS selector. |
| `chain` | `string` | Initial chain. Built-in chains are currently `base` and `rootstock`; defaults to the stored chain or `base`. |
| `userAddress` | `string` | Initial wallet address. Defaults to an empty string. |
| `referral` | `string` | Referral address; must be valid. Defaults to the zero address for the selected chain. |
| `lang` | `string` | Initial language. Defaults to the browser language, falling back to `en` when unsupported. |
| `isUpdateHtmlLang` | `boolean` | Also update the page's `<html lang>` attribute. Defaults to `false`. |
| `langOptionsList` | `Array` | Custom language selector options. Each item uses `{ id, name, symbol }`. |
| `languagePack` | `object` | Custom translations. Each locale has `fallback` and `data`; missing strings inherit from the fallback locale. |
| `theme` | `string` | Initial theme. Built-in themes are `light`, `dark`, and `stxui`; defaults to `light`. |
| `themeVariables` | `object` | Override CSS custom properties, for example `{ '--stxui-theme-color': '#007aff' }`. |
| `themePack` | `object` | Custom themes. Each theme has `fallback` and `data`; missing variables inherit from the fallback theme. |
| `limitOptionalToken` | `object` | Per-chain default token and optional-token settings. |
| `disabledMiniPriceCard` | `boolean` | Disable the mini price card. Defaults to `false`. |
| `disabledHistoryIcon` | `boolean` | Hide the history icon. Defaults to `false`. |
| `disabledCustomRecipient` | `boolean` | Disable custom recipient addresses. Defaults to `false`. |
| `disabledChooseRoute` | `boolean` | Disable route selection. Defaults to `false`. |
| `slippagLayout` | `'top' \| 'bottom'` | Position of the slippage control. |

Built-in locales: `en`, `zh-Hans`, `zh-Hant`, `ja`, `ko`, `th`, `pt-BR`, `id`, and `vi`.

Custom locale and theme example:

```js
const widget = createWidget({
  container: '#swaptox-widget',
  lang: 'custom-en',
  languagePack: {
    'custom-en': {
      fallback: 'en',
      data: {
        swap: 'Trade',
        'connect-wallet': 'Connect wallet',
      },
    },
  },
  theme: 'blue-light',
  themePack: {
    'blue-light': {
      fallback: 'light',
      data: {
        '--stxui-theme-color': '#007aff',
        '--stxui-theme-focus-color': '#007aff80',
      },
    },
  },
});
```

Optional token configuration example:

```js
const widget = createWidget({
  container: '#swaptox-widget',
  limitOptionalToken: {
    base: {
      defaultTokenIn: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
      disabledTokenIn: false,
      defaultTokenOut: '0xcb327b99ff831bf8223cced12b1338ff3aa322ff',
      disabledTokenOut: true,
      limitOptionalList: [
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
      ],
    },
  },
});
```

### Events

Subscribe with `on(eventName, callback)`. You can register multiple different callbacks for the same event; each callback receives the event data as its argument.

| Event | Description |
| --- | --- |
| `connect` | Emitted when the user starts the wallet connection action. |
| `swap` | Swap transaction event. |
| `approve` | Token approval event. |
| `permit` | Permit authorization event. |
| `routes` | Route data update. |
| `loading` | Route or quote loading state update. |
| `choose-route` | Emitted when the user selects a route. |

```js
function onSwap(data) {
  console.log('swap:', data);
}

widget.on('swap', onSwap);
widget.on('swap', (data) => console.log('another swap listener:', data));

// Remove one callback
widget.off('swap', onSwap);

// Remove every callback for one event
widget.off('swap');

// Remove all generic event callbacks
widget.off();
```

`emit(eventName, ...args)` manually dispatches a generic event. It returns `true` if listeners were called and `false` otherwise. `off` manages callbacks registered through the generic `on/off` API.

### Instance Methods

| Method | Description |
| --- | --- |
| `setUserAddress(address)` | Set or clear the wallet address. |
| `setChain(chain)` | Switch chains. Use `getChain()` to list supported chains. |
| `getChain()` | Return the built-in supported chain list. |
| `setLang(lang)` / `getLangPack()` | Change the locale / get the locale pack. `setLang` returns the locale selected. |
| `setTheme(theme)` / `getThemePack()` | Change the theme / get the theme pack. `setTheme` returns the theme selected. |
| `setRoute(route)` | Set the selected route object. Pass one route object from the SDK route data. |
| `setLimitOptionalToken(config)` | Update optional-token settings. |
| `setReferral(address)` | Set the referral address. |
| `setDisabledMiniPriceCard(disabled)` | Enable or disable the mini price card. |
| `setSlippagLayout(position)` | Set the slippage control position to `top` or `bottom`. |
| `setSwapButton(enabled)` | Show or hide the Swap button. |
| `setDisabledHistoryIcon(disabled)` | Show or hide the history icon. |
| `setDisabledCustomRecipient(disabled)` | Enable or disable custom recipient addresses. |
| `setDisabledChooseRoute(disabled)` | Enable or disable route selection. |
| `destroy()` | Remove the widget and its instance event listeners. |

The legacy single-callback methods remain available: `onConnectWallet`, `onRoutes`, `onLoading`, `onChooseRoute`, `onApprove`, `onSwap`, and `onPermit`. Each stores one callback per event; calling it again replaces the previous callback. `emitApprove(data)`, `emitSwap(data)`, and `emitPermit(data)` invoke the matching legacy callback and generic event listeners. The generic `on/off` API supports multiple listeners and is recommended for new integrations.

### Local Development

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:3001` by default. Build the package with:

```bash
npm run build
```

---

## 中文

SwaptoX Widget 是一个可嵌入网页的 Swap 聚合器组件，可展示代币兑换界面和可用路由。组件运行在浏览器 DOM 环境中。

### 安装

通过 npm 安装：

```bash
npm install @swaptox/widget
```

也可以直接从 esm.sh 导入：

```js
import { createWidget } from 'https://esm.sh/@swaptox/widget';
```

### 快速开始

先在页面中放置挂载容器，再在浏览器端创建组件：

```html
<div id="swaptox-widget"></div>

<script type="module">
  import { createWidget } from 'https://esm.sh/@swaptox/widget';

  const widget = createWidget({
    container: '#swaptox-widget',
    chain: 'base',
    lang: 'zh-Hans',
    theme: 'light',
  });

  widget.on('swap', (data) => console.log('swap:', data));
</script>
```

### 搭配 SwaptoX Connect 使用

Widget 可以搭配 [`@swaptox/connect-ui`](https://github.com/swaptox/swaptox-connect) 处理钱包连接。使用 npm 安装：

```bash
npm i @swaptox/connect-ui
```

搭配使用时，`@swaptox/widget` 会自动与 `@swaptox/connect-ui` 集成，同步钱包连接、断开和账户变化，并处理 Widget 内部的 approve、Permit 和 Swap 交易流程。应用无需手动转发连接器状态或交易事件给 Widget。只有应用本身需要响应事件时，才需要使用 `widget.on(...)`。

请先创建连接器，再创建 Widget：

```html
<div id="swaptox-widget"></div>

<script type="module">
  import { createConnect } from 'https://esm.sh/@swaptox/connect-ui';
  import { createWidget } from 'https://esm.sh/@swaptox/widget';

  const connectConfig = {
    projectId: 'YOUR_PROJECT_ID',
    chains: ['base', 'rootstock'],
    currentChain: 'base',
    metadata: {
      name: 'My App',
      description: 'Swap aggregator',
      logo: 'https://example.com/logo.png',
      url: location.origin,
    },
    rpcMap: {},
  };

  createConnect(connectConfig, {
    theme: 'light',
    lang: 'en',
  });

  const widget = createWidget({
    container: '#swaptox-widget',
    chain: 'base',
    lang: 'zh-Hans',
    theme: 'light',
  });
</script>
```

请将 `YOUR_PROJECT_ID` 和示例 metadata 替换为你自己的应用信息。连接器的更多说明请参阅 [SwaptoX Connect 项目](https://github.com/swaptox/swaptox-connect)。

### 初始化配置

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `container` | `string \| HTMLElement` | 挂载目标。字符串会作为 CSS 选择器查询。 |
| `chain` | `string` | 初始链。当前内置支持 `base` 和 `rootstock`；默认读取已保存的链，未设置时使用 `base`。 |
| `userAddress` | `string` | 初始钱包地址，默认为空。 |
| `referral` | `string` | 邀请地址，必须是有效地址；默认使用当前链的零地址。 |
| `lang` | `string` | 初始语言。默认为浏览器语言，不支持时回退到 `en`。 |
| `isUpdateHtmlLang` | `boolean` | 是否同步更新页面的 `<html lang>` 属性，默认 `false`。 |
| `langOptionsList` | `Array` | 自定义语言选择列表。每项使用 `{ id, name, symbol }`。 |
| `languagePack` | `object` | 自定义语言包。每项包含 `fallback` 和 `data`，缺少的翻译从回退语言继承。 |
| `theme` | `string` | 初始主题。内置主题为 `light`、`dark`、`stxui`，默认 `light`。 |
| `themeVariables` | `object` | 覆盖 CSS 自定义属性，例如 `{ '--stxui-theme-color': '#007aff' }`。 |
| `themePack` | `object` | 自定义主题包。每项包含 `fallback` 和 `data`，缺少的变量从回退主题继承。 |
| `limitOptionalToken` | `object` | 按链设置默认代币和可选代币限制。 |
| `disabledMiniPriceCard` | `boolean` | 是否禁用迷你价格卡片，默认 `false`。 |
| `disabledHistoryIcon` | `boolean` | 是否隐藏历史记录图标，默认 `false`。 |
| `disabledCustomRecipient` | `boolean` | 是否禁用自定义接收地址，默认 `false`。 |
| `disabledChooseRoute` | `boolean` | 是否禁用路由选择，默认 `false`。 |
| `slippagLayout` | `'top' \| 'bottom'` | 滑点设置位置。 |

内置语言：`en`、`zh-Hans`、`zh-Hant`、`ja`、`ko`、`th`、`pt-BR`、`id`、`vi`。

自定义语言和主题示例：

```js
const widget = createWidget({
  container: '#swaptox-widget',
  lang: 'custom-en',
  languagePack: {
    'custom-en': {
      fallback: 'en',
      data: {
        swap: 'Trade',
        'connect-wallet': 'Connect wallet',
      },
    },
  },
  theme: 'blue-light',
  themePack: {
    'blue-light': {
      fallback: 'light',
      data: {
        '--stxui-theme-color': '#007aff',
        '--stxui-theme-focus-color': '#007aff80',
      },
    },
  },
});
```

可选代币配置示例：

```js
const widget = createWidget({
  container: '#swaptox-widget',
  limitOptionalToken: {
    base: {
      defaultTokenIn: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
      disabledTokenIn: false,
      defaultTokenOut: '0xcb327b99ff831bf8223cced12b1338ff3aa322ff',
      disabledTokenOut: true,
      limitOptionalList: [
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
      ],
    },
  },
});
```

### 事件

使用 `on(eventName, callback)` 监听事件。同一事件可注册多个不同回调，每个回调都会收到事件数据。

| 事件 | 说明 |
| --- | --- |
| `connect` | 用户触发连接钱包操作时发出。 |
| `swap` | Swap 交易事件。 |
| `approve` | 代币授权事件。 |
| `permit` | Permit 授权事件。 |
| `routes` | 路由数据更新。 |
| `loading` | 路由或报价加载状态更新。 |
| `choose-route` | 用户选择路由时发出。 |

```js
function onSwap(data) {
  console.log('swap:', data);
}

widget.on('swap', onSwap);
widget.on('swap', (data) => console.log('另一个 swap 监听器:', data));

// 移除指定回调
widget.off('swap', onSwap);

// 移除该事件的全部回调
widget.off('swap');

// 移除全部通用事件回调
widget.off();
```

`emit(eventName, ...args)` 可手动触发通用事件。有监听器时返回 `true`，否则返回 `false`。`off` 管理由通用 `on/off` 注册的回调。

### 实例方法

| 方法 | 说明 |
| --- | --- |
| `setUserAddress(address)` | 设置或清空钱包地址。 |
| `setChain(chain)` | 切换链；使用 `getChain()` 查询支持的链。 |
| `getChain()` | 返回内置支持的链列表。 |
| `setLang(lang)` / `getLangPack()` | 切换语言 / 获取语言包。`setLang` 返回最终使用的语言代码。 |
| `setTheme(theme)` / `getThemePack()` | 切换主题 / 获取主题包。`setTheme` 返回最终使用的主题名。 |
| `setRoute(route)` | 设置当前路由。传入 SDK 路由数据中的单个路由对象。 |
| `setLimitOptionalToken(config)` | 更新可选代币设置。 |
| `setReferral(address)` | 设置邀请地址。 |
| `setDisabledMiniPriceCard(disabled)` | 启用或禁用迷你价格卡片。 |
| `setSlippagLayout(position)` | 将滑点控件设为 `top` 或 `bottom`。 |
| `setSwapButton(enabled)` | 显示或隐藏 Swap 按钮。 |
| `setDisabledHistoryIcon(disabled)` | 显示或隐藏历史记录图标。 |
| `setDisabledCustomRecipient(disabled)` | 启用或禁用自定义接收地址。 |
| `setDisabledChooseRoute(disabled)` | 启用或禁用路由选择。 |
| `destroy()` | 移除组件和实例上的事件监听器。 |

旧版单回调监听方法仍保留：`onConnectWallet`、`onRoutes`、`onLoading`、`onChooseRoute`、`onApprove`、`onSwap` 和 `onPermit`。同一事件重复调用会替换之前的回调。`emitApprove(data)`、`emitSwap(data)` 和 `emitPermit(data)` 会触发对应旧版回调及通用事件监听器。新代码建议使用支持多监听的通用 `on/off` 接口。

### 本地开发

```bash
npm install
npm run dev
```

开发服务器默认运行在 `http://localhost:3001`。使用以下命令构建：

```bash
npm run build
```

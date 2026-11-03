'use strict';
const c = /^tuple(?<array>(\[(\d*)\])*)$/;

function u(t) {
	let e = t.type;
	if (c.test(t.type) && "components" in t) {
		e = "(";
		const n = t.components.length;
		for (let s = 0; s < n; s++) {
			e += u(t.components[s]), s < n - 1 && (e += ", ")
		}
		const i = function(t, e) {
			const n = t.exec(e);
			return null == n ? void 0 : n.groups
		}(c, t.type);
		return e += `)${(null==i?void 0:i.array)||""}`, u({
			...t,
			type: e
		})
	}
	return "indexed" in t && t.indexed && (e = `${e} indexed`), t.name ? `${e} ${t.name}` : e
}

function h(t) {
	let e = "";
	const n = t.length;
	for (let i = 0; i < n; i++) {
		e += u(t[i]), i !== n - 1 && (e += ", ")
	}
	return e
}

function l(t, {
	includeName: e = !1
} = {}) {
	if ("function" !== t.type && "event" !== t.type && "error" !== t.type) throw new U(t.type);
	return `${t.name}(${d(t.inputs,{includeName:e})})`
}

function d(t, {
	includeName: e = !1
} = {}) {
	return t ? t.map((t => function(t, {
		includeName: e
	}) {
		if (t.type.startsWith("tuple"))
		return `(${d(t.components,{includeName:e})})${t.type.slice("tuple".length)}`;
		return t.type + (e && t.name ? ` ${t.name}` : "")
	}(t, {
		includeName: e
	}))).join(e ? ", " : ",") : ""
}

function f(t, {
	strict: e = !0
} = {}) {
	return !!t && ("string" == typeof t && (e ? /^0x[0-9a-fA-F]*$/.test(t) : t.startsWith("0x")))
}

function p(t) {
	return f(t, {
		strict: !1
	}) ? Math.ceil((t.length - 2) / 2) : t.length
}
let g = {
	getDocsUrl: ({
		docsBaseUrl: t,
		docsPath: e = "",
		docsSlug: n
	}) => e ? `${t??"https://viem.sh"}${e}${n?`#${n}`:""}` : void 0,
	version: "viem@2.45.3"
};
class y extends Error {
	constructor(t, e = {}) {
		var n;
		const i = e.cause instanceof y ? e.cause.details : (null == (s = e.cause) ? void 0 : s.message) ? e.cause
			.message : e.details;
		var s;
		const o = e.cause instanceof y && e.cause.docsPath || e.docsPath,
			r = null == (n = g.getDocsUrl) ? void 0 : n.call(g, {
				...e,
				docsPath: o
			});
		super([t || "An error occurred.", "", ...e.metaMessages ? [...e.metaMessages, ""] : [], ...r ? [
					`Docs: ${r}`] : [], ...i ? [`Details: ${i}`] : [], ...g.version ? [
				`Version: ${g.version}`] : []
			].join("\n"), e.cause ? {
				cause: e.cause
			} : void 0), Object.defineProperty(this, "details", {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: void 0
			}), Object.defineProperty(this, "docsPath", {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: void 0
			}), Object.defineProperty(this, "metaMessages", {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: void 0
			}), Object.defineProperty(this, "shortMessage", {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: void 0
			}), Object.defineProperty(this, "version", {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: void 0
			}), Object.defineProperty(this, "name", {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: "BaseError"
			}), this.details = i, this.docsPath = o, this.metaMessages = e.metaMessages, this.name = e.name ?? this
			.name, this.shortMessage = t, this.version = "2.45.3"
	}
	walk(t) {
		return m(this, t)
	}
}

function m(t, e) {
	return (null == e ? void 0 : e(t)) ? t : t && "object" == typeof t && "cause" in t && void 0 !== t.cause ? m(t
		.cause, e) : e ? null : t
}
class b extends y {
	constructor({
		data: t,
		params: e,
		size: n
	}) {
		super([`Data size of ${n} bytes is too small for given parameters.`].join("\n"), {
			metaMessages: [`Params: (${d(e,{includeName:!0})})`, `Data:   ${t} (${n} bytes)`],
			name: "AbiDecodingDataSizeTooSmallError"
		}), Object.defineProperty(this, "data", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "params", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "size", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), this.data = t, this.params = e, this.size = n
	}
}
class w extends y {
	constructor() {
		super('Cannot decode zero data ("0x") with ABI parameters.', {
			name: "AbiDecodingZeroDataError"
		})
	}
}
class v extends y {
	constructor({
		expectedLength: t,
		givenLength: e,
		type: n
	}) {
		super([`ABI encoding array length mismatch for type ${n}.`, `Expected length: ${t}`, `Given length: ${e}`]
			.join("\n"), {
				name: "AbiEncodingArrayLengthMismatchError"
			})
	}
}
class $ extends y {
	constructor({
		expectedSize: t,
		value: e
	}) {
		super(`Size of bytes "${e}" (bytes${p(e)}) does not match expected size (bytes${t}).`, {
			name: "AbiEncodingBytesSizeMismatchError"
		})
	}
}
class x extends y {
	constructor({
		expectedLength: t,
		givenLength: e
	}) {
		super(["ABI encoding params/values length mismatch.", `Expected length (params): ${t}`,
			`Given length (values): ${e}`
		].join("\n"), {
			name: "AbiEncodingLengthMismatchError"
		})
	}
}
class z extends y {
	constructor(t, {
		docsPath: e
	} = {}) {
		super([`Function ${t?`"${t}" `:""}not found on ABI.`,
			"Make sure you are using the correct ABI and that the function exists on it."
		].join("\n"), {
			docsPath: e,
			name: "AbiFunctionNotFoundError"
		})
	}
}
class P extends y {
	constructor(t, {
		docsPath: e
	}) {
		super([`Function "${t}" does not contain any \`outputs\` on ABI.`,
			"Cannot decode function result without knowing what the parameter types are.",
			"Make sure you are using the correct ABI and that the function exists on it."
		].join("\n"), {
			docsPath: e,
			name: "AbiFunctionOutputsNotFoundError"
		})
	}
}
class I extends y {
	constructor(t, e) {
		super("Found ambiguous types in overloaded ABI items.", {
			metaMessages: [`\`${t.type}\` in \`${l(t.abiItem)}\`, and`,
				`\`${e.type}\` in \`${l(e.abiItem)}\``, "",
				"These types encode differently and cannot be distinguished at runtime.",
				"Remove one of the ambiguous items in the ABI."
			],
			name: "AbiItemAmbiguityError"
		})
	}
}
class A extends y {
	constructor(t, {
		docsPath: e
	}) {
		super([`Type "${t}" is not a valid encoding type.`, "Please provide a valid ABI type."].join("\n"), {
			docsPath: e,
			name: "InvalidAbiEncodingType"
		})
	}
}
class B extends y {
	constructor(t, {
		docsPath: e
	}) {
		super([`Type "${t}" is not a valid decoding type.`, "Please provide a valid ABI type."].join("\n"), {
			docsPath: e,
			name: "InvalidAbiDecodingType"
		})
	}
}
class E extends y {
	constructor(t) {
		super([`Value "${t}" is not a valid array.`].join("\n"), {
			name: "InvalidArrayError"
		})
	}
}
class U extends y {
	constructor(t) {
		super([`"${t}" is not a valid definition type.`, 'Valid types: "function", "event", "error"'].join("\n"), {
			name: "InvalidDefinitionTypeError"
		})
	}
}
class L extends y {
	constructor({
		offset: t,
		position: e,
		size: n
	}) {
		super(`Slice ${"start"===e?"starting":"ending"} at offset "${t}" is out-of-bounds (size: ${n}).`, {
			name: "SliceOffsetOutOfBoundsError"
		})
	}
}
class N extends y {
	constructor({
		size: t,
		targetSize: e,
		type: n
	}) {
		super(`${n.charAt(0).toUpperCase()}${n.slice(1).toLowerCase()} size (${t}) exceeds padding size (${e}).`, {
			name: "SizeExceedsPaddingSizeError"
		})
	}
}

function O(t, {
	dir: e,
	size: n = 32
} = {}) {
	return "string" == typeof t ? S(t, {
		dir: e,
		size: n
	}) : function(t, {
		dir: e,
		size: n = 32
	} = {}) {
		if (null === n) return t;
		if (t.length > n) throw new N({
			size: t.length,
			targetSize: n,
			type: "bytes"
		});
		const i = new Uint8Array(n);
		for (let s = 0; s < n; s++) {
			const o = "right" === e;
			i[o ? s : n - s - 1] = t[o ? s : t.length - s - 1]
		}
		return i
	}(t, {
		dir: e,
		size: n
	})
}

function S(t, {
	dir: e,
	size: n = 32
} = {}) {
	if (null === n) return t;
	const i = t.replace("0x", "");
	if (i.length > 2 * n) throw new N({
		size: Math.ceil(i.length / 2),
		targetSize: n,
		type: "hex"
	});
	return `0x${i["right"===e?"padEnd":"padStart"](2*n,"0")}`
}
class M extends y {
	constructor({
		max: t,
		min: e,
		signed: n,
		size: i,
		value: s
	}) {
		super(`Number "${s}" is not in safe ${i?`${8*i}-bit ${n?"signed":"unsigned"} `:""}integer range ${t?`(${e} to ${t})`:`(above ${e})`}`, {
			name: "IntegerOutOfRangeError"
		})
	}
}
class R extends y {
	constructor(t) {
		super(`Bytes value "${t}" is not a valid boolean. The bytes array must contain a single byte of either a 0 or 1 value.`, {
			name: "InvalidBytesBooleanError"
		})
	}
}
class j extends y {
	constructor({
		givenSize: t,
		maxSize: e
	}) {
		super(`Size cannot exceed ${e} bytes. Given size: ${t} bytes.`, {
			name: "SizeOverflowError"
		})
	}
}

function k(t, {
	dir: e = "left"
} = {}) {
	let n = "string" == typeof t ? t.replace("0x", "") : t,
		i = 0;
	for (let s = 0; s < n.length - 1 && "0" === n["left" === e ? s : n.length - s - 1].toString(); s++) i++;
	return n = "left" === e ? n.slice(i) : n.slice(0, n.length - i), "string" == typeof t ? (1 === n.length &&
		"right" === e && (n = `${n}0`), `0x${n.length%2==1?`0${n}`:n}`) : n
}

function C(t, {
	size: e
}) {
	if (p(t) > e) throw new j({
		givenSize: p(t),
		maxSize: e
	})
}

function F(t, e = {}) {
	const {
		signed: n
	} = e;
	e.size && C(t, {
		size: e.size
	});
	const i = BigInt(t);
	if (!n) return i;
	const s = (t.length - 2) / 2;
	return i <= (1n << 8n * BigInt(s) - 1n) - 1n ? i : i - BigInt(`0x${"f".padStart(2*s,"f")}`) - 1n
}
const _ = Array.from({
	length: 256
}, ((t, e) => e.toString(16).padStart(2, "0")));

function T(t, e = {}) {
	const n = `0x${Number(t)}`;
	return "number" == typeof e.size ? (C(n, {
		size: e.size
	}), O(n, {
		size: e.size
	})) : n
}

function D(t, e = {}) {
	let n = "";
	for (let s = 0; s < t.length; s++) n += _[t[s]];
	const i = `0x${n}`;
	return "number" == typeof e.size ? (C(i, {
		size: e.size
	}), O(i, {
		dir: "right",
		size: e.size
	})) : i
}

function V(t, e = {}) {
	const {
		signed: n,
		size: i
	} = e, s = BigInt(t);
	let o;
	i ? o = n ? (1n << 8n * BigInt(i) - 1n) - 1n : 2n ** (8n * BigInt(i)) - 1n : "number" == typeof t && (o = BigInt(
		Number.MAX_SAFE_INTEGER));
	const r = "bigint" == typeof o && n ? -o - 1n : 0;
	if (o && s > o || s < r) {
		const e = "bigint" == typeof t ? "n" : "";
		throw new M({
			max: o ? `${o}${e}` : void 0,
			min: `${r}${e}`,
			signed: n,
			size: i,
			value: `${t}${e}`
		})
	}
	const a = `0x${(n&&s<0?(1n<<BigInt(8*i))+BigInt(s):s).toString(16)}`;
	return i ? O(a, {
		size: i
	}) : a
}
const W = new TextEncoder;

function X(t, e = {}) {
	return D(W.encode(t), e)
}
const G = new TextEncoder;

function H(t, e = {}) {
	return "number" == typeof t || "bigint" == typeof t ? function(t, e) {
		return et(V(t, e))
	}(t, e) : "boolean" == typeof t ? function(t, e = {}) {
		const n = new Uint8Array(1);
		if (n[0] = Number(t), "number" == typeof e.size) return C(n, {
			size: e.size
		}), O(n, {
			size: e.size
		});
		return n
	}(t, e) : f(t) ? et(t, e) : nt(t, e)
}
const q = 48,
	Y = 57,
	Z = 65,
	J = 70,
	K = 97,
	Q = 102;

function tt(t) {
	return t >= q && t <= Y ? t - q : t >= Z && t <= J ? t - (Z - 10) : t >= K && t <= Q ? t - (K - 10) : void 0
}

function et(t, e = {}) {
	let n = t;
	e.size && (C(n, {
		size: e.size
	}), n = O(n, {
		dir: "right",
		size: e.size
	}));
	let i = n.slice(2);
	i.length % 2 && (i = `0${i}`);
	const s = i.length / 2,
		o = new Uint8Array(s);
	for (let r = 0, a = 0; r < s; r++) {
		const t = tt(i.charCodeAt(a++)),
			e = tt(i.charCodeAt(a++));
		if (void 0 === t || void 0 === e) throw new y(`Invalid byte sequence ("${i[a-2]}${i[a-1]}" in "${i}").`);
		o[r] = 16 * t + e
	}
	return o
}

function nt(t, e = {}) {
	const n = G.encode(t);
	return "number" == typeof e.size ? (C(n, {
		size: e.size
	}), O(n, {
		dir: "right",
		size: e.size
	})) : n
}
const it = BigInt(2 ** 32 - 1),
	st = BigInt(32);

function ot(t, e = !1) {
	return e ? {
		h: Number(t & it),
		l: Number(t >> st & it)
	} : {
		h: 0 | Number(t >> st & it),
		l: 0 | Number(t & it)
	}
}

function rt(t) {
	if (!Number.isSafeInteger(t) || t < 0) throw new Error("positive integer expected, got " + t)
}

function at(t, ...e) {
	if (!((n = t) instanceof Uint8Array || ArrayBuffer.isView(n) && "Uint8Array" === n.constructor.name))
	throw new Error("Uint8Array expected");
	/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
	var n;
	if (e.length > 0 && !e.includes(t.length)) throw new Error("Uint8Array expected of length " + e + ", got length=" +
		t.length)
}

function ct(t, e = !0) {
	if (t.destroyed) throw new Error("Hash instance has been destroyed");
	if (e && t.finished) throw new Error("Hash#digest() has already been called")
}

function ut(...t) {
	for (let e = 0; e < t.length; e++) t[e].fill(0)
}
const ht = (() => 68 === new Uint8Array(new Uint32Array([287454020]).buffer)[0])() ? t => t : function(t) {
	for (let n = 0; n < t.length; n++) t[n] = (e = t[n]) << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 |
		e >>> 24 & 255;
	var e;
	return t
};

function lt(t) {
	return "string" == typeof t && (t = function(t) {
		if ("string" != typeof t) throw new Error("string expected");
		return new Uint8Array((new TextEncoder).encode(t))
	}(t)), at(t), t
}
const dt = BigInt(0),
	ft = BigInt(1),
	pt = BigInt(2),
	gt = BigInt(7),
	yt = BigInt(256),
	mt = BigInt(113),
	bt = [],
	wt = [],
	vt = [];
for (let $e = 0, xe = ft, ze = 1, Pe = 0; $e < 24; $e++) {
	[ze, Pe] = [Pe, (2 * ze + 3 * Pe) % 5], bt.push(2 * (5 * Pe + ze)), wt.push(($e + 1) * ($e + 2) / 2 % 64);
	let t = dt;
	for (let e = 0; e < 7; e++) xe = (xe << ft ^ (xe >> gt) * mt) % yt, xe & pt && (t ^= ft << (ft << BigInt(e)) - ft);
	vt.push(t)
}
const $t = function(t, e = !1) {
		const n = t.length;
		let i = new Uint32Array(n),
			s = new Uint32Array(n);
		for (let o = 0; o < n; o++) {
			const {
				h: n,
				l: r
			} = ot(t[o], e);
			[i[o], s[o]] = [n, r]
		}
		return [i, s]
	}(vt, !0),
	xt = $t[0],
	zt = $t[1],
	Pt = (t, e, n) => n > 32 ? ((t, e, n) => e << n - 32 | t >>> 64 - n)(t, e, n) : ((t, e, n) => t << n | e >>> 32 - n)
	(t, e, n),
	It = (t, e, n) => n > 32 ? ((t, e, n) => t << n - 32 | e >>> 64 - n)(t, e, n) : ((t, e, n) => e << n | t >>> 32 - n)
	(t, e, n);
class At extends class {} {
	constructor(t, e, n, i = !1, s = 24) {
		if (super(), this.pos = 0, this.posOut = 0, this.finished = !1, this.destroyed = !1, this.enableXOF = !1,
			this.blockLen = t, this.suffix = e, this.outputLen = n, this.enableXOF = i, this.rounds = s, rt(n), !(
				0 < t && t < 200)) throw new Error("only keccak-f1600 function is supported");
		var o;
		this.state = new Uint8Array(200), this.state32 = (o = this.state, new Uint32Array(o.buffer, o.byteOffset,
			Math.floor(o.byteLength / 4)))
	}
	clone() {
		return this._cloneInto()
	}
	keccak() {
		ht(this.state32),
			function(t, e = 24) {
				const n = new Uint32Array(10);
				for (let i = 24 - e; i < 24; i++) {
					for (let i = 0; i < 10; i++) n[i] = t[i] ^ t[i + 10] ^ t[i + 20] ^ t[i + 30] ^ t[i + 40];
					for (let i = 0; i < 10; i += 2) {
						const e = (i + 8) % 10,
							s = (i + 2) % 10,
							o = n[s],
							r = n[s + 1],
							a = Pt(o, r, 1) ^ n[e],
							c = It(o, r, 1) ^ n[e + 1];
						for (let n = 0; n < 50; n += 10) t[i + n] ^= a, t[i + n + 1] ^= c
					}
					let e = t[2],
						s = t[3];
					for (let n = 0; n < 24; n++) {
						const i = wt[n],
							o = Pt(e, s, i),
							r = It(e, s, i),
							a = bt[n];
						e = t[a], s = t[a + 1], t[a] = o, t[a + 1] = r
					}
					for (let i = 0; i < 50; i += 10) {
						for (let e = 0; e < 10; e++) n[e] = t[i + e];
						for (let e = 0; e < 10; e++) t[i + e] ^= ~n[(e + 2) % 10] & n[(e + 4) % 10]
					}
					t[0] ^= xt[i], t[1] ^= zt[i]
				}
				ut(n)
			}(this.state32, this.rounds), ht(this.state32), this.posOut = 0, this.pos = 0
	}
	update(t) {
		ct(this), at(t = lt(t));
		const {
			blockLen: e,
			state: n
		} = this, i = t.length;
		for (let s = 0; s < i;) {
			const o = Math.min(e - this.pos, i - s);
			for (let e = 0; e < o; e++) n[this.pos++] ^= t[s++];
			this.pos === e && this.keccak()
		}
		return this
	}
	finish() {
		if (this.finished) return;
		this.finished = !0;
		const {
			state: t,
			suffix: e,
			pos: n,
			blockLen: i
		} = this;
		t[n] ^= e, 0 != (128 & e) && n === i - 1 && this.keccak(), t[i - 1] ^= 128, this.keccak()
	}
	writeInto(t) {
		ct(this, !1), at(t), this.finish();
		const e = this.state,
			{
				blockLen: n
			} = this;
		for (let i = 0, s = t.length; i < s;) {
			this.posOut >= n && this.keccak();
			const o = Math.min(n - this.posOut, s - i);
			t.set(e.subarray(this.posOut, this.posOut + o), i), this.posOut += o, i += o
		}
		return t
	}
	xofInto(t) {
		if (!this.enableXOF) throw new Error("XOF is not possible for this instance");
		return this.writeInto(t)
	}
	xof(t) {
		return rt(t), this.xofInto(new Uint8Array(t))
	}
	digestInto(t) {
		if (function(t, e) {
				at(t);
				const n = e.outputLen;
				if (t.length < n) throw new Error("digestInto() expects output buffer of length at least " + n)
			}(t, this), this.finished) throw new Error("digest() was already called");
		return this.writeInto(t), this.destroy(), t
	}
	digest() {
		return this.digestInto(new Uint8Array(this.outputLen))
	}
	destroy() {
		this.destroyed = !0, ut(this.state)
	}
	_cloneInto(t) {
		const {
			blockLen: e,
			suffix: n,
			outputLen: i,
			rounds: s,
			enableXOF: o
		} = this;
		return t || (t = new At(e, n, i, o, s)), t.state32.set(this.state32), t.pos = this.pos, t.posOut = this
			.posOut, t.finished = this.finished, t.rounds = s, t.suffix = n, t.outputLen = i, t.enableXOF = o, t
			.destroyed = this.destroyed, t
	}
}
const Bt = (t, e, n) => function(t) {
		const e = e => t().update(lt(e)).digest(),
			n = t();
		return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e
	}((() => new At(e, t, n))),
	Et = (() => Bt(1, 136, 32))();

function Ut(t, e) {
	const n = e || "hex",
		i = Et(f(t, {
			strict: !1
		}) ? H(t) : t);
	return "bytes" === n ? i : function(t, e = {}) {
		return "number" == typeof t || "bigint" == typeof t ? V(t, e) : "string" == typeof t ? X(t, e) :
			"boolean" == typeof t ? T(t, e) : D(t, e)
	}(i)
}

function Lt(t) {
	return Ut(H(t))
}
const Nt = t => {
	var e, n;
	return function(t) {
		let e = !0,
			n = "",
			i = 0,
			s = "",
			o = !1;
		for (let r = 0; r < t.length; r++) {
			const a = t[r];
			if (["(", ")", ","].includes(a) && (e = !0), "(" === a && i++, ")" === a && i--, e)
				if (0 !== i) " " !== a ? (s += a, n += a) : "," !== t[r - 1] && "," !== n && ",(" !== n && (n =
					"", e = !1);
				else if (" " === a && ["event", "function", ""].includes(s)) s = "";
			else if (s += a, ")" === a) {
				o = !0;
				break
			}
		}
		if (!o) throw new y("Unable to normalize signature.");
		return s
	}("string" == typeof t ? t : "function" === (e = t).type ?
		`function ${e.name}(${h(e.inputs)})${e.stateMutability&&"nonpayable"!==e.stateMutability?` ${e.stateMutability}`:""}${(null==(n=e.outputs)?void 0:n.length)?` returns (${h(e.outputs)})`:""}` :
		"event" === e.type ? `event ${e.name}(${h(e.inputs)})` : "error" === e.type ?
		`error ${e.name}(${h(e.inputs)})` : "constructor" === e.type ?
		`constructor(${h(e.inputs)})${"payable"===e.stateMutability?" payable":""}` : "fallback" === e.type ?
		"fallback() external" + ("payable" === e.stateMutability ? " payable" : "") :
		"receive() external payable")
};

function Ot(t) {
	return Lt(Nt(t))
}
const St = Ot;
class Mt extends y {
	constructor({
		address: t
	}) {
		super(`Address "${t}" is invalid.`, {
			metaMessages: ["- Address must be a hex value of 20 bytes (40 hex characters).",
				"- Address must match its checksum counterpart."
			],
			name: "InvalidAddressError"
		})
	}
}
class Rt extends Map {
	constructor(t) {
		super(), Object.defineProperty(this, "maxSize", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), this.maxSize = t
	}
	get(t) {
		const e = super.get(t);
		return super.has(t) && void 0 !== e && (this.delete(t), super.set(t, e)), e
	}
	set(t, e) {
		if (super.set(t, e), this.maxSize && this.size > this.maxSize) {
			const t = this.keys().next().value;
			t && this.delete(t)
		}
		return this
	}
}
const jt = new Rt(8192);

function kt(t, e) {
	if (jt.has(`${t}.${e}`)) return jt.get(`${t}.${e}`);
	const n = e ? `${e}${t.toLowerCase()}` : t.substring(2).toLowerCase(),
		i = Ut(nt(n), "bytes"),
		s = (e ? n.substring(`${e}0x`.length) : n).split("");
	for (let r = 0; r < 40; r += 2) i[r >> 1] >> 4 >= 8 && s[r] && (s[r] = s[r].toUpperCase()), (15 & i[r >> 1]) >= 8 &&
		s[r + 1] && (s[r + 1] = s[r + 1].toUpperCase());
	const o = `0x${s.join("")}`;
	return jt.set(`${t}.${e}`, o), o
}
const Ct = /^0x[a-fA-F0-9]{40}$/,
	Ft = new Rt(8192);

function _t(t, e) {
	const {
		strict: n = !0
	} = e ?? {}, i = `${t}.${n}`;
	if (Ft.has(i)) return Ft.get(i);
	const s = !(!Ct.test(t) || t.toLowerCase() !== t && n && kt(t) !== t);
	return Ft.set(i, s), s
}

function Tt(t) {
	return "string" == typeof t[0] ? Dt(t) : function(t) {
		let e = 0;
		for (const s of t) e += s.length;
		const n = new Uint8Array(e);
		let i = 0;
		for (const s of t) n.set(s, i), i += s.length;
		return n
	}(t)
}

function Dt(t) {
	return `0x${t.reduce(((t,e)=>t+e.replace("0x","")),"")}`
}

function Vt(t, e, n, {
	strict: i
} = {}) {
	return f(t, {
		strict: !1
	}) ? function(t, e, n, {
		strict: i
	} = {}) {
		Wt(t, e);
		const s = `0x${t.replace("0x","").slice(2*(e??0),2*(n??t.length))}`;
		i && Xt(s, e, n);
		return s
	}(t, e, n, {
		strict: i
	}) : Gt(t, e, n, {
		strict: i
	})
}

function Wt(t, e) {
	if ("number" == typeof e && e > 0 && e > p(t) - 1) throw new L({
		offset: e,
		position: "start",
		size: p(t)
	})
}

function Xt(t, e, n) {
	if ("number" == typeof e && "number" == typeof n && p(t) !== n - e) throw new L({
		offset: n,
		position: "end",
		size: p(t)
	})
}

function Gt(t, e, n, {
	strict: i
} = {}) {
	Wt(t, e);
	const s = t.slice(e, n);
	return i && Xt(s, e, n), s
}
const Ht =
	/^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;

function qt(t, e) {
	if (t.length !== e.length) throw new x({
		expectedLength: t.length,
		givenLength: e.length
	});
	const n = function({
			params: t,
			values: e
		}) {
			const n = [];
			for (let i = 0; i < t.length; i++) n.push(Yt({
				param: t[i],
				value: e[i]
			}));
			return n
		}({
			params: t,
			values: e
		}),
		i = Zt(n);
	return 0 === i.length ? "0x" : i
}

function Yt({
	param: t,
	value: e
}) {
	const n = Jt(t.type);
	if (n) {
		const [i, s] = n;
		return function(t, {
			length: e,
			param: n
		}) {
			const i = null === e;
			if (!Array.isArray(t)) throw new E(t);
			if (!i && t.length !== e) throw new v({
				expectedLength: e,
				givenLength: t.length,
				type: `${n.type}[${e}]`
			});
			let s = !1;
			const o = [];
			for (let r = 0; r < t.length; r++) {
				const e = Yt({
					param: n,
					value: t[r]
				});
				e.dynamic && (s = !0), o.push(e)
			}
			if (i || s) {
				const t = Zt(o);
				if (i) {
					const e = V(o.length, {
						size: 32
					});
					return {
						dynamic: !0,
						encoded: o.length > 0 ? Tt([e, t]) : e
					}
				}
				if (s) return {
					dynamic: !0,
					encoded: t
				}
			}
			return {
				dynamic: !1,
				encoded: Tt(o.map((({
					encoded: t
				}) => t)))
			}
		}(e, {
			length: i,
			param: {
				...t,
				type: s
			}
		})
	}
	if ("tuple" === t.type) return function(t, {
		param: e
	}) {
		let n = !1;
		const i = [];
		for (let s = 0; s < e.components.length; s++) {
			const o = e.components[s],
				r = Yt({
					param: o,
					value: t[Array.isArray(t) ? s : o.name]
				});
			i.push(r), r.dynamic && (n = !0)
		}
		return {
			dynamic: n,
			encoded: n ? Zt(i) : Tt(i.map((({
				encoded: t
			}) => t)))
		}
	}(e, {
		param: t
	});
	if ("address" === t.type) return function(t) {
		if (!_t(t)) throw new Mt({
			address: t
		});
		return {
			dynamic: !1,
			encoded: S(t.toLowerCase())
		}
	}(e);
	if ("bool" === t.type) return function(t) {
		if ("boolean" != typeof t) throw new y(
			`Invalid boolean value: "${t}" (type: ${typeof t}). Expected: \`true\` or \`false\`.`);
		return {
			dynamic: !1,
			encoded: S(T(t))
		}
	}(e);
	if (t.type.startsWith("uint") || t.type.startsWith("int")) {
		const n = t.type.startsWith("int"),
			[, , i = "256"] = Ht.exec(t.type) ?? [];
		return function(t, {
			signed: e,
			size: n = 256
		}) {
			if ("number" == typeof n) {
				const i = 2n ** (BigInt(n) - (e ? 1n : 0n)) - 1n,
					s = e ? -i - 1n : 0n;
				if (t > i || t < s) throw new M({
					max: i.toString(),
					min: s.toString(),
					signed: e,
					size: n / 8,
					value: t.toString()
				})
			}
			return {
				dynamic: !1,
				encoded: V(t, {
					size: 32,
					signed: e
				})
			}
		}(e, {
			signed: n,
			size: Number(i)
		})
	}
	if (t.type.startsWith("bytes")) return function(t, {
		param: e
	}) {
		const [, n] = e.type.split("bytes"), i = p(t);
		if (!n) {
			let e = t;
			return i % 32 != 0 && (e = S(e, {
				dir: "right",
				size: 32 * Math.ceil((t.length - 2) / 2 / 32)
			})), {
				dynamic: !0,
				encoded: Tt([S(V(i, {
					size: 32
				})), e])
			}
		}
		if (i !== Number.parseInt(n, 10)) throw new $({
			expectedSize: Number.parseInt(n, 10),
			value: t
		});
		return {
			dynamic: !1,
			encoded: S(t, {
				dir: "right"
			})
		}
	}(e, {
		param: t
	});
	if ("string" === t.type) return function(t) {
		const e = X(t),
			n = Math.ceil(p(e) / 32),
			i = [];
		for (let s = 0; s < n; s++) i.push(S(Vt(e, 32 * s, 32 * (s + 1)), {
			dir: "right"
		}));
		return {
			dynamic: !0,
			encoded: Tt([S(V(p(e), {
				size: 32
			})), ...i])
		}
	}(e);
	throw new A(t.type, {
		docsPath: "/docs/contract/encodeAbiParameters"
	})
}

function Zt(t) {
	let e = 0;
	for (let o = 0; o < t.length; o++) {
		const {
			dynamic: n,
			encoded: i
		} = t[o];
		e += n ? 32 : p(i)
	}
	const n = [],
		i = [];
	let s = 0;
	for (let o = 0; o < t.length; o++) {
		const {
			dynamic: r,
			encoded: a
		} = t[o];
		r ? (n.push(V(e + s, {
			size: 32
		})), i.push(a), s += p(a)) : n.push(a)
	}
	return Tt([...n, ...i])
}

function Jt(t) {
	const e = t.match(/^(.*)\[(\d+)?\]$/);
	return e ? [e[2] ? Number(e[2]) : null, e[1]] : void 0
}
const Kt = t => Vt(Ot(t), 0, 4);

function Qt(t) {
	const {
		abi: e,
		args: n = [],
		name: i
	} = t, s = f(i, {
		strict: !1
	}), o = e.filter((t => s ? "function" === t.type ? Kt(t) === i : "event" === t.type && St(t) === i : "name" in
		t && t.name === i));
	if (0 === o.length) return;
	if (1 === o.length) return o[0];
	let r;
	for (const a of o) {
		if (!("inputs" in a)) continue;
		if (!n || 0 === n.length) {
			if (!a.inputs || 0 === a.inputs.length) return a;
			continue
		}
		if (!a.inputs) continue;
		if (0 === a.inputs.length) continue;
		if (a.inputs.length !== n.length) continue;
		if (n.every(((t, e) => {
				const n = "inputs" in a && a.inputs[e];
				return !!n && te(t, n)
			}))) {
			if (r && "inputs" in r && r.inputs) {
				const t = ee(a.inputs, r.inputs, n);
				if (t) throw new I({
					abiItem: a,
					type: t[0]
				}, {
					abiItem: r,
					type: t[1]
				})
			}
			r = a
		}
	}
	return r || o[0]
}

function te(t, e) {
	const n = typeof t,
		i = e.type;
	switch (i) {
		case "address":
			return _t(t, {
				strict: !1
			});
		case "bool":
			return "boolean" === n;
		case "function":
		case "string":
			return "string" === n;
		default:
			return "tuple" === i && "components" in e ? Object.values(e.components).every(((e, i) => "object" === n &&
					te(Object.values(t)[i], e))) :
				/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/
				.test(i) ? "number" === n || "bigint" === n : /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(i) ?
				"string" === n || t instanceof Uint8Array : !!/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(i) && (Array
					.isArray(t) && t.every((t => te(t, {
						...e,
						type: i.replace(/(\[[0-9]{0,}\])$/, "")
					}))))
	}
}

function ee(t, e, n) {
	for (const i in t) {
		const s = t[i],
			o = e[i];
		if ("tuple" === s.type && "tuple" === o.type && "components" in s && "components" in o) return ee(s.components,
			o.components, n[i]);
		const r = [s.type, o.type];
		if (!(!r.includes("address") || !r.includes("bytes20")) || (r.includes("address") && r.includes("string") || !(!
				r.includes("address") || !r.includes("bytes"))) && _t(n[i], {
				strict: !1
			})) return r
	}
}
const ne = "/docs/contract/encodeFunctionData";

function ie(t) {
	const {
		args: e
	} = t, {
		abi: n,
		functionName: i
	} = 1 === t.abi.length && (null == (s = t.functionName) ? void 0 : s.startsWith("0x")) ? t : function(t) {
		const {
			abi: e,
			args: n,
			functionName: i
		} = t;
		let s = e[0];
		if (i) {
			const t = Qt({
				abi: e,
				args: n,
				name: i
			});
			if (!t) throw new z(i, {
				docsPath: ne
			});
			s = t
		}
		if ("function" !== s.type) throw new z(void 0, {
			docsPath: ne
		});
		return {
			abi: [s],
			functionName: Kt(l(s))
		}
	}(t);
	var s;
	const o = n[0];
	return Dt([i, ("inputs" in o && o.inputs ? qt(o.inputs, e ?? []) : void 0) ?? "0x"])
}
class se extends y {
	constructor({
		offset: t
	}) {
		super(`Offset \`${t}\` cannot be negative.`, {
			name: "NegativeOffsetError"
		})
	}
}
class oe extends y {
	constructor({
		length: t,
		position: e
	}) {
		super(`Position \`${e}\` is out of bounds (\`0 < position < ${t}\`).`, {
			name: "PositionOutOfBoundsError"
		})
	}
}
class re extends y {
	constructor({
		count: t,
		limit: e
	}) {
		super(`Recursive read limit of \`${e}\` exceeded (recursive read count: \`${t}\`).`, {
			name: "RecursiveReadLimitExceededError"
		})
	}
}
const ae = {
	bytes: new Uint8Array,
	dataView: new DataView(new ArrayBuffer(0)),
	position: 0,
	positionReadCount: new Map,
	recursiveReadCount: 0,
	recursiveReadLimit: Number.POSITIVE_INFINITY,
	assertReadLimit() {
		if (this.recursiveReadCount >= this.recursiveReadLimit) throw new re({
			count: this.recursiveReadCount + 1,
			limit: this.recursiveReadLimit
		})
	},
	assertPosition(t) {
		if (t < 0 || t > this.bytes.length - 1) throw new oe({
			length: this.bytes.length,
			position: t
		})
	},
	decrementPosition(t) {
		if (t < 0) throw new se({
			offset: t
		});
		const e = this.position - t;
		this.assertPosition(e), this.position = e
	},
	getReadCount(t) {
		return this.positionReadCount.get(t || this.position) || 0
	},
	incrementPosition(t) {
		if (t < 0) throw new se({
			offset: t
		});
		const e = this.position + t;
		this.assertPosition(e), this.position = e
	},
	inspectByte(t) {
		const e = t ?? this.position;
		return this.assertPosition(e), this.bytes[e]
	},
	inspectBytes(t, e) {
		const n = e ?? this.position;
		return this.assertPosition(n + t - 1), this.bytes.subarray(n, n + t)
	},
	inspectUint8(t) {
		const e = t ?? this.position;
		return this.assertPosition(e), this.bytes[e]
	},
	inspectUint16(t) {
		const e = t ?? this.position;
		return this.assertPosition(e + 1), this.dataView.getUint16(e)
	},
	inspectUint24(t) {
		const e = t ?? this.position;
		return this.assertPosition(e + 2), (this.dataView.getUint16(e) << 8) + this.dataView.getUint8(e + 2)
	},
	inspectUint32(t) {
		const e = t ?? this.position;
		return this.assertPosition(e + 3), this.dataView.getUint32(e)
	},
	pushByte(t) {
		this.assertPosition(this.position), this.bytes[this.position] = t, this.position++
	},
	pushBytes(t) {
		this.assertPosition(this.position + t.length - 1), this.bytes.set(t, this.position), this.position += t
			.length
	},
	pushUint8(t) {
		this.assertPosition(this.position), this.bytes[this.position] = t, this.position++
	},
	pushUint16(t) {
		this.assertPosition(this.position + 1), this.dataView.setUint16(this.position, t), this.position += 2
	},
	pushUint24(t) {
		this.assertPosition(this.position + 2), this.dataView.setUint16(this.position, t >> 8), this.dataView
			.setUint8(this.position + 2, 255 & t), this.position += 3
	},
	pushUint32(t) {
		this.assertPosition(this.position + 3), this.dataView.setUint32(this.position, t), this.position += 4
	},
	readByte() {
		this.assertReadLimit(), this._touch();
		const t = this.inspectByte();
		return this.position++, t
	},
	readBytes(t, e) {
		this.assertReadLimit(), this._touch();
		const n = this.inspectBytes(t);
		return this.position += e ?? t, n
	},
	readUint8() {
		this.assertReadLimit(), this._touch();
		const t = this.inspectUint8();
		return this.position += 1, t
	},
	readUint16() {
		this.assertReadLimit(), this._touch();
		const t = this.inspectUint16();
		return this.position += 2, t
	},
	readUint24() {
		this.assertReadLimit(), this._touch();
		const t = this.inspectUint24();
		return this.position += 3, t
	},
	readUint32() {
		this.assertReadLimit(), this._touch();
		const t = this.inspectUint32();
		return this.position += 4, t
	},
	get remaining() {
		return this.bytes.length - this.position
	},
	setPosition(t) {
		const e = this.position;
		return this.assertPosition(t), this.position = t, () => this.position = e
	},
	_touch() {
		if (this.recursiveReadLimit === Number.POSITIVE_INFINITY) return;
		const t = this.getReadCount();
		this.positionReadCount.set(this.position, t + 1), t > 0 && this.recursiveReadCount++
	}
};

function ce(t, e = {}) {
	void 0 !== e.size && C(t, {
		size: e.size
	});
	return F(D(t, e), e)
}

function ue(t, e = {}) {
	let n = t;
	if (void 0 !== e.size && (C(n, {
			size: e.size
		}), n = k(n)), n.length > 1 || n[0] > 1) throw new R(n);
	return Boolean(n[0])
}

function he(t, e = {}) {
	void 0 !== e.size && C(t, {
		size: e.size
	});
	return function(t, e = {}) {
		const n = F(t, e),
			i = Number(n);
		if (!Number.isSafeInteger(i)) throw new M({
			max: `${Number.MAX_SAFE_INTEGER}`,
			min: `${Number.MIN_SAFE_INTEGER}`,
			signed: e.signed,
			size: e.size,
			value: `${n}n`
		});
		return i
	}(D(t, e), e)
}

function le(t, e) {
	const n = "string" == typeof e ? et(e) : e,
		i = function(t, {
			recursiveReadLimit: e = 8192
		} = {}) {
			const n = Object.create(ae);
			return n.bytes = t, n.dataView = new DataView(t.buffer ?? t, t.byteOffset, t.byteLength), n
				.positionReadCount = new Map, n.recursiveReadLimit = e, n
		}(n);
	if (0 === p(n) && t.length > 0) throw new w;
	if (p(e) && p(e) < 32) throw new b({
		data: "string" == typeof e ? e : D(e),
		params: t,
		size: p(e)
	});
	let s = 0;
	const o = [];
	for (let r = 0; r < t.length; ++r) {
		const e = t[r];
		i.setPosition(s);
		const [n, a] = de(i, e, {
			staticPosition: 0
		});
		s += a, o.push(n)
	}
	return o
}

function de(t, e, {
	staticPosition: n
}) {
	const i = Jt(e.type);
	if (i) {
		const [s, o] = i;
		return function(t, e, {
			length: n,
			staticPosition: i
		}) {
			if (!n) {
				const n = i + he(t.readBytes(32)),
					s = n + 32;
				t.setPosition(n);
				const o = he(t.readBytes(32)),
					r = fe(e);
				let a = 0;
				const c = [];
				for (let i = 0; i < o; ++i) {
					t.setPosition(s + (r ? 32 * i : a));
					const [n, o] = de(t, e, {
						staticPosition: s
					});
					a += o, c.push(n)
				}
				return t.setPosition(i + 32), [c, 32]
			}
			if (fe(e)) {
				const s = i + he(t.readBytes(32)),
					o = [];
				for (let i = 0; i < n; ++i) {
					t.setPosition(s + 32 * i);
					const [n] = de(t, e, {
						staticPosition: s
					});
					o.push(n)
				}
				return t.setPosition(i + 32), [o, 32]
			}
			let s = 0;
			const o = [];
			for (let r = 0; r < n; ++r) {
				const [n, r] = de(t, e, {
					staticPosition: i + s
				});
				s += r, o.push(n)
			}
			return [o, s]
		}(t, {
			...e,
			type: o
		}, {
			length: s,
			staticPosition: n
		})
	}
	if ("tuple" === e.type) return function(t, e, {
		staticPosition: n
	}) {
		const i = 0 === e.components.length || e.components.some((({
				name: t
			}) => !t)),
			s = i ? [] : {};
		let o = 0;
		if (fe(e)) {
			const r = n + he(t.readBytes(32));
			for (let n = 0; n < e.components.length; ++n) {
				const a = e.components[n];
				t.setPosition(r + o);
				const [c, u] = de(t, a, {
					staticPosition: r
				});
				o += u, s[i ? n : null == a ? void 0 : a.name] = c
			}
			return t.setPosition(n + 32), [s, 32]
		}
		for (let r = 0; r < e.components.length; ++r) {
			const a = e.components[r],
				[c, u] = de(t, a, {
					staticPosition: n
				});
			s[i ? r : null == a ? void 0 : a.name] = c, o += u
		}
		return [s, o]
	}(t, e, {
		staticPosition: n
	});
	if ("address" === e.type) return function(t) {
		return [kt(D(Gt(t.readBytes(32), -20))), 32]
	}(t);
	if ("bool" === e.type) return function(t) {
		return [ue(t.readBytes(32), {
			size: 32
		}), 32]
	}(t);
	if (e.type.startsWith("bytes")) return function(t, e, {
		staticPosition: n
	}) {
		const [i, s] = e.type.split("bytes");
		if (!s) {
			const e = he(t.readBytes(32));
			t.setPosition(n + e);
			const i = he(t.readBytes(32));
			if (0 === i) return t.setPosition(n + 32), ["0x", 32];
			const s = t.readBytes(i);
			return t.setPosition(n + 32), [D(s), 32]
		}
		return [D(t.readBytes(Number.parseInt(s, 10), 32)), 32]
	}(t, e, {
		staticPosition: n
	});
	if (e.type.startsWith("uint") || e.type.startsWith("int")) return function(t, e) {
		const n = e.type.startsWith("int"),
			i = Number.parseInt(e.type.split("int")[1] || "256", 10),
			s = t.readBytes(32);
		return [i > 48 ? ce(s, {
			signed: n
		}) : he(s, {
			signed: n
		}), 32]
	}(t, e);
	if ("string" === e.type) return function(t, {
		staticPosition: e
	}) {
		const n = he(t.readBytes(32)),
			i = e + n;
		t.setPosition(i);
		const s = he(t.readBytes(32));
		if (0 === s) return t.setPosition(e + 32), ["", 32];
		const o = function(t, e = {}) {
			let n = t;
			return void 0 !== e.size && (C(n, {
				size: e.size
			}), n = k(n, {
				dir: "right"
			})), (new TextDecoder).decode(n)
		}(k(t.readBytes(s, 32)));
		return t.setPosition(e + 32), [o, 32]
	}(t, {
		staticPosition: n
	});
	throw new B(e.type, {
		docsPath: "/docs/contract/decodeAbiParameters"
	})
}

function fe(t) {
	var e;
	const {
		type: n
	} = t;
	if ("string" === n) return !0;
	if ("bytes" === n) return !0;
	if (n.endsWith("[]")) return !0;
	if ("tuple" === n) return null == (e = t.components) ? void 0 : e.some(fe);
	const i = Jt(t.type);
	return !(!i || !fe({
		...t,
		type: i[1]
	}))
}

function pe(t, e) {
	let n = t.toString();
	const i = n.startsWith("-");
	i && (n = n.slice(1)), n = n.padStart(e, "0");
	let [s, o] = [n.slice(0, n.length - e), n.slice(n.length - e)];
	return o = o.replace(/(0+)$/, ""), `${i?"-":""}${s||"0"}${o?`.${o}`:""}`
}

function ge(t, e) {
	if (!_t(t, {
			strict: !1
		})) throw new Mt({
		address: t
	});
	if (!_t(e, {
			strict: !1
		})) throw new Mt({
		address: e
	});
	return t.toLowerCase() === e.toLowerCase()
}
const ye = "/docs/contract/decodeFunctionResult";

function me(t) {
	const {
		abi: e,
		args: n,
		functionName: i,
		data: s
	} = t;
	let o = e[0];
	if (i) {
		const t = Qt({
			abi: e,
			args: n,
			name: i
		});
		if (!t) throw new z(i, {
			docsPath: ye
		});
		o = t
	}
	if ("function" !== o.type) throw new z(void 0, {
		docsPath: ye
	});
	if (!o.outputs) throw new P(o.name, {
		docsPath: ye
	});
	const r = le(o.outputs, s);
	return r && r.length > 1 ? r : r && 1 === r.length ? r[0] : void 0
}
class be extends y {
	constructor({
		value: t
	}) {
		super(`Number \`${t}\` is not a valid decimal number.`, {
			name: "InvalidDecimalNumberError"
		})
	}
}

function we(t, e) {
	if (!/^(-?)([0-9]*)\.?([0-9]*)$/.test(t)) throw new be({
		value: t
	});
	let [n, i = "0"] = t.split(".");
	const s = n.startsWith("-");
	if (s && (n = n.slice(1)), i = i.replace(/(0+)$/, ""), 0 === e) 1 === Math.round(Number(`.${i}`)) && (n =
		`${BigInt(n)+1n}`), i = "";
	else if (i.length > e) {
		const [t, s, o] = [i.slice(0, e - 1), i.slice(e - 1, e), i.slice(e)], r = Math.round(Number(`${s}.${o}`));
		i = r > 9 ? `${BigInt(t)+BigInt(1)}0`.padStart(t.length + 1, "0") : `${t}${r}`, i.length > e && (i = i.slice(1),
			n = `${BigInt(n)+1n}`), i = i.slice(0, e)
	} else i = i.padEnd(e, "0");
	return BigInt(`${s?"-":""}${n}${i}`)
}


export const viemUtils = {
	encodeFunctionData: ie,
	decodeFunctionResult: me,
	formatUnits: pe,
	parseUnits: we,
	isAddress: _t,
	isAddressEqual: ge,
	maxUint256: 2n ** 256n - 1n,
};


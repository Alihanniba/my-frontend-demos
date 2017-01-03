/*! Zepto 1.2.0 (generated with Zepto Builder) - zepto event ajax form ie callbacks deferred touch - zeptojs.com/license */
var Zepto = function() {
	function t(t) {
		return null == t ? String(t) : B[Y.call(t)] || "object"
	}

	function e(e) {
		return "function" == t(e)
	}

	function n(t) {
		return null != t && t == t.window
	}

	function r(t) {
		return null != t && t.nodeType == t.DOCUMENT_NODE
	}

	function i(e) {
		return "object" == t(e)
	}

	function o(t) {
		return i(t) && !n(t) && Object.getPrototypeOf(t) == Object.prototype
	}

	function a(t) {
		var e = !!t && "length" in t && t.length,
			r = j.type(t);
		return "function" != r && !n(t) && ("array" == r || 0 === e || "number" == typeof e && e > 0 && e - 1 in t)
	}

	function s(t) {
		return A.call(t, function(t) {
			return null != t
		})
	}

	function u(t) {
		return t.length > 0 ? j.fn.concat.apply([], t) : t
	}

	function c(t) {
		return t.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
	}

	function l(t) {
		return t in L ? L[t] : L[t] = new RegExp("(^|\\s)" + t + "(\\s|$)")
	}

	function f(t, e) {
		return "number" != typeof e || Z[c(t)] ? e : e + "px"
	}

	function h(t) {
		var e, n;
		return k[t] || (e = M.createElement(t), M.body.appendChild(e), n = getComputedStyle(e, "").getPropertyValue("display"), e.parentNode.removeChild(e), "none" == n && (n = "block"), k[t] = n), k[t]
	}

	function p(t) {
		return "children" in t ? D.call(t.children) : j.map(t.childNodes, function(t) {
			return 1 == t.nodeType ? t : void 0
		})
	}

	function d(t, e) {
		var n, r = t ? t.length : 0;
		for (n = 0; r > n; n++) this[n] = t[n];
		this.length = r, this.selector = e || ""
	}

	function m(t, e, n) {
		for (T in e) n && (o(e[T]) || Q(e[T])) ? (o(e[T]) && !o(t[T]) && (t[T] = {}), Q(e[T]) && !Q(t[T]) && (t[T] = []), m(t[T], e[T], n)) : e[T] !== E && (t[T] = e[T])
	}

	function g(t, e) {
		return null == e ? j(t) : j(t).filter(e)
	}

	function v(t, n, r, i) {
		return e(n) ? n.call(t, r, i) : n
	}

	function y(t, e, n) {
		null == n ? t.removeAttribute(e) : t.setAttribute(e, n)
	}

	function b(t, e) {
		var n = t.className || "",
			r = n && n.baseVal !== E;
		return e === E ? r ? n.baseVal : n : void(r ? n.baseVal = e : t.className = e)
	}

	function w(t) {
		try {
			return t ? "true" == t || ("false" == t ? !1 : "null" == t ? null : +t + "" == t ? +t : /^[\[\{]/.test(t) ? j.parseJSON(t) : t) : t
		} catch (e) {
			return t
		}
	}

	function x(t, e) {
		e(t);
		for (var n = 0, r = t.childNodes.length; r > n; n++) x(t.childNodes[n], e)
	}
	var E, T, j, S, C, N, P = [],
		O = P.concat,
		A = P.filter,
		D = P.slice,
		M = window.document,
		k = {},
		L = {},
		Z = {
			"column-count": 1,
			columns: 1,
			"font-weight": 1,
			"line-height": 1,
			opacity: 1,
			"z-index": 1,
			zoom: 1
		},
		F = /^\s*<(\w+|!)[^>]*>/,
		$ = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
		R = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
		z = /^(?:body|html)$/i,
		q = /([A-Z])/g,
		W = ["val", "css", "html", "text", "data", "width", "height", "offset"],
		H = ["after", "prepend", "before", "append"],
		I = M.createElement("table"),
		U = M.createElement("tr"),
		_ = {
			tr: M.createElement("tbody"),
			tbody: I,
			thead: I,
			tfoot: I,
			td: U,
			th: U,
			"*": M.createElement("div")
		},
		X = /complete|loaded|interactive/,
		V = /^[\w-]*$/,
		B = {},
		Y = B.toString,
		J = {},
		G = M.createElement("div"),
		K = {
			tabindex: "tabIndex",
			readonly: "readOnly",
			"for": "htmlFor",
			"class": "className",
			maxlength: "maxLength",
			cellspacing: "cellSpacing",
			cellpadding: "cellPadding",
			rowspan: "rowSpan",
			colspan: "colSpan",
			usemap: "useMap",
			frameborder: "frameBorder",
			contenteditable: "contentEditable"
		},
		Q = Array.isArray || function(t) {
			return t instanceof Array
		};
	return J.matches = function(t, e) {
		if (!e || !t || 1 !== t.nodeType) return !1;
		var n = t.matches || t.webkitMatchesSelector || t.mozMatchesSelector || t.oMatchesSelector || t.matchesSelector;
		if (n) return n.call(t, e);
		var r, i = t.parentNode,
			o = !i;
		return o && (i = G).appendChild(t), r = ~J.qsa(i, e).indexOf(t), o && G.removeChild(t), r
	}, C = function(t) {
		return t.replace(/-+(.)?/g, function(t, e) {
			return e ? e.toUpperCase() : ""
		})
	}, N = function(t) {
		return A.call(t, function(e, n) {
			return t.indexOf(e) == n
		})
	}, J.fragment = function(t, e, n) {
		var r, i, a;
		return $.test(t) && (r = j(M.createElement(RegExp.$1))), r || (t.replace && (t = t.replace(R, "<$1></$2>")), e === E && (e = F.test(t) && RegExp.$1), e in _ || (e = "*"), a = _[e], a.innerHTML = "" + t, r = j.each(D.call(a.childNodes), function() {
			a.removeChild(this)
		})), o(n) && (i = j(r), j.each(n, function(t, e) {
			W.indexOf(t) > -1 ? i[t](e) : i.attr(t, e)
		})), r
	}, J.Z = function(t, e) {
		return new d(t, e)
	}, J.isZ = function(t) {
		return t instanceof J.Z
	}, J.init = function(t, n) {
		var r;
		if (!t) return J.Z();
		if ("string" == typeof t)
			if (t = t.trim(), "<" == t[0] && F.test(t)) r = J.fragment(t, RegExp.$1, n), t = null;
			else {
				if (n !== E) return j(n).find(t);
				r = J.qsa(M, t)
			}
		else {
			if (e(t)) return j(M).ready(t);
			if (J.isZ(t)) return t;
			if (Q(t)) r = s(t);
			else if (i(t)) r = [t], t = null;
			else if (F.test(t)) r = J.fragment(t.trim(), RegExp.$1, n), t = null;
			else {
				if (n !== E) return j(n).find(t);
				r = J.qsa(M, t)
			}
		}
		return J.Z(r, t)
	}, j = function(t, e) {
		return J.init(t, e)
	}, j.extend = function(t) {
		var e, n = D.call(arguments, 1);
		return "boolean" == typeof t && (e = t, t = n.shift()), n.forEach(function(n) {
			m(t, n, e)
		}), t
	}, J.qsa = function(t, e) {
		var n, r = "#" == e[0],
			i = !r && "." == e[0],
			o = r || i ? e.slice(1) : e,
			a = V.test(o);
		return t.getElementById && a && r ? (n = t.getElementById(o)) ? [n] : [] : 1 !== t.nodeType && 9 !== t.nodeType && 11 !== t.nodeType ? [] : D.call(a && !r && t.getElementsByClassName ? i ? t.getElementsByClassName(o) : t.getElementsByTagName(e) : t.querySelectorAll(e))
	}, j.contains = M.documentElement.contains ? function(t, e) {
		return t !== e && t.contains(e)
	} : function(t, e) {
		for (; e && (e = e.parentNode);)
			if (e === t) return !0;
		return !1
	}, j.type = t, j.isFunction = e, j.isWindow = n, j.isArray = Q, j.isPlainObject = o, j.isEmptyObject = function(t) {
		var e;
		for (e in t) return !1;
		return !0
	}, j.isNumeric = function(t) {
		var e = Number(t),
			n = typeof t;
		return null != t && "boolean" != n && ("string" != n || t.length) && !isNaN(e) && isFinite(e) || !1
	}, j.inArray = function(t, e, n) {
		return P.indexOf.call(e, t, n)
	}, j.camelCase = C, j.trim = function(t) {
		return null == t ? "" : String.prototype.trim.call(t)
	}, j.uuid = 0, j.support = {}, j.expr = {}, j.noop = function() {}, j.map = function(t, e) {
		var n, r, i, o = [];
		if (a(t))
			for (r = 0; r < t.length; r++) n = e(t[r], r), null != n && o.push(n);
		else
			for (i in t) n = e(t[i], i), null != n && o.push(n);
		return u(o)
	}, j.each = function(t, e) {
		var n, r;
		if (a(t)) {
			for (n = 0; n < t.length; n++)
				if (e.call(t[n], n, t[n]) === !1) return t
		} else
			for (r in t)
				if (e.call(t[r], r, t[r]) === !1) return t;
		return t
	}, j.grep = function(t, e) {
		return A.call(t, e)
	}, window.JSON && (j.parseJSON = JSON.parse), j.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(t, e) {
		B["[object " + e + "]"] = e.toLowerCase()
	}), j.fn = {
		constructor: J.Z,
		length: 0,
		forEach: P.forEach,
		reduce: P.reduce,
		push: P.push,
		sort: P.sort,
		splice: P.splice,
		indexOf: P.indexOf,
		concat: function() {
			var t, e, n = [];
			for (t = 0; t < arguments.length; t++) e = arguments[t], n[t] = J.isZ(e) ? e.toArray() : e;
			return O.apply(J.isZ(this) ? this.toArray() : this, n)
		},
		map: function(t) {
			return j(j.map(this, function(e, n) {
				return t.call(e, n, e)
			}))
		},
		slice: function() {
			return j(D.apply(this, arguments))
		},
		ready: function(t) {
			return X.test(M.readyState) && M.body ? t(j) : M.addEventListener("DOMContentLoaded", function() {
				t(j)
			}, !1), this
		},
		get: function(t) {
			return t === E ? D.call(this) : this[t >= 0 ? t : t + this.length]
		},
		toArray: function() {
			return this.get()
		},
		size: function() {
			return this.length
		},
		remove: function() {
			return this.each(function() {
				null != this.parentNode && this.parentNode.removeChild(this)
			})
		},
		each: function(t) {
			return P.every.call(this, function(e, n) {
				return t.call(e, n, e) !== !1
			}), this
		},
		filter: function(t) {
			return e(t) ? this.not(this.not(t)) : j(A.call(this, function(e) {
				return J.matches(e, t)
			}))
		},
		add: function(t, e) {
			return j(N(this.concat(j(t, e))))
		},
		is: function(t) {
			return this.length > 0 && J.matches(this[0], t)
		},
		not: function(t) {
			var n = [];
			if (e(t) && t.call !== E) this.each(function(e) {
				t.call(this, e) || n.push(this)
			});
			else {
				var r = "string" == typeof t ? this.filter(t) : a(t) && e(t.item) ? D.call(t) : j(t);
				this.forEach(function(t) {
					r.indexOf(t) < 0 && n.push(t)
				})
			}
			return j(n)
		},
		has: function(t) {
			return this.filter(function() {
				return i(t) ? j.contains(this, t) : j(this).find(t).size()
			})
		},
		eq: function(t) {
			return -1 === t ? this.slice(t) : this.slice(t, +t + 1)
		},
		first: function() {
			var t = this[0];
			return t && !i(t) ? t : j(t)
		},
		last: function() {
			var t = this[this.length - 1];
			return t && !i(t) ? t : j(t)
		},
		find: function(t) {
			var e, n = this;
			return e = t ? "object" == typeof t ? j(t).filter(function() {
				var t = this;
				return P.some.call(n, function(e) {
					return j.contains(e, t)
				})
			}) : 1 == this.length ? j(J.qsa(this[0], t)) : this.map(function() {
				return J.qsa(this, t)
			}) : j()
		},
		closest: function(t, e) {
			var n = [],
				i = "object" == typeof t && j(t);
			return this.each(function(o, a) {
				for (; a && !(i ? i.indexOf(a) >= 0 : J.matches(a, t));) a = a !== e && !r(a) && a.parentNode;
				a && n.indexOf(a) < 0 && n.push(a)
			}), j(n)
		},
		parents: function(t) {
			for (var e = [], n = this; n.length > 0;) n = j.map(n, function(t) {
				return (t = t.parentNode) && !r(t) && e.indexOf(t) < 0 ? (e.push(t), t) : void 0
			});
			return g(e, t)
		},
		parent: function(t) {
			return g(N(this.pluck("parentNode")), t)
		},
		children: function(t) {
			return g(this.map(function() {
				return p(this)
			}), t)
		},
		contents: function() {
			return this.map(function() {
				return this.contentDocument || D.call(this.childNodes)
			})
		},
		siblings: function(t) {
			return g(this.map(function(t, e) {
				return A.call(p(e.parentNode), function(t) {
					return t !== e
				})
			}), t)
		},
		empty: function() {
			return this.each(function() {
				this.innerHTML = ""
			})
		},
		pluck: function(t) {
			return j.map(this, function(e) {
				return e[t]
			})
		},
		show: function() {
			return this.each(function() {
				"none" == this.style.display && (this.style.display = ""), "none" == getComputedStyle(this, "").getPropertyValue("display") && (this.style.display = h(this.nodeName))
			})
		},
		replaceWith: function(t) {
			return this.before(t).remove()
		},
		wrap: function(t) {
			var n = e(t);
			if (this[0] && !n) var r = j(t).get(0),
				i = r.parentNode || this.length > 1;
			return this.each(function(e) {
				j(this).wrapAll(n ? t.call(this, e) : i ? r.cloneNode(!0) : r)
			})
		},
		wrapAll: function(t) {
			if (this[0]) {
				j(this[0]).before(t = j(t));
				for (var e;
					(e = t.children()).length;) t = e.first();
				j(t).append(this)
			}
			return this
		},
		wrapInner: function(t) {
			var n = e(t);
			return this.each(function(e) {
				var r = j(this),
					i = r.contents(),
					o = n ? t.call(this, e) : t;
				i.length ? i.wrapAll(o) : r.append(o)
			})
		},
		unwrap: function() {
			return this.parent().each(function() {
				j(this).replaceWith(j(this).children())
			}), this
		},
		clone: function() {
			return this.map(function() {
				return this.cloneNode(!0)
			})
		},
		hide: function() {
			return this.css("display", "none")
		},
		toggle: function(t) {
			return this.each(function() {
				var e = j(this);
				(t === E ? "none" == e.css("display") : t) ? e.show(): e.hide()
			})
		},
		prev: function(t) {
			return j(this.pluck("previousElementSibling")).filter(t || "*")
		},
		next: function(t) {
			return j(this.pluck("nextElementSibling")).filter(t || "*")
		},
		html: function(t) {
			return 0 in arguments ? this.each(function(e) {
				var n = this.innerHTML;
				j(this).empty().append(v(this, t, e, n))
			}) : 0 in this ? this[0].innerHTML : null
		},
		text: function(t) {
			return 0 in arguments ? this.each(function(e) {
				var n = v(this, t, e, this.textContent);
				this.textContent = null == n ? "" : "" + n
			}) : 0 in this ? this.pluck("textContent").join("") : null
		},
		attr: function(t, e) {
			var n;
			return "string" != typeof t || 1 in arguments ? this.each(function(n) {
				if (1 === this.nodeType)
					if (i(t))
						for (T in t) y(this, T, t[T]);
					else y(this, t, v(this, e, n, this.getAttribute(t)))
			}) : 0 in this && 1 == this[0].nodeType && null != (n = this[0].getAttribute(t)) ? n : E
		},
		removeAttr: function(t) {
			return this.each(function() {
				1 === this.nodeType && t.split(" ").forEach(function(t) {
					y(this, t)
				}, this)
			})
		},
		prop: function(t, e) {
			return t = K[t] || t, 1 in arguments ? this.each(function(n) {
				this[t] = v(this, e, n, this[t])
			}) : this[0] && this[0][t]
		},
		removeProp: function(t) {
			return t = K[t] || t, this.each(function() {
				delete this[t]
			})
		},
		data: function(t, e) {
			var n = "data-" + t.replace(q, "-$1").toLowerCase(),
				r = 1 in arguments ? this.attr(n, e) : this.attr(n);
			return null !== r ? w(r) : E
		},
		val: function(t) {
			return 0 in arguments ? (null == t && (t = ""), this.each(function(e) {
				this.value = v(this, t, e, this.value)
			})) : this[0] && (this[0].multiple ? j(this[0]).find("option").filter(function() {
				return this.selected
			}).pluck("value") : this[0].value)
		},
		offset: function(t) {
			if (t) return this.each(function(e) {
				var n = j(this),
					r = v(this, t, e, n.offset()),
					i = n.offsetParent().offset(),
					o = {
						top: r.top - i.top,
						left: r.left - i.left
					};
				"static" == n.css("position") && (o.position = "relative"), n.css(o)
			});
			if (!this.length) return null;
			if (M.documentElement !== this[0] && !j.contains(M.documentElement, this[0])) return {
				top: 0,
				left: 0
			};
			var e = this[0].getBoundingClientRect();
			return {
				left: e.left + window.pageXOffset,
				top: e.top + window.pageYOffset,
				width: Math.round(e.width),
				height: Math.round(e.height)
			}
		},
		css: function(e, n) {
			if (arguments.length < 2) {
				var r = this[0];
				if ("string" == typeof e) {
					if (!r) return;
					return r.style[C(e)] || getComputedStyle(r, "").getPropertyValue(e)
				}
				if (Q(e)) {
					if (!r) return;
					var i = {},
						o = getComputedStyle(r, "");
					return j.each(e, function(t, e) {
						i[e] = r.style[C(e)] || o.getPropertyValue(e)
					}), i
				}
			}
			var a = "";
			if ("string" == t(e)) n || 0 === n ? a = c(e) + ":" + f(e, n) : this.each(function() {
				this.style.removeProperty(c(e))
			});
			else
				for (T in e) e[T] || 0 === e[T] ? a += c(T) + ":" + f(T, e[T]) + ";" : this.each(function() {
					this.style.removeProperty(c(T))
				});
			return this.each(function() {
				this.style.cssText += ";" + a
			})
		},
		index: function(t) {
			return t ? this.indexOf(j(t)[0]) : this.parent().children().indexOf(this[0])
		},
		hasClass: function(t) {
			return t ? P.some.call(this, function(t) {
				return this.test(b(t))
			}, l(t)) : !1
		},
		addClass: function(t) {
			return t ? this.each(function(e) {
				if ("className" in this) {
					S = [];
					var n = b(this),
						r = v(this, t, e, n);
					r.split(/\s+/g).forEach(function(t) {
						j(this).hasClass(t) || S.push(t)
					}, this), S.length && b(this, n + (n ? " " : "") + S.join(" "))
				}
			}) : this
		},
		removeClass: function(t) {
			return this.each(function(e) {
				if ("className" in this) {
					if (t === E) return b(this, "");
					S = b(this), v(this, t, e, S).split(/\s+/g).forEach(function(t) {
						S = S.replace(l(t), " ")
					}), b(this, S.trim())
				}
			})
		},
		toggleClass: function(t, e) {
			return t ? this.each(function(n) {
				var r = j(this),
					i = v(this, t, n, b(this));
				i.split(/\s+/g).forEach(function(t) {
					(e === E ? !r.hasClass(t) : e) ? r.addClass(t): r.removeClass(t)
				})
			}) : this
		},
		scrollTop: function(t) {
			if (this.length) {
				var e = "scrollTop" in this[0];
				return t === E ? e ? this[0].scrollTop : this[0].pageYOffset : this.each(e ? function() {
					this.scrollTop = t
				} : function() {
					this.scrollTo(this.scrollX, t)
				})
			}
		},
		scrollLeft: function(t) {
			if (this.length) {
				var e = "scrollLeft" in this[0];
				return t === E ? e ? this[0].scrollLeft : this[0].pageXOffset : this.each(e ? function() {
					this.scrollLeft = t
				} : function() {
					this.scrollTo(t, this.scrollY)
				})
			}
		},
		position: function() {
			if (this.length) {
				var t = this[0],
					e = this.offsetParent(),
					n = this.offset(),
					r = z.test(e[0].nodeName) ? {
						top: 0,
						left: 0
					} : e.offset();
				return n.top -= parseFloat(j(t).css("margin-top")) || 0, n.left -= parseFloat(j(t).css("margin-left")) || 0, r.top += parseFloat(j(e[0]).css("border-top-width")) || 0, r.left += parseFloat(j(e[0]).css("border-left-width")) || 0, {
					top: n.top - r.top,
					left: n.left - r.left
				}
			}
		},
		offsetParent: function() {
			return this.map(function() {
				for (var t = this.offsetParent || M.body; t && !z.test(t.nodeName) && "static" == j(t).css("position");) t = t.offsetParent;
				return t
			})
		}
	}, j.fn.detach = j.fn.remove, ["width", "height"].forEach(function(t) {
		var e = t.replace(/./, function(t) {
			return t[0].toUpperCase()
		});
		j.fn[t] = function(i) {
			var o, a = this[0];
			return i === E ? n(a) ? a["inner" + e] : r(a) ? a.documentElement["scroll" + e] : (o = this.offset()) && o[t] : this.each(function(e) {
				a = j(this), a.css(t, v(this, i, e, a[t]()))
			})
		}
	}), H.forEach(function(e, n) {
		var r = n % 2;
		j.fn[e] = function() {
			var e, i, o = j.map(arguments, function(n) {
					var r = [];
					return e = t(n), "array" == e ? (n.forEach(function(t) {
						return t.nodeType !== E ? r.push(t) : j.zepto.isZ(t) ? r = r.concat(t.get()) : void(r = r.concat(J.fragment(t)))
					}), r) : "object" == e || null == n ? n : J.fragment(n)
				}),
				a = this.length > 1;
			return o.length < 1 ? this : this.each(function(t, e) {
				i = r ? e : e.parentNode, e = 0 == n ? e.nextSibling : 1 == n ? e.firstChild : 2 == n ? e : null;
				var s = j.contains(M.documentElement, i);
				o.forEach(function(t) {
					if (a) t = t.cloneNode(!0);
					else if (!i) return j(t).remove();
					i.insertBefore(t, e), s && x(t, function(t) {
						if (!(null == t.nodeName || "SCRIPT" !== t.nodeName.toUpperCase() || t.type && "text/javascript" !== t.type || t.src)) {
							var e = t.ownerDocument ? t.ownerDocument.defaultView : window;
							e.eval.call(e, t.innerHTML)
						}
					})
				})
			})
		}, j.fn[r ? e + "To" : "insert" + (n ? "Before" : "After")] = function(t) {
			return j(t)[e](this), this
		}
	}), J.Z.prototype = d.prototype = j.fn, J.uniq = N, J.deserializeValue = w, j.zepto = J, j
}();
window.Zepto = Zepto, void 0 === window.$ && (window.$ = Zepto),
	function(t) {
		function e(e, n, r) {
			var i = t.Event(n);
			return t(e).trigger(i, r), !i.isDefaultPrevented()
		}

		function n(t, n, r, i) {
			return t.global ? e(n || b, r, i) : void 0
		}

		function r(e) {
			e.global && 0 === t.active++ && n(e, null, "ajaxStart")
		}

		function i(e) {
			e.global && !--t.active && n(e, null, "ajaxStop")
		}

		function o(t, e) {
			var r = e.context;
			return e.beforeSend.call(r, t, e) === !1 || n(e, r, "ajaxBeforeSend", [t, e]) === !1 ? !1 : void n(e, r, "ajaxSend", [t, e])
		}

		function a(t, e, r, i) {
			var o = r.context,
				a = "success";
			r.success.call(o, t, a, e), i && i.resolveWith(o, [t, a, e]), n(r, o, "ajaxSuccess", [e, r, t]), u(a, e, r)
		}

		function s(t, e, r, i, o) {
			var a = i.context;
			i.error.call(a, r, e, t), o && o.rejectWith(a, [r, e, t]), n(i, a, "ajaxError", [r, i, t || e]), u(e, r, i)
		}

		function u(t, e, r) {
			var o = r.context;
			r.complete.call(o, e, t), n(r, o, "ajaxComplete", [e, r]), i(r)
		}

		function c(t, e, n) {
			if (n.dataFilter == l) return t;
			var r = n.context;
			return n.dataFilter.call(r, t, e)
		}

		function l() {}

		function f(t) {
			return t && (t = t.split(";", 2)[0]), t && (t == j ? "html" : t == T ? "json" : x.test(t) ? "script" : E.test(t) && "xml") || "text"
		}

		function h(t, e) {
			return "" == e ? t : (t + "&" + e).replace(/[&?]{1,2}/, "?")
		}

		function p(e) {
			e.processData && e.data && "string" != t.type(e.data) && (e.data = t.param(e.data, e.traditional)), !e.data || e.type && "GET" != e.type.toUpperCase() && "jsonp" != e.dataType || (e.url = h(e.url, e.data), e.data = void 0)
		}

		function d(e, n, r, i) {
			return t.isFunction(n) && (i = r, r = n, n = void 0), t.isFunction(r) || (i = r, r = void 0), {
				url: e,
				data: n,
				success: r,
				dataType: i
			}
		}

		function m(e, n, r, i) {
			var o, a = t.isArray(n),
				s = t.isPlainObject(n);
			t.each(n, function(n, u) {
				o = t.type(u), i && (n = r ? i : i + "[" + (s || "object" == o || "array" == o ? n : "") + "]"), !i && a ? e.add(u.name, u.value) : "array" == o || !r && "object" == o ? m(e, u, r, n) : e.add(n, u)
			})
		}
		var g, v, y = +new Date,
			b = window.document,
			w = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
			x = /^(?:text|application)\/javascript/i,
			E = /^(?:text|application)\/xml/i,
			T = "application/json",
			j = "text/html",
			S = /^\s*$/,
			C = b.createElement("a");
		C.href = window.location.href, t.active = 0, t.ajaxJSONP = function(e, n) {
			if (!("type" in e)) return t.ajax(e);
			var r, i, u = e.jsonpCallback,
				c = (t.isFunction(u) ? u() : u) || "Zepto" + y++,
				l = b.createElement("script"),
				f = window[c],
				h = function(e) {
					t(l).triggerHandler("error", e || "abort")
				},
				p = {
					abort: h
				};
			return n && n.promise(p), t(l).on("load error", function(o, u) {
				clearTimeout(i), t(l).off().remove(), "error" != o.type && r ? a(r[0], p, e, n) : s(null, u || "error", p, e, n), window[c] = f, r && t.isFunction(f) && f(r[0]), f = r = void 0
			}), o(p, e) === !1 ? (h("abort"), p) : (window[c] = function() {
				r = arguments
			}, l.src = e.url.replace(/\?(.+)=\?/, "?$1=" + c), b.head.appendChild(l), e.timeout > 0 && (i = setTimeout(function() {
				h("timeout")
			}, e.timeout)), p)
		}, t.ajaxSettings = {
			type: "GET",
			beforeSend: l,
			success: l,
			error: l,
			complete: l,
			context: null,
			global: !0,
			xhr: function() {
				return new window.XMLHttpRequest
			},
			accepts: {
				script: "text/javascript, application/javascript, application/x-javascript",
				json: T,
				xml: "application/xml, text/xml",
				html: j,
				text: "text/plain"
			},
			crossDomain: !1,
			timeout: 0,
			processData: !0,
			cache: !0,
			dataFilter: l
		}, t.ajax = function(e) {
			var n, i, u = t.extend({}, e || {}),
				d = t.Deferred && t.Deferred();
			for (g in t.ajaxSettings) void 0 === u[g] && (u[g] = t.ajaxSettings[g]);
			r(u), u.crossDomain || (n = b.createElement("a"), n.href = u.url, n.href = n.href, u.crossDomain = C.protocol + "//" + C.host != n.protocol + "//" + n.host), u.url || (u.url = window.location.toString()), (i = u.url.indexOf("#")) > -1 && (u.url = u.url.slice(0, i)), p(u);
			var m = u.dataType,
				y = /\?.+=\?/.test(u.url);
			if (y && (m = "jsonp"), u.cache !== !1 && (e && e.cache === !0 || "script" != m && "jsonp" != m) || (u.url = h(u.url, "_=" + Date.now())), "jsonp" == m) return y || (u.url = h(u.url, u.jsonp ? u.jsonp + "=?" : u.jsonp === !1 ? "" : "callback=?")), t.ajaxJSONP(u, d);
			var w, x = u.accepts[m],
				E = {},
				T = function(t, e) {
					E[t.toLowerCase()] = [t, e]
				},
				j = /^([\w-]+:)\/\//.test(u.url) ? RegExp.$1 : window.location.protocol,
				N = u.xhr(),
				P = N.setRequestHeader;
			if (d && d.promise(N), u.crossDomain || T("X-Requested-With", "XMLHttpRequest"), T("Accept", x || "*/*"), (x = u.mimeType || x) && (x.indexOf(",") > -1 && (x = x.split(",", 2)[0]), N.overrideMimeType && N.overrideMimeType(x)), (u.contentType || u.contentType !== !1 && u.data && "GET" != u.type.toUpperCase()) && T("Content-Type", u.contentType || "application/x-www-form-urlencoded"), u.headers)
				for (v in u.headers) T(v, u.headers[v]);
			if (N.setRequestHeader = T, N.onreadystatechange = function() {
					if (4 == N.readyState) {
						N.onreadystatechange = l, clearTimeout(w);
						var e, n = !1;
						if (N.status >= 200 && N.status < 300 || 304 == N.status || 0 == N.status && "file:" == j) {
							if (m = m || f(u.mimeType || N.getResponseHeader("content-type")), "arraybuffer" == N.responseType || "blob" == N.responseType) e = N.response;
							else {
								e = N.responseText;
								try {
									e = c(e, m, u), "script" == m ? (1, eval)(e) : "xml" == m ? e = N.responseXML : "json" == m && (e = S.test(e) ? null : t.parseJSON(e))
								} catch (r) {
									n = r
								}
								if (n) return s(n, "parsererror", N, u, d)
							}
							a(e, N, u, d)
						} else s(N.statusText || null, N.status ? "error" : "abort", N, u, d)
					}
				}, o(N, u) === !1) return N.abort(), s(null, "abort", N, u, d), N;
			var O = "async" in u ? u.async : !0;
			if (N.open(u.type, u.url, O, u.username, u.password), u.xhrFields)
				for (v in u.xhrFields) N[v] = u.xhrFields[v];
			for (v in E) P.apply(N, E[v]);
			return u.timeout > 0 && (w = setTimeout(function() {
				N.onreadystatechange = l, N.abort(), s(null, "timeout", N, u, d)
			}, u.timeout)), N.send(u.data ? u.data : null), N
		}, t.get = function() {
			return t.ajax(d.apply(null, arguments))
		}, t.post = function() {
			var e = d.apply(null, arguments);
			return e.type = "POST", t.ajax(e)
		}, t.getJSON = function() {
			var e = d.apply(null, arguments);
			return e.dataType = "json", t.ajax(e)
		}, t.fn.load = function(e, n, r) {
			if (!this.length) return this;
			var i, o = this,
				a = e.split(/\s/),
				s = d(e, n, r),
				u = s.success;
			return a.length > 1 && (s.url = a[0], i = a[1]), s.success = function(e) {
				o.html(i ? t("<div>").html(e.replace(w, "")).find(i) : e), u && u.apply(o, arguments)
			}, t.ajax(s), this
		};
		var N = encodeURIComponent;
		t.param = function(e, n) {
			var r = [];
			return r.add = function(e, n) {
				t.isFunction(n) && (n = n()), null == n && (n = ""), this.push(N(e) + "=" + N(n))
			}, m(r, e, n), r.join("&").replace(/%20/g, "+")
		}
	}(Zepto),
	function(t) {
		t.Callbacks = function(e) {
			e = t.extend({}, e);
			var n, r, i, o, a, s, u = [],
				c = !e.once && [],
				l = function(t) {
					for (n = e.memory && t, r = !0, s = o || 0, o = 0, a = u.length, i = !0; u && a > s; ++s)
						if (u[s].apply(t[0], t[1]) === !1 && e.stopOnFalse) {
							n = !1;
							break
						}
					i = !1, u && (c ? c.length && l(c.shift()) : n ? u.length = 0 : f.disable())
				},
				f = {
					add: function() {
						if (u) {
							var r = u.length,
								s = function(n) {
									t.each(n, function(t, n) {
										"function" == typeof n ? e.unique && f.has(n) || u.push(n) : n && n.length && "string" != typeof n && s(n)
									})
								};
							s(arguments), i ? a = u.length : n && (o = r, l(n))
						}
						return this
					},
					remove: function() {
						return u && t.each(arguments, function(e, n) {
							for (var r;
								(r = t.inArray(n, u, r)) > -1;) u.splice(r, 1), i && (a >= r && --a, s >= r && --s)
						}), this
					},
					has: function(e) {
						return !(!u || !(e ? t.inArray(e, u) > -1 : u.length))
					},
					empty: function() {
						return a = u.length = 0, this
					},
					disable: function() {
						return u = c = n = void 0, this
					},
					disabled: function() {
						return !u
					},
					lock: function() {
						return c = void 0, n || f.disable(), this
					},
					locked: function() {
						return !c
					},
					fireWith: function(t, e) {
						return !u || r && !c || (e = e || [], e = [t, e.slice ? e.slice() : e], i ? c.push(e) : l(e)), this
					},
					fire: function() {
						return f.fireWith(this, arguments)
					},
					fired: function() {
						return !!r
					}
				};
			return f
		}
	}(Zepto),
	function(t) {
		function e(n) {
			var r = [
					["resolve", "done", t.Callbacks({
						once: 1,
						memory: 1
					}), "resolved"],
					["reject", "fail", t.Callbacks({
						once: 1,
						memory: 1
					}), "rejected"],
					["notify", "progress", t.Callbacks({
						memory: 1
					})]
				],
				i = "pending",
				o = {
					state: function() {
						return i
					},
					always: function() {
						return a.done(arguments).fail(arguments), this
					},
					then: function() {
						var n = arguments;
						return e(function(e) {
							t.each(r, function(r, i) {
								var s = t.isFunction(n[r]) && n[r];
								a[i[1]](function() {
									var n = s && s.apply(this, arguments);
									if (n && t.isFunction(n.promise)) n.promise().done(e.resolve).fail(e.reject).progress(e.notify);
									else {
										var r = this === o ? e.promise() : this,
											a = s ? [n] : arguments;
										e[i[0] + "With"](r, a)
									}
								})
							}), n = null
						}).promise()
					},
					promise: function(e) {
						return null != e ? t.extend(e, o) : o
					}
				},
				a = {};
			return t.each(r, function(t, e) {
				var n = e[2],
					s = e[3];
				o[e[1]] = n.add, s && n.add(function() {
					i = s
				}, r[1 ^ t][2].disable, r[2][2].lock), a[e[0]] = function() {
					return a[e[0] + "With"](this === a ? o : this, arguments), this
				}, a[e[0] + "With"] = n.fireWith
			}), o.promise(a), n && n.call(a, a), a
		}
		var n = Array.prototype.slice;
		t.when = function(r) {
			var i, o, a, s = n.call(arguments),
				u = s.length,
				c = 0,
				l = 1 !== u || r && t.isFunction(r.promise) ? u : 0,
				f = 1 === l ? r : e(),
				h = function(t, e, r) {
					return function(o) {
						e[t] = this, r[t] = arguments.length > 1 ? n.call(arguments) : o, r === i ? f.notifyWith(e, r) : --l || f.resolveWith(e, r)
					}
				};
			if (u > 1)
				for (i = new Array(u), o = new Array(u), a = new Array(u); u > c; ++c) s[c] && t.isFunction(s[c].promise) ? s[c].promise().done(h(c, a, s)).fail(f.reject).progress(h(c, o, i)) : --l;
			return l || f.resolveWith(a, s), f.promise()
		}, t.Deferred = e
	}(Zepto),
	function(t) {
		function e(t) {
			return t._zid || (t._zid = h++)
		}

		function n(t, n, o, a) {
			if (n = r(n), n.ns) var s = i(n.ns);
			return (g[e(t)] || []).filter(function(t) {
				return t && (!n.e || t.e == n.e) && (!n.ns || s.test(t.ns)) && (!o || e(t.fn) === e(o)) && (!a || t.sel == a)
			})
		}

		function r(t) {
			var e = ("" + t).split(".");
			return {
				e: e[0],
				ns: e.slice(1).sort().join(" ")
			}
		}

		function i(t) {
			return new RegExp("(?:^| )" + t.replace(" ", " .* ?") + "(?: |$)")
		}

		function o(t, e) {
			return t.del && !y && t.e in b || !!e
		}

		function a(t) {
			return w[t] || y && b[t] || t
		}

		function s(n, i, s, u, l, h, p) {
			var d = e(n),
				m = g[d] || (g[d] = []);
			i.split(/\s/).forEach(function(e) {
				if ("ready" == e) return t(document).ready(s);
				var i = r(e);
				i.fn = s, i.sel = l, i.e in w && (s = function(e) {
					var n = e.relatedTarget;
					return !n || n !== this && !t.contains(this, n) ? i.fn.apply(this, arguments) : void 0
				}), i.del = h;
				var d = h || s;
				i.proxy = function(t) {
					if (t = c(t), !t.isImmediatePropagationStopped()) {
						t.data = u;
						var e = d.apply(n, t._args == f ? [t] : [t].concat(t._args));
						return e === !1 && (t.preventDefault(), t.stopPropagation()), e
					}
				}, i.i = m.length, m.push(i), "addEventListener" in n && n.addEventListener(a(i.e), i.proxy, o(i, p))
			})
		}

		function u(t, r, i, s, u) {
			var c = e(t);
			(r || "").split(/\s/).forEach(function(e) {
				n(t, e, i, s).forEach(function(e) {
					delete g[c][e.i], "removeEventListener" in t && t.removeEventListener(a(e.e), e.proxy, o(e, u))
				})
			})
		}

		function c(e, n) {
			if (n || !e.isDefaultPrevented) {
				n || (n = e), t.each(j, function(t, r) {
					var i = n[t];
					e[t] = function() {
						return this[r] = x, i && i.apply(n, arguments)
					}, e[r] = E
				});
				try {
					e.timeStamp || (e.timeStamp = Date.now())
				} catch (r) {}(n.defaultPrevented !== f ? n.defaultPrevented : "returnValue" in n ? n.returnValue === !1 : n.getPreventDefault && n.getPreventDefault()) && (e.isDefaultPrevented = x)
			}
			return e
		}

		function l(t) {
			var e, n = {
				originalEvent: t
			};
			for (e in t) T.test(e) || t[e] === f || (n[e] = t[e]);
			return c(n, t)
		}
		var f, h = 1,
			p = Array.prototype.slice,
			d = t.isFunction,
			m = function(t) {
				return "string" == typeof t
			},
			g = {},
			v = {},
			y = "onfocusin" in window,
			b = {
				focus: "focusin",
				blur: "focusout"
			},
			w = {
				mouseenter: "mouseover",
				mouseleave: "mouseout"
			};
		v.click = v.mousedown = v.mouseup = v.mousemove = "MouseEvents", t.event = {
			add: s,
			remove: u
		}, t.proxy = function(n, r) {
			var i = 2 in arguments && p.call(arguments, 2);
			if (d(n)) {
				var o = function() {
					return n.apply(r, i ? i.concat(p.call(arguments)) : arguments)
				};
				return o._zid = e(n), o
			}
			if (m(r)) return i ? (i.unshift(n[r], n), t.proxy.apply(null, i)) : t.proxy(n[r], n);
			throw new TypeError("expected function")
		}, t.fn.bind = function(t, e, n) {
			return this.on(t, e, n)
		}, t.fn.unbind = function(t, e) {
			return this.off(t, e)
		}, t.fn.one = function(t, e, n, r) {
			return this.on(t, e, n, r, 1)
		};
		var x = function() {
				return !0
			},
			E = function() {
				return !1
			},
			T = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
			j = {
				preventDefault: "isDefaultPrevented",
				stopImmediatePropagation: "isImmediatePropagationStopped",
				stopPropagation: "isPropagationStopped"
			};
		t.fn.delegate = function(t, e, n) {
			return this.on(e, t, n)
		}, t.fn.undelegate = function(t, e, n) {
			return this.off(e, t, n)
		}, t.fn.live = function(e, n) {
			return t(document.body).delegate(this.selector, e, n), this
		}, t.fn.die = function(e, n) {
			return t(document.body).undelegate(this.selector, e, n), this
		}, t.fn.on = function(e, n, r, i, o) {
			var a, c, h = this;
			return e && !m(e) ? (t.each(e, function(t, e) {
				h.on(t, n, r, e, o)
			}), h) : (m(n) || d(i) || i === !1 || (i = r, r = n, n = f), (i === f || r === !1) && (i = r, r = f), i === !1 && (i = E), h.each(function(f, h) {
				o && (a = function(t) {
					return u(h, t.type, i), i.apply(this, arguments)
				}), n && (c = function(e) {
					var r, o = t(e.target).closest(n, h).get(0);
					return o && o !== h ? (r = t.extend(l(e), {
						currentTarget: o,
						liveFired: h
					}), (a || i).apply(o, [r].concat(p.call(arguments, 1)))) : void 0
				}), s(h, e, i, r, n, c || a)
			}))
		}, t.fn.off = function(e, n, r) {
			var i = this;
			return e && !m(e) ? (t.each(e, function(t, e) {
				i.off(t, n, e)
			}), i) : (m(n) || d(r) || r === !1 || (r = n, n = f), r === !1 && (r = E), i.each(function() {
				u(this, e, r, n)
			}))
		}, t.fn.trigger = function(e, n) {
			return e = m(e) || t.isPlainObject(e) ? t.Event(e) : c(e), e._args = n, this.each(function() {
				e.type in b && "function" == typeof this[e.type] ? this[e.type]() : "dispatchEvent" in this ? this.dispatchEvent(e) : t(this).triggerHandler(e, n)
			})
		}, t.fn.triggerHandler = function(e, r) {
			var i, o;
			return this.each(function(a, s) {
				i = l(m(e) ? t.Event(e) : e), i._args = r, i.target = s, t.each(n(s, e.type || e), function(t, e) {
					return o = e.proxy(i), i.isImmediatePropagationStopped() ? !1 : void 0
				})
			}), o
		}, "focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(e) {
			t.fn[e] = function(t) {
				return 0 in arguments ? this.bind(e, t) : this.trigger(e)
			}
		}), t.Event = function(t, e) {
			m(t) || (e = t, t = e.type);
			var n = document.createEvent(v[t] || "Events"),
				r = !0;
			if (e)
				for (var i in e) "bubbles" == i ? r = !!e[i] : n[i] = e[i];
			return n.initEvent(t, r, !0), c(n)
		}
	}(Zepto),
	function(t) {
		t.fn.serializeArray = function() {
			var e, n, r = [],
				i = function(t) {
					return t.forEach ? t.forEach(i) : void r.push({
						name: e,
						value: t
					})
				};
			return this[0] && t.each(this[0].elements, function(r, o) {
				n = o.type, e = o.name, e && "fieldset" != o.nodeName.toLowerCase() && !o.disabled && "submit" != n && "reset" != n && "button" != n && "file" != n && ("radio" != n && "checkbox" != n || o.checked) && i(t(o).val())
			}), r
		}, t.fn.serialize = function() {
			var t = [];
			return this.serializeArray().forEach(function(e) {
				t.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value))
			}), t.join("&")
		}, t.fn.submit = function(e) {
			if (0 in arguments) this.bind("submit", e);
			else if (this.length) {
				var n = t.Event("submit");
				this.eq(0).trigger(n), n.isDefaultPrevented() || this.get(0).submit()
			}
			return this
		}
	}(Zepto),
	function() {
		try {
			getComputedStyle(void 0)
		} catch (t) {
			var e = getComputedStyle;
			window.getComputedStyle = function(t, n) {
				try {
					return e(t, n)
				} catch (r) {
					return null
				}
			}
		}
	}(),
	function(t) {
		function e(t, e, n, r) {
			return Math.abs(t - e) >= Math.abs(n - r) ? t - e > 0 ? "Left" : "Right" : n - r > 0 ? "Up" : "Down"
		}

		function n() {
			l = null, h.last && (h.el.trigger("longTap"), h = {})
		}

		function r() {
			l && clearTimeout(l), l = null
		}

		function i() {
			s && clearTimeout(s), u && clearTimeout(u), c && clearTimeout(c), l && clearTimeout(l), s = u = c = l = null, h = {}
		}

		function o(t) {
			return ("touch" == t.pointerType || t.pointerType == t.MSPOINTER_TYPE_TOUCH) && t.isPrimary
		}

		function a(t, e) {
			return t.type == "pointer" + e || t.type.toLowerCase() == "mspointer" + e
		}
		var s, u, c, l, f, h = {},
			p = 750;
		t(document).ready(function() {
			var d, m, g, v, y = 0,
				b = 0;
			"MSGesture" in window && (f = new MSGesture, f.target = document.body), t(document).bind("MSGestureEnd", function(t) {
				var e = t.velocityX > 1 ? "Right" : t.velocityX < -1 ? "Left" : t.velocityY > 1 ? "Down" : t.velocityY < -1 ? "Up" : null;
				e && (h.el.trigger("swipe"), h.el.trigger("swipe" + e))
			}).on("touchstart MSPointerDown pointerdown", function(e) {
				(!(v = a(e, "down")) || o(e)) && (g = v ? e : e.touches[0], e.touches && 1 === e.touches.length && h.x2 && (h.x2 = void 0, h.y2 = void 0), d = Date.now(), m = d - (h.last || d), h.el = t("tagName" in g.target ? g.target : g.target.parentNode), s && clearTimeout(s), h.x1 = g.pageX, h.y1 = g.pageY, m > 0 && 250 >= m && (h.isDoubleTap = !0), h.last = d, l = setTimeout(n, p), f && v && f.addPointer(e.pointerId))
			}).on("touchmove MSPointerMove pointermove", function(t) {
				(!(v = a(t, "move")) || o(t)) && (g = v ? t : t.touches[0], r(), h.x2 = g.pageX, h.y2 = g.pageY, y += Math.abs(h.x1 - h.x2), b += Math.abs(h.y1 - h.y2))
			}).on("touchend MSPointerUp pointerup", function(n) {
				(!(v = a(n, "up")) || o(n)) && (r(), h.x2 && Math.abs(h.x1 - h.x2) > 30 || h.y2 && Math.abs(h.y1 - h.y2) > 30 ? c = setTimeout(function() {
					h.el && (h.el.trigger("swipe"), h.el.trigger("swipe" + e(h.x1, h.x2, h.y1, h.y2))), h = {}
				}, 0) : "last" in h && (30 > y && 30 > b ? u = setTimeout(function() {
					var e = t.Event("tap");
					e.cancelTouch = i, h.el && h.el.trigger(e), h.isDoubleTap ? (h.el && h.el.trigger("doubleTap"), h = {}) : s = setTimeout(function() {
						s = null, h.el && h.el.trigger("singleTap"), h = {}
					}, 250)
				}, 0) : h = {}), y = b = 0)
			}).on("touchcancel MSPointerCancel pointercancel", i), t(window).on("scroll", i)
		}), ["swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "singleTap", "longTap"].forEach(function(e) {
			t.fn[e] = function(t) {
				return this.on(e, t)
			}
		})
	}(Zepto);

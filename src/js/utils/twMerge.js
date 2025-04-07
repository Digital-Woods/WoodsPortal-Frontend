const CLASS_PART_SEPARATOR = "-";

function createClassGroupUtils(e) {
    const r = createClassMap(e),
        {
            conflictingClassGroups: t,
            conflictingClassGroupModifiers: o
        } = e;
    return {
        getClassGroupId: function(e) {
            const t = e.split(CLASS_PART_SEPARATOR);
            return "" === t[0] && 1 !== t.length && t.shift(), getGroupRecursive(t, r) || getGroupIdForArbitraryProperty(e)
        },
        getConflictingClassGroupIds: function(e, r) {
            const i = t[e] || [];
            return r && o[e] ? [...i, ...o[e]] : i
        }
    }
}

function getGroupRecursive(e, r) {
    if (0 === e.length) return r.classGroupId;
    const t = e[0],
        o = r.nextPart.get(t),
        i = o ? getGroupRecursive(e.slice(1), o) : void 0;
    if (i) return i;
    if (0 === r.validators.length) return;
    const n = e.join(CLASS_PART_SEPARATOR);
    return r.validators.find((({
        validator: e
    }) => e(n)))?.classGroupId
}
const arbitraryPropertyRegex = /^\[(.+)\]$/;

function getGroupIdForArbitraryProperty(e) {
    if (arbitraryPropertyRegex.test(e)) {
        const r = arbitraryPropertyRegex.exec(e)[1],
            t = r?.substring(0, r.indexOf(":"));
        if (t) return "arbitrary.." + t
    }
}

function createClassMap(e) {
    const {
        theme: r,
        prefix: t
    } = e, o = {
        nextPart: new Map,
        validators: []
    };
    return getPrefixedClassGroupEntries(Object.entries(e.classGroups), t).forEach((([e, t]) => {
        processClassesRecursively(t, o, e, r)
    })), o
}

function processClassesRecursively(e, r, t, o) {
    e.forEach((e => {
        if ("string" != typeof e) {
            if ("function" == typeof e) return isThemeGetter(e) ? void processClassesRecursively(e(o), r, t, o) : void r.validators.push({
                validator: e,
                classGroupId: t
            });
            Object.entries(e).forEach((([e, i]) => {
                processClassesRecursively(i, getPart(r, e), t, o)
            }))
        } else {
            ("" === e ? r : getPart(r, e)).classGroupId = t
        }
    }))
}

function getPart(e, r) {
    let t = e;
    return r.split(CLASS_PART_SEPARATOR).forEach((e => {
        t.nextPart.has(e) || t.nextPart.set(e, {
            nextPart: new Map,
            validators: []
        }), t = t.nextPart.get(e)
    })), t
}

function isThemeGetter(e) {
    return e.isThemeGetter
}

function getPrefixedClassGroupEntries(e, r) {
    return r ? e.map((([e, t]) => [e, t.map((e => "string" == typeof e ? r + e : "object" == typeof e ? Object.fromEntries(Object.entries(e).map((([e, t]) => [r + e, t]))) : e))])) : e
}

function createLruCache(e) {
    if (e < 1) return {
        get: () => {},
        set: () => {}
    };
    let r = 0,
        t = new Map,
        o = new Map;

    function i(i, n) {
        t.set(i, n), r++, r > e && (r = 0, o = t, t = new Map)
    }
    return {
        get(e) {
            let r = t.get(e);
            return void 0 !== r ? r : void 0 !== (r = o.get(e)) ? (i(e, r), r) : void 0
        },
        set(e, r) {
            t.has(e) ? t.set(e, r) : i(e, r)
        }
    }
}
const IMPORTANT_MODIFIER = "!";

function createParseClassName(e) {
    const {
        separator: r,
        experimentalParseClassName: t
    } = e, o = 1 === r.length, i = r[0], n = r.length;

    function s(e) {
        const t = [];
        let s, a = 0,
            l = 0;
        for (let c = 0; c < e.length; c++) {
            let d = e[c];
            if (0 === a) {
                if (d === i && (o || e.slice(c, c + n) === r)) {
                    t.push(e.slice(l, c)), l = c + n;
                    continue
                }
                if ("/" === d) {
                    s = c;
                    continue
                }
            }
            "[" === d ? a++ : "]" === d && a--
        }
        const c = 0 === t.length ? e : e.substring(l),
            d = c.startsWith(IMPORTANT_MODIFIER);
        return {
            modifiers: t,
            hasImportantModifier: d,
            baseClassName: d ? c.substring(1) : c,
            maybePostfixModifierPosition: s && s > l ? s - l : void 0
        }
    }
    return t ? function(e) {
        return t({
            className: e,
            parseClassName: s
        })
    } : s
}

function sortModifiers(e) {
    if (e.length <= 1) return e;
    const r = [];
    let t = [];
    return e.forEach((e => {
        "[" === e[0] ? (r.push(...t.sort(), e), t = []) : t.push(e)
    })), r.push(...t.sort()), r
}

function createConfigUtils(e) {
    return {
        cache: createLruCache(e.cacheSize),
        parseClassName: createParseClassName(e),
        ...createClassGroupUtils(e)
    }
}
const SPLIT_CLASSES_REGEX = /\s+/;

function mergeClassList(e, r) {
    const {
        parseClassName: t,
        getClassGroupId: o,
        getConflictingClassGroupIds: i
    } = r, n = new Set;
    return e.trim().split(SPLIT_CLASSES_REGEX).map((e => {
        const {
            modifiers: r,
            hasImportantModifier: i,
            baseClassName: n,
            maybePostfixModifierPosition: s
        } = t(e);
        let a = Boolean(s),
            l = o(a ? n.substring(0, s) : n);
        if (!l) {
            if (!a) return {
                isTailwindClass: !1,
                originalClassName: e
            };
            if (l = o(n), !l) return {
                isTailwindClass: !1,
                originalClassName: e
            };
            a = !1
        }
        const c = sortModifiers(r).join(":");
        return {
            isTailwindClass: !0,
            modifierId: i ? c + IMPORTANT_MODIFIER : c,
            classGroupId: l,
            originalClassName: e,
            hasPostfixModifier: a
        }
    })).reverse().filter((e => {
        if (!e.isTailwindClass) return !0;
        const {
            modifierId: r,
            classGroupId: t,
            hasPostfixModifier: o
        } = e, s = r + t;
        return !n.has(s) && (n.add(s), i(t, o).forEach((e => n.add(r + e))), !0)
    })).reverse().map((e => e.originalClassName)).join(" ")
}

function twJoin() {
    let e, r, t = 0,
        o = "";
    for (; t < arguments.length;)(e = arguments[t++]) && (r = toValue(e)) && (o && (o += " "), o += r);
    return o
}

function toValue(e) {
    if ("string" == typeof e) return e;
    let r, t = "";
    for (let o = 0; o < e.length; o++) e[o] && (r = toValue(e[o])) && (t && (t += " "), t += r);
    return t
}

function createTailwindMerge(e, ...r) {
    let t, o, i, n = function(a) {
        const l = r.reduce(((e, r) => r(e)), e());
        return t = createConfigUtils(l), o = t.cache.get, i = t.cache.set, n = s, s(a)
    };

    function s(e) {
        const r = o(e);
        if (r) return r;
        const n = mergeClassList(e, t);
        return i(e, n), n
    }
    return function() {
        return n(twJoin.apply(null, arguments))
    }
}

function fromTheme(e) {
    const r = r => r[e] || [];
    return r.isThemeGetter = !0, r
}
const arbitraryValueRegex = /^\[(?:([a-z-]+):)?(.+)\]$/i,
    fractionRegex = /^\d+\/\d+$/,
    stringLengths = new Set(["px", "full", "screen"]),
    tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
    lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
    colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/,
    shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
    imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;

function isLength(e) {
    return isNumber(e) || stringLengths.has(e) || fractionRegex.test(e)
}

function isArbitraryLength(e) {
    return getIsArbitraryValue(e, "length", isLengthOnly)
}

function isNumber(e) {
    return Boolean(e) && !Number.isNaN(Number(e))
}

function isArbitraryNumber(e) {
    return getIsArbitraryValue(e, "number", isNumber)
}

function isInteger(e) {
    return Boolean(e) && Number.isInteger(Number(e))
}

function isPercent(e) {
    return e.endsWith("%") && isNumber(e.slice(0, -1))
}

function isArbitraryValue(e) {
    return arbitraryValueRegex.test(e)
}

function isTshirtSize(e) {
    return tshirtUnitRegex.test(e)
}
const sizeLabels = new Set(["length", "size", "percentage"]);

function isArbitrarySize(e) {
    return getIsArbitraryValue(e, sizeLabels, isNever)
}

function isArbitraryPosition(e) {
    return getIsArbitraryValue(e, "position", isNever)
}
const imageLabels = new Set(["image", "url"]);

function isArbitraryImage(e) {
    return getIsArbitraryValue(e, imageLabels, isImage)
}

function isArbitraryShadow(e) {
    return getIsArbitraryValue(e, "", isShadow)
}

function isAny() {
    return !0
}

function getIsArbitraryValue(e, r, t) {
    const o = arbitraryValueRegex.exec(e);
    return !!o && (o[1] ? "string" == typeof r ? o[1] === r : r.has(o[1]) : t(o[2]))
}

function isLengthOnly(e) {
    return lengthUnitRegex.test(e) && !colorFunctionRegex.test(e)
}

function isNever() {
    return !1
}

function isShadow(e) {
    return shadowRegex.test(e)
}

function isImage(e) {
    return imageRegex.test(e)
}
const validators = Object.defineProperty({
    __proto__: null,
    isAny: isAny,
    isArbitraryImage: isArbitraryImage,
    isArbitraryLength: isArbitraryLength,
    isArbitraryNumber: isArbitraryNumber,
    isArbitraryPosition: isArbitraryPosition,
    isArbitraryShadow: isArbitraryShadow,
    isArbitrarySize: isArbitrarySize,
    isArbitraryValue: isArbitraryValue,
    isInteger: isInteger,
    isLength: isLength,
    isNumber: isNumber,
    isPercent: isPercent,
    isTshirtSize: isTshirtSize
}, Symbol.toStringTag, {
    value: "Module"
});

function getDefaultConfig() {
    const e = fromTheme("colors"),
        r = fromTheme("spacing"),
        t = fromTheme("blur"),
        o = fromTheme("brightness"),
        i = fromTheme("borderColor"),
        n = fromTheme("borderRadius"),
        s = fromTheme("borderSpacing"),
        a = fromTheme("borderWidth"),
        l = fromTheme("contrast"),
        c = fromTheme("grayscale"),
        d = fromTheme("hueRotate"),
        u = fromTheme("invert"),
        b = fromTheme("gap"),
        p = fromTheme("gradientColorStops"),
        g = fromTheme("gradientColorStopPositions"),
        m = fromTheme("inset"),
        f = fromTheme("margin"),
        h = fromTheme("opacity"),
        y = fromTheme("padding"),
        x = fromTheme("saturate"),
        v = fromTheme("scale"),
        w = fromTheme("sepia"),
        A = fromTheme("skew"),
        T = fromTheme("space"),
        C = fromTheme("translate"),
        P = () => ["auto", isArbitraryValue, r],
        z = () => [isArbitraryValue, r],
        S = () => ["", isLength, isArbitraryLength],
        V = () => ["auto", isNumber, isArbitraryValue],
        k = () => ["", "0", isArbitraryValue],
        I = () => [isNumber, isArbitraryNumber],
        R = () => [isNumber, isArbitraryValue];
    return {
        cacheSize: 500,
        separator: ":",
        theme: {
            colors: [isAny],
            spacing: [isLength, isArbitraryLength],
            blur: ["none", "", isTshirtSize, isArbitraryValue],
            brightness: I(),
            borderColor: [e],
            borderRadius: ["none", "", "full", isTshirtSize, isArbitraryValue],
            borderSpacing: z(),
            borderWidth: S(),
            contrast: I(),
            grayscale: k(),
            hueRotate: R(),
            invert: k(),
            gap: z(),
            gradientColorStops: [e],
            gradientColorStopPositions: [isPercent, isArbitraryLength],
            inset: P(),
            margin: P(),
            opacity: I(),
            padding: z(),
            saturate: I(),
            scale: I(),
            sepia: k(),
            skew: R(),
            space: z(),
            translate: z()
        },
        classGroups: {
            aspect: [{
                aspect: ["auto", "square", "video", isArbitraryValue]
            }],
            container: ["container"],
            columns: [{
                columns: [isTshirtSize]
            }],
            "break-after": [{
                "break-after": ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"]
            }],
            "break-before": [{
                "break-before": ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"]
            }],
            "break-inside": [{
                "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
            }],
            "box-decoration": [{
                "box-decoration": ["slice", "clone"]
            }],
            box: [{
                box: ["border", "content"]
            }],
            display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
            float: [{
                float: ["right", "left", "none", "start", "end"]
            }],
            clear: [{
                clear: ["left", "right", "both", "none", "start", "end"]
            }],
            isolation: ["isolate", "isolation-auto"],
            "object-fit": [{
                object: ["contain", "cover", "fill", "none", "scale-down"]
            }],
            "object-position": [{
                object: ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top", isArbitraryValue]
            }],
            overflow: [{
                overflow: ["auto", "hidden", "clip", "visible", "scroll"]
            }],
            "overflow-x": [{
                "overflow-x": ["auto", "hidden", "clip", "visible", "scroll"]
            }],
            "overflow-y": [{
                "overflow-y": ["auto", "hidden", "clip", "visible", "scroll"]
            }],
            overscroll: [{
                overscroll: ["auto", "contain", "none"]
            }],
            "overscroll-x": [{
                "overscroll-x": ["auto", "contain", "none"]
            }],
            "overscroll-y": [{
                "overscroll-y": ["auto", "contain", "none"]
            }],
            position: ["static", "fixed", "absolute", "relative", "sticky"],
            inset: [{
                inset: [m]
            }],
            "inset-x": [{
                "inset-x": [m]
            }],
            "inset-y": [{
                "inset-y": [m]
            }],
            start: [{
                start: [m]
            }],
            end: [{
                end: [m]
            }],
            top: [{
                top: [m]
            }],
            right: [{
                right: [m]
            }],
            bottom: [{
                bottom: [m]
            }],
            left: [{
                left: [m]
            }],
            visibility: ["visible", "invisible", "collapse"],
            z: [{
                z: ["auto", isInteger, isArbitraryValue]
            }],
            basis: [{
                basis: P()
            }],
            "flex-direction": [{
                flex: ["row", "row-reverse", "col", "col-reverse"]
            }],
            "flex-wrap": [{
                flex: ["wrap", "wrap-reverse", "nowrap"]
            }],
            flex: [{
                flex: ["1", "auto", "initial", "none", isArbitraryValue]
            }],
            grow: [{
                grow: k()
            }],
            shrink: [{
                shrink: k()
            }],
            order: [{
                order: ["first", "last", "none", isInteger, isArbitraryValue]
            }],
            "grid-cols": [{
                "grid-cols": [isAny]
            }],
            "col-start-end": [{
                col: ["auto", {
                    span: ["full", isInteger, isArbitraryValue]
                }, isArbitraryValue]
            }],
            "col-start": [{
                "col-start": V()
            }],
            "col-end": [{
                "col-end": V()
            }],
            "grid-rows": [{
                "grid-rows": [isAny]
            }],
            "row-start-end": [{
                row: ["auto", {
                    span: [isInteger, isArbitraryValue]
                }, isArbitraryValue]
            }],
            "row-start": [{
                "row-start": V()
            }],
            "row-end": [{
                "row-end": V()
            }],
            "grid-flow": [{
                "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
            }],
            "auto-cols": [{
                "auto-cols": ["auto", "min", "max", "fr", isArbitraryValue]
            }],
            "auto-rows": [{
                "auto-rows": ["auto", "min", "max", "fr", isArbitraryValue]
            }],
            gap: [{
                gap: [b]
            }],
            "gap-x": [{
                "gap-x": [b]
            }],
            "gap-y": [{
                "gap-y": [b]
            }],
            "justify-content": [{
                justify: ["normal", "start", "end", "center", "between", "around", "evenly", "stretch"]
            }],
            "justify-items": [{
                "justify-items": ["start", "end", "center", "stretch"]
            }],
            "justify-self": [{
                "justify-self": ["auto", "start", "end", "center", "stretch"]
            }],
            "align-content": [{
                content: ["normal", "start", "end", "center", "between", "around", "evenly", "stretch", "baseline"]
            }],
            "align-items": [{
                items: ["start", "end", "center", "baseline", "stretch"]
            }],
            "align-self": [{
                self: ["auto", "start", "end", "center", "stretch", "baseline"]
            }],
            "place-content": [{
                "place-content": ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline"]
            }],
            "place-items": [{
                "place-items": ["start", "end", "center", "baseline", "stretch"]
            }],
            "place-self": [{
                "place-self": ["auto", "start", "end", "center", "stretch"]
            }],
            p: [{
                p: [y]
            }],
            px: [{
                px: [y]
            }],
            py: [{
                py: [y]
            }],
            ps: [{
                ps: [y]
            }],
            pe: [{
                pe: [y]
            }],
            pt: [{
                pt: [y]
            }],
            pr: [{
                pr: [y]
            }],
            pb: [{
                pb: [y]
            }],
            pl: [{
                pl: [y]
            }],
            m: [{
                m: [f]
            }],
            mx: [{
                mx: [f]
            }],
            my: [{
                my: [f]
            }],
            ms: [{
                ms: [f]
            }],
            me: [{
                me: [f]
            }],
            mt: [{
                mt: [f]
            }],
            mr: [{
                mr: [f]
            }],
            mb: [{
                mb: [f]
            }],
            ml: [{
                ml: [f]
            }],
            "space-x": [{
                "space-x": [T]
            }],
            "space-x-reverse": ["space-x-reverse"],
            "space-y": [{
                "space-y": [T]
            }],
            "space-y-reverse": ["space-y-reverse"],
            w: [{
                w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", isArbitraryValue, r]
            }],
            "min-w": [{
                "min-w": [isArbitraryValue, r, "min", "max", "fit"]
            }],
            "max-w": [{
                "max-w": [isArbitraryValue, r, "none", "full", "min", "max", "fit", "prose", {
                    screen: [isTshirtSize]
                }, isTshirtSize]
            }],
            h: [{
                h: [isArbitraryValue, r, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
            }],
            "min-h": [{
                "min-h": [isArbitraryValue, r, "min", "max", "fit", "svh", "lvh", "dvh"]
            }],
            "max-h": [{
                "max-h": [isArbitraryValue, r, "min", "max", "fit", "svh", "lvh", "dvh"]
            }],
            size: [{
                size: [isArbitraryValue, r, "auto", "min", "max", "fit"]
            }],
            "font-size": [{
                text: ["base", isTshirtSize, isArbitraryLength]
            }],
            "font-smoothing": ["antialiased", "subpixel-antialiased"],
            "font-style": ["italic", "not-italic"],
            "font-weight": [{
                font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", isArbitraryNumber]
            }],
            "font-family": [{
                font: [isAny]
            }],
            "fvn-normal": ["normal-nums"],
            "fvn-ordinal": ["ordinal"],
            "fvn-slashed-zero": ["slashed-zero"],
            "fvn-figure": ["lining-nums", "oldstyle-nums"],
            "fvn-spacing": ["proportional-nums", "tabular-nums"],
            "fvn-fraction": ["diagonal-fractions", "stacked-fractons"],
            tracking: [{
                tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", isArbitraryValue]
            }],
            "line-clamp": [{
                "line-clamp": ["none", isNumber, isArbitraryNumber]
            }],
            leading: [{
                leading: ["none", "tight", "snug", "normal", "relaxed", "loose", isLength, isArbitraryValue]
            }],
            "list-image": [{
                "list-image": ["none", isArbitraryValue]
            }],
            "list-style-type": [{
                list: ["none", "disc", "decimal", isArbitraryValue]
            }],
            "list-style-position": [{
                list: ["inside", "outside"]
            }],
            "placeholder-color": [{
                placeholder: [e]
            }],
            "placeholder-opacity": [{
                "placeholder-opacity": [h]
            }],
            "text-alignment": [{
                text: ["left", "center", "right", "justify", "start", "end"]
            }],
            "text-color": [{
                text: [e]
            }],
            "text-opacity": [{
                "text-opacity": [h]
            }],
            "text-decoration": ["underline", "overline", "line-through", "no-underline"],
            "text-decoration-style": [{
                decoration: ["solid", "dashed", "dotted", "double", "none", "wavy"]
            }],
            "text-decoration-thickness": [{
                decoration: ["auto", "from-font", isLength, isArbitraryLength]
            }],
            "underline-offset": [{
                "underline-offset": ["auto", isLength, isArbitraryValue]
            }],
            "text-decoration-color": [{
                decoration: [e]
            }],
            "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
            "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
            "text-wrap": [{
                text: ["wrap", "nowrap", "balance", "pretty"]
            }],
            indent: [{
                indent: z()
            }],
            "vertical-align": [{
                align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", isArbitraryValue]
            }],
            whitespace: [{
                whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
            }],
            break: [{
                break: ["normal", "words", "all", "keep"]
            }],
            hyphens: [{
                hyphens: ["none", "manual", "auto"]
            }],
            content: [{
                content: ["none", isArbitraryValue]
            }],
            "bg-attachment": [{
                bg: ["fixed", "local", "scroll"]
            }],
            "bg-clip": [{
                "bg-clip": ["border", "padding", "content", "text"]
            }],
            "bg-opacity": [{
                "bg-opacity": [h]
            }],
            "bg-origin": [{
                "bg-origin": ["border", "padding", "content"]
            }],
            "bg-position": [{
                bg: ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top", isArbitraryPosition]
            }],
            "bg-repeat": [{
                bg: ["no-repeat", {
                    repeat: ["", "x", "y", "round", "space"]
                }]
            }],
            "bg-size": [{
                bg: ["auto", "cover", "contain", isArbitrarySize]
            }],
            "bg-image": [{
                bg: ["none", {
                    "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
                }, isArbitraryImage]
            }],
            "bg-color": [{
                bg: [e]
            }],
            "gradient-from-pos": [{
                from: [g]
            }],
            "gradient-via-pos": [{
                via: [g]
            }],
            "gradient-to-pos": [{
                to: [g]
            }],
            "gradient-from": [{
                from: [p]
            }],
            "gradient-via": [{
                via: [p]
            }],
            "gradient-to": [{
                to: [p]
            }],
            rounded: [{
                rounded: [n]
            }],
            "rounded-s": [{
                "rounded-s": [n]
            }],
            "rounded-e": [{
                "rounded-e": [n]
            }],
            "rounded-t": [{
                "rounded-t": [n]
            }],
            "rounded-r": [{
                "rounded-r": [n]
            }],
            "rounded-b": [{
                "rounded-b": [n]
            }],
            "rounded-l": [{
                "rounded-l": [n]
            }],
            "rounded-ss": [{
                "rounded-ss": [n]
            }],
            "rounded-se": [{
                "rounded-se": [n]
            }],
            "rounded-ee": [{
                "rounded-ee": [n]
            }],
            "rounded-es": [{
                "rounded-es": [n]
            }],
            "rounded-tl": [{
                "rounded-tl": [n]
            }],
            "rounded-tr": [{
                "rounded-tr": [n]
            }],
            "rounded-br": [{
                "rounded-br": [n]
            }],
            "rounded-bl": [{
                "rounded-bl": [n]
            }],
            "border-w": [{
                border: [a]
            }],
            "border-w-x": [{
                "border-x": [a]
            }],
            "border-w-y": [{
                "border-y": [a]
            }],
            "border-w-s": [{
                "border-s": [a]
            }],
            "border-w-e": [{
                "border-e": [a]
            }],
            "border-w-t": [{
                "border-t": [a]
            }],
            "border-w-r": [{
                "border-r": [a]
            }],
            "border-w-b": [{
                "border-b": [a]
            }],
            "border-w-l": [{
                "border-l": [a]
            }],
            "border-opacity": [{
                "border-opacity": [h]
            }],
            "border-style": [{
                border: ["solid", "dashed", "dotted", "double", "none", "hidden"]
            }],
            "divide-x": [{
                "divide-x": [a]
            }],
            "divide-x-reverse": ["divide-x-reverse"],
            "divide-y": [{
                "divide-y": [a]
            }],
            "divide-y-reverse": ["divide-y-reverse"],
            "divide-opacity": [{
                "divide-opacity": [h]
            }],
            "divide-style": [{
                divide: ["solid", "dashed", "dotted", "double", "none"]
            }],
            "border-color": [{
                border: [i]
            }],
            "border-color-x": [{
                "border-x": [i]
            }],
            "border-color-y": [{
                "border-y": [i]
            }],
            "border-color-t": [{
                "border-t": [i]
            }],
            "border-color-r": [{
                "border-r": [i]
            }],
            "border-color-b": [{
                "border-b": [i]
            }],
            "border-color-l": [{
                "border-l": [i]
            }],
            "divide-color": [{
                divide: [i]
            }],
            "outline-style": [{
                outline: ["", "solid", "dashed", "dotted", "double", "none"]
            }],
            "outline-offset": [{
                "outline-offset": [isLength, isArbitraryValue]
            }],
            "outline-w": [{
                outline: [isLength, isArbitraryLength]
            }],
            "outline-color": [{
                outline: [e]
            }],
            "ring-w": [{
                ring: S()
            }],
            "ring-w-inset": ["ring-inset"],
            "ring-color": [{
                ring: [e]
            }],
            "ring-opacity": [{
                "ring-opacity": [h]
            }],
            "ring-offset-w": [{
                "ring-offset": [isLength, isArbitraryLength]
            }],
            "ring-offset-color": [{
                "ring-offset": [e]
            }],
            shadow: [{
                shadow: ["", "inner", "none", isTshirtSize, isArbitraryShadow]
            }],
            "shadow-color": [{
                shadow: [isAny]
            }],
            opacity: [{
                opacity: [h]
            }],
            "mix-blend": [{
                "mix-blend": ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity", "plus-lighter", "plus-darker"]
            }],
            "bg-blend": [{
                "bg-blend": ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"]
            }],
            filter: [{
                filter: ["", "none"]
            }],
            blur: [{
                blur: [t]
            }],
            brightness: [{
                brightness: [o]
            }],
            contrast: [{
                contrast: [l]
            }],
            "drop-shadow": [{
                "drop-shadow": ["", "none", isTshirtSize, isArbitraryValue]
            }],
            grayscale: [{
                grayscale: [c]
            }],
            "hue-rotate": [{
                "hue-rotate": [d]
            }],
            invert: [{
                invert: [u]
            }],
            saturate: [{
                saturate: [x]
            }],
            sepia: [{
                sepia: [w]
            }],
            "backdrop-filter": [{
                "backdrop-filter": ["", "none"]
            }],
            "backdrop-blur": [{
                "backdrop-blur": [t]
            }],
            "backdrop-brightness": [{
                "backdrop-brightness": [o]
            }],
            "backdrop-contrast": [{
                "backdrop-contrast": [l]
            }],
            "backdrop-grayscale": [{
                "backdrop-grayscale": [c]
            }],
            "backdrop-hue-rotate": [{
                "backdrop-hue-rotate": [d]
            }],
            "backdrop-invert": [{
                "backdrop-invert": [u]
            }],
            "backdrop-opacity": [{
                "backdrop-opacity": [h]
            }],
            "backdrop-saturate": [{
                "backdrop-saturate": [x]
            }],
            "backdrop-sepia": [{
                "backdrop-sepia": [w]
            }],
            "border-collapse": [{
                border: ["collapse", "separate"]
            }],
            "border-spacing": [{
                "border-spacing": [s]
            }],
            "border-spacing-x": [{
                "border-spacing-x": [s]
            }],
            "border-spacing-y": [{
                "border-spacing-y": [s]
            }],
            "table-layout": [{
                table: ["auto", "fixed"]
            }],
            caption: [{
                caption: ["top", "bottom"]
            }],
            transition: [{
                transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", isArbitraryValue]
            }],
            duration: [{
                duration: R()
            }],
            ease: [{
                ease: ["linear", "in", "out", "in-out", isArbitraryValue]
            }],
            delay: [{
                delay: R()
            }],
            animate: [{
                animate: ["none", "spin", "ping", "pulse", "bounce", isArbitraryValue]
            }],
            transform: [{
                transform: ["", "gpu", "none"]
            }],
            scale: [{
                scale: [v]
            }],
            "scale-x": [{
                "scale-x": [v]
            }],
            "scale-y": [{
                "scale-y": [v]
            }],
            rotate: [{
                rotate: [isInteger, isArbitraryValue]
            }],
            "translate-x": [{
                "translate-x": [C]
            }],
            "translate-y": [{
                "translate-y": [C]
            }],
            "skew-x": [{
                "skew-x": [A]
            }],
            "skew-y": [{
                "skew-y": [A]
            }],
            "transform-origin": [{
                origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", isArbitraryValue]
            }],
            accent: [{
                accent: ["auto", e]
            }],
            appearance: [{
                appearance: ["none", "auto"]
            }],
            cursor: [{
                cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", isArbitraryValue]
            }],
            "caret-color": [{
                caret: [e]
            }],
            "pointer-events": [{
                "pointer-events": ["none", "auto"]
            }],
            resize: [{
                resize: ["none", "y", "x", ""]
            }],
            "scroll-behavior": [{
                scroll: ["auto", "smooth"]
            }],
            "scroll-m": [{
                "scroll-m": z()
            }],
            "scroll-mx": [{
                "scroll-mx": z()
            }],
            "scroll-my": [{
                "scroll-my": z()
            }],
            "scroll-ms": [{
                "scroll-ms": z()
            }],
            "scroll-me": [{
                "scroll-me": z()
            }],
            "scroll-mt": [{
                "scroll-mt": z()
            }],
            "scroll-mr": [{
                "scroll-mr": z()
            }],
            "scroll-mb": [{
                "scroll-mb": z()
            }],
            "scroll-ml": [{
                "scroll-ml": z()
            }],
            "scroll-p": [{
                "scroll-p": z()
            }],
            "scroll-px": [{
                "scroll-px": z()
            }],
            "scroll-py": [{
                "scroll-py": z()
            }],
            "scroll-ps": [{
                "scroll-ps": z()
            }],
            "scroll-pe": [{
                "scroll-pe": z()
            }],
            "scroll-pt": [{
                "scroll-pt": z()
            }],
            "scroll-pr": [{
                "scroll-pr": z()
            }],
            "scroll-pb": [{
                "scroll-pb": z()
            }],
            "scroll-pl": [{
                "scroll-pl": z()
            }],
            "snap-align": [{
                snap: ["start", "end", "center", "align-none"]
            }],
            "snap-stop": [{
                snap: ["normal", "always"]
            }],
            "snap-type": [{
                snap: ["none", "x", "y", "both"]
            }],
            "snap-strictness": [{
                snap: ["mandatory", "proximity"]
            }],
            touch: [{
                touch: ["auto", "none", "manipulation"]
            }],
            "touch-x": [{
                "touch-pan": ["x", "left", "right"]
            }],
            "touch-y": [{
                "touch-pan": ["y", "up", "down"]
            }],
            "touch-pz": ["touch-pinch-zoom"],
            select: [{
                select: ["none", "text", "all", "auto"]
            }],
            "will-change": [{
                "will-change": ["auto", "scroll", "contents", "transform", isArbitraryValue]
            }],
            fill: [{
                fill: [e, "none"]
            }],
            "stroke-w": [{
                stroke: [isLength, isArbitraryLength, isArbitraryNumber]
            }],
            stroke: [{
                stroke: [e, "none"]
            }],
            sr: ["sr-only", "not-sr-only"],
            "forced-color-adjust": [{
                "forced-color-adjust": ["auto", "none"]
            }]
        },
        conflictingClassGroups: {
            overflow: ["overflow-x", "overflow-y"],
            overscroll: ["overscroll-x", "overscroll-y"],
            inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
            "inset-x": ["right", "left"],
            "inset-y": ["top", "bottom"],
            flex: ["basis", "grow", "shrink"],
            gap: ["gap-x", "gap-y"],
            p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
            px: ["pr", "pl"],
            py: ["pt", "pb"],
            m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
            mx: ["mr", "ml"],
            my: ["mt", "mb"],
            size: ["w", "h"],
            "font-size": ["leading"],
            "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
            "fvn-ordinal": ["fvn-normal"],
            "fvn-slashed-zero": ["fvn-normal"],
            "fvn-figure": ["fvn-normal"],
            "fvn-spacing": ["fvn-normal"],
            "fvn-fraction": ["fvn-normal"],
            "line-clamp": ["display", "overflow"],
            rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
            "rounded-s": ["rounded-ss", "rounded-es"],
            "rounded-e": ["rounded-se", "rounded-ee"],
            "rounded-t": ["rounded-tl", "rounded-tr"],
            "rounded-r": ["rounded-tr", "rounded-br"],
            "rounded-b": ["rounded-br", "rounded-bl"],
            "rounded-l": ["rounded-tl", "rounded-bl"],
            "border-spacing": ["border-spacing-x", "border-spacing-y"],
            "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
            "border-w-x": ["border-w-r", "border-w-l"],
            "border-w-y": ["border-w-t", "border-w-b"],
            "border-color": ["border-color-t", "border-color-r", "border-color-b", "border-color-l"],
            "border-color-x": ["border-color-r", "border-color-l"],
            "border-color-y": ["border-color-t", "border-color-b"],
            "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
            "scroll-mx": ["scroll-mr", "scroll-ml"],
            "scroll-my": ["scroll-mt", "scroll-mb"],
            "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
            "scroll-px": ["scroll-pr", "scroll-pl"],
            "scroll-py": ["scroll-pt", "scroll-pb"],
            touch: ["touch-x", "touch-y", "touch-pz"],
            "touch-x": ["touch"],
            "touch-y": ["touch"],
            "touch-pz": ["touch"]
        },
        conflictingClassGroupModifiers: {
            "font-size": ["leading"]
        }
    }
}

function mergeConfigs(e, {
    cacheSize: r,
    prefix: t,
    separator: o,
    experimentalParseClassName: i,
    extend: n = {},
    override: s = {}
}) {
    overrideProperty(e, "cacheSize", r), overrideProperty(e, "prefix", t), overrideProperty(e, "separator", o), overrideProperty(e, "experimentalParseClassName", i);
    for (const r in s) overrideConfigProperties(e[r], s[r]);
    for (const r in n) mergeConfigProperties(e[r], n[r]);
    return e
}

function overrideProperty(e, r, t) {
    void 0 !== t && (e[r] = t)
}

function overrideConfigProperties(e, r) {
    if (r)
        for (const t in r) overrideProperty(e, t, r[t])
}

function mergeConfigProperties(e, r) {
    if (r)
        for (const t in r) {
            const o = r[t];
            void 0 !== o && (e[t] = (e[t] || []).concat(o))
        }
}

function extendTailwindMerge(e, ...r) {
    return "function" == typeof e ? createTailwindMerge(getDefaultConfig, e, ...r) : createTailwindMerge((() => mergeConfigs(getDefaultConfig(), e)), ...r)
}
const twMerge = createTailwindMerge(getDefaultConfig);
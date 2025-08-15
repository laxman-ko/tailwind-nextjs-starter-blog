export default function () {
  var Component = (() => {
    var k = Object.create
    var o = Object.defineProperty
    var u = Object.getOwnPropertyDescriptor
    var p = Object.getOwnPropertyNames
    var h = Object.getPrototypeOf,
      d = Object.prototype.hasOwnProperty
    var _ = (t, n) => () => (n || t((n = { exports: {} }).exports, n), n.exports),
      f = (t, n) => {
        for (var a in n) o(t, a, { get: n[a], enumerable: !0 })
      },
      s = (t, n, a, r) => {
        if ((n && typeof n == 'object') || typeof n == 'function')
          for (let e of p(n))
            !d.call(t, e) &&
              e !== a &&
              o(t, e, { get: () => n[e], enumerable: !(r = u(n, e)) || r.enumerable })
        return t
      }
    var w = (t, n, a) => (
        (a = t != null ? k(h(t)) : {}),
        s(n || !t || !t.__esModule ? o(a, 'default', { value: t, enumerable: !0 }) : a, t)
      ),
      g = (t) => s(o({}, '__esModule', { value: !0 }), t)
    var m = _((C, c) => {
      c.exports = _jsx_runtime
    })
    var L = {}
    f(L, { default: () => x, frontmatter: () => j })
    var i = w(m()),
      j = {
        name: 'Laxman Siwakoti',
        avatar: '/static/images/laxman-siwakoti.jpg',
        occupation: 'Thinker, Questioner and Learner',
        email: 'akshar@laxmanko.com',
        tiktok: 'https://tiktok.com/@laxman_ko',
        locale: 'en',
        localizedSlugs: { ne: 'laxman-siwakoti', en: 'laxman-siwakoti' },
      }
    function l(t) {
      let n = { p: 'p', ...t.components }
      return (0, i.jsx)(n.p, { children: 'this is english' })
    }
    function x(t = {}) {
      let { wrapper: n } = t.components || {}
      return n ? (0, i.jsx)(n, { ...t, children: (0, i.jsx)(l, { ...t }) }) : l(t)
    }
    return g(L)
  })()
  return Component
}

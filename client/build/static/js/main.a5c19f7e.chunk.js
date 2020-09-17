(this.webpackJsonpclient = this.webpackJsonpclient || []).push([
    [0],
    {
        201: function (e, t, n) {
            "use strict";
            n.r(t);
            var a = n(0),
                r = n.n(a),
                c = n(7),
                i = n.n(c),
                o = n(5),
                u = n(2),
                l = n(4),
                s = n(6),
                m = n.n(s),
                d = Object(a.createContext)([]);
            var p = function (e) {
                    var t = e.children,
                        n = Object(u.n)(),
                        c = Object(a.useState)({}),
                        i = Object(o.a)(c, 2),
                        l = i[0],
                        s = i[1],
                        p = Object(a.useState)(!1),
                        f = Object(o.a)(p, 2),
                        v = f[0],
                        b = f[1],
                        g = Object(a.useCallback)(
                            function () {
                                v ||
                                    (b(!0),
                                    m.a
                                        .get("/api/status")
                                        .then(function (e) {
                                            s(e.data), b(!1);
                                        })
                                        .catch(function (e) {
                                            "You cannot vote yet" ===
                                                e.response.data &&
                                                (s({ state: "notApproved" }),
                                                b(!1));
                                        }));
                            },
                            [s, v, b]
                        ),
                        E = null != n;
                    return (
                        Object(a.useEffect)(
                            function () {
                                E && 0 === Object.keys(l).length && g();
                            },
                            [E, l, g]
                        ),
                        r.a.createElement(d.Provider, { value: [l, g] }, t)
                    );
                },
                f = function () {
                    var e = Object(a.useContext)(d),
                        t = Object(o.a)(e, 2);
                    return [t[0], t[1]];
                },
                v = n(8),
                b = n(3);
            function g() {
                var e = Object(v.a)([
                    "\n    display: grid;\n    grid-template-columns: auto;\n    grid-auto-rows: auto;\n    grid-gap: 1rem;\n",
                ]);
                return (
                    (g = function () {
                        return e;
                    }),
                    e
                );
            }
            var E = b.a.div(g()),
                O = function (e) {
                    var t = e.title,
                        n = e.body,
                        a = e.buttons;
                    return r.a.createElement(
                        u.c.Card,
                        {
                            margin: "auto",
                            size: { minWidth: "200px", minHeight: "200px" },
                        },
                        r.a.createElement(
                            u.c.CardHeader,
                            null,
                            r.a.createElement(u.c.CardTitle, { text: t })
                        ),
                        r.a.createElement(
                            u.c.CardBody,
                            null,
                            r.a.createElement(E, null, n)
                        ),
                        r.a.createElement(
                            u.c.CardButtons,
                            { reverseDirection: !0 },
                            a
                        )
                    );
                };
            var j = function () {
                    var e = Object(u.n)();
                    return null != e && e.voteIT.admin;
                },
                x = function () {
                    var e = f(),
                        t = Object(o.a)(e, 2)[1],
                        n = Object(a.useState)(!1),
                        c = Object(o.a)(n, 2),
                        i = c[0],
                        l = c[1];
                    return (
                        Object(a.useEffect)(
                            function () {
                                i &&
                                    setTimeout(function () {
                                        l(!1);
                                    }, 1e3);
                            },
                            [i, l]
                        ),
                        r.a.createElement(u.a, {
                            text: "Update",
                            onClick: function () {
                                t(), l(!0);
                            },
                            primary: !0,
                            outlined: !0,
                            disabled: i,
                            size: { maxWidth: "300px" },
                        })
                    );
                },
                h = function () {
                    var e = j(),
                        t = Object(l.g)(),
                        n = e
                            ? r.a.createElement(
                                  r.a.Fragment,
                                  null,
                                  r.a.createElement(u.a, {
                                      primary: !0,
                                      raised: !0,
                                      text: "Create vote session",
                                      onClick: function () {
                                          return t.push(
                                              "/admin/create-vote-session"
                                          );
                                      },
                                  }),
                                  r.a.createElement(x, null)
                              )
                            : null,
                        a = r.a.createElement(u.i.Text, {
                            text:
                                "There is no election at this time, try again later.",
                        });
                    return r.a.createElement(O, {
                        title: "No vote",
                        buttons: n,
                        body: a,
                    });
                },
                y = n(49),
                C = n(47),
                w = n(82),
                k = n.n(w);
            function T() {
                var e = Object(v.a)([
                    "\n    display: grid;\n    grid-template-columns: auto;\n    grid-auto-rows: auto;\n",
                ]);
                return (
                    (T = function () {
                        return e;
                    }),
                    e
                );
            }
            var N = b.a.div(T()),
                V = function (e) {
                    var t = e.value,
                        n = e.innerInputs,
                        c = f(),
                        i = Object(o.a)(c, 1)[0],
                        l = Object(a.useMemo)(
                            function () {
                                return t.reduce(function (e, t) {
                                    return t.choosen ? e + 1 : e;
                                }, 0);
                            },
                            [JSON.stringify(t)]
                        ),
                        s = Object(a.useMemo)(
                            function () {
                                var e = k()(
                                    t.filter(function (e) {
                                        return e.vacant;
                                    }),
                                    ["choosen", !1]
                                );
                                return null == e ? -1 : e.id;
                            },
                            [JSON.stringify(t)]
                        );
                    return r.a.createElement(
                        N,
                        null,
                        t.map(function (e, t) {
                            return r.a.createElement(
                                r.a.Fragment,
                                { key: t },
                                r.a.createElement(
                                    u.b,
                                    Object.assign(
                                        { primary: !0 },
                                        n[t].choosen,
                                        {
                                            label: e.name,
                                            disabled:
                                                (i.maximumNbrOfVotes === l &&
                                                    !e.choosen) ||
                                                (!e.choosen &&
                                                    e.vacant &&
                                                    e.id > s),
                                        }
                                    )
                                )
                            );
                        })
                    );
                },
                A = function () {
                    var e = f(),
                        t = Object(o.a)(e, 2),
                        n = t[0],
                        a = t[1],
                        c = Object(u.l)(),
                        i = Object(o.a)(c, 1)[0];
                    return null == n.candidates
                        ? null
                        : r.a.createElement(u.d, {
                              margin: "auto",
                              titleText: n.electionName,
                              submitText: "Vote",
                              onSubmit: function (e) {
                                  var t = e.candidates
                                      .filter(function (e) {
                                          return e.choosen;
                                      })
                                      .map(function (e) {
                                          return e.id;
                                      });
                                  m.a
                                      .post("/api/vote", { vote: t })
                                      .then(function () {
                                          i({ text: "You have voted!" }), a();
                                      })
                                      .catch(function (e) {
                                          i({
                                              text:
                                                  "Something went wrong when voting... Please contact one of the counters.",
                                          }),
                                              console.log(e);
                                      });
                              },
                              initialValues: {
                                  candidates: []
                                      .concat(
                                          Object(C.a)(n.candidates),
                                          Object(C.a)(n.vacants)
                                      )
                                      .map(function (e) {
                                          return Object(y.a)(
                                              Object(y.a)({}, e),
                                              {},
                                              { choosen: !1 }
                                          );
                                      }),
                              },
                              keysOrder: ["candidates"],
                              keysComponentData: {
                                  candidates: {
                                      component: V,
                                      array: !0,
                                      formFieldArrayOptions: {
                                          inputs: ["choosen"],
                                      },
                                  },
                              },
                          });
                },
                S = function () {
                    var e = j(),
                        t = f(),
                        n = Object(o.a)(t, 2),
                        a = n[0],
                        c = n[1],
                        i = Object(u.k)(),
                        l = Object(o.a)(i, 1)[0],
                        s = r.a.createElement(
                            r.a.Fragment,
                            null,
                            e &&
                                r.a.createElement(u.a, {
                                    text: "End voting",
                                    onClick: function () {
                                        l({
                                            title: "Are you sure?",
                                            description:
                                                "This will end the current voting session",
                                            confirmButtonText: "End voting",
                                            cancelButtonText: "Cancel",
                                            onConfirm: function () {
                                                return m.a
                                                    .post("/api/complete")
                                                    .then(function (e) {
                                                        return c();
                                                    });
                                            },
                                        });
                                    },
                                    primary: !0,
                                    outlined: !0,
                                }),
                            r.a.createElement(x, null)
                        ),
                        d = r.a.createElement(
                            r.a.Fragment,
                            null,
                            r.a.createElement(u.i.Text, {
                                text: "Votes recieved: " + a.votesReceived,
                            }),
                            r.a.createElement(u.i.Text, {
                                text: "Eligible voters: " + a.eligibleVoters,
                            })
                        );
                    return r.a.createElement(O, {
                        title: "Awaiting result...",
                        body: d,
                        buttons: s,
                    });
                };
            function B() {
                var e = Object(v.a)([
                    "\n    width: 100%;\n\n    display: flex;\n    flex-direction: row;\n    flex-wrap: wrap;\n\n    justify-content: center;\n    align-content: center;\n",
                ]);
                return (
                    (B = function () {
                        return e;
                    }),
                    e
                );
            }
            function F() {
                var e = Object(v.a)([
                    "\n    display: flex;\n    flex-direction: column;\n\n    margin: auto;\n\n    max-width: 650px;\n",
                ]);
                return (
                    (F = function () {
                        return e;
                    }),
                    e
                );
            }
            var H = b.a.div(F()),
                z = b.a.div(B()),
                J = function () {
                    var e = f(),
                        t = Object(o.a)(e, 1)[0],
                        n = Object(l.g)(),
                        a = j();
                    return null == t
                        ? null
                        : r.a.createElement(
                              H,
                              null,
                              r.a.createElement(u.i.Heading4, {
                                  text: "Results:",
                              }),
                              r.a.createElement(
                                  z,
                                  null,
                                  t.winners.map(function (e) {
                                      return r.a.createElement(
                                          u.c.Card,
                                          {
                                              key: e.id,
                                              margin: "1rem",
                                              size: {
                                                  width: "200px",
                                                  height: "200px",
                                              },
                                          },
                                          r.a.createElement(
                                              u.c.CardBody,
                                              {
                                                  alignContent: "center",
                                                  justifyContent: "center",
                                              },
                                              r.a.createElement(u.i.Text, {
                                                  bold: !0,
                                                  text: e.name,
                                              })
                                          )
                                      );
                                  })
                              ),
                              !a && r.a.createElement(x, null),
                              a &&
                                  r.a.createElement(u.a, {
                                      text: "View raw results",
                                      outlined: !0,
                                      onClick: function () {
                                          return n.push("/admin/raw-result");
                                      },
                                      size: { maxWidth: "300px" },
                                  }),
                              a &&
                                  r.a.createElement(u.a, {
                                      text: "Create new vote session",
                                      outlined: !0,
                                      onClick: function () {
                                          return n.push(
                                              "/admin/create-vote-session"
                                          );
                                      },
                                      size: { maxWidth: "300px" },
                                  })
                          );
                },
                P = function () {
                    var e = r.a.createElement(u.i.Text, {
                            text:
                                "You have not yet been approved by the meetings counters.",
                        }),
                        t = r.a.createElement(x, null);
                    return r.a.createElement(O, {
                        title: "Not approved yet",
                        body: e,
                        buttons: t,
                    });
                },
                I = function () {
                    var e = f(),
                        t = Object(o.a)(e, 1)[0];
                    return "notApproved" === t.state
                        ? r.a.createElement(P, null)
                        : "noVote" === t.state
                        ? r.a.createElement(h, null)
                        : t.userVoted
                        ? r.a.createElement(S, null)
                        : "vote" === t.state
                        ? r.a.createElement(A, null)
                        : "result" === t.state
                        ? r.a.createElement(J, null)
                        : r.a.createElement("div", null, "loading...");
                };
            function M() {
                var e = Object(v.a)([
                    "\n    display: flex;\n    flex-direction: column;\n\n    margin: auto;\n\n    max-width: 500px;\n",
                ]);
                return (
                    (M = function () {
                        return e;
                    }),
                    e
                );
            }
            var R = b.a.div(M()),
                W = function () {
                    var e = Object(l.g)(),
                        t = Object(a.useState)(null),
                        n = Object(o.a)(t, 2),
                        c = n[0],
                        i = n[1];
                    return (
                        Object(a.useEffect)(function () {
                            m.a.get("/api/result").then(function (e) {
                                return i(e.data);
                            });
                        }, []),
                        r.a.createElement(
                            R,
                            null,
                            r.a.createElement(u.a, {
                                outlined: !0,
                                text: "Back",
                                onClick: function () {
                                    return e.push("/");
                                },
                            }),
                            r.a.createElement(u.i.Heading4, {
                                text: "Raw results",
                            }),
                            null != c &&
                                r.a.createElement(
                                    r.a.Fragment,
                                    null,
                                    r.a.createElement(
                                        "div",
                                        null,
                                        "votesCount: ",
                                        JSON.stringify(c.votesCount)
                                    ),
                                    r.a.createElement(
                                        "div",
                                        null,
                                        "--------------------"
                                    ),
                                    r.a.createElement(
                                        "div",
                                        null,
                                        "rawVotes: ",
                                        JSON.stringify(c.rawVotes)
                                    )
                                )
                        )
                    );
                },
                Y = n(83),
                D = n.n(Y);
            function L() {
                var e = Object(v.a)([
                    "\n    display: grid;\n    grid-template-columns: auto auto;\n    grid-auto-columns: auto;\n    grid-gap: 1rem;\n",
                ]);
                return (
                    (L = function () {
                        return e;
                    }),
                    e
                );
            }
            var U = b.a.div(L()),
                G = function (e) {
                    var t = e.innerInputs,
                        n = e.push,
                        a = e.remove;
                    return r.a.createElement(
                        U,
                        null,
                        r.a.createElement(u.a, {
                            text: "Add option",
                            primary: !0,
                            outlined: !0,
                            onClick: function () {
                                return n({ name: "" });
                            },
                            gridColumn: { start: "1", end: "-1" },
                        }),
                        t.map(function (e, t) {
                            var n = e.name;
                            return r.a.createElement(
                                r.a.Fragment,
                                { key: t },
                                r.a.createElement(
                                    u.j,
                                    Object.assign({}, n, {
                                        outlined: !0,
                                        upperLabel: "Option " + (t + 1),
                                    })
                                ),
                                r.a.createElement(u.g, {
                                    icon: D.a,
                                    onClick: function () {
                                        return a(t);
                                    },
                                })
                            );
                        })
                    );
                };
            function _() {
                var e = Object(v.a)([
                    "\n    display: flex;\n    flex-direction: column;\n\n    margin: auto;\n",
                ]);
                return (
                    (_ = function () {
                        return e;
                    }),
                    e
                );
            }
            var q = b.a.div(_()),
                K = function () {
                    var e = f(),
                        t = Object(o.a)(e, 2),
                        n = t[0],
                        c = t[1],
                        i = Object(l.g)(),
                        s = Object(u.l)(),
                        d = Object(o.a)(s, 1)[0],
                        p = Object(u.k)(),
                        v = Object(o.a)(p, 1)[0];
                    return (
                        Object(a.useEffect)(
                            function () {
                                "vote" === n.state &&
                                    (d({
                                        text:
                                            "A voting session has already been started",
                                    }),
                                    c(),
                                    i.push("/"));
                            },
                            [n.state, i, c, d]
                        ),
                        r.a.createElement(
                            q,
                            null,
                            r.a.createElement(u.a, {
                                margin: { bottom: "1rem" },
                                outlined: !0,
                                onClick: function () {
                                    return i.push("/");
                                },
                                text: "Back",
                            }),
                            r.a.createElement(u.d, {
                                onSubmit: function (e) {
                                    var t = e.electionName,
                                        n = e.candidates,
                                        a = e.maxCandidates,
                                        r = e.vacant;
                                    v({
                                        title: "Are you sure?",
                                        description:
                                            "This will start a new voting session immediately",
                                        confirmButtonText:
                                            "Start voting session",
                                        cancelButtonText: "Cancel",
                                        onConfirm: function () {
                                            return m.a
                                                .post(
                                                    "/api/create-vote-session",
                                                    {
                                                        candidates: n.map(
                                                            function (e) {
                                                                return e.name;
                                                            }
                                                        ),
                                                        vacant: r,
                                                        max_candidates: a,
                                                        electionName: t,
                                                    }
                                                )
                                                .then(function () {
                                                    c(), i.push("/");
                                                })
                                                .catch(function (e) {
                                                    return d({
                                                        text: e.response.data,
                                                    });
                                                });
                                        },
                                    });
                                },
                                margin: "auto",
                                titleText: "Create vote session",
                                submitText: "Start vote session",
                                keysOrder: [
                                    "electionName",
                                    "maxCandidates",
                                    "vacant",
                                    "candidates",
                                ],
                                initialValues: {
                                    electionName: "Val av ledam\xf6ter",
                                    maxCandidates: 1,
                                    vacant: !1,
                                    candidates: [{ name: "" }, { name: "" }],
                                },
                                keysComponentData: {
                                    electionName: {
                                        component: u.j,
                                        componentProps: {
                                            upperLabel: "Name of the election",
                                            outlined: !0,
                                        },
                                    },
                                    maxCandidates: {
                                        component: u.j,
                                        componentProps: {
                                            numbersOnly: !0,
                                            upperLabel:
                                                "Max selections per vote",
                                            outlined: !0,
                                        },
                                    },
                                    vacant: {
                                        component: u.b,
                                        componentProps: {
                                            primary: !0,
                                            label: "Vacant enabled",
                                        },
                                    },
                                    candidates: {
                                        component: G,
                                        array: !0,
                                        formFieldArrayOptions: {
                                            inputs: ["name"],
                                        },
                                    },
                                },
                            })
                        )
                    );
                },
                Q = n(84),
                X = n.n(Q);
            function Z() {
                var e = Object(v.a)([
                    "\n    grid-column-start: 1;\n    grid-column-end: -1;\n",
                ]);
                return (
                    (Z = function () {
                        return e;
                    }),
                    e
                );
            }
            function $() {
                var e = Object(v.a)([
                    "\n    display: grid;\n    grid-template-columns: auto min-content;\n    grid-auto-rows: auto;\n    grid-gap: 1rem;\n\n    align-items: center;\n\n    margin: auto;\n    justify-content: center;\n    align-content: center;\n",
                ]);
                return (
                    ($ = function () {
                        return e;
                    }),
                    e
                );
            }
            var ee = b.a.div($()),
                te = b.a.div(Z()),
                ne = function () {
                    var e = Object(l.g)(),
                        t = Object(a.useState)(),
                        n = Object(o.a)(t, 2),
                        c = n[0],
                        i = n[1],
                        s = Object(u.l)(),
                        d = Object(o.a)(s, 1)[0],
                        p = Object(a.useCallback)(
                            function () {
                                m.a.get("/api/not-approved").then(function (e) {
                                    return i(e.data);
                                });
                            },
                            [i]
                        );
                    if (
                        (Object(a.useEffect)(
                            function () {
                                p();
                            },
                            [p]
                        ),
                        null == c)
                    )
                        return null;
                    return r.a.createElement(
                        ee,
                        null,
                        r.a.createElement(u.a, {
                            text: "Back",
                            onClick: function () {
                                return e.push("/");
                            },
                            outlined: !0,
                            gridColumn: { start: "1", end: "-1" },
                        }),
                        r.a.createElement(
                            te,
                            null,
                            r.a.createElement(u.i.Heading4, {
                                text:
                                    0 === c.length
                                        ? "No users to approve"
                                        : "Non approved users",
                            })
                        ),
                        r.a.createElement(u.a, {
                            text: "Update",
                            onClick: function () {
                                return p();
                            },
                            gridColumn: { start: "1", end: "-1" },
                            primary: !0,
                            outlined: !0,
                        }),
                        r.a.createElement(u.a, {
                            text: "Update Gamma cache",
                            onClick: function () {
                                return m.a
                                    .post("/api/update-gamma-cache")
                                    .then(function () {
                                        return d({
                                            text: "Gamma cache updated",
                                        });
                                    });
                            },
                            gridColumn: { start: "1", end: "-1" },
                            outlined: !0,
                        }),
                        c.map(function (e) {
                            return r.a.createElement(
                                r.a.Fragment,
                                { key: e.id },
                                r.a.createElement(u.i.Text, {
                                    text:
                                        e.firstName +
                                        ' "' +
                                        e.nick +
                                        '" ' +
                                        e.lastName +
                                        " - " +
                                        e.acceptanceYear,
                                }),
                                r.a.createElement(u.g, {
                                    icon: X.a,
                                    onClick: function () {
                                        return (function (e) {
                                            return m.a
                                                .post("/api/approve-user", {
                                                    id: e.id,
                                                })
                                                .then(function () {
                                                    return p();
                                                });
                                        })(e);
                                    },
                                })
                            );
                        })
                    );
                },
                ae = function () {
                    return r.a.createElement(
                        l.d,
                        null,
                        r.a.createElement(l.b, {
                            path: "/admin/approve-users",
                            component: ne,
                        }),
                        r.a.createElement(l.b, {
                            path: "/admin/raw-result",
                            component: W,
                        }),
                        r.a.createElement(l.b, {
                            path: "/admin/create-vote-session",
                            component: K,
                        })
                    );
                },
                re = function (e) {
                    return function (t) {
                        switch (t) {
                            case "adminApproveVoters":
                                e.push("/admin/approve-users");
                        }
                    };
                },
                ce = function () {
                    var e = j(),
                        t = Object(l.g)();
                    return r.a.createElement(u.e, {
                        signOut: function () {
                            return m.a.post("/api/sign-out");
                        },
                        customOptionsOnClick: re(t),
                        customOptions: { adminApproveVoters: "Approve voters" },
                        customOrder: e
                            ? ["adminApproveVoters", "viewAccount", "signOut"]
                            : ["viewAccount", "signOut"],
                    });
                },
                ie = function () {
                    var e = f(),
                        t = Object(o.a)(e, 2)[1],
                        n = Object(u.m)("/api/me", "/api/code"),
                        c = Object(o.a)(n, 1)[0],
                        i = j();
                    return (
                        Object(a.useEffect)(
                            function () {
                                window.onfocus = function () {
                                    t();
                                };
                            },
                            [t]
                        ),
                        c
                            ? null
                            : r.a.createElement(u.f, {
                                  title: "VoteIT",
                                  headerRowProps: {
                                      size: { width: "100%" },
                                      flex: "1",
                                      justifyContent: "space-between",
                                  },
                                  renderHeader: function () {
                                      return r.a.createElement(ce, null);
                                  },
                                  toolbarHeight: "auto",
                                  renderMain: function () {
                                      return r.a.createElement(
                                          l.d,
                                          null,
                                          i &&
                                              r.a.createElement(l.b, {
                                                  path: "/admin",
                                                  component: ae,
                                              }),
                                          r.a.createElement(l.b, {
                                              path: "/",
                                              component: I,
                                          })
                                      );
                                  },
                              })
                    );
                };
            i.a.render(
                r.a.createElement(
                    r.a.StrictMode,
                    null,
                    r.a.createElement(
                        u.h,
                        null,
                        r.a.createElement(p, null, r.a.createElement(ie, null))
                    )
                ),
                document.getElementById("root")
            );
        },
        86: function (e, t, n) {
            e.exports = n(201);
        },
    },
    [[86, 1, 2]],
]);
//# sourceMappingURL=main.a5c19f7e.chunk.js.map

var _ = absol._;

window.confirmQuestion = function(title, content, yes = "OK") {
    var contentElement;
    if (typeof content !== "object") {
        contentElement = _({
            tag: "span",
            class: "module-delete-header-content",
            props: {
                innerHTML: content
            }
        })
    } else {
        contentElement = content;
    }
    var temp;
    var promiseComfirm = new Promise(function(resolve, reject) {
        temp = _({
            tag: "modal",
            class: "modal-delete-module",
            child: [{
                tag: "div",
                class: "module-delete-container",
                child: [{
                        tag: "div",
                        class: "module-delete-header",
                        child: [{
                                tag: "span",
                                class: "module-delete-header-title",
                                props: {
                                    innerHTML: title
                                }
                            },
                            {
                                tag: "div",
                                class: "module-delete-header-close-container",
                                on: {
                                    click: function(event) {
                                        temp.selfRemove();
                                        reject();
                                    }
                                },
                                child: [{
                                    tag: "i",
                                    class: ["module-delete-header-close", "material-icons"],
                                    props: {
                                        innerHTML: "close"
                                    }
                                }]
                            }
                        ]
                    },
                    {
                        tag: "div",
                        class: "module-delete-content",
                        child: [
                            contentElement
                        ]
                    },
                    {
                        tag: "div",
                        class: "module-delete-button",
                        child: [{
                            tag: "button",
                            class: "module-delete-button-yes",
                            on: {
                                click: function(event) {
                                    temp.selfRemove();
                                    resolve();
                                }
                            },
                            child: [{
                                tag: "span",
                                class: "module-delete-button-yes-label",
                                props: {
                                    innerHTML: yes
                                }
                            }]
                        }]
                    },
                ]
            }]
        })
    })

    temp.promiseComfirm = promiseComfirm;
    return temp;
}
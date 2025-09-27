//@ts-nocheck
import type { Plugin } from "suneditor/src/plugins/Plugin";
import { convertToSlug } from "@/shared/utils/slugify";

export const clearContentPlugin = {
  name: "clearContent",
  display: "command",
  title: "Xoá toàn bộ nội dung",
  buttonClass: "",
  innerHTML: '<i class="bi bi-trash3"></i>', // Icon tẩy

  add: function (core, targetElement) {
    const context = core.context;
    context.clearContent = { targetButton: targetElement };
  },

  action: function () {
    this.setContents(""); // Xóa toàn bộ nội dung trong editor
  },
};

export const increaseFontSizePlugin = {
  name: "increaseFontSize",
  display: "command",
  title: "Increase Font Size",
  buttonClass: "",
  innerHTML: '<i class="fas fa-plus"></i>',

  add: function (core, targetElement) {
    const context = core.context;
    context.increaseFontSize = { targetButton: targetElement };
  },

  action: function () {
    const selectionNode = this.getSelectionNode();
    if (!selectionNode || !(selectionNode instanceof HTMLElement)) return;

    let currentSize = parseInt(window.getComputedStyle(selectionNode).fontSize);
    let newSize = currentSize + 1 + "px";

    selectionNode.style.fontSize = newSize;
  },
};

//demo
export const plugin_command = {
  // @Required @Unique
  // plugin name
  name: "customCommand",
  // @Required
  // data display
  display: "command",

  // @Options
  title: "Add range tag",
  buttonClass: "",
  innerHTML: '<i class="fas fa-carrot"></i>',

  // @Required
  // add function - It is called only once when the plugin is first run.
  // This function generates HTML to append and register the event.
  // arguments - (core : core object, targetElement : clicked button element)
  add: function (core, targetElement) {
    const context = core.context;
    const rangeTag = core.util.createElement("div");
    core.util.addClass(rangeTag, "__se__format__range_custom");

    // @Required
    // Registering a namespace for caching as a plugin name in the context object
    context.customCommand = {
      targetButton: targetElement,
      tag: rangeTag,
    };
  },

  // @Override core
  // Plugins with active methods load immediately when the editor loads.
  // Called each time the selection is moved.
  active: function (element) {
    if (!element) {
      this.util.removeClass(this.context.customCommand.targetButton, "active");
    } else if (this.util.hasClass(element, "__se__format__range_custom")) {
      this.util.addClass(this.context.customCommand.targetButton, "active");
      return true;
    }

    return false;
  },

  // @Required, @Override core
  // The behavior of the "command plugin" must be defined in the "action" method.
  action: function () {
    const rangeTag = this.util.getRangeFormatElement(this.getSelectionNode());

    if (this.util.hasClass(rangeTag, "__se__format__range_custom")) {
      this.detachRangeFormatElement(rangeTag, null, null, false, false);
    } else {
      this.applyRangeFormatElement(
        this.context.customCommand.tag.cloneNode(false)
      );
    }
  },
};
//-----------------------------------------------------
import hljs from "highlight.js";

export const highlightCodePlugin = {
  name: "highlightCode",
  display: "command", // Change to 'command' instead of 'dialog'
  title: "Insert Code Block",
  buttonClass: "",
  innerHTML: '<i class="bi bi-code-square"></i>',

  // Add function - called when plugin is first run
  add: function (core) {
    const context = core.context;

    // Add highlight.js styles to editor
    // const editorStyles = document.createElement('style');
    // editorStyles.innerHTML = `
    //   .sun-editor .hljs {
    //     padding: 12px;
    //     border-radius: 4px;
    //     overflow: auto;
    //     font-family: monospace;
    //     white-space: pre;
    //     background-color: #f6f8fa;
    //   }
    //   .sun-editor pre[data-language] {
    //     position: relative;
    //     margin: 10px 0;
    //   }
    //   .sun-editor pre[data-language]::before {
    //     content: attr(data-language);
    //     position: absolute;
    //     top: 0;
    //     right: 0;
    //     padding: 2px 8px;
    //     font-size: 12px;
    //     color: #666;
    //     background: #e0e0e0;
    //     border-radius: 0 4px 0 4px;
    //   }
    // `;
    // document.head.appendChild(editorStyles);
  },

  // The action method - what happens when the button is clicked
  action: function () {
    console.log("highlightCode action called");
    const core = this;
    const util = core.util;

    // Show a simple prompt for language selection
    const language = prompt(
      "Enter code language (javascript, python, etc.):",
      "javascript"
    );
    if (!language) return; // User cancelled

    // Show prompt for code content
    const codeContent = prompt(
      "Enter your code:",
      `// Your code here\nconsole.log("Hello, world!");\n
    // Example: \nfunction greet() {\n  console.log("Hello, world!");\n}\ngreet();`
    );
    if (!codeContent) return; // User cancelled

    try {
      // Highlight the code
      const highlighted = hljs.highlight(codeContent, { language }).value;
      //const highlighted = hljs.highlightAuto(codeContent).value;

      // Create elements
      const preElement = util.createElement("pre");
      preElement.setAttribute("data-language", language);

      const codeElement = util.createElement("code");
      codeElement.className = `hljs language-${language}`;
      codeElement.innerHTML = highlighted;

      preElement.appendChild(codeElement);

      // Insert into editor
      core.insertNode(preElement);
    } catch (error) {
      console.error("Error highlighting code:", error);
      alert("Error highlighting code. Please try again.");
    }
  },
};

//import dialog from "suneditor/src/plugins/modules/dialog";

// Copy toàn bộ nội dung plugin bạn đã cung cấp và dán vào đây
// Đảm bảo sửa lại export cuối cùng:
export const customLink = {
  // @Required
  // plugin name
  name: "customLink",

  // @Required
  // data display
  display: "dialog",

  // @Required
  // add function - It is called only once when the plugin is first run.
  // This function generates HTML to append and register the event.
  // arguments - (core : core object, targetElement : clicked button element)
  add: function (core) {
    // If you are using a module, you must register the module using the "addModule" method.
    core.addModule(["dialog"]);

    // @Required
    // Registering a namespace for caching as a plugin name in the context object
    const context = core.context;
    context.customLink = {
      focusElement: null, // @Override // This element has focus when the dialog is opened.
      targetSelect: null,
      linkAnchorText: null,
      _linkAnchor: null,
    };

    /** link dialog */
    let link_dialog = this.setDialog(core);
    context.customLink.modal = link_dialog;
    context.customLink.focusElement =
      link_dialog.querySelector("._se_link_url");
    context.customLink.linkAnchorText =
      link_dialog.querySelector("._se_link_text");
    context.customLink.targetSelect =
      link_dialog.querySelector(".se-input-select");

    /** link controller */
    let link_controller = this.setController_LinkButton(core);
    context.customLink.linkController = link_controller;
    context.customLink._linkAnchor = null;

    /** add event listeners */
    link_dialog
      .querySelector("form")
      .addEventListener("submit", this.submit.bind(core));
    link_controller.addEventListener(
      "click",
      this.onClick_linkController.bind(core)
    );

    /** append html */
    context.dialog.modal.appendChild(link_dialog);

    /** append controller */
    context.element.relative.appendChild(link_controller);

    /** empty memory */
    (link_dialog = null), (link_controller = null);
  },

  /** dialog */
  setDialog: function (core) {
    const lang = core.lang;
    const dialog = core.util.createElement("DIV");
    const targetList = [
      { target: "_blank", name: "New window" },
      { target: "_parent", name: "Parent frame" },
      { target: "_top", name: "First frame", selected: true },
      { target: "AnyFrame", name: "Frame name" },
      { target: "_dialog", name: "Self defined dialog" },
    ];

    dialog.className = "se-dialog-content";
    dialog.style.display = "none";
    let html =
      "" +
      '<form class="editor_link">' +
      '<div class="se-dialog-header">' +
      '<button type="button" data-command="close" class="se-btn se-dialog-close" aria-label="Close" title="' +
      lang.dialogBox.close +
      '">' +
      core.icons.cancel +
      "</button>" +
      '<span class="se-modal-title">' +
      lang.dialogBox.linkBox.title +
      "</span>" +
      "</div>" +
      '<div class="se-dialog-body">' +
      '<div class="se-dialog-form">' +
      "<label>" +
      lang.dialogBox.linkBox.url +
      "</label>" +
      '<input class="se-input-form _se_link_url" type="text" />' +
      "</div>" +
      '<div class="se-dialog-form">' +
      "<label>" +
      lang.dialogBox.linkBox.text +
      '</label><input class="se-input-form _se_link_text" type="text" />' +
      "</div>" +
      '<div class="se-dialog-form se-dialog-form-footer">' +
      '<select class="se-input-select" title="links">';
    for (let i = 0, len = targetList.length, t, selected; i < len; i++) {
      t = targetList[i];
      selected = t.selected ? " selected" : "";
      html +=
        '<option value="' +
        t.target +
        '"' +
        selected +
        ">" +
        t.name +
        "</option>";
    }
    html +=
      "</select>" +
      "</div>" +
      "</div>" +
      '<div class="se-dialog-footer">' +
      '<button type="submit" class="se-btn-primary" title="' +
      lang.dialogBox.submitButton +
      '"><span>' +
      lang.dialogBox.submitButton +
      "</span></button>" +
      "</div>" +
      "</form>";

    dialog.innerHTML = html;

    return dialog;
  },

  /** modify controller button */
  setController_LinkButton: function (core) {
    const lang = core.lang;
    const icons = core.icons;
    const link_btn = core.util.createElement("DIV");

    link_btn.className = "se-controller se-controller-link";
    link_btn.innerHTML =
      "" +
      '<div class="se-arrow se-arrow-up"></div>' +
      '<div class="link-content"><span><a target="_blank" href=""></a>&nbsp;</span>' +
      '<div class="se-btn-group">' +
      '<button type="button" data-command="update" tabindex="-1" class="se-tooltip">' +
      icons.edit +
      '<span class="se-tooltip-inner"><span class="se-tooltip-text">' +
      lang.controller.edit +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="unlink" tabindex="-1" class="se-tooltip">' +
      icons.unlink +
      '<span class="se-tooltip-inner"><span class="se-tooltip-text">' +
      lang.controller.unlink +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="delete" tabindex="-1" class="se-tooltip">' +
      icons.delete +
      '<span class="se-tooltip-inner"><span class="se-tooltip-text">' +
      lang.controller.remove +
      "</span></span>" +
      "</button>" +
      "</div>" +
      "</div>";

    return link_btn;
  },

  // @Required, @Override dialog
  // This method is called when the plugin button is clicked.
  // Open the modal window here.
  open: function () {
    // open.call(core, pluginName, isModify)
    this.plugins.dialog.open.call(
      this,
      "customLink",
      "customLink" === this.currentControllerName
    );
  },

  submit: function (e) {
    this.showLoading();

    e.preventDefault();
    e.stopPropagation();

    const submitAction = function () {
      if (this.context.customLink.focusElement.value.trim().length === 0)
        return false;

      const contextLink = this.context.customLink;
      const url = contextLink.focusElement.value;
      const anchor = contextLink.linkAnchorText;
      const anchorText = anchor.value.length === 0 ? url : anchor.value;

      // When opened for modification "this.context.dialog.updateModal" is true
      if (!this.context.dialog.updateModal) {
        const oA = this.util.createElement("A");
        oA.href = url;
        oA.textContent = anchorText;
        oA.target = contextLink.targetSelect.selectedOptions[0].value;

        const selectedFormats = this.getSelectedElements();
        if (selectedFormats.length > 1) {
          const oFormat = this.util.createElement(selectedFormats[0].nodeName);
          oFormat.appendChild(oA);
          this.insertNode(oFormat);
        } else {
          this.insertNode(oA);
        }

        this.setRange(
          oA.childNodes[0],
          0,
          oA.childNodes[0],
          oA.textContent.length
        );
      } else {
        contextLink._linkAnchor.href = url;
        contextLink._linkAnchor.textContent = anchorText;
        contextLink._linkAnchor.target =
          contextLink.targetSelect.selectedOptions[0].value;

        // set range
        this.setRange(
          contextLink._linkAnchor.childNodes[0],
          0,
          contextLink._linkAnchor.childNodes[0],
          contextLink._linkAnchor.textContent.length
        );
      }

      // history stack
      this.history.push(false);

      contextLink.focusElement.value = "";
      contextLink.linkAnchorText.value = "";
    }.bind(this);

    try {
      submitAction();
    } finally {
      this.plugins.dialog.close.call(this);
      this.closeLoading();
      this.focus();
    }

    return false;
  },

  // @Override core
  // Plugins with active methods load immediately when the editor loads.
  // Called each time the selection is moved.
  active: function (element) {
    if (!element) {
      if (
        this.controllerArray.indexOf(this.context.customLink.linkController) >
        -1
      ) {
        this.controllersOff();
      }
    } else if (
      this.util.isAnchor(element) &&
      element.getAttribute("data-image-link") === null
    ) {
      if (
        this.controllerArray.indexOf(this.context.customLink.linkController) < 0
      ) {
        this.plugins.customLink.call_controller.call(this, element);
      }
      return true;
    }

    return false;
  },

  // @Override dialog
  // This method is called just before the dialog opens.
  // If "update" argument is true, it is not a new call, but a call to modify an already created element.
  on: function (update) {
    if (!update) {
      this.plugins.customLink.init.call(this);
      this.context.customLink.linkAnchorText.value =
        this.getSelection().toString();
    } else if (this.context.customLink._linkAnchor) {
      // "update" and "this.context.dialog.updateModal" are always the same value.
      // This code is an exception to the "link" plugin.
      this.context.dialog.updateModal = true;
      this.context.customLink.focusElement.value =
        this.context.customLink._linkAnchor.href;
      this.context.customLink.linkAnchorText.value =
        this.context.customLink._linkAnchor.textContent;
      this.context.customLink.targetSelect.value =
        this.context.customLink._linkAnchor.target || "";
    }
  },

  call_controller: function (selectionATag) {
    this.editLink = this.context.customLink._linkAnchor = selectionATag;
    const linkBtn = this.context.customLink.linkController;
    const link = linkBtn.querySelector("a");

    link.href = selectionATag.href;
    link.title = selectionATag.textContent;
    link.textContent = selectionATag.textContent;

    const offset = this.util.getOffset(
      selectionATag,
      this.context.element.wysiwygFrame
    );
    linkBtn.style.top = offset.top + selectionATag.offsetHeight + 10 + "px";
    linkBtn.style.left =
      offset.left - this.context.element.wysiwygFrame.scrollLeft + "px";

    linkBtn.style.display = "block";

    const overLeft =
      this.context.element.wysiwygFrame.offsetWidth -
      (linkBtn.offsetLeft + linkBtn.offsetWidth);
    if (overLeft < 0) {
      linkBtn.style.left = linkBtn.offsetLeft + overLeft + "px";
      linkBtn.firstElementChild.style.left = 20 - overLeft + "px";
    } else {
      linkBtn.firstElementChild.style.left = "20px";
    }

    // Show controller at editor area (controller elements, function, "controller target element(@Required)", "controller name(@Required)", etc..)
    this.controllersOn(linkBtn, selectionATag, "customLink");
  },

  onClick_linkController: function (e) {
    e.stopPropagation();

    const command = e.target.getAttribute("data-command");
    if (!command) return;

    e.preventDefault();

    if (/update/.test(command)) {
      const contextLink = this.context.customLink;
      contextLink.focusElement.value = contextLink._linkAnchor.href;
      contextLink.linkAnchorText.value = contextLink._linkAnchor.textContent;
      contextLink.targetSelect.value = contextLink.targetSelect.value;
      this.plugins.dialog.open.call(this, "customLink", true);
    } else if (/unlink/.test(command)) {
      const sc = this.util.getChildElement(
        this.context.customLink._linkAnchor,
        function (current) {
          return current.childNodes.length === 0 || current.nodeType === 3;
        },
        false
      );
      const ec = this.util.getChildElement(
        this.context.customLink._linkAnchor,
        function (current) {
          return current.childNodes.length === 0 || current.nodeType === 3;
        },
        true
      );
      this.setRange(sc, 0, ec, ec.textContent.length);
      this.nodeChange(null, null, ["A"], false);
    } else {
      /** delete */
      this.util.removeItem(this.context.customLink._linkAnchor);
      this.context.customLink._linkAnchor = null;
      this.focus();

      // history stack
      this.history.push(false);
    }

    this.controllersOff();
  },

  // @Required, @Override dialog
  // This method is called when the dialog window is closed.
  // Initialize the properties.
  init: function () {
    const contextLink = this.context.customLink;
    contextLink.linkController.style.display = "none";
    contextLink._linkAnchor = null;
    contextLink.focusElement.value = "";
    contextLink.linkAnchorText.value = "";
    contextLink.targetSelect.selectedIndex = 0;
  },
};

export const customCodeHighlight = {
  // @Required
  // plugin name
  name: "customCodeHighlight",
  title: "Thêm khối code",
  buttonClass: "",
  innerHTML: '<i class="bi bi-code-square"></i>',

  // @Required
  // data display
  display: "dialog",

  // @Required
  // add function - It is called only once when the plugin is first run.
  // This function generates HTML to append and register the event.
  // arguments - (core : core object, targetElement : clicked button element)
  add: function (core) {
    // If you are using a module, you must register the module using the "addModule" method.
    core.addModule(["dialog"]);

    // @Required
    // Registering a namespace for caching as a plugin name in the context object
    const context = core.context;
    context.customCodeHighlight = {
      focusElement: null, // @Override // This element has focus when the dialog is opened.
      languageSelect: null,
      codeTextarea: null,
      positionRadios: null, // <<< THÊM MỚI
      _codeBlock: null,
    };

    /** code dialog */
    let code_dialog = this.setDialog(core);
    context.customCodeHighlight.modal = code_dialog;
    context.customCodeHighlight.focusElement =
      code_dialog.querySelector("._se_code_textarea");
    context.customCodeHighlight.codeTextarea =
      code_dialog.querySelector("._se_code_textarea");
    context.customCodeHighlight.languageSelect = code_dialog.querySelector(
      "._se_language_select"
    );
    // <<< THÊM MỚI: Lấy tham chiếu đến các nút radio vị trí
    context.customCodeHighlight.positionRadios = code_dialog.querySelectorAll(
      'input[name="_se_code_position"]'
    );

    /** code controller */
    let code_controller = this.setController_CodeButton(core);
    context.customCodeHighlight.codeController = code_controller;
    context.customCodeHighlight._codeBlock = null;

    /** add event listeners */
    code_dialog
      .querySelector("form")
      .addEventListener("submit", this.submit.bind(core));
    code_controller.addEventListener(
      "click",
      this.onClick_codeController.bind(core)
    );

    /** append html */
    context.dialog.modal.appendChild(code_dialog);

    /** append controller */
    context.element.relative.appendChild(code_controller);

    /** empty memory */
    (code_dialog = null), (code_controller = null);
  },

  /** dialog */
  setDialog: function (core) {
    const lang = core.lang;
    const dialog = core.util.createElement("DIV");

    // Common programming languages
    const languageList = [
      { value: "javascript", name: "JavaScript" },
      { value: "typescript", name: "TypeScript" },
      { value: "python", name: "Python" },
      { value: "java", name: "Java" },
      { value: "cpp", name: "C++" },
      { value: "c", name: "C" },
      { value: "csharp", name: "C#" },
      { value: "php", name: "PHP" },
      { value: "ruby", name: "Ruby" },
      { value: "go", name: "Go" },
      { value: "rust", name: "Rust" },
      { value: "swift", name: "Swift" },
      { value: "kotlin", name: "Kotlin" },
      { value: "html", name: "HTML" },
      { value: "css", name: "CSS" },
      { value: "scss", name: "SCSS" },
      { value: "json", name: "JSON" },
      { value: "xml", name: "XML" },
      { value: "yaml", name: "YAML" },
      { value: "sql", name: "SQL" },
      { value: "bash", name: "Bash" },
      { value: "powershell", name: "PowerShell" },
      { value: "markdown", name: "Markdown" },
      { value: "plaintext", name: "Plain Text", selected: true },
    ];

    dialog.className = "se-dialog-content";
    dialog.style.display = "none";

    let html =
      "" +
      '<form class="editor_code">' +
      '<div class="se-dialog-header">' +
      '<button type="button" data-command="close" class="se-btn se-dialog-close" aria-label="Close" title="' +
      (lang.dialogBox?.close || "Close") +
      '">' +
      core.icons.cancel +
      "</button>" +
      '<span class="se-modal-title">Thêm khối code</span>' +
      "</div>" +
      '<div class="se-dialog-body">' +
      '<div class="se-dialog-form">' +
      "<label>Chọn ngôn ngữ</label>" +
      '<select class="se-input-select _se_language_select" title="Chọn ngôn ngữ">';

    // Add language options
    for (
      let i = 0, len = languageList.length, lang_item, selected;
      i < len;
      i++
    ) {
      lang_item = languageList[i];
      selected = lang_item.selected ? " selected" : "";
      html +=
        '<option value="' +
        lang_item.value +
        '"' +
        selected +
        ">" +
        lang_item.name +
        "</option>";
    }

    html +=
      "</select>" +
      "</div>" +
      // <<< THÊM MỚI: HTML cho phần chọn vị trí
      '<div class="se-dialog-form">' +
      "<label>Vị trí</label>" +
      '<div class="se-radio-form-group">' +
      '<label><input type="radio" name="_se_code_position" value="left" checked> Trái</label>' +
      '<label><input type="radio" name="_se_code_position" value="center"> Giữa</label>' +
      '<label><input type="radio" name="_se_code_position" value="right"> Phải</label>' +
      '<label><input type="radio" name="_se_code_position" value="full"> Toàn bộ</label>' +
      "</div>" +
      "</div>" +
      // >>> HẾT PHẦN THÊM MỚI
      '<div class="se-dialog-form">' +
      "<label>Code</label>" +
      `<textarea class="se-input-form _se_code_textarea" 
       placeholder="Nhập code vào đây..." 
       rows="10" 
       style="font-family: 'Courier New', Consolas, monospace; 
       white-space: pre; 
       resize: both; 
       spellcheck: false;
       width: 100%;
       height: 100%;
       overflow-wrap: normal;"></textarea>` +
      "</div>" +
      "</div>" +
      '<div class="se-dialog-footer">' +
      '<button type="submit" class="se-btn-primary" title="Thêm"><span>Thêm</span></button>' +
      "</div>" +
      "</form>";

    dialog.innerHTML = html;
    return dialog;
  },

  /** modify controller button */
  setController_CodeButton: function (core) {
    const lang = core.lang;
    const icons = core.icons;
    const code_btn = core.util.createElement("DIV");

    code_btn.className = "se-controller se-controller-code-highlight";
    code_btn.innerHTML =
      "" +
      '<div class="se-arrow se-arrow-up"></div>' +
      '<div class="code-content"><span>Code Block</span>' +
      '<div class="se-btn-group">' +
      '<button type="button" data-command="update" tabindex="-1" class="se-tooltip">' +
      icons.edit +
      '<span class="se-tooltip-inner"><span class="se-tooltip-text">' +
      (lang.controller?.edit || "Edit") +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="delete" tabindex="-1" class="se-tooltip">' +
      icons.delete +
      '<span class="se-tooltip-inner"><span class="se-tooltip-text">' +
      (lang.controller?.remove || "Remove") +
      "</span></span>" +
      "</button>" +
      "</div>" +
      "</div>";

    return code_btn;
  },

  // Helper function to apply syntax highlighting
  applyHighlighting: function (codeElement, codeText, language) {
    // Reset classes
    codeElement.className = "";

    if (language && language !== "plaintext") {
      codeElement.className = `hljs language-${language}`;

      // Apply syntax highlighting if hljs is available
      if (typeof hljs !== "undefined") {
        try {
          // Use hljs to highlight the code
          const highlightedCode = hljs.highlight(codeText, {
            language: language,
            ignoreIllegals: true,
          });
          codeElement.innerHTML = highlightedCode.value;
          return true;
        } catch (error) {
          console.warn("Highlight.js error:", error);
          // Fallback to plain text
          codeElement.textContent = codeText;
          return false;
        }
      }
    }

    // If no highlighting or error, use plain text
    codeElement.textContent = codeText;
    return false;
  },

  // @Required, @Override dialog
  // This method is called when the plugin button is clicked.
  // Open the modal window here.
  open: function () {
    // open.call(core, pluginName, isModify)
    this.plugins.dialog.open.call(
      this,
      "customCodeHighlight",
      "customCodeHighlight" === this.currentControllerName
    );
  },

  submit: function (e) {
    this.showLoading();

    e.preventDefault();
    e.stopPropagation();

    const submitAction = function () {
      const contextCode = this.context.customCodeHighlight;
      const codeText = contextCode.codeTextarea.value.trim();
      const selectedLanguage = contextCode.languageSelect.value;

      // <<< THÊM MỚI: Lấy giá trị vị trí đã chọn
      let selectedPosition = "left";
      for (let i = 0; i < contextCode.positionRadios.length; i++) {
        if (contextCode.positionRadios[i].checked) {
          selectedPosition = contextCode.positionRadios[i].value;
          break;
        }
      }

      if (codeText.length === 0) return false;

      // <<< THÊM MỚI: Hàm helper để áp dụng style vị trí
      const applyPositionStyle = (element, position) => {
        element.style.margin = "0";
        element.style.width = "auto";
        element.style.display = 'table'; // Use table display to respect content width but allow centering

        switch (position) {
          case "center":
            element.style.marginLeft = "auto";
            element.style.marginRight = "auto";
            break;
          case "right":
            element.style.marginLeft = "auto";
            element.style.marginRight = "0";
            break;
          case "full":
            element.style.width = "100%";
            element.style.display = 'block';
            break;
          case "left":
          default:
            element.style.marginLeft = "0";
            element.style.marginRight = "auto";
            break;
        }
        element.setAttribute("data-position", position);
      };

      // When opened for modification "this.context.dialog.updateModal" is true
      if (!this.context.dialog.updateModal) {
        // Create new code block
        const preElement = this.util.createElement("PRE");
        const codeElement = this.util.createElement("CODE");

        // Apply syntax highlighting
        this.plugins.customCodeHighlight.applyHighlighting.call(
          this,
          codeElement,
          codeText,
          selectedLanguage
        );

        const wrapperDiv = this.util.createElement("DIV");
        wrapperDiv.style.position = "relative";
        
        preElement.appendChild(codeElement);
        wrapperDiv.appendChild(preElement);

        // Style PRE element
        preElement.style.backgroundColor = "#b9a3ff";
        preElement.style.color = "#000";
        preElement.style.borderRadius = "4px";
        preElement.style.padding = "1em";
        preElement.style.overflow = "auto";
        preElement.style.fontFamily = "'Courier New', Consolas, monospace";
        preElement.style.fontSize = "14px";
        preElement.style.lineHeight = "1.4";
        preElement.style.margin = "0px";
        
        // <<< THÊM MỚI: Áp dụng style vị trí cho wrapper
        applyPositionStyle(wrapperDiv, selectedPosition);

        this.insertNode(wrapperDiv);
        this.setRange(wrapperDiv, 0, wrapperDiv, 1);
      } else {
        // Update existing code block
        const preElement = contextCode._codeBlock;
        const codeElement = preElement.querySelector("code");
        const wrapperDiv = preElement.parentElement; // <<< CẬP NHẬT: Lấy wrapper

        // Apply syntax highlighting to the existing code element
        this.plugins.customCodeHighlight.applyHighlighting.call(
          this,
          codeElement,
          codeText,
          selectedLanguage
        );
        
        // <<< THÊM MỚI: Áp dụng style vị trí cho wrapper
        applyPositionStyle(wrapperDiv, selectedPosition);

        // Restore selection
        this.setRange(
          preElement,
          0,
          preElement,
          preElement.childNodes.length
        );
      }

      // History stack
      this.history.push(false);

      // Clear form (đã được chuyển vào init)
    }.bind(this);

    try {
      submitAction();
    } finally {
      this.plugins.dialog.close.call(this);
      this.closeLoading();
      this.focus();
    }

    return false;
  },

  // @Override core
  active: function (element) {
    if (!element) {
      if (
        this.controllerArray.indexOf(
          this.context.customCodeHighlight.codeController
        ) > -1
      ) {
        this.controllersOff();
      }
    } else if (element.nodeName === "PRE" && element.querySelector("code")) {
      if (
        this.controllerArray.indexOf(
          this.context.customCodeHighlight.codeController
        ) < 0
      ) {
        this.plugins.customCodeHighlight.call_controller.call(this, element);
      }
      return true;
    }

    return false;
  },

  // @Override dialog
  on: function (update) {
    if (!update) {
      this.plugins.customCodeHighlight.init.call(this);
    } else if (this.context.customCodeHighlight._codeBlock) {
      this.context.dialog.updateModal = true;
      const preElement = this.context.customCodeHighlight._codeBlock;
      const codeElement = preElement.querySelector("code");
      const wrapperDiv = preElement.parentElement; // <<< CẬP NHẬT: Lấy wrapper

      let plainText = codeElement.textContent || codeElement.innerText || "";

      this.context.customCodeHighlight.codeTextarea.value = plainText;

      const className = codeElement.className;
      const languageMatch = className.match(/language-(\w+)/);
      const selectElement = this.context.customCodeHighlight.languageSelect;
      if (languageMatch && languageMatch[1]) {
        const detectedLang = languageMatch[1];
        const options = Array.from(selectElement.options);
        const languageExists = options.some(
          (option) => option.value === detectedLang
        );
        selectElement.value = languageExists ? detectedLang : "plaintext";
      } else {
        selectElement.value = "plaintext";
      }
      
      // <<< THÊM MỚI: Đặt lại radio button vị trí
      const currentPosition = wrapperDiv.getAttribute("data-position") || "left";
      const positionRadios = this.context.customCodeHighlight.positionRadios;
      for (let i = 0; i < positionRadios.length; i++) {
        positionRadios[i].checked = positionRadios[i].value === currentPosition;
      }
    }
  },

  call_controller: function (codeBlock) {
    this.editCode = this.context.customCodeHighlight._codeBlock = codeBlock;
    const codeBtn = this.context.customCodeHighlight.codeController;
    const wrapperDiv = codeBlock.parentElement; // <<< CẬP NHẬT: Sử dụng wrapper để tính toán vị trí

    const offset = this.util.getOffset(
      wrapperDiv,
      this.context.element.wysiwygFrame
    );
    codeBtn.style.top = offset.top + wrapperDiv.offsetHeight + 5 + "px";
    codeBtn.style.left =
      offset.left - this.context.element.wysiwygFrame.scrollLeft + "px";
    codeBtn.style.display = "block";

    const overLeft =
      this.context.element.wysiwygFrame.offsetWidth -
      (codeBtn.offsetLeft + codeBtn.offsetWidth);
    if (overLeft < 0) {
      codeBtn.style.left = codeBtn.offsetLeft + overLeft + "px";
      codeBtn.firstElementChild.style.left = 20 - overLeft + "px";
    } else {
      codeBtn.firstElementChild.style.left = "20px";
    }

    this.controllersOn(codeBtn, codeBlock, "customCodeHighlight");
  },

  onClick_codeController: function (e) {
    e.stopPropagation();

    const command = e.target.getAttribute("data-command");
    if (!command) return;

    e.preventDefault();

    if (/update/.test(command)) {
      this.plugins.dialog.open.call(this, "customCodeHighlight", true);
    } else {
      /** delete */
      // <<< CẬP NHẬT: Xóa thẻ div cha thay vì chỉ xóa thẻ pre
      this.util.removeItem(this.context.customCodeHighlight._codeBlock.parentElement);
      this.context.customCodeHighlight._codeBlock = null;
      this.focus();

      this.history.push(false);
    }

    this.controllersOff();
  },

  // @Required, @Override dialog
  init: function () {
    const contextCode = this.context.customCodeHighlight;
    contextCode.codeController.style.display = "none";
    contextCode._codeBlock = null;
    contextCode.codeTextarea.value = "";
    
    // Reset language select to default ('plaintext')
    const langSelect = contextCode.languageSelect;
    for (let i = 0; i < langSelect.options.length; i++) {
        if(langSelect.options[i].value === 'plaintext') {
            langSelect.selectedIndex = i;
            break;
        }
    }

    // <<< THÊM MỚI: Reset radio button về trạng thái mặc định (trái)
    const positionRadios = contextCode.positionRadios;
    if (positionRadios && positionRadios.length > 0) {
        positionRadios.forEach(radio => radio.checked = false);
        positionRadios[0].checked = true;
    }
  },
};

export const AutoHeadingIdPlugin: Plugin = {
  name: "autoHeadingId",
  display: "command",
  title: "Đánh dấu mục lục",
  innerHTML: "<b>ID</b>",
  buttonClass: "",

  add(core) {
    core.context.autoHeadingId = {}; // vẫn cần context để tuân chuẩn
  },

  active() {
    return false;
  },

  action() {
    const core = this;
    const selectionNode = core.getSelectionNode();
    const headingEl = this.util.getFormatElement(selectionNode);

    if (!headingEl) return;

    const tag = headingEl.tagName.toLowerCase();
    if (!/^h[1-6]$/.test(tag)) return;

    const text = headingEl.textContent?.trim() || "";
    if (!text) return;

    const id = convertToSlug(text);
    headingEl.id = id;
    headingEl.textContent = `# ${text}`;

    core.history.push(); // đánh dấu trước khi thay đổi
    // core._setContents(core.getContents()); // cập nhật nội dung
    // core.history.push(); // đánh dấu sau khi thay đổi
  },
};

export const setupCodeHighlighting = (editor) => {
  // We can add this functionality later once the basic plugin works
  const originalGetContents = editor.getContents;

  // Override getContents to apply highlighting
  editor.getContents = function () {
    const content = originalGetContents.call(this);
    return highlightCodePlugin.highlight(content);
  };
};
//-----------------------------------------------------
export const warningBlockPlugin = {
  name: "warningBlock",
  display: "command", // Change to 'command' instead of 'dialog'
  title: "Thêm khối cảnh báo",
  buttonClass: "",
  innerHTML: '<i class="bi bi-exclamation-triangle"></i>',

  // Add function - called when plugin is first run
  add: function (core) {
    const context = core.context;
  },

  // The action method - what happens when the button is clicked
  action: function () {
    const core = this;
    const util = core.util;

    const warningBlock = util.createElement("div");
    warningBlock.className = "warning-block"; // Add a class for styling
    warningBlock.innerHTML = "<strong>⚠️</strong> Lưu ý:";

    warningBlock.style.backgroundColor = "#f4b12433";
    warningBlock.style.border = "5px solid #f4b124";
    warningBlock.style.padding = "1rem";
    warningBlock.style.margin = "0 0 10px";
    warningBlock.style.borderRadius = "5px";
    warningBlock.style.display = "inline-block";

    // Insert into editor
    core.insertNode(warningBlock);
  },
};

/*
 *   Copyright (c) 2020 Johannes Thorén
 *   All rights reserved.

 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */


let id = 0;

let toChange = "none"
let style = ["","","","",""]
let styleStr = "";

let font_size = 12

function style_check() {
    switch (toChange) {
        case "reset":
            style[0] = "font-size:12pt;"
            style[1] = "text-decoration:none;"
            style[2] = "font-weight:normal;"
            style[3] = "font-style:none;"
            style[4] = "width: 100%; display:inline-block; text-align:left"
            document.getElementById("font_size_text").textContent = "font size [12pt]"
            break
        case "font_size":
            style[0] = "font-size:"+font_size+"pt;"
            document.getElementById("font_size_text").textContent = "font size ["+font_size+"pt]"
            break
        case "text_style_uline":
            style[1] = "text-decoration:underline;"
            break
        case "text_style_bold":
            style[2] = "font-weight:bold;"
            break
        case "text_style_italic":
            style[3] = "font-style:italic;"
            break
        case "align_center":
            style[4] = "width: 100%; display:inline-block; text-align:center;"
            break
        case "align_left":
            style[4] = "width: 100%; display:inline-block; text-align:left"
            break
        case "align_right":
            style[4] = "width: 100%; display:inline-block; text-align:right;"
            break
    }

    console.log(style)

    for(i in style) {
        if(i != "") {
            styleStr = styleStr + style[i]
        }
    }

}

function setStyle() {
    style_check()

    var sel, range, node;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = window.getSelection().getRangeAt(0);

            var html = '<span style="' + styleStr + '">' + range + '</span>'
            range.deleteContents();

            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.collapse(false);
        range.replace(html);
    }
    styleStr = ""
}
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

var btn_github_login = new Vue({
    el: '#btn_github_login',
    methods: {
        fn_github_login: function (event) {
            if (event) {
                usr_data.auth_token = prompt("github usertoken")
            }
            else {
                alert("something went wrong!")
            }
        }
    }
})

var btn_load_event = new Vue({
    el: '#btn_load',
    methods: {
        fn_load: function (event) {
            if (event) {
                if (!gists_data.gist_id) {gists_data.gist_id = prompt("gist id")}
                get_gist_data()
            }
            else {
                alert("something went wrong!")
            }
        }
    }
})

var btn_save_event = new Vue({
    el: '#btn_save',
    methods: {
        fn_save: function (event) {
            if (event) {

            }
            else {
                alert("something went wrong!")
            }
        }
    }
})

var btn_menu_event = new Vue({
    el: '#btn_menu',
    methods: {
        fn_menu: function (event) {
            if (event) {

            }
            else {
                alert("something went wrong!")
            }
        }
    }
})

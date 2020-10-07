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

async function fetch_api() {
    const url = "https://api.github.com"
    const response = await fetch(url)
    const result = await response.json()

    console.log(result)
}

async function get_gist_data() {
    const request = new Request("https://api.github.com/gists/"+usr_data.gist_id, {
        method: "GET",
        headers: { "Authorization": "token " + usr_data.auth_token }
    })

    //fetches the data from github
    const response = await fetch(request)

    //const response = await fetch(url);
    const result = await response.json()

    //console.log("test1")
    gists_data.request_result = result
}

async function get_manager_gist() {

}
//6d514a76f8b55a8f555c838fdd0fb7b7dea9d03a
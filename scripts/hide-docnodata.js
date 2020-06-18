// ==UserScript==
// @name         eteams
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @grant        none
// @include      *://*.eteams.cn/*
// @include      *://eteams.cn/*
// @run-at       document-end
// ==/UserScript==
/* globals jQuery, $ */

(function() {
    'use strict';

    // Your code here...
    const noblank = /[^\u0000-\u0020\u007F\u0070]/g
    var documentSummaryId, interval

    (new MutationObserver(check)).observe(document.body, {childList: true, subtree: true})
    function check(mutations, observer){
        var documentSummary = document.body.querySelector('.document-summary')
        if(documentSummary && documentSummary.tagName.toLowerCase() == 'iframe') {
            if(documentSummaryId && documentSummaryId == documentSummary.id) return
            if(documentSummaryId && documentSummaryId != documentSummary.id && interval){
                clearInterval(interval)
            }
            documentSummaryId = documentSummary.id
            var innerHtml = getIframeInnerHtml(documentSummary);
            var times = 0
            interval = setInterval(checkDocNodata, 500)
            function checkDocNodata() {
                times++
                var docNodataContain = innerHtml.querySelector('.doc-nodata-contain')
                if (docNodataContain || allBlanks(innerHtml.body)) {
                    documentSummary.style.height = '0px'
                    clearInterval(interval)
                }
                else if(times < 15){
                    return checkDocNodata
                }else {
                    clearInterval(interval)
                }
            }
        }
    }

    function allBlanks(body) {
        if(body && body.childElementCount == 1) {
            var child = body.children[0]
            if(child.localName != 'p') return false
            if(child.textContent != null && child.textContent.length == 0){
                return true
            }
        }
        return false
    }

    function getIframeInnerHtml(iframe) {
        if (iframe){
            return iframe.contentDocument || iframe.contentWindow.document
        }
        return null
    }

})();
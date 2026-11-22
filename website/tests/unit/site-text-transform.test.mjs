// Runs siteTextTransform inside Vue's real template compiler, so a change in
// Vue's node types or in how it compiles unknown names shows up here.

import assert from "node:assert/strict";
import { test } from "node:test";
import { compileTemplate } from "vue/compiler-sfc";
import { siteTextTransform } from "../../site-config.mjs";

const CONFIG = { heroHeadline: "Hello there", repoUrl: "https://github.com/a/b", featuredTrsIds: [] };

function compile(source) {
    const { code, errors } = compileTemplate({
        source,
        filename: "Test.vue",
        id: "test",
        compilerOptions: { nodeTransforms: [siteTextTransform(CONFIG)] },
    });
    assert.deepEqual(errors, []);
    return code;
}

test("a bare constant in a template becomes static text", () => {
    const code = compile("<h1>{{ __SITE_HERO_HEADLINE__ }}</h1>");
    assert.match(code, /"Hello there"/);
    assert.doesNotMatch(code, /__SITE_/);
});

test("ordinary bindings are left alone", () => {
    assert.match(compile("<h1>{{ workflow.name }}</h1>"), /_ctx\.workflow\.name/);
});

test("a constant that isn't a string can't be template text", () => {
    assert.throws(() => compile("<p>{{ __SITE_FEATURED_TRS_IDS__ }}</p>"), /isn't a string/);
});

// Vue compiles these to _ctx.__SITE_...__, which the build's define never
// replaces, so they would render as nothing
test("any other use of a constant in a template is refused", () => {
    for (const source of [
        '<a :href="__SITE_REPO_URL__">x</a>',
        '<p>{{ __SITE_HERO_HEADLINE__ + "!" }}</p>',
        '<p v-if="__SITE_HERO_HEADLINE__">x</p>',
        "<p>{{ __SITE_MISSPELLED__ }}</p>",
    ]) {
        assert.throws(() => compile(source), /<script setup>/, source);
    }
});

test("a constant in a v-for or a self-closing tag is refused too", () => {
    for (const source of [
        '<li v-for="id in __SITE_FEATURED_TRS_IDS__">{{ id }}</li>',
        '<img :alt="__SITE_HERO_HEADLINE__" />',
    ]) {
        assert.throws(() => compile(source), /<script setup>/, source);
    }
});

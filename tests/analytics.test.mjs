import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import ts from 'typescript';
const source = fs.readFileSync(new URL('../app/lib/analytics.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText;
const sandbox = {exports: {}};
vm.runInNewContext(compiled, sandbox);
const {summarizeAnalytics} = sandbox.exports;
test('aggregates pages, visitors, session time and Malaysia calendar days', () => {
  const rows = [
    {id:'1',visitor_id:'a',session_id:'s1',path:'/',referrer:'Direct',device:'Desktop',created_at:'2026-10-26T17:00:00Z',active_seconds:20},
    {id:'2',visitor_id:'a',session_id:'s1',path:'/contact',referrer:'Direct',device:'Desktop',created_at:'2026-10-26T17:01:00Z',active_seconds:40},
    {id:'3',visitor_id:'b',session_id:'s2',path:'/contact',referrer:'google.com',device:'Mobile',created_at:'2026-10-26T15:00:00Z',active_seconds:0},
  ];
  const result = summarizeAnalytics(rows, 7, new Date('2026-10-27T03:00:00Z'));
  assert.equal(result.views, 3); assert.equal(result.visitors, 2);
  assert.equal(result.sessions, 2); assert.equal(result.averageSession, 30);
  assert.equal(result.bounceRate, 50); assert.equal(result.pages[0].path, '/contact');
  assert.equal(result.pages[0].visitors, 2); assert.equal(result.pages[0].averageTime, 20);
  assert.equal(result.daily.length, 7); assert.equal(result.daily.at(-1).views, 2);
});
test('empty reports have finite zero metrics and zero-filled dates', () => {
  const result = summarizeAnalytics([], 30);
  assert.equal(result.averageTime, 0); assert.equal(result.bounceRate, 0);
  assert.equal(result.daily.length, 30); assert.equal(result.pages.length, 0);
});
test('tracker deduplicates routes, excludes admin and sends cumulative visible time', () => {
  let clock = 0, count = 0, interval;
  const events = {}, sent = [];
  const storage = {getItem: () => null, setItem: () => {}};
  const location = {pathname: '/'};
  const context = {
    window: {}, navigator: {sendBeacon: (_url, blob) => {sent.push(blob); return true;}},
    document: {currentScript: {src:'https://chinwei.my/analytics.js'}, referrer:'https://google.com/search?q=private', visibilityState:'visible', addEventListener: (n, fn) => {events[n] = fn;}},
    location, history: {pushState: (_a,_b,path) => {location.pathname = path;}, replaceState: (_a,_b,path) => {location.pathname = path;}},
    localStorage: storage, sessionStorage: storage, crypto: {randomUUID: () => `id-${++count}`},
    performance: {now: () => clock}, Date, URL, Blob: class {constructor(parts) {this.body = JSON.parse(parts[0]);}},
    addEventListener: (n,fn) => {events[n] = fn;}, setInterval: fn => {interval = fn;},
  };
  vm.runInNewContext(fs.readFileSync(new URL('../public/analytics.js', import.meta.url), 'utf8'), context);
  assert.equal(sent.length, 1); assert.equal(sent[0].body.referrer, 'google.com');
  context.history.replaceState(null,'','/'); assert.equal(sent.length, 1);
  clock = 15000; interval(); assert.equal(sent.at(-1).body.seconds, 15);
  context.history.pushState(null,'','/contact'); assert.equal(sent.at(-1).body.path, '/contact');
  const contactId = sent.at(-1).body.id;
  clock = 30000; interval(); assert.equal(sent.at(-1).body.id, contactId); assert.equal(sent.at(-1).body.seconds, 15);
  context.document.visibilityState = 'hidden'; clock = 45000; interval(); assert.equal(sent.at(-1).body.seconds, 15);
  context.history.pushState(null,'','/admin'); const before = sent.length;
  interval(); assert.equal(sent.length, before);
});

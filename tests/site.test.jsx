import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from '@babel/parser';
import traverseModule from '@babel/traverse';
import {LanguageProvider} from '../src/i18n/LanguageProvider.jsx';
import {messages, normalizeLanguage, translate, missingTranslations} from '../src/i18n/translate.js';
import AppRoutes, {isCatSlug,normalizePath} from '../src/AppRoutes.jsx';
import BookingModal from '../BookingModal.jsx';
import SupportModal from '../SupportModal.jsx';
import {catProfiles} from '../src/data/catProfiles.js';
import {cats,rules,faqItems,events,menuSlides} from '../src/data/homeData.js';
import {getBookingTimes,warsawTime} from '../src/lib/booking.js';
import {normalizeAdminData,validAdminData} from '../src/data/adminData.js';
import {SiteContentProvider} from '../src/content/SiteContentProvider.jsx';

const locales=['pl','ru','en'];
const render = (node,locale,path='/') => renderToStaticMarkup(<LanguageProvider initialLanguage={locale}><SiteContentProvider initialData={normalizeAdminData(null)}><StaticRouter location={path}>{node}</StaticRouter></SiteContentProvider></LanguageProvider>);
const neutral = new Set(['Luna','Mochi','Pixel','luna','mochi','pixel']);
function auditData(value, path='') {
  if (typeof value === 'string') {
    if (/^https?:|^\/images\//.test(value) || !/\p{L}/u.test(value) || neutral.has(value)) return;
    assert.ok(messages[value], 'Missing data translation: '+path+' '+value);
    for(const locale of locales) assert.ok(messages[value][locale], 'Missing '+locale+': '+value);
  } else if (Array.isArray(value)) value.forEach((item,i)=>auditData(item,path+'.'+i));
  else if(value && typeof value==='object') for(const [key,item] of Object.entries(value)) auditData(item,path+'.'+key);
}
test('all cat fields, FAQ answers, rules, events, carousel labels and alt text have all languages',()=>{
  auditData({catProfiles,cats,rules,faqItems,events,menuSlides});
});
test('every literal translation call has complete translations',()=>{
  const files=['App.jsx','AdminPage.jsx','MenuPage.jsx','CatProfilePage.jsx','BookingModal.jsx','SupportModal.jsx','LanguageSelect.jsx','src/AppRoutes.jsx','src/pages/NotFoundPage.jsx','src/components/ErrorBoundary.jsx'];
  const missing=[];
  const traverse=traverseModule.default || traverseModule;
  for(const file of files) {
    const ast=parse(fs.readFileSync(file,'utf8'),{sourceType:'module',plugins:['jsx']});
    traverse(ast,{CallExpression(p){
      if(p.node.callee.name==='tr' && p.node.arguments[0]?.type==='StringLiteral') {
        const source=p.node.arguments[0].value;
        for(const locale of locales) if(!messages[source]?.[locale])missing.push(locale+': '+source);
      }
    }});
  }
  assert.deepEqual([...new Set(missing)],[]);
});
for(const locale of locales) for(const path of ['/','/menu','/menu/','/koty/luna','/koty/mochi/','/koty/pixel','/admin','/missing','/koty/unknown','/koty/constructor','/koty/__proto__']) {
  test(locale+' renders '+path+' with no untranslated source text',()=>{
    const html=render(<AppRoutes/>,locale,path).replace(/<option\b[^>]*>/g,'<option>');
    assert.ok(html.length>500 && html.includes('<h1'), 'Non-empty page');
    const leaks=Object.entries(messages).filter(([source, entry])=>source.length>16 && entry[locale] && source!==entry[locale] && html.includes(source)).map(([source])=>source);
    assert.deepEqual(leaks,[]);
  });
}
for(const locale of locales) {
  test(locale+' booking and support dialogs render with localized accessible labels',()=>{
    for(const node of [<BookingModal open onClose={()=>{}}/>,<SupportModal open onClose={()=>{}}/>]) {
      const html=render(node,locale);
      assert.ok(html.includes('role="dialog"') && html.includes('aria-modal="true"'));
      const leaks=Object.entries(messages).filter(([source,entry])=>source.length>16 && entry[locale] && source!==entry[locale] && html.includes(source)).map(([source])=>source);
      assert.deepEqual(leaks,[]);
    }
  });
}
test('normalizes language and rejects prototype cat routes',()=>{
  assert.equal(normalizeLanguage('de'),'pl'); assert.equal(normalizeLanguage(null),'pl');
  for(const slug of ['unknown','__proto__','constructor','toString',null])assert.equal(isCatSlug(slug),false);
  for(const slug of ['luna','mochi','pixel'])assert.equal(isCatSlug(slug),true);
  assert.equal(normalizePath('/menu/'),'/menu');assert.equal(normalizePath('/'),'/');
});
test('translation interpolates named fields and preserves unknown user text',()=>{
  assert.equal(translate('Kot {name}','en',{name:'Luna'}),'Luna the cat');
  assert.equal(translate('Custom draft title','ru'),'Custom draft title');
});
test('booking rejects Mondays, invalid dates, past days and past times in Warsaw',()=>{
  const now=new Date('2026-09-06T14:00:00Z');
  assert.equal(warsawTime(now).time,'16:00');
  assert.deepEqual(getBookingTimes('2026-09-07',now),[]);
  assert.deepEqual(getBookingTimes('2026-09-05',now),[]);
  assert.deepEqual(getBookingTimes('2026-02-30',now),[]);
  assert.deepEqual(getBookingTimes('',now),[]);
  assert.deepEqual(getBookingTimes('2026-09-06',now),['17:00','18:30']);
  assert.equal(getBookingTimes('2026-09-08',now).includes('10:00'),false);
  assert.equal(getBookingTimes('2026-09-12',now).includes('10:00'),true);
});
test('event booking retains event times and recurrence',()=>{
 const now=new Date('2026-09-06T14:00:00Z');
 assert.deepEqual(getBookingTimes('2026-09-13',now,0),['10:00']);
 assert.deepEqual(getBookingTimes('2026-09-12',now,0),[]);
 assert.deepEqual(getBookingTimes('2026-09-11',now,1),['18:00']);
 assert.deepEqual(getBookingTimes('2026-09-12',now,2),['12:00']);
 assert.deepEqual(getBookingTimes('2026-09-19',now,2),[]);
 assert.deepEqual(getBookingTimes('2026-10-04',now,3),['12:00']);
});
test('corrupt admin data cannot crash the editor and numeric validation works',()=>{
 for(const input of [null,[],{}, {schedule:null, prices:'bad',events:[null],cats:42, availability:null}]) {
  const data=normalizeAdminData(input);
  assert.ok(Array.isArray(data.schedule)&&Array.isArray(data.prices)&&Array.isArray(data.cats)&&data.availability.status);
 }
 const data=normalizeAdminData(null);
 assert.equal(validAdminData(data),true);
 data.prices[0].price='-1 zł'; assert.equal(validAdminData(data),false);
 data.prices[0].price='10.50 zł'; data.events[0].places='-1'; assert.equal(validAdminData(data),false);
 data.events[0].places='12'; assert.equal(validAdminData(data),true);
});
test('cat-of-day and visit follow the cat cards in the actual DOM order',()=>{
 const html=render(<AppRoutes/>,'pl');
 const ids=['cats','cat-of-day','visit','menu','rules','support','events'].map(id=>html.indexOf('id="'+id+'"'));
 assert.ok(ids.every((position,i)=>position>=0 && (!i || position>ids[i-1])));
});

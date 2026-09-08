import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultData, normalizeAdminData, textFor } from '../data/adminData.js';
import { useLanguage } from '../i18n/LanguageProvider.jsx';

const SiteContentContext=createContext(null);
export function SiteContentProvider({children,initialData}){
  const {language}=useLanguage();
  const [data,setData]=useState(()=>normalizeAdminData(initialData||defaultData));
  const [loading,setLoading]=useState(!initialData);
  useEffect(()=>{
    if(initialData)return;
    const controller=new AbortController();
    fetch('/api/content',{signal:controller.signal,headers:{Accept:'application/json'}})
      .then(response=>response.ok?response.json():Promise.reject(new Error('content unavailable')))
      .then(body=>setData(normalizeAdminData(body.data)))
      .catch(()=>{})
      .finally(()=>setLoading(false));
    return()=>controller.abort();
  },[initialData]);
  const value=useMemo(()=>({data,loading,text:value=>textFor(value,language)}),[data,language,loading]);
  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}
export function useSiteContent(){const value=useContext(SiteContentContext);if(!value)throw new Error('SiteContentProvider is required');return value;}

import React from 'react'

export default function InfoRow({ icon: Icon, title, text }) {
  return <div className="flex gap-4"><Icon className="mt-1 shrink-0 text-sky-500"/><div><p className="font-extrabold">{title}</p><p className="text-sm text-slate-500">{text}</p></div></div>;
}

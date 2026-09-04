import { useEffect, useRef } from 'react'
import Button from './Button'
export default function LeadPopup({open,onClose,onSubmit}){
 const ref=useRef(null)
 useEffect(()=>{if(open) setTimeout(()=>ref.current?.focus(),50)},[open])
 if(!open) return null
 return <div className="fixed inset-0 z-[2000] grid place-items-center p-5" role="presentation"><button aria-label="Đóng popup" className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose}/><div role="dialog" aria-modal="true" aria-labelledby="lead-title" className="relative z-10 w-full max-w-[520px] rounded-3xl bg-imperia-cream p-8 shadow-2xl md:p-12"><button onClick={onClose} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-imperia-primary/15 bg-white text-2xl text-imperia-primary">×</button><div className="eyebrow">Imperia Sensa Park</div><h2 id="lead-title" className="section-title text-4xl">Nhận thông tin dự án</h2><p className="mt-3 text-sm text-[#6c6e65]">Để lại thông tin để nhận bảng giá, mặt bằng và chính sách mới nhất.</p><form onSubmit={onSubmit} className="mt-6 grid gap-3"><input ref={ref} required className="rounded-xl border border-imperia-primary/15 bg-white px-4 py-3 text-sm outline-none focus:border-imperia-primary" placeholder="Họ và tên *"/><input required type="tel" className="rounded-xl border border-imperia-primary/15 bg-white px-4 py-3 text-sm outline-none focus:border-imperia-primary" placeholder="Số điện thoại *"/><Button type="submit">Nhận thông tin</Button></form></div></div>
}

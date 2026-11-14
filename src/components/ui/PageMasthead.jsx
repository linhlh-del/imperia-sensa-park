import { Link } from "react-router-dom";
import Image from "./Image";
export default function PageMasthead({title, label, intro=[], image='/assets/overview.webp', alt='Imperia Sensa Park', action, onLead}) {
 return <section className="park-page-masthead"><div className="container-page park-page-grid"><div className="park-page-copy"><nav aria-label="Breadcrumb" className="park-eyebrow"><Link to="/">Trang chủ</Link><span> / </span><span aria-current="page">{label}</span></nav><h1>{title}</h1>{intro.map(p=><p key={p}>{p}</p>)}<div className="park-actions">{action&&<a href={action.href} className="btn-base btn-light">{action.label} ↓</a>}{onLead&&<button className="btn-base btn-outline-light" onClick={onLead}>Nhận tư vấn</button>}</div></div><figure className={/\/layout\//.test(image)?'is-plan':undefined}><Image src={image} alt={alt} fetchPriority="high"/><figcaption>IMPERIA SENSA PARK / {label}</figcaption></figure></div></section>;
}

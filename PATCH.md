# Hiệu ứng đếm số + fade-in khi cuộn — 4 chỗ sửa nhỏ

Copy thư mục `src/` trong gói này vào dự án (thêm 4 file mới), sau đó sửa đúng 4 file dưới đây.

## 1) src/App.jsx
```jsx
import ScrollEffects from "./components/effects/ScrollEffects";
...
return (
  <>
    <RouteSeo />
    <ScrollEffects />   {/* <-- thêm dòng này */}
    <Routes>
```

## 2) src/components/sections/Hero.jsx
```jsx
import CountUp from "../effects/CountUp";
...
<div className="font-display text-3xl md:text-4xl">
  <CountUp value={number} />      {/* thay cho {number} */}
  <small className="ml-1 text-base text-imperia-accent">{suffix}</small>
</div>
```

## 3) src/components/sections/Overview.jsx
```jsx
import CountUp from "../effects/CountUp";
...
<strong className="font-display text-3xl text-imperia-primary">
  <CountUp value={n} />           {/* thay cho {n} */}
</strong>
```

## 4) src/components/sections/Location.jsx
```jsx
import CountUp from "../effects/CountUp";
...
<strong className="min-w-20 font-display text-3xl text-imperia-accent">
  <CountUp value={time} />        {/* thay cho {time} */}
</strong>
```

Tuỳ chỉnh: `<CountUp value="5.000" duration={2000} delay={200} />`

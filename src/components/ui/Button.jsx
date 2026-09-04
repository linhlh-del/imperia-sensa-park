export default function Button({ children, variant = 'primary', href, onClick, type = 'button', className = '' }) {
  const variantClass = {
    primary: 'btn-primary', light: 'btn-light', outlineLight: 'btn-outline-light', outline: 'btn-outline',
  }[variant]
  const classes = `btn-base ${variantClass} ${className}`
  if (href) return <a className={classes} href={href}>{children}</a>
  return <button className={classes} type={type} onClick={onClick}>{children}</button>
}

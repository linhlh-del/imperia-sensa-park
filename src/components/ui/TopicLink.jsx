import { Link, useLocation } from 'react-router-dom';
export default function TopicLink({ to, children, light = false }) {
  const { pathname } = useLocation();
  if (pathname === to) return null;
  return <Link to={to} className={`topic-link btn-base mt-4 ${light ? 'btn-outline-light' : 'btn-outline'}`}>{children} →</Link>;
}

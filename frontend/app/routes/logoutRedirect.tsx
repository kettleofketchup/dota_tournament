import { redirect } from 'react-router-dom';

export function loader() {
  return redirect('/');
}
export default function redirecter() {
  return null; // This component will never render, as the loader handles the redirect
}

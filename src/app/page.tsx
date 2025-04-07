import { redirect } from 'next/navigation';
import { withLogger } from 'lib/logger';
export default function Home({}) {
  withLogger();
  redirect('/admin/default');
}

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import getAccessToken from '@/utils/paypal';
import { Button } from '@nextui-org/button';
import Link from 'next/link';

function Feature({ name }: { name: string }) {
  return (
    <li className="flex items-center gap-5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-indigo-600"
        viewBox="0 0 20 20"
        fill="#DBBFFF"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
      <span>{name}</span>
    </li>
  );
}

function Features({ names }: { names: string[] }) {
  return (
    <ul>
      {names.map((name) => (
        <Feature key={name} name={name} />
      ))}
    </ul>
  );
}

export default async function Plans() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  const starter = ['Flowmodoro Timer', 'Task List'];
  const pro = [
    'Everything in Starter',
    'Custom Break Ratio',
    'Historical Statistics',
    'Priority Support',
  ];

  const accessToken = await getAccessToken();
  console.log(accessToken);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('user', user);

  const { data: plan } = await supabase
    .from('plans')
    .select('subscription_id')
    .eq('user_id', user?.id)
    .single();

  const id = plan?.subscription_id;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PAYPAL_API_URL}/billing/subscriptions/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
  const data = await response.json();
  console.log(data);

  return (
    <div className="mt-32 flex w-screen flex-col items-center justify-center gap-10 sm:flex-row sm:items-stretch">
      <div className="flex w-[90%] flex-col gap-10 rounded-xl bg-[#23223C] p-10 sm:w-2/5 lg:w-1/3">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl">Starter</h2>
          <div className="flex items-end gap-1">
            <h2 className="text-4xl font-semibold">$0</h2>
            <div className="text-sm opacity-50">/ month</div>
          </div>
        </div>
        <Button
          isDisabled={data.status !== 'ACTIVE'}
          color="primary"
          radius="sm"
          className="font-semibold text-[#23223C]"
        >
          {data.status === 'ACTIVE' ? 'Downgrade to Starter' : 'Current plan'}
        </Button>
        <Features names={starter} />
      </div>
      <div className="flex w-[90%] flex-col gap-10 rounded-xl bg-[#23223C] p-10 sm:w-2/5 lg:w-1/3">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl">Pro</h2>
          <div className="flex items-end gap-1">
            <h2 className="text-4xl font-semibold">$5</h2>
            <div className="text-sm opacity-50">/ month</div>
          </div>
        </div>
        <Button
          isDisabled={data.status === 'ACTIVE'}
          as={Link}
          href="/plans/upgrade"
          color="primary"
          radius="sm"
          className="font-semibold text-[#23223C]"
        >
          {data.status === 'ACTIVE' ? 'Current plan' : 'Upgrade to Pro'}
        </Button>
        <Features names={pro} />
      </div>
    </div>
  );
}

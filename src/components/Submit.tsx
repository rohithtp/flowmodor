'use client';

import { Button } from '@nextui-org/button';
import { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

export default function Submit({
  children,
  isDisabled,
}: {
  children: ReactNode;
  isDisabled?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      color="primary"
      radius="sm"
      isDisabled={isDisabled}
      isLoading={pending}
    >
      {children}
    </Button>
  );
}

Submit.defaultProps = {
  isDisabled: false,
};

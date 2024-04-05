'use client';

import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { updateOptions } from '@/actions/settings';

export default function Options({
  isPro,
  defaultBreakRatio,
}: {
  isPro: boolean;
  defaultBreakRatio: number;
}) {
  const [breakRatio, setBreakRatio] = useState(defaultBreakRatio);
  const [isLoading, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Options</h2>
        <Chip as={Link} size="sm" radius="sm" color="primary" href="/plans">
          Pro
        </Chip>
      </div>
      <Input
        isDisabled={!isPro}
        label="Break ratio"
        labelPlacement="outside"
        placeholder="5"
        variant="bordered"
        description="Your break time will be your focus time divided by this number."
        radius="sm"
        type="number"
        value={breakRatio.toString()}
        onValueChange={(value) =>
          setBreakRatio(value === '' ? 0 : parseInt(value, 10))
        }
        classNames={{
          input: 'text-[16px]',
          inputWrapper:
            'border-secondary data-[hover=true]:border-secondary data-[focus=true]:!border-primary',
        }}
      />
      <div className="flex">
        <Button
          color="primary"
          radius="sm"
          className="ml-auto mt-2"
          isDisabled={!isPro || breakRatio <= 0}
          isLoading={isLoading}
          onPress={() => {
            startTransition(async () => {
              const { error } = await updateOptions(breakRatio);

              if (error) {
                toast.error(error.message);
              } else {
                toast.success('Settings updated successfully!');
              }
            });
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

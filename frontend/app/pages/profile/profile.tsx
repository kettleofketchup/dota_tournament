import React, { useEffect } from 'react';
import type { UserType } from '~/components/user';
import { useUserStore } from '~/store/userStore';

import { useState } from 'react';

import { Select, SelectTrigger, SelectValue } from '~/components/ui/select';
import { positionChoices } from '~/components/user/positions/positionEdit';
import { getLogger } from '~/lib/logger';
const log = getLogger('Position Edit');

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { UserSchema } from '~/components/user/user';

export const ProfilePage: React.FC = () => {
  const currentUser = useUserStore((state) => state.currentUser);

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      positions: {
        ...currentUser?.positions,
      },
    },
  });

  const [errorMessage, setErrorMessage] = useState<
    Partial<Record<keyof UserType, string>>
  >({});

  const initialiazeForm = () => {
    if (currentUser == null || currentUser == undefined) return;

    form.setValue('positions.carry', currentUser?.positions?.carry || 0);
    form.setValue('positions.mid', currentUser?.positions?.mid || 0);
    form.setValue('positions.offlane', currentUser?.positions?.offlane || 0);
    form.setValue(
      'positions.soft_support',
      currentUser?.positions?.soft_support || 0,
    );
    form.setValue(
      'positions.hard_support',
      currentUser?.positions?.hard_support || 0,
    );
    log.debug('Form initialized with values:', form.getValues());
    log.debug(currentUser);
  };

  useEffect(() => {
    initialiazeForm();
  }, []);
  useEffect(() => {
    initialiazeForm();
  }, [currentUser, form]);
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        Not logged in
      </div>
    );
  }

  function onSubmit(data: z.infer<typeof UserSchema>) {
    toast('You submitted the following values', {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div>
      <h1>{currentUser.username}'s Profile</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="positions.carry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carry</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={field.value?.toString()} />
                    </SelectTrigger>
                  </FormControl>
                  {positionChoices()}
                </Select>
                <FormDescription>
                  You can manage email addresses in your{' '}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="positions.middle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={field.value?.toString()} />
                    </SelectTrigger>
                  </FormControl>
                  {positionChoices()}
                </Select>
                <FormDescription>Middle Lane</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

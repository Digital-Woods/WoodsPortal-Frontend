import { createFileRoute } from "@tanstack/react-router"
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Form, FormItem, FormLabel, FormControl, Input, FormMessage } from '@/components/ui/Form'
import { Client } from '@/data/client/index'
import { Button } from '@/components/ui/Button'
import { z } from 'zod';

const registerUserValidationSchema = z.object({
  name: z.string().min(4, {
    message: "Name must be at least 4 characters.",
  }),
  email: z.string().email(),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
});

const Register = () => {
  let [serverError, setServerError] = useState(null);

  const { mutate: addUser, isLoading } = useMutation({
    mutationKey: ["registerUser"],
    mutationFn: async (input) => await Client.authentication.register(input),
    onSuccess: (_data) => {
    },
    onError: (error: any) => {
      setServerError(error?.response?.data);
    },
  });

  const onSubmit = (data: any) => {
    addUser(data);
  };

  return (
    <div className="bg-light-100 dark:bg-dark-200 p-5">
      <Form
        onSubmit={onSubmit}
        validationSchema={registerUserValidationSchema}
        serverError={serverError}
        className="bg-light-100 dark:bg-dark-200"
      >
        {({ register, formState: { errors } }: any) => (
          <div>
            <div className="text-dark dark:text-white">
              <div className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                Register
              </div>
              <p className="mt-1 text-sm leading-6 text-gray-600  dark:text-white">
                Use a permanent address where you can receive mail.
              </p>

              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...register("name")} />
                </FormControl>
                {errors?.name && (
                  <FormMessage className="text-red-600">
                    {errors?.name?.message}
                  </FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...register("email")} />
                </FormControl>
                {errors?.email && (
                  <FormMessage className="text-red-600">
                    {errors?.email?.message}
                  </FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...register("password")} />
                </FormControl>
                {errors?.password && (
                  <FormMessage className="text-red-600">
                    {errors?.password?.message}
                  </FormMessage>
                )}
              </FormItem>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Button href="/home">Home</Button>
              <Button type="submit" isLoading={isLoading}>
                Submit
              </Button>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};

export default Register

export const Route = createFileRoute('/_auth/Register')({
  component: Register,
  beforeLoad: () => {
    return {
      layout: "AuthLayout",
      requiresAuth: false,
    }
  },
})
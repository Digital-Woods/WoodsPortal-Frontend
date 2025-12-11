import { useNavigate } from '@tanstack/react-router';
import { Routes } from '@/config/routes';
import { Button } from './ui/Button';

export default function ExpireSession({title, errorMessage}: any) {
  const navigate = useNavigate();

  return (
    <div className="text-center p-4 dark:text-white">
      <h1 className="text-xl font-bold mb-4">{title}</h1>
      <p className="text-md text-muted-gray">
        {errorMessage}
      </p>
      <Button
        className="w-full my-6"
        onClick={() => navigate({ to: Routes.login })}
      >
        Go to Login
      </Button>
    </div>
  )
}


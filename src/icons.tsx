import {
  Store,
  Home,
  LogIn,
  LogOut,
  Plus,
  User,
  X,
  Loader,
  ShoppingCart,
  Book,
  Bot,
  Heart
} from 'lucide-react';

export type IconProps = React.ComponentProps<'svg'>;

export const Icons = {
  Store,
  Home,
  LogIn,
  LogOut,
  Plus,
  User,
  X,
  Loader,
  ShoppingCart,
  Book,
  Bot,
  Heart,
  Star: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
  ),
  Money: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M14.5 9h-2.5a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2.5" />
      <path d="M12 7v2" />
      <path d="M12 15v2" />
    </svg>
  ),
  Dance: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 12a4 4 0 1 0 8 0" />
      <path d="M12 4v4" />
      <path d="M4 16l4-4" />
      <path d="M16 16l4-4" />
    </svg>
  )
};
